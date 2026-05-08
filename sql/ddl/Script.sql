-- TDJMap application schema.
-- This DDL reflects the currently connected PostgreSQL/PostGIS database
-- in schema `tandanji`.

CREATE SCHEMA IF NOT EXISTS tandanji;
SET search_path TO tandanji;

-- 1. Users
CREATE TABLE users (
    user_id    BIGSERIAL PRIMARY KEY,
    email      VARCHAR(255),
    nickname   VARCHAR(255),
    height     BIGINT,
    weight     BIGINT,
    gender     VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role       VARCHAR(10) NOT NULL DEFAULT 'USER'
);

-- 2. Social login accounts
CREATE TABLE social_logins (
    social_id     BIGSERIAL PRIMARY KEY,
    user_id       BIGINT      NOT NULL,
    provider      VARCHAR(20) NOT NULL,
    provider_id   VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    profile_data  JSONB       NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 3. Brands
CREATE TABLE brands (
    brand_id   BIGSERIAL PRIMARY KEY,
    brand_name VARCHAR(255),
    logo_url   VARCHAR(255)
);

-- 4. Stores
CREATE TABLE stores (
    store_id   BIGSERIAL PRIMARY KEY,
    brand_id   BIGINT,
    store_name VARCHAR(255),
    address    VARCHAR(255),
    longitude  DECIMAL(11,7) NOT NULL,
    latitude   DECIMAL(10,7) NOT NULL,
    category   VARCHAR(255),
    image_url  VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

CREATE INDEX idx_stores_location ON stores (latitude, longitude);

-- 5. Menus and nutrition metadata
CREATE TABLE menus (
    menu_id     BIGSERIAL PRIMARY KEY,
    brand_id    BIGINT,
    store_id    BIGINT,
    menu_name   VARCHAR(255) NOT NULL,
    kcal        BIGINT,
    carbs       BIGINT,
    protein     BIGINT,
    fat         BIGINT,
    sugar       BIGINT,
    menu_url    VARCHAR(255),
    is_standard BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
    FOREIGN KEY (store_id) REFERENCES stores(store_id),
    CONSTRAINT chk_menu_mapping CHECK (
        brand_id IS NOT NULL OR is_standard = TRUE
    )
);

-- 6. Diet logs
CREATE TABLE diet_logs (
    log_id      BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    menu_id     BIGINT,
    store_id    BIGINT,
    log_kcal    BIGINT,
    log_carbs   BIGINT,
    log_protein BIGINT,
    log_fat     BIGINT,
    log_sugar   BIGINT,
    img_url     VARCHAR(255),
    meal_type   VARCHAR(20),
    ate_at      TIMESTAMP NOT NULL,
    food_name   VARCHAR(255),
    FOREIGN KEY (user_id)  REFERENCES users(user_id),
    FOREIGN KEY (menu_id)  REFERENCES menus(menu_id),
    FOREIGN KEY (store_id) REFERENCES stores(store_id),
    CONSTRAINT chk_diet_logs_name CHECK (
        menu_id IS NOT NULL OR food_name IS NOT NULL
    )
);

-- 7. Exercise type master data
CREATE TABLE exercise_types (
    type_id   BIGSERIAL PRIMARY KEY,
    type_name VARCHAR(255) NOT NULL,
    met_value DECIMAL(4,2) NOT NULL,
    icon_url  VARCHAR(255)
);

-- 8. Exercise logs
CREATE TABLE exercise_logs (
    exercise_id     BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    type_id         BIGINT NOT NULL,
    title           VARCHAR(255),
    duration_min    BIGINT NOT NULL,
    calories_burned BIGINT NOT NULL,
    memo            TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (type_id) REFERENCES exercise_types(type_id)
);

-- 9. Store reviews
CREATE TABLE reviews (
    review_id  BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    store_id   BIGINT NOT NULL,
    star       SMALLINT NOT NULL CHECK (star BETWEEN 1 AND 5),
    content    TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)  REFERENCES users(user_id),
    FOREIGN KEY (store_id) REFERENCES stores(store_id)
);

-- 10. Community posts
CREATE TABLE posts (
    post_id    BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    post_type  VARCHAR(50),
    title      VARCHAR(255),
    content    TEXT,
    image_url  VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 11. Post likes
CREATE TABLE post_likes (
    like_id    BIGSERIAL PRIMARY KEY,
    post_id    BIGINT NOT NULL,
    user_id    BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT uk_post_likes_post_user UNIQUE (post_id, user_id)
);

-- 12. Nutrition correction reports
CREATE TABLE reports (
    report_id   BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    brand_id    BIGINT,
    menu_name   VARCHAR(255) NOT NULL,
    kcal        BIGINT,
    carbs       BIGINT,
    protein     BIGINT,
    fat         BIGINT,
    sugar       BIGINT,
    status      VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    store_name  VARCHAR(255),
    image_url   VARCHAR(500),
    FOREIGN KEY (user_id)  REFERENCES users(user_id),
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

CREATE OR REPLACE FUNCTION tandanji.analyze_nutrition(
    carbs   BIGINT,
    protein BIGINT,
    fat     BIGINT
) RETURNS jsonb AS $$
DECLARE
    total   NUMERIC;
    c_ratio NUMERIC;
    p_ratio NUMERIC;
    f_ratio NUMERIC;
    grade   VARCHAR;
    tags    TEXT[] := '{}';
BEGIN
    IF carbs IS NULL OR protein IS NULL OR fat IS NULL THEN
        RETURN null;
    END IF;

    total := carbs + protein + fat;
    IF total = 0 THEN
        RETURN null;
    END IF;

    c_ratio := carbs   / total * 100;
    p_ratio := protein / total * 100;
    f_ratio := fat     / total * 100;

    -- Tags are aligned with the RED-grade threshold policy.
    IF c_ratio >= 60 THEN
        tags := array_append(tags, '고탄수');
    END IF;
    IF c_ratio < 20 THEN
        tags := array_append(tags, '저탄수');
    END IF;
    IF p_ratio >= 40 THEN
        tags := array_append(tags, '고단백');
    END IF;
    IF f_ratio >= 35 THEN
        tags := array_append(tags, '고지방');
    END IF;

    IF c_ratio BETWEEN 35 AND 55
       AND p_ratio >= 30
       AND f_ratio < 25
    THEN
        grade := 'GREEN';
    ELSIF c_ratio >= 65
       OR f_ratio >= 35
       OR p_ratio < 10
    THEN
        grade := 'RED';
    ELSE
        grade := 'YELLOW';
    END IF;

    RETURN jsonb_build_object('grade', grade, 'tags', tags);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

ALTER TABLE menus
ADD COLUMN nutrition_info JSONB
    GENERATED ALWAYS AS (
        tandanji.analyze_nutrition(carbs, protein, fat)
    ) STORED;

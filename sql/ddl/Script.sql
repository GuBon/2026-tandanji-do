-- TDJMap 스키마 DDL
-- PostgreSQL 17 + PostGIS 3.5
-- 갱신일: 2026-05-14

-- ============================================================
-- 0. 스키마 / 익스텐션 / 함수
-- ============================================================

CREATE SCHEMA IF NOT EXISTS tandanji;
SET search_path TO tandanji, public;

CREATE EXTENSION IF NOT EXISTS postgis  SCHEMA tandanji;
CREATE EXTENSION IF NOT EXISTS pg_trgm  SCHEMA tandanji;

CREATE OR REPLACE FUNCTION tandanji.analyze_nutrition(
    carbs   BIGINT,
    protein BIGINT,
    fat     BIGINT
) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
AS $$
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
    IF total = 0 THEN RETURN null; END IF;

    c_ratio := carbs   / total * 100;
    p_ratio := protein / total * 100;
    f_ratio := fat     / total * 100;

    IF c_ratio >= 60 THEN tags := array_append(tags, '고탄수'); END IF;
    IF c_ratio <  20 THEN tags := array_append(tags, '저탄수'); END IF;
    IF p_ratio >= 40 THEN tags := array_append(tags, '고단백'); END IF;
    IF f_ratio >= 35 THEN tags := array_append(tags, '고지방'); END IF;

    IF    c_ratio BETWEEN 35 AND 55 AND p_ratio >= 30 AND f_ratio < 25 THEN grade := 'GREEN';
    ELSIF c_ratio >= 65 OR f_ratio >= 35 OR p_ratio < 10               THEN grade := 'RED';
    ELSE                                                                     grade := 'YELLOW';
    END IF;

    RETURN jsonb_build_object('grade', grade, 'tags', tags);
END;
$$;

-- ============================================================
-- 1. users
-- ============================================================

CREATE TABLE tandanji.users (
    user_id    BIGSERIAL PRIMARY KEY,
    email      VARCHAR(255),
    nickname   VARCHAR(255),
    height     BIGINT,
    weight     BIGINT,
    gender     VARCHAR(10),
    age        INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role       VARCHAR(10) NOT NULL DEFAULT 'USER'
);

-- ============================================================
-- 2. social_logins
-- ============================================================

CREATE TABLE tandanji.social_logins (
    social_id     BIGSERIAL PRIMARY KEY,
    user_id       BIGINT       NOT NULL,
    provider      VARCHAR(20)  NOT NULL,
    provider_id   VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    profile_data  JSONB        NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES tandanji.users(user_id)
);

-- ============================================================
-- 3. brands
-- ============================================================

CREATE TABLE tandanji.brands (
    brand_id   BIGSERIAL PRIMARY KEY,
    brand_name VARCHAR(255),
    logo_url   VARCHAR(255)
);

-- ============================================================
-- 4. stores
-- ============================================================

CREATE TABLE tandanji.stores (
    store_id   BIGSERIAL PRIMARY KEY,
    brand_id   BIGINT,
    store_name VARCHAR(255),
    address    VARCHAR(255),
    longitude  NUMERIC(11,7) NOT NULL,
    latitude   NUMERIC(10,7) NOT NULL,
    category   VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url  VARCHAR(500),
    FOREIGN KEY (brand_id) REFERENCES tandanji.brands(brand_id)
);

-- ============================================================
-- 5. menus  (nutrition_info: GENERATED ALWAYS AS STORED)
-- ============================================================

CREATE TABLE tandanji.menus (
    menu_id        BIGSERIAL PRIMARY KEY,
    brand_id       BIGINT,
    store_id       BIGINT,
    menu_name      VARCHAR(255) NOT NULL,
    kcal           BIGINT,
    carbs          BIGINT,
    protein        BIGINT,
    fat            BIGINT,
    sugar          BIGINT,
    menu_url       VARCHAR(255),
    is_standard    BOOLEAN DEFAULT FALSE,
    nutrition_info JSONB GENERATED ALWAYS AS (
                       tandanji.analyze_nutrition(carbs, protein, fat)
                   ) STORED,
    FOREIGN KEY (brand_id) REFERENCES tandanji.brands(brand_id),
    FOREIGN KEY (store_id) REFERENCES tandanji.stores(store_id),
    CONSTRAINT chk_menu_mapping CHECK (brand_id IS NOT NULL OR is_standard = TRUE)
);

-- ============================================================
-- 6. diet_logs
-- ============================================================

CREATE TABLE tandanji.diet_logs (
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
    FOREIGN KEY (user_id)  REFERENCES tandanji.users(user_id),
    FOREIGN KEY (menu_id)  REFERENCES tandanji.menus(menu_id),
    FOREIGN KEY (store_id) REFERENCES tandanji.stores(store_id),
    CONSTRAINT chk_diet_logs_name CHECK (menu_id IS NOT NULL OR food_name IS NOT NULL)
);

-- ============================================================
-- 7. exercise_types
-- ============================================================

CREATE TABLE tandanji.exercise_types (
    type_id   BIGSERIAL PRIMARY KEY,
    type_name VARCHAR(255)  NOT NULL,
    met_value NUMERIC(4,2)  NOT NULL,
    icon_url  VARCHAR(255)
);

-- ============================================================
-- 8. exercise_logs
-- ============================================================

CREATE TABLE tandanji.exercise_logs (
    exercise_id     BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    type_id         BIGINT NOT NULL,
    title           VARCHAR(255),
    duration_min    BIGINT NOT NULL,
    calories_burned BIGINT NOT NULL,
    memo            TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES tandanji.users(user_id),
    FOREIGN KEY (type_id) REFERENCES tandanji.exercise_types(type_id)
);

-- ============================================================
-- 9. reviews
-- ============================================================

CREATE TABLE tandanji.reviews (
    review_id  BIGSERIAL PRIMARY KEY,
    user_id    BIGINT   NOT NULL,
    store_id   BIGINT   NOT NULL,
    star       SMALLINT NOT NULL CHECK (star BETWEEN 1 AND 5),
    content    TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)  REFERENCES tandanji.users(user_id),
    FOREIGN KEY (store_id) REFERENCES tandanji.stores(store_id)
);

-- ============================================================
-- 10. review_likes
-- ============================================================

CREATE TABLE tandanji.review_likes (
    like_id    BIGSERIAL PRIMARY KEY,
    review_id  BIGINT NOT NULL,
    user_id    BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES tandanji.reviews(review_id),
    FOREIGN KEY (user_id)   REFERENCES tandanji.users(user_id),
    CONSTRAINT uk_review_likes_review_user UNIQUE (review_id, user_id)
);

-- ============================================================
-- 11. posts
-- ============================================================

CREATE TABLE tandanji.posts (
    post_id    BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    post_type  VARCHAR(50),
    title      VARCHAR(255),
    content    TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url  VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES tandanji.users(user_id)
);

-- ============================================================
-- 12. post_likes
-- ============================================================

CREATE TABLE tandanji.post_likes (
    like_id    BIGSERIAL PRIMARY KEY,
    post_id    BIGINT NOT NULL,
    user_id    BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES tandanji.posts(post_id),
    FOREIGN KEY (user_id) REFERENCES tandanji.users(user_id),
    CONSTRAINT uk_post_likes_post_user UNIQUE (post_id, user_id)
);

-- ============================================================
-- 13. post_comments
-- ============================================================

CREATE TABLE tandanji.post_comments (
    id         BIGSERIAL PRIMARY KEY,
    post_id    BIGINT NOT NULL,
    user_id    BIGINT NOT NULL,
    content    TEXT   NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY (post_id) REFERENCES tandanji.posts(post_id)    ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES tandanji.users(user_id)    ON DELETE CASCADE
);

-- ============================================================
-- 14. reports
-- ============================================================

CREATE TABLE tandanji.reports (
    report_id     BIGSERIAL PRIMARY KEY,
    user_id       BIGINT       NOT NULL,
    brand_id      BIGINT,
    store_id      BIGINT,
    menu_id       BIGINT,
    menu_name     VARCHAR(255) NOT NULL,
    kcal          BIGINT,
    carbs         BIGINT,
    protein       BIGINT,
    fat           BIGINT,
    sugar         BIGINT,
    status        VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    store_name    VARCHAR(255),
    image_url     VARCHAR(500),
    store_address VARCHAR(500),
    store_lat     DOUBLE PRECISION,
    store_lon     DOUBLE PRECISION,
    FOREIGN KEY (user_id)  REFERENCES tandanji.users(user_id),
    FOREIGN KEY (brand_id) REFERENCES tandanji.brands(brand_id),
    FOREIGN KEY (store_id) REFERENCES tandanji.stores(store_id),
    FOREIGN KEY (menu_id)  REFERENCES tandanji.menus(menu_id)
);

-- ============================================================
-- 15. report_votes
-- ============================================================

CREATE TABLE tandanji.report_votes (
    vote_id    BIGSERIAL PRIMARY KEY,
    report_id  BIGINT      NOT NULL,
    user_id    BIGINT      NOT NULL,
    vote_type  VARCHAR(4)  NOT NULL CHECK (vote_type IN ('UP', 'DOWN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rv_report FOREIGN KEY (report_id) REFERENCES tandanji.reports(report_id) ON DELETE CASCADE,
    CONSTRAINT fk_rv_user   FOREIGN KEY (user_id)   REFERENCES tandanji.users(user_id),
    CONSTRAINT uk_report_votes UNIQUE (report_id, user_id)
);

-- ============================================================
-- 16. weight_logs
-- ============================================================

CREATE TABLE tandanji.weight_logs (
    log_id      BIGSERIAL PRIMARY KEY,
    user_id     BIGINT         NOT NULL,
    weight_kg   NUMERIC(5, 1)  NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES tandanji.users(user_id)
);

-- ============================================================
-- 인덱스
-- ============================================================

-- 위치 기반 조회
CREATE INDEX idx_stores_location         ON tandanji.stores       USING btree (latitude, longitude);

-- 메뉴 조인 최적화
CREATE INDEX idx_menus_store_id     ON tandanji.menus  USING btree (store_id)  WHERE store_id IS NOT NULL;
CREATE INDEX idx_menus_brand_common ON tandanji.menus  USING btree (brand_id)  WHERE store_id IS NULL;

-- 키워드 유사 검색 (pg_trgm)
CREATE INDEX idx_stores_name_trgm  ON tandanji.stores USING gin (lower(store_name::text)                       tandanji.gin_trgm_ops);
CREATE INDEX idx_stores_addr_trgm  ON tandanji.stores USING gin (lower(COALESCE(address, '')::text)            tandanji.gin_trgm_ops);
CREATE INDEX idx_brands_name_trgm  ON tandanji.brands USING gin (lower(COALESCE(brand_name, '')::text)         tandanji.gin_trgm_ops);
CREATE INDEX idx_menus_name_trgm         ON tandanji.menus        USING gin (lower(menu_name::text)                        tandanji.gin_trgm_ops);

-- 댓글 조회 최적화
CREATE INDEX idx_post_comments_post_id   ON tandanji.post_comments USING btree (post_id);

-- 제보 조회 최적화
CREATE INDEX idx_reports_store_id        ON tandanji.reports      USING btree (store_id)  WHERE store_id IS NOT NULL;
CREATE INDEX idx_reports_menu_id         ON tandanji.reports      USING btree (menu_id)   WHERE menu_id  IS NOT NULL;
CREATE INDEX idx_reports_status          ON tandanji.reports      USING btree (status);
CREATE INDEX idx_report_votes_report_id  ON tandanji.report_votes USING btree (report_id);

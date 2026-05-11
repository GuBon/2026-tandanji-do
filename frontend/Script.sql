
-- 1. 사용자 테이블
CREATE TABLE users (
    user_id    BIGSERIAL    PRIMARY KEY,
    email      VARCHAR(255),
    nickname   VARCHAR(255),
    height     BIGINT,                          -- 단위: cm
    weight     BIGINT,                          -- 단위: kg (칼로리 연산에 사용)
    gender     VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 소셜 로그인 테이블 (리프레시 토큰 통합형)
CREATE TABLE social_logins (
    social_id     BIGSERIAL    PRIMARY KEY,
    user_id       BIGINT       NOT NULL,
    provider      VARCHAR(20)  NOT NULL,        -- 'KAKAO' 등
    provider_id   VARCHAR(255) NOT NULL,        -- 카카오 고유 번호
    refresh_token TEXT,                          -- 카카오 리프레시 토큰
    profile_data  JSONB        NOT NULL,         -- 카카오 프로필 원본 (JSONB: 인덱싱 가능)
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 3. 브랜드 테이블
CREATE TABLE brands (
    brand_id   BIGSERIAL    PRIMARY KEY,
    brand_name VARCHAR(255),
    logo_url   VARCHAR(255)
);

-- 4. 매장 테이블
-- longitude/latitude: DECIMAL(11,7) — GIS 범위 쿼리 및 넛지 알고리즘에 필수
CREATE TABLE stores (
    store_id   BIGSERIAL     PRIMARY KEY,
    brand_id   BIGINT,
    store_name VARCHAR(255),
    address    VARCHAR(255),
    longitude  DECIMAL(11,7) NOT NULL,          -- WGS84 경도 (EPSG:4326)
    latitude   DECIMAL(10,7) NOT NULL,          -- WGS84 위도 (EPSG:4326)
    category   VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

-- 좌표 기반 조회 성능을 위한 복합 인덱스
CREATE INDEX idx_stores_location ON stores (latitude, longitude);

-- 5. 메뉴 및 영양 정보 테이블
-- [Double Null 전략]
--   brand_id=값, store_id=NULL   → 브랜드 공통 메뉴 (예: 맥도날드 빅맥)
--   brand_id=값, store_id=값     → 특정 매장 전용 메뉴
--   brand_id=NULL, store_id=NULL → 표준 일반 식품 (is_standard=TRUE)
CREATE TABLE menus (
    menu_id     BIGSERIAL    PRIMARY KEY,
    brand_id    BIGINT,                          -- NULL 허용 (표준 식품일 때)
    store_id    BIGINT,                          -- NULL 허용 (브랜드 공통일 때)
    menu_name   VARCHAR(255) NOT NULL,
    kcal        BIGINT,
    carbs       BIGINT,                          -- 단위: g
    protein     BIGINT,                          -- 단위: g
    fat         BIGINT,                          -- 단위: g
    sugar       BIGINT,                          -- 단위: g
    menu_url	VARCHAR(255),					-- 음식 이미지
    is_standard BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
    FOREIGN KEY (store_id) REFERENCES stores(store_id),
    -- Double Null 무결성 제약
    CONSTRAINT chk_menu_mapping CHECK (
        brand_id IS NOT NULL OR is_standard = TRUE
    )
);

-- 6. 식단 기록 테이블 (Snapshot 전략)
-- 기록 시점의 영양 정보를 복사 → 메뉴 정보 변경돼도 과거 기록 무결성 유지
CREATE TABLE diet_logs (
    log_id      BIGSERIAL PRIMARY KEY,
    user_id     BIGINT    NOT NULL,
    menu_id     BIGINT,                          -- NULL 허용 (직접 입력 식단)
    store_id    BIGINT,
    -- Snapshot: 기록 시점의 영양 정보 복사본
    log_kcal    BIGINT,
    log_carbs   BIGINT,
    log_protein BIGINT,
    log_fat     BIGINT,
    log_sugar   BIGINT,
    img_url     VARCHAR(255),
    meal_type   VARCHAR(20),                     -- 'BREAKFAST','LUNCH','DINNER','SNACK'
    ate_at      TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id)  REFERENCES users(user_id),
    FOREIGN KEY (menu_id)  REFERENCES menus(menu_id),
    FOREIGN KEY (store_id) REFERENCES stores(store_id)
);

-- 7. 운동 종류 마스터 테이블
-- met_value: 칼로리 자동 연산에 필수
-- Energy(kcal) = MET × Weight(kg) × (Time(min)/60) × 1.05
CREATE TABLE exercise_types (
    type_id   BIGSERIAL    PRIMARY KEY,
    type_name VARCHAR(255) NOT NULL,
    met_value DECIMAL(4,2) NOT NULL,             -- 예: 달리기=8.0, 걷기=3.5
    icon_url  VARCHAR(255)
);

-- 8. 운동 기록 테이블
-- calories_burned 는 서버에서 MET 공식으로 자동 연산하여 저장
CREATE TABLE exercise_logs (
    exercise_id     BIGSERIAL PRIMARY KEY,
    user_id         BIGINT    NOT NULL,
    type_id         BIGINT    NOT NULL,
    title           VARCHAR(255),
    duration_min    BIGINT    NOT NULL,          -- 단위: 분
    calories_burned BIGINT    NOT NULL,          -- 서버 자동 계산값
    memo            TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (type_id) REFERENCES exercise_types(type_id)
);

-- 9. 리뷰 및 평점
CREATE TABLE reviews (
    review_id  BIGSERIAL PRIMARY KEY,
    user_id    BIGINT    NOT NULL,
    store_id   BIGINT    NOT NULL,
    star       SMALLINT  NOT NULL CHECK (star BETWEEN 1 AND 5),
    content    TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)  REFERENCES users(user_id),
    FOREIGN KEY (store_id) REFERENCES stores(store_id)
);

-- 10. 리뷰 하트
CREATE TABLE review_likes (
    like_id    BIGSERIAL PRIMARY KEY,
    review_id  BIGINT NOT NULL,
    user_id    BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(review_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT uk_review_likes_review_user UNIQUE (review_id, user_id)
);

-- 11. 커뮤니티 게시판
CREATE TABLE posts (
    post_id    BIGSERIAL PRIMARY KEY,
    user_id    BIGINT    NOT NULL,
    post_type  VARCHAR(50),                      -- 'CHALLENGE','REVIEW','FREE' 등
    title      VARCHAR(255),
    content    TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE reports (
    report_id   BIGSERIAL    PRIMARY KEY,
    user_id     BIGINT       NOT NULL,            -- 제보자
    brand_id    BIGINT,                            -- 제보 대상 브랜드
    menu_name   VARCHAR(255) NOT NULL,             -- 제보 메뉴명
    kcal        BIGINT,
    carbs       BIGINT,
    protein     BIGINT,
    fat         BIGINT,
    sugar       BIGINT,
    status      VARCHAR(20)  NOT NULL DEFAULT 'PENDING',  -- 'PENDING','APPROVED','REJECTED'
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)  REFERENCES users(user_id),
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);


CREATE OR REPLACE FUNCTION tdj.analyze_nutrition(
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
    IF total = 0 THEN RETURN null; END IF;

    c_ratio := carbs   / total * 100;
    p_ratio := protein / total * 100;
    f_ratio := fat     / total * 100;

    -- 태그 (경계값 RED 기준과 통일)
    IF c_ratio >= 60   THEN tags := array_append(tags, '고탄수'); END IF;
    IF c_ratio <  20   THEN tags := array_append(tags, '저탄수'); END IF;
    IF p_ratio >= 40   THEN tags := array_append(tags, '고단백'); END IF;
    IF f_ratio >= 35   THEN tags := array_append(tags, '고지방'); END IF; 


    IF c_ratio BETWEEN 35 AND 55
   AND p_ratio >= 30             
   AND f_ratio <  25              -
    THEN grade := 'GREEN';

    ELSIF c_ratio >= 65
       OR f_ratio >= 35
       OR p_ratio <  10
    THEN grade := 'RED';

    ELSE grade := 'YELLOW';
    END IF;

    RETURN jsonb_build_object('grade', grade, 'tags', tags);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

ALTER TABLE tdj.menus
ADD COLUMN nutrition_info JSONB
    GENERATED ALWAYS AS (
        tdj.analyze_nutrition(carbs, protein, fat)
    ) STORED;

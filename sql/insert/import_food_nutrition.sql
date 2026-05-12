-- 식품의약품안전처 통합식품영양성분정보 import
-- 업체명 "해당없음" / 빈값 → brand_id NULL, is_standard TRUE
-- 업체명 있음 → brands 테이블 신규 추가 후 brand_id 연결

SET search_path TO tandanji;

-- 1. 임시 테이블 (CSV 컬럼 순서 일치)
CREATE TEMP TABLE _food_raw (
    food_code        TEXT,
    food_name        TEXT,
    data_type_code   TEXT,
    data_type_name   TEXT,
    base_amount      TEXT,
    energy_kcal      TEXT,
    water_g          TEXT,
    protein_g        TEXT,
    fat_g            TEXT,
    ash_g            TEXT,
    carbs_g          TEXT,
    sugar_g          TEXT,
    fiber_g          TEXT,
    calcium_mg       TEXT,
    iron_mg          TEXT,
    phosphorus_mg    TEXT,
    potassium_mg     TEXT,
    sodium_mg        TEXT,
    vita_a           TEXT,
    retinol          TEXT,
    beta_carotene    TEXT,
    thiamin          TEXT,
    riboflavin       TEXT,
    niacin           TEXT,
    vita_c           TEXT,
    vita_d           TEXT,
    cholesterol      TEXT,
    saturated_fat    TEXT,
    trans_fat        TEXT,
    waste_rate       TEXT,
    source_code      TEXT,
    source_name      TEXT,
    food_weight      TEXT,
    import_yn        TEXT,
    country_code     TEXT,
    country_name     TEXT,
    product_number   TEXT,
    company_name     TEXT,
    manufacturer     TEXT,
    importer         TEXT,
    distributor      TEXT,
    method_code      TEXT,
    method_name      TEXT,
    created_date     TEXT,
    reference_date   TEXT
);

-- 2. CSV 로드 (컨테이너 내 경로)
\COPY _food_raw FROM '/tmp/food.csv' WITH (FORMAT CSV, HEADER TRUE, ENCODING 'UTF8');

SELECT COUNT(*) AS "로드된 행 수" FROM _food_raw;

-- 3. 기존 brands에 없는 신규 업체명만 INSERT
INSERT INTO tandanji.brands (brand_name)
SELECT DISTINCT TRIM(company_name)
FROM _food_raw
WHERE TRIM(company_name) <> ''
  AND TRIM(company_name) <> '해당없음'
  AND NOT EXISTS (
      SELECT 1 FROM tandanji.brands b WHERE b.brand_name = TRIM(company_name)
  );

SELECT COUNT(*) AS "brands 총 건수" FROM tandanji.brands;

-- 4. menus INSERT
--    업체명 NULL / 빈값 / '해당없음' → brand_id NULL, is_standard TRUE
--    업체명 있음 → brand_id 연결, is_standard FALSE
INSERT INTO tandanji.menus (brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, is_standard)
SELECT
    CASE
        WHEN TRIM(f.company_name) IS NULL
          OR TRIM(f.company_name) = ''
          OR TRIM(f.company_name) = '해당없음'
        THEN NULL
        ELSE b.brand_id
    END,
    NULL AS store_id,
    TRIM(f.food_name),
    CASE WHEN f.energy_kcal ~ '^[0-9]+(\.[0-9]+)?$'
         THEN ROUND(f.energy_kcal::NUMERIC)::BIGINT ELSE NULL END,
    CASE WHEN f.carbs_g    ~ '^[0-9]+(\.[0-9]+)?$'
         THEN ROUND(f.carbs_g::NUMERIC)::BIGINT    ELSE NULL END,
    CASE WHEN f.protein_g  ~ '^[0-9]+(\.[0-9]+)?$'
         THEN ROUND(f.protein_g::NUMERIC)::BIGINT  ELSE NULL END,
    CASE WHEN f.fat_g      ~ '^[0-9]+(\.[0-9]+)?$'
         THEN ROUND(f.fat_g::NUMERIC)::BIGINT      ELSE NULL END,
    CASE WHEN f.sugar_g    ~ '^[0-9]+(\.[0-9]+)?$'
         THEN ROUND(f.sugar_g::NUMERIC)::BIGINT    ELSE NULL END,
    CASE
        WHEN TRIM(f.company_name) IS NULL
          OR TRIM(f.company_name) = ''
          OR TRIM(f.company_name) = '해당없음'
        THEN TRUE
        ELSE FALSE
    END
FROM _food_raw f
LEFT JOIN tandanji.brands b
       ON b.brand_name = TRIM(f.company_name)
      AND TRIM(f.company_name) IS NOT NULL
      AND TRIM(f.company_name) <> ''
      AND TRIM(f.company_name) <> '해당없음';

SELECT COUNT(*) AS "menus 총 건수" FROM tandanji.menus;

DROP TABLE _food_raw;

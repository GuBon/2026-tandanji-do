# CLAUDE.md — docs/db/

TDJMap PostgreSQL/PostGIS 스키마·DDL 관리.  
**절대 원칙**: `ddl-auto=none` — 스키마 변경은 SQL로 직접 반영하고 `sql/ddl/Script.sql`도 함께 갱신한다.

---

## 접속 정보

Docker 개발 DB 기준:

```
host:     127.0.0.1
port:     15432
database: tandanji
schema:   tandanji
user:     tandanji
password: tandanji
```

PowerShell 예시:

```powershell
docker compose exec -T postgis psql -U tandanji -d tandanji
```

---

## 현재 기준 DDL

- 최종 스키마 초안: `sql/ddl/Script.sql`
- 개발 DB 초기화/프로비저닝: `sql/ddl/001_provision_dev_db.sql`
- 개발 시드: `sql/insert/001_seed_dev_db.sql`, `sql/insert/tdj_data.sql`

스키마가 바뀌면 실제 Docker DB와 `sql/ddl/Script.sql`을 둘 다 확인한다.

---

## 현재 스키마 (`tandanji`)

| 테이블 | 설명 |
|--------|------|
| brands | 브랜드, `logo_url` |
| stores | 매장 위치, 주소, 카테고리, `image_url` |
| menus | 메뉴 + 영양소 + `menu_url` + `nutrition_info` JSONB (generated stored) |
| users | 사용자 프로필, role |
| social_logins | 카카오 OAuth, refresh token |
| diet_logs | 식단 기록, `img_url`, `menu_id?`(Menu FK), `store_id?`(Store FK) |
| exercise_types | 운동 종목 + MET |
| exercise_logs | 운동 기록, 서버 계산 칼로리 |
| reviews | 매장 리뷰 |
| review_likes | 리뷰 좋아요, `UNIQUE(review_id, user_id)` |
| posts | 커뮤니티 게시글, `image_url` |
| post_likes | 게시글 좋아요, `UNIQUE(post_id, user_id)` |
| post_comments | 게시글 댓글, `CASCADE DELETE` on post_id |
| reports | 영양정보 오류 제보, `image_url`, `brand_id?` / `store_id?` / `menu_id?` FK |
| report_votes | 제보 투표, `UNIQUE(report_id, user_id)`, `vote_type CHECK('UP'\|'DOWN')` |
| weight_logs | 사용자 체중 이력 (`PUT /users/me` weight 변경 시 자동 기록) |

---

## 핵심 제약/인덱스

```sql
-- menus: 브랜드 메뉴 또는 표준 데이터 중 하나는 필수
CHECK (brand_id IS NOT NULL OR is_standard = TRUE)

-- menus: nutrition_info는 DB 생성 컬럼 (앱에서 INSERT/UPDATE 불필요)
nutrition_info JSONB GENERATED ALWAYS AS (analyze_nutrition(carbs, protein, fat)) STORED

-- diet_logs: menu_id 또는 food_name 중 하나는 필수
CHECK (menu_id IS NOT NULL OR food_name IS NOT NULL)

-- reviews: 별점 범위
CHECK (star BETWEEN 1 AND 5)

-- post_likes: 중복 좋아요 방지
UNIQUE (post_id, user_id)

-- post_comments: 게시글 삭제 시 댓글 연쇄 삭제
FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE

-- review_likes: 중복 좋아요 방지
UNIQUE (review_id, user_id)

-- report_votes: 사용자당 제보당 1표
UNIQUE (report_id, user_id)
CHECK vote_type IN ('UP', 'DOWN')
FOREIGN KEY (report_id) REFERENCES reports(report_id) ON DELETE CASCADE

-- weight_logs 구조
CREATE TABLE tandanji.weight_logs (
    log_id      BIGSERIAL PRIMARY KEY,
    user_id     BIGINT         NOT NULL REFERENCES tandanji.users(user_id),
    weight_kg   NUMERIC(5, 1)  NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- stores: bbox 검색 (latitude, longitude 인덱스)
CREATE INDEX idx_stores_location ON tandanji.stores (latitude, longitude);

-- stores, menus: 이름 LIKE 검색 (trigram)
CREATE INDEX idx_stores_name_trgm ON tandanji.stores USING GIN (lower(store_name) gin_trgm_ops);
CREATE INDEX idx_menus_name_trgm  ON tandanji.menus  USING GIN (lower(menu_name)  gin_trgm_ops);
```

---

## nutrition_info

`menus.nutrition_info`는 `tandanji.analyze_nutrition(carbs, protein, fat)` 함수 기반 JSONB다.

```json
{ "grade": "GREEN|YELLOW|RED", "tags": ["고단백", "저탄수"] }
```

| 등급/태그 | 조건 |
|-----------|------|
| GREEN | 탄수 35-55%, 단백 >=30%, 지방 <25% |
| YELLOW | GREEN도 RED도 아닌 경우 (기본값) |
| RED | 탄수 >=65% OR 지방 >=35% OR 단백 <10% |
| 고탄수 | 탄수 >=60% |
| 저탄수 | 탄수 <20% |
| 고단백 | 단백 >=40% |
| 고지방 | 지방 >=35% |

---

## 조회 쿼리 주의사항

- `GET /stores/search`는 `StoreQueryRepository`의 LATERAL 쿼리를 사용한다.
- 대표 메뉴는 매장 전용 메뉴(`menus.store_id = stores.store_id`)를 브랜드 공통 메뉴보다 우선한다.
- 영양 필터가 있으면 조건을 만족하는 메뉴가 없는 매장은 검색 결과에서 제외된다.
- `GET /stores/{id}/menus`는 매장 전용 메뉴 + 브랜드 공통 메뉴(`store_id IS NULL`)를 함께 반환한다.

---

## 마이그레이션 SQL 작성 규칙

### 테이블 생성 템플릿

```sql
CREATE TABLE IF NOT EXISTS tandanji.{table_name} (
    {pk_col} BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 컬럼 타입 규칙

| 용도 | 타입 |
|------|------|
| PK/FK | `BIGINT` / `BIGSERIAL` |
| 이름/주소/URL | `VARCHAR(255)` 또는 URL은 `VARCHAR(500)` |
| 긴 텍스트 | `TEXT` |
| 영양소/칼로리 | `BIGINT` |
| 좌표 | 현재 엔티티 호환을 위해 numeric 계열 사용, 응답 시 Double 변환 |
| JSON 데이터 | `JSONB` |
| 시각 | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` |
| MET | `NUMERIC(4,2)` |

### DO / DON'T

```
✅ DO
- 테이블 생성 전 기존 테이블과 FK 의존성 확인
- 자주 조회되는 FK 컬럼에 INDEX 생성
- 스키마 변경 후 backend Entity/DTO와 docs/api/contracts.md 영향 확인
- 실제 DB와 sql/ddl/Script.sql 동시 갱신

❌ DON'T
- ddl-auto를 validate/update/create로 바꾸지 말 것
- 운영 데이터 있는 컬럼에 NOT NULL 추가 시 DEFAULT 없이 추가하지 말 것
- DROP/DELETE 전 FK 의존성과 시드 데이터 영향 확인
```

---

## 다음 스키마 후보

현재 필수 스키마 누락은 없다. 다음은 기능이 확정될 때만 추가한다.

```
□ users.profile_url
□ reviews.image_url
□ 사용자별 칼로리/매크로 목표 테이블
□ 챗봇 대화 저장 테이블
```

### 구현 완료된 추가 컬럼

```sql
-- users 테이블에 추가됨
ALTER TABLE tandanji.users ADD COLUMN age INTEGER;
-- gender 컬럼은 최초 스키마에 포함

-- diet_logs 테이블에 추가됨
-- menu_id BIGINT REFERENCES menus(menu_id) — 챗봇 분석 후 메뉴 연결
-- store_id BIGINT REFERENCES stores(store_id) — 미래 확장용 (현재 서비스 미사용)
-- CHECK (menu_id IS NOT NULL OR food_name IS NOT NULL)
```

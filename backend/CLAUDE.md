# TDJMap — Claude 컨텍스트

## 프로젝트 개요
인천 지역 토스트·샌드위치·샐러드 브랜드 메뉴의 영양성분 정보를 제공하는 Spring Boot 기반 웹 서비스.

## 기술 스택
- **Spring Boot 4.0.5** (Java 17)
- **Spring Security**
- **Spring Data JPA** (Hibernate)
- **PostgreSQL** (localhost:5432, DB: postgres, schema: tdj)
- **Lombok**
- **Jsoup 1.18.3** (웹 크롤링)
- **Build**: Gradle

## DB 접속 정보
```
host:     localhost:5432
database: postgres
schema:   tdj
user:     postgres
password: 0218
```

## DB 스키마 (tdj)

### tdj.brands
| 컬럼 | 타입 | 설명 |
|------|------|------|
| brand_id | bigint (PK, auto) | |
| brand_name | varchar(255) | 업체명 |
| logo_url | varchar(255) | |

### tdj.menus
| 컬럼 | 타입 | 설명 |
|------|------|------|
| menu_id | bigint (PK, auto) | |
| brand_id | bigint (FK → brands, nullable) | null이면 is_standard=true 필수 |
| store_id | bigint (FK → stores, nullable) | |
| menu_name | varchar(255) NOT NULL | 식품명 |
| kcal | bigint | 에너지(kcal) |
| carbs | bigint | 탄수화물(g) |
| protein | bigint | 단백질(g) |
| fat | bigint | 지방(g) |
| sugar | bigint | 당류(g) |
| menu_url | varchar(255) | |
| is_standard | boolean (default false) | 공공 표준 데이터 여부 |
| nutrition_info | jsonb (generated) | `tdj.analyze_nutrition(carbs,protein,fat)` 자동 생성 |

**CHECK**: `brand_id IS NOT NULL OR is_standard = true`

`nutrition_info` 반환 구조: `{"grade": "GREEN"/"YELLOW"/"RED", "tags": ["고단백", ...]}`
- GREEN: 탄수화물 35–55%, 단백질 ≥30%, 지방 <25%
- RED: 탄수화물 ≥65% OR 지방 ≥35% OR 단백질 <10%
- 태그: 고탄수(탄수≥60%), 저탄수(탄수<20%), 고단백(단백≥40%), 고지방(지방≥35%)

### tdj.stores
| 컬럼 | 타입 | 설명 |
|------|------|------|
| store_id | bigint (PK, auto) | |
| brand_id | bigint (FK → brands) | |
| store_name | varchar(255) | |
| address | varchar(255) | |
| longitude | numeric(11,7) NOT NULL | WGS84 |
| latitude | numeric(10,7) NOT NULL | WGS84 |
| category | varchar(255) | |
| created_at | timestamp | CURRENT_TIMESTAMP |

인덱스: `idx_stores_location (latitude, longitude)`

### tdj.users
| 컬럼 | 타입 | 설명 |
|------|------|------|
| user_id | bigint (PK, auto) | |
| email | varchar(255) | |
| nickname | varchar(255) | |
| height | bigint | cm |
| weight | bigint | kg |
| gender | varchar(10) | |
| created_at | timestamp | |

### tdj.social_logins
| 컬럼 | 타입 | 설명 |
|------|------|------|
| social_id | bigint (PK, auto) | |
| user_id | bigint (FK → users) NOT NULL | |
| provider | varchar(20) NOT NULL | 소셜 제공자 (kakao 등) |
| provider_id | varchar(255) NOT NULL | |
| refresh_token | text | |
| profile_data | jsonb NOT NULL | |
| created_at | timestamp | |

### tdj.diet_logs
| 컬럼 | 타입 | 설명 |
|------|------|------|
| log_id | bigint (PK, auto) | |
| user_id | bigint (FK → users) NOT NULL | |
| menu_id | bigint (FK → menus, nullable) | |
| store_id | bigint (FK → stores, nullable) | |
| log_kcal | bigint | |
| log_carbs | bigint | |
| log_protein | bigint | |
| log_fat | bigint | |
| log_sugar | bigint | |
| img_url | varchar(255) | |
| meal_type | varchar(20) | 아침/점심/저녁/간식 등 |
| ate_at | timestamp NOT NULL | |

### tdj.exercise_types
| 컬럼 | 타입 | 설명 |
|------|------|------|
| type_id | bigint (PK, auto) | |
| type_name | varchar(255) NOT NULL | |
| met_value | numeric(4,2) NOT NULL | MET 계수 |
| icon_url | varchar(255) | |

### tdj.exercise_logs
| 컬럼 | 타입 | 설명 |
|------|------|------|
| exercise_id | bigint (PK, auto) | |
| user_id | bigint (FK → users) NOT NULL | |
| type_id | bigint (FK → exercise_types) NOT NULL | |
| title | varchar(255) | |
| duration_min | bigint NOT NULL | 운동 시간(분) |
| calories_burned | bigint NOT NULL | |
| memo | text | |
| created_at | timestamp | |

### tdj.reviews
| 컬럼 | 타입 | 설명 |
|------|------|------|
| review_id | bigint (PK, auto) | |
| user_id | bigint (FK → users) NOT NULL | |
| store_id | bigint (FK → stores) NOT NULL | |
| star | smallint NOT NULL | 1–5 (CHECK) |
| content | text | |
| created_at | timestamp | |

### tdj.posts
| 컬럼 | 타입 | 설명 |
|------|------|------|
| post_id | bigint (PK, auto) | |
| user_id | bigint (FK → users) NOT NULL | |
| post_type | varchar(50) | |
| title | varchar(255) | |
| content | text | |
| created_at | timestamp | |

### tdj.reports (메뉴 오류 제보)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| report_id | bigint (PK, auto) | |
| user_id | bigint (FK → users) NOT NULL | |
| brand_id | bigint (FK → brands, nullable) | |
| menu_name | varchar(255) NOT NULL | |
| kcal / carbs / protein / fat / sugar | bigint | 제보 영양정보 |
| status | varchar(20) NOT NULL | default 'PENDING' |
| created_at | timestamp | |

## 현재 DB 데이터 상태
- **brands**: 53개 (인천 지역 토스트·샌드위치·샐러드 브랜드)
- **menus**: 503건 (fatsecret.kr 크롤링)
  - 샐러디아 186, 포케올데이 89, 슬로우캘리 66, 샐러드박스 50, 써브웨이 48,
    이삭토스트 36, 에그드랍 19, 도스마스 5, 투고샐러드 2, 아메리칸트레이 1, 킹토스트 1
  - 42개 브랜드는 fatsecret.kr 미등록으로 0건
- **stores**: 174개 (PostGIS ST_Transform EPSG:5179→4326 변환, tn_poi_category에서 삽입)

## 파일 구조

```
src/main/java/com/example/tdjmap/
├── TdjMapApplication.java
├── collector/
│   └── FatSecretKrCrawler.java     ← fatsecret.kr 웹 크롤러 (Jsoup, JDBC)
│                                      ./gradlew crawlFatSecret [-Pbrand=브랜드명]
├── entity/
│   ├── Brand.java
│   └── Menu.java
└── repository/
    ├── BrandRepository.java
    └── MenuRepository.java
```

## Gradle 태스크
```bash
./gradlew crawlFatSecret              # 전체 브랜드 크롤링
./gradlew crawlFatSecret -Pbrand=이삭토스트  # 특정 브랜드만
./gradlew bootRun                     # 서버 실행 (port 8080)
```

## 주요 결정 사항
- `ddl-auto=none` — 스키마는 수동 관리
- FatSecret API 방식 폐기 → fatsecret.kr 직접 크롤링으로 전환
- DB 행 삭제 시 반드시 시퀀스도 초기화 (memory 참고)

## 로컬 데이터 파일 (git 미포함)
- `incheon_brands.csv` — 인천 브랜드 목록 (크롤러 입력)

# TDJMap — Backend

## 1. 시스템 컨텍스트

**역할**: 영양정보 + 매장 위치 REST API 서버  
**스택**: Spring Boot 4.0.5 · Java 17 · Spring Data JPA · PostgreSQL 17 · Lombok · Jsoup 1.18.3 · jjwt 0.12.6

> **주의**: `backend/bin/` 디렉토리에 IDE(Eclipse/STS)가 생성한 CLAUDE.md 사본이 있을 수 있다. 이 파일들은 stale 상태로 내용이 올바르지 않으니 반드시 `src/` 하위 파일만 참조한다. `backend/.gitignore`에 `bin/` 이 등록되어 있어 git에는 추적되지 않는다.

### 패키지 구조

```
tdjmap/
├── common/
│   ├── ApiResponse.java                  전역 응답 래퍼 (status, data, message)
│   ├── image/
│   │   ├── ImageService.java             이미지 업로드/삭제 (UUID 파일명, uploads/ 저장)
│   │   ├── ImageController.java          POST /images/upload
│   │   └── ImageUploadResponse.java      { imageUrl: String }
│   └── exception/
│       ├── ErrorCode.java                에러 코드 Enum (AUTH_INVALID_TOKEN 등 포함)
│       ├── BusinessException.java
│       └── GlobalExceptionHandler.java
├── config/
│   ├── JwtUtil.java                     JWT 생성/검증/파싱 (jjwt 0.12.6)
│   ├── JwtFilter.java                   OncePerRequestFilter — Bearer 토큰 → SecurityContext
│   ├── SecurityUtil.java                두 가지 유틸 메서드:
│   │                                      getCurrentUserId()      — 미인증 시 AUTH_INVALID_TOKEN
│   │                                      getCurrentUserIdOrNull() — 미인증 시 null 반환 (비로그인 허용 조회)
│   ├── SecurityConfig.java              STATELESS + JwtFilter (공개/인증 규칙 상세는 아래 API 목록 참조)
│   ├── WebMvcConfig.java                /images/** → file:uploads/ 정적 서빙
│   └── AppConfig.java                   JDK HttpClient 빈 등록 (현재 ChatbotService는 미사용, 레거시 빈)
├── auth/
│   ├── controller/AuthController.java   POST /auth/kakao, POST /auth/refresh, DELETE /auth/logout
│   ├── service/AuthService.java         카카오 Authorization Code 교환 → JWT 발급
│   └── dto/  KakaoLoginRequest  TokenResponse  TokenRefreshRequest
├── entity/                              Brand Menu Post PostComment PostLike Review ReviewLike
│                                        Store User DietLog ExerciseLog ExerciseType Report ReportVote
│                                        SocialLogin WeightLog
├── repository/                          JpaRepository 확장 + StoreQueryRepository (Native SQL)
│                                        ReviewLikeRepository — countByReviewIds(batch) / findLikedReviewIds(batch)
│                                        PostCommentRepository — findByPostIdOrderByCreatedAtAsc(postId)
│                                        ReportVoteRepository — countVotesByReportIds(batch) / findUserVotesByReportIds(batch)
│                                        SocialLoginRepository.findByProviderAndProviderId()
│                                        SocialLoginRepository.findByUser_IdAndProvider()
├── store/
│   ├── controller/StoreController.java
│   ├── service/StoreService.java
│   └── dto/  StoreSearchRequest StoreMarkerResponse StoreDetailResponse
│             MenuResponse ReviewResponse ReviewCreateRequest MarkerMacroDto
│             ReviewLikeResponse MenuReportGroupResponse MenuReportItemDto
├── community/
│   ├── controller/PostController.java
│   ├── service/PostService.java
│   ├── service/CommentService.java
│   └── dto/  PostCreateRequest PostResponse PostLikeResponse PostLikeToggleRequest
│             CommentCreateRequest CommentResponse
│             ※ PostResponse: { postId, postType, title, content, imageUrl, likeCount, createdAt }
│                — 익명 게시판이므로 authorId/nickname 미포함
│             ※ CommentResponse: { commentId, content, createdAt, mine }
│                — mine: 현재 로그인 사용자 작성 댓글이면 true
├── record/
│   ├── controller/RecordController.java
│   ├── service/DietRecordService.java
│   ├── service/ExerciseRecordService.java
│   ├── service/WeightLogService.java        getMyLogs() + createLog(User, double)
│   └── dto/  DietLogCreateRequest DietLogResponse
│             ExerciseLogCreateRequest ExerciseLogResponse ExerciseTypeResponse
│             WeightLogResponse
├── report/
│   ├── controller/ReportController.java
│   ├── service/ReportService.java
│   └── dto/  ReportCreateRequest ReportPublicResponse ReportVoteRequest ReportVoteResponse
│             ReportAdminResponse ReportStatusRequest
├── user/
│   ├── controller/UserController.java   GET /users/me, PUT /users/me
│   ├── service/UserService.java
│   └── dto/  UserResponse  UserUpdateRequest
├── chatbot/
│   ├── controller/ChatbotController.java  POST /chatbot/recommend, POST /chatbot/analyze
│   ├── service/ChatbotService.java        HttpURLConnection 직접 사용 (RestClient 422 버그 회피)
│   └── dto/  ChatRecommendRequest  ChatRecommendResponse
│             NutritionAnalysisRequest  NutritionAnalysisResponse
└── collector/
    └── FatSecretKrCrawler.java          fatsecret.kr Jsoup 크롤러
```

### DB 접속

```
host:     127.0.0.1:15432  (로컬 Docker — docker-compose.yml 기준)
database: tandanji
schema:   tandanji
user:     tandanji
password: tandanji
```

### 현재 구현된 API

API 스펙(요청/응답 형식, 공개 여부, 전체 목록)은 `docs/api/contracts.md` 참조.

---

## 2. 행동 지침

### 레이어 패턴 (반드시 준수)

```
Controller → Service → Repository
```

- Service: 클래스에 `@Transactional(readOnly = true)`, 쓰기 메서드만 `@Transactional`
- 기록 도메인은 `DietRecordService`, `ExerciseRecordService`, `WeightLogService`로 책임 분리한다. 컨트롤러만 `RecordController` 하나로 묶는다.
- `WeightLogService.createLog(User, double)`은 `UserService.updateMe()`에서도 호출된다 (체중 수정 시 자동 기록).
- DI: `@RequiredArgsConstructor` + `final` 필드
- 응답: 기본적으로 `ResponseEntity<ApiResponse<T>>` (`DELETE /auth/logout`의 204 No Content만 예외)

```java
// 조회 — 200
return ResponseEntity.ok(ApiResponse.ok(data));

// 생성 — 201
return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.created(response));

// 삭제 / data 없음 — 200
return ResponseEntity.ok(ApiResponse.ok(null));
```

- 예외: `throw new BusinessException(ErrorCode.XXX)` — 직접 RuntimeException 사용 금지

### SecurityUtil 사용 규칙

```java
// 인증 필수 API (미인증 시 AUTH_INVALID_TOKEN 예외)
Long userId = SecurityUtil.getCurrentUserId();

// 인증 선택 API — 비로그인도 조회 가능하지만 개인화 데이터 추가 (예: 리뷰 좋아요 여부)
Long userId = SecurityUtil.getCurrentUserIdOrNull();
if (userId != null) { /* 좋아요 여부 로드 */ }
```

### Entity 패턴

```java
@Entity @Table(name = "...", schema = "tandanji")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
```

- 연관관계: 모두 `FetchType.LAZY`
- 생성 시각: `LocalDateTime createdAt`

#### 핵심 필드 타입 레퍼런스

DB 컬럼명과 Java 필드명이 달라서 틀리기 쉬운 매핑 목록. 새 엔티티 작성 시 이 표와 맞춰 확인한다.

| 엔티티 | Java 필드 | DB 컬럼 | Java 타입 | 비고 |
|--------|-----------|---------|-----------|------|
| Brand | name | brand_name | String | |
| Store | name | store_name | String | |
| Menu | name | menu_name | String | |
| Store | latitude | latitude | BigDecimal | `precision=10, scale=7` |
| Store | longitude | longitude | BigDecimal | `precision=11, scale=7` |
| User | height | height | Long | int/double 아님 |
| User | weight | weight | Long | int/double 아님 |
| Menu | nutritionInfo | nutrition_info | String | `insertable=false, updatable=false` 필수 |
| ReviewLike | user | user_id | User (@ManyToOne) | Long userId 필드 없음 — `entity.getUser().getId()` |
| ReportVote | user | user_id | User (@ManyToOne) | Long userId 필드 없음 — `entity.getUser().getId()` |

`nutrition_info`는 DB `GENERATED ALWAYS AS` 컬럼이므로 JPA에서 쓰기를 막아야 한다:

```java
@Column(name = "nutrition_info", columnDefinition = "jsonb", insertable = false, updatable = false)
private String nutritionInfo;
```

좌표 필드 선언 예시 (`double`/`float` 사용 금지 — 부동소수점 오차):

```java
@Column(nullable = false, precision = 10, scale = 7)
private BigDecimal latitude;

@Column(nullable = false, precision = 11, scale = 7)
private BigDecimal longitude;
```

### DTO 패턴

```java
// Response
@Getter @Builder @JsonInclude(JsonInclude.Include.NON_NULL)

// Request
@Getter @NoArgsConstructor  // + @NotNull @Min @Max @Size 등 validation
```

### ErrorCode 등록

`common/exception/ErrorCode.java`에 도메인 섹션별로 추가:

```java
// Community
POST_NOT_FOUND(404, "게시글을 찾을 수 없습니다."),
```

### Jackson 3.x 주의

Spring Boot 4는 Jackson 3.x를 사용한다. `JsonNode`에서 문자열 추출 시:
- `asText()` / `textValue()` → **deprecated**
- `stringValue()` → **사용**

### SecurityConfig 공개 API 등록

`HttpMethod`를 반드시 명시한다. 미명시 시 해당 경로의 **모든 HTTP 메서드**가 공개되어 보안 구멍이 생긴다.

```java
// import: org.springframework.http.HttpMethod
.requestMatchers(HttpMethod.GET, "/stores/**").permitAll()  // ✅
.requestMatchers("/stores/**").permitAll()                  // ❌ POST/DELETE까지 공개됨
```

### PostgreSQL JSONB Native Query 패턴

`StoreQueryRepository`처럼 native SQL에서 JSONB 컬럼을 다룰 때:

```sql
-- 문자열 값 추출 (텍스트 타입으로 반환)
nutrition_info->>'grade'        -- "GREEN" | "YELLOW" | "RED"

-- 필터 예시
WHERE (nutrition_info->>'grade') = 'GREEN'
AND   (nutrition_info->>'tags')::jsonb ? '고단백'
```

### 코드 스타일

| 항목 | 규칙 | 예시 |
|------|------|------|
| 들여쓰기 | 4 spaces (탭 금지) | — |
| 클래스 | PascalCase | `PostService`, `ErrorCode` |
| 메서드 / 변수 | camelCase | `findPostOrThrow`, `likeCount` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY`, `BASE_URL` |
| private 헬퍼 | 언더바 없이 camelCase | `findPostOrThrow(id)` |

### DO / DON'T

```
✅ DO
- 복잡한 쿼리는 StoreQueryRepository처럼 별도 QueryRepository 분리
- 내부 헬퍼는 private findXxxOrThrow() 패턴으로 통일
- 인증 필수 API에서 userId: SecurityUtil.getCurrentUserId() 로만 추출
- 비로그인 허용 조회 API에서 개인화 데이터: SecurityUtil.getCurrentUserIdOrNull() 사용
- PostgreSQL jsonb 컬럼에 매핑하는 String 필드에는 @JdbcTypeCode(SqlTypes.JSON) 추가
- 리뷰/게시글 등 like 수 배치 조회로 N+1 방지 (countByXxxIds 패턴)
- SecurityConfig 공개 API 등록 시 HttpMethod 명시로 허용 범위를 제한한다

❌ DON'T
- ddl-auto를 validate/update/create로 변경 금지 — 스키마는 직접 SQL 실행
- Entity에 비즈니스 로직 작성 금지
- 새 도메인을 루트 패키지에 직접 생성 금지 — 반드시 feature 패키지 하위
- userId를 요청 파라미터/바디로 수신 금지 — JWT에서 추출
- Jackson 3.x에서 asText()/textValue() 사용 금지 — stringValue() 사용
- ChatbotService에서 RestClient / JDK HttpClient 사용 금지 (422 바디 누락 버그)
  ※ AuthService에서 카카오 API 호출 시 RestClient.create() 사용은 허용됨
    (이 버그는 AI 서버 POST 바디 전송에만 해당)
- stores.latitude/longitude를 double/float로 선언 금지 — BigDecimal(precision 10~11, scale=7) 사용
- users.height/weight를 int/Integer/double로 선언 금지 — Long 타입 사용
- Menu.nutritionInfo를 insertable=false, updatable=false 없이 선언 금지 (GENERATED 컬럼)
- ReviewLike/ReportVote에 Long userId 필드 직접 추가 금지 — @ManyToOne User user로 매핑
```

---

## 3. 메모리 / 참조

### Gradle 태스크

```bash
./gradlew bootRun                            # 서버 실행 (port 8080)
./gradlew compileJava                        # 컴파일 검증
./gradlew crawlFatSecret                     # 전체 브랜드 크롤링
./gradlew crawlFatSecret -Pbrand=이삭토스트   # 특정 브랜드
```

### psql 실행 (Windows)

```bash
$env:PGPASSWORD='tandanji'; psql -h 127.0.0.1 -p 15432 -U tandanji -d tandanji
```

### 필수 외부 설정

`application.properties`는 `.env`를 optional import하지만, 아래 값은 현재 repo 기본값이 없다. 로컬 실행/배포 환경에서 주입해야 한다.

```properties
kakao.client-id=...
tandanji.ai.base-url=...
app.image.base-url=http://localhost:8080/images/
spring.datasource.url=jdbc:postgresql://127.0.0.1:15432/tandanji?currentSchema=tandanji
spring.datasource.username=tandanji
spring.datasource.password=tandanji
```

### 이미지 저장 구조

```
backend/uploads/            ← 런타임 저장소 (.gitignore)
├── stores/                 ← 매장 대표 이미지  (stores.image_url)
├── brands/                 ← 브랜드 로고       (brands.logo_url)
├── menus/                  ← 메뉴 이미지       (menus.menu_url)
├── posts/                  ← 게시글 첨부       (posts.image_url)
├── diet/                   ← 식단 사진         (diet_logs.img_url)
├── reports/                ← 제보 첨부 이미지  (reports.image_url)
├── users/                  ← 프로필 사진       (users.profile_url — 컬럼 추가 예정)
└── reviews/                ← 리뷰 첨부         (reviews.image_url — 컬럼 추가 예정)
```

현재 이미지 URL 컬럼: `stores.image_url`, `posts.image_url`, `reports.image_url`, `menus.menu_url`.

- URL 패턴: `{app.image.base-url}{domain}/{uuid}.ext`
- 파일명: UUID 자동 생성 — 충돌 없음, 경로 추측 불가
- 허용 타입: image/jpeg, image/png, image/webp, image/gif
- 최대 크기: 10MB / 요청당 30MB
- 업로드: `POST /images/upload?domain=xxx` (인증 필요)

### DB 스키마 현황

| 테이블 | 데이터 | 비고 |
|--------|--------|------|
| brands | 53건 | 인천 토스트·샌드위치·샐러드 |
| menus | 503건 | fatsecret.kr 크롤링 |
| stores | 174건 | PostGIS EPSG:5179→4326 변환 |
| post_likes | — | UNIQUE(post_id, user_id) |
| post_comments | — | post_id FK + CASCADE DELETE |
| review_likes | — | UNIQUE(review_id, user_id) |
| report_votes | — | UNIQUE(report_id, user_id), vote_type CHECK('UP'\|'DOWN') |

### 주요 테이블 상세

**menus**: `nutrition_info` JSONB (자동 생성)
```json
{ "grade": "GREEN|YELLOW|RED", "tags": ["고단백", "저탄수"] }
```
- GREEN: 탄수 35–55%, 단백 ≥30%, 지방 <25%
- RED: 탄수 ≥65% OR 지방 ≥35% OR 단백 <10%
- 태그: 고탄수(≥60%) 저탄수(<20%) 고단백(≥40%) 고지방(≥35%)

**menus CHECK**: `brand_id IS NOT NULL OR is_standard = true`

**메뉴 조회/마커 매크로 규칙**:
- `GET /stores/{id}/menus`: 해당 `store_id` 전용 메뉴 + 같은 브랜드의 공통 메뉴(`store_id IS NULL`)를 함께 반환
- `GET /stores/search`: `StoreQueryRepository`의 LATERAL 쿼리로 매장 전용 메뉴를 브랜드 공통 메뉴보다 우선하여 대표 매크로를 선택. 키워드 검색은 매장명/주소/브랜드명/메뉴명 대상 LIKE 검색.

**stores/posts 이미지**:
- `stores.image_url VARCHAR(500)` — 매장 대표 이미지, 상세 API `imageUrl`
- `posts.image_url VARCHAR(500)` — 커뮤니티 첨부 이미지
- `post_likes` — `UNIQUE(post_id, user_id)`로 중복 좋아요 방지
- `review_likes` — `UNIQUE(review_id, user_id)`로 중복 좋아요 방지

### 로컬 데이터 파일 (git 미포함)

- `incheon_brands.csv` — 크롤러 입력 브랜드 목록

---

## 4. 워크플로우

### 새 도메인 기능 추가 순서

```
1. psql로 테이블 생성 SQL 직접 실행
2. entity/ 에 Entity 추가
3. repository/ 에 Repository 추가
4. {domain}/controller, {domain}/service, {domain}/dto 패키지 생성
5. common/exception/ErrorCode.java 에 에러 코드 추가
6. ./gradlew compileJava 로 검증
```

### 주요 결정 사항

- FatSecret API 방식 폐기 → fatsecret.kr 직접 크롤링으로 전환
- DB 행 삭제 시 반드시 시퀀스도 초기화
- 카카오 인증: Implicit Flow(팝업) 폐기 → Authorization Code Flow 채택 (백엔드가 REST API 키로 토큰 교환)
- JWT: access token 1시간(메모리), refresh token 30일(DB + 프론트 localStorage)
- SocialLogin.profileData (jsonb): Hibernate 6에서 `@JdbcTypeCode(SqlTypes.JSON)` 필수 — 없으면 varchar→jsonb 캐스트 오류 발생
- 영양소 필터(min_protein 등): 백엔드 쿼리 파라미터 제거, 프론트에서 클라이언트 필터로 처리
- 챗봇 AI 서버 URL은 `tandanji.ai.base-url` 외부 설정으로 주입한다. repo 기본값은 없다.
- RestClient / JDK HttpClient 모두 Spring Boot 4 + Jackson 3.x 환경에서 챗봇 AI 요청 바디 누락(422) 버그 확인 → ChatbotService는 HttpURLConnection 직접 사용
- AI 응답 422는 `AI_INVALID_REQUEST`, 그 외 4xx/5xx/타임아웃은 `AI_API_UNAVAILABLE`로 처리한다.

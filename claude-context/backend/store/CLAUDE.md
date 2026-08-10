# CLAUDE.md — store 패키지

매장 검색(지도 bbox + 키워드), 매장 상세, 메뉴 목록, 리뷰 조회/작성, 리뷰 좋아요, 메뉴별 제보 그룹 기능.

---

## 파일 구성

```
store/
├── controller/StoreController.java    GET/POST /stores/**
├── service/StoreService.java
└── dto/
    ├── StoreSearchRequest.java        sw_lat, sw_lng, ne_lat, ne_lng, category?, q?
    ├── StoreMarkerResponse.java       지도 마커용 (storeId, brandId, storeName, address, latitude,
    │                                   longitude, category, brandLogoUrl, rating, markerMacro,
    │                                   reportCount, latestReportMacro)
    ├── MarkerMacroDto.java            마커 영양 매크로 요약 (carbs, protein, fat, nutritionGrade, nutritionTags)
    ├── StoreDetailResponse.java       매장 상세 (BrandDto 중첩, rating 포함)
    ├── MenuResponse.java              메뉴 + nutrition grade/tags
    ├── ReviewResponse.java            리뷰 응답  { reviewId, userId, nickname, star, content,
    │                                   createdAt, likeCount, liked }
    │                                   ※ 리뷰는 익명이 아님 — userId/nickname 포함됨
    ├── ReviewCreateRequest.java       리뷰 작성 요청  { star(1-5), content }
    ├── ReviewLikeResponse.java        리뷰 좋아요 상태  { liked, likeCount }
    ├── MenuReportGroupResponse.java   메뉴별 PENDING 제보 그룹  { menuId?, menuName, reports: List }
    └── MenuReportItemDto.java         제보 항목  { reportId, carbs?, protein?, fat?,
                                        imageUrl?, upVotes, downVotes, myVote?, createdAt }
```

---

## API 목록

```
GET /stores/search
  Query: sw_lat, sw_lng, ne_lat, ne_lng
         category (optional)
         q (optional) — 키워드 검색 (매장명/주소/브랜드명/메뉴명 LIKE, LOWER 대소문자 무시)
  Response: List<StoreMarkerResponse>
  ※ 영양소 필터(min_protein 등)는 파라미터 없음 — 프론트 클라이언트 필터로 처리
  ※ reportCount가 0이면 응답 JSON에서 생략됨 (@JsonInclude NON_NULL)

GET /stores/{storeId}
  Response: StoreDetailResponse  (rating: 리뷰 평균 별점 포함, null 가능)

GET /stores/{storeId}/menus
  Response: List<MenuResponse>  (nutrition_info JSONB 파싱 포함)

GET /stores/{storeId}/reviews
  인증 선택 (비로그인도 조회 가능)
  Response: List<ReviewResponse>  (최신순, likeCount + liked 포함)
  인증 시: liked = 내 좋아요 여부 / 비인증 시: liked = false

GET /stores/{storeId}/reviews/{reviewId}/likes
  Header: Authorization: Bearer <jwt>  (인증 필요)
  Response: ReviewLikeResponse  { liked, likeCount }

GET /stores/{storeId}/menu-reports
  인증 선택 (비로그인 시 myVote=null, 로그인 시 내 투표 포함)
  SecurityConfig에 permitAll() 등록
  Response: List<MenuReportGroupResponse>
  동작: reportRepository.findPendingByStoreId(storeId) → 메뉴 ID 또는 이름 기준 그룹화
        menuId 있으면 "id:{id}", 없으면 "name:{menuName}" 키로 그룹화

POST /stores/{storeId}/reviews
  Header: Authorization: Bearer <jwt>
  Body: { star(1-5), content }
  Response: 201 ReviewResponse
  userId: SecurityUtil.getCurrentUserId() 로 추출

POST /stores/{storeId}/reviews/{reviewId}/likes
  Header: Authorization: Bearer <jwt>
  Response: ReviewLikeResponse  (토글: 있으면 DELETE, 없으면 INSERT)
  userId: SecurityUtil.getCurrentUserId() 로 추출
```

---

## 핵심 설계 포인트

### StoreQueryRepository (Native SQL)

- `@Repository` 클래스, `NamedParameterJdbcTemplate`을 `@RequiredArgsConstructor`로 주입
- `LEFT JOIN LATERAL` 구조: 매장별 후보 메뉴를 고르고 bbox 필터링 → 결과 반환
- 대표 매크로는 `menus.store_id = stores.store_id`인 매장 전용 메뉴를 브랜드 공통 메뉴보다 우선한다.
- **rating**: `LEFT JOIN reviews` + `ROUND(AVG(r.star)::numeric, 1)::float8` — 리뷰 없으면 null
- **brandLogoUrl**: `LEFT JOIN brands b` → `b.logo_url` — 브랜드 없으면 null
- **reportCount**: 해당 매장의 `status='PENDING'` 제보 수. 0이면 null로 응답에서 생략된다.
- **latestReportMacro**: 해당 매장의 최신 PENDING 제보 중 carbs/protein/fat 값이 하나라도 있는 항목의 매크로. 영양 등급/태그는 null/빈 배열.
- **키워드 검색 (`q`)**: `LOWER(store_name) LIKE :keywordLike` OR 주소 OR 브랜드명 OR 메뉴명으로 4개 필드 대상 LIKE. keyword가 null/blank면 조건 적용 안 함.
- **영양소 필터 없음**: min_protein, max_carbs 등 파라미터 제거됨. 프론트 클라이언트 필터로 처리.

### 메뉴 조회

- `GET /stores/{storeId}/menus`는 해당 매장 전용 메뉴와 브랜드 공통 메뉴를 함께 반환한다.
- 매장 전용 메뉴: `menus.store_id = storeId`
- 브랜드 공통 메뉴: `menus.brand_id = store.brand_id AND menus.store_id IS NULL`
- 다른 매장 전용 메뉴가 섞이지 않도록 `MenuRepository.findStoreMenus(storeId, brandId)`를 사용한다.

**MenuRepository 전체 메서드**

```java
List<Menu> findStoreMenus(Long storeId, Long brandId)   // store 전용 + 브랜드 공통 메뉴
boolean existsByBrandAndName(Brand brand, String name)  // 크롤러 중복 삽입 방지
List<Menu> findByBrand_IdOrderByIdAsc(Long brandId)     // 브랜드 전체 메뉴 목록
```

**StoreRepository 주요 메서드**

```java
List<Store> findByBrandId(Long brandId)                 // 브랜드별 매장 목록
List<Store> findNearby(double lat, double lon)          // ABS 좌표 차 < 0.000009 (≈1m 이내 근접 매칭)
```

### nutrition_info 파싱

```java
// MenuResponse 빌드 시 (Jackson 3.x)
Map<String, Object> info = objectMapper.readValue(
    menu.getNutritionInfo(), new TypeReference<>() {});
String grade = (String) info.get("grade");
List<String> tags = ((List<?>) info.get("tags")).stream()
    .map(Object::toString).toList();
```

파싱 실패 시 `log.warn` 후 grade/tags = null (NON_NULL이라 응답에 미포함).

### 매장 상세 (StoreDetailResponse)

- `rating`: `reviewRepository.findAverageRatingByStoreId(storeId)` — 리뷰 없으면 null
- `imageUrl`: `stores.image_url` — null이면 프론트가 브랜드 로고로 fallback

### 리뷰 좋아요 시스템

리뷰 목록 조회(`getStoreReviews`)는 N+1 방지를 위해 배치 메서드를 사용한다.

```java
// ReviewLikeRepository — 배치 (getStoreReviews에서 사용)
Map<Long, Long> likeCounts = reviewLikeRepository.countByReviewIds(reviewIds)
Set<Long> likedIds = reviewLikeRepository.findLikedReviewIds(reviewIds, userId)  // 비인증 시 empty

// ReviewLikeRepository — 단건 (getReviewLikeStatus / toggleReviewLike에서 사용, 인증 필수)
boolean existsByReviewIdAndUserId(Long reviewId, Long userId)
Optional<ReviewLike> findByReviewIdAndUserId(Long reviewId, Long userId)
long countByReviewId(Long reviewId)
```

- `getStoreReviews`는 `SecurityUtil.getCurrentUserIdOrNull()`로 비인증 시 liked=false 처리
- `getReviewLikeStatus` / `toggleReviewLike`는 단건 메서드 사용 (인증 필수)

### StoreService 의존성

```java
private final StoreRepository storeRepository;
private final MenuRepository menuRepository;
private final ReviewRepository reviewRepository;
private final ReviewLikeRepository reviewLikeRepository;
private final UserRepository userRepository;
private final StoreQueryRepository storeQueryRepository;
private final ReportRepository reportRepository;          // menu-reports 조회용
private final ReportVoteRepository reportVoteRepository;  // 투표 수 배치 조회용
private final ObjectMapper objectMapper;
```

---

## 규칙

- 새 필터 조건 추가 → `StoreSearchRequest` + `StoreQueryRepository` 쿼리 동시 수정
- 리뷰 star 범위: 1–5 (DB CHECK 제약 + `@Min(1) @Max(5)` 양쪽 검증)
- `findStoreOrThrow(id)` / `findReviewOrThrow(storeId, reviewId)` 헬퍼로 404 처리 통일
- 매장 상세 응답에는 `stores.image_url`을 `imageUrl`로 포함한다. 프론트는 없을 때 브랜드 로고로 fallback.
- 영양소 범위 필터(min_protein 등)는 백엔드에서 처리하지 않는다 — 프론트 전담.
- 리뷰 목록 likeCount/liked 조회는 배치 메서드 사용 필수 (N+1 방지).

# CLAUDE.md — report 패키지

영양정보 오류 제보(Report) + 제보 투표(ReportVote) 기능. 커뮤니티 검증 방식으로 DB를 자동 업데이트한다.

---

## 파일 구성

```
report/
├── controller/ReportController.java
├── service/ReportService.java
└── dto/
    ├── ReportCreateRequest.java     제보 작성 요청
    ├── ReportPublicResponse.java    공개 제보 응답 (투표 수 + 내 투표 포함)
    ├── ReportVoteRequest.java       투표 요청  { voteType: "UP"|"DOWN" }
    ├── ReportVoteResponse.java      투표 응답  { upVotes, downVotes, myVote? }
    ├── ReportAdminResponse.java     관리자용 제보 응답 (userId, userNickname 포함)
    └── ReportStatusRequest.java     상태 변경 요청  { status: "APPROVED"|"REJECTED" }
```

---

## API 목록

```
POST /reports
  Header: Authorization: Bearer <jwt>  (인증 필요)
  Body: ReportCreateRequest
    { storeId?,          // 기존 매장 ID (있으면 Store 자동 매칭)
      storeName(필수),   // 매장명 (DB 미등록 신규 매장도 가능)
      storeAddress?,
      storeLat?,         // 위도 (storeId 없을 때 근처 매장 검색에 사용)
      storeLon?,         // 경도
      menuName(필수),
      carbs?, protein?, fat?,
      imageUrl? }
  Response 200: null
  매장 매칭 우선순위: storeId → (storeLat, storeLon)으로 findNearby → 없으면 매칭 없음
  ※ findNearby 기준: ABS(lat diff) < 0.000009 AND ABS(lon diff) < 0.000009 (≈1m)
  ※ 매칭된 매장에서 menuName 대소문자 무관 동일 메뉴 자동 연결

GET /reports
  인증 선택 (비로그인 시 myVote=null, 로그인 시 내 투표 포함)
  SecurityConfig에 permitAll() 등록
  Query: storeId (optional) — 특정 매장 PENDING 제보만 필터
  Response: List<ReportPublicResponse>
    { reportId, storeId?, storeName, storeAddress?, storeLat?, storeLon?,
      menuId?, menuName, carbs?, protein?, fat?, imageUrl?,
      upVotes, downVotes, myVote?, createdAt }
  ※ status='PENDING' 인 제보만 반환

POST /reports/{reportId}/vote
  Header: Authorization: Bearer <jwt>  (인증 필요)
  Body: { voteType: "UP"|"DOWN" }
  Response: ReportVoteResponse { upVotes, downVotes, myVote? }
  토글 동작:
    - 같은 voteType으로 재투표 → 투표 취소 (DELETE), myVote=null
    - 다른 voteType으로 투표 → 변경 (UPDATE), myVote=변경값
    - 미투표 상태에서 투표 → 신규 (INSERT), myVote=voteType
  에러: 400 REPORT_VOTE_INVALID (UP|DOWN 외 값), 404 REPORT_NOT_FOUND

GET /admin/reports
  Header: Authorization: Bearer <jwt>  (ADMIN role 필요)
  ※ 상태 필터 없음 — PENDING/APPROVED/REJECTED 전체 반환 (findAllByOrderByCreatedAtDesc)
  Response: List<ReportAdminResponse>
    { reportId, userId, userNickname, storeName, storeAddress?, storeLat?, storeLon?,
      menuName, carbs?, protein?, fat?, imageUrl?, status, createdAt }

PATCH /admin/reports/{reportId}/status
  Header: Authorization: Bearer <jwt>  (ADMIN role 필요)
  Body: { status: "APPROVED"|"REJECTED" }
  Response: ReportAdminResponse
  ※ 서비스 레벨에서 status 값 검증 없음 — 운영 규칙상 APPROVED|REJECTED만 전송
```

---

## 핵심 설계

### 제보 투표 자동 승인 (toggleVote)

`upVotes - downVotes >= 5` 이면 status='PENDING' → 'APPROVED'로 자동 변경하고 DB에 즉시 반영한다.  
이미 APPROVED/REJECTED 상태면 자동 승인 로직은 스킵된다.

자동 승인 케이스 3가지:

```
케이스 1: 매장 미등록 (store=null, storeLat+storeLon 있음)
  → resolveBrand(storeName)으로 브랜드 매칭
    ※ brands.brand_name이 storeName의 prefix인 것 중 가장 긴 매칭을 선택
       (예: "이삭토스트 xx점" → "이삭토스트" 매칭)
  → Store 신규 생성 (brand 연결)
  → Menu 신규 생성 (is_standard=true, CHECK 만족)
  → report.store / report.menu 업데이트

케이스 2: 매장 있음, 메뉴 미매칭 (store≠null, menu=null)
  → Menu 신규 생성 (store 연결, is_standard=true)
  → report.menu 업데이트

케이스 3: 매장 + 메뉴 모두 매칭 (store≠null, menu≠null)
  → menu.carbs / menu.protein / menu.fat 덮어씀 (null이 아닌 값만)
  → nutrition_info JSONB는 DB 생성 컬럼 (stored generated) → 자동 재계산
```

### report_votes 테이블

```
UNIQUE(report_id, user_id) — 사용자당 1개 투표만 허용
vote_type CHECK ('UP'|'DOWN')
ON DELETE CASCADE on report_id FK
```

### Repository 메서드 목록

```java
// ReportRepository
List<Report> findAllByOrderByCreatedAtDesc()                      // getAdminReports — 전체 상태
List<Report> findByStatusOrderByCreatedAtDesc(String status)      // 상태별 필터 조회 (미사용 예비)
List<Report> findPendingWithRelations()                           // GET /reports 전체 목록 (store/menu FETCH)
List<Report> findPendingByStoreId(Long storeId)                   // GET /reports?storeId= 및 menu-reports
List<Report> findPendingByMenuIds(List<Long> menuIds)             // 메뉴 ID 목록으로 PENDING 조회 (미사용 예비)

// ReportVoteRepository — 단건
Optional<ReportVote> findByReportIdAndUserId(Long, Long)          // toggleVote 직접 사용
long countByReportIdAndVoteType(Long reportId, String voteType)   // 단건 카운트 (미사용 예비)
void deleteByReportIdAndUserId(Long reportId, Long userId)        // (현재 미사용)

// ReportVoteRepository — 배치 (N+1 방지, ReportService 및 StoreService.getMenuReports() 공유)
List<Object[]> countVotesByReportIds(List<Long> reportIds)        // [reportId, voteType, count]
List<Object[]> findUserVotesByReportIds(List<Long>, Long userId)  // [reportId, voteType]
```

---

## Report 엔티티 주요 컬럼

| 컬럼 | 타입 | 비고 |
|------|------|------|
| brand | Brand FK | 엔티티에 존재하나 createReport/toggleVote 흐름에서 직접 설정하지 않음 |
| store, menu | Store/Menu FK | 작성 시 기존 데이터 매칭, 승인 시 신규 생성/연결 가능 |
| carbs, protein, fat | Long | ReportCreateRequest에서 설정 가능 |
| kcal | Long | DB 엔티티에만 존재, ReportCreateRequest에 없음 (직접 설정 불가) |
| sugar | Long | DB 엔티티에만 존재, 현재 미사용 |

자동 승인(케이스 1·2) 시 Menu 생성에 `report.getKcal()`이 전달되므로, 추후 kcal 제보 기능 추가 시 ReportCreateRequest와 함께 확장해야 한다.

---

## 규칙

- `POST /reports`는 인증 필수 (`SecurityUtil.getCurrentUserId()`)
- `GET /reports`는 인증 선택 (`getCurrentUserIdOrNull()`)
- `POST /reports/{id}/vote`는 인증 필수
- auto-approve는 'PENDING' 상태일 때만 동작 (APPROVED/REJECTED이면 스킵)
- Menu.is_standard=true로 생성 → `CHECK (brand_id IS NOT NULL OR is_standard = TRUE)` 충족
- 관리자 수동 승인/거절: PATCH /admin/reports/{id}/status → status 직접 변경
- 배치 메서드(`countVotesByReportIds`, `findUserVotesByReportIds`)는 ReportService와 StoreService 양쪽에서 공유

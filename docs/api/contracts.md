# API Contracts — TDJMap

백엔드(구현) ↔ 프론트엔드(소비) 간 계약서.  
**이 파일이 진실의 원천.** API 추가/변경 시 여기 먼저 업데이트.

---

## 공통 규칙

### 요청

```
Base URL: http://localhost:8080  (개발)
Content-Type: application/json
인증: Authorization: Bearer <jwt>  (JWT 구현 완료)
userId: 서버에서 JWT로 추출 — Body·QueryParam으로 전달 금지
```

### 응답 래퍼

```json
{
  "status": 200,
  "data": { ... },
  "message": null
}
```

에러 시:
```json
{
  "status": 404,
  "data": null,
  "message": "게시글을 찾을 수 없습니다."
}
```

---

## ✅ 구현 완료

### 인증 (Auth)

#### `POST /auth/kakao` — 카카오 인가코드 → JWT 발급

```
Body:
{
  "code": "카카오 인가코드",
  "redirectUri": "http://localhost:5173/oauth/callback"
}

Response 200:
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "userId": 1,
    "nickname": "홍길동",
    "role": "USER"
  }
}
```

#### `POST /auth/refresh` — 액세스 토큰 갱신

```
Body:
{ "refreshToken": "eyJ..." }

Response 200:
{ "accessToken": "eyJ..." }
```

#### `DELETE /auth/logout` — 로그아웃

```
Header: Authorization: Bearer <jwt>
Response 200: { status: 200, data: null }
동작: DB에서 refresh token 무효화
```

---

### 매장 (Store)

#### `GET /stores/search` — 지도 bbox 마커 목록

```
Query Params:
  sw_lat, sw_lng, ne_lat, ne_lng   (Double, 필수) — bbox 남서/북동 좌표
  category                          (String, 선택) — '샐러드'|'포케'|'한식뷔페'
  min_protein                       (Integer, 선택)
  max_carbs, max_fat, max_sugar     (Integer, 선택)

Response 200:
[
  {
    "storeId": 1,
    "storeName": "샐러디아 인천점",
    "latitude": 37.456,
    "longitude": 126.705,
    "brandId": 3,
    "category": "샐러드",
    "rating": 4.3,
    "markerMacro": {
      "carbs": 45,
      "protein": 28,
      "fat": 12,
      "nutritionGrade": "GREEN",
      "nutritionTags": ["고단백"]
    },
    "reportCount": 2,           // PENDING 제보 수 (0이면 null, @JsonInclude(NON_NULL))
    "latestReportMacro": {      // 최신 PENDING 제보 영양성분 (없으면 null)
      "carbs": 50,
      "protein": 30,
      "fat": 10
    }
  }
]
```

#### `GET /stores/{storeId}` — 매장 상세

```
Response 200:
{
  "storeId": 1,
  "storeName": "샐러디아 인천점",
  "address": "인천시 ...",
  "latitude": 37.456,
  "longitude": 126.705,
  "category": "샐러드",
  "imageUrl": "http://localhost:8080/images/stores/uuid.jpg",
  "rating": 4.3,
  "brand": {
    "brandId": 3,
    "brandName": "샐러디아",
    "logoUrl": "https://..."
  }
}
```

#### `GET /stores/{storeId}/menus` — 매장 전용 메뉴 + 브랜드 공통 메뉴 목록

```
Response 200:
[
  {
    "menuId": 1,
    "menuName": "그린 파워볼",
    "kcal": 480,
    "carbs": 58,
    "protein": 24,
    "fat": 12,
    "sugar": 8,
    "menuUrl": "https://...",
    "nutritionGrade": "GREEN",
    "nutritionTags": ["고단백"]
  }
]
```

#### `GET /stores/{storeId}/menu-reports` — 매장 메뉴별 제보 그룹

```
인증 불필요 (투표 수), JWT 제공 시 myVote 포함

Response 200:
[
  {
    "menuId": 5,              // null 가능 — menus 테이블 미매칭 제보
    "menuName": "야채 토스트",
    "reports": [
      {
        "reportId": 10,
        "carbs": 60,
        "protein": 10,
        "fat": 15,
        "imageUrl": "http://localhost:8080/images/reports/uuid.jpg",
        "upVotes": 5,
        "downVotes": 2,
        "myVote": "UP",      // null | "UP" | "DOWN"
        "createdAt": "2026-05-13T10:00:00"
      }
    ]
  }
]

조회 범위: status = 'PENDING' 제보만, menuId 또는 menuName 기준으로 그룹핑
```

#### `GET /stores/{storeId}/reviews` — 리뷰 목록 (최신순)

```
Response 200:
[
  {
    "reviewId": 1,
    "userId": 5,
    "nickname": "건강한하루",
    "star": 4,
    "content": "신선하고 맛있어요",
    "createdAt": "2026-05-01T12:30:00",
    "likeCount": 3,
    "liked": false
  }
]
```

#### `POST /stores/{storeId}/reviews` — 리뷰 작성

```
Header: Authorization: Bearer <jwt>
Body:
{
  "star": 4,        // 1-5
  "content": "신선하고 맛있어요"  // 최대 1000자
}

Response 201: ReviewResponse (위와 동일 구조)
```

#### `GET /stores/{storeId}/reviews/{reviewId}/likes` — 리뷰 하트 상태 조회

```
Header: Authorization: Bearer <jwt>

Response 200:
{
  "liked": true,
  "likeCount": 3
}
```

#### `POST /stores/{storeId}/reviews/{reviewId}/likes` — 리뷰 하트 토글

```
Header: Authorization: Bearer <jwt>
Body: {}

Response 200:
{
  "liked": false,
  "likeCount": 2
}
```

---

### 커뮤니티 (Community)

#### `GET /posts/{postId}/likes` — 좋아요 상태 조회

```
Header: Authorization: Bearer <jwt>

Response 200:
{
  "liked": true,
  "likeCount": 12
}
```

#### `POST /posts/{postId}/likes` — 좋아요 토글

```
Header: Authorization: Bearer <jwt>
Body: {}

Response 200:
{
  "liked": false,   // 토글 후 상태
  "likeCount": 11
}

동작: post_likes에 (postId, userId) 없으면 INSERT, 있으면 DELETE
```

---

### 식단 기록 (DietLog)

#### `GET /diet-logs` — 날짜별 식단 조회

```
Header: Authorization: Bearer <jwt>
Query Params:
  date  (yyyy-MM-dd, 필수)

Response 200:
[
  {
    "logId": 1,
    "menuId": null,
    "foodName": "된장찌개",
    "mealType": "점심",
    "logKcal": 350,
    "logCarbs": 45,
    "logProtein": 20,
    "logFat": 8,
    "logSugar": 0,
    "ateAt": "2026-05-04T12:30:00"
  }
]
```

#### `POST /diet-logs` — 식단 기록 저장

```
Header: Authorization: Bearer <jwt>
Body:
{
  "menuId": null,          // optional — 메뉴 연결 시
  "foodName": "된장찌개",
  "mealType": "점심",      // 아침|점심|저녁|간식
  "logKcal": 350,
  "logCarbs": 45,
  "logProtein": 20,
  "logFat": 8,
  "logSugar": 0,
  "imgUrl": "http://localhost:8080/images/diet/uuid.jpg",  // optional — 식단 사진
  "ateAt": "2026-05-04T12:30:00"
}

Response 201: DietLogResponse (위와 동일 구조)
```

#### `DELETE /diet-logs/{logId}` — 식단 기록 삭제

```
Header: Authorization: Bearer <jwt>
Response 200: { status: 200, data: null }
에러: 403 — 본인 기록이 아닌 경우
```

---

### 운동 종목 (ExerciseType)

#### `GET /exercise-types` — 운동 종목 목록

```
Header: Authorization: Bearer <jwt>
Response 200:
[
  { "typeId": 1, "typeName": "사이클", "metValue": 8.5, "iconUrl": null },
  ...
]
```

---

### 운동 기록 (ExerciseLog)

#### `GET /exercise-logs` — 날짜별 운동 조회

```
Header: Authorization: Bearer <jwt>
Query Params:
  date  (yyyy-MM-dd, 필수)

Response 200:
[
  {
    "exerciseId": 1,
    "typeId": 5,
    "typeName": "런닝",
    "title": "인터벌 훈련",
    "durationMin": 45,
    "caloriesBurned": 440,
    "memo": null,
    "createdAt": "2026-05-04T10:30:00"
  }
]
```

#### `POST /exercise-logs` — 운동 기록 저장

```
Header: Authorization: Bearer <jwt>
Body:
{
  "typeId": 5,
  "title": "인터벌 훈련",  // optional
  "durationMin": 45,
  "memo": null             // optional
}

Response 201: ExerciseLogResponse (위와 동일 구조)
동작: caloriesBurned는 서버가 `MET × 사용자 체중(없으면 65kg) × durationHour`로 계산한다.
```

#### `DELETE /exercise-logs/{exerciseId}` — 운동 기록 삭제

```
Header: Authorization: Bearer <jwt>
Response 200: { status: 200, data: null }
에러: 403 — 본인 기록이 아닌 경우
```

---

### 신고 (Report)

#### `POST /reports` — 영양정보 오류 신고

```
Header: Authorization: Bearer <jwt>
Body:
{
  "storeId": 1,    // optional — 매장 ID (DB 매장에 자동 연결)
  "storeName": "이삭토스트 인하대점",
  "menuName": "야채 토스트",
  "carbs": 60,     // optional
  "protein": 10,   // optional
  "fat": 15,       // optional
  "imageUrl": "http://localhost:8080/images/reports/uuid.jpg" // optional
}

Response 200: { status: 200, data: null }

동작:
  - storeId 있으면 reports.store_id FK 설정
  - menuName과 storeId로 menus 테이블에서 매칭되는 menu_id 자동 연결
  - 초기 status: PENDING
```

#### `GET /reports` — 공개 제보 목록 (투표용)

```
인증 불필요 (투표 수), JWT 제공 시 myVote 포함
Query Params:
  storeId  (Long, 선택) — 특정 매장의 PENDING 제보만 조회

Response 200:
[
  {
    "reportId": 10,
    "storeId": 1,
    "storeName": "이삭토스트 인하대점",
    "storeAddress": "인천시 미추홀구 ...",
    "menuId": 5,           // null 가능 — 메뉴 미매칭 시
    "menuName": "야채 토스트",
    "carbs": 60,
    "protein": 10,
    "fat": 15,
    "imageUrl": "http://localhost:8080/images/reports/uuid.jpg",
    "upVotes": 5,
    "downVotes": 2,
    "myVote": "UP",        // null | "UP" | "DOWN" (JWT 없으면 null)
    "createdAt": "2026-05-13T10:00:00"
  }
]

조회 범위: status = 'PENDING' 제보만
```

#### `POST /reports/{reportId}/vote` — 제보 투표 (찬성/반대)

```
Header: Authorization: Bearer <jwt>
Body:
{
  "voteType": "UP"   // "UP" | "DOWN"
}

Response 200:
{
  "upVotes": 6,
  "downVotes": 2,
  "myVote": "UP"     // null | "UP" | "DOWN"
}

동작 (toggle):
  - 이전 투표 없음 → INSERT (voteType 설정)
  - 같은 voteType 재투표 → DELETE (취소, myVote → null)
  - 다른 voteType 투표 → UPDATE (전환)
에러: 400 — voteType이 UP/DOWN 외의 값
      404 — 존재하지 않는 reportId
```

#### `GET /admin/reports` — 신고 목록 조회 (관리자 전용)

```
Header: Authorization: Bearer <jwt>  (role: ADMIN 필요)

Response 200:
[
  {
    "reportId": 1,
    "userId": 5,
    "userNickname": "홍길동",
    "storeName": "이삭토스트 인하대점",
    "menuName": "야채 토스트",
    "carbs": 60,
    "protein": 10,
    "fat": 15,
    "imageUrl": "http://localhost:8080/images/reports/uuid.jpg",
    "status": "PENDING",
    "createdAt": "2026-05-06T14:30:00"
  }
]
```

#### `PATCH /admin/reports/{reportId}/status` — 신고 처리 상태 변경 (관리자 전용)

```
Header: Authorization: Bearer <jwt>  (role: ADMIN 필요)
Body:
{
  "status": "APPROVED"   // APPROVED | REJECTED
}

Response 200: ReportAdminResponse (위와 동일 구조, 변경된 status 반영)
에러: 400 — status 값이 APPROVED/REJECTED 외의 값인 경우
```

---

### 사용자 (User)

#### `GET /users/me` — 내 프로필 조회

```
Header: Authorization: Bearer <jwt>

Response 200:
{
  "userId": 1,
  "nickname": "홍길동",
  "role": "USER",
  "height": 175,        // null 가능 (미설정 시 응답 필드 없음)
  "weight": 70,         // null 가능 (미설정 시 응답 필드 없음)
  "gender": "M",        // null 가능 (미설정 시 응답 필드 없음)
  "createdAt": "2026-05-01T10:00:00"
}

사용처:
  - 식단·운동 탭 신장/체중 표시
  - 운동 기록 서버 칼로리 계산 (weight)
  - AuthGuard 로그인 후 자동 로드 (profileLoaded 플래그)
```

#### `PUT /users/me` — 프로필 수정

```
Header: Authorization: Bearer <jwt>
Body:
{
  "nickname": "새닉네임",   // optional (max 50자)
  "height": 175,            // optional
  "weight": 68,             // optional
  "gender": "M"             // optional — M | F (max 1자)
}

Response 200: UserResponse (위와 동일 구조, 변경된 값 반영)
동작: null 필드는 무시 — 전달된 필드만 업데이트
```

---

### 커뮤니티 게시글 (Post CRUD)

#### `GET /posts` — 게시글 목록

```
인증 불필요
Query Params:
  postType  (선택) — '식단 공유' | '오운완' | '자유 게시판'
  page      (기본 0)
  size      (기본 20)

Response 200: Page<PostResponse>
{
  "content": [
    {
      "postId": 1,
      "authorId": 5,
      "nickname": "건강한하루",
      "postType": "식단 공유",
      "title": "오늘 점심 샐러드",
      "content": "샐러디아 그린파워볼 먹었어요",
      "imageUrl": "http://localhost:8080/images/posts/uuid.jpg",  // null 가능
      "likeCount": 12,
      "createdAt": "2026-05-07T12:30:00"
    }
  ],
  "totalElements": 100,
  "totalPages": 5,
  "number": 0,
  "size": 20
}
```

#### `POST /posts` — 게시글 작성

```
Header: Authorization: Bearer <jwt>
Body:
{
  "postType": "식단 공유",   // 필수
  "title": "오늘 점심",      // 필수 (max 100자)
  "content": "내용...",      // 필수
  "imageUrl": "http://localhost:8080/images/posts/uuid.jpg"  // optional
}

Response 201: PostResponse (위와 동일 구조)

이미지 첨부 흐름:
  1. POST /images/upload?domain=posts → imageUrl 획득
  2. POST /posts body에 imageUrl 포함
```

#### `GET /posts/{postId}` — 게시글 상세

```
인증 불필요

Response 200: PostResponse (위와 동일 구조, content 전체 포함)
에러: 404 — POST_NOT_FOUND
```

#### `DELETE /posts/{postId}` — 게시글 삭제

```
Header: Authorization: Bearer <jwt>

Response 200: { status: 200, data: null }
에러: 403 — POST_FORBIDDEN (작성자 본인이 아닌 경우)
     404 — POST_NOT_FOUND
```

---

### 이미지 업로드 (Image)

#### `POST /images/upload` — 이미지 업로드

```
Header: Authorization: Bearer <jwt>
Content-Type: multipart/form-data
Params:
  file    (MultipartFile, 필수) — 이미지 파일
  domain  (String, 필수) — stores | brands | menus | posts | diet | users | reviews | reports

Response 200:
{
  "imageUrl": "http://localhost:8080/images/posts/550e8400-uuid.jpg"
}

제약:
  - 허용 타입: image/jpeg, image/png, image/webp, image/gif
  - 최대 크기: 10MB
  - 파일명: UUID 자동 생성
  - 도메인 외 값 전달 시 400 — IMAGE_INVALID_DOMAIN

저장 위치: backend/uploads/{domain}/{uuid}.ext
서빙 URL:  GET /images/{domain}/{uuid}.ext (인증 불필요)
```

---

### 챗봇 (Chatbot)

#### `POST /chatbot/recommend` — AI 메뉴 추천

```
인증 불필요
Body:
{
  "lat": 37.4563,          // 필수 — 위도 (-90 ~ 90)
  "lng": 126.7041,         // 필수 — 경도 (-180 ~ 180)
  "weather": "rain",       // 선택 — sunny | partly-cloudy | cloudy | rain | snow
  "temperature": 14,       // 선택 — 기온 °C (-60 ~ 70)
  "message": "단백질 많은 음식 먹고 싶어"  // 필수 — 1~1000자
}

Response 200:
{
  "recommendations": [
    {
      "storeId": 94,
      "storeName": "샐러디아 인천점",
      "address": "인천시 ...",
      "menuId": 212,
      "menuName": "그린 파워볼",
      "kcal": 480,
      "carbs": 45,
      "protein": 30,
      "fat": 12,
      "nutritionGrade": "GREEN",
      "nutritionTags": ["고단백"]
    }
  ],
  "reason": "단백질 비중이 높고 탄수화물 부담이 적은 근처 메뉴를 추천해드려요."
}

처리 기준:
- recommendations 최대 3개 (빈 배열 가능 — 정상 케이스)
- reason은 화면에 바로 표시 가능한 한국어 문장
- AI 서버 장애 시 503 반환
- 서버 간 HTTP로 tandanji-ai-api(192.168.110.63:3221)를 경유
```

#### `POST /chatbot/analyze` — 이미지 영양성분 분석

```
인증 불필요
Body:
{
  "image": "data:image/jpeg;base64,..."  // 필수 — base64 Data URL
}

Response 200:
{
  "menuId": 212,              // null 가능 — AI가 DB 메뉴와 매칭 못한 경우
  "menuName": "그린 파워볼",  // null 가능
  "kcal": 480,                // null 가능
  "carbs": 45,                // null 가능
  "protein": 30,              // null 가능
  "fat": 12,                  // null 가능
  "nutritionGrade": "GREEN",  // null 가능
  "nutritionTags": ["고단백"],// null 가능
  "reason": "그린 파워볼과 유사한 구성으로 분석됩니다."  // 항상 존재
}

처리 기준:
- menuId 없으면 reason만 반환 (나머지 null)
- menuId 있으면 DB에서 영양정보 보강 후 반환
- AI 서버 장애 시 503 반환
- 서버 간 HTTP로 tandanji-ai-api(192.168.110.63:3221)를 경유
```

---

## ⬜ 미구현

현재 없음.

---

## 변경 이력

| 날짜 | 변경 내용 | 담당 |
|------|-----------|------|
| 2025-05-04 | 초기 계약서 작성 | API 계약 에이전트 |
| 2025-05-04 | post_likes 토글 API 추가 | 백엔드 에이전트 |
| 2026-05-06 | JWT 인증 구현 완료 → auth 3개 ✅ 이동, userId 파라미터 전면 제거 | 백엔드 에이전트 |
| 2026-05-06 | 식단/운동 기록 API 구현 완료 → ✅ 이동 | 백엔드 에이전트 |
| 2026-05-06 | 신고 API 추가 → ✅ (POST /reports, GET /admin/reports) | 백엔드 에이전트 |
| 2026-05-06 | markerMacro 실제 응답 구조 반영, 리뷰·좋아요 userId 파라미터 제거 | API 계약 에이전트 |
| 2026-05-07 | PATCH /admin/reports/{id}/status 누락 추가 → ✅ 구현 완료 21개 | API 계약 에이전트 |
| 2026-05-07 | GET /users/me 구현 완료 → ✅ 이동, PUT /users/me만 ⬜ 잔존. 구현 완료 22개 | 백엔드 에이전트 |
| 2026-05-07 | POST CRUD 4개 + PUT /users/me + POST /images/upload 구현 완료 → ✅ 이동. 미구현 → 이미지 컬럼 2개로 축소 | 백엔드 에이전트 |
| 2026-05-08 | POST /chatbot/recommend 구현 완료 (AI API 연계, 서버 간 HTTP) | 백엔드 에이전트 |
| 2026-05-11 | POST /chatbot/analyze 누락 추가 → ✅, POST /diet-logs imgUrl? 필드 누락 추가 | API 계약 에이전트 |
| 2026-05-13 | 투표 기능 추가: GET /reports, POST /reports/{id}/vote, GET /stores/{id}/menu-reports → ✅, POST /reports body에 storeId 추가, GET /stores/search 응답에 reportCount/latestReportMacro 추가 | API 계약 에이전트 |

# TDJMap — Frontend

## 1. 시스템 컨텍스트

**역할**: 모바일 퍼스트 웹 앱 — 매장 위치 지도 + 영양정보 + 식단/운동 기록  
**스택**: React 18 · Vite · Zustand · OpenLayers 9 · Tailwind CSS · React Router v7

### 디렉토리 구조

```
src/
├── api/               apiClient.js storeApi.js recordApi.js reportApi.js
│                      imageApi.js   — POST /images/upload (multipart, JWT 자동 주입)
│                      postApi.js    — GET/POST/DELETE /posts, 좋아요, 댓글 CRUD
│                      chatbotApi.js — POST /chatbot/recommend, POST /chatbot/analyze
│                      userApi.js    — GET/PUT /users/me
├── components/        PageLayout Header BottomNavBar Button NutritionCell
│                      ImageUploader   — 이미지 업로드 공통 컴포넌트 (domain, onChange, aspectRatio)
│                      AuthRequiredModal BottomSheet
├── hooks/             useAuthRequired.js — requireAuth(fn) 패턴, 비인증 시 AuthRequiredModal
├── features/
│   ├── auth/          AuthGuard useKakaoLogin OAuthCallbackPage
│   ├── admin/         AdminGuard AdminReportPage useAdminReports
│   ├── map/           MapPage MapView + 커스텀 훅 + 모달/오버레이
│   │                  MapStorePage + useStoreDetail + StoreDetailSections
│   │                  RouteBottomSheet + useRoute + useRouteLayer (TMap 경로)
│   │                  useLocationPixel — 내 위치 픽셀 좌표 추적
│   ├── record/        RecordPage(탭) DietTab ExerciseTab useDiet useExercise + 모달들
│   │                  DietRecordPage — 식단 상세 기록 페이지 (/diet)
│   │                  DashboardPage — 영양/운동 분석 대시보드 (/record/dashboard)
│   │                  useDashboard — 기간별 칼로리+체중 집계 훅
│   ├── chatbot/       ChatbotPage useChatbot
│   ├── community/     CommunityPage PostCreatePage PostDetailPage PostComments
│   └── user/          BodyProfilePage — 신장/체중 수정 (/profile/body)
└── store/             useAuthStore useDietStore useMapStore useExerciseStore
```

### 라우팅 구조

```
/oauth/callback         OAuthCallbackPage  (AuthGuard 바깥 — 카카오 콜백)
/                     → /map (리다이렉트)
/map                    MapPage
/map/store/:id          MapStorePage
/diet                   DietRecordPage     (식단 상세 기록)
/record                 RecordPage         (식단/운동 탭)
/record/dashboard       DashboardPage      (영양/운동 분석 대시보드)
/profile/body           BodyProfilePage    (신장/체중·성별·나이 수정)
/chatbot                ChatbotPage
/community              CommunityPage
/community/create       PostCreatePage
/community/post/:id     PostDetailPage
/admin/reports          AdminReportPage    (AdminGuard 보호 — role: ADMIN 필요)
```

`/oauth/callback`을 제외한 모든 라우트는 `AuthGuard`로 보호됨 (카카오 로그인 또는 게스트 모드).  
새로고침 직후 access token 복원 중에는 자식 라우트를 렌더링하지 않는다. `user`는 persist되지만 access token은 메모리라, 복원 전 API 호출은 401을 만들 수 있다.  
`/admin/reports`는 `AuthGuard` 내부에서 추가로 `AdminGuard`(role 검사)가 중첩 적용됨.

### 환경변수 (.env)

```
VITE_VWORLD_API_KEY=           V-World 지도 API
VITE_KAKAO_APP_KEY=            카카오 JavaScript 키 (Kakao SDK 초기화)
VITE_KAKAO_REDIRECT_URI=       카카오 콜백 URI (http://localhost:5173/oauth/callback)
VITE_WEATHER_API_KEY=          기상청 API
VITE_API_BASE_URL=             백엔드 API (http://localhost:8080)
VITE_TMAP_API_KEY=             TMap API (경로 안내)
```

---

## 2. 행동 지침

### 컴포넌트 패턴

```jsx
// 공통 레이아웃
<PageLayout title="..." showBack={false}>
  {/* 콘텐츠 */}
</PageLayout>
```

- 컴포넌트: `PascalCase.jsx`
- 커스텀 훅: `useCamelCase.js`
- 컴포넌트 300줄 초과 → 커스텀 훅으로 로직 분리
- 함수/컴포넌트 로직 50줄 초과 → 커스텀 훅 추출

### Zustand 사용 규칙

```js
// ✅ 개별 selector로 구독 (불필요한 리렌더링 방지)
const user = useAuthStore(s => s.user)

// ❌ 전체 구독 금지
const store = useAuthStore()
```

### API 호출 규칙

```js
// 반드시 apiClient + try-catch + 로딩 상태 처리
import { apiClient } from '../api/apiClient.js'

const [loading, setLoading] = useState(false)
try {
  setLoading(true)
  const res = await apiClient('/endpoint')
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()  // ApiResponse<T> 래퍼 언팩
  ...
} catch (e) {
  ...
} finally {
  setLoading(false)
}
```

- 백엔드 도메인 API는 `apiClient` 또는 전용 API 모듈을 사용한다. 예외: `/auth/refresh`, `/auth/kakao`, `/auth/logout`, `multipart/form-data` 이미지 업로드, 외부 기상/위치/TMap API
- 응답은 항상 `ApiResponse<T>` 래퍼: `{ status, data, message }` 구조

### useAuthRequired 훅

```js
const { requireAuth, modalOpen, closeModal } = useAuthRequired()

// 비로그인/게스트 → AuthRequiredModal 표시
// 로그인 상태 → fn() 즉시 실행
requireAuth(() => navigate('/community/create'))
```

- 인증이 필요한 액션(글쓰기, 좋아요, 제보 등) 앞에 반드시 `requireAuth()` 래핑
- `AuthRequiredModal`은 호출한 컴포넌트가 직접 `<AuthRequiredModal onClose={closeModal} />` 렌더링

### 디자인 시스템

**색상**
```
primary:     #1b6d24   (녹색)
primary-dim: #076019   (진한 녹색)
surface:     #f8f9fa
on-surface:  #2b3437
```

**폰트**: Open Sans (기본) · Manrope (headline) · Public Sans (body)

**Z-Index 계층** (tailwind.config.js에 등록된 값만 사용)

| 클래스 | 값 | 용도 |
|--------|----|------|
| z-map | 0 | MapView |
| z-marker | 30 | 마커 오버레이 |
| z-canvas | 35 | WeatherCanvas |
| z-ui | 50 | 검색·필터·날씨위젯·FAB |
| z-modal | 1000 | 모달·바텀시트 |

### ImageUploader

`src/components/ImageUploader.jsx` — 이미지 업로드 공통 컴포넌트.

```jsx
const [imageUrl, setImageUrl] = useState(null)
<ImageUploader domain="diet" onChange={setImageUrl} aspectRatio="4/3" />

// aspectRatio={null} → 이미지 원본 비율 그대로 표시 (고정 높이 없음)
<ImageUploader domain="posts" onChange={setImageUrl} aspectRatio={null} />

// onFile: 파일 선택 즉시 호출 (업로드 완료 전) — 챗봇 즉시 미리보기 등에 활용
<ImageUploader domain="diet" onFile={setRawFile} onChange={setImageUrl} aspectRatio="4/3" />
```

- `domain`: 백엔드 `POST /images/upload?domain=xxx` 파라미터 — `'diet' | 'posts' | 'reports'` 등
- `onChange(url | null)`: 업로드 완료 시 URL 전달, ✕ 버튼으로 제거 시 null 전달
- `onFile(file | null)`: 파일 선택 즉시(업로드 전) 호출, ✕ 버튼으로 제거 시 null 전달 (선택 prop)
- `aspectRatio`: CSS aspect-ratio 문자열 (기본 `'4/3'`). `null`이면 이미지 원본 비율로 표시
- `className`: 루트 div에 추가할 Tailwind 클래스 (선택)
- 파일 선택 즉시 ObjectURL 미리보기 → 업로드 완료 후 실제 서버 URL로 교체
- 업로드 실패 시 미리보기 제거 + 에러 메시지 표시
- 허용 포맷: jpeg / png / webp / gif
- 업로드 API: `src/api/imageApi.js`의 `uploadImage(file, domain)` — Content-Type 직접 지정 금지 (FormData 자동 처리)

### NutritionCell

`src/components/NutritionCell.jsx` — 탄단지 영양소 표시 공통 셀.

- 기본 패딩: `px-1 py-0.5` (모바일 마커 내부에 맞게 최소화)
- 레이블: `text-[9px]`, 수치: `text-[11px]` — 글씨 크기는 변경하지 말 것
- `className` prop으로 패딩 override 가능 (StoreCard: `className="flex-1 py-1"`)
- 배경: `bg-surface-container-low rounded-[2px]`

### Button variant

```
gradient        기본 CTA
filter          필터 비활성
filter-active   필터 활성
icon            아이콘 버튼
sheet-cancel    바텀시트 취소
sheet-confirm   바텀시트 확인
```

### DO / DON'T

```
✅ DO
- 모바일 퍼스트: sm(640px) 이하 기준으로 먼저 설계
- h-dvh 사용 (모바일 주소창 대응)
- 모달/바텀시트는 overflow-hidden 부모 바깥, fixed 포지션
- 인증 필요 API는 반드시 apiClient() 사용 (JWT 헤더 자동 주입)
- 인증이 필요한 액션은 반드시 requireAuth()로 감싼다

❌ DON'T
- API 키를 컴포넌트 코드에 하드코딩 금지 (.env 에서만)
- px 단위 하드코딩 금지 (Tailwind 수치 활용)
- z-[임의값] 직접 사용 금지 (tailwind.config.js 등록 후 사용)
- 데스크톱 전용 라이브러리 추가 금지 (모바일 성능 우선)
- 인증 필요 JSON API에 직접 fetch 사용 금지 — apiClient 사용
```

---

## 3. 메모리 / 참조

### 개발 명령어

```bash
npm run dev      # Vite 개발 서버 (port 5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

### Zustand Store 목록

| Store | 주요 상태 |
|-------|-----------|
| useAuthStore | user, jwtAccessToken(메모리), jwtRefreshToken(persist), isGuest, isLoading |
| useDietStore | meals[] |
| useMapStore | mapInstance, center, zoom, latLon, weather, temperature, forecast, pendingStore |
| useExerciseStore | exercises[] |

**useAuthStore persist 전략**
- `jwtRefreshToken` + `user` → localStorage (`auth-storage` 키)
- `jwtAccessToken` → 메모리만 (페이지 새로고침 시 초기화 → AuthGuard가 refresh 호출로 복원)

### Vite 프록시 설정 (vite.config.js)

```
/api/kma  → https://apis.data.go.kr       # 기상청 API
/api/tmap → https://apis.openapi.sk.com   # TMap 경로 API
```

### 매장 UI 데이터 구조 (storeApi.js normalizer 출력)

```js
// GET /stores/search → normalizeMarker()
{
  id, name, address, category, lat, lon,
  brandLogoUrl,  // brands.logo_url (null 가능)
  rating,        // 리뷰 평균 별점 (null 가능)
  grade,         // 'GREEN' | 'YELLOW' | 'RED' | null  — null = 메뉴 정보 미등록 (회색 마커)
  tags,          // string[] — nutrition_info.tags 우선, 없으면 프론트 파생
  nutrition: { carbs: '45g', protein: '20g', fat: '10g' },  // 표시용 문자열
  raw:       { carbs: 45,    protein: 20,    fat: 10    },   // 필터용 숫자
}
// 프론트 파생 태그 규칙 (nutritionTags 없을 때):
//   protein≥25 → 고단백, carbs≤40 → 저탄수, carbs≥80 → 고탄수, fat≤10 → 저지방, fat≥25 → 고지방

// GET /stores/{id} + /menus → normalizeStoreDetail()
{
  id, name, category, address, lat, lon,
  image,   // stores.imageUrl (null 가능 — 프론트에서 브랜드 로고로 fallback)
  rating,  // null
  grade,   // null (상세는 메뉴별 grade 사용)
  tags,    // []
  nutrition: { carbs: '--', protein: '--', fat: '--' },
  menus: MenuItem[]
}
// MenuItem: {
//   id, name, description, price, imageUrl,
//   grade: 'GREEN' | 'YELLOW' | 'RED' | null,
//   tags: string[],
//   nutrition: { carbs: '45g', protein: '20g', fat: '10g' },  // 표시용 문자열
//   raw:       { carbs: 45,    protein: 20,    fat: 10    },   // 정렬용 숫자
// }
```

### 기록 API 함수 (recordApi.js)

```js
fetchDietLogs(date)                // GET /diet-logs?date=yyyy-MM-dd
createDietLog(payload)             // POST /diet-logs
deleteDietLog(logId)               // DELETE /diet-logs/{logId}

fetchExerciseTypes()               // GET /exercise-types
fetchExerciseLogs(date)            // GET /exercise-logs?date=yyyy-MM-dd
createExerciseLog(payload)         // POST /exercise-logs — caloriesBurned는 보내지 않음, 서버 계산값 사용
deleteExerciseLog(exerciseId)      // DELETE /exercise-logs/{exerciseId}

fetchWeightLogs()                  // GET /weight-logs — 전체 체중 이력 (asc)
                                   // 반환: [{ logId, weightKg, recordedAt }]
                                   // 기간 필터링은 useDashboard에서 startTs로 클라이언트 처리

toLocalDateTimeStr()               // 현재 시각을 로컬 datetime 문자열로 반환 (식단기록 ateAt 필드에 사용)
```

### 커뮤니티 API 함수 (postApi.js)

```js
fetchPosts({ postType, page, size })    // GET /posts
fetchPost(postId)                       // GET /posts/{postId}
createPost(payload)                     // POST /posts
deletePost(postId)                      // DELETE /posts/{postId}
fetchPostLikeStatus(postId)             // GET /posts/{postId}/likes
togglePostLike(postId)                  // POST /posts/{postId}/likes

fetchComments(postId)                   // GET /posts/{postId}/comments → CommentItem[]
createComment(postId, content)          // POST /posts/{postId}/comments → CommentItem
deleteComment(postId, commentId)        // DELETE /posts/{postId}/comments/{commentId}

// CommentItem: { commentId, content, createdAt, mine }
// mine: 현재 로그인 사용자 작성 댓글이면 true → 삭제 버튼 표시 조건
```

---

## 4. 워크플로우

### 새 기능 추가 순서

```
1. features/{domain}/ 폴더 생성
2. {Domain}Page.jsx — PageLayout 사용
3. use{Domain}.js — 비즈니스 로직 분리
4. App.jsx에 라우트 추가
5. BottomNavBar에 탭 추가 (필요시)
```

### 구현 완료 목록

```
✅ 맵 백엔드 API 연동 (GET /stores/search + /stores/{id} + /menus)
✅ 카카오 OAuth → 백엔드 JWT 교환 (Authorization Code Flow)
✅ 식단/운동 기록 탭 → DietLog / ExerciseLog API 연동
✅ 이미지 업로드 연동 (제보하기·식단기록·커뮤니티 글 작성)
✅ 커뮤니티 게시글 POST /posts 제출 연동 (PostCreatePage)
✅ 커뮤니티 게시글 목록/상세 GET /posts 연동
✅ 커뮤니티 댓글 CRUD 연동 (PostComments.jsx — 익명, mine 플래그로 자기 댓글 삭제)
✅ 커뮤니티 좋아요 상태/토글 연동 (비로그인 클릭 시 AuthRequiredModal)
✅ 사용자 프로필 조회 GET /users/me 연동 (AuthGuard 로그인 후 자동 로드)
✅ 분석 대시보드 — BMR 카드, 오늘 링 차트, 순 칼로리 막대, 섭취/소비 꺾은선, 체중 변화 차트
✅ 체중 이력 GET /weight-logs 연동 + 기간 토글 [7일/30일/전체]
✅ 사용자 프로필 수정 UI → PUT /users/me 연동 (BodyProfilePage.jsx)
✅ 챗봇 AI 연동 — 메뉴 추천 / 이미지 영양성분 분석 / 식단 기록 추가 / 추천 카드 → 지도 이동
✅ 매장 상세 리뷰 작성/좋아요 연동 (useStoreDetail)
✅ TMap 경로 안내 (도보/자전거/차량/대중교통) — RouteBottomSheet + useRoute + useRouteLayer
✅ 내 위치 픽셀 마커 표시 — useLocationPixel
```

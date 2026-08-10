# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
│   │                  VotingBottomSheet + ReportClusterBottomSheet + ReportVoteCard (제보 투표)
│   │                  useReportClusters — storeId 없는 공개 제보를 좌표 기준 클러스터링
│   │                  useLocationPixel — 내 위치 픽셀 좌표 추적
│   ├── record/        RecordPage(탭) DietTab ExerciseTab useDiet useExercise + 모달들
│   │                  DietRecordPage — 식단 상세 기록 페이지 (/diet)
│   │                  DashboardPage — 영양/운동 분석 대시보드 (/record/dashboard)
│   │                  useDashboard — 기간별 칼로리+체중 집계 훅
│   │                  BodyMetricSummary — 신장/체중 표시 공통 컴포넌트 (DietTab·ExerciseTab 공유)
│   │                  recordMappers.js — toDietRecordItem / toExerciseRecordItem / EXERCISE_TYPE_EMOJIS
│   │                  dashboard/ — BmrCard DashboardCharts(TodayRingChart·NetCalorieBarChart·LineChart·WeightLineChart)
│   │                              PeriodToggle DashboardCard bmr.js dashboardConstants.js
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

`/oauth/callback`을 제외한 모든 라우트는 `AuthGuard`로 보호됨.  
`/admin/reports`는 `AuthGuard` 내부에서 추가로 `AdminGuard`(role 검사)가 중첩 적용됨.

모든 페이지 컴포넌트는 `React.lazy()` + `<Suspense fallback={<RouteFallback />}>`로 코드 스플리팅. `AuthGuard`와 `AdminGuard`만 정적 import.

### 환경변수 (.env)

```
VITE_VWORLD_API_KEY=           V-World 지도 API
VITE_KAKAO_APP_KEY=            카카오 JavaScript 키 (Kakao SDK 초기화)
VITE_KAKAO_REDIRECT_URI=       카카오 콜백 URI (예: http://localhost:5173/oauth/callback)
VITE_WEATHER_API_KEY=          기상청 API
VITE_API_BASE_URL=             백엔드 API (http://localhost:8080)
VITE_TMAP_API_KEY=             TMap API (경로 안내)
FIGMA_PERSONAL_ACCESS_TOKEN=   Figma 연동용 선택 값 (프론트 런타임에서는 사용하지 않음)
```

---

## 2. 행동 지침

### apiClient 사용 규칙

`src/api/apiClient.js`는 `fetch` 래퍼로 **raw `Response` 객체를 반환**한다.

```js
import { apiClient } from '../api/apiClient.js'

const [loading, setLoading] = useState(false)
try {
  setLoading(true)
  const res = await apiClient('/endpoint')
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()  // ApiResponse<T> 래퍼 언팩
} catch (e) {
  // 에러 처리
} finally {
  setLoading(false)
}
```

- `Content-Type: application/json` 자동 주입
- `Authorization: Bearer <token>` — `useAuthStore.jwtAccessToken`이 있으면 자동 주입
- **인증 필요 JSON API에는 반드시 apiClient 사용** (직접 fetch 사용 금지)
- FormData 이미지 업로드는 `imageApi.uploadImage()` 사용 (Content-Type 직접 지정 금지)
- 예외: `/auth/refresh`, `/auth/kakao`, `/auth/logout`은 `useKakaoLogin` / `OAuthCallbackPage`에서 직접 fetch 사용

### AuthGuard 흐름

로그인·인증 전체를 `AuthGuard`가 관리한다. 대기·리다이렉트 조건:

| 조건 | 동작 |
|------|------|
| `waitingForAccessToken` — user·refreshToken 있으나 accessToken 없음 | 스피너 표시 (refresh 중) |
| `refreshing` — refresh API 호출 중 | 스피너 표시 |
| `waitingForProfile` — accessToken 있으나 profileLoaded=false | 스피너 표시 |
| `needsBodyProfile` — profileLoaded=true이고 height·weight null | `/profile/body`로 리다이렉트 |
| `user` 또는 `isGuest` | children 렌더링 |
| 모두 아님 | 로그인 화면 표시 |

`user`는 localStorage persist, `jwtAccessToken`은 메모리만 → 새로고침 시 AuthGuard가 refresh API로 복원.

### useAuthStore 액션

```js
setAuth(user, accessToken, refreshToken)  // 카카오 로그인 성공 후 (OAuthCallbackPage)
updateUser(profile)                        // /users/me 로드 완료 후 (AuthGuard), profileLoaded=true
setGuest()                                 // 게스트 모드 진입
clearAuth()                                // 로그아웃 후 전체 초기화
setAccessToken(token)                      // accessToken 단독 갱신 (미사용)
setTokens(accessToken, refreshToken)       // refresh 완료 후 두 토큰 갱신
```

### PageLayout / Header / BottomNavBar

`PageLayout`은 `h-dvh flex-col` 컨테이너 안에 Header + main + BottomNavBar를 세로로 쌓는다.  
**BottomNavBar는 PageLayout 안에 항상 포함**되므로 직접 렌더링하지 말 것.

```jsx
// ✅ header prop — Header 컴포넌트에 그대로 전달됨
<PageLayout header={{ title: '식단 기록', left: <BackButton /> }}>
  {/* 콘텐츠 */}
</PageLayout>

// ✅ customHeader — Header 대신 완전히 다른 JSX를 상단에 렌더링
<PageLayout customHeader={<MyCustomTopBar />}>
  {/* 콘텐츠 */}
</PageLayout>

// ✅ header 없이 (맵 화면 등 — 상단 바 없음)
<PageLayout>
  {/* 콘텐츠 */}
</PageLayout>

// ✅ className — main 영역에 추가할 Tailwind 클래스
<PageLayout header={{ title: '...' }} className="px-4 py-3">
  {/* 콘텐츠 */}
</PageLayout>
```

**Header props**:

| prop | 기본값 | 설명 |
|------|--------|------|
| `title` | — | 중앙 텍스트 (절대 위치로 중앙 배치) |
| `left` | `<LogoLink />` | 왼쪽 영역 (뒤로가기 버튼 또는 로고) |
| `right` | — | 오른쪽 영역 (아이콘 버튼 등) |
| `className` | `'bg-white px-4'` | 헤더 루트 div 클래스 override |

- 높이: `h-[52px]` 고정
- `left` 기본값 `LogoLink`: 클릭 시 `/map`으로 이동하는 탄단지도 로고 버튼
- `title` + `left` 동시 사용 시 `left`는 왼쪽, `title`은 절대 중앙 — 겹침 없음

**BottomNavBar 탭 구성**:

| 탭 | 경로 | 아이콘 |
|----|------|--------|
| 지도 | `/map` | 핀 모양 SVG |
| 기록 | `/record` | 문서 모양 SVG |
| 커뮤니티 | `/community` | 사람 두 명 SVG |

- 높이: `h-16` (64px), 배경 흰색, 상단 `border-gray-100`
- 활성 색: `#15803d` (green-700), 비활성: `#94a3b8` (slate-400)
- `NavLink`의 `isActive`로 자동 스타일링 — 별도 상태 관리 불필요
- **새 탭 추가 시**: `BottomNavBar.jsx`의 `TABS` 배열에만 추가하면 됨

### 코드 스타일

| 항목 | 규칙 | 예시 |
|------|------|------|
| 들여쓰기 | 2 spaces (탭 금지) | — |
| 따옴표 | single quote | `'식단 공유'` |
| 세미콜론 | 없음 (no-semi) | `const x = 1` |
| 변수 / 함수 | camelCase, 언더바 prefix 없음 | `likeCount`, `fetchPosts` |
| 상수 | UPPER_SNAKE_CASE | `const TABS = [...]` |
| 컴포넌트 파일 | PascalCase.jsx | `CommunityPage.jsx` |
| 커스텀 훅 파일 | useCamelCase.js | `useAuthRequired.js` |

### 컴포넌트 패턴

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

**폰트**: Open Sans (기본) · Manrope (headline)

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
<ImageUploader domain="diet" onChange={setImageUrl} aspectRatio="4/3" />
<ImageUploader domain="posts" onChange={setImageUrl} aspectRatio={null} />

// onFile: 파일 선택 즉시 호출 (업로드 완료 전) — 챗봇·제보 AI 분석 등에 활용
<ImageUploader domain="diet" onFile={setRawFile} onChange={setImageUrl} aspectRatio="4/3" />
```

- `onChange(url | null)`: 업로드 완료 시 URL 전달, ✕ 버튼 제거 시 null
- `onFile(file | null)`: 파일 선택 즉시 File 객체 전달, ✕ 버튼 제거 시 null (선택 prop)
- `aspectRatio`: CSS aspect-ratio 문자열 (기본 `'4/3'`). `null`이면 원본 비율
- 파일 선택 즉시 ObjectURL 미리보기 → 업로드 완료 후 실제 서버 URL로 교체

### Button variant

```
gradient        기본 CTA (녹색)
gradient-blue   파란색 CTA (#49AFE6 — 분석 버튼 등)
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
npm run build    # 프로덕션 빌드 (타입/구문 에러 확인)
npm run preview  # 빌드 결과 미리보기
```

### Zustand Store 목록

| Store | 주요 상태 |
|-------|-----------|
| useAuthStore | user, jwtAccessToken(메모리), jwtRefreshToken(persist), isGuest, isLoading, profileLoaded |
| useDietStore | meals[] |
| useMapStore | mapInstance, center, zoom, latLon, weather, temperature, forecast, pendingStore |
| useExerciseStore | exercises[] |

**useAuthStore persist 전략**
- `jwtRefreshToken` + `user` → localStorage (`auth-storage` 키)
- `jwtAccessToken` → 메모리만 (페이지 새로고침 시 초기화 → AuthGuard가 refresh 호출로 복원)
- `profileLoaded` → `/users/me` 호출 완료 여부 (AuthGuard가 updateUser 호출 시 true로 전환)

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
  reportCount:   0,
  latestReport:  null, // { carbs: '45g', protein: '20g', fat: '10g' } 또는 null
}
// 프론트 파생 태그 규칙 (nutritionTags 없을 때):
//   protein≥25 → 고단백, carbs≤40 → 저탄수, carbs≥80 → 고탄수, fat≤10 → 저지방, fat≥25 → 고지방
```

### 기록 API 함수 (recordApi.js)

```js
fetchDietLogs(date: Date)           // GET /diet-logs?date=yyyy-MM-dd
createDietLog(payload)             // POST /diet-logs
deleteDietLog(logId)               // DELETE /diet-logs/{logId}

fetchExerciseTypes()               // GET /exercise-types
fetchExerciseLogs(date: Date)       // GET /exercise-logs?date=yyyy-MM-dd
createExerciseLog(payload)         // POST /exercise-logs — caloriesBurned 전송 안 함 (서버 계산)
deleteExerciseLog(exerciseId)      // DELETE /exercise-logs/{exerciseId}

fetchWeightLogs()                  // GET /weight-logs — 전체 체중 이력 (asc)
toLocalDateTimeStr()               // 현재 시각을 로컬 datetime 문자열로 반환 (식단기록 ateAt 필드)
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
```

---

## 4. 워크플로우

### 새 기능 추가 순서

```
1. features/{domain}/ 폴더 생성
2. {Domain}Page.jsx — PageLayout 사용
3. use{Domain}.js — 비즈니스 로직 분리
4. App.jsx에 라우트 추가 (React.lazy + Suspense)
5. BottomNavBar에 탭 추가 (필요시)
```

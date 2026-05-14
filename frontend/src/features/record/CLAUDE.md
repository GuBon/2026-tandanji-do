# CLAUDE.md — features/record/

식단 기록(DietTab) + 운동 기록(ExerciseTab) 통합 페이지. 백엔드 API 연동 완료.

---

## 컴포넌트 구조

```
record/
├── RecordPage.jsx           '식단' / '운동' 탭 전환 컨테이너 + 헤더(분석·기록하기 버튼)
├── DashboardPage.jsx        영양/운동 분석 대시보드 (/record/dashboard)
├── DietTab.jsx              신장/체중 표시 + 칼로리 히어로 + 매크로 바 + 식단 목록
├── ExerciseTab.jsx          신장/체중 표시 + 칼로리 히어로 + 통계 그리드 + 운동 목록
├── CalorieHeroCard.jsx      큰 칼로리 수치 카드 (DietTab·ExerciseTab 공통)
├── DietMealCard.jsx         식사 카드
├── ExerciseActivityCard.jsx 운동 활동 카드
├── ExerciseAddModal.jsx     운동 추가 모달 (운동 종목 목록 API에서 로드)
├── HistoryModal.jsx         과거 기록 조회 모달  props: { type: 'diet'|'exercise' }
├── AiNutritionModal.jsx     AI 영양분석 결과 모달 (success prop으로 성공/실패 분기)
├── DietRecordPage.jsx       식단 상세 기록 페이지 (/diet 라우트)
├── useDiet.js               식단 전용 훅 — API 연동 + useDietStore 래핑
├── useExercise.js           운동 전용 훅 — API 연동 + useExerciseStore 래핑
└── useDashboard.js          대시보드 데이터 훅 — 기간별 칼로리+체중 집계
```

---

## 데이터 흐름

### 식단 탭

```js
useDiet()  →  { meals, dailyCalories, addMealEntry, removeMealEntry, loading, refresh }

// 마운트 시 오늘 날짜 로그 자동 로드 (GET /diet-logs?date=오늘)
// AbortController 패턴 — unmount 시 진행 중인 요청 취소
// addMealEntry: POST /diet-logs → 성공 시 store에 추가
// removeMealEntry: DELETE /diet-logs/{logId} → 성공 시 store에서 제거
// useDietStore 직접 사용 금지 — 반드시 useDiet 훅 경유
```

**meals 항목 shape** (`toStoreShape` 변환 결과):

```js
{
  id: String(log.logId),       // store key
  logId: log.logId,            // DELETE 시 사용
  name: log.foodName || '(메뉴)',
  calories: log.logKcal || 0,
  carbs: log.logCarbs || 0,
  protein: log.logProtein || 0,
  fat: log.logFat || 0,
  mealType: log.mealType,
  time: new Date(log.ateAt),
  imgUrl: log.imgUrl ?? null,
}
```

**addMealEntry 전송 payload**:

```js
{
  foodName, mealType,
  logKcal: Number(calories),
  logCarbs: Number(carbs),
  logProtein: Number(protein),
  logFat: Number(fat),
  logSugar: 0,   // 항상 0으로 고정 (미입력 항목)
  imgUrl,
  ateAt: toLocalDateTimeStr(),
}
```

### 운동 탭

```js
// RecordPage에서 useExercise 한 번 호출 → ExerciseTab + ExerciseAddModal에 props로 전달
useExercise()  →  {
  exercises, exerciseTypes,
  typesLoading,            // ExerciseAddModal에 전달
  totalCalories, totalMinutes,
  addExerciseEntry, removeExerciseEntry,
  loading, error, refresh
}

// 마운트 시 오늘 날짜 로그 + 운동 종목 목록 동시 로드
// addExerciseEntry: POST /exercise-logs → caloriesBurned 전송 안 함 (서버 계산)
// removeExerciseEntry: DELETE /exercise-logs/{exerciseId}
```

**exercises 항목 shape** (`toStoreShape` 변환 결과):

```js
{
  id: String(log.exerciseId),   // store key
  exerciseId: log.exerciseId,   // DELETE 시 사용
  name: log.typeName,
  detail: log.title || log.typeName,
  duration: log.durationMin,
  unit: 'min',
  calories: log.caloriesBurned,
  emoji: TYPE_EMOJIS[log.typeName] ?? '🏃',
  typeId: log.typeId,
}
```

**ExerciseTab**은 `useExercise`를 직접 호출하지 않는다. `RecordPage`에서 호출한 값을 props로 받는다.

```jsx
<ExerciseTab
  exercises={exercises}
  totalCalories={totalCalories}
  totalMinutes={totalMinutes}
  loading={exerciseLoading}
  onRemove={removeExerciseEntry}
/>
```

---

## 신장/체중 표시 (DietTab·ExerciseTab 공통)

두 탭 상단에 신장/체중을 표시하고 ✏️ 버튼으로 `/profile/body`로 이동한다.

```jsx
const user = useAuthStore((s) => s.user)
const { requireAuth } = useAuthRequired()

requireAuth(() => navigate('/profile/body', { state: { from: '/record' } }))

{user?.height ?? '—'} cm
{user?.weight ?? '—'} kg
```

- 로그인 후 `AuthGuard`가 `GET /users/me`로 프로필을 로드하므로 별도 API 호출 불필요.
- `BodyProfilePage`에서 저장 시 `useAuthStore.updateUser()`로 store 갱신.

---

## RecordPage 헤더 버튼

```jsx
// "분석" 버튼 (#49AFE6, DashboardButton 인라인 컴포넌트)
navigate('/record/dashboard')

// "기록하기" 버튼 (gradient)
// 식단 탭 (activeTab === 0)
requireAuth(() => navigate('/diet'))
// 운동 탭 (activeTab === 1)
requireAuth(() => setExerciseModalOpen(true))
```

- `DashboardButton`은 `RecordPage.jsx` 내부에서만 사용하는 인라인 컴포넌트.
- 파란색 `#49AFE6`은 로고 "탄단지" 색상과 동일 — 디자인 일관성 유지.

---

## DietRecordPage — 식단 상세 기록 (/diet)

`RecordPage` 헤더의 "기록하기" 버튼(식단 탭)으로 진입. 폼 입력 + AI 영양분석.

**레이아웃**: `PageLayout` 사용 (header.title="식단 기록", header.left=뒤로가기 버튼).

### 폼 구성

| 필드 | 타입 | 필수 |
|------|------|------|
| 음식 이름 (name) | text | ✅ |
| 칼로리 (calories) | number | ✅ |
| 탄수화물 (carbs) | number | — |
| 단백질 (protein) | number | — |
| 지방 (fat) | number | — |
| 식사 유형 (mealType) | 아침/점심/저녁/간식 | 기본값: 간식 |

저장 성공 시 `/record`로 이동.

### AI 영양분석 흐름

```
ImageUploader onFile={setAiFile}    ← 파일 선택 즉시 File 객체 확보
    ↓  버튼 클릭 (aiFile 없으면 disabled)
fileToDataUrl(aiFile)               ← FileReader base64 변환 (chatbot의 canvas 리사이즈와 달리 원본)
    ↓
analyzeNutrition({ image: dataUrl }) → POST /chatbot/analyze
    ↓  성공 조건: data.menuId != null && data.menuName != null
setForm({ name, calories, carbs, protein, fat })  ← null이 아닌 값만 덮어씀
AiNutritionModal(success)
    ↓  조건 미충족 또는 예외
AiNutritionModal(fail)
```

- `ImageUploader`의 `onChange={setImgUrl}` — 서버 업로드 URL (제출 payload의 `imgUrl` 필드)
- `ImageUploader`의 `onFile={setAiFile}` — File 객체 (AI 분석용, 서버에 별도 업로드 안 함)
- AI 분석 버튼: 에메랄드 테두리 스타일 (`border-emerald-500 text-emerald-600`), 저장 버튼도 에메랄드색
- `useDiet().addMealEntry()` 직접 호출 후 navigate('/record')

---

## DashboardPage — 분석 대시보드 (/record/dashboard)

### 색상 상수

```js
const BLUE   = '#49AFE6'  // 섭취 칼로리, 적자, BMR 수치
const GREEN  = '#1b6d24'  // 운동 소비 칼로리
const ORANGE = '#f97316'  // 과잉 칼로리
const PURPLE = '#8b5cf6'  // 체중 변화 차트 (파일 하단 별도 선언)
```

### BMR 계산 (calcBMR)

```js
// 남성: 88.4 + 13.4×체중 + 4.8×키 - 5.68×나이
// 여성: 447.6 + 9.25×체중 + 3.1×키 - 4.33×나이
// gender/weight/height/age 중 하나라도 없으면 null
```

- BMR null이면 BmrCard에 "신체 정보 입력하기" 안내 → `/profile/body?from=/record/dashboard`

### 차트 구성

| 컴포넌트 | 내용 |
|----------|------|
| `BmrCard` | BMR 수치 + "i" 버튼 → `BmrInfoModal` |
| `TodayRingChart` | 3개 호 (기초대사량 연녹색, 활동소비 진녹색, 섭취 파랑) + 중앙에 순 칼로리 |
| `PeriodToggle` | 7일 / 30일 / 전체 기간 전환 |
| `NetCalorieBarChart` | 기간별 순 칼로리 막대 — **BMR은 차트 레벨에서 더함** |
| `LineChart` | 섭취/소비 칼로리 꺾은선 (공통 컴포넌트, valueKey prop으로 분기) |
| `WeightLineChart` | 체중 변화 꺾은선, 각 점 위에 수치 표시 |

### 순 칼로리 계산 주의사항

`useDashboard`의 `data[i].net`은 `intake - burned`만 계산 (BMR 미포함).  
BMR은 **차트 레벨**에서 더한다:

```js
// NetCalorieBarChart
nets = data.map(d => d.intake - ((bmr ?? 0) + d.burned))

// TodayRingChart
totalBurn = (bmr ?? 0) + burned
net = intake - totalBurn
```

### "전체" 기간 계산

```js
const allDays = useMemo(() => {
  if (!user?.createdAt) return 30
  const diff = Math.ceil((Date.now() - new Date(user.createdAt).getTime()) / 86400000) + 1
  return Math.max(diff, 1)
}, [user?.createdAt])

const days = period === 'all' ? allDays : period
```

---

## useDashboard(days)

```js
const { data, today, weightLogs, loading } = useDashboard(days)

// data: [{ date, dateStr, label, intake, burned, net }]  — net = intake - burned (BMR 미포함)
// today: data의 마지막 요소 (오늘), 없으면 { intake:0, burned:0, net:0 }
// weightLogs: [{ label, weight, recordedAt }]  — startTs 이후 항목만 필터링
```

- `days` 변경 시 `useEffect` 재실행 → 날짜 범위 재계산 후 dietLogs + exerciseLogs 병렬 조회.
- 체중 이력은 `fetchWeightLogs()`로 전체를 가져온 뒤 `startTs` 이후 항목만 필터링.
- 레이블: 7일 이하 → 요일(일/월/화/…), 그 외 → `M/D` 형식.

---

## 프로필/목표값

```js
// DietTab 고정 목표
const CALORIE_GOAL = 2000
const MACRO_GOALS = { carbs: 320, protein: 180, fat: 75 }
```

- 사용자별 목표 기능이 생기면 별도 API/스토어로 분리한다. 지금은 하드코딩.

---

## 운동 칼로리 계산

- 프론트는 `POST /exercise-logs` 요청에 `caloriesBurned`를 보내지 않는다.
- 백엔드 `ExerciseRecordService`가 `MET × 사용자 체중 × 운동 시간`으로 계산.
- `useExercise`는 응답의 `caloriesBurned`를 그대로 store에 반영.

---

## 운동 종목 이모지 매핑 (useExercise.js)

```js
const TYPE_EMOJIS = {
  '사이클': '🚴', '수영': '🏊', '자전거': '🚲',
  '헬스': '🏋️', '런닝': '🏃', '줄넘기': '🪢',
  '필라테스': '🧘', '기타': '···',
}
// 매핑 없는 종목 → 기본 '🏃'
// DB exercise_types.type_name 값과 일치해야 함
```

---

## UI 상태

| 상태 | DietTab | ExerciseTab |
|------|---------|-------------|
| 로딩 중 | "불러오는 중..." | "불러오는 중..." |
| 빈 목록 | "오늘의 식단을 추가해보세요" | "아직 기록된 운동이 없어요" |

---

## DO / DON'T

```
✅ DO
- POST /exercise-logs 요청에서 caloriesBurned 제외 — 서버가 MET×체중×시간으로 계산
- 식단/운동 API는 반드시 useDiet / useExercise 훅 경유
- BMR은 useDashboard.data에 미포함 — 차트 레벨에서 (bmr ?? 0) + burned로 더함
- DashboardPage에서 "전체" 기간은 user.createdAt 기준으로 계산

❌ DON'T
- useDietStore / useExerciseStore 직접 수정 금지 — 훅 경유
- ExerciseTab에서 useExercise 직접 호출 금지 — RecordPage에서 받은 props 사용
- CALORIE_GOAL / MACRO_GOALS 하드코딩 값을 사용자별 목표 기능 없이 Store로 빼지 말 것
- DietRecordPage의 AI 분석 성공 조건: menuId != null AND menuName != null 둘 다 확인
```

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
├── BodyMetricSummary.jsx    신장/체중 표시 공통 컴포넌트 (DietTab·ExerciseTab 공통)
│                              props: { height, weight, onEdit }
├── DietMealCard.jsx         식사 카드
├── ExerciseActivityCard.jsx 운동 활동 카드
├── ExerciseAddModal.jsx     운동 추가 모달 (운동 종목 목록 API에서 로드)
├── HistoryModal.jsx         과거 기록 조회 모달  props: { type: 'diet'|'exercise' }
├── AiNutritionModal.jsx     AI 영양분석 결과 모달 (success prop으로 성공/실패 분기)
│                              ReportModal(features/map)에서도 공유 사용
├── DietRecordPage.jsx       식단 상세 기록 페이지 (/diet 라우트)
├── recordMappers.js         데이터 매퍼 + 운동 이모지 (공통 유틸)
│                              toDietRecordItem(log)    — API 응답 → 식단 store 항목
│                              toExerciseRecordItem(log) — API 응답 → 운동 store 항목
│                              EXERCISE_TYPE_EMOJIS / getExerciseTypeEmoji(typeName)
├── useDiet.js               식단 전용 훅 — API 연동 + useDietStore 래핑
├── useExercise.js           운동 전용 훅 — API 연동 + useExerciseStore 래핑
├── useDashboard.js          대시보드 데이터 훅 — 기간별 칼로리+체중 집계
└── dashboard/               대시보드 전용 서브모듈
    ├── dashboardConstants.js  BLUE/GREEN/ORANGE/PURPLE 색상 상수 + PERIODS 배열
    ├── bmr.js                 calcBMR(gender, weight, height, age) 함수
    ├── DashboardCard.jsx      카드 공통 래퍼 컴포넌트
    ├── PeriodToggle.jsx       기간 토글 (7일/30일/전체)
    ├── BmrCard.jsx            BMR 수치 카드 + BmrInfoModal
    └── DashboardCharts.jsx    TodayRingChart / NetCalorieBarChart / LineChart / WeightLineChart
```

---

## 기능 흐름

### 식단 탭 — useDiet

```js
useDiet()  →  { meals, dailyCalories, addMealEntry, removeMealEntry, loading, refresh }
```

- 마운트 시 `AbortController` 패턴으로 오늘 날짜 로그 자동 로드 — unmount 시 진행 중인 요청 취소
- `useDietStore` 직접 사용 금지 — 반드시 `useDiet` 훅 경유

**meals 항목 shape** (`toDietRecordItem(log)` 반환값):

```js
{
  id: String(log.logId),
  logId: log.logId,            // DELETE 시 사용
  name: log.foodName || '(메뉴)',
  calories: log.logKcal || 0,
  carbs: log.logCarbs || 0,
  protein: log.logProtein || 0,
  fat: log.logFat || 0,
  mealType: log.mealType,
  time: log.ateAt ? new Date(log.ateAt) : null,
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
  logSugar: 0,   // 항상 0 고정 (미입력 항목)
  imgUrl,
  ateAt: toLocalDateTimeStr(),
}
```

### 운동 탭 — useExercise

```js
useExercise()  →  {
  exercises, exerciseTypes,
  typesLoading,            // ExerciseAddModal에 전달
  totalCalories, totalMinutes,
  addExerciseEntry, removeExerciseEntry,
  loading, error, refresh
}
```

- **AbortController 미사용** (`useDiet`와 달리) — 마운트 시 오늘 날짜 로그 + 운동 종목 목록 동시 로드
- `addExerciseEntry`: POST /exercise-logs 요청 시 `caloriesBurned` 전송 안 함 (서버 계산)

**ExerciseTab은 `useExercise`를 직접 호출하지 않는다.** `RecordPage`에서 호출한 값을 props로 받는다.

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

## API 연동

```js
// recordApi.js
fetchDietLogs(date)           // GET /diet-logs?date=yyyy-MM-dd
createDietLog(payload)        // POST /diet-logs
deleteDietLog(logId)          // DELETE /diet-logs/{logId}

fetchExerciseTypes()          // GET /exercise-types
fetchExerciseLogs(date)       // GET /exercise-logs?date=yyyy-MM-dd
createExerciseLog(payload)    // POST /exercise-logs — caloriesBurned 전송 안 함
deleteExerciseLog(exerciseId) // DELETE /exercise-logs/{exerciseId}

fetchWeightLogs()             // GET /weight-logs — 전체 체중 이력 (asc)
toLocalDateTimeStr()          // 현재 시각을 로컬 datetime 문자열로 반환 (ateAt 필드)
```

---

## 주요 규칙

### 신장/체중 표시

```jsx
const user = useAuthStore((s) => s.user)
const { requireAuth } = useAuthRequired()

<BodyMetricSummary
  height={user?.height}
  weight={user?.weight}
  onEdit={() => requireAuth(() => navigate('/profile/body', { state: { from: '/record' } }))}
/>
```

- 로그인 후 `AuthGuard`가 `GET /users/me`로 프로필을 로드하므로 별도 API 호출 불필요.
- `BodyProfilePage`에서 저장 시 `useAuthStore.updateUser()`로 store 갱신.

### RecordPage 헤더 버튼

```jsx
// "분석" 버튼 (#49AFE6)
navigate('/record/dashboard')

// "기록하기" 버튼
// 식단 탭 (activeTab === 0)
requireAuth(() => navigate('/diet'))
// 운동 탭 (activeTab === 1)
requireAuth(() => setExerciseModalOpen(true))
```

- 파란색 `#49AFE6`은 로고 "탄단지" 색상 — 디자인 일관성 유지.

### DietRecordPage — AI 영양분석 흐름

```
ImageUploader onFile={setAiFile}    ← 파일 선택 즉시 File 객체 확보
    ↓  버튼 클릭 (aiFile 없으면 disabled)
fileToDataUrl(aiFile)               ← FileReader base64 변환 (원본 크기 그대로)
    ↓
analyzeNutrition({ image: dataUrl }) → POST /chatbot/analyze
    ↓  성공 조건: data.menuId != null AND data.menuName != null (둘 다 필요)
setForm({ name, calories, carbs, protein, fat })  ← null이 아닌 값만 덮어씀
AiNutritionModal(success)
    ↓  조건 미충족 또는 예외
AiNutritionModal(fail)
```

- `ImageUploader onChange={setImgUrl}` — 서버 업로드 URL (제출 payload의 `imgUrl`)
- `ImageUploader onFile={setAiFile}` — File 객체 (AI 분석용, 서버에 별도 업로드 안 함)
- `useDiet().addMealEntry()` 직접 호출 후 `navigate('/record')`

### DashboardPage — 분석 대시보드

**색상 상수** (`dashboard/dashboardConstants.js`):

```js
export const BLUE   = '#49AFE6'  // 섭취 칼로리, 적자
export const GREEN  = '#1b6d24'  // 운동 소비 칼로리, BMR
export const ORANGE = '#f97316'  // 과잉 칼로리
export const PURPLE = '#8b5cf6'  // 체중 변화 차트
export const PERIODS = [
  { val: 7, label: '7일' },
  { val: 30, label: '30일' },
  { val: 'all', label: '전체' },
]
```

**BMR 계산** (`dashboard/bmr.js`):

```js
export function calcBMR(gender, weight, height, age) {
  if (!weight || !height || !age) return null
  if (gender === 'M') return Math.round(88.4 + 13.4 * weight + 4.8 * height - 5.68 * age)
  if (gender === 'F') return Math.round(447.6 + 9.25 * weight + 3.1 * height - 4.33 * age)
  return null
}
```

**순 칼로리 계산 주의사항**: `useDashboard`의 `data[i].net`은 `intake - burned`만 계산 (BMR 미포함). BMR은 **차트 레벨**에서 더한다.

```js
// NetCalorieBarChart
nets = data.map(d => d.intake - ((bmr ?? 0) + d.burned))

// TodayRingChart
totalBurn = (bmr ?? 0) + burned
net = intake - totalBurn
```

**"전체" 기간 계산**:

```js
const allDays = useMemo(() => {
  if (!user?.createdAt) return 30
  const diff = Math.ceil((Date.now() - new Date(user.createdAt).getTime()) / 86400000) + 1
  return Math.max(diff, 1)
}, [user?.createdAt])
```

### useDashboard

```js
const { data, today, weightLogs, loading } = useDashboard(days)
// data: [{ date, dateStr, label, intake, burned, net }]  — net = intake - burned (BMR 미포함)
// today: data의 마지막 요소, 없으면 { intake:0, burned:0, net:0 }
// weightLogs: [{ label, weight, recordedAt }]  — startTs 이후 항목만 필터링
```

- `days` 변경 시 dietLogs + exerciseLogs 병렬 조회
- 체중 이력은 `fetchWeightLogs()`로 전체 가져온 뒤 `startTs` 이후 항목만 필터링
- 레이블: 7일 이하 → 요일(일/월/화/…), 그 외 → `M/D` 형식

### 프로필/목표값

```js
// DietTab 고정 목표 (하드코딩)
const CALORIE_GOAL = 2000
const MACRO_GOALS = { carbs: 320, protein: 180, fat: 75 }
```

### 운동 종목 이모지 매핑

```js
export const EXERCISE_TYPE_EMOJIS = {
  '사이클': '🚴', '수영': '🏊', '자전거': '🚲',
  '헬스': '🏋️', '런닝': '🏃', '줄넘기': '🪢',
  '필라테스': '🧘', '기타': '···',
}
// 매핑 없는 종목 → 기본 '🏃'
// DB exercise_types.type_name 값과 일치해야 함
```

---

## DO / DON'T

```
✅ DO
- POST /exercise-logs 요청에서 caloriesBurned 제외 — 서버가 MET×체중×시간으로 계산
- 식단/운동 API는 반드시 useDiet / useExercise 훅 경유
- BMR은 useDashboard.data에 미포함 — 차트 레벨에서 (bmr ?? 0) + burned로 더함
- DashboardPage에서 "전체" 기간은 user.createdAt 기준으로 계산
- DietRecordPage AI 분석 성공 조건: menuId != null AND menuName != null 둘 다 확인

❌ DON'T
- useDietStore / useExerciseStore 직접 수정 금지 — 훅 경유
- ExerciseTab에서 useExercise 직접 호출 금지 — RecordPage에서 받은 props 사용
- CALORIE_GOAL / MACRO_GOALS 하드코딩 값을 사용자별 목표 기능 없이 Store로 빼지 말 것
```

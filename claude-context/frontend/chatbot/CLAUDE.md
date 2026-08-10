# CLAUDE.md — features/chatbot/

AI 기반 메뉴 추천 + 이미지 영양성분 분석 챗봇. 백엔드 프록시를 통해 AI 서버와 통신한다.

---

## 컴포넌트 구조

```
chatbot/
├── ChatbotPage.jsx   채팅 UI — 메시지 버블, 추천 카드, 분석 카드, 네/아니오 확인 버튼
│                     이미지 미리보기(pendingImage) + 클립보드 붙여넣기(handlePaste)
└── useChatbot.js     채팅 상태 관리 — send / sendImage / confirmDiet / isConfirming
```

---

## 기능 흐름

### 메뉴 추천 (텍스트 입력)

```
사용자 입력 → send(text)
  → useMapStore.center(EPSG:3857)을 toLonLat(center)로 변환
  → POST /chatbot/recommend  { lat, lng, weather?, temperature?, message }
  → 응답: { reason, recommendations: Item[] }
  → AssistantBubble (reason 텍스트 + RecommendCard 목록)
  → "원하시는 메뉴를 누르시면 해당 매장으로 이동합니다." 메시지 추가
```

- 추천 결과에서는 식단 기록 확인을 하지 않는다.
- `center`가 없으면 "지도 화면에서 현재 위치를 먼저 설정해 주세요." 안내 후 종료.

### 이미지 영양성분 분석

```
카메라 버튼 클릭 or 클립보드 붙여넣기 → pendingImage state { file, previewUrl }
  → 전송 버튼 → sendImage(file, text?)
  → Canvas로 이미지 리사이즈 (max 1024px, JPEG 85%) → base64 Data URL
  → POST /chatbot/analyze  { image: "data:image/jpeg;base64,..." }
  → 응답: { menuId?, menuName?, kcal?, carbs?, protein?, fat?, nutritionGrade?, reason }
  → AssistantBubble (reason 텍스트 + AnalysisCard)
  → hasMenu 조건 충족 시 POST /images/upload?domain=diet 로 이미지 업로드 → imgUrl 획득
  → 식단 기록 확인 프롬프트 (promptDietAdd)
```

- `hasMenu = data.menuId != null && data.menuName != null`
- 메뉴 미매칭이면 AnalysisCard 없이 reason만 표시
- 이미지 업로드 실패해도 imgUrl 없이 식단 기록 진행 (try-catch로 무시)

### 이미지 입력 방법

```js
// 1. 카메라 아이콘 클릭 → fileInputRef.current.click()
// 2. 클립보드 붙여넣기 → handlePaste 이벤트 (image/* 타입 파일만 처리)
// → setPendingImage({ file, previewUrl: URL.createObjectURL(file) })
```

- `pendingImage.previewUrl`은 ObjectURL → 컴포넌트 언마운트 또는 교체 시 `URL.revokeObjectURL`로 해제
- 전송 후 `clearPendingImage()`로 상태 초기화

### 식단 기록 추가 확인

```
promptDietAdd(items) → "식단 기록에 추가하시겠어요?" 메시지 + pendingDietItems 상태 활성
  → 네 버튼 / 아니오 버튼 (isConfirming === true 시 표시)
  → 네: confirmDiet(true) → POST /diet-logs 다건 병렬 호출
  → 아니오: confirmDiet(false) → 취소 메시지
```

- 텍스트로 "네"를 입력해도 `send()` 내에서 `confirmDiet` 분기 처리됨
- 401 응답 시: "식단 기록을 추가하려면 로그인이 필요해요."

### 추천 카드 → 지도 이동

```
RecommendCard 클릭 → handleStoreClick(item)
  → fromLonLat([item.lon, item.lat]) → EPSG:3857 좌표
  → useMapStore.setPendingStore({ id, name, lat, lon, grade, x, y })
  → navigate('/map')
  → MapPage useEffect: pendingStore 감지 → moveTo(x, y, 16) + selectStore + clearPendingStore
```

---

## API 연동

```js
// chatbotApi.js — 두 엔드포인트 모두 공개 (인증 불필요)
getRecommendations({ lat, lng, weather?, temperature?, message })
// → { reason: string, recommendations: Item[] }
// Item: { storeId, storeName, address, lat, lon, menuId, menuName, kcal, carbs, protein, fat, nutritionGrade, nutritionTags }

analyzeNutrition({ image })  // image: base64 Data URL (canvas 리사이즈 후 JPEG)
// → { menuId?, menuName?, kcal?, carbs?, protein?, fat?, nutritionGrade?, nutritionTags?, reason }
```

---

## 주요 규칙

### 컴포넌트 세부

| 컴포넌트 | 역할 |
|----------|------|
| `RecommendCard` | 추천 메뉴 카드 — `<button>`, `onStoreClick` prop으로 지도 이동 |
| `AnalysisCard` | 영양성분 분석 결과 카드 — blue 배경 |
| `MacroRow` | 탄단지·칼로리 수치 행 — null이 아닌 값만 표시 |
| `AssistantBubble` | AI 응답 버블 — `onStoreClick` prop을 `RecommendCard`에 전달 |

```js
const GRADE_STYLE = {
  GREEN:  'bg-green-50 text-green-700 border-green-200',
  YELLOW: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  RED:    'bg-red-50 text-red-700 border-red-200',
}
const GRADE_LABEL = { GREEN: '우수', YELLOW: '보통', RED: '주의' }
```

### 이미지 리사이즈

```js
const MAX_IMAGE_PX = 1024
// Canvas로 가장 긴 변을 1024px 이하로 축소 + JPEG 85% 품질로 인코딩
// 실패 시 "이미지를 읽지 못했어요." 메시지 표시
```

- `DietRecordPage`의 AI 분석은 캔버스 리사이즈 없이 원본 파일 그대로 base64 변환 — 챗봇과 다름

### Zustand 의존

```js
// useChatbot.js — 읽기만
const center      = useMapStore((s) => s.center)       // 추천 요청 좌표 기준 (EPSG:3857 → toLonLat)
const weather     = useMapStore((s) => s.weather)
const temperature = useMapStore((s) => s.temperature)

// ChatbotPage.jsx — 쓰기
const setPendingStore = useMapStore((s) => s.setPendingStore)  // 카드 클릭 → 지도 이동
```

### mealType 자동 결정

```js
function getMealType() {
  const h = new Date().getHours()
  if (h >= 6  && h < 11) return '아침'
  if (h >= 11 && h < 15) return '점심'
  if (h >= 18 && h < 22) return '저녁'
  return '간식'
}
```

---

## DO / DON'T

```
✅ DO
- 추천 결과에는 식단 기록 확인 프롬프트를 띄우지 않는다 (이미지 분석 후만)
- RecommendCard는 항상 <button> 태그 — div로 바꾸지 말 것
- 이미지는 반드시 canvas 리사이즈 후 전송 (원본 대용량 방지)

❌ DON'T
- useChatbot에서 navigate 직접 호출 금지 — 지도 이동은 ChatbotPage의 handleStoreClick이 담당
- 이미지 Data URL을 messages 배열에 직접 저장하지 말 것 (imageDataUrl 필드로 분리)
- center 없을 때 추천 요청 금지 — 위치 미설정 안내 메시지로 대체
- 이미지 리사이즈 없이 원본 파일을 base64로 직접 전송 금지
```

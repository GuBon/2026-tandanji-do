# CLAUDE.md — src/features/map/

map 폴더는 OpenLayers 기반 GIS 지도, VWorld WMTS 타일, 기상청 날씨 API, TMap 경로 API를 통합한 핵심 기능이다.

---

## 아키텍처 원칙

### 지도 인스턴스 관리
- `MapView.jsx`에서만 OpenLayers `Map` 인스턴스를 생성한다.
- 생성된 인스턴스는 반드시 `useMapStore.setMapInstance(map)`으로 Zustand에 저장한다.
- 다른 컴포넌트/훅에서는 `useMapStore(s => s.mapInstance)`로만 참조한다. 직접 생성 금지.
- `useEffect` cleanup에서 반드시 `map.setTarget(null)` + `setMapInstance(null)` 호출.

### 레이어 ID 규칙
- 모든 레이어에는 `properties: { id: '레이어명' }` 형태로 고유 ID를 부여한다.
- 레이어 추가 전 `map.getLayers().getArray().find(l => l.get('id') === id)` 로 중복 확인.
- 기존 레이어 ID: `vworld-base` — 변경하거나 재생성하지 말 것.
- 경로 레이어 ID: `route-{seq}` 패턴 (useRouteLayer가 관리) — 직접 생성 금지.

### 좌표 규칙
- **저장/전달**: 경도(lon), 위도(lat) 순서 — storeApi normalizer 및 `setLatLon(lat, lon)` 일관 유지.
- **OpenLayers 입력**: `fromLonLat([lon, lat])` — lon 먼저, lat 나중.
- **지도 내부 좌표계**: EPSG:3857(Web Mercator). 외부에 노출할 때는 반드시 `toLonLat()`로 역변환.
- 마커 화면 위치: `mapInstance.getPixelFromCoordinate(coord)` — `useMapMarkers.js`에서만 처리.

---

## 커스텀 훅 책임 범위

| 훅 | 담당 |
|----|------|
| `useMapUI` | activeFilters(Set) / selectedStore / filterOpen 등 순수 UI 상태 |
| `useMapStores` | 지도 bbox 추출 → GET /stores/search API 호출 → stores/loading/error 상태, 이전 요청 AbortController로 취소 |
| `useStoreDetail` | 매장 상세 + 메뉴 + 리뷰 조회, 거리 정보 병합, 리뷰 작성/좋아요 |
| `useMapMarkers` | 지도 좌표 → 픽셀좌표 변환 (postrender 이벤트 구독, storesRef 패턴) |
| `useLocationPixel` | 내 위치(latLon) → 지도 픽셀 좌표 변환 (postrender 구독) — 내 위치 파란 점 마커 |
| `useGeolocation` | 브라우저 위치 획득 + 지도 이동 + 권한 처리 |
| `useWeather` | 기상청 API 호출, store에 weather/temperature/forecast 저장 |
| `useRoute` | TMap API 호출 — 도보/자전거/차량/대중교통 경로, 거리/시간/칼로리 계산 |
| `useRouteLayer` | 경로 GeoJSON → OpenLayers VectorLayer 추가/제거, 지도 뷰 fit |
| `useMcpHost` | `window.__tdjmap__` 전역 MCP API 노출 — 다른 곳에서 수정 금지 |
| `useVWorldLayer` | VWorld WMTS 레이어 객체 생성 (훅 아님, 팩토리 함수) |

- 훅 하나의 책임이 두 가지 이상이면 분리한다.
- `MapPage.jsx` 로직이 50줄을 초과하면 즉시 커스텀 훅으로 추출한다.

---

## 날씨 데이터 흐름 (변경 금지)

```
useGeolocation → setLatLon → useMapStore.latLon
                                    ↓
                             useWeather (latLon 감시)
                                    ↓
                기상청 API → setWeather / setTemperature / setForecast
                                    ↓
                     WeatherWidget + WeatherCanvas (구독)
```

- `weather` 값: `'sunny' | 'partly-cloudy' | 'cloudy' | 'rain' | 'snow'` 외 추가 금지.
- WeatherCanvas는 `requestAnimationFrame` 기반 루프 — `useEffect` cleanup에서 `cancelAnimationFrame` 필수.

---

## Z-Index 계층

| 클래스 | 값 | 용도 |
|--------|----|------|
| `z-map` | 0 | MapView 컨테이너 |
| `z-marker` | 30 | MapMarker 오버레이 + 내 위치 파란 점 |
| `z-canvas` | 35 | WeatherCanvas (비/눈 애니메이션) |
| `z-ui` | 50 | SearchOverlay, WeatherWidget, FAB, StoreCard |
| `z-modal` | 1000 | FilterBottomSheet, ReportModal (배경 dim + 패널 모두) |

- `z-[임의값]`으로 계층을 깨지 말 것 — 위 표에 없는 값이 필요하면 `tailwind.config.js`에 먼저 등록.
- 모달/바텀시트는 예외 없이 `z-modal`.

---

## Zustand Store 사용 규칙

- `useMapStore`에서 **각 상태를 개별 selector로** 구독한다.
  ```js
  // ✅
  const weather = useMapStore(s => s.weather)
  const moveTo  = useMapStore(s => s.moveTo)

  // ❌
  const store = useMapStore()  // 전체 구독 — 불필요한 리렌더링 유발
  ```
- `mapInstance`는 읽기 전용으로 참조만 한다. 외부에서 메서드를 직접 호출해야 할 때는 `moveTo` 같은 store 액션을 추가한다.

---

## 컴포넌트 규칙

- `MapPage.jsx`는 **컴포넌트 조합과 훅 연결**만 담당한다. 비즈니스 로직은 훅으로 분리.
- 모달/바텀시트는 `overflow-hidden` 부모 바깥에서 렌더링한다 (`MapPage` 최하단, `fixed` 포지션).
- `StoreCard({ store, onClose, onRoute })`: `onRoute` — "길찾기" 버튼 클릭 시 `RouteBottomSheet` 열기. 썸네일은 `store.brandLogoUrl`, 메타는 `address / distance / walkTime / kcal / rating` 표시.
- `StoreCard`, `FilterBottomSheet`, `ReportModal`의 내부 상태는 외부 store에 올리지 않는다 (순수 UI 상태).

### ReportVoteCard — 공유 투표 카드

`ReportVoteCard.jsx`는 `VotingBottomSheet`와 `ReportClusterBottomSheet` 양쪽에서 사용하는 공유 컴포넌트다.

**레이아웃 (`StoreCard` 형식 기준)**:
- **1행**: 메뉴명 (`text-[17px] font-bold`, line-clamp-2) + 날짜 (`text-[10px]`, 오른쪽 정렬)
- **2행**: `w-20 h-20 rounded-2xl` 이미지 + `NutritionCell` (단백질/탄수화물/지방, `flex-1 py-1`) + 찬성/반대 버튼

```jsx
<ReportVoteCard report={report} onVote={handleVote} />
```

- `report`: `{ reportId, menuName, imageUrl, protein, carbs, fat, upVotes, downVotes, myVote, createdAt }`
- `onVote(reportId, 'UP'|'DOWN')`: Promise 반환 — 카드 내부에서 optimistic update 처리
- 이미지 없을 때: 회색 박스 + "사진" 텍스트 placeholder
- Optimistic update: `optimistic` state로 서버 응답 전 카운트 즉시 반영, 실패 시 롤백

### VotingBottomSheet — 매장 지도 이동

`VotingBottomSheet`의 매장 그룹 헤더는 클릭 가능한 `<button>`이다.

```
grouped 구조: { storeName, storeAddress, storeLat, storeLon, storeId, items[] }
헤더 클릭 → onNavigate?.(group) + onClose()
```

- `storeLat`/`storeLon`이 있는 그룹만 클릭 가능 (오른쪽 파란 chevron 표시)
- 좌표 없는 그룹: `disabled` (클릭 불가, chevron 미표시)
- `MapPage.jsx`에서 `onNavigate({ storeLat, storeLon })` → `fromLonLat([storeLon, storeLat])` → `moveTo(x, y, 17)` + 시트 닫힘
- 각 제보 카드는 `ReportVoteCard` 공유 컴포넌트 사용 (`imageUrl` 포함)

### ReportModal — AI 영양성분 분석

`ReportModal.jsx` + `useReport.js` 조합으로 동작한다.

**폼 섹션 순서** (UX 원칙: 버튼 아래쪽 필드가 자동 채워지는 구조 유지):
1. 매장명 검색 (카카오 장소 API)
2. 이미지 첨부 + **AI 영양성분 분석 버튼**
3. 메뉴명 ← AI가 자동 채움
4. 영양성분(탄/단/지) ← AI가 자동 채움

**AI 분석 흐름**:
```
ImageUploader onFile={setAiFile}   ← 파일 선택 즉시 File 객체 확보 (업로드 URL과 별개)
    ↓  버튼 클릭
fileToDataUrl(aiFile)              ← FileReader로 base64 Data URL 변환
    ↓
POST /chatbot/analyze { image: dataUrl }
    ↓  data.menuName != null 이면 success
setFieldValue('menuName', data.menuName)
setFieldValue('carbs'|'protein'|'fat', String(value))
AiNutritionModal(success|fail)
```

**`useReport` API**:
- `setField(key)` — input onChange 이벤트 핸들러 반환 (이벤트 객체 필요)
- `setFieldValue(key, value)` — 값을 직접 지정 (AI 자동 채우기 등 이벤트 없는 경우)

**`ImageUploader` 두 가지 prop 구분**:
- `onChange={setImageUrl}` — 업로드 완료 후 서버 URL (제보 제출 시 사용)
- `onFile={setAiFile}` — 선택 즉시 File 객체 (AI 분석용 base64 변환에 사용)

**AiNutritionModal**: `features/record/AiNutritionModal.jsx`를 공유. `success` prop으로 성공/실패 분기.

### MapMarker — 2단계 표시

`MapPage.jsx`에서 `moveend` 이벤트로 현재 zoom을 `mapZoom` state로 추적한다.

| zoom | 표시 | 설명 |
|------|------|------|
| < 15 | dot (w-4 h-4 원형) | 넓은 지역 탐색 — 마커 혼잡 방지 |
| ≥ 15 | 탄단지 박스 | ~1km 반경 이하 — 영양정보 의미 있음 |

```jsx
// MapPage.jsx
const [mapZoom, setMapZoom] = useState(12)
useEffect(() => {
  if (!mapInstance) return
  const onMoveEnd = () => setMapZoom(mapInstance.getView().getZoom() ?? 12)
  mapInstance.on('moveend', onMoveEnd)
  return () => mapInstance.un('moveend', onMoveEnd)
}, [mapInstance])

<MapMarker ... compact={mapZoom < 15} />
```

- dot 색상: grade별 arrow 색 (`#4ADE80` / `#FACC15` / `#F87171`), grade 없음: `#9CA3AF`(회색)
- dot 탭 시에도 `onClick` 연결 → StoreCard 정상 동작
- 박스 크기: `w-[80px] h-auto` (고정 높이 제거 — 가게명이 가려지는 버그 방지)
- 가게명: `text-[7px] font-semibold truncate`
- 줌 기준을 바꿀 때 `MapPage.jsx`의 `compact={mapZoom < 15}` 한 곳만 수정

### grade null 처리 규칙

- `grade: null` = 메뉴 정보 미등록 매장. `normalizeMarker()`에서 `nutritionGrade ?? null` — `'GREEN'` 폴백 절대 금지.
- MapMarker: grade 없으면 회색 스타일(`bg: #F3F4F6`, `arrow: #9CA3AF`), 박스에 "정보 없음" 표시
- StoreCard: grade 없으면 영양소 셀·태그 대신 "아직 메뉴 정보가 등록되지 않은 매장이에요" 안내
- MapPage 필터 로직: `gradeFilters.length > 0`이면 해당 grade 매장만 통과 (null grade는 자동 제외)

---

## 데이터 소스

- 매장 데이터: `src/api/storeApi.js` — `GET /stores/search` (bbox + keyword 기반 마커 목록), `GET /stores/{id}` + `/menus` (상세/메뉴)
- `useMapStores` 훅이 `mapInstance.moveend` 이벤트마다 bbox를 추출해 API 호출
- 빠른 이동/필터 변경 시 오래된 검색 응답이 최신 마커를 덮지 않도록 `AbortController` 패턴 유지
- 마커 포맷: `{ id, name, address, category, lat, lon, brandLogoUrl, rating, grade, tags, nutrition, raw }` — `normalizeMarker()`가 변환
  - `grade`: `'GREEN' | 'YELLOW' | 'RED' | null` — null은 메뉴 정보 미등록
  - `brandLogoUrl`: 브랜드 로고 URL (null 가능) — StoreCard 썸네일 이미지로 사용
  - `rating`: 리뷰 평균 별점 float (null 가능)
  - `address`: 매장 주소 문자열
- 태그 파생 규칙 (`nutritionTags` 없을 때): protein≥25→고단백, carbs≤40→저탄수, carbs≥80→고탄수, fat≤10→저지방, fat≥25→고지방
- 메뉴 포맷: `nutrition`은 표시용 문자열(`"45g"`), `raw`는 정렬용 숫자(`45`) — 둘 다 항상 함께 제공
- `category` 값: `'샐러드' | '포케' | '한식뷔페'`

### 필터 시스템

필터는 **백엔드 필터**와 **프론트 필터** 두 계층으로 나뉜다.

**백엔드 필터** (`useMapStores`에 전달):
- `keyword`: 매장명 검색 — SearchOverlay에서 입력, debounce 300ms 후 `storeFilters.keyword`로 전달

**프론트 필터** (`MapPage.jsx`의 `visibleStores` useMemo):
- `activeFilters(Set)`: 등급 칩(GREEN/YELLOW/RED) + 태그 칩(#고단백/등)
- `nutritionFilters`: 영양성분 슬라이더 값 (`{ carbs: { min, max }, protein: { min, max }, fat: { min, max } }`)
- 백엔드 응답 stores에 대해 프론트 필터를 추가로 적용하는 구조

```js
// MapPage.jsx 필터 로직
const visibleStores = useMemo(() => {
  const gradeFilters = [...activeFilters].filter(f => ['GREEN', 'YELLOW', 'RED'].includes(f))
  const tagFilters   = [...activeFilters].filter(f => f.startsWith('#'))
  return stores.filter(s => {
    const gradeMatch     = gradeFilters.length === 0 || gradeFilters.includes(s.grade)
    const tagMatch       = tagFilters.length === 0   || tagFilters.some(f => s.tags?.includes(f.replace('#', '')))
    const nutritionMatch = !nutritionFilters || Object.entries(nutritionFilters).every(([key, range]) => {
      const value = s.raw?.[key]
      return value != null && value >= range.min && value <= range.max
    })
    return gradeMatch && tagMatch && nutritionMatch
  })
}, [stores, activeFilters, nutritionFilters])
```

**FilterBottomSheet UI** (검색창 필터 아이콘으로 열림):
- 매장 등급 칩 (GREEN/YELLOW/RED → 균형식/일반식/주의식)
- 영양소 태그 칩 (고단백/고지방/고탄수/저탄수) — 이모지 없이 한글만
- 영양성분 슬라이더 (탄수화물/단백질/지방) — 적용 시 `onApplyNutritionFilters` 콜백
- 헤더 `?` 버튼 → `FilterLegendSheet` 열기

- 등급·태그는 **카테고리 간 AND, 카테고리 내 OR** (예: GREEN + 고단백 → 균형식이면서 고단백)
- 슬라이더 값은 `nutritionFilters` state로 관리 — `stores.raw[key]` 숫자와 비교

### MapStorePage 메뉴 탭 기능

- `MapStorePage.jsx`는 상세 페이지 조립만 담당한다.
- 상세 데이터 로딩/거리 병합/리뷰는 `useStoreDetail.js`, UI 묶음은 `StoreDetailSections.jsx`가 담당한다.
- `useStoreDetail` 반환값: `{ store, reviews, loading, error, submitReview, toggleReviewLike, reviewSubmitting, reviewError }`

**StoreDetailSections.jsx 내보내는 컴포넌트/상수**:
```
StoreHero({ store, onBack, onShare })
  — 16:9 히어로 이미지 + 뒤로/공유 버튼

StoreInfoSection({ store })
  — 매장명/카테고리/주소/거리/도보시간/칼로리/rating/태그 표시

StoreTabs({ activeTab, onChange })
  — '메뉴' / '리뷰' 탭 전환

MenuToolbar({ gradeFilter, onGradeChange, sortKey, onSortChange })
  — grade 필터 칩(전체/GREEN/YELLOW/RED) + 정렬 드롭다운

StoreDetailContent({
  activeTab, store, reviews, gradeFilter, sortKey,
  onCreateReview, onToggleReviewLike, reviewSubmitting, reviewError
})
  — 메뉴 탭: MenuItem 목록 (grade 필터 + raw 숫자 정렬)
  — 리뷰 탭: ReviewComposer + ReviewItem 목록

SORT_OPTIONS  — [{ key: 'protein'|'carbs'|'fat', label }]
```

- **grade 필터**: 전체 / 🟢 우수(GREEN) / 🟡 보통(YELLOW) / 🔴 주의(RED) — 메뉴 카드 배경·테두리도 grade별 색상
- **정렬 드롭다운**: 단백질순 / 탄수화물순 / 지방순 — `menu.raw[key]` 숫자로 내림차순 정렬
- 정렬은 `nutrition` 문자열이 아닌 `raw` 숫자로 해야 함 — 문자열 비교 시 정렬 불작동
- 리뷰: `ReviewComposer`(별점 + textarea + 등록), `ReviewItem`(닉네임/날짜/좋아요 토글)

### TMap 경로 안내 (RouteBottomSheet)

`MapPage.jsx`에서 StoreCard의 "경로 안내" 버튼 클릭 시 `RouteBottomSheet`가 열린다.

```
RouteBottomSheet
├── useRoute(store)      — TMap API 호출, mode(walk/bike/transit/car) 관리
└── useRouteLayer(routeData, mode) — 경로 VectorLayer 추가/제거, 지도 뷰 fit
```

- **이동 수단**: 도보(walk) / 자전거(bike) / 대중교통(transit) / 차량(car)
- **대중교통**: TMap transit API → leg별 수단(WALK/BUS/SUBWAY/TRAM) 분리 렌더링
- **자전거**: TMap 자전거 전용 API 없음 → 도보 경로를 가져와 자전거 속도(15km/h)로 시간 재계산
- **칼로리**: MET × 체중(user.weight 우선, 없으면 65kg) × 시간(시간 단위)
- `VITE_TMAP_API_KEY` → Vite 프록시 `/api/tmap` 경유

### useMapMarkers 주의 사항
- `stores`를 effect deps에 넣으면 filter()가 매 렌더마다 새 배열을 만들어 무한 루프 발생.
- 반드시 `storesRef` 패턴 유지: `storesRef.current = stores`로 최신값을 읽고, effect deps는 `[mapInstance]`만.
- `setPixelPositions`는 functional update로 위치 변경 시에만 새 객체 반환 (불필요한 리렌더 방지).

### useLocationPixel 사용 방법
```jsx
// MapPage.jsx
const locationPixel = useLocationPixel()

{locationPixel && (
  <div className="absolute z-marker -translate-x-1/2 -translate-y-1/2 pointer-events-none"
       style={{ left: locationPixel.left, top: locationPixel.top }}>
    {/* 파란 점 마커 */}
  </div>
)}
```
- `postrender` 이벤트로 latLon 변경/지도 이동 시 자동 업데이트.
- latLon 없거나 mapInstance 없으면 `null` 반환.

### useStoreDistance 주의 사항
- 거리/도보 시간은 현재 위치(`useMapStore.latLon`)와 매장 좌표의 Haversine 직선거리 기준.
- 칼로리는 `useAuthStore.user.weight`를 우선 사용하고, 없으면 `DEFAULT_WEIGHT_KG`를 사용한다.

---

## DO / DON'T

- `MapView.jsx` 밖에서 `new Map(...)` 생성 금지.
- `window.__tdjmap__` 외부에서 직접 수정 금지 (`useMcpHost.js`에서만 관리).
- API 키(`VITE_VWORLD_API_KEY`, `VITE_WEATHER_API_KEY`, `VITE_TMAP_API_KEY`)를 컴포넌트 코드에 하드코딩 금지 — `.env`에서만 참조.
- 지도 레이어를 ID 없이 추가 금지 (중복 레이어 버그 원인).
- `fromLonLat` 인자 순서 반전 금지 — `[lon, lat]` 고정.
- 영양성분 슬라이더 필터를 백엔드 쿼리로 보내지 말 것 — 프론트 필터로만 처리.

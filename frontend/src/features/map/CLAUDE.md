# CLAUDE.md — src/features/map/

map 폴더는 OpenLayers 기반 GIS 지도, VWorld WMTS 타일, 기상청 날씨 API를 통합한 핵심 기능이다.

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
| `useStoreDetail` | 매장 상세 + 메뉴 + 리뷰 조회, 거리 정보 병합 |
| `useMapMarkers` | 지도 좌표 → 픽셀좌표 변환 (postrender 이벤트 구독, storesRef 패턴) |
| `useGeolocation` | 브라우저 위치 획득 + 지도 이동 + 권한 처리 |
| `useWeather` | 기상청 API 호출, store에 weather/temperature/forecast 저장 |
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
| `z-marker` | 30 | MapMarker 오버레이 |
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
- `StoreCard`, `FilterBottomSheet`, `ReportModal`의 내부 상태는 외부 store에 올리지 않는다 (순수 UI 상태).

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
- MapPage 필터 로직: `activeFilters.size > 0`이면 `!s.grade` 매장은 즉시 제외 (등급/태그 필터 모두 해당)

---

## 데이터 소스

- 매장 데이터: `src/api/storeApi.js` — `GET /stores/search` (bbox 기반 마커 목록), `GET /stores/{id}` + `/menus` (상세/메뉴)
- `useMapStores` 훅이 `mapInstance.moveend` 이벤트마다 bbox를 추출해 API 호출
- 빠른 이동/필터 변경 시 오래된 검색 응답이 최신 마커를 덮지 않도록 `AbortController` 패턴 유지
- 마커 포맷: `{ id, name, category, lat, lon, grade, tags, nutrition: { carbs, protein, fat } }` — `normalizeMarker()`가 변환
- `grade`: `'GREEN' | 'YELLOW' | 'RED' | null` — null은 메뉴 정보 미등록
- 메뉴 포맷: `nutrition`은 표시용 문자열(`"45g"`), `raw`는 정렬용 숫자(`45`) — 둘 다 항상 함께 제공
- `category` 값: `'샐러드' | '포케' | '한식뷔페'`

### 필터 시스템

- **상태**: `useMapUI`의 `activeFilters: Set<string>`, `toggleActiveFilter(key)` 로 토글, `null` 전달 시 전체 초기화
- **UI**: `FilterBottomSheet` — 검색창 필터 아이콘으로 열림. 퀵필터 바 없음 (`QuickFilters.jsx` 미사용)
  - 매장 등급 칩 (GREEN/YELLOW/RED → 균형식/일반식/주의식)
  - 영양소 태그 칩 (고단백/고지방/고탄수/저탄수) — 이모지 없이 한글만
  - 영양성분 슬라이더 (탄수화물/단백질/지방/당류)
  - 헤더 `?` 버튼 → `FilterLegendSheet` 열기
- **영양성분 슬라이더 적용**: `MapPage`의 `mapFilters` → `useMapStores(mapFilters)` → `GET /stores/search`의 `min_protein`, `max_carbs`, `max_fat`, `max_sugar` 쿼리로 전달
- **필터 로직** (MapPage.jsx):
  - 필터 없음 → 모든 매장 표시 (null grade 포함)
  - 필터 있음 → null grade 매장 즉시 제외
- 등급·태그는 **카테고리 간 AND, 카테고리 내 OR** (예: GREEN + 고단백 → 균형식이면서 고단백)
- 영양성분 슬라이더는 백엔드 필터, 등급·태그 칩은 프론트 필터다. 둘을 합치면 백엔드 결과에 대해 프론트 칩 필터가 추가로 적용된다.

### MapStorePage 메뉴 탭 기능

- `MapStorePage.jsx`는 상세 페이지 조립만 담당한다.
- 상세 데이터 로딩/거리 병합은 `useStoreDetail.js`, 히어로/정보/탭/메뉴/리뷰 UI 묶음은 `StoreDetailSections.jsx`가 담당한다.
- 더 세세한 파일 분리는 중복이 실제로 생길 때만 진행한다.
- **grade 필터**: 전체 / 🟢 우수(GREEN) / 🟡 보통(YELLOW) / 🔴 주의(RED) — 메뉴 카드 배경·테두리도 grade별 색상
- **정렬 드롭다운**: 단백질순 / 탄수화물순 / 지방순 — `menu.raw[key]` 숫자로 내림차순 정렬
- 정렬은 `nutrition` 문자열이 아닌 `raw` 숫자로 해야 함 — 문자열 비교 시 정렬 불작동

### useMapMarkers 주의 사항
- `stores`를 effect deps에 넣으면 filter()가 매 렌더마다 새 배열을 만들어 무한 루프 발생.
- 반드시 `storesRef` 패턴 유지: `storesRef.current = stores`로 최신값을 읽고, effect deps는 `[mapInstance]`만.
- `setPixelPositions`는 functional update로 위치 변경 시에만 새 객체 반환 (불필요한 리렌더 방지).

### useStoreDistance 주의 사항
- 거리/도보 시간은 현재 위치(`useMapStore.latLon`)와 매장 좌표의 Haversine 직선거리 기준.
- 칼로리는 `useAuthStore.user.weight`를 우선 사용하고, 없으면 `DEFAULT_WEIGHT_KG`를 사용한다.

---

## ❌ 금지 사항

- `MapView.jsx` 밖에서 `new Map(...)` 생성 금지.
- `window.__tdjmap__` 외부에서 직접 수정 금지 (`useMcpHost.js`에서만 관리).
- API 키(`VITE_VWORLD_API_KEY`, `VITE_WEATHER_API_KEY`)를 컴포넌트 코드에 하드코딩 금지 — `.env`에서만 참조.
- 지도 레이어를 ID 없이 추가 금지 (중복 레이어 버그 원인).
- `fromLonLat` 인자 순서 반전 금지 — `[lon, lat]` 고정.

# CLAUDE.md — src/features/map/

map 폴더는 OpenLayers 기반 GIS 지도, VWorld WMTS 타일, 기상청 날씨 API, TMap 경로 API를 통합한 핵심 기능이다.

---

## 아키텍처 원칙

### 지도 인스턴스 관리

- `MapView.jsx`에서만 OpenLayers `Map` 인스턴스를 생성한다.
- 생성된 인스턴스는 반드시 `useMapStore.setMapInstance(map)`으로 Zustand에 저장한다.
- 다른 컴포넌트/훅에서는 `useMapStore(s => s.mapInstance)`로만 참조한다. 직접 생성 금지.
- `useEffect` cleanup에서 반드시 `map.setTarget(null)` + `setMapInstance(null)` 호출.
- `MapView.jsx`는 `center` / `zoom`을 초기값으로만 사용한다. 마운트 후에는 effect deps에 넣지 않으며, 지도 이동은 `View.animate()` 또는 store의 `moveTo` 액션으로 제어한다.
- `useMcpHost()`와 `useWeather()`는 `MapView.jsx` 내부에서 마운트된다.

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

## 기능 흐름

### 커스텀 훅 책임 범위

| 훅 | 담당 |
|----|------|
| `useMapUI` | activeFilters(Set) / selectedStore / filterOpen 등 순수 UI 상태 |
| `useMapStores` | 지도 bbox 추출 → GET /stores/search API 호출 → stores/loading/error 상태, 이전 요청 AbortController로 취소 |
| `useStoreDetail` | 매장 상세 + 메뉴 + 리뷰 + 메뉴제보 조회, 거리 정보 병합, 리뷰 작성/좋아요, 메뉴제보 투표(toggleMenuReportVote) |
| `useMapMarkers` | 지도 좌표 → 픽셀좌표 변환 (postrender 이벤트 구독, storesRef 패턴) |
| `useLocationPixel` | 내 위치(latLon) → 지도 픽셀 좌표 변환 (postrender 구독) — 내 위치 파란 점 마커 |
| `useGeolocation` | 브라우저 위치 획득 + 지도 이동 + 권한 처리 |
| `useWeather` | 기상청 API 호출, store에 weather/temperature/forecast 저장 |
| `useRoute` | TMap API 호출 — 도보/자전거/차량/대중교통 경로, 거리/시간/칼로리 계산 |
| `useRouteLayer` | 경로 GeoJSON → OpenLayers VectorLayer 추가/제거, 지도 뷰 fit |
| `useReport` | 제보 폼 상태 관리 + POST /reports 제출 |
| `useReportClusters` | 공개 제보 목록 조회 → `storeId == null` 제보만 좌표 근접값 기준으로 클러스터링 |
| `useKakaoPlaceSearch` | 카카오 장소 검색 API 연동 (ReportModal 매장 검색에 사용) |
| `useStoreDistance` | 현재 위치(latLon)와 매장 좌표 Haversine 직선거리 계산 → distance/walkTime/kcal |
| `useMcpHost` | `window.__tdjmap__` 전역 MCP API 노출 — 다른 곳에서 수정 금지 |
| `useVWorldLayer` | VWorld XYZ 타일 레이어 객체 생성 (훅 아님, 팩토리 함수) — `http://api.vworld.kr/req/wmts/1.0.0/{key}/Base/{z}/{y}/{x}.png` |

- 훅 하나의 책임이 두 가지 이상이면 분리한다.
- `MapPage.jsx` 로직이 50줄을 초과하면 즉시 커스텀 훅으로 추출한다.

### 날씨 데이터 흐름 (변경 금지)

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

## 주요 규칙

### Z-Index 계층

| 클래스 | 값 | 용도 |
|--------|----|------|
| `z-map` | 0 | MapView 컨테이너 |
| `z-marker` | 30 | MapMarker 오버레이 + 내 위치 파란 점 |
| `z-canvas` | 35 | WeatherCanvas (비/눈 애니메이션) |
| `z-ui` | 50 | SearchOverlay, WeatherWidget, FAB, StoreCard |
| `z-modal` | 1000 | FilterBottomSheet, ReportModal (배경 dim + 패널 모두) |

- `z-[임의값]`으로 계층을 깨지 말 것 — 위 표에 없는 값이 필요하면 `tailwind.config.js`에 먼저 등록.
- 모달/바텀시트는 예외 없이 `z-modal`.

### Zustand Store 사용 규칙

```js
// ✅ 개별 selector
const weather = useMapStore(s => s.weather)
const moveTo  = useMapStore(s => s.moveTo)

// ❌ 전체 구독 금지
const store = useMapStore()
```

- `mapInstance`는 읽기 전용으로 참조만 한다. 외부에서 메서드를 직접 호출할 때는 `moveTo` 같은 store 액션을 추가한다.

### 컴포넌트 규칙

- `MapPage.jsx`는 **컴포넌트 조합과 훅 연결**만 담당한다. 비즈니스 로직은 훅으로 분리.
- 모달/바텀시트는 `overflow-hidden` 부모 바깥에서 렌더링 (`MapPage` 최하단, `fixed` 포지션).
- `StoreCard({ store, onClose, onRoute })`: `onRoute` — "길찾기" 버튼 → `RouteBottomSheet` 열기.
- `StoreCard`, `FilterBottomSheet`, `ReportModal`의 내부 상태는 외부 store에 올리지 않는다.
- `SearchOverlay.jsx` — 키워드 검색 + 등급 칩(GREEN/YELLOW/RED) + 필터 아이콘 버튼 + 검색 결과 드롭다운. `FilterLegendSheet`를 내부에서 직접 열기 때문에 MapPage가 별도로 열지 않아도 됨.
- `QuickFilters.jsx` — 과거 상단 칩 바 컴포넌트. `MapPage.jsx`에서 현재 사용하지 않으며, 새 필터 UI는 `SearchOverlay` / `FilterBottomSheet` 기준으로 수정.

#### ReportVoteCard — 공유 투표 카드

`ReportVoteCard.jsx`는 `VotingBottomSheet`와 `ReportClusterBottomSheet` 양쪽에서 사용하는 공유 컴포넌트.

```jsx
<ReportVoteCard report={report} onVote={handleVote} />
// report: { reportId, menuName, imageUrl, protein, carbs, fat, upVotes, downVotes, myVote, createdAt }
// onVote(reportId, 'UP'|'DOWN'): Promise — 카드 내부에서 optimistic update 처리
```

#### VotingBottomSheet — 매장 지도 이동

```
grouped 구조: { storeName, storeAddress, storeLat, storeLon, storeId, items[] }
헤더 클릭 → onNavigate?.(group) + onClose()
```

- `storeLat`/`storeLon`이 있는 그룹만 클릭 가능
- `MapPage.jsx`에서 `onNavigate({ storeLat, storeLon })` → `fromLonLat([storeLon, storeLat])` → `moveTo(x, y, 17)`

#### ReportModal — AI 영양성분 분석 흐름

```
ImageUploader onFile={setAiFile}   ← File 객체 (AI 분석용, 업로드 URL과 별개)
    ↓  버튼 클릭
fileToDataUrl(aiFile)              ← FileReader base64 변환
    ↓
POST /chatbot/analyze { image: dataUrl }
    ↓  data.menuName != null 이면 success
setFieldValue('menuName', data.menuName)
setFieldValue('carbs'|'protein'|'fat', String(value))
AiNutritionModal(success|fail)     ← features/record/AiNutritionModal.jsx 공유
```

`useReport` API:
- `setField(key)` — input onChange 핸들러 반환 (이벤트 객체 필요)
- `setFieldValue(key, value)` — 값 직접 지정 (AI 자동 채우기 등)
- `setPlace({ placeName, address, lat, lon })` — 카카오 장소 선택 시 일괄 설정
- `clearPlaceDetails()` — storeAddress/좌표만 초기화 (storeName 유지)
- `submit(imageUrl)` — POST /reports 제출 (storeName·menuName 필수 검증 포함)

#### MapMarker — 2단계 표시

`MapPage.jsx`에서 `moveend` 이벤트로 현재 zoom을 `mapZoom` state로 추적.

| zoom | 표시 |
|------|------|
| < 15 | dot (w-4 h-4 원형) |
| ≥ 15 | 탄단지 박스 |

- dot 색상: grade별 (`#4ADE80` / `#FACC15` / `#F87171`), grade 없음: `#9CA3AF`
- `reportCount > 0`이면 dot/박스 모두 파란 배지 표시
- `latestReport`가 있으면 zoom 15 이상 박스에서 제보 영양성분 표시 + "제보" 라벨
- 줌 기준 변경 시 `MapPage.jsx`의 `compact={mapZoom < 15}` 한 곳만 수정

#### grade null 처리 규칙

- `grade: null` = 메뉴 정보 미등록 매장. `'GREEN'` 폴백 절대 금지.
- MapMarker: grade 없으면 회색 스타일, 박스에 "정보 없음" 표시
- StoreCard: grade 없으면 영양소 셀·태그 대신 "아직 메뉴 정보가 등록되지 않은 매장이에요" 안내
- MapPage 필터: `gradeFilters.length > 0`이면 null grade 매장은 자동 제외

### 데이터 소스

- `useMapStores` 훅이 `mapInstance.moveend` 이벤트마다 bbox를 추출해 API 호출
- 빠른 이동/필터 변경 시 AbortController로 오래된 요청 취소
- `useMapStores` moveend 재조회: 200ms debounce, `MapPage` 검색어 반영: 300ms debounce

#### 필터 시스템

**백엔드 필터** (`useMapStores`에 전달):
- `keyword`: 매장명 검색 — SearchOverlay에서 300ms debounce 후 전달

**프론트 필터** (`MapPage.jsx`의 `visibleStores` useMemo):
- `activeFilters(Set)`: 등급 칩(GREEN/YELLOW/RED) + 태그 칩(#고단백 등)
- `nutritionFilters`: 슬라이더 값 (`{ carbs: { min, max }, protein: { min, max }, fat: { min, max } }`)

```js
// 필터 로직
const gradeFilters = [...activeFilters].filter(f => ['GREEN', 'YELLOW', 'RED'].includes(f))
const tagFilters   = [...activeFilters].filter(f => f.startsWith('#'))
// 등급·태그: 카테고리 간 AND, 카테고리 내 OR
// nutritionFilters: stores.raw[key] 숫자와 비교
```

#### MapStorePage 메뉴 탭

- `useStoreDetail` 반환: `{ store, reviews, menuReports, loading, error, submitReview, toggleReviewLike, toggleMenuReportVote }`
- 메뉴 탭: grade 필터 칩(전체/GREEN/YELLOW/RED) + 정렬 드롭다운 (단백질/탄수화물/지방순)
- 정렬은 `menu.raw[key]` 숫자로 내림차순 — `nutrition` 문자열 비교 금지

#### TMap 경로 안내

- 이동 수단: 도보(walk) / 자전거(bike) / 대중교통(transit) / 차량(car)
- 자전거: TMap 전용 API 없음 → 도보 경로 + 속도 15km/h로 시간 재계산
- 칼로리: MET × 체중(`user.weight` 우선, 없으면 65kg) × 시간(h)

#### useMapMarkers 주의 사항

- `stores`를 effect deps에 넣으면 filter()가 매 렌더마다 새 배열을 만들어 무한 루프 발생.
- **반드시 `storesRef` 패턴 유지**: `storesRef.current = stores`로 최신값을 읽고, effect deps는 `[mapInstance]`만.

#### useLocationPixel 사용 방법

```jsx
const locationPixel = useLocationPixel()  // MapPage.jsx

{locationPixel && (
  <div className="absolute z-marker -translate-x-1/2 -translate-y-1/2 pointer-events-none"
       style={{ left: locationPixel.left, top: locationPixel.top }}>
    {/* 파란 점 마커 */}
  </div>
)}
```

- `postrender` 이벤트로 latLon 변경/지도 이동 시 자동 업데이트.

---

## DO / DON'T

- `MapView.jsx` 밖에서 `new Map(...)` 생성 금지.
- `window.__tdjmap__` 외부에서 직접 수정 금지 (`useMcpHost.js`에서만 관리).
- 지도 레이어를 ID 없이 추가 금지 (중복 레이어 버그 원인).
- `fromLonLat` 인자 순서 반전 금지 — `[lon, lat]` 고정.
- 영양성분 슬라이더 필터를 백엔드 쿼리로 보내지 말 것 — 프론트 필터로만 처리.

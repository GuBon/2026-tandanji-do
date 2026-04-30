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
- **저장/전달**: 경도(lon), 위도(lat) 순서 — MOCK_STORES, `setLatLon(lat, lon)` 일관 유지.
- **OpenLayers 입력**: `fromLonLat([lon, lat])` — lon 먼저, lat 나중.
- **지도 내부 좌표계**: EPSG:3857(Web Mercator). 외부에 노출할 때는 반드시 `toLonLat()`로 역변환.
- 마커 화면 위치: `mapInstance.getPixelFromCoordinate(coord)` — `useMapMarkers.js`에서만 처리.

---

## 커스텀 훅 책임 범위

| 훅 | 담당 |
|----|------|
| `useMapUI` | activeFilter / selectedStore / filterOpen 등 순수 UI 상태 |
| `useMapMarkers` | 지도 좌표 → 픽셀좌표 변환 (postrender 이벤트 구독) |
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
| `z-ui` | 50 | SearchOverlay, QuickFilters, WeatherWidget, FAB, StoreCard |
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

---

## 데이터 소스

- 현재 매장 데이터: `src/data/mockStores.js` — 실제 API 연동 전까지 이 파일만 수정.
- `MOCK_STORES` 항목 구조: `{ id, name, category, lat, lon, variant, nutrition: { carbs, protein, fat }, menus[] }`
- `category` 값: `'샐러드' | '포케' | '한식뷔페'` — QuickFilters 버튼과 반드시 일치.

---

## ❌ 금지 사항

- `MapView.jsx` 밖에서 `new Map(...)` 생성 금지.
- `window.__tdjmap__` 외부에서 직접 수정 금지 (`useMcpHost.js`에서만 관리).
- API 키(`VITE_VWORLD_API_KEY`, `VITE_WEATHER_API_KEY`)를 컴포넌트 코드에 하드코딩 금지 — `.env`에서만 참조.
- 지도 레이어를 ID 없이 추가 금지 (중복 레이어 버그 원인).
- `fromLonLat` 인자 순서 반전 금지 — `[lon, lat]` 고정.

# CLAUDE.md (Frontend - TDJMap)

사용자 위치 기반 GIS 시각화(V-World), 실시간 기상 넛지, 식단/활동 대시보드를 제공하는 React 기반 프론트엔드.

## 🛠 Tech Stack
- **Framework**: React 18+ (Vite)
- **GIS Engine**: OpenLayers
- **Map Source**: V-World WMTS/WMS API
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **AI Interface**: MCP Host Implementation

## 🏗 Directory Structure (Feature-based)
- **`src/features/map/`**: OpenLayers 렌더링 및 레이어 제어 로직.
- **`src/features/auth/`**: 카카오 로그인 및 토큰 관리.
- **`src/features/diet/`**: 식단 입력 및 영양 정보 시각화.
- **`src/store/`**: Zustand 기반 전역 상태 관리.

## 📐 Conventions

**Naming**
- 컴포넌트: `PascalCase.jsx`
- 커스텀 훅: `useCamelCase.js`

**Design System**
- Z-Index: Map(0) < UI/Floating(50) < Modal(1000)

**GIS**
- 지도 인스턴스는 Zustand 또는 ref로 싱글톤 관리.
- 레이어에 ID를 부여해 중복 렌더링 방지.

## ✅ Do
- **Mobile First**: 모든 UI는 `sm:(640px)` 이하 기준으로 먼저 설계.
- **API 호출**: 반드시 `try-catch`와 로딩 상태 처리 포함.
- **MCP Host**: AI 에이전트의 지도 제어(Move, Zoom) 인터페이스 노출.
- 함수/컴포넌트 로직이 50줄을 초과하면 커스텀 훅으로 분리.
- 모든 폰트는 Open Sans로 통일

## ❌ Don't
- API 키와 엔드포인트는 `.env` 외부로 노출 금지.
- 컴포넌트 300줄 초과 금지 — 커스텀 훅으로 로직 분리.
- `px` 단위 하드코딩 금지 (Tailwind 수치 활용).
- 데스크톱 전용 라이브러리 추가 금지 (모바일 성능 우선).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# TDJMap

인천 지역 토스트·샌드위치·샐러드 매장의 영양정보 + 위치 서비스.

## 구조

```
2026-tandanji-do/
├── backend/          Spring Boot 4.0.5 (Java 17) — port 8080
├── frontend/         React 18 + Vite               — port 5173
├── docs/
│   ├── api/          contracts.md (백↔프론트 스펙)
│   └── db/           DB 스키마/마이그레이션 가이드
├── sql/
│   ├── ddl/          최종/개발 DB 스키마 SQL
│   └── insert/       개발 시드 데이터
└── docker-compose.yml  PostGIS 로컬 DB
```

## 명령어

### 개발 서버 실행

```bash
docker-compose up -d               # DB (PostGIS) 시작
cd backend && ./gradlew bootRun    # API 서버 (port 8080)
cd frontend && npm run dev         # 프론트엔드 (port 5173)
```

### 검증

```bash
# 백엔드
cd backend
./gradlew compileJava              # 컴파일 에러 확인
./gradlew test                     # 전체 테스트

# 프론트엔드
cd frontend
npm run build                      # Vite 빌드 확인 (타입 에러 등 노출)
```

### DB 접속 (로컬 Docker)

```powershell
# PowerShell
docker compose exec -T postgis psql -U tandanji -d tandanji

# 또는 외부 psql 클라이언트
$env:PGPASSWORD='tandanji'; psql -h 127.0.0.1 -p 15432 -U tandanji -d tandanji
```

### 크롤러

```bash
cd backend
./gradlew crawlFatSecret                     # 전체 브랜드 크롤링
./gradlew crawlFatSecret -Pbrand=이삭토스트   # 특정 브랜드
```

## 포트 맵

| 서비스 | 포트 |
|--------|------|
| Spring Boot API | 8080 |
| Vite 개발 서버 | 5173 |
| PostgreSQL (로컬 Docker) | 15432 |

## 전역 규칙

- `ddl-auto=none` — 스키마 변경은 반드시 직접 SQL 실행, `sql/ddl/Script.sql`도 함께 갱신
- API 응답 래퍼: 백엔드는 기본적으로 `ApiResponse<T>` 사용 (`DELETE /auth/logout`은 204 No Content 예외)
- 인증: JWT 구현 완료 — 보호 라우트는 `Authorization: Bearer <token>` 헤더 필수
- 공개 API: `GET /stores/**`, `GET /posts`, `GET /posts/{id}`, `GET /posts/{id}/comments`, `GET /reports`, `GET /images/**`, `POST /chatbot/recommend`, `POST /chatbot/analyze`
- userId: 서비스 레이어에서 `SecurityUtil.getCurrentUserId()` 로 추출 (요청 파라미터/바디 사용 금지)
- 모바일 퍼스트 — 모든 UI는 `sm(640px)` 이하 기준 설계

### 백엔드 핵심 주의사항

- **Jackson 3.x** (Spring Boot 4): `JsonNode` 문자열 추출 시 `asText()` / `textValue()` 사용 금지 → `stringValue()` 사용
- **ChatbotService**: RestClient / JDK HttpClient 모두 422 바디 누락 버그 확인 → `HttpURLConnection` 직접 사용 (AuthService의 카카오 API 호출은 RestClient 허용)
- **비로그인 허용 API**: `SecurityUtil.getCurrentUserIdOrNull()` — 로그인 시 개인화 데이터 추가, 비로그인 시 null

### 프론트엔드 핵심 주의사항

- 인증 필요 JSON API는 반드시 `apiClient` 사용 (JWT 헤더 자동 주입)
- 인증이 필요한 액션(글쓰기·좋아요·댓글 등)은 `requireAuth(fn)` 패턴으로 래핑
- Zustand는 개별 selector로 구독: `useStore(s => s.field)` — `useStore()` 전체 구독 금지
- `z-[임의값]` 직접 사용 금지 — `tailwind.config.js`에 등록된 계층만 사용 (`z-map/z-marker/z-canvas/z-ui/z-modal`)

## 주요 컨텍스트

| 경로 | 내용 |
|------|------|
| `docs/api/contracts.md` | **API 스펙 진실의 원천** — 구현 완료/미구현 전체 목록 |
| `backend/CLAUDE.md` | Spring Boot 아키텍처, DB 스키마, 코딩 패턴 |
| `frontend/CLAUDE.md` | React 패턴, Zustand, 컴포넌트 규칙 |
| `frontend/src/features/map/CLAUDE.md` | OpenLayers, 좌표계, 날씨 데이터 흐름 |
| `frontend/src/features/community/CLAUDE.md` | 커뮤니티 목록/작성/상세/좋아요 연동 규칙 |
| `frontend/src/features/record/CLAUDE.md` | 식단/운동 기록 프론트 흐름 |
| `frontend/src/features/chatbot/CLAUDE.md` | 챗봇 메뉴 추천·영양분석 프론트 흐름 |
| `backend/src/main/java/com/example/tdjmap/auth/CLAUDE.md` | 카카오 OAuth, JWT 발급·갱신·로그아웃 흐름 |
| `backend/src/main/java/com/example/tdjmap/record/CLAUDE.md` | 식단/운동/체중 기록 서비스 분리 구조, 칼로리 계산 |
| `backend/src/main/java/com/example/tdjmap/user/CLAUDE.md` | 프로필 조회/수정, weight 변경 → 체중 이력 사이드 이펙트 |
| `backend/src/main/java/com/example/tdjmap/store/CLAUDE.md` | 매장 검색/상세/메뉴/리뷰 백엔드 규칙 |
| `backend/src/main/java/com/example/tdjmap/community/CLAUDE.md` | 게시글/좋아요/댓글 백엔드 규칙 |
| `backend/src/main/java/com/example/tdjmap/report/CLAUDE.md` | 제보/투표/자동승인 백엔드 규칙 |
| `backend/src/main/java/com/example/tdjmap/chatbot/CLAUDE.md` | 챗봇 AI 프록시 백엔드 규칙 |
| `docs/db/CLAUDE.md` | Docker DB 접속, 현재 스키마, DDL 작성 규칙 |
| `sql/ddl/Script.sql` | 현재 기준 최종 스키마 초안 (`post_comments`, `report_votes` 포함) |

## 필수 외부 설정

`backend/src/main/resources/application.properties`에 기본값 없는 값들. 로컬 실행 전 주입 필요:

```properties
kakao.client-id=...
tandanji.ai.base-url=...          # 챗봇 AI 서버 URL — 없으면 챗봇 전체 동작 불가
app.image.base-url=http://localhost:8080/images/
```

프론트엔드 `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:8080
VITE_KAKAO_APP_KEY=...
VITE_KAKAO_REDIRECT_URI=http://localhost:5173/oauth/callback
VITE_VWORLD_API_KEY=...
VITE_WEATHER_API_KEY=...
VITE_TMAP_API_KEY=...
```

## 작업 흐름

1. DB 스키마 변경 시 `sql/ddl/Script.sql`과 실제 Docker DB를 함께 확인한다.
2. API 응답/요청 변경 시 `docs/api/contracts.md`를 먼저 맞춘다.
3. 백엔드 구현 후 `./gradlew compileJava` 또는 `./gradlew test`로 검증한다.
4. 프론트 연동 후 `npm run build`로 Vite 빌드를 확인한다.

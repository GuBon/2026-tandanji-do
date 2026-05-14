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

## 빠른 시작

```bash
docker-compose up -d               # DB (PostGIS)
cd backend && ./gradlew bootRun    # API 서버
cd frontend && npm run dev         # 프론트엔드
```

## 포트 맵

| 서비스 | 포트 |
|--------|------|
| Spring Boot API | 8080 |
| Vite 개발 서버 | 5173 |
| PostgreSQL (로컬 Docker) | 15432 |

## 전역 규칙

- `ddl-auto=none` — 스키마 변경은 반드시 직접 SQL 실행
- API 응답 래퍼: 백엔드는 항상 `ApiResponse<T>` 사용
- 인증: JWT 구현 완료 — 보호 라우트는 `Authorization: Bearer <token>` 헤더 필수
- 공개 조회: `GET /stores/**`, `GET /posts`, `GET /posts/{id}`, `GET /posts/{id}/comments`, `GET /reports`, `GET /images/**`
- userId: 서비스 레이어에서 `SecurityUtil.getCurrentUserId()` 로 추출 (요청 파라미터/바디 사용 금지)
- 모바일 퍼스트 — 모든 UI는 `sm(640px)` 이하 기준 설계

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
| `backend/src/main/java/com/example/tdjmap/store/CLAUDE.md` | 매장 검색/상세/메뉴/리뷰 백엔드 규칙 |
| `backend/src/main/java/com/example/tdjmap/community/CLAUDE.md` | 게시글/좋아요/댓글 백엔드 규칙 |
| `backend/src/main/java/com/example/tdjmap/report/CLAUDE.md` | 제보/투표/자동승인 백엔드 규칙 |
| `backend/src/main/java/com/example/tdjmap/chatbot/CLAUDE.md` | 챗봇 AI 프록시 백엔드 규칙 |
| `docs/db/CLAUDE.md` | Docker DB 접속, 현재 스키마, DDL 작성 규칙 |
| `sql/ddl/Script.sql` | 현재 기준 최종 스키마 초안 (`post_comments`, `report_votes` 포함) |

## 작업 흐름

1. DB 스키마 변경 시 `sql/ddl/Script.sql`과 실제 Docker DB를 함께 확인한다.
2. API 응답/요청 변경 시 `docs/api/contracts.md`를 먼저 맞춘다.
3. 백엔드 구현 후 `./gradlew compileJava` 또는 `./gradlew test`로 검증한다.
4. 프론트 연동 후 `npm run build`로 Vite 빌드를 확인한다.

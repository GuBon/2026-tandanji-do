# CLAUDE.md — docs/api/

`contracts.md`는 백엔드↔프론트엔드 API 스펙의 진실의 원천이다.

---

## contracts.md 관리 규칙

- API 구현 완료 → ⬜ 미구현 섹션에서 ✅ 구현 완료 섹션으로 이동
- 새 API 설계 → 미구현 섹션에 먼저 스펙 작성 후 구현
- 백엔드·프론트가 각자 수정한 경우 반드시 contracts.md 동기화

### 스펙 형식

```
Method + Path + 한줄 설명
Query Params 또는 Body (타입, 필수여부)
Response HTTP코드: JSON 예시
특이사항 (제약조건, 에러코드 등)
```

---

## 현재 API 현황

```
✅ 구현 완료  38개
  인증: 3개 (POST /auth/kakao, POST /auth/refresh, DELETE /auth/logout)
  매장: 8개 (search, detail, menus, menu-reports, reviews GET/POST, review likes GET/POST)
  커뮤니티: 9개 (GET/POST /posts, GET/DELETE /posts/{id}, likes GET/POST, comments GET/POST/DELETE)
  식단 기록: 3개 (GET/POST /diet-logs, DELETE /diet-logs/{id})
  운동 종목: 1개 (GET /exercise-types)
  운동 기록: 3개 (GET/POST /exercise-logs, DELETE /exercise-logs/{id})
  체중 기록: 1개 (GET /weight-logs)
  신고: 5개 (POST/GET /reports, POST /reports/{id}/vote, GET /admin/reports, PATCH /admin/reports/{id}/status)
  사용자: 2개 (GET /users/me, PUT /users/me)
  이미지: 1개 (POST /images/upload) + GET /images/** 정적 서빙
  챗봇: 2개 (POST /chatbot/recommend, POST /chatbot/analyze)

⬜ 미구현  0개
```

---

## 공통 규칙

```
Base URL:    http://localhost:8080
응답 래퍼:   ApiResponse<T> { status, data, message } (예외: DELETE /auth/logout → 204 No Content)
인증:        JWT — Authorization: Bearer <jwt> 헤더
공개 조회:   GET /stores/**, GET /posts, GET /posts/{id}, GET /posts/{id}/comments,
             GET /reports, GET /images/**, POST /chatbot/recommend, POST /chatbot/analyze
userId:      서버에서 SecurityUtil.getCurrentUserId()로 추출 — Body·QueryParam 전달 금지
에러 형식:   { status: 404, data: null, message: "..." }
```

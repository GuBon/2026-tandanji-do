# /sync-contracts — contracts.md 자동 갱신

백엔드 컨트롤러 코드를 읽고 `docs/api/contracts.md`를 현재 구현 상태에 맞게 갱신한다.

## 실행 절차

1. `backend/src/main/java/com/example/tdjmap/` 하위의 모든 Controller 파일을 읽는다.
2. `docs/api/contracts.md`의 현재 내용을 읽는다.
3. 두 내용을 비교해 아래 기준으로 갱신한다:
   - 컨트롤러에 구현된 엔드포인트가 ⬜ 미구현에 있으면 → ✅ 구현 완료로 이동
   - 컨트롤러에 없는 엔드포인트가 ✅에 있으면 → 삭제됐는지 확인 후 보고
   - 새 엔드포인트가 컨트롤러에만 있고 contracts.md에 없으면 → ✅ 섹션에 추가
4. DTO 파일을 읽어 Request/Response 구조가 contracts.md와 다르면 수정한다.
5. 변경 이력 테이블에 오늘 날짜와 변경 내용을 추가한다.
6. `docs/api/CLAUDE.md`의 API 현황 카운트도 갱신한다.

## 규칙

- userId 파라미터: JWT 구현 완료 → Body·QueryParam 사용 금지, Authorization 헤더만 사용
- 응답 래퍼: 항상 `ApiResponse<T> { status, data, message }` 구조
- 공개 API(인증 불필요): `/auth/**`, `GET /stores/**` — SecurityConfig 참조
- 인증 필요 API: `Authorization: Bearer <jwt>` 헤더 명시

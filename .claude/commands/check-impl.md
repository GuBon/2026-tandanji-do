# /check-impl — contracts.md vs 실제 코드 구현 상태 점검

`contracts.md`의 ✅ 구현 완료 항목이 실제 코드에 존재하는지, ⬜ 미구현 항목이 이미 구현됐는지 교차 검증한다.

## 실행 절차

1. `docs/api/contracts.md`를 읽어 ✅/⬜ 항목 목록을 추출한다.
2. `backend/src/main/java/com/example/tdjmap/` 하위 Controller 파일을 전부 읽는다.
3. 아래 4가지 케이스를 점검해 결과를 표로 출력한다:

| 케이스 | 의미 | 조치 |
|--------|------|------|
| contracts ✅, 코드 O | 정상 | — |
| contracts ✅, 코드 X | 문서 오류 또는 삭제된 API | 사용자에게 보고 |
| contracts ⬜, 코드 O | 구현됐는데 문서 미갱신 | `/sync-contracts` 실행 제안 |
| contracts ⬜, 코드 X | 정상 미구현 | — |

4. 프론트엔드 API 파일(`frontend/src/api/`)도 읽어, 연동된 API가 contracts ✅에 있는지 확인한다.
5. 불일치 항목 요약과 권장 조치를 출력한다.

## 출력 형식

```
✅ 정상 일치:  N개
⚠️  불일치:    N개
  - [코드 O, 문서 X] POST /exercise-logs → /sync-contracts 실행 권장
  - [코드 X, 문서 ✅] GET /users/me → 실제 삭제됐는지 확인 필요
```

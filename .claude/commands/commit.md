# /commit — 변경사항 분석 후 논리적 분할 커밋

`git diff`를 분석해 관련 파일끼리 묶어 의미 있는 단위로 커밋한다.

## 커밋에서 항상 제외하는 파일

- `**/CLAUDE.md` — 에이전트 지침 문서
- `.claude/commands/**` — 슬래시 커맨드 스킬
- `docs/api/contracts.md`, `docs/api/CLAUDE.md`, `docs/db/CLAUDE.md` — API 계약/문서
- `backend/logs/**` — 런타임 로그

## 실행 절차

1. `git status`와 `git diff HEAD`로 전체 변경사항을 파악한다.
2. 위 제외 목록을 빼고 변경 파일을 아래 기준으로 논리적 그룹으로 분류한다:
   - **feat**: 새 기능 (새 컨트롤러/서비스/컴포넌트)
   - **fix**: 버그 수정
   - **refactor**: 기능 변경 없는 코드 개선
   - **chore**: 설정 파일, build.gradle, package.json, docker-compose.yml 등
   - **style**: UI/CSS 변경 (로직 변경 없음)
3. 각 그룹을 Conventional Commits 형식으로 커밋한다:
   ```
   feat(auth): 카카오 OAuth Authorization Code Flow 구현
   fix(map): 마커 좌표 순서 오류 수정
   chore: DB 스키마 tandanji로 변경
   ```
4. 커밋 전 그룹 분류 계획을 사용자에게 보여주고 확인받는다.
5. `.env`, credentials 포함 파일은 절대 스테이징하지 않는다.

## 규칙

- `git push`는 사용자가 명시적으로 요청할 때만 실행
- `--no-verify`, `--force` 등 안전 옵션 우회 금지
- 변경 파일이 하나의 논리 단위면 단일 커밋도 가능

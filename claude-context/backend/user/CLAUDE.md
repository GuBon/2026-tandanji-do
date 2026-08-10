# CLAUDE.md — user 패키지

내 프로필 조회(GET /users/me) + 수정(PUT /users/me). weight 변경 시 체중 이력 자동 기록.

---

## 파일 구성

```
user/
├── controller/UserController.java
├── service/UserService.java        WeightLogService 의존
└── dto/
    ├── UserResponse.java           { userId, nickname, role, height?, weight?, gender?, age?, createdAt }
    └── UserUpdateRequest.java      { nickname?, height?, weight?, gender?(M|F), age? }
```

---

## API 목록

```
GET /users/me     인증 필요
  Response: UserResponse  (@JsonInclude NON_NULL — null 필드 응답 생략)

PUT /users/me     인증 필요
  Body: UserUpdateRequest  (모든 필드 optional — 전송된 필드만 업데이트)
  Response: UserResponse
  ※ weight 변경 시 WeightLogService.createLog()가 자동 호출되어 weight_logs에 기록됨
```

---

## 핵심 설계

### weight 변경 사이드 이펙트

```java
if (req.getWeight() != null) {
    user.setWeight(req.getWeight());
    weightLogService.createLog(user, req.getWeight().doubleValue());
}
```

`UserService`가 `WeightLogService`에 직접 의존. 두 저장이 `@Transactional` 안에서 하나의 트랜잭션으로 처리된다.

### UserResponse 타입 주의

- `height`, `weight`: `Long` (not Integer)
- `age`: `Integer`
- `gender`: `String` — `"M"` | `"F"` (DB 레벨 제약 의존, validation annotation 없음)

### AuthGuard 연동

프론트의 `AuthGuard`는 accessToken 복원 후 `GET /users/me`를 호출해 `useAuthStore.updateUser()`로 프로필을 로드한다.  
`height` 또는 `weight`가 null이면 프론트가 `/profile/body`로 리다이렉트하여 신체 정보 입력을 강제한다.

---

## 규칙

- `UserUpdateRequest` 전 필드가 null인 요청도 허용 (no-op update)
- `USER_NOT_FOUND` 처리는 `findUserOrThrow()` 헬퍼로 통일
- 프로필 사진(`profile_url`) 컬럼은 DB 스키마 후보에만 존재, 현재 API 미지원

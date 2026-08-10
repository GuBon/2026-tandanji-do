# CLAUDE.md — auth 패키지

카카오 OAuth Authorization Code Flow → JWT 발급 + 토큰 갱신 + 로그아웃.

---

## 파일 구성

```
auth/
├── controller/AuthController.java
├── service/AuthService.java
└── dto/
    ├── KakaoLoginRequest.java      { code, redirectUri }
    ├── TokenRefreshRequest.java    { refreshToken }
    └── TokenResponse.java          { accessToken, refreshToken, user: { userId, nickname, role } }
```

---

## API 목록

```
POST /auth/kakao   (공개)
  Body: { code, redirectUri }
  동작: 카카오 Authorization Code → 카카오 액세스 토큰 교환 → 프로필 조회 → JWT 발급
  Response: TokenResponse

POST /auth/refresh  (공개)
  Body: { refreshToken }
  동작: refresh 토큰 유효성 검증 + DB의 social_logins.refresh_token과 일치 확인 → 새 JWT 발급
  Response: TokenResponse
  에러: 401 AUTH_INVALID_TOKEN (만료 또는 DB 불일치)

DELETE /auth/logout  (인증 필요)
  동작: social_logins.refresh_token = null 설정 (DB 무효화)
  Response: 204 No Content  ← ApiResponse 래퍼 없는 유일한 엔드포인트
```

---

## 핵심 설계

### JWT 설정 (application.properties)

```
jwt.secret=...
jwt.access-token-expiry=3600000       # 1시간 (ms)
jwt.refresh-token-expiry=2592000000   # 30일 (ms)
```

- access token: `{ sub: userId, role }` — 1시간 만료, 프론트 메모리에만 보관
- refresh token: `{ sub: userId }` — 30일 만료, `social_logins.refresh_token` 컬럼에 저장

### 카카오 연동 (AuthService)

- `exchangeCodeForToken()`: RestClient로 카카오 토큰 URL 호출 (`kakao.token-url`, `kakao.client-id`)
- `fetchKakaoProfile()`: RestClient로 카카오 사용자 정보 URL 호출 (`kakao.user-info-url`)
- **카카오 API에는 RestClient 사용 허용** — HttpURLConnection 예외는 ChatbotService의 AI 서버 POST에만 해당

### 신규 가입 vs 기존 유저 처리

```
1. social_logins.provider=KAKAO, provider_id=카카오ID 로 조회
2. 없으면 → User + SocialLogin 신규 생성 (email, nickname 설정)
3. 있으면 → 기존 User 재사용
4. 두 경우 모두 issueTokens() → access+refresh 발급, social_logins.refresh_token 갱신
```

### SocialLogin 엔티티 주요 컬럼

```
social_logins.refresh_token     현재 유효한 refresh token (logout 시 null)
social_logins.profile_data      JSONB (카카오 프로필 원본)
  ※ @JdbcTypeCode(SqlTypes.JSON) 필수 — 없으면 varchar→jsonb 캐스트 오류
```

---

## 규칙

- refresh 토큰 갱신 시 `jwtUtil.isTokenValid()` 검증 후 DB 저장값과 문자열 일치 비교 (순서 중요)
- `KakaoProfile`은 AuthService 내부 private record — 외부 노출 불필요
- 카카오 API 호출 실패는 모두 `AUTH_KAKAO_ERROR` 단일 에러로 처리
- `SocialLoginRepository.findByProviderAndProviderId()` / `findByUser_IdAndProvider()` 두 조회 패턴 혼용

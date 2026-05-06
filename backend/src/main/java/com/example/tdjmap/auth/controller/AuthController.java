package com.example.tdjmap.auth.controller;

import com.example.tdjmap.auth.dto.KakaoLoginRequest;
import com.example.tdjmap.auth.dto.TokenRefreshRequest;
import com.example.tdjmap.auth.dto.TokenResponse;
import com.example.tdjmap.auth.service.AuthService;
import com.example.tdjmap.common.ApiResponse;
import com.example.tdjmap.config.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /auth/kakao
     * 카카오 액세스 토큰 → 앱 JWT 발급
     */
    @PostMapping("/kakao")
    public ResponseEntity<ApiResponse<TokenResponse>> kakaoLogin(
            @Valid @RequestBody KakaoLoginRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.ok(authService.kakaoLogin(req.getCode(), req.getRedirectUri())));
    }

    /**
     * POST /auth/refresh
     * 리프레시 토큰 → 새 액세스/리프레시 토큰 발급
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenResponse>> refresh(
            @Valid @RequestBody TokenRefreshRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.ok(authService.refreshToken(req.getRefreshToken())));
    }

    /**
     * DELETE /auth/logout
     * Authorization: Bearer <accessToken> 으로 로그아웃 처리
     */
    @DeleteMapping("/logout")
    public ResponseEntity<Void> logout() {
        authService.logout(SecurityUtil.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}

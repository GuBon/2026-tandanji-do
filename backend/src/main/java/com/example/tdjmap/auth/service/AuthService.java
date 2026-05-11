package com.example.tdjmap.auth.service;

import com.example.tdjmap.auth.dto.TokenResponse;
import com.example.tdjmap.common.exception.BusinessException;
import com.example.tdjmap.common.exception.ErrorCode;
import com.example.tdjmap.config.JwtUtil;
import com.example.tdjmap.entity.SocialLogin;
import com.example.tdjmap.entity.User;
import com.example.tdjmap.repository.SocialLoginRepository;
import com.example.tdjmap.repository.UserRepository;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private static final String PROVIDER = "KAKAO";

    private final UserRepository userRepository;
    private final SocialLoginRepository socialLoginRepository;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.token-url}")
    private String kakaoTokenUrl;

    @Value("${kakao.user-info-url}")
    private String kakaoUserInfoUrl;

    // ── 카카오 로그인: 카카오 토큰 → JWT 발급 ─────────────────────────────────

    @Transactional
    public TokenResponse kakaoLogin(String code, String redirectUri) {
        String kakaoAccessToken = exchangeCodeForToken(code, redirectUri);
        String profileJson = fetchKakaoProfile(kakaoAccessToken);
        KakaoProfile profile = parseKakaoProfile(profileJson);

        Optional<SocialLogin> existing =
                socialLoginRepository.findByProviderAndProviderId(PROVIDER, profile.providerId());

        User user;
        SocialLogin socialLogin;

        if (existing.isPresent()) {
            socialLogin = existing.get();
            user = socialLogin.getUser();
        } else {
            user = userRepository.save(User.builder()
                    .email(profile.email())
                    .nickname(profile.nickname())
                    .createdAt(LocalDateTime.now())
                    .build());
            socialLogin = socialLoginRepository.save(SocialLogin.builder()
                    .user(user)
                    .provider(PROVIDER)
                    .providerId(profile.providerId())
                    .profileData(profileJson)
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        return issueTokens(user, socialLogin);
    }

    // ── 토큰 갱신: 리프레시 토큰 → 새 JWT 발급 ───────────────────────────────

    @Transactional
    public TokenResponse refreshToken(String refreshToken) {
        if (!jwtUtil.isTokenValid(refreshToken)) {
            throw new BusinessException(ErrorCode.AUTH_INVALID_TOKEN);
        }

        Long userId = jwtUtil.extractUserId(refreshToken);
        SocialLogin socialLogin = socialLoginRepository.findByUser_IdAndProvider(userId, PROVIDER)
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_INVALID_TOKEN));

        if (!refreshToken.equals(socialLogin.getRefreshToken())) {
            throw new BusinessException(ErrorCode.AUTH_INVALID_TOKEN);
        }

        return issueTokens(socialLogin.getUser(), socialLogin);
    }

    // ── 로그아웃: DB의 리프레시 토큰 무효화 ──────────────────────────────────

    @Transactional
    public void logout(Long userId) {
        socialLoginRepository.findByUser_IdAndProvider(userId, PROVIDER)
                .ifPresent(sl -> sl.setRefreshToken(null));
    }

    // ── 내부 헬퍼 ─────────────────────────────────────────────────────────────

    private TokenResponse issueTokens(User user, SocialLogin socialLogin) {
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());
        socialLogin.setRefreshToken(refreshToken);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(TokenResponse.UserInfo.builder()
                        .userId(user.getId())
                        .nickname(user.getNickname())
                        .role(user.getRole())
                        .build())
                .build();
    }

    private String exchangeCodeForToken(String code, String redirectUri) {
        try {
            String formBody = "grant_type=authorization_code"
                    + "&client_id=" + kakaoClientId
                    + "&redirect_uri=" + redirectUri
                    + "&code=" + code;

            String response = RestClient.create()
                    .post()
                    .uri(kakaoTokenUrl)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(formBody)
                    .retrieve()
                    .onStatus(status -> status.isError(), (req, res) -> {
                        byte[] body = res.getBody().readAllBytes();
                        log.error("카카오 토큰 교환 실패 — HTTP {}: {}", res.getStatusCode(), new String(body));
                        throw new BusinessException(ErrorCode.AUTH_KAKAO_ERROR);
                    })
                    .body(String.class);

            Map<String, Object> tokenData = objectMapper.readValue(response, new TypeReference<>() {});
            return (String) tokenData.get("access_token");
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("카카오 토큰 교환 실패", e);
            throw new BusinessException(ErrorCode.AUTH_KAKAO_ERROR);
        }
    }

    private String fetchKakaoProfile(String kakaoAccessToken) {
        try {
            return RestClient.create()
                    .get()
                    .uri(kakaoUserInfoUrl)
                    .header("Authorization", "Bearer " + kakaoAccessToken)
                    .retrieve()
                    .body(String.class);
        } catch (Exception e) {
            log.error("카카오 프로필 조회 실패", e);
            throw new BusinessException(ErrorCode.AUTH_KAKAO_ERROR);
        }
    }

    @SuppressWarnings("unchecked")
    private KakaoProfile parseKakaoProfile(String json) {
        try {
            Map<String, Object> body = objectMapper.readValue(json, new TypeReference<>() {});
            String providerId = String.valueOf(body.get("id"));

            Map<String, Object> account = (Map<String, Object>) body.getOrDefault("kakao_account", Map.of());
            String email = (String) account.get("email");

            Map<String, Object> profileMap = (Map<String, Object>) account.getOrDefault("profile", Map.of());
            String nickname = (String) profileMap.getOrDefault("nickname", "사용자");

            return new KakaoProfile(providerId, email, nickname);
        } catch (Exception e) {
            log.error("카카오 프로필 파싱 실패", e);
            throw new BusinessException(ErrorCode.AUTH_KAKAO_ERROR);
        }
    }

    private record KakaoProfile(String providerId, String email, String nickname) {}
}

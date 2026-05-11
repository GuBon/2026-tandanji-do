package com.example.tdjmap.config;

import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final ObjectMapper objectMapper;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, e) -> {
                            response.setStatus(401);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE + ";charset=UTF-8");
                            response.getWriter().write(
                                    objectMapper.writeValueAsString(
                                            Map.of("status", 401, "message", "인증이 필요합니다.")
                                    )
                            );
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        // 인증 불필요: 로그인/토큰 갱신
                        .requestMatchers("/auth/**").permitAll()
                        // 인증 불필요: 정적 이미지
                        .requestMatchers(HttpMethod.GET, "/images/**").permitAll()
                        // 인증 불필요: 지도 검색·매장 상세·메뉴·리뷰 조회
                        .requestMatchers(HttpMethod.GET, "/stores/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/stores/*/menus").permitAll()
                        .requestMatchers(HttpMethod.GET, "/stores/*/reviews").permitAll()
                        .requestMatchers(HttpMethod.GET, "/stores/*").permitAll()
                        // 인증 불필요: 챗봇 추천·이미지 분석
                        .requestMatchers(HttpMethod.POST, "/chatbot/recommend").permitAll()
                        .requestMatchers(HttpMethod.POST, "/chatbot/analyze").permitAll()
                        // 인증 불필요: 커뮤니티 게시글 조회
                        .requestMatchers(HttpMethod.GET, "/posts").permitAll()
                        .requestMatchers(HttpMethod.GET, "/posts/*").permitAll()
                        // 관리자 전용
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        // 리뷰·커뮤니티·기록·제보 등 나머지 모두 인증 필요
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

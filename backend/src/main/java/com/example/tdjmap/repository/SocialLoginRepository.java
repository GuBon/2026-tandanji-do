package com.example.tdjmap.repository;

import com.example.tdjmap.entity.SocialLogin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocialLoginRepository extends JpaRepository<SocialLogin, Long> {
    Optional<SocialLogin> findByProviderAndProviderId(String provider, String providerId);
    Optional<SocialLogin> findByUser_IdAndProvider(Long userId, String provider);
}

package com.example.tdjmap.repository;

import com.example.tdjmap.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByPostIdAndUserId(Long postId, Long userId);
    long countByPostId(Long postId);
    boolean existsByPostIdAndUserId(Long postId, Long userId);
}

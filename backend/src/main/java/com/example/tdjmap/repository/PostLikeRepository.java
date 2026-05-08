package com.example.tdjmap.repository;

import com.example.tdjmap.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByPostIdAndUserId(Long postId, Long userId);
    long countByPostId(Long postId);
    boolean existsByPostIdAndUserId(Long postId, Long userId);

    @Query("""
            select pl.post.id as postId, count(pl.id) as likeCount
            from PostLike pl
            where pl.post.id in :postIds
            group by pl.post.id
            """)
    List<PostLikeCount> countByPostIds(@Param("postIds") Collection<Long> postIds);

    interface PostLikeCount {
        Long getPostId();
        Long getLikeCount();
    }
}

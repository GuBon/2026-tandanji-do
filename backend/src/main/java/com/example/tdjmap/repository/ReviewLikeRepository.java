package com.example.tdjmap.repository;

import com.example.tdjmap.entity.ReviewLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Long> {

    boolean existsByReviewIdAndUserId(Long reviewId, Long userId);

    Optional<ReviewLike> findByReviewIdAndUserId(Long reviewId, Long userId);

    long countByReviewId(Long reviewId);

    @Query("""
            select rl.review.id as reviewId, count(rl.id) as likeCount
            from ReviewLike rl
            where rl.review.id in :reviewIds
            group by rl.review.id
            """)
    List<ReviewLikeCount> countByReviewIds(@Param("reviewIds") Collection<Long> reviewIds);

    @Query("""
            select rl.review.id
            from ReviewLike rl
            where rl.review.id in :reviewIds and rl.user.id = :userId
            """)
    List<Long> findLikedReviewIds(
            @Param("reviewIds") Collection<Long> reviewIds,
            @Param("userId") Long userId
    );

    interface ReviewLikeCount {
        Long getReviewId();
        Long getLikeCount();
    }
}

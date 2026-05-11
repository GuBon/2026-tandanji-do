package com.example.tdjmap.repository;

import com.example.tdjmap.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByStoreIdOrderByCreatedAtDesc(Long storeId);

    Optional<Review> findByIdAndStoreId(Long reviewId, Long storeId);

    @Query(value = """
            select cast(round(avg(star)::numeric, 1) as double precision)
            from tandanji.reviews
            where store_id = :storeId
            """, nativeQuery = true)
    Double findAverageRatingByStoreId(@Param("storeId") Long storeId);
}

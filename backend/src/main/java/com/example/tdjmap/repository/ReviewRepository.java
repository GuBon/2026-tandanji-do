package com.example.tdjmap.repository;

import com.example.tdjmap.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByStoreIdOrderByCreatedAtDesc(Long storeId);
}

package com.example.tdjmap.repository;

import com.example.tdjmap.entity.DietLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DietLogRepository extends JpaRepository<DietLog, Long> {
    List<DietLog> findByUserIdOrderByAteAtDesc(Long userId);
}

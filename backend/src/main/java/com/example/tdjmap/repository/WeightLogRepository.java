package com.example.tdjmap.repository;

import com.example.tdjmap.entity.WeightLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WeightLogRepository extends JpaRepository<WeightLog, Long> {
    List<WeightLog> findByUser_IdOrderByRecordedAtAsc(Long userId);
}

package com.example.tdjmap.repository;

import com.example.tdjmap.entity.ExerciseLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ExerciseLogRepository extends JpaRepository<ExerciseLog, Long> {
    List<ExerciseLog> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ExerciseLog> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(Long userId, LocalDateTime start, LocalDateTime end);
}

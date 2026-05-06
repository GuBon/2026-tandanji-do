package com.example.tdjmap.record.controller;

import com.example.tdjmap.common.ApiResponse;
import com.example.tdjmap.record.dto.*;
import com.example.tdjmap.record.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;

    // ── 식단 기록 ──────────────────────────────────────────────────────────────

    @GetMapping("/diet-logs")
    public ResponseEntity<ApiResponse<List<DietLogResponse>>> getDietLogs(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(ApiResponse.ok(recordService.getDietLogs(date)));
    }

    @PostMapping("/diet-logs")
    public ResponseEntity<ApiResponse<DietLogResponse>> createDietLog(
            @RequestBody DietLogCreateRequest request
    ) {
        return ResponseEntity.status(201).body(ApiResponse.created(recordService.createDietLog(request)));
    }

    @DeleteMapping("/diet-logs/{logId}")
    public ResponseEntity<ApiResponse<Void>> deleteDietLog(@PathVariable Long logId) {
        recordService.deleteDietLog(logId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    // ── 운동 종목 ──────────────────────────────────────────────────────────────

    @GetMapping("/exercise-types")
    public ResponseEntity<ApiResponse<List<ExerciseTypeResponse>>> getExerciseTypes() {
        return ResponseEntity.ok(ApiResponse.ok(recordService.getExerciseTypes()));
    }

    // ── 운동 기록 ──────────────────────────────────────────────────────────────

    @GetMapping("/exercise-logs")
    public ResponseEntity<ApiResponse<List<ExerciseLogResponse>>> getExerciseLogs(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(ApiResponse.ok(recordService.getExerciseLogs(date)));
    }

    @PostMapping("/exercise-logs")
    public ResponseEntity<ApiResponse<ExerciseLogResponse>> createExerciseLog(
            @RequestBody ExerciseLogCreateRequest request
    ) {
        return ResponseEntity.status(201).body(ApiResponse.created(recordService.createExerciseLog(request)));
    }

    @DeleteMapping("/exercise-logs/{exerciseId}")
    public ResponseEntity<ApiResponse<Void>> deleteExerciseLog(@PathVariable Long exerciseId) {
        recordService.deleteExerciseLog(exerciseId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}

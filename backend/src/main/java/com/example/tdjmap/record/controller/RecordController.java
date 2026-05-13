package com.example.tdjmap.record.controller;

import com.example.tdjmap.common.ApiResponse;
import com.example.tdjmap.record.dto.*;
import com.example.tdjmap.record.service.DietRecordService;
import com.example.tdjmap.record.service.ExerciseRecordService;
import com.example.tdjmap.record.service.WeightLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class RecordController {

    private final DietRecordService dietRecordService;
    private final ExerciseRecordService exerciseRecordService;
    private final WeightLogService weightLogService;

    // ── 식단 기록 ──────────────────────────────────────────────────────────────

    @GetMapping("/diet-logs")
    public ResponseEntity<ApiResponse<List<DietLogResponse>>> getDietLogs(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(ApiResponse.ok(dietRecordService.getDietLogs(date)));
    }

    @PostMapping("/diet-logs")
    public ResponseEntity<ApiResponse<DietLogResponse>> createDietLog(
            @Valid @RequestBody DietLogCreateRequest request
    ) {
        return ResponseEntity.status(201).body(ApiResponse.created(dietRecordService.createDietLog(request)));
    }

    @DeleteMapping("/diet-logs/{logId}")
    public ResponseEntity<ApiResponse<Void>> deleteDietLog(@PathVariable Long logId) {
        dietRecordService.deleteDietLog(logId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    // ── 운동 종목 ──────────────────────────────────────────────────────────────

    @GetMapping("/exercise-types")
    public ResponseEntity<ApiResponse<List<ExerciseTypeResponse>>> getExerciseTypes() {
        return ResponseEntity.ok(ApiResponse.ok(exerciseRecordService.getExerciseTypes()));
    }

    // ── 운동 기록 ──────────────────────────────────────────────────────────────

    @GetMapping("/exercise-logs")
    public ResponseEntity<ApiResponse<List<ExerciseLogResponse>>> getExerciseLogs(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(ApiResponse.ok(exerciseRecordService.getExerciseLogs(date)));
    }

    @PostMapping("/exercise-logs")
    public ResponseEntity<ApiResponse<ExerciseLogResponse>> createExerciseLog(
            @Valid @RequestBody ExerciseLogCreateRequest request
    ) {
        return ResponseEntity.status(201).body(ApiResponse.created(exerciseRecordService.createExerciseLog(request)));
    }

    @DeleteMapping("/exercise-logs/{exerciseId}")
    public ResponseEntity<ApiResponse<Void>> deleteExerciseLog(@PathVariable Long exerciseId) {
        exerciseRecordService.deleteExerciseLog(exerciseId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    // ── 체중 기록 ──────────────────────────────────────────────────────────────

    @GetMapping("/weight-logs")
    public ResponseEntity<ApiResponse<List<WeightLogResponse>>> getWeightLogs() {
        return ResponseEntity.ok(ApiResponse.ok(weightLogService.getMyLogs()));
    }
}

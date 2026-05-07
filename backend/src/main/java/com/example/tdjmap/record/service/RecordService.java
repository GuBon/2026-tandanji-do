package com.example.tdjmap.record.service;

import com.example.tdjmap.common.exception.BusinessException;
import com.example.tdjmap.common.exception.ErrorCode;
import com.example.tdjmap.config.SecurityUtil;
import com.example.tdjmap.entity.*;
import com.example.tdjmap.record.dto.*;
import com.example.tdjmap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecordService {

    private final DietLogRepository dietLogRepository;
    private final ExerciseLogRepository exerciseLogRepository;
    private final ExerciseTypeRepository exerciseTypeRepository;
    private final UserRepository userRepository;
    private final MenuRepository menuRepository;

    // ── 식단 기록 조회 ──────────────────────────────────────────────────────────

    public List<DietLogResponse> getDietLogs(LocalDate date) {
        Long userId = SecurityUtil.getCurrentUserId();
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();
        return dietLogRepository
                .findByUserIdAndAteAtBetweenOrderByAteAtDesc(userId, start, end)
                .stream()
                .map(this::toDietLogResponse)
                .collect(Collectors.toList());
    }

    // ── 식단 기록 저장 ──────────────────────────────────────────────────────────

    @Transactional
    public DietLogResponse createDietLog(DietLogCreateRequest req) {
        Long userId = SecurityUtil.getCurrentUserId();
        User user = findUserOrThrow(userId);

        Menu menu = req.getMenuId() != null
                ? menuRepository.findById(req.getMenuId())
                        .orElseThrow(() -> new BusinessException(ErrorCode.MENU_NOT_FOUND))
                : null;

        DietLog log = DietLog.builder()
                .user(user)
                .menu(menu)
                .foodName(req.getFoodName())
                .mealType(req.getMealType())
                .logKcal(req.getLogKcal())
                .logCarbs(req.getLogCarbs())
                .logProtein(req.getLogProtein())
                .logFat(req.getLogFat())
                .logSugar(req.getLogSugar())
                .imgUrl(req.getImgUrl())
                .ateAt(req.getAteAt())
                .build();

        return toDietLogResponse(dietLogRepository.save(log));
    }

    // ── 식단 기록 삭제 ──────────────────────────────────────────────────────────

    @Transactional
    public void deleteDietLog(Long logId) {
        Long userId = SecurityUtil.getCurrentUserId();
        DietLog log = dietLogRepository.findById(logId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DIET_LOG_NOT_FOUND));
        if (!log.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        dietLogRepository.delete(log);
    }

    // ── 운동 종목 목록 ──────────────────────────────────────────────────────────

    public List<ExerciseTypeResponse> getExerciseTypes() {
        return exerciseTypeRepository.findAll().stream()
                .map(t -> ExerciseTypeResponse.builder()
                        .typeId(t.getId())
                        .typeName(t.getName())
                        .metValue(t.getMetValue())
                        .iconUrl(t.getIconUrl())
                        .build())
                .collect(Collectors.toList());
    }

    // ── 운동 기록 조회 ──────────────────────────────────────────────────────────

    public List<ExerciseLogResponse> getExerciseLogs(LocalDate date) {
        Long userId = SecurityUtil.getCurrentUserId();
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();
        return exerciseLogRepository
                .findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(userId, start, end)
                .stream()
                .map(this::toExerciseLogResponse)
                .collect(Collectors.toList());
    }

    // ── 운동 기록 저장 ──────────────────────────────────────────────────────────

    @Transactional
    public ExerciseLogResponse createExerciseLog(ExerciseLogCreateRequest req) {
        Long userId = SecurityUtil.getCurrentUserId();
        User user = findUserOrThrow(userId);
        ExerciseType type = exerciseTypeRepository.findById(req.getTypeId())
                .orElseThrow(() -> new BusinessException(ErrorCode.EXERCISE_TYPE_NOT_FOUND));

        ExerciseLog log = ExerciseLog.builder()
                .user(user)
                .type(type)
                .title(req.getTitle())
                .durationMin(req.getDurationMin())
                .caloriesBurned(req.getCaloriesBurned())
                .memo(req.getMemo())
                .createdAt(LocalDateTime.now())
                .build();

        return toExerciseLogResponse(exerciseLogRepository.save(log));
    }

    // ── 운동 기록 삭제 ──────────────────────────────────────────────────────────

    @Transactional
    public void deleteExerciseLog(Long exerciseId) {
        Long userId = SecurityUtil.getCurrentUserId();
        ExerciseLog log = exerciseLogRepository.findById(exerciseId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EXERCISE_LOG_NOT_FOUND));
        if (!log.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        exerciseLogRepository.delete(log);
    }

    // ── 내부 헬퍼 ──────────────────────────────────────────────────────────────

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    private DietLogResponse toDietLogResponse(DietLog log) {
        return DietLogResponse.builder()
                .logId(log.getId())
                .menuId(log.getMenu() != null ? log.getMenu().getId() : null)
                .foodName(log.getFoodName())
                .mealType(log.getMealType())
                .logKcal(log.getLogKcal())
                .logCarbs(log.getLogCarbs())
                .logProtein(log.getLogProtein())
                .logFat(log.getLogFat())
                .logSugar(log.getLogSugar())
                .imgUrl(log.getImgUrl())
                .ateAt(log.getAteAt())
                .build();
    }

    private ExerciseLogResponse toExerciseLogResponse(ExerciseLog log) {
        return ExerciseLogResponse.builder()
                .exerciseId(log.getId())
                .typeId(log.getType().getId())
                .typeName(log.getType().getName())
                .title(log.getTitle())
                .durationMin(log.getDurationMin())
                .caloriesBurned(log.getCaloriesBurned())
                .memo(log.getMemo())
                .createdAt(log.getCreatedAt())
                .build();
    }
}

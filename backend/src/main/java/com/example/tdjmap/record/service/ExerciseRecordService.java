package com.example.tdjmap.record.service;

import com.example.tdjmap.common.exception.BusinessException;
import com.example.tdjmap.common.exception.ErrorCode;
import com.example.tdjmap.config.SecurityUtil;
import com.example.tdjmap.entity.ExerciseLog;
import com.example.tdjmap.entity.ExerciseType;
import com.example.tdjmap.entity.User;
import com.example.tdjmap.record.dto.ExerciseLogCreateRequest;
import com.example.tdjmap.record.dto.ExerciseLogResponse;
import com.example.tdjmap.record.dto.ExerciseTypeResponse;
import com.example.tdjmap.repository.ExerciseLogRepository;
import com.example.tdjmap.repository.ExerciseTypeRepository;
import com.example.tdjmap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExerciseRecordService {

    private final ExerciseLogRepository exerciseLogRepository;
    private final ExerciseTypeRepository exerciseTypeRepository;
    private final UserRepository userRepository;

    public List<ExerciseTypeResponse> getExerciseTypes() {
        return exerciseTypeRepository.findAll().stream()
                .map(t -> ExerciseTypeResponse.builder()
                        .typeId(t.getId())
                        .typeName(t.getName())
                        .metValue(t.getMetValue())
                        .iconUrl(t.getIconUrl())
                        .build())
                .toList();
    }

    public List<ExerciseLogResponse> getExerciseLogs(LocalDate date) {
        Long userId = SecurityUtil.getCurrentUserId();
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();
        return exerciseLogRepository
                .findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(userId, start, end)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ExerciseLogResponse createExerciseLog(ExerciseLogCreateRequest req) {
        User user = findUserOrThrow(SecurityUtil.getCurrentUserId());
        ExerciseType type = exerciseTypeRepository.findById(req.getTypeId())
                .orElseThrow(() -> new BusinessException(ErrorCode.EXERCISE_TYPE_NOT_FOUND));

        ExerciseLog log = ExerciseLog.builder()
                .user(user)
                .type(type)
                .title(req.getTitle())
                .durationMin(req.getDurationMin())
                .caloriesBurned(calculateCaloriesBurned(type, req.getDurationMin(), user.getWeight()))
                .memo(req.getMemo())
                .createdAt(LocalDateTime.now())
                .build();

        return toResponse(exerciseLogRepository.save(log));
    }

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

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    private Long calculateCaloriesBurned(ExerciseType type, Long durationMin, Long userWeightKg) {
        long weightKg = userWeightKg != null ? userWeightKg : 65L;
        double durationHour = durationMin / 60.0;
        return Math.round(type.getMetValue().doubleValue() * weightKg * durationHour);
    }

    private ExerciseLogResponse toResponse(ExerciseLog log) {
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

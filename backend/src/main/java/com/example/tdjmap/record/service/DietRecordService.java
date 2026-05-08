package com.example.tdjmap.record.service;

import com.example.tdjmap.common.exception.BusinessException;
import com.example.tdjmap.common.exception.ErrorCode;
import com.example.tdjmap.config.SecurityUtil;
import com.example.tdjmap.entity.DietLog;
import com.example.tdjmap.entity.Menu;
import com.example.tdjmap.entity.User;
import com.example.tdjmap.record.dto.DietLogCreateRequest;
import com.example.tdjmap.record.dto.DietLogResponse;
import com.example.tdjmap.repository.DietLogRepository;
import com.example.tdjmap.repository.MenuRepository;
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
public class DietRecordService {

    private final DietLogRepository dietLogRepository;
    private final UserRepository userRepository;
    private final MenuRepository menuRepository;

    public List<DietLogResponse> getDietLogs(LocalDate date) {
        Long userId = SecurityUtil.getCurrentUserId();
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();
        return dietLogRepository
                .findByUserIdAndAteAtBetweenOrderByAteAtDesc(userId, start, end)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public DietLogResponse createDietLog(DietLogCreateRequest req) {
        User user = findUserOrThrow(SecurityUtil.getCurrentUserId());
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

        return toResponse(dietLogRepository.save(log));
    }

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

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    private DietLogResponse toResponse(DietLog log) {
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
}

package com.example.tdjmap.record.service;

import com.example.tdjmap.config.SecurityUtil;
import com.example.tdjmap.entity.User;
import com.example.tdjmap.entity.WeightLog;
import com.example.tdjmap.record.dto.WeightLogResponse;
import com.example.tdjmap.repository.WeightLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WeightLogService {

    private final WeightLogRepository weightLogRepository;

    public List<WeightLogResponse> getMyLogs() {
        Long userId = SecurityUtil.getCurrentUserId();
        return weightLogRepository.findByUser_IdOrderByRecordedAtAsc(userId)
                .stream()
                .map(WeightLogResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void createLog(User user, double weightKg) {
        weightLogRepository.save(WeightLog.builder()
                .user(user)
                .weightKg(weightKg)
                .recordedAt(LocalDateTime.now())
                .build());
    }
}

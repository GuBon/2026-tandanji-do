package com.example.tdjmap.report.service;

import com.example.tdjmap.common.exception.BusinessException;
import com.example.tdjmap.common.exception.ErrorCode;
import com.example.tdjmap.config.SecurityUtil;
import com.example.tdjmap.entity.Report;
import com.example.tdjmap.entity.User;
import com.example.tdjmap.report.dto.ReportAdminResponse;
import com.example.tdjmap.report.dto.ReportCreateRequest;
import com.example.tdjmap.repository.ReportRepository;
import com.example.tdjmap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createReport(ReportCreateRequest req) {
        Long userId = SecurityUtil.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Report report = Report.builder()
                .user(user)
                .storeName(req.getStoreName())
                .menuName(req.getMenuName())
                .carbs(req.getCarbs())
                .protein(req.getProtein())
                .fat(req.getFat())
                .imageUrl(req.getImageUrl())
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        reportRepository.save(report);
    }

    public List<ReportAdminResponse> getAdminReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(ReportAdminResponse::from)
                .toList();
    }

    @Transactional
    public ReportAdminResponse updateStatus(Long reportId, String status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REPORT_NOT_FOUND));
        report.setStatus(status);
        return ReportAdminResponse.from(report);
    }
}

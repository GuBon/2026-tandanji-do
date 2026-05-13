package com.example.tdjmap.report.controller;

import com.example.tdjmap.common.ApiResponse;
import com.example.tdjmap.report.dto.ReportAdminResponse;
import com.example.tdjmap.report.dto.ReportCreateRequest;
import com.example.tdjmap.report.dto.ReportPublicResponse;
import com.example.tdjmap.report.dto.ReportVoteRequest;
import com.example.tdjmap.report.dto.ReportVoteResponse;
import com.example.tdjmap.report.service.ReportService;
import com.example.tdjmap.report.dto.ReportStatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/reports")
    public ResponseEntity<ApiResponse<Void>> createReport(
            @Valid @RequestBody ReportCreateRequest req) {
        reportService.createReport(req);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<List<ReportPublicResponse>>> getPublicReports(
            @RequestParam(required = false) Long storeId) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getPublicReports(storeId)));
    }

    @PostMapping("/reports/{reportId}/vote")
    public ResponseEntity<ApiResponse<ReportVoteResponse>> vote(
            @PathVariable Long reportId,
            @Valid @RequestBody ReportVoteRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.toggleVote(reportId, req.getVoteType())));
    }

    @GetMapping("/admin/reports")
    public ResponseEntity<ApiResponse<List<ReportAdminResponse>>> getAdminReports() {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getAdminReports()));
    }

    @PatchMapping("/admin/reports/{reportId}/status")
    public ResponseEntity<ApiResponse<ReportAdminResponse>> updateStatus(
            @PathVariable Long reportId,
            @Valid @RequestBody ReportStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.updateStatus(reportId, req.getStatus())));
    }
}

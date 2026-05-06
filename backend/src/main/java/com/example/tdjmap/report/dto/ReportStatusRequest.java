package com.example.tdjmap.report.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReportStatusRequest {

    @Pattern(regexp = "APPROVED|REJECTED", message = "status는 APPROVED 또는 REJECTED여야 합니다.")
    private String status;
}

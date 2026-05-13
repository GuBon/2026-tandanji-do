package com.example.tdjmap.report.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReportVoteRequest {

    @Pattern(regexp = "UP|DOWN", message = "voteType은 UP 또는 DOWN이어야 합니다.")
    private String voteType;
}

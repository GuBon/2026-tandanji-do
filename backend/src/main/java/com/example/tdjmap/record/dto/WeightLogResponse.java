package com.example.tdjmap.record.dto;

import com.example.tdjmap.entity.WeightLog;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WeightLogResponse {

    private Long logId;
    private Double weightKg;
    private LocalDateTime recordedAt;

    public static WeightLogResponse from(WeightLog log) {
        return WeightLogResponse.builder()
                .logId(log.getId())
                .weightKg(log.getWeightKg())
                .recordedAt(log.getRecordedAt())
                .build();
    }
}

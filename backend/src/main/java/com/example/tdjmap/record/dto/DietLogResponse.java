package com.example.tdjmap.record.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DietLogResponse {
    private Long logId;
    private Long menuId;
    private String foodName;
    private String mealType;
    private Long logKcal;
    private Long logCarbs;
    private Long logProtein;
    private Long logFat;
    private Long logSugar;
    private LocalDateTime ateAt;
}

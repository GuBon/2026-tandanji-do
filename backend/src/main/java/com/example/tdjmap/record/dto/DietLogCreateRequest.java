package com.example.tdjmap.record.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class DietLogCreateRequest {
    private Long menuId;
    private String foodName;
    private String mealType;
    @NotNull
    private Long logKcal;
    private Long logCarbs;
    private Long logProtein;
    private Long logFat;
    private Long logSugar;
    private String imgUrl;
    @NotNull
    private LocalDateTime ateAt;
}

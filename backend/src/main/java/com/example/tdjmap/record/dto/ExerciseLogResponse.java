package com.example.tdjmap.record.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExerciseLogResponse {
    private Long exerciseId;
    private Long typeId;
    private String typeName;
    private String title;
    private Long durationMin;
    private Long caloriesBurned;
    private String memo;
    private LocalDateTime createdAt;
}

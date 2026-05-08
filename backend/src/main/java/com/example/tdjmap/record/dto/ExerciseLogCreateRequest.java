package com.example.tdjmap.record.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ExerciseLogCreateRequest {
    @NotNull
    private Long typeId;
    private String title;
    @NotNull
    @Min(1)
    private Long durationMin;
    private Long caloriesBurned;
    private String memo;
}

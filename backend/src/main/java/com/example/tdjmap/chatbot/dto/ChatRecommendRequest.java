package com.example.tdjmap.chatbot.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatRecommendRequest {

    @NotNull
    @DecimalMin("-90.0") @DecimalMax("90.0")
    private Double lat;

    @NotNull
    @DecimalMin("-180.0") @DecimalMax("180.0")
    private Double lng;

    private String weather;

    @Min(-60) @Max(70)
    private Integer temperature;

    @NotBlank
    @Size(min = 1, max = 1000)
    private String message;
}

package com.example.tdjmap.report.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReportCreateRequest {

    @NotBlank
    private String storeName;

    @NotBlank
    private String menuName;

    private Long carbs;
    private Long protein;
    private Long fat;
    private String imageUrl;
}

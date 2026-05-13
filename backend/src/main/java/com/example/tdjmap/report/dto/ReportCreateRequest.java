package com.example.tdjmap.report.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReportCreateRequest {

    private Long storeId;

    @NotBlank
    private String storeName;

    private String storeAddress;
    private Double storeLat;
    private Double storeLon;

    @NotBlank
    private String menuName;

    private Long carbs;
    private Long protein;
    private Long fat;
    private String imageUrl;
}

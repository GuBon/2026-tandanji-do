package com.example.tdjmap.report.dto;

import com.example.tdjmap.entity.Report;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReportAdminResponse {

    private Long reportId;
    private Long userId;
    private String userNickname;
    private String storeName;
    private String storeAddress;
    private Double storeLat;
    private Double storeLon;
    private String menuName;
    private Long carbs;
    private Long protein;
    private Long fat;
    private String imageUrl;
    private String status;
    private LocalDateTime createdAt;

    public static ReportAdminResponse from(Report r) {
        return ReportAdminResponse.builder()
                .reportId(r.getId())
                .userId(r.getUser().getId())
                .userNickname(r.getUser().getNickname())
                .storeName(r.getStoreName())
                .storeAddress(r.getStoreAddress())
                .storeLat(r.getStoreLat())
                .storeLon(r.getStoreLon())
                .menuName(r.getMenuName())
                .carbs(r.getCarbs())
                .protein(r.getProtein())
                .fat(r.getFat())
                .imageUrl(r.getImageUrl())
                .status(r.getStatus())
                .createdAt(r.getCreatedAt())
                .build();
    }
}

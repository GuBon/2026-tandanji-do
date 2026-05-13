package com.example.tdjmap.report.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReportPublicResponse {
    private Long reportId;
    private Long storeId;
    private String storeName;
    private String storeAddress;
    private Double storeLat;
    private Double storeLon;
    private Long menuId;
    private String menuName;
    private Long carbs;
    private Long protein;
    private Long fat;
    private String imageUrl;
    private long upVotes;
    private long downVotes;
    private String myVote;
    private LocalDateTime createdAt;
}

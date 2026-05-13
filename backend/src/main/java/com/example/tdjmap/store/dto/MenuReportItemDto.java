package com.example.tdjmap.store.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MenuReportItemDto {
    private Long reportId;
    private Long carbs;
    private Long protein;
    private Long fat;
    private String imageUrl;
    private long upVotes;
    private long downVotes;
    private String myVote;
    private LocalDateTime createdAt;
}

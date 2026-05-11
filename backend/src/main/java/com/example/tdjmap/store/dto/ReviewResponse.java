package com.example.tdjmap.store.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewResponse {

    private Long reviewId;
    private Long userId;
    private String nickname;
    private Short star;
    private String content;
    private LocalDateTime createdAt;
    private long likeCount;
    private boolean liked;
}

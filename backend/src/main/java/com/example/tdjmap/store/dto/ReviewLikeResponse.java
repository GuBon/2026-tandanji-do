package com.example.tdjmap.store.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReviewLikeResponse {

    private final boolean liked;
    private final long likeCount;
}

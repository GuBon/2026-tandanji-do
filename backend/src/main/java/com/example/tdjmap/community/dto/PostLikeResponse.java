package com.example.tdjmap.community.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PostLikeResponse {
    private final boolean liked;
    private final long likeCount;
}

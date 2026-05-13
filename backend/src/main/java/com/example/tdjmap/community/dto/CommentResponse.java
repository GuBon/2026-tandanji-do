package com.example.tdjmap.community.dto;

import com.example.tdjmap.entity.PostComment;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommentResponse {

    private Long commentId;
    private String content;
    private LocalDateTime createdAt;
    private boolean mine;

    public static CommentResponse from(PostComment comment, boolean mine) {
        return CommentResponse.builder()
                .commentId(comment.getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .mine(mine)
                .build();
    }
}

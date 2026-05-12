package com.example.tdjmap.community.dto;

import com.example.tdjmap.entity.Post;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PostResponse {

    private Long postId;
    private String postType;
    private String title;
    private String content;
    private String imageUrl;
    private long likeCount;
    private LocalDateTime createdAt;

    public static PostResponse from(Post post, long likeCount) {
        return PostResponse.builder()
                .postId(post.getId())
                .postType(post.getPostType())
                .title(post.getTitle())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .likeCount(likeCount)
                .createdAt(post.getCreatedAt())
                .build();
    }
}

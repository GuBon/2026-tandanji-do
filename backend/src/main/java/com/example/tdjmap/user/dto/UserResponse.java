package com.example.tdjmap.user.dto;

import com.example.tdjmap.entity.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {

    private Long userId;
    private String nickname;
    private String role;
    private Long height;
    private Long weight;
    private String gender;
    private LocalDateTime createdAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .userId(user.getId())
                .nickname(user.getNickname())
                .role(user.getRole())
                .height(user.getHeight())
                .weight(user.getWeight())
                .gender(user.getGender())
                .createdAt(user.getCreatedAt())
                .build();
    }
}

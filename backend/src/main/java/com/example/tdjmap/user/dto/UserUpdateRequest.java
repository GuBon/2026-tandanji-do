package com.example.tdjmap.user.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserUpdateRequest {

    @Size(max = 50)
    private String nickname;

    private Long height;
    private Long weight;

    @Size(max = 1)
    private String gender; // M | F

    @jakarta.validation.constraints.Min(1)
    @jakarta.validation.constraints.Max(120)
    private Integer age;
}

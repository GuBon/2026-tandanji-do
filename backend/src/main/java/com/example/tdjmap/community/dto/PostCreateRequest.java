package com.example.tdjmap.community.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PostCreateRequest {

    @NotBlank
    @Size(max = 50)
    private String postType;

    @NotBlank
    @Size(max = 100)
    private String title;

    @NotBlank
    private String content;

    private String imageUrl;
}

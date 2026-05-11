package com.example.tdjmap.chatbot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class NutritionAnalysisRequest {

    @NotBlank(message = "요청을 처리하지 못했어요. 위치나 이미지를 다시 확인한 뒤 다시 시도해 주세요.")
    @Size(max = 14_000_000, message = "요청을 처리하지 못했어요. 위치나 이미지를 다시 확인한 뒤 다시 시도해 주세요.")
    @Pattern(
            regexp = "^data:image/(jpeg|jpg|png|webp|gif);base64,[A-Za-z0-9+/=]+$",
            message = "요청을 처리하지 못했어요. 위치나 이미지를 다시 확인한 뒤 다시 시도해 주세요."
    )
    private String image; // data:image/...;base64,... 형식의 Data URL
}

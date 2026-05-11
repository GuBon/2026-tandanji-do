package com.example.tdjmap.chatbot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NutritionAnalysisResponse {

    private Long menuId;
    private String menuName;
    private Long kcal;
    private Long carbs;
    private Long protein;
    private Long fat;
    private String nutritionGrade;
    private List<String> nutritionTags;
    private String reason;
}

package com.example.tdjmap.chatbot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatRecommendResponse {

    private List<Item> recommendations;
    private String reason;

    @Getter
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Item {
        private Long storeId;
        private String storeName;
        private String address;
        private Double lat;
        private Double lon;
        private Long menuId;
        private String menuName;
        private Long kcal;
        private Long carbs;
        private Long protein;
        private Long fat;
        private String nutritionGrade;
        private List<String> nutritionTags;
    }
}

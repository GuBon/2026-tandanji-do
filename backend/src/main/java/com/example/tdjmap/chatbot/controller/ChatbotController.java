package com.example.tdjmap.chatbot.controller;

import com.example.tdjmap.chatbot.dto.ChatRecommendRequest;
import com.example.tdjmap.chatbot.dto.ChatRecommendResponse;
import com.example.tdjmap.chatbot.dto.NutritionAnalysisRequest;
import com.example.tdjmap.chatbot.dto.NutritionAnalysisResponse;
import com.example.tdjmap.chatbot.service.ChatbotService;
import com.example.tdjmap.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/recommend")
    public ResponseEntity<ApiResponse<ChatRecommendResponse>> recommend(
            @RequestBody @Valid ChatRecommendRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(chatbotService.recommend(request)));
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<NutritionAnalysisResponse>> analyze(
            @RequestBody @Valid NutritionAnalysisRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(chatbotService.analyzeNutrition(request)));
    }
}

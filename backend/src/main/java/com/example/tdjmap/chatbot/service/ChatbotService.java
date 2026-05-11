package com.example.tdjmap.chatbot.service;

import com.example.tdjmap.chatbot.dto.ChatRecommendRequest;
import com.example.tdjmap.chatbot.dto.ChatRecommendResponse;
import com.example.tdjmap.chatbot.dto.NutritionAnalysisRequest;
import com.example.tdjmap.chatbot.dto.NutritionAnalysisResponse;
import com.example.tdjmap.common.exception.BusinessException;
import com.example.tdjmap.common.exception.ErrorCode;
import com.example.tdjmap.entity.Menu;
import com.example.tdjmap.entity.Store;
import com.example.tdjmap.repository.MenuRepository;
import com.example.tdjmap.repository.StoreRepository;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ChatbotService {

    private final StoreRepository storeRepository;
    private final MenuRepository menuRepository;
    private final ObjectMapper objectMapper;

    @Value("${tandanji.ai.base-url}")
    private String aiBaseUrl;

    // ── 메뉴 추천 ──────────────────────────────────────────────────────────────

    public ChatRecommendResponse recommend(ChatRecommendRequest req) {
        JsonNode aiJson = callAiPost("/api/v1/tandanji-ai/recommendations", buildRecommendBody(req));

        JsonNode recNode = aiJson.path("recommendations");
        String reasonVal = aiJson.path("reason").stringValue();
        String reason = reasonVal != null ? reasonVal : "추천할 수 있는 메뉴를 찾지 못했어요.";

        List<ChatRecommendResponse.Item> items = new ArrayList<>();
        if (recNode.isArray()) {
            for (JsonNode item : recNode) {
                ChatRecommendResponse.Item enriched = enrichRecommendItem(
                        item.path("storeId").asLong(),
                        item.path("menuId").asLong()
                );
                if (enriched != null) items.add(enriched);
            }
        }

        return ChatRecommendResponse.builder()
                .recommendations(items)
                .reason(reason)
                .build();
    }

    // ── 이미지 영양 분석 ───────────────────────────────────────────────────────

    public NutritionAnalysisResponse analyzeNutrition(NutritionAnalysisRequest req) {
        JsonNode aiJson = callAiPost("/api/v1/tandanji-ai/nutrition-analysis",
                Map.of("image", req.getImage()));

        String reasonVal = aiJson.path("reason").stringValue();
        String reason = reasonVal != null ? reasonVal : "분석을 완료하지 못했어요.";

        JsonNode menuIdNode = aiJson.path("menuId");
        if (menuIdNode.isNull() || menuIdNode.isMissingNode()) {
            return NutritionAnalysisResponse.builder().reason(reason).build();
        }

        Long menuId = menuIdNode.asLong();
        Menu menu = menuRepository.findById(menuId).orElse(null);
        if (menu == null) {
            log.warn("nutrition analysis: menuId={} not found in DB", menuId);
            return NutritionAnalysisResponse.builder().menuId(menuId).reason(reason).build();
        }

        String grade = null;
        List<String> tags = null;
        if (menu.getNutritionInfo() != null) {
            try {
                JsonNode info = objectMapper.readTree(menu.getNutritionInfo());
                if (!info.path("grade").isMissingNode()) grade = info.path("grade").stringValue();
                JsonNode tagsNode = info.path("tags");
                if (tagsNode.isArray()) {
                    tags = new ArrayList<>();
                    for (JsonNode t : tagsNode) tags.add(t.stringValue());
                }
            } catch (Exception e) {
                log.warn("nutrition_info parse error for menuId={}", menuId);
            }
        }

        return NutritionAnalysisResponse.builder()
                .menuId(menu.getId())
                .menuName(menu.getName())
                .kcal(menu.getKcal())
                .carbs(menu.getCarbs())
                .protein(menu.getProtein())
                .fat(menu.getFat())
                .nutritionGrade(grade)
                .nutritionTags(tags)
                .reason(reason)
                .build();
    }

    // ── 공통 HTTP 호출 ─────────────────────────────────────────────────────────

    private JsonNode callAiPost(String path, Object body) {
        try {
            String requestBody = objectMapper.writeValueAsString(body);
            log.info("AI API 요청 — path: {}, body length: {}", path, requestBody.length());

            URL url = new URL(aiBaseUrl + path);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            conn.setDoOutput(true);
            conn.setConnectTimeout(10_000);
            conn.setReadTimeout(90_000); // AI worker 대기 최대 90초

            byte[] bodyBytes = requestBody.getBytes(StandardCharsets.UTF_8);
            conn.setRequestProperty("Content-Length", String.valueOf(bodyBytes.length));

            try (OutputStream os = conn.getOutputStream()) {
                os.write(bodyBytes);
                os.flush();
            }

            int statusCode = conn.getResponseCode();
            InputStream responseStream = statusCode >= 400 ? conn.getErrorStream() : conn.getInputStream();
            String responseBody = responseStream != null
                    ? new String(responseStream.readAllBytes(), StandardCharsets.UTF_8)
                    : "";
            log.info("AI API 응답 — path: {}, status: {}, body: {}", path, statusCode, responseBody);

            if (statusCode == 422) {
                log.warn("AI API 검증 오류 응답 — HTTP {}: {}", statusCode, responseBody);
                throw new BusinessException(ErrorCode.AI_INVALID_REQUEST);
            }

            if (statusCode < 200 || statusCode >= 300) {
                log.warn("AI API 오류 응답 — HTTP {}: {}", statusCode, responseBody);
                throw new BusinessException(ErrorCode.AI_API_UNAVAILABLE);
            }

            return objectMapper.readTree(responseBody);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.warn("AI API 호출 실패 — path: {}, error: {}", path, e.getMessage(), e);
            throw new BusinessException(ErrorCode.AI_API_UNAVAILABLE);
        }
    }

    // ── 내부 헬퍼 ──────────────────────────────────────────────────────────────

    private Map<String, Object> buildRecommendBody(ChatRecommendRequest req) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("location", Map.of("lat", req.getLat(), "lng", req.getLng()));

        if (req.getWeather() != null || req.getTemperature() != null) {
            Map<String, Object> weatherMap = new LinkedHashMap<>();
            if (req.getWeather() != null) weatherMap.put("condition", req.getWeather());
            if (req.getTemperature() != null) weatherMap.put("temperature", req.getTemperature());
            body.put("weather", weatherMap);
        }
        body.put("message", req.getMessage());
        return body;
    }

    private ChatRecommendResponse.Item enrichRecommendItem(Long storeId, Long menuId) {
        try {
            Store store = storeRepository.findById(storeId).orElse(null);
            Menu menu = menuRepository.findById(menuId).orElse(null);
            if (store == null || menu == null) {
                log.warn("recommendation item not found: storeId={}, menuId={}", storeId, menuId);
                return null;
            }

            String grade = null;
            List<String> tags = null;
            if (menu.getNutritionInfo() != null) {
                try {
                    JsonNode info = objectMapper.readTree(menu.getNutritionInfo());
                    if (!info.path("grade").isMissingNode()) grade = info.path("grade").stringValue();
                    JsonNode tagsNode = info.path("tags");
                    if (tagsNode.isArray()) {
                        tags = new ArrayList<>();
                        for (JsonNode t : tagsNode) tags.add(t.stringValue());
                    }
                } catch (Exception e) {
                    log.warn("nutrition_info parse error for menuId={}", menuId);
                }
            }

            return ChatRecommendResponse.Item.builder()
                    .storeId(store.getId())
                    .storeName(store.getName())
                    .address(store.getAddress())
                    .lat(store.getLatitude() != null ? store.getLatitude().doubleValue() : null)
                    .lon(store.getLongitude() != null ? store.getLongitude().doubleValue() : null)
                    .menuId(menu.getId())
                    .menuName(menu.getName())
                    .kcal(menu.getKcal())
                    .carbs(menu.getCarbs())
                    .protein(menu.getProtein())
                    .fat(menu.getFat())
                    .nutritionGrade(grade)
                    .nutritionTags(tags)
                    .build();
        } catch (Exception e) {
            log.warn("Error enriching recommendation item: storeId={}, menuId={}", storeId, menuId, e);
            return null;
        }
    }
}

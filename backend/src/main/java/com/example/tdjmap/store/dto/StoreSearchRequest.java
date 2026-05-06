package com.example.tdjmap.store.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class StoreSearchRequest {

    private final Double swLat;
    private final Double swLng;
    private final Double neLat;
    private final Double neLng;
    private final String category;
    private final Integer minProtein;
    private final Integer maxCarbs;
    private final Integer maxFat;
    private final Integer maxSugar;

    public boolean hasNutritionFilter() {
        return minProtein != null || maxCarbs != null || maxFat != null || maxSugar != null;
    }
}

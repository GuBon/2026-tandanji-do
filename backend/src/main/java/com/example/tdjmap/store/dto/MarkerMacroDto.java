package com.example.tdjmap.store.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MarkerMacroDto {
    private final Long carbs;
    private final Long protein;
    private final Long fat;
    private final String nutritionGrade;
}
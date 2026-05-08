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
    private final String keyword;
}

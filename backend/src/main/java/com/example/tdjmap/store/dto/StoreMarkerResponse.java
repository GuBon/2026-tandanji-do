package com.example.tdjmap.store.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StoreMarkerResponse {

    private Long storeId;
    private Long brandId;
    private String storeName;
    private Double latitude;
    private Double longitude;
    private String category;
    private MarkerMacroDto markerMacro;
}

package com.example.tdjmap.store.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StoreDetailResponse {

    private Long storeId;
    private String storeName;
    private String address;
    private Double latitude;
    private Double longitude;
    private String category;
    private BrandDto brand;

    @Getter
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class BrandDto {
        private Long brandId;
        private String brandName;
        private String logoUrl;
    }
}

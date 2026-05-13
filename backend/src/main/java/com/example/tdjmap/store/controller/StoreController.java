package com.example.tdjmap.store.controller;

import com.example.tdjmap.common.ApiResponse;
import com.example.tdjmap.store.dto.*;
import com.example.tdjmap.store.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    /**
     * GET /stores/search
     * 지도 bbox 및 필터 조건에 따른 식당 마커 리스트 조회
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<StoreMarkerResponse>>> searchStores(
            @RequestParam("sw_lat") Double swLat,
            @RequestParam("sw_lng") Double swLng,
            @RequestParam("ne_lat") Double neLat,
            @RequestParam("ne_lng") Double neLng,
            @RequestParam(value = "category",    required = false) String category,
            @RequestParam(value = "q",           required = false) String keyword
    ) {
        StoreSearchRequest req = new StoreSearchRequest(
                swLat, swLng, neLat, neLng, category, keyword);
        return ResponseEntity.ok(ApiResponse.ok(storeService.searchStores(req)));
    }

    /**
     * GET /stores/{store_id}
     * 식당 기본 정보 및 브랜드 상세 조회
     */
    @GetMapping("/{storeId}")
    public ResponseEntity<ApiResponse<StoreDetailResponse>> getStoreDetail(
            @PathVariable Long storeId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(storeService.getStoreDetail(storeId)));
    }

    /**
     * GET /stores/{store_id}/menus
     * 해당 식당(브랜드)의 메뉴 리스트 조회
     */
    @GetMapping("/{storeId}/menus")
    public ResponseEntity<ApiResponse<List<MenuResponse>>> getStoreMenus(
            @PathVariable Long storeId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(storeService.getStoreMenus(storeId)));
    }

    /**
     * GET /stores/{store_id}/reviews
     * 해당 식당의 리뷰 리스트 조회 (최신순)
     */
    @GetMapping("/{storeId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getStoreReviews(
            @PathVariable Long storeId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(storeService.getStoreReviews(storeId)));
    }

    /**
     * POST /stores/{store_id}/reviews
     * 식당 리뷰 작성
     */
    @PostMapping("/{storeId}/reviews")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @PathVariable Long storeId,
            @Valid @RequestBody ReviewCreateRequest req
    ) {
        ReviewResponse response = storeService.createReview(storeId, req);
        return ResponseEntity.status(201).body(ApiResponse.created(response));
    }

    @GetMapping("/{storeId}/menu-reports")
    public ResponseEntity<ApiResponse<List<MenuReportGroupResponse>>> getMenuReports(
            @PathVariable Long storeId) {
        return ResponseEntity.ok(ApiResponse.ok(storeService.getMenuReports(storeId)));
    }

    @GetMapping("/{storeId}/reviews/{reviewId}/likes")
    public ResponseEntity<ApiResponse<ReviewLikeResponse>> getReviewLikeStatus(
            @PathVariable Long storeId,
            @PathVariable Long reviewId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(storeService.getReviewLikeStatus(storeId, reviewId)));
    }

    @PostMapping("/{storeId}/reviews/{reviewId}/likes")
    public ResponseEntity<ApiResponse<ReviewLikeResponse>> toggleReviewLike(
            @PathVariable Long storeId,
            @PathVariable Long reviewId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(storeService.toggleReviewLike(storeId, reviewId)));
    }
}

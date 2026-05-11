package com.example.tdjmap.store.service;

import com.example.tdjmap.common.exception.BusinessException;
import com.example.tdjmap.common.exception.ErrorCode;
import com.example.tdjmap.entity.Brand;
import com.example.tdjmap.entity.Review;
import com.example.tdjmap.entity.ReviewLike;
import com.example.tdjmap.entity.Store;
import com.example.tdjmap.entity.User;
import com.example.tdjmap.repository.MenuRepository;
import com.example.tdjmap.repository.ReviewLikeRepository;
import com.example.tdjmap.repository.ReviewRepository;
import com.example.tdjmap.repository.StoreRepository;
import com.example.tdjmap.repository.UserRepository;
import com.example.tdjmap.config.SecurityUtil;
import com.example.tdjmap.store.dto.*;
import com.example.tdjmap.repository.StoreQueryRepository;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StoreService {

    private final StoreRepository storeRepository;
    private final MenuRepository menuRepository;
    private final ReviewRepository reviewRepository;
    private final ReviewLikeRepository reviewLikeRepository;
    private final UserRepository userRepository;
    private final StoreQueryRepository storeQueryRepository;
    private final ObjectMapper objectMapper;

    // ── 지도 범위 + 필터로 식당 마커 목록 조회 ─────────────────────────────────

    public List<StoreMarkerResponse> searchStores(StoreSearchRequest req) {
        return storeQueryRepository.searchStoreMarkers(req);
    }

    // ── 식당 기본 정보 + 브랜드 상세 조회 ─────────────────────────────────────

    public StoreDetailResponse getStoreDetail(Long storeId) {
        Store store = findStoreOrThrow(storeId);
        Brand brand = store.getBrand();

        StoreDetailResponse.BrandDto brandDto = (brand != null)
                ? StoreDetailResponse.BrandDto.builder()
                        .brandId(brand.getId())
                        .brandName(brand.getName())
                        .logoUrl(brand.getLogoUrl())
                        .build()
                : null;

        return StoreDetailResponse.builder()
                .storeId(store.getId())
                .storeName(store.getName())
                .address(store.getAddress())
                .latitude(store.getLatitude().doubleValue())
                .longitude(store.getLongitude().doubleValue())
                .category(store.getCategory())
                .imageUrl(store.getImageUrl())
                .rating(reviewRepository.findAverageRatingByStoreId(storeId))
                .brand(brandDto)
                .build();
    }

    // ── 식당 브랜드의 메뉴 목록 조회 ──────────────────────────────────────────

    public List<MenuResponse> getStoreMenus(Long storeId) {
        Store store = findStoreOrThrow(storeId);
        Brand brand = store.getBrand();
        Long brandId = brand != null ? brand.getId() : null;

        return menuRepository.findStoreMenus(storeId, brandId).stream()
                .map(menu -> {
                    String grade = null;
                    List<String> tags = null;
                    if (menu.getNutritionInfo() != null) {
                        try {
                            Map<String, Object> info = objectMapper.readValue(
                                    menu.getNutritionInfo(), new TypeReference<>() {});
                            grade = (String) info.get("grade");
                            Object rawTags = info.get("tags");
                            if (rawTags instanceof List<?> list) {
                                tags = list.stream().map(Object::toString).toList();
                            }
                        } catch (Exception e) {
                            log.warn("nutritionInfo 파싱 실패: menu_id={}", menu.getId());
                        }
                    }
                    return MenuResponse.builder()
                            .menuId(menu.getId())
                            .menuName(menu.getName())
                            .kcal(menu.getKcal())
                            .carbs(menu.getCarbs())
                            .protein(menu.getProtein())
                            .fat(menu.getFat())
                            .menuUrl(menu.getMenuUrl())
                            .nutritionGrade(grade)
                            .nutritionTags(tags)
                            .build();
                })
                .toList();
    }

    // ── 식당 리뷰 목록 조회 ────────────────────────────────────────────────────

    public List<ReviewResponse> getStoreReviews(Long storeId) {
        findStoreOrThrow(storeId);
        List<Review> reviews = reviewRepository.findByStoreIdOrderByCreatedAtDesc(storeId);
        Map<Long, Long> likeCounts = loadReviewLikeCounts(reviews);
        Set<Long> likedReviewIds = loadLikedReviewIds(reviews);

        return reviews.stream()
                .map(review -> toReviewResponse(
                        review,
                        likeCounts.getOrDefault(review.getId(), 0L),
                        likedReviewIds.contains(review.getId())
                ))
                .toList();
    }

    // ── 리뷰 작성 ──────────────────────────────────────────────────────────────

    @Transactional
    public ReviewResponse createReview(Long storeId, ReviewCreateRequest req) {
        Store store = findStoreOrThrow(storeId);
        User user = userRepository.findById(SecurityUtil.getCurrentUserId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Review review = Review.builder()
                .store(store)
                .user(user)
                .star(req.getStar())
                .content(req.getContent())
                .createdAt(LocalDateTime.now())
                .build();

        Review saved = reviewRepository.save(review);

        return toReviewResponse(saved, 0L, false);
    }

    public ReviewLikeResponse getReviewLikeStatus(Long storeId, Long reviewId) {
        Review review = findReviewOrThrow(storeId, reviewId);
        Long userId = SecurityUtil.getCurrentUserId();
        return ReviewLikeResponse.builder()
                .liked(reviewLikeRepository.existsByReviewIdAndUserId(review.getId(), userId))
                .likeCount(reviewLikeRepository.countByReviewId(review.getId()))
                .build();
    }

    @Transactional
    public ReviewLikeResponse toggleReviewLike(Long storeId, Long reviewId) {
        Review review = findReviewOrThrow(storeId, reviewId);
        Long userId = SecurityUtil.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        boolean liked;
        var existing = reviewLikeRepository.findByReviewIdAndUserId(review.getId(), userId);
        if (existing.isPresent()) {
            reviewLikeRepository.delete(existing.get());
            liked = false;
        } else {
            reviewLikeRepository.save(ReviewLike.builder()
                    .review(review)
                    .user(user)
                    .createdAt(LocalDateTime.now())
                    .build());
            liked = true;
        }

        return ReviewLikeResponse.builder()
                .liked(liked)
                .likeCount(reviewLikeRepository.countByReviewId(review.getId()))
                .build();
    }

    // ── 내부 헬퍼 ──────────────────────────────────────────────────────────────

    private Store findStoreOrThrow(Long storeId) {
        return storeRepository.findById(storeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STORE_NOT_FOUND));
    }

    private Review findReviewOrThrow(Long storeId, Long reviewId) {
        return reviewRepository.findByIdAndStoreId(reviewId, storeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REVIEW_NOT_FOUND));
    }

    private ReviewResponse toReviewResponse(Review review, long likeCount, boolean liked) {
        return ReviewResponse.builder()
                .reviewId(review.getId())
                .userId(review.getUser().getId())
                .nickname(review.getUser().getNickname())
                .star(review.getStar())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .likeCount(likeCount)
                .liked(liked)
                .build();
    }

    private Map<Long, Long> loadReviewLikeCounts(List<Review> reviews) {
        if (reviews.isEmpty()) {
            return Collections.emptyMap();
        }
        return reviewLikeRepository.countByReviewIds(reviews.stream().map(Review::getId).toList())
                .stream()
                .collect(Collectors.toMap(
                        ReviewLikeRepository.ReviewLikeCount::getReviewId,
                        ReviewLikeRepository.ReviewLikeCount::getLikeCount
                ));
    }

    private Set<Long> loadLikedReviewIds(List<Review> reviews) {
        Long userId = SecurityUtil.getCurrentUserIdOrNull();
        if (userId == null || reviews.isEmpty()) {
            return Collections.emptySet();
        }
        return reviewLikeRepository.findLikedReviewIds(
                        reviews.stream().map(Review::getId).toList(),
                        userId
                )
                .stream()
                .collect(Collectors.toSet());
    }
}

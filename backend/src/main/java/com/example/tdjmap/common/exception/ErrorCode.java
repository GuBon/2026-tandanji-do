package com.example.tdjmap.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Store
    STORE_NOT_FOUND(404, "식당을 찾을 수 없습니다."),
    STORE_HAS_NO_BRAND(500, "식당에 브랜드 정보가 없습니다."),

    // Review
    REVIEW_NOT_FOUND(404, "리뷰를 찾을 수 없습니다."),
    REVIEW_INVALID_STAR(400, "별점은 1~5 사이여야 합니다."),

    // Post
    POST_NOT_FOUND(404, "게시글을 찾을 수 없습니다."),
    POST_FORBIDDEN(403, "게시글 삭제 권한이 없습니다."),

    // Comment
    COMMENT_NOT_FOUND(404, "댓글을 찾을 수 없습니다."),
    COMMENT_FORBIDDEN(403, "댓글 삭제 권한이 없습니다."),

    // Report
    REPORT_NOT_FOUND(404, "제보를 찾을 수 없습니다."),
    REPORT_VOTE_INVALID(400, "voteType은 UP 또는 DOWN이어야 합니다."),

    // Menu
    MENU_NOT_FOUND(404, "메뉴를 찾을 수 없습니다."),

    // Record
    DIET_LOG_NOT_FOUND(404, "식단 기록을 찾을 수 없습니다."),
    EXERCISE_LOG_NOT_FOUND(404, "운동 기록을 찾을 수 없습니다."),
    EXERCISE_TYPE_NOT_FOUND(404, "운동 종목을 찾을 수 없습니다."),

    // User
    USER_NOT_FOUND(404, "사용자를 찾을 수 없습니다."),

    // Auth
    AUTH_INVALID_TOKEN(401, "유효하지 않은 토큰입니다."),
    AUTH_EXPIRED_TOKEN(401, "만료된 토큰입니다."),
    AUTH_KAKAO_ERROR(400, "카카오 인증에 실패했습니다."),

    // Image
    IMAGE_EMPTY(400, "이미지 파일이 비어 있습니다."),
    IMAGE_INVALID_TYPE(400, "지원하지 않는 이미지 형식입니다. (jpg, png, webp, gif)"),
    IMAGE_TOO_LARGE(400, "이미지 크기는 10MB를 초과할 수 없습니다."),
    IMAGE_INVALID_DOMAIN(400, "잘못된 이미지 도메인입니다."),
    IMAGE_UPLOAD_FAILED(500, "이미지 저장에 실패했습니다."),

    // Chatbot
    AI_INVALID_REQUEST(422, "요청을 처리하지 못했어요. 위치나 이미지를 다시 확인한 뒤 다시 시도해 주세요."),
    AI_API_UNAVAILABLE(503, "AI 추천 서비스에 일시적으로 접근할 수 없습니다."),

    // Common
    FORBIDDEN(403, "접근 권한이 없습니다."),
    INVALID_REQUEST(400, "잘못된 요청입니다."),
    INTERNAL_ERROR(500, "서버 오류가 발생했습니다.");

    private final int status;
    private final String message;
}

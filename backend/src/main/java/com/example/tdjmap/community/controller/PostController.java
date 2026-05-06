package com.example.tdjmap.community.controller;

import com.example.tdjmap.common.ApiResponse;
import com.example.tdjmap.community.dto.PostLikeResponse;
import com.example.tdjmap.community.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    /**
     * GET /posts/{postId}/likes
     * 게시글 좋아요 수 및 내 좋아요 여부 조회 (JWT 인증 필요)
     */
    @GetMapping("/{postId}/likes")
    public ResponseEntity<ApiResponse<PostLikeResponse>> getLikeStatus(
            @PathVariable Long postId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(postService.getLikeStatus(postId)));
    }

    /**
     * POST /posts/{postId}/likes
     * 게시글 좋아요 토글 (JWT 인증 필요)
     */
    @PostMapping("/{postId}/likes")
    public ResponseEntity<ApiResponse<PostLikeResponse>> toggleLike(
            @PathVariable Long postId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(postService.toggleLike(postId)));
    }
}

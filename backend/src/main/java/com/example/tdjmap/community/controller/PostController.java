package com.example.tdjmap.community.controller;

import com.example.tdjmap.common.ApiResponse;
import com.example.tdjmap.community.dto.CommentCreateRequest;
import com.example.tdjmap.community.dto.CommentResponse;
import com.example.tdjmap.community.dto.PostCreateRequest;
import com.example.tdjmap.community.dto.PostLikeResponse;
import com.example.tdjmap.community.dto.PostResponse;
import com.example.tdjmap.community.service.CommentService;
import com.example.tdjmap.community.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getPosts(
            @RequestParam(required = false) String postType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(postService.getPosts(postType, page, size)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
            @RequestBody @Valid PostCreateRequest req) {
        return ResponseEntity.status(201).body(ApiResponse.created(postService.createPost(req)));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<ApiResponse<PostResponse>> getPost(@PathVariable Long postId) {
        return ResponseEntity.ok(ApiResponse.ok(postService.getPost(postId)));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/{postId}/likes")
    public ResponseEntity<ApiResponse<PostLikeResponse>> getLikeStatus(@PathVariable Long postId) {
        return ResponseEntity.ok(ApiResponse.ok(postService.getLikeStatus(postId)));
    }

    @PostMapping("/{postId}/likes")
    public ResponseEntity<ApiResponse<PostLikeResponse>> toggleLike(@PathVariable Long postId) {
        return ResponseEntity.ok(ApiResponse.ok(postService.toggleLike(postId)));
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(ApiResponse.ok(commentService.getComments(postId)));
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @PathVariable Long postId,
            @RequestBody @Valid CommentCreateRequest req) {
        return ResponseEntity.status(201).body(ApiResponse.created(commentService.createComment(postId, req)));
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId) {
        commentService.deleteComment(postId, commentId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}

package com.example.tdjmap.community.service;

import com.example.tdjmap.common.exception.BusinessException;
import com.example.tdjmap.common.exception.ErrorCode;
import com.example.tdjmap.community.dto.PostCreateRequest;
import com.example.tdjmap.community.dto.PostLikeResponse;
import com.example.tdjmap.community.dto.PostResponse;
import com.example.tdjmap.config.SecurityUtil;
import com.example.tdjmap.entity.Post;
import com.example.tdjmap.entity.PostLike;
import com.example.tdjmap.entity.User;
import com.example.tdjmap.repository.PostLikeRepository;
import com.example.tdjmap.repository.PostRepository;
import com.example.tdjmap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final UserRepository userRepository;

    // ── 게시글 목록 ────────────────────────────────────────────────────────────

    public Page<PostResponse> getPosts(String postType, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Post> posts = (postType != null && !postType.isBlank())
                ? postRepository.findByPostTypeOrderByCreatedAtDesc(postType, pageable)
                : postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return posts.map(p -> PostResponse.from(p, postLikeRepository.countByPostId(p.getId())));
    }

    // ── 게시글 상세 ────────────────────────────────────────────────────────────

    public PostResponse getPost(Long postId) {
        Post post = findPostOrThrow(postId);
        return PostResponse.from(post, postLikeRepository.countByPostId(postId));
    }

    // ── 게시글 작성 ────────────────────────────────────────────────────────────

    @Transactional
    public PostResponse createPost(PostCreateRequest req) {
        Long userId = SecurityUtil.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        Post post = postRepository.save(Post.builder()
                .user(user)
                .postType(req.getPostType())
                .title(req.getTitle())
                .content(req.getContent())
                .imageUrl(req.getImageUrl())
                .createdAt(LocalDateTime.now())
                .build());
        return PostResponse.from(post, 0L);
    }

    // ── 게시글 삭제 (작성자 본인만) ────────────────────────────────────────────

    @Transactional
    public void deletePost(Long postId) {
        Long userId = SecurityUtil.getCurrentUserId();
        Post post = findPostOrThrow(postId);
        if (!post.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.POST_FORBIDDEN);
        }
        postRepository.delete(post);
    }

    // ── 좋아요 상태 조회 ───────────────────────────────────────────────────────

    public PostLikeResponse getLikeStatus(Long postId) {
        Long userId = SecurityUtil.getCurrentUserId();
        findPostOrThrow(postId);
        boolean liked = postLikeRepository.existsByPostIdAndUserId(postId, userId);
        long likeCount = postLikeRepository.countByPostId(postId);
        return PostLikeResponse.builder()
                .liked(liked)
                .likeCount(likeCount)
                .build();
    }

    // ── 좋아요 토글 (없으면 추가, 있으면 취소) ────────────────────────────────

    @Transactional
    public PostLikeResponse toggleLike(Long postId) {
        Long userId = SecurityUtil.getCurrentUserId();
        Post post = findPostOrThrow(postId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Optional<PostLike> existing = postLikeRepository.findByPostIdAndUserId(postId, userId);
        boolean liked;

        if (existing.isPresent()) {
            postLikeRepository.delete(existing.get());
            liked = false;
        } else {
            postLikeRepository.save(PostLike.builder()
                    .post(post)
                    .user(user)
                    .createdAt(LocalDateTime.now())
                    .build());
            liked = true;
        }

        long likeCount = postLikeRepository.countByPostId(postId);
        return PostLikeResponse.builder()
                .liked(liked)
                .likeCount(likeCount)
                .build();
    }

    // ── 내부 헬퍼 ──────────────────────────────────────────────────────────────

    private Post findPostOrThrow(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
    }
}

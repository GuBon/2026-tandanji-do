package com.example.tdjmap.community.service;

import com.example.tdjmap.common.exception.BusinessException;
import com.example.tdjmap.common.exception.ErrorCode;
import com.example.tdjmap.community.dto.CommentCreateRequest;
import com.example.tdjmap.community.dto.CommentResponse;
import com.example.tdjmap.config.SecurityUtil;
import com.example.tdjmap.entity.Post;
import com.example.tdjmap.entity.PostComment;
import com.example.tdjmap.entity.User;
import com.example.tdjmap.repository.PostCommentRepository;
import com.example.tdjmap.repository.PostRepository;
import com.example.tdjmap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final PostCommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public List<CommentResponse> getComments(Long postId) {
        findPostOrThrow(postId);
        Long currentUserId = SecurityUtil.getCurrentUserIdOrNull();
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId).stream()
                .map(c -> CommentResponse.from(c, c.getUser().getId().equals(currentUserId)))
                .toList();
    }

    @Transactional
    public CommentResponse createComment(Long postId, CommentCreateRequest req) {
        Long userId = SecurityUtil.getCurrentUserId();
        Post post = findPostOrThrow(postId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        PostComment comment = commentRepository.save(PostComment.builder()
                .post(post)
                .user(user)
                .content(req.getContent())
                .createdAt(LocalDateTime.now())
                .build());
        return CommentResponse.from(comment, true);
    }

    @Transactional
    public void deleteComment(Long postId, Long commentId) {
        Long userId = SecurityUtil.getCurrentUserId();
        PostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));
        if (!comment.getPost().getId().equals(postId)) {
            throw new BusinessException(ErrorCode.COMMENT_NOT_FOUND);
        }
        if (!comment.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.COMMENT_FORBIDDEN);
        }
        commentRepository.delete(comment);
    }

    private Post findPostOrThrow(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
    }
}

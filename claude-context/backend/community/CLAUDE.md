# CLAUDE.md — community 패키지

게시글 CRUD + 좋아요 토글 + 댓글 CRUD API. 익명 게시판이므로 작성자 정보를 응답에 포함하지 않는다.

---

## 파일 구성

```
community/
├── controller/PostController.java    게시글 + 댓글 엔드포인트 통합 (PostService + CommentService 주입)
├── service/PostService.java
├── service/CommentService.java
└── dto/
    ├── PostCreateRequest.java        { postType, title, content, imageUrl? }
    ├── PostResponse.java             { postId, postType, title, content,
    │                                   imageUrl, likeCount, createdAt }
    │                                   ※ 익명 게시판 — authorId/nickname 미포함
    ├── PostLikeToggleRequest.java    {} (현재 컨트롤러에서는 미사용 — userId는 JWT에서 추출)
    ├── PostLikeResponse.java         { liked: boolean, likeCount: long }
    ├── CommentCreateRequest.java     { content: String (NotBlank, max 500) }
    └── CommentResponse.java          { commentId, content, createdAt, mine: boolean }
                                       ※ mine: 현재 로그인 사용자 작성 댓글이면 true
```

---

## API 목록

```
GET /posts
  인증 불필요
  Query:  postType (선택, '식단 공유'|'오운완'|'자유 게시판')
          page (기본 0), size (기본 20)
  Response: Page<PostResponse>

POST /posts
  Header: Authorization: Bearer <jwt>
  Body:   PostCreateRequest
  Response 201: PostResponse

GET /posts/{postId}
  인증 불필요
  Response: PostResponse

DELETE /posts/{postId}
  Header: Authorization: Bearer <jwt>
  Response 200: null
  에러: 403 POST_FORBIDDEN — 작성자 본인이 아닌 경우

GET /posts/{postId}/likes
  Header: Authorization: Bearer <jwt>
  Response: PostLikeResponse — 현재 좋아요 수 + 내 좋아요 여부

POST /posts/{postId}/likes
  Header: Authorization: Bearer <jwt>
  Body: 불필요
  Response: PostLikeResponse — 토글 후 상태
  동작: post_likes에 (postId, userId) 행이 없으면 INSERT, 있으면 DELETE

GET /posts/{postId}/comments
  인증 선택 (비로그인 시 mine=false, 로그인 시 자기 댓글 mine=true)
  SecurityConfig에 permitAll() 등록
  Response: List<CommentResponse>  정렬: createdAt ASC

POST /posts/{postId}/comments
  Header: Authorization: Bearer <jwt>
  Body:   CommentCreateRequest  { content }
  Response 201: CommentResponse  (mine=true 고정)
  에러: 404 POST_NOT_FOUND, 404 USER_NOT_FOUND

DELETE /posts/{postId}/comments/{commentId}
  Header: Authorization: Bearer <jwt>
  Response 200: null
  에러: 404 COMMENT_NOT_FOUND, 403 COMMENT_FORBIDDEN — 작성자 본인이 아닌 경우
  ※ pathVariable postId와 comment.post.id가 다르면 COMMENT_NOT_FOUND(404) 처리
```

---

## 핵심 설계

### 게시글

- 게시글 이미지: `POST /images/upload?domain=posts` 로 먼저 업로드 → 반환된 imageUrl을 `POST /posts` body에 포함
- `post_likes` 테이블: `UNIQUE(post_id, user_id)` — 중복 좋아요 DB 레벨에서 방지
- 목록 likeCount는 `PostLikeRepository.countByPostIds(...)`로 배치 조회해 N+1을 피한다.
- 상세/토글 후 likeCount는 `postLikeRepository.countByPostId(postId)` 로 정확히 재조회
- 게시글/사용자 미존재 시 각각 `POST_NOT_FOUND` / `USER_NOT_FOUND` 예외
- 삭제 권한 없을 시 `POST_FORBIDDEN` 예외

### 댓글

- `post_comments` 테이블: post_id FK + `ON DELETE CASCADE` — 게시글 삭제 시 댓글 자동 삭제
- CommentService.getComments: `SecurityUtil.getCurrentUserIdOrNull()` — 비인증 시 mine=false
- CommentService.createComment: `SecurityUtil.getCurrentUserId()` — 미인증 시 401
- mine 판정: `c.getUser().getId().equals(currentUserId)` 비교
- 댓글 삭제 시 postId 검증: comment.post.id ≠ pathVariable postId이면 COMMENT_NOT_FOUND(404)

---

## Repository 메서드

```java
// PostRepository
Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
Page<Post> findByPostTypeOrderByCreatedAtDesc(String postType, Pageable pageable);
List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);   // 마이페이지 등 미래 기능용 (현재 미사용)

// PostLikeRepository
Optional<PostLike> findByPostIdAndUserId(Long postId, Long userId);
long countByPostId(Long postId);
boolean existsByPostIdAndUserId(Long postId, Long userId);

// PostLikeRepository — 배치 N+1 방지 (중첩 projection 인터페이스 PostLikeCount 사용)
List<PostLikeCount> countByPostIds(Collection<Long> postIds);

interface PostLikeCount {          // PostLikeRepository 내부에 정의됨
    Long getPostId();
    Long getLikeCount();
}

// PostCommentRepository
List<PostComment> findByPostIdOrderByCreatedAtAsc(Long postId);
```

---

## 규칙

- 익명 게시판: `PostResponse`에 `authorId` / `nickname` 포함 금지 — 추가 요청이 와도 거절
- 목록 likeCount는 `PostLikeRepository.countByPostIds()` 배치 조회 필수 (N+1 방지)
- 게시글 삭제 시 작성자 불일치 → `POST_FORBIDDEN`(403), 댓글 삭제 시 → `COMMENT_FORBIDDEN`(403)
- 댓글 삭제 전 `comment.post.id` ≠ pathVariable `postId`이면 `COMMENT_NOT_FOUND`(404) 처리
- userId는 `SecurityUtil.getCurrentUserId()` / `getCurrentUserIdOrNull()`로만 추출

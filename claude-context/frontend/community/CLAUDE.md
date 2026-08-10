# CLAUDE.md — features/community/

커뮤니티 기능: 탭 피드 + 게시글 작성 + 게시글 상세 + 좋아요 + 댓글.

---

## 컴포넌트 구조

```
community/
├── CommunityPage.jsx    탭 피드. GET /posts?postType=... 연동. AuthRequiredModal 포함.
├── PostCreatePage.jsx   게시글 작성. 이미지 업로드 + POST /posts 연동. h-dvh 직접 레이아웃.
├── PostDetailPage.jsx   게시글 상세. GET /posts/{id}, 좋아요 상태/토글, 공유 버튼. AuthRequiredModal 포함.
└── PostComments.jsx     댓글 영역. GET/POST/DELETE /posts/{id}/comments 연동. 자기 댓글만 삭제(mine 플래그).
```

---

## 기능 흐름

### 탭 이름 (정확한 값)

```js
const TABS = ['식단 공유', '오운완', '자유 게시판']
```

- `post_type` DB 컬럼 값과 정확히 맞춰야 한다.
- 목록 조회: `GET /posts?postType=${TABS[activeTab]}`
- `PostCreatePage`는 `location.state?.postType`으로 진입 탭을 받는다.

### 사진 첨부 표시

목록 카드의 내용 앞에 `post.imageUrl`이 있으면 `📷 ` 이모지를 인라인으로 표시한다.

```jsx
<p className="mt-1 text-sm text-gray-500 line-clamp-2">
  {post.imageUrl && '📷 '}{post.content}
</p>
```

### 좋아요 상태

```js
// PostDetailPage
const [likeState, setLikeState] = useState(null)
// likeState: { liked: boolean, likeCount: number } | null

const next = await togglePostLike(id)
setLikeState(next)
setPost(prev => ({ ...prev, likeCount: next.likeCount }))
```

- 좋아요 버튼은 `requireAuth(handleLike)` 래핑

### 이미지 첨부 흐름

1. `ImageUploader domain="posts"`로 먼저 `POST /images/upload?domain=posts` 호출
2. 반환된 `imageUrl`을 `POST /posts` body에 포함

---

## API 연동

```js
fetchPosts({ postType, page, size })  // GET /posts
fetchPost(postId)                     // GET /posts/{postId}
createPost(payload)                   // POST /posts
deletePost(postId)                    // DELETE /posts/{postId}
fetchPostLikeStatus(postId)           // GET /posts/{postId}/likes
togglePostLike(postId)                // POST /posts/{postId}/likes

fetchComments(postId)                 // GET /posts/{postId}/comments → CommentItem[]
createComment(postId, content)        // POST /posts/{postId}/comments → CommentItem
deleteComment(postId, commentId)      // DELETE /posts/{postId}/comments/{commentId}
```

**CommentItem 응답 shape**:

```js
{ commentId: number, content: string, createdAt: string, mine: boolean }
// mine: 현재 로그인 사용자가 작성한 댓글이면 true
```

- 목록/상세/댓글 조회: 인증 불필요 (공개).
- 게시글 작성·삭제, 좋아요 상태/토글, 댓글 작성·삭제: JWT 필요.
- 비로그인/게스트가 해당 액션 시 `useAuthRequired` 훅의 `requireAuth(fn)` 패턴으로 `AuthRequiredModal` 표시.

---

## 주요 규칙

### 익명 게시판

- 작성자 닉네임은 목록/상세/댓글 어디에도 표시하지 않는다.
- `PostResponse`에 `authorId`/`nickname` 필드 없음 — 백엔드에서 제거됨. 파싱 및 표시 금지.
- 댓글도 동일하게 익명 — `CommentItem`에 닉네임 없음.
- 자기 댓글 식별은 `comment.mine === true`로 처리 (삭제 버튼 표시 조건).

### PostCreatePage 레이아웃

`PostCreatePage`는 `PageLayout`을 사용하지 않는다. 직접 `div.h-dvh.flex.flex-col` 구조.

```jsx
<div className="w-full h-dvh flex flex-col overflow-hidden bg-white">
  <Header left={<CloseIcon>} title="게시글 작성" right={<등록버튼>} />
  <main className="flex-1 overflow-y-auto">
    {/* 게시판 선택 탭 → 이미지 업로드 → 제목 → 내용 */}
  </main>
</div>
```

- 헤더 오른쪽: `disabled={!canSubmit}` 등록 버튼 (`canSubmit = title.trim() && content.trim() && !saving`)
- 이미지: `ImageUploader domain="posts" aspectRatio={null}` — 비로그인 시 requireAuth 트리거

### PostDetailPage 레이아웃

`PostDetailPage`는 `PageLayout`을 사용하지 않는다. 직접 `div.h-dvh.flex.flex-col` 구조.

- 공유 버튼: `navigator.share()` 지원 시 Web Share API, 아니면 `navigator.clipboard.writeText(url)`

### PostComments 컴포넌트

```jsx
<PostComments postId={id} />
```

- 마운트 시 `GET /posts/{postId}/comments` 자동 로드
- 댓글 입력은 단일 라인 `<input>`. Enter 키로 제출, 제출 중 비활성.
- 삭제: `comment.mine === true`인 댓글에만 삭제 버튼(TrashIcon) 표시
- 삭제 성공 시 로컬 상태에서 즉시 제거 (API 성공 후)
- `AuthRequiredModal`을 자체적으로 포함해 독립적으로 렌더링 가능

### UI 상태 문구

| 상황 | 표시 문구 |
|------|-----------|
| 목록 로딩 중 | "게시글을 불러오는 중..." |
| 목록 빈 결과 | "아직 게시글이 없어요" |
| 목록 API 실패 | "게시글을 불러오지 못했습니다." |
| 상세 로딩 중 | "게시글을 불러오는 중..." |
| 상세 API 실패 | "게시글을 불러올 수 없어요" |
| 댓글 로딩 중 | "댓글을 불러오는 중..." |
| 댓글 빈 결과 | "아직 댓글이 없어요" |
| 댓글 로드 실패 | "댓글을 불러올 수 없어요" |
| 댓글 작성 실패 | "댓글 등록에 실패했습니다." |
| 댓글 삭제 실패 | "댓글 삭제에 실패했습니다." |

---

## DO / DON'T

```
✅ DO
- 작성자 닉네임은 목록/상세/댓글 어디에도 표시하지 않는다 (익명 게시판)
- postType 값은 TABS 상수 그대로 사용 ('식단 공유'|'오운완'|'자유 게시판')
- 인증이 필요한 액션(글쓰기·좋아요·댓글 작성·삭제)은 requireAuth()로 반드시 감싼다
- 댓글 삭제 버튼은 comment.mine === true 인 항목에만 표시

❌ DON'T
- PostResponse에서 authorId/nickname 필드를 파싱하거나 표시하지 말 것 — 백엔드에서 제거됨
- 새 탭 추가 시 TABS 배열과 DB postType 컬럼 값 불일치 금지
- PostComments를 PostDetailPage 밖에서 단독 사용 시 postId prop 누락 주의
```

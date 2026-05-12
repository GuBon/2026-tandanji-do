import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header.jsx'
import AuthRequiredModal from '../../components/AuthRequiredModal.jsx'
import { useAuthRequired } from '../../hooks/useAuthRequired.js'
import { fetchPost, fetchPostLikeStatus, togglePostLike } from '../../api/postApi.js'

const BackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)

export default function PostDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [likeState, setLikeState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { requireAuth, modalOpen: authModalOpen, closeModal: closeAuthModal } = useAuthRequired()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      fetchPost(id),
      fetchPostLikeStatus(id).catch(() => null),
    ])
      .then(([postData, likeData]) => {
        if (cancelled) return
        setPost(postData)
        setLikeState(likeData)
      })
      .catch(() => {
        if (!cancelled) setError('게시글을 불러올 수 없어요')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  const handleLike = async () => {
    try {
      const next = await togglePostLike(id)
      setLikeState(next)
      setPost((prev) => prev ? { ...prev, likeCount: next.likeCount } : prev)
    } catch {
      setError('좋아요 처리에 실패했습니다.')
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share && post) {
      await navigator.share({ title: post.title, url })
      return
    }
    await navigator.clipboard?.writeText(url)
  }

  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden bg-white">
      <Header
        left={
          <button onClick={() => navigate(-1)} className="text-gray-700">
            <BackIcon />
          </button>
        }
        title="게시글 상세"
        right={
          <div className="flex items-center gap-3 text-gray-600">
            <button onClick={() => handleShare().catch(() => {})}><ShareIcon /></button>
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto px-5 py-5">
        {loading && (
          <div className="h-40 flex items-center justify-center text-sm text-gray-400">
            게시글을 불러오는 중...
          </div>
        )}
        {!loading && error && !post && (
          <div className="h-40 flex items-center justify-center text-sm text-gray-400">
            {error}
          </div>
        )}
        {!loading && post && (
          <article className="flex flex-col gap-4">
            <div>
              <div>
                <span className="text-xs font-semibold text-primary">{post.postType}</span>
              </div>
              <h1 className="mt-2 text-2xl font-bold text-gray-900 leading-snug">{post.title}</h1>
              <p className="mt-1 text-xs text-gray-400">
                {post.createdAt ? new Date(post.createdAt).toLocaleString('ko-KR') : ''}
              </p>
            </div>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt=""
                className="w-full rounded-2xl object-cover bg-gray-100"
              />
            )}

            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">{post.content}</p>

            <button
              onClick={() => requireAuth(handleLike)}
              className={[
                'self-start h-10 px-4 rounded-full text-sm font-semibold transition-colors',
                likeState?.liked
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600',
              ].join(' ')}
            >
              좋아요 {likeState?.likeCount ?? post.likeCount ?? 0}
            </button>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}
          </article>
        )}
      </main>
      {authModalOpen && <AuthRequiredModal onClose={closeAuthModal} />}
    </div>
  )
}

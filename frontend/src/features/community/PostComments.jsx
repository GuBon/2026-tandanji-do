import { useEffect, useState } from 'react'
import { fetchComments, createComment, deleteComment } from '../../api/postApi.js'
import { useAuthRequired } from '../../hooks/useAuthRequired.js'
import AuthRequiredModal from '../../components/AuthRequiredModal.jsx'

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
)

export default function PostComments({ postId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const { requireAuth, modalOpen: authModalOpen, closeModal: closeAuthModal } = useAuthRequired()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchComments(postId)
      .then(data => { if (!cancelled) setComments(data) })
      .catch(() => { if (!cancelled) setError('댓글을 불러올 수 없어요') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [postId])

  const handleSubmit = async () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setSubmitting(true)
    setError(null)
    try {
      const newComment = await createComment(postId, trimmed)
      setComments(prev => [...prev, newComment])
      setInput('')
    } catch {
      setError('댓글 등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(postId, commentId)
      setComments(prev => prev.filter(c => c.commentId !== commentId))
    } catch {
      setError('댓글 삭제에 실패했습니다.')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !submitting) {
      e.preventDefault()
      requireAuth(handleSubmit)
    }
  }

  return (
    <section className="mt-6 border-t border-gray-100 pt-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        댓글 {comments.length > 0 ? comments.length : ''}
      </h2>

      {loading && (
        <p className="text-xs text-gray-400 py-3">댓글을 불러오는 중...</p>
      )}

      {!loading && !error && comments.length === 0 && (
        <p className="text-xs text-gray-400 py-3">아직 댓글이 없어요</p>
      )}

      {!loading && comments.length > 0 && (
        <ul className="flex flex-col gap-3 mb-4">
          {comments.map(c => (
            <li key={c.commentId} className="flex items-start gap-2">
              <p className="flex-1 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-all">
                {c.content}
              </p>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] text-gray-400">
                  {new Date(c.createdAt).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                {c.mine && (
                  <button
                    onClick={() => handleDelete(c.commentId)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    aria-label="댓글 삭제"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>
      )}

      <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-3 py-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="댓글을 입력하세요"
          maxLength={500}
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
        />
        <button
          onClick={() => requireAuth(handleSubmit)}
          disabled={submitting || !input.trim()}
          className="text-xs font-semibold text-primary disabled:text-gray-300 transition-colors shrink-0"
        >
          등록
        </button>
      </div>

      {authModalOpen && <AuthRequiredModal onClose={closeAuthModal} />}
    </section>
  )
}

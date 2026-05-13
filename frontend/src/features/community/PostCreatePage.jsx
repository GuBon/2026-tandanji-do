import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Header.jsx'
import ImageUploader from '../../components/ImageUploader.jsx'
import AuthRequiredModal from '../../components/AuthRequiredModal.jsx'
import { createPost } from '../../api/postApi.js'
import { useAuthRequired } from '../../hooks/useAuthRequired.js'
import useAuthStore from '../../store/useAuthStore.js'

const TABS = ['식단 공유', '오운완', '자유 게시판']

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function PostCreatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const { requireAuth, modalOpen: authModalOpen, closeModal: closeAuthModal } = useAuthRequired()

  const [postType, setPostType] = useState(location.state?.postType ?? TABS[0])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState(null)

  const canSubmit = title.trim() && content.trim() && !saving

  const submitPost = async () => {
    if (!canSubmit) return
    setSaving(true)
    setErr(null)
    try {
      await createPost({ postType, title: title.trim(), content: content.trim(), imageUrl })
      navigate('/community', { replace: true })
    } catch {
      setErr('게시글 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = () => requireAuth(submitPost)

  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden bg-white">
      <Header
        left={
          <button onClick={() => navigate(-1)} className="text-gray-700">
            <CloseIcon />
          </button>
        }
        title="게시글 작성"
        right={
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="h-9 px-5 bg-primary text-white text-sm font-bold rounded-full transition-opacity disabled:opacity-40"
          >
            {saving ? '등록 중...' : '등록'}
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-5 px-5 py-5 pb-10">

          {/* 게시판 선택 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-gray-900">게시판</span>
            <div className="flex gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPostType(tab)}
                  className={[
                    'shrink-0 h-9 px-4 rounded-full text-sm font-semibold transition-colors',
                    postType === tab
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-500',
                  ].join(' ')}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-gray-900">
              이미지 <span className="font-normal text-gray-400 text-xs">(선택)</span>
            </span>
            {user ? (
              <ImageUploader
                domain="posts"
                onChange={setImageUrl}
                aspectRatio={null}
              />
            ) : (
              <button
                type="button"
                onClick={() => requireAuth(() => {})}
                className="w-full h-20 rounded-2xl border border-dashed border-gray-200 bg-surface-container-low text-sm font-semibold text-gray-400"
              >
                로그인 후 이미지 첨부 가능
              </button>
            )}
          </div>

          {/* 제목 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-gray-900">제목</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={100}
              className="w-full h-12 px-4 bg-surface-container-low rounded-2xl text-sm text-gray-700 outline-none placeholder-gray-400"
            />
          </div>

          {/* 내용 작성 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-gray-900">내용</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="이웃들과 건강한 정보를 공유해보세요..."
              rows={6}
              className="w-full bg-surface-container-low rounded-2xl px-4 py-3.5 text-sm text-gray-700 outline-none resize-none placeholder-gray-400"
            />
          </div>

          {err && (
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{err}</p>
          )}

          <p className="text-xs text-gray-400 leading-relaxed text-center">
            커뮤니티 가이드라인을 준수해주세요. 부적절한 게시글은 관리자에 의해 삭제될 수 있습니다.
          </p>
        </div>
      </main>
      {authModalOpen && <AuthRequiredModal onClose={closeAuthModal} />}
    </div>
  )
}

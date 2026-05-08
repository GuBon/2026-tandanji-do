import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import Header from '../../components/Header.jsx'
import Button from '../../components/Button.jsx'
import AuthRequiredModal from '../../components/AuthRequiredModal.jsx'
import { useAuthRequired } from '../../hooks/useAuthRequired.js'
import { fetchPosts } from '../../api/postApi.js'

const TABS = ['식단 공유', '오운완', '자유 게시판']

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { requireAuth, modalOpen: authModalOpen, closeModal: closeAuthModal } = useAuthRequired()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchPosts({ postType: TABS[activeTab] })
      .then((page) => {
        if (!cancelled) setPosts(page?.content ?? [])
      })
      .catch(() => {
        if (!cancelled) {
          setPosts([])
          setError('게시글을 불러오지 못했습니다.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [activeTab])

  return (
    <>
      <PageLayout
        customHeader={
          <Header
            right={<Button variant="gradient" onClick={() => requireAuth(() => navigate('/community/create', { state: { postType: TABS[activeTab] } }))}>작성하기</Button>}
          />
        }
      >
        <div className="flex items-center gap-2 px-5 pt-4 pb-3 shrink-0 overflow-x-auto">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={[
                'shrink-0 h-9 px-4 rounded-full text-sm font-semibold transition-colors',
                activeTab === i
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-500 border border-gray-200',
              ].join(' ')}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 px-5 pb-28">
          {loading && (
            <div className="h-40 flex items-center justify-center text-sm text-gray-400">
              게시글을 불러오는 중...
            </div>
          )}
          {!loading && error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}
          {!loading && !error && posts.length === 0 && (
            <div className="h-40 flex items-center justify-center text-sm text-gray-400">
              아직 게시글이 없어요
            </div>
          )}
          {!loading && posts.map((post) => (
            <button
              key={post.postId}
              onClick={() => navigate(`/community/post/${post.postId}`)}
              className="w-full rounded-2xl bg-white px-4 py-4 text-left shadow-sm border border-gray-100 active:bg-gray-50"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-primary">{post.postType}</span>
                <span className="text-xs text-gray-400">{post.nickname ?? '익명'}</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-gray-900 line-clamp-1">{post.title}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.content}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <span>좋아요 {post.likeCount ?? 0}</span>
                <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('ko-KR') : ''}</span>
              </div>
            </button>
          ))}
        </div>
      </PageLayout>
      {authModalOpen && <AuthRequiredModal onClose={closeAuthModal} />}
    </>
  )
}

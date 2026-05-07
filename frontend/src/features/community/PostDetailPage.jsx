import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header.jsx'

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
            <button><ShareIcon /></button>
          </div>
        }
      />

      <main className="flex-1 flex items-center justify-center text-sm text-gray-400">
        게시글을 불러올 수 없어요
      </main>
    </div>
  )
}

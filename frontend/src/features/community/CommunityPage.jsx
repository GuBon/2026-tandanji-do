import PageLayout from '../../components/PageLayout.jsx'
import Header from '../../components/Header.jsx'
import FAB from '../../components/FAB.jsx'
import { useNavigate } from 'react-router-dom'

const TABS = ['전체', '식단', '맛집', '챌린지']

export default function CommunityPage() {
  const navigate = useNavigate()

  return (
    <PageLayout customHeader={<Header right={<span className="text-base font-bold text-gray-700">커뮤니티</span>} />} className="relative">
      {/* 탭 */}
      <div className="flex items-center gap-2 px-5 py-4 overflow-x-auto scrollbar-none shrink-0">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={
              'shrink-0 h-9 px-5 rounded-full text-sm font-medium transition-colors ' +
              (i === 0 ? 'bg-emerald-500 text-white' : 'bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-600')
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Feed Grid */}
      <div className="px-5 pb-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <button
            key={i}
            onClick={() => navigate('/community/post/' + (i + 1))}
            className="aspect-square bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-gray-300 text-sm"
          >
            게시글 {i + 1}
          </button>
        ))}
      </div>

      {/* FAB */}
      <FAB onClick={() => navigate('/community/create')} className="absolute right-5 bottom-4" />
    </PageLayout>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import Header from '../../components/Header.jsx'
import FAB from '../../components/FAB.jsx'

const TABS = ['식단 공유', '오운완', '자유 게시판']

const MOCK_POSTS = [
  {
    id: 1,
    tab: '식단 공유',
    category: '식단 공유',
    timeAgo: '2시간 전',
    title: '운동 후 그린 퓨얼',
    description: '고단백 퀴노아 베이스와 아보카도의 건강한 지방. 강도 높은 운동 후 몸이 딱 필요로 하는 식단입니다.',
  },
  {
    id: 2,
    tab: '식단 공유',
    category: '식단 공유',
    timeAgo: '5시간 전',
    title: '여름 지중해식 준비',
    description: '깔끔하고 가벼운, 클리니컬한 구성. 미량 영양소 밀도에 집중했습니다. 헤비한 드레싱은 없어요.',
  },
  {
    id: 3,
    tab: '오운완',
    category: '오운완',
    timeAgo: '1일 전',
    title: '오늘의 러닝 완료! 10km 달성',
    description: '페이스 5:30, 최고 심박수 175bpm. 운동 후 단백질 보충 필수! 다들 화이팅입니다.',
  },
  {
    id: 4,
    tab: '자유 게시판',
    category: '자유 게시판',
    timeAgo: '3시간 전',
    title: '다이어트 중 외식 어떻게 하시나요?',
    description: '회식이 잦은 직장인인데 외식할 때마다 죄책감이... 현실적인 팁 공유해주세요!',
  },
]

const HamburgerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M3 5.5h16M3 11h16M3 16.5h16" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

function PostCard({ post }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(`/community/post/${post.id}`)}
      className="w-full text-left flex flex-col border-b border-gray-100 pb-6"
    >
      <div className="w-full aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-3 flex items-center justify-center text-gray-300 text-sm">
        사진
      </div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-primary">{post.category}</span>
        <span className="text-xs text-gray-400">{post.timeAgo}</span>
      </div>
      <h2 className="text-lg font-bold text-gray-900 leading-snug mb-1">{post.title}</h2>
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{post.description}</p>
    </button>
  )
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState(0)
  const navigate = useNavigate()

  const filtered = MOCK_POSTS.filter((p) => p.tab === TABS[activeTab])

  return (
    <>
      <PageLayout
        customHeader={
          <Header
            left={<HamburgerIcon />}
            right={
              <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                <span className="text-gray-400 text-xs font-bold">나</span>
              </div>
            }
          />
        }
      >
        <div className="flex items-center gap-2 px-5 pt-4 pb-3 shrink-0">
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

        <div className="flex flex-col gap-6 px-5 pb-28">
          {filtered.length > 0 ? (
            filtered.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="h-40 flex items-center justify-center text-sm text-gray-400">
              아직 게시글이 없어요
            </div>
          )}
        </div>
      </PageLayout>

      <FAB onClick={() => navigate('/community/create')} className="fixed right-5 bottom-20 z-ui" />
    </>
  )
}

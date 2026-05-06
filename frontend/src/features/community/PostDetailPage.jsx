import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header.jsx'

const MOCK_POST = {
  id: 1,
  category: '식단 공유',
  title: '신선한 식재료를 활용한 아침 식단 큐레이션',
  content: [
    '오늘 아침은 혈당 스파이크를 방지하면서도 에너지를 충분히 공급할 수 있는 채소 위주의 구성을 선택했습니다. 신선한 케일과 방울토마토, 그리고 양질의 단백질인 수란을 곁들었습니다.',
    '임상 영양학적으로 볼 때, 첫 식사에서 식이섬유를 충분히 섭취하는 것은 하루 전체의 인슐린 감수성을 조절하는 데 핵심적인 역할을 합니다. 여러분의 오늘 아침은 어떠셨나요?',
  ],
  author: '김지수 큐레이터',
  date: '2024.05.21',
}

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

const PersonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)

function LevelBars() {
  const heights = [8, 14, 10, 18, 14]
  return (
    <div className="flex items-end gap-px">
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-1 rounded-sm bg-primary/60"
          style={{ height: h }}
        />
      ))}
    </div>
  )
}

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
            <button><PersonIcon /></button>
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto">
        {/* 히어로 이미지 */}
        <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-300 text-sm shrink-0">
          사진
        </div>

        {/* 작성자 정보 */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-gray-500">김</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-bold text-gray-900">{MOCK_POST.author}</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400">{MOCK_POST.date}</span>
              <span className="text-gray-300">·</span>
              <LevelBars />
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div className="px-5 py-4 flex flex-col gap-3">
          <h1 className="text-xl font-bold text-gray-900 leading-snug">{MOCK_POST.title}</h1>
          {MOCK_POST.content.map((para, i) => (
            <p key={i} className="text-sm text-gray-600 leading-relaxed">{para}</p>
          ))}
        </div>
      </main>
    </div>
  )
}

import { useState } from 'react'
import NutritionCell from '../../components/NutritionCell.jsx'

const ThumbUpIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
    <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
  </svg>
)

const ThumbDownIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" />
    <path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
  </svg>
)

export default function ReportVoteCard({ report, onVote }) {
  const [optimistic, setOptimistic] = useState(null)
  const counts = optimistic ?? { upVotes: report.upVotes, downVotes: report.downVotes, myVote: report.myVote }

  const handleVote = async (type) => {
    const newMyVote = counts.myVote === type ? null : type
    setOptimistic({
      upVotes:   counts.upVotes   + (type === 'UP'   ? (newMyVote ? 1 : -1) : 0),
      downVotes: counts.downVotes + (type === 'DOWN' ? (newMyVote ? 1 : -1) : 0),
      myVote:    newMyVote,
    })
    try {
      const next = await onVote(report.reportId, type)
      setOptimistic({ upVotes: next.upVotes, downVotes: next.downVotes, myVote: next.myVote })
    } catch {
      setOptimistic(null)
    }
  }

  const nutrition = {
    protein: report.protein != null ? `${report.protein}g` : '--',
    carbs:   report.carbs   != null ? `${report.carbs}g`   : '--',
    fat:     report.fat     != null ? `${report.fat}g`     : '--',
  }

  return (
    <div className="bg-gray-50 rounded-2xl px-4 py-4 border border-gray-100 flex flex-col gap-3">

      {/* 1행: 메뉴명 + 날짜 */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-[17px] font-bold text-gray-800 line-clamp-2 leading-snug flex-1 min-w-0">
          {report.menuName}
        </p>
        <p className="text-[10px] text-gray-400 shrink-0 mt-1">
          {new Date(report.createdAt).toLocaleDateString('ko-KR')}
        </p>
      </div>

      {/* 2행: 이미지(w-20 h-20) + 영양성분 + 투표버튼 */}
      <div className="flex items-start gap-3">
        <div className="w-20 h-20 rounded-2xl bg-gray-200 shrink-0 overflow-hidden">
          {report.imageUrl
            ? <img src={report.imageUrl} alt={report.menuName} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">사진</div>}
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex gap-1.5">
            <NutritionCell label="단백질"   value={nutrition.protein} className="flex-1 py-1" />
            <NutritionCell label="탄수화물" value={nutrition.carbs}   className="flex-1 py-1" />
            <NutritionCell label="지방"     value={nutrition.fat}     className="flex-1 py-1" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleVote('UP')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                counts.myVote === 'UP'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-blue-50'
              }`}
            >
              <ThumbUpIcon filled={counts.myVote === 'UP'} />
              찬성 {counts.upVotes}
            </button>
            <button
              onClick={() => handleVote('DOWN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                counts.myVote === 'DOWN'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-red-50'
              }`}
            >
              <ThumbDownIcon filled={counts.myVote === 'DOWN'} />
              반대 {counts.downVotes}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

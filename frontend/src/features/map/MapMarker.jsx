import { memo } from 'react'
import NutritionCell from '../../components/NutritionCell.jsx'

const GRADE_STYLE = {
  GREEN:  { bg: '#C1F5C5', arrow: '#4ADE80' },
  YELLOW: { bg: '#FEF08A', arrow: '#FACC15' },
  RED:    { bg: '#FFC3C3', arrow: '#F87171' },
}

const GRAY_STYLE = { bg: '#F3F4F6', arrow: '#9CA3AF' }

const ArrowDown = ({ color }) => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="mx-auto">
    <path d="M5 6L0 0h10L5 6z" fill={color} />
  </svg>
)

function MapMarker({ grade, name, nutrition = {}, latestReport = null, reportCount = 0, onClick, compact = false }) {
  const { bg, arrow } = GRADE_STYLE[grade] ?? GRAY_STYLE
  const hasInfo = !!grade
  const displayNutrition = latestReport ?? nutrition

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={onClick}
          className="w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-110"
          style={{ backgroundColor: arrow }}
          title={name}
        />
        {reportCount > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[14px] h-[14px] bg-blue-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 shadow leading-none pointer-events-none">
            {reportCount > 99 ? '99+' : reportCount}
          </span>
        )}
      </div>
    )
  }

  return (
    <button onClick={onClick} className="flex flex-col items-center cursor-pointer group relative">
      <div
        className="w-[80px] rounded-lg p-1 flex flex-col gap-0.5 group-hover:shadow-lg transition-shadow"
        style={{ backgroundColor: bg }}
      >
        <span className="text-[7px] font-semibold text-gray-800 truncate leading-tight">{name}</span>
        {hasInfo || latestReport ? (
          <>
            <div className="grid grid-cols-3 gap-0.5">
              <NutritionCell label="탄" value={displayNutrition.carbs   ?? '--'} />
              <NutritionCell label="단" value={displayNutrition.protein ?? '--'} />
              <NutritionCell label="지" value={displayNutrition.fat     ?? '--'} />
            </div>
            {latestReport && (
              <span className="text-[6px] text-blue-600 font-bold text-center leading-tight">제보</span>
            )}
          </>
        ) : (
          <span className="text-[7px] text-gray-400 text-center py-0.5 leading-tight">정보 없음</span>
        )}
      </div>
      <ArrowDown color={arrow} />
      {reportCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-blue-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 shadow leading-none pointer-events-none">
          {reportCount > 99 ? '99+' : reportCount}
        </span>
      )}
    </button>
  )
}

// onClick은 매 렌더마다 새 참조가 생성되므로 비교에서 제외
export default memo(MapMarker, (prev, next) =>
  prev.grade       === next.grade       &&
  prev.name        === next.name        &&
  prev.compact     === next.compact     &&
  prev.reportCount === next.reportCount &&
  prev.nutrition?.carbs   === next.nutrition?.carbs   &&
  prev.nutrition?.protein === next.nutrition?.protein &&
  prev.nutrition?.fat     === next.nutrition?.fat     &&
  prev.latestReport?.carbs   === next.latestReport?.carbs   &&
  prev.latestReport?.protein === next.latestReport?.protein &&
  prev.latestReport?.fat     === next.latestReport?.fat
)

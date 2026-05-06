import NutritionCell from '../../components/NutritionCell.jsx'

const GRADE_STYLE = {
  GREEN:  { bg: '#C1F5C5', arrow: '#4ADE80' },
  YELLOW: { bg: '#FEF08A', arrow: '#FACC15' },
  RED:    { bg: '#FFC3C3', arrow: '#F87171' },
}

const ArrowDown = ({ color }) => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="mx-auto">
    <path d="M5 6L0 0h10L5 6z" fill={color} />
  </svg>
)

export default function MapMarker({ grade = 'GREEN', name, nutrition = {}, onClick, compact = false }) {
  const { bg, arrow } = GRADE_STYLE[grade] ?? GRADE_STYLE.GREEN

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer group-hover:scale-110 transition-transform"
        style={{ backgroundColor: arrow }}
        title={name}
      />
    )
  }

  return (
    <button onClick={onClick} className="flex flex-col items-center cursor-pointer group">
      <div
        className="w-[80px] rounded-lg p-1 flex flex-col gap-0.5 group-hover:shadow-lg transition-shadow"
        style={{ backgroundColor: bg }}
      >
        <span className="text-[7px] font-semibold text-gray-800 truncate leading-tight">{name}</span>
        <div className="grid grid-cols-3 gap-0.5">
          <NutritionCell label="탄" value={nutrition.carbs   ?? '--'} />
          <NutritionCell label="단" value={nutrition.protein ?? '--'} />
          <NutritionCell label="지" value={nutrition.fat     ?? '--'} />
        </div>
      </div>
      <ArrowDown color={arrow} />
    </button>
  )
}

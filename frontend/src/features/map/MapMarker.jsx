import NutritionCell from '../../components/NutritionCell.jsx'

const ArrowDown = ({ color }) => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="mx-auto">
    <path d="M6 8L0 0h12L6 8z" fill={color} />
  </svg>
)

export default function MapMarker({ variant = 'green', name, nutrition = {}, onClick }) {
  const isPink = variant === 'pink'
  const bg = isPink ? 'bg-[#FFC3C3]' : 'bg-[#A0E3A5]'
  const arrowColor = isPink ? '#4ADE80' : '#9CA3AF'
  const h = isPink ? 'h-[74px]' : 'h-[72px]'

  return (
    <button onClick={onClick} className="flex flex-col items-center cursor-pointer group">
      <div className={`w-[120px] ${h} ${bg} rounded-lg p-2 flex flex-col gap-1 group-hover:shadow-lg transition-shadow`}>
        <span className="text-[11px] font-semibold text-gray-800 truncate leading-tight">{name}</span>
        <div className="grid grid-cols-3 gap-1">
          <NutritionCell label="탄" value={nutrition.carbs ?? '100g'} />
          <NutritionCell label="단" value={nutrition.protein ?? '30g'} />
          <NutritionCell label="지" value={nutrition.fat ?? '20g'} />
        </div>
      </div>
      <ArrowDown color={arrowColor} />
    </button>
  )
}

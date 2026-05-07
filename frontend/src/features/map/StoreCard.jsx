import { useNavigate } from 'react-router-dom'
import NutritionCell from '../../components/NutritionCell.jsx'

const PinIcon = () => (
  <svg width="8" height="11" viewBox="0 0 8 11" fill="none">
    <path d="M4 0C1.79 0 0 1.79 0 4c0 3 4 7 4 7s4-4 4-7c0-2.21-1.79-4-4-4zm0 5.5A1.5 1.5 0 114 2.5a1.5 1.5 0 010 3z" fill="#9CA3AF"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
    <circle cx="4.5" cy="4.5" r="4" stroke="#9CA3AF" strokeWidth="1"/>
    <path d="M4.5 2.5v2.5l1.5 1" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round"/>
  </svg>
)

const FlameIcon = () => (
  <svg width="9" height="10" viewBox="0 0 9 10" fill="none">
    <path d="M4.5 9C2.57 9 1 7.43 1 5.5c0-1.2.6-2 1.5-3C3 3 3.5 2 3.5 1c0 0 3.5 2 3.5 4.5C7 7.43 5.43 9 4.5 9z" fill="#F97316"/>
  </svg>
)

export default function StoreCard({ store, onClose }) {
  const navigate = useNavigate()

  if (!store) return null

  return (
    <div className="absolute left-5 right-5 bottom-4 z-ui">
      <div className="w-full bg-white rounded-[32px] shadow-lg flex items-center px-5 py-4 gap-4 relative">

        {/* 가게 이미지 */}
        <div className="w-24 h-24 rounded-2xl bg-gray-100 shrink-0 overflow-hidden">
          {store.image
            ? <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">사진</div>}
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* 상단: 이름 + 주소 + 거리/시간/kcal */}
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => navigate(`/map/store/${store.id}`)}
              className="text-[18px] font-bold text-gray-800 truncate text-left hover:text-emerald-700 transition-colors leading-snug"
            >
              {store.name}
            </button>
            <p className="text-[12px] text-gray-400 truncate">{store.address ?? '주소 정보 없음'}</p>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <PinIcon />{store.distance ?? '--'}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <ClockIcon />{store.walkTime ?? '--'}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <FlameIcon />{store.kcal ?? '--'}
              </span>
            </div>
          </div>

          {/* 하단: 영양소 셀 or 정보 없음 */}
          {store.grade ? (
            <>
              <div className="flex gap-2">
                <NutritionCell label="PROTEIN" value={store.nutrition?.protein ?? '--'} className="flex-1 py-1" />
                <NutritionCell label="CARBS"   value={store.nutrition?.carbs   ?? '--'} className="flex-1 py-1" />
                <NutritionCell label="FAT"     value={store.nutrition?.fat     ?? '--'} className="flex-1 py-1" />
              </div>
              {store.tags?.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {store.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-[11px] text-gray-400 leading-relaxed">
              아직 메뉴 정보가 등록되지 않은 매장이에요
            </p>
          )}
        </div>

        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-5 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  )
}

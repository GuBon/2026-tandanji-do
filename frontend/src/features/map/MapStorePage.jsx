import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MOCK_STORES } from '../../data/mockStores.js'

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)

const WalkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1" />
    <path d="M9 20l3-7 3 4" /><path d="M6 10l6-2 4 4" />
  </svg>
)

const FlameIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z" />
  </svg>
)

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
)

function MenuItem({ menu }) {
  return (
    <div className="flex gap-3 px-5 py-4 border-b border-gray-100 last:border-0">
      <div className="w-20 h-20 rounded-xl bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center text-gray-300 text-xs">
        사진
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-gray-800 leading-snug">{menu.name}</p>
          <p className="text-sm font-bold text-emerald-700 shrink-0">{menu.price.toLocaleString()}원</p>
        </div>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{menu.description}</p>
        <div className="flex gap-1.5 mt-2">
          <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full font-semibold">탄{menu.nutrition.carbs}</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">단{menu.nutrition.protein}</span>
          <span className="text-[10px] bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full font-semibold">지{menu.nutrition.fat}</span>
        </div>
      </div>
    </div>
  )
}

export default function MapStorePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('메뉴')

  const store = MOCK_STORES.find((s) => s.id === Number(id))

  if (!store) {
    return (
      <div className="w-full h-dvh flex items-center justify-center text-sm text-gray-400">
        가게 정보를 찾을 수 없어요
      </div>
    )
  }

  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden bg-white">
      {/* Hero 이미지 */}
      <div className="relative w-full aspect-[4/3] bg-gray-200 shrink-0 flex items-center justify-center text-gray-300 text-sm">
        {store.image
          ? <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
          : <span>사진</span>}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-gray-700 hover:bg-white transition-colors"
        >
          <BackIcon />
        </button>
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-gray-700 hover:bg-white transition-colors">
          <ShareIcon />
        </button>
      </div>

      {/* 가게 정보 */}
      <div className="px-5 pt-4 pb-3 bg-white border-b border-gray-100 shrink-0">
        <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{store.category}</p>
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <PinIcon /><span>{store.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <WalkIcon /><span>{store.distance} · 도보 {store.walkTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FlameIcon /><span className="text-orange-500 font-medium">{store.kcal}</span>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex items-center bg-white border-b border-gray-100 shrink-0 px-5">
        {['메뉴', '리뷰'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              'flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ' +
              (activeTab === tab ? 'text-emerald-600 border-emerald-500' : 'text-gray-400 border-transparent')
            }
          >
            {tab}
          </button>
        ))}
        {activeTab === '메뉴' && (
          <button className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
            <FilterIcon />
          </button>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === '메뉴' && (
          <div className="flex flex-col">
            {store.menus?.length ? (
              store.menus.map((menu) => <MenuItem key={menu.id} menu={menu} />)
            ) : (
              <div className="h-40 flex items-center justify-center text-sm text-gray-400">
                등록된 메뉴가 없어요
              </div>
            )}
          </div>
        )}
        {activeTab === '리뷰' && (
          <div className="h-40 flex items-center justify-center text-sm text-gray-400">
            아직 리뷰가 없어요
          </div>
        )}
      </div>
    </div>
  )
}

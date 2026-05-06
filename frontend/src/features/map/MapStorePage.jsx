import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchStoreWithMenus } from '../../api/storeApi.js'
import { useStoreDistance } from './useStoreDistance.js'

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

const ChevronIcon = ({ open }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const SORT_OPTIONS = [
  { key: 'protein', label: '단백질순' },
  { key: 'carbs',   label: '탄수화물순' },
  { key: 'fat',     label: '지방순' },
]

const GRADE_CONFIG = {
  GREEN:  { border: '#4ADE80', bg: '#F0FDF4', badgeCls: 'bg-green-100 text-green-700',   label: '우수' },
  YELLOW: { border: '#FACC15', bg: '#FEFCE8', badgeCls: 'bg-yellow-100 text-yellow-700', label: '보통' },
  RED:    { border: '#F87171', bg: '#FFF5F5', badgeCls: 'bg-red-100 text-red-600',       label: '주의' },
}

function MenuItem({ menu }) {
  const conf = GRADE_CONFIG[menu.grade]
  return (
    <div
      className="flex gap-3 px-5 py-2.5 border-b border-gray-100 last:border-0"
      style={conf ? { borderLeft: `3px solid ${conf.border}`, backgroundColor: conf.bg } : {}}
    >
      <div className="w-14 h-14 rounded-xl bg-white/70 shrink-0 overflow-hidden flex items-center justify-center text-gray-300 text-xs border border-white/50">
        사진
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-gray-800 leading-snug">{menu.name}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            {conf && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${conf.badgeCls}`}>
                {conf.label}
              </span>
            )}
            {menu.price != null && menu.price > 0 && (
              <span className="text-sm font-bold text-emerald-700">{menu.price.toLocaleString()}원</span>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-1">{menu.description}</p>
        <div className="flex gap-1.5 mt-1.5">
          <span className="text-xs bg-blue-50 text-blue-500 px-2.5 py-0.5 rounded-full font-semibold">탄 {menu.nutrition.carbs}</span>
          <span className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full font-semibold">단 {menu.nutrition.protein}</span>
          <span className="text-xs bg-orange-50 text-orange-500 px-2.5 py-0.5 rounded-full font-semibold">지 {menu.nutrition.fat}</span>
        </div>
        {menu.tags?.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1">
            {menu.tags.map((tag) => (
              <span key={tag} className="text-[10px] text-gray-400 px-1.5 py-0.5 rounded-full bg-white/60 border border-gray-200">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MapStorePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('메뉴')
  const [gradeFilter, setGradeFilter] = useState(null)
  const [sortKey, setSortKey] = useState('protein')
  const [sortOpen, setSortOpen] = useState(false)
  const [baseStore, setBaseStore] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchStoreWithMenus(Number(id))
      .then((data) => { if (!cancelled) setBaseStore(data) })
      .catch((e)   => { if (!cancelled) setError(e.message) })
      .finally(()  => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  const distances = useStoreDistance(baseStore ? [baseStore] : [])
  const store = baseStore ? { ...baseStore, ...distances[baseStore.id] } : null

  if (loading) {
    return (
      <div className="w-full h-dvh flex items-center justify-center text-sm text-gray-400">
        불러오는 중…
      </div>
    )
  }

  if (error || !store) {
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

        {/* 태그 행 */}
        {store.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-3">
            {store.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 탭 */}
      <div className="flex bg-white border-b border-gray-100 shrink-0">
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
      </div>

      {/* grade 필터 + 정렬 (메뉴 탭 전용) */}
      {activeTab === '메뉴' && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-gray-100 shrink-0">
          <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-none">
            {[
              { key: null,     label: '전체' },
              { key: 'GREEN',  label: '🟢 우수' },
              { key: 'YELLOW', label: '🟡 보통' },
              { key: 'RED',    label: '🔴 주의' },
            ].map(({ key, label }) => {
              const active = gradeFilter === key
              const colorCls = key === null
                ? (active ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500')
                : key === 'GREEN'
                  ? (active ? 'bg-green-500 text-white' : 'bg-green-50 text-green-700')
                  : key === 'YELLOW'
                    ? (active ? 'bg-yellow-400 text-white' : 'bg-yellow-50 text-yellow-700')
                    : (active ? 'bg-red-400 text-white' : 'bg-red-50 text-red-600')
              return (
                <button
                  key={String(key)}
                  onClick={() => setGradeFilter(key)}
                  className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${colorCls}`}
                >
                  {label}
                </button>
              )
            })}
          </div>
          <div className="relative shrink-0">
            <button
              onClick={() => setSortOpen(o => !o)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-500 py-1.5"
            >
              {SORT_OPTIONS.find(o => o.key === sortKey)?.label}
              <ChevronIcon open={sortOpen} />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden min-w-[96px]">
                  {SORT_OPTIONS.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => { setSortKey(key); setSortOpen(false) }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${
                        sortKey === key ? 'text-emerald-600' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === '메뉴' && (() => {
          const menus = (gradeFilter
            ? (store.menus?.filter(m => m.grade === gradeFilter) ?? [])
            : (store.menus ?? [])
          ).slice().sort((a, b) => (b.raw?.[sortKey] ?? 0) - (a.raw?.[sortKey] ?? 0))
          return menus.length ? (
            <div className="flex flex-col">
              {menus.map((menu) => <MenuItem key={menu.id} menu={menu} />)}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-sm text-gray-400">
              {gradeFilter ? '해당 등급의 메뉴가 없어요' : '등록된 메뉴가 없어요'}
            </div>
          )
        })()}
        {activeTab === '리뷰' && (
          <div className="h-40 flex items-center justify-center text-sm text-gray-400">
            아직 리뷰가 없어요
          </div>
        )}
      </div>
    </div>
  )
}

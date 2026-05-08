import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from './MapView.jsx'
import Header from '../../components/Header.jsx'
import Button from '../../components/Button.jsx'
import SearchOverlay from './SearchOverlay.jsx'
import WeatherWidget from './WeatherWidget.jsx'
import FilterBottomSheet from './FilterBottomSheet.jsx'
import ReportModal from './ReportModal.jsx'
import MapMarker from './MapMarker.jsx'
import StoreCard from './StoreCard.jsx'
import BottomNavBar from '../../components/BottomNavBar.jsx'
import AuthRequiredModal from '../../components/AuthRequiredModal.jsx'
import useMapUI from './useMapUI.js'
import useMapMarkers from './useMapMarkers.js'
import useMapStore from '../../store/useMapStore.js'
import { useGeolocation } from './useGeolocation.js'
import { useStoreDistance } from './useStoreDistance.js'
import useMapStores from './useMapStores.js'
import WeatherCanvas from './WeatherCanvas.jsx'
import { useAuthRequired } from '../../hooks/useAuthRequired.js'

const IS_DEV = import.meta.env.DEV
const WEATHER_OPTIONS = ['sunny', 'rain', 'snow']

export default function MapPage() {
  const navigate = useNavigate()
  const [reportOpen, setReportOpen] = useState(false)
  const [nutritionFilters, setNutritionFilters] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const { requireAuth, modalOpen: authModalOpen, closeModal: closeAuthModal } = useAuthRequired()
  const setWeather = useMapStore((s) => s.setWeather)
  const weather = useMapStore((s) => s.weather)
  const { locate } = useGeolocation()
  const mapInstance = useMapStore((s) => s.mapInstance)
  const [mapZoom, setMapZoom] = useState(12)

  useEffect(() => {
    if (!mapInstance) return
    const onMoveEnd = () => setMapZoom(mapInstance.getView().getZoom() ?? 12)
    mapInstance.on('moveend', onMoveEnd)
    return () => mapInstance.un('moveend', onMoveEnd)
  }, [mapInstance])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchKeyword(searchInput.trim())
    }, 300)
    return () => window.clearTimeout(timer)
  }, [searchInput])

  const {
    activeFilters,
    toggleActiveFilter,
    selectedStore,
    selectStore,
    closeStore,
    filterOpen,
    toggleFilter,
    closeFilter,
  } = useMapUI()

  const storeFilters = useMemo(() => ({
    ...(searchKeyword.trim() ? { keyword: searchKeyword.trim() } : {}),
  }), [searchKeyword])

  const { stores, loading, error } = useMapStores(storeFilters)

  const visibleStores = stores.filter((s) => {
    const gradeFilters = [...activeFilters].filter((f) => ['GREEN', 'YELLOW', 'RED'].includes(f))
    const tagFilters = [...activeFilters].filter((f) => f.startsWith('#'))
    const gradeMatch = gradeFilters.length === 0 || gradeFilters.includes(s.grade)
    const tagMatch = tagFilters.length === 0 || tagFilters.some((f) => s.tags?.includes(f.replace('#', '')))
    const nutritionMatch = !nutritionFilters || Object.entries(nutritionFilters).every(([key, range]) => {
      const value = s.raw?.[key]
      if (value == null) return false
      return value >= range.min && value <= range.max
    })
    return gradeMatch && tagMatch && nutritionMatch
  })

  const pixelPositions = useMapMarkers(visibleStores)
  const storeDistances = useStoreDistance(stores)

  return (
    <div className="flex flex-col w-full h-dvh overflow-hidden bg-gray-100">
      <Header right={<Button variant="gradient" onClick={() => requireAuth(() => setReportOpen(true))}>제보하기</Button>} />

      <div className="relative flex-1 overflow-hidden">
        <MapView />

        {loading && (
          <div className="absolute top-[128px] left-1/2 -translate-x-1/2 z-ui bg-white/90 px-3 py-1.5 rounded-full text-xs text-gray-500 shadow-sm">
            매장 로딩 중…
          </div>
        )}
        {error && (
          <div className="absolute top-[128px] left-1/2 -translate-x-1/2 z-ui bg-red-50 px-3 py-1.5 rounded-full text-xs text-red-500 shadow-sm">
            데이터를 불러오지 못했어요
          </div>
        )}

        {visibleStores.map((store) => {
          const pos = pixelPositions[store.id]
          if (!pos) return null
          return (
            <div
              key={store.id}
              className="absolute z-marker -translate-x-1/2 -translate-y-full"
              style={{ left: pos.left, top: pos.top }}
            >
              <MapMarker
                grade={store.grade}
                name={store.name}
                nutrition={store.nutrition}
                onClick={() => selectStore(store)}
                compact={mapZoom < 15}
              />
            </div>
          )
        })}

        <SearchOverlay
          value={searchInput}
          onChange={setSearchInput}
          onSearch={(keyword = searchInput) => setSearchKeyword(keyword)}
          onFilterClick={toggleFilter}
        />

        {/* 날씨 + 챗봇 패널 */}
        <div className="absolute right-[19px] top-[128px] w-[54px] z-ui flex flex-col gap-[3px]">
          <WeatherWidget />
          <button
            onClick={() => navigate('/chatbot')}
            className="w-full h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl hover:bg-white/20 transition-colors"
          >
            🤖
          </button>
        </div>

        {/* 내 위치 FAB */}
        <button
          onClick={locate}
          className="absolute right-5 bottom-8 w-14 h-14 z-ui bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-sm flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <img src="/images/LocationIcon.png" alt="내 위치" className="w-6 h-6" />
        </button>

        <WeatherCanvas />

        {/* 개발 전용 날씨 테스트 패널 */}
        {IS_DEV && (
          <div className="absolute left-4 bottom-4 z-ui flex gap-1">
            {WEATHER_OPTIONS.map((w) => (
              <button
                key={w}
                onClick={() => setWeather(w)}
                className={
                  'px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ' +
                  (weather === w ? 'bg-primary text-on-primary' : 'bg-white/80 text-gray-600')
                }
              >
                {w}
              </button>
            ))}
          </div>
        )}

        <StoreCard
          store={selectedStore ? { ...selectedStore, ...storeDistances[selectedStore.id] } : null}
          onClose={closeStore}
        />
      </div>

      <BottomNavBar />

      {/* fixed 모달 — overflow-hidden 밖에서 렌더링 */}
      {filterOpen && (
        <FilterBottomSheet
          onClose={closeFilter}
          activeFilters={activeFilters}
          onFilterChange={toggleActiveFilter}
          onApplyNutritionFilters={(values) => setNutritionFilters(values)}
          onResetNutritionFilters={() => setNutritionFilters(null)}
        />
      )}
      {reportOpen && <ReportModal onClose={() => setReportOpen(false)} />}
      {authModalOpen && <AuthRequiredModal onClose={closeAuthModal} />}
    </div>
  )
}

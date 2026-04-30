import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from './MapView.jsx'
import Header from '../../components/Header.jsx'
import Button from '../../components/Button.jsx'
import SearchOverlay from './SearchOverlay.jsx'
import QuickFilters from './QuickFilters.jsx'
import WeatherWidget from './WeatherWidget.jsx'
import FilterBottomSheet from './FilterBottomSheet.jsx'
import ReportModal from './ReportModal.jsx'
import MapMarker from './MapMarker.jsx'
import StoreCard from './StoreCard.jsx'
import BottomNavBar from '../../components/BottomNavBar.jsx'
import useMapUI from './useMapUI.js'
import useMapMarkers from './useMapMarkers.js'
import useMapStore from '../../store/useMapStore.js'
import { useGeolocation } from './useGeolocation.js'
import { MOCK_STORES } from '../../data/mockStores.js'
import WeatherCanvas from './WeatherCanvas.jsx'

const IS_DEV = import.meta.env.DEV
const WEATHER_OPTIONS = ['sunny', 'rain', 'snow']

export default function MapPage() {
  const navigate = useNavigate()
  const [reportOpen, setReportOpen] = useState(false)
  const setWeather = useMapStore((s) => s.setWeather)
  const weather = useMapStore((s) => s.weather)
  const { locate } = useGeolocation()

  const {
    activeFilter,
    setActiveFilter,
    selectedStore,
    selectStore,
    closeStore,
    filterOpen,
    toggleFilter,
    closeFilter,
  } = useMapUI()

  const visibleStores = activeFilter
    ? MOCK_STORES.filter((s) => s.category === activeFilter)
    : MOCK_STORES

  const pixelPositions = useMapMarkers(visibleStores)

  return (
    <div className="flex flex-col w-full h-dvh overflow-hidden bg-gray-100">
      <Header right={<Button variant="gradient" onClick={() => setReportOpen(true)}>제보하기</Button>} />

      <div className="relative flex-1 overflow-hidden">
        <MapView />

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
                variant={store.variant}
                name={store.name}
                nutrition={store.nutrition}
                onClick={() => selectStore(store)}
              />
            </div>
          )
        })}

        <SearchOverlay onFilterClick={toggleFilter} />
        <QuickFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* 날씨 + 챗봇 패널 */}
        <div className="absolute right-[19px] top-[128px] w-[54px] z-ui flex flex-col gap-[3px]">
          <WeatherWidget />
          <button
            onClick={() => navigate('/chatbot')}
            className="w-full h-14 bg-white/40 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl hover:bg-white/60 transition-colors"
          >
            🤖
          </button>
        </div>

        {/* 내 위치 FAB */}
        <button
          onClick={locate}
          className="absolute right-5 bottom-8 w-14 h-14 z-ui bg-white rounded-xl border border-primary/10 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
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

        <StoreCard store={selectedStore} onClose={closeStore} />
      </div>

      <BottomNavBar />

      {/* fixed 모달 — overflow-hidden 밖에서 렌더링 */}
      {filterOpen && <FilterBottomSheet onClose={closeFilter} />}
      {reportOpen && <ReportModal onClose={() => setReportOpen(false)} />}
    </div>
  )
}

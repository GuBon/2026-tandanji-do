import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fromLonLat } from 'ol/proj'
import MapView from './MapView.jsx'
import Header from '../../components/Header.jsx'
import Button from '../../components/Button.jsx'
import SearchOverlay from './SearchOverlay.jsx'
import WeatherWidget from './WeatherWidget.jsx'
import FilterBottomSheet from './FilterBottomSheet.jsx'
import ReportModal from './ReportModal.jsx'
import VotingBottomSheet from './VotingBottomSheet.jsx'
import MapMarker from './MapMarker.jsx'
import StoreCard from './StoreCard.jsx'
import RouteBottomSheet from './RouteBottomSheet.jsx'
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
import { useLocationPixel } from './useLocationPixel.js'
import { useReportClusters } from './useReportClusters.js'
import ReportClusterBottomSheet from './ReportClusterBottomSheet.jsx'

const IS_DEV = import.meta.env.DEV
const WEATHER_OPTIONS = ['sunny', 'rain', 'snow']

export default function MapPage() {
  const navigate = useNavigate()
  const [reportOpen, setReportOpen] = useState(false)
  const [reportSuccess, setReportSuccess] = useState(false)
  const [voteOpen, setVoteOpen] = useState(false)
  const [routeOpen, setRouteOpen] = useState(false)
  const [selectedCluster, setSelectedCluster] = useState(null)
  const [nutritionFilters, setNutritionFilters] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const { requireAuth, modalOpen: authModalOpen, closeModal: closeAuthModal } = useAuthRequired()
  const setWeather = useMapStore((s) => s.setWeather)
  const weather = useMapStore((s) => s.weather)
  const { locate } = useGeolocation()
  const mapInstance = useMapStore((s) => s.mapInstance)
  const moveTo = useMapStore((s) => s.moveTo)
  const pendingStore = useMapStore((s) => s.pendingStore)
  const clearPendingStore = useMapStore((s) => s.clearPendingStore)
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

  useEffect(() => {
    if (!pendingStore || !mapInstance) return
    moveTo(pendingStore.x, pendingStore.y, 16)
    selectStore(pendingStore)
    clearPendingStore()
  }, [mapInstance, pendingStore, moveTo, selectStore, clearPendingStore])

  const storeFilters = useMemo(() => ({
    ...(searchKeyword.trim() ? { keyword: searchKeyword.trim() } : {}),
  }), [searchKeyword])

  const { stores, loading, error } = useMapStores(storeFilters)

  const visibleStores = useMemo(() => {
    const gradeFilters = [...activeFilters].filter((f) => ['GREEN', 'YELLOW', 'RED'].includes(f))
    const tagFilters   = [...activeFilters].filter((f) => f.startsWith('#'))
    return stores.filter((s) => {
      const gradeMatch     = gradeFilters.length === 0 || gradeFilters.includes(s.grade)
      const tagMatch       = tagFilters.length === 0   || tagFilters.some((f) => s.tags?.includes(f.replace('#', '')))
      const nutritionMatch = !nutritionFilters || Object.entries(nutritionFilters).every(([key, range]) => {
        const value = s.raw?.[key]
        return value != null && value >= range.min && value <= range.max
      })
      return gradeMatch && tagMatch && nutritionMatch
    })
  }, [stores, activeFilters, nutritionFilters])

  const pixelPositions = useMapMarkers(visibleStores)
  const { clusters: reportClusters, refresh: refreshClusters } = useReportClusters()
  const reportClusterPixels = useMapMarkers(reportClusters)
  const storeDistances = useStoreDistance(stores)
  const locationPixel = useLocationPixel()

  const selectedStoreWithDistance = useMemo(
    () => selectedStore ? { ...selectedStore, ...storeDistances[selectedStore.id] } : null,
    [selectedStore, storeDistances],
  )

  const searchResults = useMemo(
    () => searchInput.trim()
      ? visibleStores.map((s) => ({ ...s, ...storeDistances[s.id] }))
      : [],
    [searchInput, visibleStores, storeDistances],
  )

  const handleSearchSelect = (store) => {
    const [x, y] = fromLonLat([store.lon, store.lat])
    moveTo(x, y, 16)
    selectStore(store)
    setSearchInput('')
  }

  return (
    <div className="flex flex-col w-full h-dvh overflow-hidden bg-gray-100">
      <Header right={
        <div className="flex items-center gap-1.5">
          <Button variant="gradient-blue" onClick={() => setVoteOpen(true)}>투표하기</Button>
          <Button variant="gradient" onClick={() => requireAuth(() => setReportOpen(true))}>제보하기</Button>
        </div>
      } />

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
                latestReport={mapZoom >= 15 ? store.latestReport : null}
                reportCount={store.reportCount ?? 0}
                onClick={() => selectStore(store)}
                compact={mapZoom < 15}
              />
            </div>
          )
        })}

        {reportClusters.map((cluster) => {
          const pos = reportClusterPixels[cluster.id]
          if (!pos) return null
          return (
            <div
              key={cluster.id}
              className="absolute z-marker -translate-x-1/2 -translate-y-full"
              style={{ left: pos.left, top: pos.top }}
              onClick={() => setSelectedCluster(cluster)}
            >
              {mapZoom < 15 ? (
                <div className="flex flex-col items-center cursor-pointer">
                  <div className="min-w-[22px] h-[22px] bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5 shadow-md border-2 border-white leading-none">
                    {cluster.count}
                  </div>
                  <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                    <path d="M4 5L0 0h8L4 5z" fill="#111827" />
                  </svg>
                </div>
              ) : (
                <button className="flex flex-col items-center cursor-pointer group">
                  <div className="w-[80px] bg-gray-900 rounded-lg p-1 flex flex-col gap-0.5 group-hover:shadow-lg transition-shadow">
                    <span className="text-[7px] font-semibold text-white truncate leading-tight">
                      {cluster.storeName || '알 수 없는 매장'}
                    </span>
                    <span className="text-[6px] text-gray-300 font-bold text-center leading-tight">투표 진행중</span>
                  </div>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="mx-auto">
                    <path d="M5 6L0 0h10L5 6z" fill="#111827" />
                  </svg>
                </button>
              )}
            </div>
          )
        })}

        {locationPixel && (
          <div
            className="absolute z-marker -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: locationPixel.left, top: locationPixel.top }}
          >
            <div className="relative">
              <div className="absolute -inset-1.5 rounded-full bg-blue-400/25 blur-[5px]" />
              <div className="relative w-5 h-5 rounded-full bg-blue-500 border-2 border-white" />
            </div>
          </div>
        )}

        <SearchOverlay
          value={searchInput}
          onChange={setSearchInput}
          onSearch={(keyword = searchInput) => setSearchKeyword(keyword)}
          onFilterClick={toggleFilter}
          results={searchResults}
          onSelect={handleSearchSelect}
          activeFilters={activeFilters}
          onGradeFilter={toggleActiveFilter}
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

        {!routeOpen && (
          <StoreCard
            store={selectedStoreWithDistance}
            onClose={closeStore}
            onRoute={() => setRouteOpen(true)}
          />
        )}
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
      {voteOpen && (
        <VotingBottomSheet
          onClose={() => setVoteOpen(false)}
          onNavigate={({ storeLat, storeLon }) => {
            if (storeLat == null || storeLon == null) return
            const [x, y] = fromLonLat([storeLon, storeLat])
            moveTo(x, y, 17)
          }}
        />
      )}
      {selectedCluster && (
        <ReportClusterBottomSheet
          cluster={selectedCluster}
          onClose={() => setSelectedCluster(null)}
          onVoteSuccess={refreshClusters}
        />
      )}
      {reportOpen && (
        <ReportModal
          onClose={() => setReportOpen(false)}
          onSuccess={() => { setReportOpen(false); setReportSuccess(true) }}
        />
      )}
      {reportSuccess && (
        <div className="fixed inset-0 z-modal flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setReportSuccess(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl px-7 py-8 flex flex-col items-center gap-5 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="14" fill="#10b981" />
                <path d="M8 14.5l4 4 8-8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-[18px] font-bold text-gray-800">제보가 완료되었습니다.</p>
              <p className="text-sm text-gray-500">투표 현황을 확인해보세요.</p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setReportSuccess(false)}
                className="flex-1 h-12 rounded-2xl bg-gray-100 text-gray-600 text-sm font-semibold"
              >
                닫기
              </button>
              <button
                onClick={() => { setReportSuccess(false); setVoteOpen(true) }}
                className="flex-1 h-12 rounded-2xl bg-emerald-500 text-white text-sm font-semibold"
              >
                투표 현황 보기
              </button>
            </div>
          </div>
        </div>
      )}
      {routeOpen && selectedStore && (
        <RouteBottomSheet
          store={selectedStore}
          onClose={() => setRouteOpen(false)}
        />
      )}
      {authModalOpen && <AuthRequiredModal onClose={closeAuthModal} />}
    </div>
  )
}

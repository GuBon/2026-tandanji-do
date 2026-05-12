import BottomSheet from '../../components/BottomSheet.jsx'
import { useRoute } from './useRoute.js'
import { useRouteLayer } from './useRouteLayer.js'

const MODES = [
  { key: 'walk',    label: '도보',     icon: '🚶', color: 'bg-blue-500'    },
  { key: 'bike',    label: '자전거',   icon: '🚲', color: 'bg-emerald-500' },
  { key: 'transit', label: '대중교통', icon: '🚌', color: 'bg-violet-500'  },
  { key: 'car',     label: '차량',     icon: '🚗', color: 'bg-orange-500'  },
]

const ROUTE_COLOR = {
  walk:    'text-blue-600',
  bike:    'text-emerald-600',
  transit: 'text-violet-600',
  car:     'text-orange-500',
}

const LEG_ICON  = { WALK: '🚶', BUS: '🚌', SUBWAY: '🚇', TRAM: '🚃', FERRY: '⛴' }
const LEG_LABEL = { WALK: '도보', BUS: '버스', SUBWAY: '지하철', TRAM: '트램', FERRY: '페리' }

function ResultRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[13px] text-gray-500">{label}</span>
      <span className={`text-[14px] font-semibold ${highlight ? 'text-orange-500' : 'text-gray-800'}`}>
        {value}
      </span>
    </div>
  )
}

function TransitLegRow({ leg }) {
  const icon    = LEG_ICON[leg.mode]  ?? '🚌'
  const label   = LEG_LABEL[leg.mode] ?? leg.mode
  const minutes = Math.max(1, Math.round(leg.sectionTime / 60))
  const isTransit = leg.mode !== 'WALK'

  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
      <span className="text-[18px] leading-none mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-[13px] font-semibold text-gray-800 truncate">
            {leg.route ?? label}
          </span>
          <span className="text-[12px] text-gray-400 shrink-0">{minutes}분</span>
        </div>
        <p className="text-[12px] text-gray-500 truncate">
          {leg.startName} → {leg.endName}
        </p>
        {isTransit && leg.passStopCount > 0 && (
          <p className="text-[11px] text-gray-400 mt-0.5">{leg.passStopCount}개 정류장</p>
        )}
      </div>
    </div>
  )
}

export default function RouteBottomSheet({ store, onClose }) {
  const { mode, setMode, routeData, loading, error, hasLocation } = useRoute(store)

  useRouteLayer(routeData, mode)

  const activeMode = MODES.find((m) => m.key === mode)

  return (
    <BottomSheet onClose={onClose} overlay={false} mapMode>
      {/* 고정 헤더 */}
      <div className="px-5 pt-2 shrink-0">
        <div className="flex items-center justify-between mb-0.5">
          <h2 className="text-[16px] font-bold text-gray-800">길찾기</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>
        <p className="text-[13px] text-gray-400 mb-4 truncate">{store.name} 방면</p>

        {/* 이동 수단 탭 */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {MODES.map(({ key, label, icon, color }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={
                'flex flex-col items-center gap-1 py-3 rounded-2xl text-[11px] font-semibold transition-colors ' +
                (mode === key
                  ? `${color} text-white shadow-sm`
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200')
              }
            >
              <span className="text-xl leading-none">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-5 pb-10">
        {/* 요약 결과 패널 */}
        <div className="bg-gray-50 rounded-2xl p-4 min-h-[100px] flex flex-col justify-center gap-3">
          {!hasLocation && (
            <p className="text-[13px] text-gray-400 text-center">현재 위치를 먼저 확인해주세요</p>
          )}

          {hasLocation && loading && (
            <div className="flex flex-col items-center gap-2">
              <div className={`w-5 h-5 rounded-full border-2 border-t-transparent animate-spin ${
                mode === 'walk'    ? 'border-blue-500'    :
                mode === 'bike'    ? 'border-emerald-500' :
                mode === 'transit' ? 'border-violet-500'  : 'border-orange-500'
              }`} />
              <p className="text-[13px] text-gray-400">경로를 계산하는 중…</p>
            </div>
          )}

          {hasLocation && !loading && error && (
            <p className="text-[13px] text-red-400 text-center">{error}</p>
          )}

          {hasLocation && !loading && !error && routeData && (
            <>
              <div className={`text-[12px] font-bold ${ROUTE_COLOR[mode]}`}>
                {activeMode?.icon} {activeMode?.label} 경로
              </div>
              <div className="flex flex-col gap-2.5">
                <ResultRow label="거리"     value={routeData.distance} />
                <ResultRow label="소요시간" value={routeData.duration} />
                {routeData.kcal && (
                  <ResultRow label="소모 칼로리" value={routeData.kcal} highlight />
                )}
              </div>
            </>
          )}
        </div>

        {routeData?.geometry && (
          <p className="text-[11px] text-gray-400 text-center mt-3 mb-1">
            지도에서 실제 경로를 확인하세요
          </p>
        )}

        {/* 대중교통 환승 상세 */}
        {mode === 'transit' && routeData?.legs?.length > 0 && (
          <div className="mt-4 mb-2">
            <h3 className="text-[13px] font-bold text-gray-700 mb-2">경로 상세</h3>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {routeData.legs.map((leg, i) => (
                <TransitLegRow key={`${leg.mode}-${leg.startName}-${i}`} leg={leg} />
              ))}
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  )
}

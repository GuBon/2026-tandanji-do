import { useMemo } from 'react'
import useMapStore from '../../store/useMapStore.js'
import useAuthStore from '../../store/useAuthStore.js'

// 도보 평균 속도 4km/h → 약 67m/min
const WALK_SPEED_M_PER_MIN = 67
// 걷기 소모 칼로리: 거리(km) × 체중(kg) × 0.7
const KCAL_PER_KM_PER_KG = 0.7
const DEFAULT_WEIGHT_KG = 65

// Haversine 공식 — WGS84 두 좌표 사이 직선거리(m)
function haversineM(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

function formatWalkTime(meters) {
  const minutes = Math.max(1, Math.round(meters / WALK_SPEED_M_PER_MIN))
  return `${minutes}분`
}

function formatKcal(meters, weightKg) {
  const km = meters / 1000
  return `${Math.round(km * weightKg * KCAL_PER_KM_PER_KG)} kcal`
}

// stores: [{ id, lat, lon }] 형태의 배열
// 반환: { [storeId]: { distance, walkTime, kcal } }
export function useStoreDistance(stores) {
  const latLon = useMapStore((s) => s.latLon)
  const userWeight = useAuthStore((s) => s.user?.weight)

  return useMemo(() => {
    if (!latLon?.lat || !latLon?.lon) return {}
    const { lat, lon } = latLon

    return Object.fromEntries(
      stores.map((store) => {
        const meters = haversineM(lat, lon, store.lat, store.lon)
        return [
          store.id,
          {
            distance: formatDistance(meters),
            walkTime: formatWalkTime(meters),
            kcal:     formatKcal(meters, userWeight ?? DEFAULT_WEIGHT_KG),
          },
        ]
      }),
    )
  }, [latLon, stores, userWeight])
}

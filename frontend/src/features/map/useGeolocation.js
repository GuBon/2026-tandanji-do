import { useEffect, useCallback } from 'react'
import { fromLonLat } from 'ol/proj'
import useMapStore from '../../store/useMapStore'

const GEO_API = 'https://mapprime.synology.me:15289/geolocation/api'

async function fetchPublicIp() {
  const res = await fetch('https://api.ipify.org?format=json')
  const { ip } = await res.json()
  return ip
}

function makeHeaders(publicIp) {
  return {
    Accept: 'application/json',
    'X-Client-Public-IP': publicIp,
  }
}

async function fetchRestLocation(publicIp) {
  const res = await fetch(`${GEO_API}/location`, { headers: makeHeaders(publicIp) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const { lngLat } = await res.json()
  return lngLat // { lng, lat }
}

async function postGpsLocation(publicIp, lng, lat, accuracyM) {
  await fetch(`${GEO_API}/location/gps`, {
    method: 'POST',
    headers: { ...makeHeaders(publicIp), 'Content-Type': 'application/json' },
    body: JSON.stringify({ lngLat: { lng, lat }, accuracyM: Math.round(accuracyM) }),
  })
}

export function useGeolocation() {
  const moveTo = useMapStore((s) => s.moveTo)
  const setLatLon = useMapStore((s) => s.setLatLon)

  const applyLocation = useCallback(
    (lng, lat) => {
      const [x, y] = fromLonLat([lng, lat])
      moveTo(x, y, 14)
      setLatLon(lat, lng)
    },
    [moveTo, setLatLon],
  )

  const locate = useCallback(async () => {
    let publicIp = null
    try {
      publicIp = await fetchPublicIp()
    } catch {
      console.warn('[useGeolocation] 공인 IP 조회 실패')
    }

    if (navigator.geolocation) {
      // 1순위: GPS
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const { longitude: lng, latitude: lat, accuracy } = coords
          applyLocation(lng, lat)
          if (publicIp) {
            try { await postGpsLocation(publicIp, lng, lat, accuracy) } catch { /* noop */ }
          }
        },
        async (err) => {
          // GPS 거부/실패 → REST fallback
          console.warn('[useGeolocation] GPS 실패:', err.message)
          if (!publicIp) return
          try {
            const { lng, lat } = await fetchRestLocation(publicIp)
            applyLocation(lng, lat)
          } catch (e) {
            console.warn('[useGeolocation] REST 위치 조회 실패:', e.message)
          }
        },
        { timeout: 8000, enableHighAccuracy: true },
      )
      return
    }

    // GPS API 없음 → REST fallback
    if (!publicIp) return
    try {
      const { lng, lat } = await fetchRestLocation(publicIp)
      applyLocation(lng, lat)
    } catch (e) {
      console.warn('[useGeolocation] REST 위치 조회 실패:', e.message)
    }
  }, [applyLocation])

  useEffect(() => {
    locate()
  }, [locate])

  return { locate }
}

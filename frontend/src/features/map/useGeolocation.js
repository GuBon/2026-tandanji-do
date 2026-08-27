import { useCallback } from 'react'
import { fromLonLat } from 'ol/proj'
import useMapStore from '../../store/useMapStore'

const GEO_API = 'https://mapprime.synology.me:15289/geolocation/api'

async function fetchWithTimeout(url, options = {}, ms = 4000) {
  const ctrl = new AbortController()
  const id = setTimeout(() => ctrl.abort(), ms)
  try {
    return await fetch(url, { ...options, signal: ctrl.signal })
  } finally {
    clearTimeout(id)
  }
}

async function fetchPublicIp() {
  const res = await fetchWithTimeout('https://api.ipify.org?format=json', {}, 3000)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const { ip } = await res.json()
  return ip
}

// publicIp가 없으면 X-Client-Public-IP 헤더를 생략한다 — 서버가 요청 IP로 대체 판별
function makeHeaders(publicIp) {
  const headers = { Accept: 'application/json' }
  if (publicIp) headers['X-Client-Public-IP'] = publicIp
  return headers
}

async function fetchRestLocation(publicIp) {
  const res = await fetchWithTimeout(`${GEO_API}/location`, { headers: makeHeaders(publicIp) }, 4000)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const { lngLat } = await res.json()
  if (
    !lngLat ||
    typeof lngLat.lng !== 'number' || !isFinite(lngLat.lng) ||
    typeof lngLat.lat !== 'number' || !isFinite(lngLat.lat)
  ) {
    throw new Error('invalid lngLat')
  }
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

    // 1순위: 외부 위치 REST API — 공인 IP 조회 실패와 무관하게 항상 먼저 시도
    try {
      const { lng, lat } = await fetchRestLocation(publicIp)
      applyLocation(lng, lat)
      return
    } catch (e) {
      console.warn('[useGeolocation] REST 위치 조회 실패:', e.message)
    }

    // 2순위: 브라우저 GPS fallback — REST 실패 시에만
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { longitude: lng, latitude: lat, accuracy } = coords
        applyLocation(lng, lat)
        try { await postGpsLocation(publicIp, lng, lat, accuracy) } catch { /* noop */ }
      },
      (err) => {
        console.warn('[useGeolocation] GPS 실패:', err.message)
      },
      { timeout: 8000, enableHighAccuracy: true },
    )
  }, [applyLocation])

  return { locate }
}

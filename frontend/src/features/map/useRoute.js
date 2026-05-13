import { useState, useEffect } from 'react'
import useMapStore from '../../store/useMapStore.js'
import useAuthStore from '../../store/useAuthStore.js'

const TMAP_KEY = import.meta.env.VITE_TMAP_API_KEY
const TMAP_HEADERS = { 'Content-Type': 'application/json', appKey: TMAP_KEY }

const MET = { walk: 3.5, bike: 7.5 }
const DEFAULT_WEIGHT_KG = 65
const BIKE_SPEED_MPS = (15 * 1000) / 3600  // 15 km/h

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

function formatDuration(seconds) {
  const minutes = Math.max(1, Math.round(seconds / 60))
  if (minutes < 60) return `약 ${minutes}분`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `약 ${h}시간 ${m}분` : `약 ${h}시간`
}

function calcKcal(durationSec, mode, weightKg) {
  if (MET[mode] == null) return null
  return Math.round(MET[mode] * weightKg * (durationSec / 3600))
}

function extractGeoJsonCoords(data) {
  const coords = []
  data.features?.forEach((f) => {
    if (f.geometry?.type === 'LineString') coords.push(...f.geometry.coordinates)
  })
  return coords
}

async function fetchCar(originLat, originLon, destLat, destLon, signal) {
  const res = await fetch('/api/tmap/tmap/routes?version=1', {
    method: 'POST',
    headers: TMAP_HEADERS,
    signal,
    body: JSON.stringify({
      startX: String(originLon), startY: String(originLat),
      endX: String(destLon),   endY: String(destLat),
      reqCoordType: 'WGS84GEO', resCoordType: 'WGS84GEO',
      searchOption: '0',
    }),
  })
  if (!res.ok) throw new Error(`TMap 차량 오류 (${res.status})`)
  const data = await res.json()
  const props = data.features?.find((f) => f.properties?.totalDistance != null)?.properties ?? {}
  if (props.totalDistance == null) throw new Error('차량 경로를 찾을 수 없어요')
  return { distanceM: props.totalDistance, durationSec: props.totalTime, coords: extractGeoJsonCoords(data) }
}

async function fetchPedestrian(originLat, originLon, destLat, destLon, signal) {
  const res = await fetch('/api/tmap/tmap/routes/pedestrian?version=1', {
    method: 'POST',
    headers: TMAP_HEADERS,
    signal,
    body: JSON.stringify({
      startX: String(originLon), startY: String(originLat),
      endX: String(destLon),   endY: String(destLat),
      reqCoordType: 'WGS84GEO', resCoordType: 'WGS84GEO',
      startName: '출발지', endName: '도착지',
    }),
  })
  if (!res.ok) throw new Error(`TMap 도보 오류 (${res.status})`)
  const data = await res.json()
  const props = data.features?.find((f) => f.properties?.totalDistance != null)?.properties ?? {}
  if (props.totalDistance == null) throw new Error('도보 경로를 찾을 수 없어요')
  return { distanceM: props.totalDistance, durationSec: props.totalTime, coords: extractGeoJsonCoords(data) }
}

async function fetchWalk(originLat, originLon, destLat, destLon, signal) {
  return fetchPedestrian(originLat, originLon, destLat, destLon, signal)
}

// TMap 자전거 전용 API 없음 — 도보 경로를 가져와 자전거 속도로 시간 재계산
async function fetchBike(originLat, originLon, destLat, destLon, signal) {
  const result = await fetchPedestrian(originLat, originLon, destLat, destLon, signal)
  return { ...result, durationSec: Math.round(result.distanceM / BIKE_SPEED_MPS) }
}

async function fetchTransit(originLat, originLon, destLat, destLon, signal) {
  const res = await fetch('/api/tmap/transit/routes', {
    method: 'POST',
    headers: TMAP_HEADERS,
    signal,
    body: JSON.stringify({
      startX: String(originLon), startY: String(originLat),
      endX: String(destLon),   endY: String(destLat),
      count: 1, lang: 0, format: 'json',
    }),
  })
  if (!res.ok) throw new Error(`TMap 대중교통 오류 (${res.status})`)
  const data = await res.json()
  const itin = data.metaData?.plan?.itineraries?.[0]
  if (!itin) throw new Error('대중교통 경로를 찾을 수 없어요')

  const allCoords = []
  const legs = (itin.legs ?? []).map((leg) => {
    const coords = []
    const ls = leg.passShape?.linestring
    if (ls) {
      ls.trim().split(' ').forEach((pair) => {
        const [lon, lat] = pair.split(',').map(Number)
        if (!Number.isNaN(lon) && !Number.isNaN(lat)) {
          coords.push([lon, lat])
          allCoords.push([lon, lat])
        }
      })
    } else {
      // passShape 없는 leg(주로 도보) → 시작/끝 직선 폴백
      const sLon = Number(leg.start?.lon), sLat = Number(leg.start?.lat)
      const eLon = Number(leg.end?.lon),   eLat = Number(leg.end?.lat)
      if (!Number.isNaN(sLon) && !Number.isNaN(sLat) && !Number.isNaN(eLon) && !Number.isNaN(eLat)) {
        coords.push([sLon, sLat], [eLon, eLat])
        allCoords.push([sLon, sLat], [eLon, eLat])
      }
    }
    return {
      mode:          leg.mode ?? 'WALK',
      route:         leg.route ?? null,
      startName:     leg.start?.name ?? '',
      endName:       leg.end?.name   ?? '',
      sectionTime:   leg.sectionTime ?? 0,
      passStopCount: leg.passStopList?.stationList?.length ?? 0,
      coords,
    }
  })

  // itin.duration 단위가 불명확하므로 leg.sectionTime(초) 합산으로 직접 계산
  const durationSec = legs.reduce((sum, l) => sum + l.sectionTime, 0)
  const distanceM   = (itin.legs ?? []).reduce((sum, l) => sum + (l.distance ?? 0), 0)

  return { distanceM, durationSec, coords: allCoords, legs }
}

const FETCHER = { car: fetchCar, walk: fetchWalk, bike: fetchBike, transit: fetchTransit }

export function useRoute(store) {
  const [mode, setMode] = useState('walk')
  const [routeData, setRouteData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const latLon     = useMapStore((s) => s.latLon)
  const userWeight = useAuthStore((s) => s.user?.weight) ?? DEFAULT_WEIGHT_KG

  useEffect(() => {
    if (!store || !latLon?.lat || !latLon?.lon) return

    const { lat: uLat, lon: uLon } = latLon
    const { lat: sLat, lon: sLon } = store

    const controller = new AbortController()
    setLoading(true)
    setError(null)
    setRouteData(null)

    FETCHER[mode](uLat, uLon, sLat, sLon, controller.signal)
      .then((result) => {
        const { distanceM, durationSec, coords, legs } = result
        const kcal = calcKcal(durationSec, mode, userWeight)
        setRouteData({
          distance: formatDistance(distanceM),
          duration: formatDuration(durationSec),
          kcal:     kcal != null ? `약 ${kcal} kcal` : null,
          geometry: coords.length ? { type: 'LineString', coordinates: coords } : null,
          legs:     legs ?? null,
        })
      })
      .catch((err) => { if (err.name !== 'AbortError') setError(err.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })

    return () => controller.abort()
  }, [mode, store, latLon, userWeight])

  const hasLocation = !!(latLon?.lat && latLon?.lon)

  return { mode, setMode, routeData, loading, error, hasLocation }
}

import { useEffect } from 'react'
import useMapStore from '../../store/useMapStore.js'

// 기상청 격자 좌표 변환 (Lambert Conformal Conic)
function toGrid(lat, lon) {
  const RE = 6371.00877, GRID = 5.0, SLAT1 = 30.0, SLAT2 = 60.0
  const OLON = 126.0, OLAT = 38.0, XO = 43, YO = 136
  const D = Math.PI / 180

  const re = RE / GRID
  const sn = Math.log(Math.cos(SLAT1 * D) / Math.cos(SLAT2 * D)) /
    Math.log(Math.tan((90 + SLAT2) * D / 2) / Math.tan((90 + SLAT1) * D / 2))
  const sf = Math.pow(Math.tan((90 + SLAT1) * D / 2), sn) * Math.cos(SLAT1 * D) / sn
  const ro = re * sf / Math.pow(Math.tan((90 + OLAT) * D / 2), sn)
  const ra = re * sf / Math.pow(Math.tan((90 + lat) * D / 2), sn)
  let theta = (lon - OLON) * D * sn
  if (theta > Math.PI) theta -= 2 * Math.PI
  if (theta < -Math.PI) theta += 2 * Math.PI

  return {
    nx: Math.floor(ra * Math.sin(theta) + XO + 0.5),
    ny: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5),
  }
}

// 초단기실황: 매 정시 발표, 10분 이후 제공
function getNcstBaseDateTime() {
  const now = new Date()
  const d = new Date(now)
  if (now.getMinutes() < 10) d.setHours(d.getHours() - 1)
  const p = (n) => String(n).padStart(2, '0')
  return {
    date: `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`,
    time: `${p(d.getHours())}00`,
  }
}

// 초단기예보: 매 30분 발표, 45분 이후 제공
function getFcstBaseDateTime() {
  const now = new Date()
  const d = new Date(now)
  if (now.getMinutes() < 45) d.setHours(d.getHours() - 1)
  const p = (n) => String(n).padStart(2, '0')
  return {
    date: `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`,
    time: `${p(d.getHours())}30`,
  }
}

// PTY + SKY → weather 상태
// PTY (초단기실황): 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
// SKY (초단기예보): 맑음(1), 구름많음(3), 흐림(4)
function toWeatherState(pty, sky) {
  const n = Number(pty)
  if (n === 1 || n === 2 || n === 5) return 'rain'
  if (n === 3 || n === 6 || n === 7) return 'snow'
  const s = Number(sky ?? 1)
  if (s === 4) return 'cloudy'
  if (s === 3) return 'partly-cloudy'
  return 'sunny'
}

// 초단기예보 응답 → 시간별 예보 배열
function parseForecast(items) {
  const hours = {}
  items.forEach(({ category, fcstTime, fcstValue }) => {
    if (!hours[fcstTime]) hours[fcstTime] = {}
    hours[fcstTime][category] = fcstValue
  })
  return Object.entries(hours)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 6)
    .map(([time, data]) => ({
      time,
      weather: toWeatherState(data.PTY ?? '0', data.SKY),
      temp: data.T1H != null ? Math.round(Number(data.T1H)) : null,
    }))
}

export default function useWeather() {
  const latLon = useMapStore((s) => s.latLon)
  const setWeather = useMapStore((s) => s.setWeather)
  const setTemperature = useMapStore((s) => s.setTemperature)
  const setForecast = useMapStore((s) => s.setForecast)
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    if (!latLon || !apiKey) return

    const { nx, ny } = toGrid(latLon.lat, latLon.lon)
    const controller = new AbortController()
    const { signal } = controller
    const base = `/api/kma/1360000/VilageFcstInfoService_2.0`

    const { date: ncstDate, time: ncstTime } = getNcstBaseDateTime()
    const ncstParams = new URLSearchParams({ pageNo: '1', numOfRows: '10', dataType: 'JSON', base_date: ncstDate, base_time: ncstTime, nx, ny })
    const ncstUrl = `${base}/getUltraSrtNcst?serviceKey=${apiKey}&${ncstParams}`

    const { date: fcstDate, time: fcstTime } = getFcstBaseDateTime()
    const fcstParams = new URLSearchParams({ pageNo: '1', numOfRows: '60', dataType: 'JSON', base_date: fcstDate, base_time: fcstTime, nx, ny })
    const fcstUrl = `${base}/getUltraSrtFcst?serviceKey=${apiKey}&${fcstParams}`

    Promise.all([
      fetch(ncstUrl, { signal }).then((r) => r.json()),
      fetch(fcstUrl, { signal }).then((r) => r.json()),
    ]).then(([ncst, fcst]) => {
      const ncstItems = ncst.response?.body?.items?.item ?? []
      const fcstItems = fcst.response?.body?.items?.item ?? []

      const pty = ncstItems.find((i) => i.category === 'PTY')?.obsrValue ?? '0'
      const t1h = ncstItems.find((i) => i.category === 'T1H')?.obsrValue

      // 예보 중 가장 이른 시각의 SKY를 현재 하늘상태로 사용
      const firstTime = [...new Set(fcstItems.map((i) => i.fcstTime))].sort()[0]
      const currentSky = fcstItems.find((i) => i.category === 'SKY' && i.fcstTime === firstTime)?.fcstValue

      setWeather(toWeatherState(pty, currentSky))
      if (t1h != null) setTemperature(Math.round(Number(t1h)))
      setForecast(parseForecast(fcstItems))
    }).catch(() => {})

    return () => controller.abort()
  }, [latLon, apiKey, setWeather, setTemperature, setForecast])
}

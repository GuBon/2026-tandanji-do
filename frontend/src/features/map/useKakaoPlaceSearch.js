import { useState, useEffect } from 'react'

const APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY

let sdkReady = false
let sdkPromise = null

function ensureKakaoMapsSdk() {
  if (sdkReady) return Promise.resolve()

  // HMR 등으로 모듈이 재로드됐지만 SDK는 이미 DOM에 로드된 경우
  if (window.kakao?.maps?.services?.Places) {
    sdkReady = true
    return Promise.resolve()
  }

  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&libraries=services&autoload=false`

    script.onload = () => {
      try {
        // kakao.maps.load가 호출되지 않는 경우를 대비한 타임아웃
        const timeout = setTimeout(() => {
          sdkPromise = null
          reject(new Error('Kakao Maps 초기화 타임아웃 — 카카오 개발자 콘솔에서 사이트 도메인(http://localhost:5173)을 등록해주세요'))
        }, 5000)

        window.kakao.maps.load(() => {
          clearTimeout(timeout)
          sdkReady = true
          resolve()
        })
      } catch (e) {
        sdkPromise = null
        reject(new Error(`Kakao Maps 초기화 실패: ${e.message}`))
      }
    }

    script.onerror = () => {
      sdkPromise = null
      reject(new Error('Kakao Maps SDK 스크립트 로드 실패 — 네트워크 또는 앱 키를 확인해주세요'))
    }

    document.head.appendChild(script)
  })

  return sdkPromise
}

// location: { lat, lon } | null — 전달 시 해당 좌표 기준 거리순 정렬
export function useKakaoPlaceSearch(location = null) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSearching(false)
      setSearchError(null)
      return
    }
    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        setSearching(true)
        setSearchError(null)
        await ensureKakaoMapsSdk()
        if (cancelled) return
        const ps = new window.kakao.maps.services.Places()
        const searchOptions = location
          ? {
              location: new window.kakao.maps.LatLng(location.lat, location.lon),
              sort: window.kakao.maps.services.SortBy.DISTANCE,
            }
          : {}
        ps.keywordSearch(query, (data, status) => {
          if (cancelled) return
          setSearching(false)
          if (status === window.kakao.maps.services.Status.OK) {
            setResults(
              data.slice(0, 5).map(p => ({
                id: p.id,
                placeName: p.place_name,
                address: p.road_address_name || p.address_name,
                lat: parseFloat(p.y),
                lon: parseFloat(p.x),
              }))
            )
          } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
            setResults([])
          } else {
            setResults([])
            setSearchError('장소 검색 오류가 발생했습니다.')
          }
        }, searchOptions)
      } catch (e) {
        if (!cancelled) {
          setSearching(false)
          setResults([])
          setSearchError(e.message)
          console.error('[KakaoPlaceSearch]', e.message)
        }
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
      setSearching(false)
    }
  }, [query, location])

  const clearResults = () => {
    setResults([])
    setSearchError(null)
  }

  return { query, setQuery, results, searching, searchError, clearResults }
}

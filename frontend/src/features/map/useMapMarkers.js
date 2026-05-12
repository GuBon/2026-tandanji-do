import { useState, useEffect, useRef, useCallback } from 'react'
import { fromLonLat } from 'ol/proj'
import useMapStore from '../../store/useMapStore.js'

export default function useMapMarkers(stores) {
  const mapInstance = useMapStore((s) => s.mapInstance)
  const [pixelPositions, setPixelPositions] = useState({})
  const storesRef = useRef(stores)
  storesRef.current = stores

  const update = useCallback(() => {
    if (!mapInstance) return
    const next = {}
    storesRef.current.forEach((store) => {
      const coord = fromLonLat([store.lon, store.lat])
      const pixel = mapInstance.getPixelFromCoordinate(coord)
      if (pixel) next[store.id] = { left: pixel[0], top: pixel[1] }
    })
    setPixelPositions((prev) => {
      const nextKeys = Object.keys(next)
      if (nextKeys.length !== Object.keys(prev).length) return next
      for (const k of nextKeys) {
        if (!prev[k] || prev[k].left !== next[k].left || prev[k].top !== next[k].top) return next
      }
      return prev
    })
  }, [mapInstance])

  // postrender: 지도 렌더링 직후 픽셀 좌표 동기화 — 마커가 지도와 함께 부드럽게 이동
  // setPixelPositions 내부에서 위치 불변 시 prev를 그대로 반환해 불필요한 리렌더를 방지
  useEffect(() => {
    if (!mapInstance) return
    mapInstance.on('postrender', update)
    return () => mapInstance.un('postrender', update)
  }, [mapInstance, update])

  // stores 변경 시 즉시 재계산
  useEffect(() => {
    update()
  }, [stores, update])

  return pixelPositions
}

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

  // postrender 이벤트 구독 (mapInstance 변경 시에만 재등록)
  useEffect(() => {
    if (!mapInstance) return
    mapInstance.on('postrender', update)
    return () => mapInstance.un('postrender', update)
  }, [mapInstance, update])

  // stores 변경 시 즉시 픽셀 위치 재계산
  useEffect(() => {
    update()
  }, [stores, update])

  return pixelPositions
}

import { useState, useEffect, useRef, useCallback } from 'react'
import { fromLonLat } from 'ol/proj'
import useMapStore from '../../store/useMapStore.js'

export function useLocationPixel() {
  const mapInstance = useMapStore((s) => s.mapInstance)
  const latLon = useMapStore((s) => s.latLon)
  const [pixel, setPixel] = useState(null)
  const latLonRef = useRef(latLon)
  latLonRef.current = latLon

  const update = useCallback(() => {
    const ll = latLonRef.current
    if (!mapInstance || !ll?.lat || !ll?.lon) {
      setPixel(null)
      return
    }
    const p = mapInstance.getPixelFromCoordinate(fromLonLat([ll.lon, ll.lat]))
    setPixel((prev) => {
      if (!p) return null
      if (prev?.left === p[0] && prev?.top === p[1]) return prev
      return { left: p[0], top: p[1] }
    })
  }, [mapInstance])

  useEffect(() => {
    if (!mapInstance) return
    mapInstance.on('postrender', update)
    update()
    return () => mapInstance.un('postrender', update)
  }, [mapInstance, update])

  useEffect(() => { update() }, [latLon, update])

  return pixel
}

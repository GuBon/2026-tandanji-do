import { useState, useEffect } from 'react'
import { fromLonLat } from 'ol/proj'
import useMapStore from '../../store/useMapStore.js'

export default function useMapMarkers(stores) {
  const mapInstance = useMapStore((s) => s.mapInstance)
  const [pixelPositions, setPixelPositions] = useState({})

  useEffect(() => {
    if (!mapInstance) return

    const update = () => {
      const next = {}
      stores.forEach((store) => {
        const coord = fromLonLat([store.lon, store.lat])
        const pixel = mapInstance.getPixelFromCoordinate(coord)
        if (pixel) next[store.id] = { left: pixel[0], top: pixel[1] }
      })
      setPixelPositions(next)
    }

    mapInstance.on('postrender', update)
    update()

    return () => mapInstance.un('postrender', update)
  }, [mapInstance, stores])

  return pixelPositions
}

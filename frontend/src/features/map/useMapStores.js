import { useState, useEffect, useCallback } from 'react'
import { transformExtent } from 'ol/proj'
import useMapStore from '../../store/useMapStore.js'
import { searchStores } from '../../api/storeApi.js'

export default function useMapStores() {
  const mapInstance = useMapStore((s) => s.mapInstance)
  const [stores, setStores]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetchByBbox = useCallback(async (map) => {
    const size = map.getSize()
    if (!size) return

    const extent = map.getView().calculateExtent(size)
    const [swLng, swLat, neLng, neLat] = transformExtent(extent, 'EPSG:3857', 'EPSG:4326')

    setLoading(true)
    setError(null)
    try {
      const data = await searchStores({ swLat, swLng, neLat, neLng })
      setStores(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!mapInstance) return
    fetchByBbox(mapInstance)
    const handler = () => fetchByBbox(mapInstance)
    mapInstance.on('moveend', handler)
    return () => mapInstance.un('moveend', handler)
  }, [mapInstance, fetchByBbox])

  return { stores, loading, error }
}

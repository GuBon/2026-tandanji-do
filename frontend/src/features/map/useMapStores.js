import { useState, useEffect, useCallback, useRef } from 'react'
import { transformExtent } from 'ol/proj'
import useMapStore from '../../store/useMapStore.js'
import { searchStores } from '../../api/storeApi.js'

export default function useMapStores(filters = null) {
  const mapInstance = useMapStore((s) => s.mapInstance)
  const [stores, setStores]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const abortRef = useRef(null)

  const fetchByBbox = useCallback(async (map) => {
    const size = map.getSize()
    if (!size) return

    const extent = map.getView().calculateExtent(size)
    const [swLng, swLat, neLng, neLat] = transformExtent(extent, 'EPSG:3857', 'EPSG:4326')

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)
    try {
      const data = await searchStores({ swLat, swLng, neLat, neLng, filters, signal: controller.signal })
      setStores(data)
    } catch (e) {
      if (e.name === 'AbortError') return
      setError(e.message)
    } finally {
      if (abortRef.current === controller) {
        setLoading(false)
      }
    }
  }, [filters])

  useEffect(() => {
    if (!mapInstance) return
    fetchByBbox(mapInstance)
    const handler = () => fetchByBbox(mapInstance)
    mapInstance.on('moveend', handler)
    return () => {
      mapInstance.un('moveend', handler)
      abortRef.current?.abort()
    }
  }, [mapInstance, fetchByBbox])

  return { stores, loading, error }
}

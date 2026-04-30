import { useEffect } from 'react'
import { fromLonLat } from 'ol/proj'
import useMapStore from '../../store/useMapStore'

export function useMcpHost() {
  const mapInstance = useMapStore((s) => s.mapInstance)

  useEffect(() => {
    if (!mapInstance) return

    window.__tdjmap__ = {
      moveTo: (lon, lat, zoom = 14) => {
        const view = mapInstance.getView()
        view.animate({ center: fromLonLat([lon, lat]), zoom, duration: 500 })
      },
      zoomIn: () => {
        const view = mapInstance.getView()
        view.animate({ zoom: view.getZoom() + 1, duration: 300 })
      },
      zoomOut: () => {
        const view = mapInstance.getView()
        view.animate({ zoom: view.getZoom() - 1, duration: 300 })
      },
      getCenter: () => {
        const view = mapInstance.getView()
        return view.getCenter()
      },
    }

    return () => {
      delete window.__tdjmap__
    }
  }, [mapInstance])
}

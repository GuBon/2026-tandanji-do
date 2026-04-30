import { useEffect, useRef } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import useMapStore from '../../store/useMapStore'
import { createVWorldLayer } from './useVWorldLayer'
import { useMcpHost } from './useMcpHost'
import useWeather from './useWeather'

export default function MapView() {
  const mapRef = useRef(null)
  const { center, zoom, setMapInstance } = useMapStore()

  useMcpHost()
  useWeather()

  useEffect(() => {
    const vworldLayer = createVWorldLayer()

    const map = new Map({
      target: mapRef.current,
      layers: [vworldLayer],
      view: new View({ center, zoom, projection: 'EPSG:3857' }),
      controls: [],
    })

    setMapInstance(map)

    return () => {
      map.setTarget(null)
      setMapInstance(null)
    }
    // center/zoom은 초기값으로만 사용 — 이후 View.animate로 제어
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={mapRef} className="absolute inset-0 z-map" />
}

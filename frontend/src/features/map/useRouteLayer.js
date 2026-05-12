import { useEffect, useRef } from 'react'
import { fromLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import LineString from 'ol/geom/LineString'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Style, Stroke } from 'ol/style'
import useMapStore from '../../store/useMapStore.js'

const STROKE = {
  walk:    { color: '#3B82F6', width: 5 }, // blue
  bike:    { color: '#10B981', width: 5 }, // emerald
  car:     { color: '#F97316', width: 5 }, // orange
  transit: { color: '#8B5CF6', width: 5 }, // violet (fallback)
}

// 대중교통 수단별 색상
const TRANSIT_STROKE = {
  WALK:   { color: '#9CA3AF', width: 3 }, // gray (점선 효과용 얇게)
  BUS:    { color: '#3B82F6', width: 5 }, // blue
  SUBWAY: { color: '#F97316', width: 5 }, // orange
  TRAM:   { color: '#8B5CF6', width: 5 }, // violet
  FERRY:  { color: '#06B6D4', width: 5 }, // cyan
}

let routeLayerSeq = 0

function makeLayer(coords, strokeOpts, id) {
  const layer = new VectorLayer({
    source: new VectorSource({ features: [new Feature(new LineString(coords))] }),
    style: new Style({
      stroke: new Stroke({ ...strokeOpts, lineCap: 'round', lineJoin: 'round' }),
    }),
    zIndex: 25,
  })
  layer.set('id', id)
  return layer
}

// 대중교통: 수단별 색상이 다르므로 leg당 별도 Feature를 만들되 단일 VectorLayer + 스타일 함수로 통합
function makeTransitLayer(legs, id) {
  const features = []
  const allPoints = []

  legs.forEach((leg) => {
    if (!leg.coords?.length) return
    const pts = leg.coords.map(([lon, lat]) => fromLonLat([lon, lat]))
    allPoints.push(...pts)
    const feature = new Feature(new LineString(pts))
    feature.set('stroke', TRANSIT_STROKE[leg.mode] ?? TRANSIT_STROKE.BUS)
    features.push(feature)
  })

  const layer = new VectorLayer({
    source: new VectorSource({ features }),
    style: (feature) => {
      const s = feature.get('stroke')
      return new Style({ stroke: new Stroke({ ...s, lineCap: 'round', lineJoin: 'round' }) })
    },
    zIndex: 25,
  })
  layer.set('id', id)
  return { layer, allPoints }
}

export function useRouteLayer(routeData, mode) {
  const mapInstance = useMapStore((s) => s.mapInstance)
  const layersRef = useRef([])

  useEffect(() => {
    if (!mapInstance) return

    layersRef.current?.forEach((l) => mapInstance.removeLayer(l))
    layersRef.current = []

    const geometry = routeData?.geometry
    if (!geometry?.coordinates?.length) return

    const layerId = `route-${++routeLayerSeq}`

    if (mode === 'transit' && routeData?.legs?.length) {
      const { layer, allPoints } = makeTransitLayer(routeData.legs, layerId)
      mapInstance.addLayer(layer)
      layersRef.current = [layer]

      if (allPoints.length > 1) {
        mapInstance.getView().fit(new LineString(allPoints).getExtent(), {
          padding: [100, 60, 420, 60],
          maxZoom: 16,
          duration: 600,
        })
      }
    } else {
      const pts = geometry.coordinates.map(([lon, lat]) => fromLonLat([lon, lat]))
      const lineString = new LineString(pts)
      const stroke = STROKE[mode] ?? STROKE.walk
      const layer = makeLayer(pts, stroke, layerId)
      mapInstance.addLayer(layer)
      layersRef.current = [layer]

      mapInstance.getView().fit(lineString.getExtent(), {
        padding: [100, 60, 380, 60],
        maxZoom: 16,
        duration: 600,
      })
    }

    return () => {
      layersRef.current?.forEach((l) => { if (mapInstance) mapInstance.removeLayer(l) })
      layersRef.current = []
    }
  }, [mapInstance, routeData, mode])
}

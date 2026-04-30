import TileLayer from 'ol/layer/Tile'
import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { get as getProjection } from 'ol/proj'
import { getTopLeft, getWidth } from 'ol/extent'

const VWORLD_API_KEY = import.meta.env.VITE_VWORLD_API_KEY

export function createVWorldLayer() {
  const projection = getProjection('EPSG:3857')
  const projExtent = projection.getExtent()
  const startResolution = getWidth(projExtent) / 256
  const resolutions = Array.from({ length: 20 }, (_, i) => startResolution / Math.pow(2, i))
  const matrixIds = resolutions.map((_, i) => `${i}`)

  return new TileLayer({
    properties: { id: 'vworld-base' },
    source: new WMTS({
      url: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_API_KEY}/Base/{TileMatrix}/{TileRow}/{TileCol}.png`,
      layer: 'Base',
      matrixSet: 'GoogleMapsCompatible',
      format: 'image/png',
      projection,
      tileGrid: new WMTSTileGrid({
        origin: getTopLeft(projExtent),
        resolutions,
        matrixIds,
      }),
      style: 'default',
      requestEncoding: 'REST',
      crossOrigin: 'anonymous',
    }),
  })
}

import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'

const VWORLD_API_KEY = import.meta.env.VITE_VWORLD_API_KEY

export function createVWorldLayer() {
  return new TileLayer({
    properties: { id: 'vworld-base' },
    source: new XYZ({
      url: `http://api.vworld.kr/req/wmts/1.0.0/${VWORLD_API_KEY}/Base/{z}/{y}/{x}.png`,
      crossOrigin: 'anonymous',
    }),
  })
}

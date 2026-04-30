import { useEffect, useCallback } from 'react'
import { fromLonLat } from 'ol/proj'
import useMapStore from '../../store/useMapStore'

export function useGeolocation() {
  const moveTo = useMapStore((s) => s.moveTo)
  const setLatLon = useMapStore((s) => s.setLatLon)

  const locate = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { longitude: lon, latitude: lat } = coords
        const [x, y] = fromLonLat([lon, lat])
        moveTo(x, y, 14)
        setLatLon(lat, lon)
      },
      (err) => console.warn('[useGeolocation] 위치 획득 실패:', err.message),
      { timeout: 8000 },
    )
  }, [moveTo, setLatLon])

  useEffect(() => {
    if (!navigator.permissions) {
      locate()
      return
    }
    navigator.permissions.query({ name: 'geolocation' }).then(({ state }) => {
      if (state !== 'denied') locate()
    })
  }, [locate])

  return { locate }
}

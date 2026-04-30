import { create } from 'zustand'

const useMapStore = create((set) => ({
  mapInstance: null,
  center: [14135000, 4518000], // 서울 (EPSG:3857)
  zoom: 12,
  latLon: { lat: 37.5665, lon: 126.9780 }, // 서울 시청 기본값, 위치 허용 시 갱신
  weather: 'sunny',      // 'sunny' | 'partly-cloudy' | 'cloudy' | 'rain' | 'snow'
  temperature: null,     // 기온 (°C)
  forecast: [],          // [{ time, weather, temp }]

  setMapInstance: (map) => set({ mapInstance: map }),
  setLatLon: (lat, lon) => set({ latLon: { lat, lon } }),
  setWeather: (weather) => set({ weather }),
  setTemperature: (temperature) => set({ temperature }),
  setForecast: (forecast) => set({ forecast }),

  moveTo: (x, y, zoom) =>
    set((state) => {
      if (state.mapInstance) {
        state.mapInstance.getView().animate({ center: [x, y], zoom, duration: 500 })
      }
      return { center: [x, y], zoom }
    }),
}))

export default useMapStore

import { create } from 'zustand'

const useMapStore = create((set) => ({
  mapInstance: null,
  center: [14104426.167437151, 4503085.822505046], // EPSG:5179 [929443.3747000694, 1940122.789599896] 변환값
  zoom: 12,
  latLon: { lat: 37.45761500133742, lon: 126.7022159994412 }, // 위치 허용 시 갱신
  weather: 'sunny',      // 'sunny' | 'partly-cloudy' | 'cloudy' | 'rain' | 'snow'
  temperature: null,     // 기온 (°C)
  forecast: [],          // [{ time, weather, temp }]

  setMapInstance: (map) => set({ mapInstance: map }),
  setLatLon: (lat, lon) => set({ latLon: { lat, lon } }),
  setWeather: (weather) => set({ weather }),
  setTemperature: (temperature) => set({ temperature }),
  setForecast: (forecast) => set({ forecast }),

  pendingStore: null, // 챗봇에서 선택된 매장 → MapPage에서 소비

  moveTo: (x, y, zoom) =>
    set((state) => {
      if (state.mapInstance) {
        state.mapInstance.getView().animate({ center: [x, y], zoom, duration: 500 })
      }
      return { center: [x, y], zoom }
    }),

  setPendingStore: (store) => set({ pendingStore: store }),
  clearPendingStore: () => set({ pendingStore: null }),
}))

export default useMapStore

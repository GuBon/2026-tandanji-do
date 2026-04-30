import { useState } from 'react'
import useMapStore from '../../store/useMapStore.js'

const icons = {
  sunny: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" fill="#FBBF24" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  'partly-cloudy': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="9" r="3" fill="#FBBF24" />
      <path d="M10 3v1.5M10 14.5V16M4 9H2.5M17.5 9H16M5.6 4.6l1 1M14.4 13.4l1 1M5.6 13.4l-1 1"
        stroke="#FBBF24" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M19 15h-.7A4.5 4.5 0 108 18.5h11a2.5 2.5 0 000-5z" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1" />
    </svg>
  ),
  cloudy: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 10h-1.26A8 8 0 104 16h14a4 4 0 000-8z" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1.2" />
    </svg>
  ),
  rain: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 19v2M12 18v2M16 19v2" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  snow: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 19l1 2M12 18v3M16 19l-1 2M9 21l-1-1M15 21l1-1" stroke="#93C5FD" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
}

const emoji = {
  sunny: '☀️',
  'partly-cloudy': '🌤️',
  cloudy: '☁️',
  rain: '🌧️',
  snow: '❄️',
}

export default function WeatherWidget() {
  const [open, setOpen] = useState(false)
  const weather = useMapStore((s) => s.weather)
  const temperature = useMapStore((s) => s.temperature)
  const forecast = useMapStore((s) => s.forecast)

  const tempLabel = temperature != null ? `${temperature}°C` : '--°C'

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full h-[72px] flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-2xl gap-1 hover:bg-white/60 transition-colors"
      >
        {icons[weather] ?? icons.sunny}
        <span className="text-[11px] font-semibold text-gray-700">{tempLabel}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-modal" onClick={() => setOpen(false)} />
          <div className="fixed left-4 right-4 top-[192px] z-modal bg-white/80 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg">
            <div className="flex justify-between items-center">
              {forecast.length === 0 ? (
                <p className="text-xs text-gray-400 mx-auto">예보 데이터 없음</p>
              ) : (
                forecast.map((f) => (
                  <div key={f.time} className="flex flex-col items-center gap-[6px]">
                    <span className="text-[10px] text-gray-400 font-medium">{f.time.slice(0, 2)}시</span>
                    <span className="text-[22px] leading-none">{emoji[f.weather] ?? '☀️'}</span>
                    <span className="text-[11px] font-semibold text-gray-700">
                      {f.temp != null ? `${f.temp}°` : '--'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

import { useState } from 'react'
import useMapStore from '../../store/useMapStore.js'

const EMOJI = {
  sunny:          '☀️',
  'partly-cloudy':'🌤️',
  cloudy:         '☁️',
  rain:           '🌧️',
  snow:           '❄️',
}

export default function WeatherWidget() {
  const [open, setOpen] = useState(false)
  const weather     = useMapStore((s) => s.weather)
  const temperature = useMapStore((s) => s.temperature)
  const forecast    = useMapStore((s) => s.forecast)

  const tempLabel = temperature != null ? `${temperature}°C` : '--°C'

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full h-[72px] flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-2xl gap-1 hover:bg-white/60 transition-colors"
      >
        <span className="text-2xl leading-none">{EMOJI[weather] ?? '☀️'}</span>
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
                    <span className="text-[22px] leading-none">{EMOJI[f.weather] ?? '☀️'}</span>
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

import { useState } from 'react'
import FilterLegendSheet from './FilterLegendSheet.jsx'

const FILTERS = [
  { key: 'GREEN',  emoji: '🟢' },
  { key: 'YELLOW', emoji: '🟡' },
  { key: 'RED',    emoji: '🔴' },
  { key: '#고단백', emoji: '🍗' },
  { key: '#고지방', emoji: '🧀' },
  { key: '#고탄수', emoji: '🥙' },
  { key: '#저탄수', emoji: '🥗' },
]

export default function QuickFilters({ activeFilter, onFilterChange }) {
  const [legendOpen, setLegendOpen] = useState(false)

  return (
    <>
      <div className="absolute left-0 right-0 top-[86px] h-[34px] z-ui flex items-center justify-between px-5">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.key
          return (
            <button
              key={f.key}
              onClick={() => onFilterChange(isActive ? null : f.key)}
              className={[
                'w-9 h-8 flex items-center justify-center rounded-xl text-xl transition-all shadow-sm',
                isActive ? 'bg-[#1b6d24] scale-110' : 'bg-white/90',
              ].join(' ')}
            >
              {f.emoji}
            </button>
          )
        })}

        {/* 필터 안내 */}
        <button onClick={() => setLegendOpen(true)} className="w-9 h-8 flex items-center justify-center">
          <img src="/images/question-mark.png" alt="필터 안내" className="w-7 h-7 object-contain drop-shadow" />
        </button>
      </div>

      {legendOpen && <FilterLegendSheet onClose={() => setLegendOpen(false)} />}
    </>
  )
}

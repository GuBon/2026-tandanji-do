import { useState } from 'react'
import FilterLegendSheet from './FilterLegendSheet.jsx'

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="8" cy="8" r="5.5" stroke="#9CA3AF" strokeWidth="1.5" />
    <path d="M12.5 12.5L16 16" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 5h14M6 10h8M9 15h2" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const GRADE_COLOR = { GREEN: '#4ADE80', YELLOW: '#FACC15', RED: '#F87171' }

const GRADES = [
  { key: 'GREEN',  label: '우수', color: '#4ADE80', bg: 'rgba(240,253,244,0.85)' },
  { key: 'YELLOW', label: '보통', color: '#FACC15', bg: 'rgba(254,252,232,0.85)' },
  { key: 'RED',    label: '주의', color: '#F87171', bg: 'rgba(255,241,242,0.85)' },
]

export default function SearchOverlay({ value = '', onChange, onSearch, onFilterClick, results = [], onSelect, activeFilters, onGradeFilter }) {
  const [legendOpen, setLegendOpen] = useState(false)

  const submitSearch = (event) => {
    event.preventDefault()
    onSearch?.(value)
  }

  const clearSearch = () => {
    onChange?.('')
    onSearch?.('')
  }

  return (
    <>
    <div className="absolute left-5 right-5 top-4 z-ui">
      <form
        onSubmit={submitSearch}
        className="h-[62px] flex items-center bg-white/10 backdrop-blur-md rounded-xl shadow-md px-4 gap-3"
      >
        <button type="submit" className="shrink-0" aria-label="검색">
          <SearchIcon />
        </button>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder="식단 가능한 장소 검색"
          className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
        />
        {value && (
          <button
            type="button"
            onClick={clearSearch}
            className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="검색어 지우기"
          >
            지우기
          </button>
        )}
        <button type="button" onClick={onFilterClick} className="text-gray-400 hover:text-emerald-600 transition-colors" aria-label="필터 열기">
          <FilterIcon />
        </button>
      </form>

      {onGradeFilter && (
        <div className="flex items-center gap-2 mt-2">
          {GRADES.map(({ key, label, color, bg }) => {
            const isActive = activeFilters?.has(key)
            return (
              <button
                key={key}
                type="button"
                onClick={() => onGradeFilter(key)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all"
                style={{
                  backgroundColor: isActive ? color : 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(8px)',
                  color: isActive ? '#fff' : color,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
              >
                {label}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setLegendOpen(true)}
            className="ml-auto flex items-center justify-center px-2 py-1 rounded-full border shrink-0 transition-all"
            style={{
              borderColor: 'rgba(255,255,255,0.4)',
              backgroundColor: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
            }}
            aria-label="등급 안내"
          >
            <img src="/images/question-mark.png" alt="등급 안내" className="w-4 h-4 object-contain" />
          </button>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-1.5 max-h-[240px] overflow-y-auto bg-white/90 backdrop-blur-md rounded-xl shadow-md divide-y divide-gray-100">
          {results.map((store) => (
            <button
              key={store.id}
              type="button"
              onClick={() => onSelect?.(store)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              <span
                className="shrink-0 w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: GRADE_COLOR[store.grade] ?? '#9CA3AF' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{store.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{store.distance ?? store.category}</p>
              </div>
              <span className="shrink-0 text-xs text-gray-300">›</span>
            </button>
          ))}
        </div>
      )}
    </div>

    {legendOpen && <FilterLegendSheet onClose={() => setLegendOpen(false)} />}
    </>
  )
}

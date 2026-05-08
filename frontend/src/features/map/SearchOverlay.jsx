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

export default function SearchOverlay({ value = '', onChange, onSearch, onFilterClick }) {
  const submitSearch = (event) => {
    event.preventDefault()
    onSearch?.(value)
  }

  const clearSearch = () => {
    onChange?.('')
    onSearch?.('')
  }

  return (
    <form
      onSubmit={submitSearch}
      className="absolute left-5 right-5 top-4 h-[62px] z-ui flex items-center bg-white/10 backdrop-blur-md rounded-xl shadow-md px-4 gap-3"
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
  )
}

import Button from '../../components/Button.jsx'

const FILTERS = ['샐러드', '포케', '단백질 식단']

export default function QuickFilters({ activeFilter, onFilterChange }) {
  return (
    <div className="absolute left-0 right-0 top-[86px] h-[34px] z-ui flex items-center gap-2 px-5 overflow-x-auto scrollbar-none">
      {FILTERS.map((f) => (
        <Button
          key={f}
          variant={activeFilter === f ? 'filter-active' : 'filter'}
          className="shrink-0"
          onClick={() => onFilterChange(activeFilter === f ? null : f)}
        >
          {f}
        </Button>
      ))}
    </div>
  )
}

import { BLUE, PERIODS } from './dashboardConstants.js'

export default function PeriodToggle({ period, onChange }) {
  return (
    <div className="flex p-1 bg-surface-container rounded-full">
      {PERIODS.map(({ val, label }) => (
        <button
          key={val}
          onClick={() => onChange(val)}
          className={[
            'flex-1 py-1.5 text-xs transition-all rounded-full',
            period === val ? 'font-bold bg-white shadow-sm' : 'font-medium text-on-surface-variant',
          ].join(' ')}
          style={period === val ? { color: BLUE } : {}}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

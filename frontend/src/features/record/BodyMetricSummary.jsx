export default function BodyMetricSummary({ height, weight, onEdit }) {
  return (
    <div className="relative flex items-center justify-center px-1">
      <div className="flex gap-6">
        <Metric label="신장" value={height} unit="cm" />
        <Metric label="체중" value={weight} unit="kg" withDivider />
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="absolute right-1 px-1 text-base leading-none"
        aria-label="신장 체중 수정"
      >
        ✏️
      </button>
    </div>
  )
}

function Metric({ label, value, unit, withDivider = false }) {
  return (
    <div className={[
      'flex items-baseline gap-1.5',
      withDivider ? 'border-l border-outline-variant/30 pl-6' : '',
    ].join(' ')}>
      <span className="text-xs font-bold text-outline">{label}</span>
      <span className="text-lg font-bold font-headline text-on-surface">
        {value ?? '—'}
        <span className="text-[10px] font-normal text-outline-variant ml-0.5 uppercase">{unit}</span>
      </span>
    </div>
  )
}

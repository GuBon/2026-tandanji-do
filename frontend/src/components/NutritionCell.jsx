export default function NutritionCell({ label, value, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center bg-surface-container-low rounded-[2px] px-1 py-0.5 ${className}`}>
      <span className="text-[9px] font-semibold text-on-surface-variant tracking-wide">{label}</span>
      <span className="text-[11px] font-bold text-on-surface leading-tight">{value}</span>
    </div>
  )
}

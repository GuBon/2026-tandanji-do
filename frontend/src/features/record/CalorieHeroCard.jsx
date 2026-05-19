export default function CalorieHeroCard({ label, value }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-outline-variant/10">
      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-extrabold font-headline text-primary">
          {value.toLocaleString()}
        </span>
        <span className="text-xl font-medium text-on-surface-variant">kcal</span>
      </div>
    </div>
  )
}

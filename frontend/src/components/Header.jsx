const LOGO = (
  <span className="text-[17px] font-bold tracking-tight">
    <span className="text-[#49AFE6]">탄단지</span>
    <span className="text-[#15803d]">도</span>
  </span>
)

export default function Header({ title, left = LOGO, right, className = 'bg-white px-4' }) {
  return (
    <header className={`relative w-full h-[52px] shrink-0 flex items-center justify-between border-b border-gray-100 ${className}`}>
      <div className="flex items-center gap-1.5">{left}</div>
      {title && (
        <span className="absolute left-1/2 -translate-x-1/2 text-sm font-bold text-[#1E293B]">
          {title}
        </span>
      )}
      <div className="flex items-center gap-1.5">{right}</div>
    </header>
  )
}

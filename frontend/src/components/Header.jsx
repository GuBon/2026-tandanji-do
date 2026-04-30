import Button from './Button.jsx'

const LOGO = (
  <span className="text-[20px] font-bold tracking-tight">
    <span className="text-[#49AFE6]">탄단지</span>
    <span className="text-[#15803d]">도</span>
  </span>
)

export default function Header({ title, left = LOGO, right, className = 'bg-white px-5' }) {
  return (
    <header className={`relative w-full h-16 shrink-0 flex items-center justify-between border-b border-gray-100 ${className}`}>
      <div className="flex items-center gap-2">{left}</div>
      {title && (
        <span className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-[#1E293B]">
          {title}
        </span>
      )}
      <div className="flex items-center gap-2">{right}</div>
    </header>
  )
}

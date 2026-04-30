import { NavLink } from 'react-router-dom'

function MapIcon({ active }) {
  const color = active ? '#15803d' : '#94a3b8'
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <path d="M9.5 1C6.46 1 4 3.46 4 6.5c0 4.5 5.5 11.5 5.5 11.5S15 11 15 6.5C15 3.46 12.54 1 9.5 1zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill={color} />
    </svg>
  )
}

function RecordIcon({ active }) {
  const color = active ? '#15803d' : '#94a3b8'
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
      <rect x="1" y="1" width="16" height="18" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M5 7h8M5 11h8M5 15h5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CommunityIcon({ active }) {
  const color = active ? '#15803d' : '#94a3b8'
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
      <circle cx="8" cy="5" r="3.5" stroke={color} strokeWidth="1.8" />
      <path d="M1 15c0-3.314 3.134-6 7-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="15" cy="5" r="3.5" stroke={color} strokeWidth="1.8" />
      <path d="M21 15c0-3.314-3.134-6-7-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

const TABS = [
  { to: '/map',       label: '지도',    Icon: MapIcon },
  { to: '/record',    label: '기록',    Icon: RecordIcon },
  { to: '/community', label: '커뮤니티', Icon: CommunityIcon },
]

export default function BottomNavBar() {
  return (
    <nav className="w-full h-16 flex items-center bg-white border-t border-gray-100 shrink-0">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className="flex-1 h-full flex flex-col items-center justify-center gap-1"
        >
          {({ isActive }) => (
            <>
              <Icon active={isActive} />
              <span className={`text-[10px] font-bold leading-none ${isActive ? 'text-green-700' : 'text-slate-400'}`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

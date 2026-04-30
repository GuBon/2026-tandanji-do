import BottomNavBar from './BottomNavBar.jsx'
import Header from './Header.jsx'

export default function PageLayout({ header, customHeader, children, className = '' }) {
  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden bg-[#F8F9FA]">
      {customHeader ?? (header && <Header {...header} />)}
      <main className={`flex-1 overflow-y-auto ${className}`}>
        {children}
      </main>
      <BottomNavBar />
    </div>
  )
}

export default function DashboardCard({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-outline-variant/10 ${className}`}>
      {children}
    </div>
  )
}

import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'

export default function AdminGuard({ children }) {
  const user = useAuthStore((s) => s.user)

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/map" replace />
  }

  return children
}

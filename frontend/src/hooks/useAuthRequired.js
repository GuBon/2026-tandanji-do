import { useState } from 'react'
import useAuthStore from '../store/useAuthStore'

export function useAuthRequired() {
  const [modalOpen, setModalOpen] = useState(false)
  const user = useAuthStore((s) => s.user)

  const requireAuth = (callback) => {
    if (user) {
      return callback()
    } else {
      setModalOpen(true)
      return null
    }
  }

  return { requireAuth, modalOpen, closeModal: () => setModalOpen(false) }
}

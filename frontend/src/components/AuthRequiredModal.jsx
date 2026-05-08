import useAuthStore from '../store/useAuthStore'

export default function AuthRequiredModal({ onClose }) {
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const handleConfirm = () => {
    clearAuth()   // isGuest → false → AuthGuard가 로그인 화면 표시
  }

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center px-8">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[280px] bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 pt-6 pb-5 text-center">
          <p className="text-base font-bold text-gray-900 mb-1">로그인이 필요합니다</p>
          <p className="text-sm text-gray-500">로그인하시겠습니까?</p>
        </div>
        <div className="flex border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors border-r border-gray-100"
          >
            아니오
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3.5 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
          >
            예
          </button>
        </div>
      </div>
    </div>
  )
}

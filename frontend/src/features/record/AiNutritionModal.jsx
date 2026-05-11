export default function AiNutritionModal({ success, onClose }) {
  return (
    <div
      className="fixed inset-0 z-modal bg-black/40 flex items-center justify-center px-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-white rounded-3xl p-7 flex flex-col items-center gap-4">
        {success ? (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-emerald-500" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="text-center text-base font-semibold text-gray-800 leading-relaxed">
              영양성분 분석이<br />성공적으로 완료되었습니다!
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-red-500" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
            <p className="text-center text-base font-semibold text-gray-800 leading-relaxed">
              영양성분 분석을 실패했습니다.<br />다른 사진으로 다시 시도해주세요.
            </p>
          </>
        )}
        <button
          onClick={onClose}
          className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors mt-1"
        >
          확인
        </button>
      </div>
    </div>
  )
}

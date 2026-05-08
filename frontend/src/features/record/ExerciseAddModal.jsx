import { useState } from 'react'

export default function ExerciseAddModal({ onClose, exerciseTypes = [], typesLoading = false, onAdd }) {
  const [selected, setSelected] = useState(null)
  const [duration, setDuration] = useState('')
  const [detail, setDetail] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!selected || !duration) return
    const type = exerciseTypes.find((t) => t.typeId === selected)
    if (!type) return
    setSaving(true)
    try {
      await onAdd({
        typeId: type.typeId,
        durationMin: Number(duration),
        title: detail || type.typeName,
        memo: null,
      })
      onClose()
    } catch {
      // 에러는 상위 훅에서 처리
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-modal bg-black/40 flex items-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full bg-white rounded-t-3xl px-6 pt-6 pb-10 flex flex-col gap-6 max-h-[90dvh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-headline text-on-surface">운동 기록하기</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-full transition-colors text-xl"
          >
            ×
          </button>
        </div>

        {/* 운동 종류 */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold text-on-surface-variant tracking-wide">운동 종류 선택</p>
          {typesLoading ? (
            <div className="h-20 flex items-center justify-center text-sm text-outline-variant">
              운동 종목을 불러오는 중...
            </div>
          ) : exerciseTypes.length === 0 ? (
            <div className="h-20 flex items-center justify-center text-sm text-red-400">
              운동 종목을 불러오지 못했습니다
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {exerciseTypes.map((type) => {
                const isActive = selected === type.typeId
                return (
                  <button
                    key={type.typeId}
                    onClick={() => setSelected(type.typeId)}
                    className={[
                      'flex flex-col items-center justify-center gap-1.5 rounded-2xl py-3 transition-colors',
                      isActive ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface',
                    ].join(' ')}
                  >
                    <span className="text-2xl leading-none">{type.emoji}</span>
                    <span className={`text-[11px] font-semibold ${isActive ? 'text-white' : 'text-on-surface-variant'}`}>
                      {type.typeName}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* 운동 시간 */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold text-on-surface-variant tracking-wide">운동 시간 (분)</p>
          <div className="h-16 bg-surface-container-low rounded-2xl flex items-center px-5 gap-3">
            <input
              type="number"
              inputMode="numeric"
              placeholder="45"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-2xl font-bold font-headline text-on-surface outline-none placeholder:text-outline-variant [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="shrink-0 text-sm font-bold text-outline-variant tracking-widest">MIN</span>
          </div>
        </div>

        {/* 상세 내용 */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold text-on-surface-variant tracking-wide">상세 내용</p>
          <textarea
            placeholder="오늘의 운동에 대한 메모를 남겨보세요..."
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={4}
            className="bg-surface-container-low rounded-2xl px-5 py-4 text-sm text-on-surface outline-none resize-none placeholder:text-outline-variant"
          />
        </div>

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={!selected || !duration || saving}
          className="w-full h-14 bg-primary text-white font-bold font-headline text-base rounded-2xl transition-opacity disabled:opacity-40"
        >
          {saving ? '저장 중...' : '기록 완료하기'}
        </button>
      </div>
    </div>
  )
}

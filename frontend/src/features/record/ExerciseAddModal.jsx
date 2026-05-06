import { useState } from 'react'

const FALLBACK_TYPES = [
  { typeId: null, typeName: '사이클',   emoji: '🚴', metValue: 8.5  },
  { typeId: null, typeName: '수영',     emoji: '🏊', metValue: 10.0 },
  { typeId: null, typeName: '자전거',   emoji: '🚲', metValue: 7.5  },
  { typeId: null, typeName: '헬스',     emoji: '🏋️', metValue: 7.0  },
  { typeId: null, typeName: '런닝',     emoji: '🏃', metValue: 9.8  },
  { typeId: null, typeName: '줄넘기',   emoji: '🪢', metValue: 12.3 },
  { typeId: null, typeName: '필라테스', emoji: '🧘', metValue: 3.8  },
  { typeId: null, typeName: '기타',     emoji: '···', metValue: 5.0 },
]

const WEIGHT_KG = 70 // 기본값 — 추후 프로필 스토어 연동 예정

// MET 공식: calories = MET * weight(kg) * duration(h)
function calcCalories(metValue, durationMin) {
  return Math.round(Number(metValue) * WEIGHT_KG * (Number(durationMin) / 60))
}

export default function ExerciseAddModal({ onClose, exerciseTypes = [], onAdd }) {
  const types = exerciseTypes.length > 0 ? exerciseTypes : FALLBACK_TYPES
  const [selected, setSelected] = useState(null)
  const [duration, setDuration] = useState('')
  const [detail, setDetail] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!selected || !duration) return
    const type = types.find((t) => t.typeId === selected || t.typeName === selected)
    if (!type) return
    setSaving(true)
    try {
      await onAdd({
        typeId: type.typeId,
        durationMin: Number(duration),
        caloriesBurned: calcCalories(type.metValue, duration),
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

  const selectedKey = (t) => t.typeId ?? t.typeName

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
          <div className="grid grid-cols-4 gap-2">
            {types.map((type) => {
              const key = selectedKey(type)
              const isActive = selected === key
              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
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
        </div>

        {/* 운동 시간 */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold text-on-surface-variant tracking-wide">운동 시간 (분)</p>
          <div className="h-16 bg-surface-container-low rounded-2xl flex items-center px-5 gap-3">
            <input
              type="number"
              placeholder="45"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="flex-1 bg-transparent text-2xl font-bold font-headline text-on-surface outline-none placeholder:text-outline-variant"
            />
            <span className="text-sm font-bold text-outline-variant tracking-widest">MIN</span>
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

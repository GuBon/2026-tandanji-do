import { useState } from 'react'
import useExerciseStore from '../../store/useExerciseStore.js'

const EXERCISE_TYPES = [
  { key: 'cycle',   label: '사이클',   emoji: '🚴', kcalPerMin: 8  },
  { key: 'swim',    label: '수영',     emoji: '🏊', kcalPerMin: 10 },
  { key: 'bike',    label: '자전거',   emoji: '🚲', kcalPerMin: 7  },
  { key: 'gym',     label: '헬스',     emoji: '🏋️', kcalPerMin: 7  },
  { key: 'run',     label: '런닝',     emoji: '🏃', kcalPerMin: 10 },
  { key: 'jump',    label: '줄넘기',   emoji: '🪢', kcalPerMin: 12 },
  { key: 'pilates', label: '필라테스', emoji: '🧘', kcalPerMin: 4  },
  { key: 'other',   label: '기타',     emoji: '···', kcalPerMin: 5 },
]

export default function ExerciseAddModal({ onClose }) {
  const addExercise = useExerciseStore((s) => s.addExercise)
  const [selected, setSelected] = useState(null)
  const [duration, setDuration] = useState('')
  const [detail, setDetail] = useState('')

  const handleSubmit = () => {
    if (!selected || !duration) return
    const type = EXERCISE_TYPES.find((t) => t.key === selected)
    addExercise({
      name:     type.label,
      emoji:    type.emoji,
      detail:   detail || type.label,
      duration: Number(duration),
      unit:     'min',
      calories: Math.round(type.kcalPerMin * Number(duration)),
    })
    onClose()
  }

  return (
    /* 오버레이 */
    <div
      className="fixed inset-0 z-modal bg-black/40 flex items-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* 바텀시트 */}
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
            {EXERCISE_TYPES.map((type) => {
              const isActive = selected === type.key
              return (
                <button
                  key={type.key}
                  onClick={() => setSelected(type.key)}
                  className={[
                    'flex flex-col items-center justify-center gap-1.5 rounded-2xl py-3 transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-low text-on-surface',
                  ].join(' ')}
                >
                  <span className="text-2xl leading-none">{type.emoji}</span>
                  <span className={`text-[11px] font-semibold ${isActive ? 'text-white' : 'text-on-surface-variant'}`}>
                    {type.label}
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
          disabled={!selected || !duration}
          className="w-full h-14 bg-primary text-white font-bold font-headline text-base rounded-2xl transition-opacity disabled:opacity-40"
        >
          기록 완료하기
        </button>
      </div>
    </div>
  )
}

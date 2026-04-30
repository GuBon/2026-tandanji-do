export default function ExerciseActivityCard({ exercise, onRemove }) {
  const durationStr = exercise.unit === 'km'
    ? `${exercise.duration}km`
    : `${exercise.duration}min`

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
      <div className="flex items-center p-4 gap-4">
        {/* 이모지 썸네일 */}
        <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center text-3xl shrink-0">
          {exercise.emoji}
        </div>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-on-surface font-body">{exercise.name}</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {exercise.detail} · {durationStr}
          </p>
        </div>

        {/* 칼로리 + 삭제 */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-headline font-bold text-primary">{exercise.calories} kcal</span>
          {onRemove && (
            <button
              onClick={onRemove}
              className="text-outline-variant hover:text-on-surface-variant transition-colors"
              aria-label="삭제"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

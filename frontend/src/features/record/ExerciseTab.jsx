import { useState } from 'react'
import CalorieHeroCard from './CalorieHeroCard.jsx'
import ExerciseActivityCard from './ExerciseActivityCard.jsx'
import HistoryModal from './HistoryModal.jsx'
import useAuthStore from '../../store/useAuthStore.js'

function StatCard({ label, value, unit }) {
  return (
    <div className="bg-surface-container-low p-5 rounded-xl flex-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 font-body">
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span className="font-headline font-bold text-2xl text-on-surface">{value}</span>
        <span className="text-xs font-medium text-on-surface-variant">{unit}</span>
      </div>
    </div>
  )
}

export default function ExerciseTab({ exercises, totalCalories, totalMinutes, loading, onRemove }) {
  const [historyOpen, setHistoryOpen] = useState(false)
  const user = useAuthStore((s) => s.user)

  return (
    <div className="flex flex-col gap-6 px-5 py-5 pb-28">
      <CalorieHeroCard label="오늘의 소비 칼로리" value={totalCalories} />

      {/* 신장 / 체중 */}
      <div className="flex gap-6 px-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-bold text-outline">신장</span>
          <span className="text-lg font-bold font-headline text-on-surface">
            {user?.height ?? '—'}
            <span className="text-[10px] font-normal text-outline-variant ml-0.5 uppercase">cm</span>
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 border-l border-outline-variant/30 pl-6">
          <span className="text-xs font-bold text-outline">체중</span>
          <span className="text-lg font-bold font-headline text-on-surface">
            {user?.weight ?? '—'}
            <span className="text-[10px] font-normal text-outline-variant ml-0.5 uppercase">kg</span>
          </span>
        </div>
      </div>

      {/* 통계 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="운동 시간" value={totalMinutes} unit="MIN" />
        <StatCard label="운동 횟수" value={exercises.length} unit="회" />
      </div>

      {/* 활동 목록 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-outline">오늘의 운동</h3>
          <button
            onClick={() => setHistoryOpen(true)}
            className="text-xs font-bold bg-primary text-white px-3 py-1 rounded-full"
          >
            내 기록
          </button>
        </div>

        {loading ? (
          <div className="h-24 flex items-center justify-center text-sm text-outline-variant">
            불러오는 중...
          </div>
        ) : exercises.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-sm text-outline-variant">
            아직 기록된 운동이 없어요
          </div>
        ) : (
          exercises.map((ex) => (
            <ExerciseActivityCard
              key={ex.id}
              exercise={ex}
              onRemove={() => onRemove(ex)}
            />
          ))
        )}
      </div>

      {historyOpen && (
        <HistoryModal type="exercise" onClose={() => setHistoryOpen(false)} />
      )}
    </div>
  )
}

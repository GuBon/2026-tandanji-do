import useExerciseStore from '../../store/useExerciseStore.js'
import CalorieHeroCard from './CalorieHeroCard.jsx'
import ExerciseActivityCard from './ExerciseActivityCard.jsx'

// 신장/체중: 현재 데이터 모델 없음 — 향후 프로필 스토어 연동 예정
const BODY_STATS = { height: 182, weight: 76.4 }

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

export default function ExerciseTab() {
  const { exercises, totalVolumeTon, removeExercise } = useExerciseStore()

  const totalCalories = exercises.reduce((s, e) => s + e.calories, 0)
  const totalMinutes  = exercises
    .filter((e) => e.unit === 'min')
    .reduce((s, e) => s + e.duration, 0)

  return (
    <div className="flex flex-col gap-6 px-5 py-5 pb-28">
      {/* 칼로리 히어로 카드 */}
      <CalorieHeroCard label="오늘의 소비 칼로리" value={totalCalories} />

      {/* 신장 / 체중 */}
      <div className="flex gap-6 px-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-bold text-outline">신장</span>
          <span className="text-lg font-bold font-headline text-on-surface">
            {BODY_STATS.height}
            <span className="text-[10px] font-normal text-outline-variant ml-0.5 uppercase">cm</span>
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 border-l border-outline-variant/30 pl-6">
          <span className="text-xs font-bold text-outline">체중</span>
          <span className="text-lg font-bold font-headline text-on-surface">
            {BODY_STATS.weight}
            <span className="text-[10px] font-normal text-outline-variant ml-0.5 uppercase">kg</span>
          </span>
        </div>
      </div>

      {/* 통계 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="운동 시간"  value={totalMinutes}  unit="MIN" />
        <StatCard label="운동량"     value={totalVolumeTon} unit="TON" />
      </div>

      {/* 활동 목록 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-outline">활동 기록</h3>

        {exercises.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-sm text-outline-variant">
            아직 기록된 운동이 없어요
          </div>
        ) : (
          exercises.map((ex) => (
            <ExerciseActivityCard
              key={ex.id}
              exercise={ex}
              onRemove={() => removeExercise(ex.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

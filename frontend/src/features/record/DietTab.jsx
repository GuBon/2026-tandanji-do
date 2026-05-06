import { useState } from 'react'
import { useDiet } from './useDiet.js'
import CalorieHeroCard from './CalorieHeroCard.jsx'
import DietMealCard from './DietMealCard.jsx'
import HistoryModal from './HistoryModal.jsx'

const CALORIE_GOAL = 2000
const MACRO_GOALS = { carbs: 320, protein: 180, fat: 75 }

const DEMO_MEALS = [
  { id: 'demo1', name: '아보카도 수란 토스트', calories: 320, carbs: 42, protein: 18, fat: 22, emoji: '🥑' },
  { id: 'demo2', name: '지중해식 파워 볼',     calories: 480, carbs: 58, protein: 24, fat: 12, emoji: '🥗' },
]

const BODY_STATS = { height: 182, weight: 76.4 }

function MacroBar({ label, current, goal, unit }) {
  const pct = Math.min((current / goal) * 100, 100)
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[11px] uppercase tracking-widest font-bold text-on-surface-variant font-body">
          {label}
        </span>
        <span className="font-headline font-bold text-base text-on-surface">
          {current}
          <span className="text-xs font-normal text-outline-variant ml-1">/ {goal}{unit}</span>
        </span>
      </div>
      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-dim rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function DietTab() {
  const [historyOpen, setHistoryOpen] = useState(false)
  const { meals, dailyCalories, removeMealEntry, loading } = useDiet()

  const isDemo = meals.length === 0 && !loading
  const displayMeals = isDemo ? DEMO_MEALS : meals
  const totalCal     = isDemo ? 1780 : dailyCalories
  const totalCarbs   = displayMeals.reduce((s, m) => s + (m.carbs   || 0), 0)
  const totalProtein = displayMeals.reduce((s, m) => s + (m.protein || 0), 0)
  const totalFat     = displayMeals.reduce((s, m) => s + (m.fat     || 0), 0)

  return (
    <div className="flex flex-col gap-6 px-5 py-5 pb-28">
      <CalorieHeroCard label="오늘의 섭취 칼로리" value={totalCal} />

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

      {/* 매크로 카드 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/10 space-y-5">
        <MacroBar label="탄수화물" current={totalCarbs}   goal={MACRO_GOALS.carbs}   unit="g" />
        <MacroBar label="단백질"   current={totalProtein} goal={MACRO_GOALS.protein} unit="g" />
        <MacroBar label="지방"     current={totalFat}     goal={MACRO_GOALS.fat}     unit="g" />
      </div>

      {/* 식단 목록 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-outline">오늘의 식단</h3>
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
        ) : (
          displayMeals.map((meal) => (
            <DietMealCard
              key={meal.id}
              meal={meal}
              onRemove={isDemo ? null : () => removeMealEntry(meal)}
            />
          ))
        )}
      </div>

      {historyOpen && (
        <HistoryModal type="diet" onClose={() => setHistoryOpen(false)} />
      )}
    </div>
  )
}

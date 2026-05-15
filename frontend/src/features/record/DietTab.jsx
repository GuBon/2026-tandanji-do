import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDiet } from './useDiet.js'
import CalorieHeroCard from './CalorieHeroCard.jsx'
import DietMealCard from './DietMealCard.jsx'
import HistoryModal from './HistoryModal.jsx'
import AuthRequiredModal from '../../components/AuthRequiredModal.jsx'
import useAuthStore from '../../store/useAuthStore.js'
import { useAuthRequired } from '../../hooks/useAuthRequired.js'
import BodyMetricSummary from './BodyMetricSummary.jsx'

const CALORIE_GOAL = 2000
const MACRO_GOALS = { carbs: 320, protein: 180, fat: 75 }

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
  const navigate = useNavigate()
  const { meals, dailyCalories, removeMealEntry, loading } = useDiet()
  const user = useAuthStore((s) => s.user)
  const { requireAuth, modalOpen: authModalOpen, closeModal: closeAuthModal } = useAuthRequired()

  const totalCarbs   = meals.reduce((s, m) => s + (m.carbs   || 0), 0)
  const totalProtein = meals.reduce((s, m) => s + (m.protein || 0), 0)
  const totalFat     = meals.reduce((s, m) => s + (m.fat     || 0), 0)
  const handleBodyEdit = () => {
    requireAuth(() => navigate('/profile/body', { state: { from: '/record' } }))
  }

  return (
    <div className="flex flex-col gap-6 px-5 py-5 pb-28">
      <BodyMetricSummary height={user?.height} weight={user?.weight} onEdit={handleBodyEdit} />

      <CalorieHeroCard label="오늘의 섭취 칼로리" value={dailyCalories} />

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
            onClick={() => requireAuth(() => setHistoryOpen(true))}
            className="text-xs font-bold bg-primary text-white px-3 py-1 rounded-full"
          >
            내 기록
          </button>
        </div>

        {loading ? (
          <div className="h-24 flex items-center justify-center text-sm text-outline-variant">
            불러오는 중...
          </div>
        ) : meals.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-sm text-outline-variant">
            오늘의 식단을 추가해보세요
          </div>
        ) : (
          meals.map((meal) => (
            <DietMealCard
              key={meal.id}
              meal={meal}
              onRemove={() => removeMealEntry(meal)}
            />
          ))
        )}
      </div>

      {historyOpen && (
        <HistoryModal type="diet" onClose={() => setHistoryOpen(false)} />
      )}
      {authModalOpen && <AuthRequiredModal onClose={closeAuthModal} />}
    </div>
  )
}

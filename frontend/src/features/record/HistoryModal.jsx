import { useState, useEffect } from 'react'
import BottomSheet from '../../components/BottomSheet.jsx'
import ExerciseActivityCard from './ExerciseActivityCard.jsx'
import DietMealCard from './DietMealCard.jsx'
import { fetchDietLogs, fetchExerciseLogs } from '../../api/recordApi.js'

const TYPE_EMOJIS = {
  '사이클': '🚴', '수영': '🏊', '자전거': '🚲', '헬스': '🏋️',
  '런닝': '🏃', '줄넘기': '🪢', '필라테스': '🧘', '기타': '···',
}

function formatDate(date) {
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  if (isToday) return '오늘'
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function toDietItem(log) {
  return {
    id: String(log.logId),
    name: log.foodName || '(메뉴)',
    calories: log.logKcal || 0,
    carbs: log.logCarbs || 0,
    protein: log.logProtein || 0,
    fat: log.logFat || 0,
    imgUrl: log.imgUrl ?? null,
  }
}

function toExerciseItem(log) {
  return {
    id: String(log.exerciseId),
    name: log.typeName,
    detail: log.title || log.typeName,
    duration: log.durationMin,
    unit: 'min',
    calories: log.caloriesBurned,
    emoji: TYPE_EMOJIS[log.typeName] ?? '🏃',
  }
}

export default function HistoryModal({ type, onClose }) {
  const isDiet = type === 'diet'
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date()
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      return d
    })

    const fetchFn = isDiet ? fetchDietLogs : fetchExerciseLogs

    Promise.all(dates.map((d) => fetchFn(d).catch(() => [])))
      .then((results) => {
        const groups = results
          .map((logs, i) => ({
            date: formatDate(dates[i]),
            items: isDiet ? logs.map(toDietItem) : logs.map(toExerciseItem),
          }))
          .filter((g) => g.items.length > 0)
        setHistory(groups)
      })
      .finally(() => setLoading(false))
  }, [isDiet])

  return (
    <BottomSheet onClose={onClose} defaultExpanded>
      {/* 헤더 */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-outline-variant/10">
        <h2 className="text-lg font-bold font-headline text-on-surface">
          {isDiet ? '내 식단 기록' : '내 운동 기록'}
        </h2>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-full transition-colors text-xl"
        >
          ×
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-6 py-5 pb-10 flex flex-col gap-6">
        {loading ? (
          <div className="h-32 flex items-center justify-center text-sm text-outline-variant">
            불러오는 중...
          </div>
        ) : history.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-sm text-outline-variant">
            아직 기록이 없어요
          </div>
        ) : (
          history.map((group) => (
            <div key={group.date} className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-outline">{group.date}</p>
              {isDiet
                ? group.items.map((item) => <DietMealCard key={item.id} meal={item} onRemove={null} />)
                : group.items.map((item) => <ExerciseActivityCard key={item.id} exercise={item} onRemove={null} />)
              }
            </div>
          ))
        )}
      </div>
    </BottomSheet>
  )
}

import { useState, useRef, useEffect } from 'react'
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
    const days = 7
    const today = new Date()
    const dates = Array.from({ length: days }, (_, i) => {
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
            rawDate: dates[i],
            items: isDiet ? logs.map(toDietItem) : logs.map(toExerciseItem),
          }))
          .filter((g) => g.items.length > 0)
        setHistory(groups)
      })
      .finally(() => setLoading(false))
  }, [isDiet])

  const [translateY, setTranslateY] = useState(0)
  const dragStartY = useRef(null)
  const isDragging = useRef(false)
  const currentDelta = useRef(0)

  const startDrag = (clientY) => { dragStartY.current = clientY; isDragging.current = true }
  const moveDrag = (clientY) => {
    if (!isDragging.current) return
    const delta = clientY - dragStartY.current
    if (delta > 0) { currentDelta.current = delta; setTranslateY(delta) }
  }
  const endDrag = () => {
    if (!isDragging.current) return
    isDragging.current = false
    if (currentDelta.current > 120) { onClose() }
    else { currentDelta.current = 0; setTranslateY(0) }
  }

  useEffect(() => {
    const onMouseMove = (e) => moveDrag(e.clientY)
    const onMouseUp = () => endDrag()
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp) }
  }, [])

  return (
    <div
      className="fixed inset-0 z-modal bg-black/40 flex items-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full bg-white rounded-t-3xl flex flex-col max-h-[85dvh]"
        style={{ transform: `translateY(${translateY}px)`, transition: isDragging.current ? 'none' : 'transform 0.25s ease' }}
      >
        {/* 드래그 핸들 */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab select-none shrink-0"
          onTouchStart={(e) => startDrag(e.touches[0].clientY)}
          onTouchMove={(e) => moveDrag(e.touches[0].clientY)}
          onTouchEnd={endDrag}
          onMouseDown={(e) => startDrag(e.clientY)}
        >
          <div className="w-10 h-1 bg-outline-variant/40 rounded-full" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-outline-variant/10 shrink-0">
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
      </div>
    </div>
  )
}

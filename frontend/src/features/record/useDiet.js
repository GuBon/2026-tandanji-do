import { useState, useCallback, useEffect } from 'react'
import useDietStore from '../../store/useDietStore.js'
import { fetchDietLogs, createDietLog, deleteDietLog, toLocalDateTimeStr } from '../../api/recordApi.js'
import { toDietRecordItem } from './recordMappers.js'

export function useDiet() {
  const meals = useDietStore((s) => s.meals)
  const addMeal = useDietStore((s) => s.addMeal)
  const removeMeal = useDietStore((s) => s.removeMeal)
  const resetMeals = useDietStore((s) => s.resetMeals)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const today = new Date()

  const loadTodayLogs = useCallback(async (signal) => {
    setLoading(true)
    setError(null)
    try {
      resetMeals()
      const logs = await fetchDietLogs(today)
      if (signal?.aborted) return
      logs.forEach((log) => addMeal(toDietRecordItem(log)))
    } catch (e) {
      if (!signal?.aborted) setError(e.message)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const ctrl = new AbortController()
    loadTodayLogs(ctrl.signal)
    return () => ctrl.abort()
  }, [loadTodayLogs])

  const dailyCalories = meals.reduce((s, m) => s + (m.calories || 0), 0)

  const addMealEntry = useCallback(
    async ({ name, calories, carbs = 0, protein = 0, fat = 0, mealType = '간식', ateAt, imgUrl = null }) => {
      const saved = await createDietLog({
        foodName: name,
        mealType,
        logKcal: Number(calories),
        logCarbs: Number(carbs),
        logProtein: Number(protein),
        logFat: Number(fat),
        logSugar: 0,
        imgUrl,
        ateAt: ateAt ?? toLocalDateTimeStr(),
      })
      addMeal(toDietRecordItem(saved))
      return saved
    },
    [addMeal],
  )

  const removeMealEntry = useCallback(
    async (meal) => {
      await deleteDietLog(meal.logId)
      removeMeal(meal.id)
    },
    [removeMeal],
  )

  return { meals, dailyCalories, addMealEntry, removeMealEntry, loading, refresh: () => loadTodayLogs() }
}

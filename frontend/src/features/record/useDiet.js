import { useState, useCallback, useEffect } from 'react'
import useDietStore from '../../store/useDietStore.js'
import { fetchDietLogs, createDietLog, deleteDietLog, toLocalDateTimeStr } from '../../api/recordApi.js'

function toStoreShape(log) {
  return {
    id: String(log.logId),
    logId: log.logId,
    name: log.foodName || '(메뉴)',
    calories: log.logKcal || 0,
    carbs: log.logCarbs || 0,
    protein: log.logProtein || 0,
    fat: log.logFat || 0,
    mealType: log.mealType,
    time: new Date(log.ateAt),
    imgUrl: log.imgUrl ?? null,
  }
}

export function useDiet() {
  const { meals, addMeal, removeMeal, resetMeals } = useDietStore()
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
      logs.forEach((log) => addMeal(toStoreShape(log)))
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
      addMeal(toStoreShape(saved))
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

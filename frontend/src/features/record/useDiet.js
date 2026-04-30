import { useCallback } from 'react'
import useDietStore from '../../store/useDietStore'

export function useDiet() {
  const { meals, dailyCalories, addMeal, removeMeal } = useDietStore()

  const addMealEntry = useCallback(
    (name, calories, carbs = 0, protein = 0, fat = 0) => {
      addMeal({
        id: crypto.randomUUID(),
        name,
        calories: Number(calories),
        carbs: Number(carbs),
        protein: Number(protein),
        fat: Number(fat),
        time: new Date(),
      })
    },
    [addMeal],
  )

  return { meals, dailyCalories, addMealEntry, removeMeal }
}

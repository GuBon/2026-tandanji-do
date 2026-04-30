import { create } from 'zustand'

const useDietStore = create((set) => ({
  meals: [],
  dailyCalories: 0,

  addMeal: (meal) =>
    set((state) => ({
      meals: [...state.meals, meal],
      dailyCalories: state.dailyCalories + meal.calories,
    })),

  removeMeal: (id) =>
    set((state) => {
      const target = state.meals.find((m) => m.id === id)
      return {
        meals: state.meals.filter((m) => m.id !== id),
        dailyCalories: state.dailyCalories - (target?.calories ?? 0),
      }
    }),

  resetMeals: () => set({ meals: [], dailyCalories: 0 }),
}))

export default useDietStore

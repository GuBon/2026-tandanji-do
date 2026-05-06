import { create } from 'zustand'

const useExerciseStore = create((set) => ({
  exercises: [],
  addExercise: (exercise) =>
    set((state) => ({ exercises: [...state.exercises, exercise] })),
  setExercises: (exercises) => set({ exercises }),
  removeExercise: (id) =>
    set((state) => ({ exercises: state.exercises.filter((e) => e.id !== id) })),
  resetExercises: () => set({ exercises: [] }),
}))

export default useExerciseStore

import { create } from 'zustand'

const useExerciseStore = create((set) => ({
  exercises: [
    { id: '1', name: '근력 운동', detail: '상체 집중', duration: 45, unit: 'min', calories: 320, emoji: '🏋️' },
    { id: '2', name: '야외 러닝', detail: '인터벌 훈련', duration: 5.2, unit: 'km', calories: 412, emoji: '🏃' },
    { id: '3', name: '아침 요가', detail: '명상', duration: 40, unit: 'min', calories: 110, emoji: '🧘' },
  ],
  totalVolumeTon: 4.2,
  addExercise: (exercise) =>
    set((state) => ({
      exercises: [...state.exercises, { ...exercise, id: crypto.randomUUID() }],
    })),
  removeExercise: (id) =>
    set((state) => ({ exercises: state.exercises.filter((e) => e.id !== id) })),
}))

export default useExerciseStore

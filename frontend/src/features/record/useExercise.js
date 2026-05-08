import { useState, useCallback, useEffect } from 'react'
import useExerciseStore from '../../store/useExerciseStore.js'
import {
  fetchExerciseLogs,
  fetchExerciseTypes,
  createExerciseLog,
  deleteExerciseLog,
} from '../../api/recordApi.js'

// typeId → emoji 매핑 (exercise_types 테이블 순서 기준)
const TYPE_EMOJIS = {
  '사이클': '🚴',
  '수영': '🏊',
  '자전거': '🚲',
  '헬스': '🏋️',
  '런닝': '🏃',
  '줄넘기': '🪢',
  '필라테스': '🧘',
  '기타': '···',
}

function toStoreShape(log) {
  return {
    id: String(log.exerciseId),
    name: log.typeName,
    detail: log.title || log.typeName,
    duration: log.durationMin,
    unit: 'min',
    calories: log.caloriesBurned,
    emoji: TYPE_EMOJIS[log.typeName] ?? '🏃',
    typeId: log.typeId,
    exerciseId: log.exerciseId,
  }
}

export function useExercise() {
  const { exercises, addExercise, setExercises, removeExercise } = useExerciseStore()
  const [exerciseTypes, setExerciseTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [typesLoading, setTypesLoading] = useState(true)
  const [error, setError] = useState(null)

  const today = new Date()

  const loadTodayLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const logs = await fetchExerciseLogs(today)
      setExercises(logs.map(toStoreShape))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadExerciseTypes = useCallback(async () => {
    setTypesLoading(true)
    try {
      const types = await fetchExerciseTypes()
      setExerciseTypes(
        types.map((t) => ({
          ...t,
          emoji: TYPE_EMOJIS[t.typeName] ?? '🏃',
        }))
      )
    } catch {
      setExerciseTypes([])
    } finally {
      setTypesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTodayLogs()
    loadExerciseTypes()
  }, [loadTodayLogs, loadExerciseTypes])

  const addExerciseEntry = useCallback(async ({ typeId, durationMin, title, memo }) => {
    const saved = await createExerciseLog({ typeId, durationMin, title, memo })
    addExercise(toStoreShape(saved))
    return saved
  }, [addExercise])

  const removeExerciseEntry = useCallback(async (exercise) => {
    await deleteExerciseLog(exercise.exerciseId)
    removeExercise(exercise.id)
  }, [removeExercise])

  const totalCalories = exercises.reduce((s, e) => s + (e.calories || 0), 0)
  const totalMinutes = exercises.reduce((s, e) => s + (e.duration || 0), 0)

  return {
    exercises,
    exerciseTypes,
    typesLoading,
    totalCalories,
    totalMinutes,
    loading,
    error,
    addExerciseEntry,
    removeExerciseEntry,
    refresh: loadTodayLogs,
  }
}

import { useState, useCallback, useEffect } from 'react'
import useExerciseStore from '../../store/useExerciseStore.js'
import {
  fetchExerciseLogs,
  fetchExerciseTypes,
  createExerciseLog,
  deleteExerciseLog,
} from '../../api/recordApi.js'
import { getExerciseTypeEmoji, toExerciseRecordItem } from './recordMappers.js'

export function useExercise() {
  const exercises = useExerciseStore((s) => s.exercises)
  const addExercise = useExerciseStore((s) => s.addExercise)
  const setExercises = useExerciseStore((s) => s.setExercises)
  const removeExercise = useExerciseStore((s) => s.removeExercise)
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
      setExercises(logs.map(toExerciseRecordItem))
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
          emoji: getExerciseTypeEmoji(t.typeName),
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
    addExercise(toExerciseRecordItem(saved))
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

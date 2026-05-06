import { apiClient } from './apiClient.js'

const toDateStr = (date) => date.toISOString().slice(0, 10)

// ── 식단 기록 ──────────────────────────────────────────────────────────────

export async function fetchDietLogs(date) {
  const res = await apiClient(`/diet-logs?date=${toDateStr(date)}`)
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}

export async function createDietLog(payload) {
  const res = await apiClient('/diet-logs', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}

export async function deleteDietLog(logId) {
  const res = await apiClient(`/diet-logs/${logId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(res.status)
}

// ── 운동 종목 ──────────────────────────────────────────────────────────────

export async function fetchExerciseTypes() {
  const res = await apiClient('/exercise-types')
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}

// ── 운동 기록 ──────────────────────────────────────────────────────────────

export async function fetchExerciseLogs(date) {
  const res = await apiClient(`/exercise-logs?date=${toDateStr(date)}`)
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}

export async function createExerciseLog(payload) {
  const res = await apiClient('/exercise-logs', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}

export async function deleteExerciseLog(exerciseId) {
  const res = await apiClient(`/exercise-logs/${exerciseId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(res.status)
}

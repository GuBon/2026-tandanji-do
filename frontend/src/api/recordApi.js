import { apiClient } from './apiClient.js'

const pad = (value) => String(value).padStart(2, '0')

export function toDateStr(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function toLocalDateTimeStr(date = new Date()) {
  return `${toDateStr(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

// ── 식단 기록 ──────────────────────────────────────────────────────────────

export async function fetchDietLogs(date) {
  const res = await apiClient(`/diet-logs?date=${toDateStr(date)}`)
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}

export async function createDietLog({ imgUrl, ...rest }) {
  const res = await apiClient('/diet-logs', {
    method: 'POST',
    body: JSON.stringify({ ...rest, imgUrl: imgUrl ?? null }),
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

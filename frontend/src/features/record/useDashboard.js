import { useState, useEffect } from 'react'
import { fetchDietLogs, fetchExerciseLogs, fetchWeightLogs, toDateStr } from '../../api/recordApi.js'

function getDateRange(days) {
  const today = new Date()
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (days - 1 - i))
    return d
  })
}

function makeLabel(date, days) {
  if (days <= 7) {
    return ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  }
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export function useDashboard(days) {
  const [data, setData] = useState([])
  const [weightLogs, setWeightLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const dates = getDateRange(days)
    const startTs = new Date(dates[0]).setHours(0, 0, 0, 0)
    setLoading(true)

    const calorieFetch = Promise.all(
      dates.map(async (date) => {
        const [dietLogs, exerciseLogs] = await Promise.all([
          fetchDietLogs(date).catch(() => []),
          fetchExerciseLogs(date).catch(() => []),
        ])
        const intake = dietLogs.reduce((sum, l) => sum + (l.logKcal || 0), 0)
        const burned = exerciseLogs.reduce((sum, l) => sum + (l.caloriesBurned || 0), 0)
        return {
          date,
          dateStr: toDateStr(date),
          label: makeLabel(date, days),
          intake,
          burned,
          net: intake - burned,
        }
      })
    )

    const weightFetch = fetchWeightLogs().catch(() => [])

    Promise.all([calorieFetch, weightFetch])
      .then(([calorieData, allWeightLogs]) => {
        if (cancelled) return
        setData(calorieData)
        const filtered = allWeightLogs
          .filter((log) => new Date(log.recordedAt).getTime() >= startTs)
          .map((log) => {
            const d = new Date(log.recordedAt)
            return {
              label: `${d.getMonth() + 1}/${d.getDate()}`,
              weight: log.weightKg,
              recordedAt: log.recordedAt,
            }
          })
        setWeightLogs(filtered)
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [days])

  const today = data[data.length - 1] ?? { intake: 0, burned: 0, net: 0 }
  return { data, today, weightLogs, loading }
}

import { useState, useEffect, useCallback } from 'react'
import { fetchAdminReports, updateReportStatus } from '../../api/reportApi.js'

export function useAdminReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchAdminReports()
      setReports(data ?? [])
    } catch {
      setError('제보 목록을 불러오는 데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const changeStatus = useCallback(async (reportId, status) => {
    try {
      const updated = await updateReportStatus(reportId, status)
      setReports((prev) =>
        prev.map((r) => (r.reportId === updated.reportId ? updated : r))
      )
    } catch {
      setError('상태 변경에 실패했습니다.')
    }
  }, [])

  return { reports, loading, error, reload: load, changeStatus }
}

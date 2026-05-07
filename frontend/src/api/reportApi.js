import { apiClient } from './apiClient.js'

export async function submitReport({ storeName, menuName, carbs, protein, fat, imageUrl }) {
  const res = await apiClient('/reports', {
    method: 'POST',
    body: JSON.stringify({ storeName, menuName, carbs, protein, fat, imageUrl: imageUrl ?? null }),
  })
  if (!res.ok) throw new Error(res.status)
  return res.json()
}

export async function fetchAdminReports() {
  const res = await apiClient('/admin/reports')
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}

export async function updateReportStatus(reportId, status) {
  const res = await apiClient(`/admin/reports/${reportId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}

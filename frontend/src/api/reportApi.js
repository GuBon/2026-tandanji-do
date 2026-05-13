import { apiClient } from './apiClient.js'

export async function submitReport({ storeId, storeName, storeAddress, storeLat, storeLon, menuName, carbs, protein, fat, imageUrl }) {
  const res = await apiClient('/reports', {
    method: 'POST',
    body: JSON.stringify({
      storeId:      storeId      ?? null,
      storeName,
      storeAddress: storeAddress ?? null,
      storeLat:     storeLat    ?? null,
      storeLon:     storeLon    ?? null,
      menuName,
      carbs,
      protein,
      fat,
      imageUrl: imageUrl ?? null,
    }),
  })
  if (!res.ok) throw new Error(res.status)
  return res.json()
}

export async function fetchPublicReports(storeId = null) {
  const url = storeId ? `/reports?storeId=${storeId}` : '/reports'
  const res = await apiClient(url)
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data ?? []
}

export async function voteOnReport(reportId, voteType) {
  const res = await apiClient(`/reports/${reportId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ voteType }),
  })
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}

export async function fetchMenuReports(storeId) {
  const res = await apiClient(`/stores/${storeId}/menu-reports`)
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data ?? []
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

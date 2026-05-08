import { apiClient } from './apiClient.js'

export async function fetchMe() {
  const res = await apiClient('/users/me')
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}

export async function updateMe(payload) {
  const res = await apiClient('/users/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.message ?? '프로필 저장에 실패했습니다.')
  return body.data
}

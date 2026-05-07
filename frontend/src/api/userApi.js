import { apiClient } from './apiClient.js'

export async function fetchMe() {
  const res = await apiClient('/users/me')
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}

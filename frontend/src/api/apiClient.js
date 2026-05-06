import useAuthStore from '../store/useAuthStore'

const BASE = import.meta.env.VITE_API_BASE_URL

export async function apiClient(path, options = {}) {
  const jwtAccessToken = useAuthStore.getState().jwtAccessToken

  const { headers: optHeaders, ...restOptions } = options
  const response = await fetch(`${BASE}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(jwtAccessToken && { Authorization: `Bearer ${jwtAccessToken}` }),
      ...optHeaders,
    },
  })

  return response
}

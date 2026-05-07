import useAuthStore from '../store/useAuthStore'

const BASE = import.meta.env.VITE_API_BASE_URL

/**
 * POST /images/upload?domain=xxx
 * Content-Type은 브라우저가 multipart boundary 포함해서 자동 설정 — 직접 지정 금지
 * @param {File} file
 * @param {'stores'|'brands'|'menus'|'posts'|'diet'|'users'|'reviews'|'reports'} domain
 * @returns {Promise<string>} imageUrl
 */
export async function uploadImage(file, domain) {
  const jwtAccessToken = useAuthStore.getState().jwtAccessToken
  const form = new FormData()
  form.append('file', file)

  const res = await fetch(`${BASE}/images/upload?domain=${domain}`, {
    method: 'POST',
    headers: {
      ...(jwtAccessToken && { Authorization: `Bearer ${jwtAccessToken}` }),
    },
    body: form,
  })

  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data.imageUrl
}

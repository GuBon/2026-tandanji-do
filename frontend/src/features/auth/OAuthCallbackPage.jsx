import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI

export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const setError = useAuthStore((s) => s.setError)
  const setLoading = useAuthStore((s) => s.setLoading)
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const error = params.get('error')

    if (error || !code) {
      setError('카카오 로그인이 취소되었습니다.')
      navigate('/', { replace: true })
      return
    }

    setLoading(true)

    fetch(`${API_BASE}/auth/kakao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
    })
      .then((res) => res.json().then((body) => ({ ok: res.ok, body })))
      .then(({ ok, body }) => {
        if (!ok) throw new Error(body?.message ?? '백엔드 인증 실패')
        const { data } = body
        setAuth(data.user, data.accessToken, data.refreshToken)
        navigate('/map', { replace: true })
      })
      .catch((err) => {
        setError(err?.message ?? '로그인 처리 중 오류가 발생했습니다.')
        navigate('/', { replace: true })
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full h-dvh flex flex-col items-center justify-center bg-[#F8F9FA]">
      <img
        src="/images/tdj_logo.png"
        alt="TanDanJi Map"
        className="w-40 object-contain mb-6 animate-pulse"
      />
      <p className="text-sm text-[#2B3437]">로그인 처리 중...</p>
    </div>
  )
}

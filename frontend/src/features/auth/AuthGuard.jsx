import { useEffect } from 'react'
import useAuthStore from '../../store/useAuthStore'
import { useKakaoLogin } from './useKakaoLogin'

const API_BASE = import.meta.env.VITE_API_BASE_URL

export default function AuthGuard({ children }) {
  const user = useAuthStore((s) => s.user)
  const isGuest = useAuthStore((s) => s.isGuest)
  const isLoading = useAuthStore((s) => s.isLoading)
  const error = useAuthStore((s) => s.error)
  const jwtAccessToken = useAuthStore((s) => s.jwtAccessToken)
  const jwtRefreshToken = useAuthStore((s) => s.jwtRefreshToken)
  const setAccessToken = useAuthStore((s) => s.setAccessToken)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const { login, browseAsGuest } = useKakaoLogin()

  // 새로고침 후 메모리에서 사라진 accessToken을 복원 — 로그인 화면 노출 방지
  useEffect(() => {
    if (!jwtRefreshToken || jwtAccessToken) return

    fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: jwtRefreshToken }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('refresh failed')
        return res.json()
      })
      .then(({ data }) => setAccessToken(data.accessToken))
      .catch(() => clearAuth())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (user || isGuest) return children

  return (
    <div className="w-full h-dvh flex flex-col items-center justify-center bg-[#F8F9FA] px-8">
      <img
        src="/images/tdj_logo.png"
        alt="TanDanJi Map"
        className="w-72 max-w-[74%] object-contain mb-4"
      />

      <p className="text-xl font-medium tracking-[-0.6px] text-[#2B3437] text-center mb-16">
        유혹 없이 시작하는 나만의 식단 관리
      </p>

      <button
        onClick={login}
        disabled={isLoading}
        className="w-full max-w-[308px] h-[72px] p-0 border-none bg-transparent disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mb-3"
      >
        <img
          src="/images/kakao_login.png"
          alt="카카오로 시작하기"
          className="w-full h-full object-contain"
        />
      </button>

      <span
        onClick={browseAsGuest}
        className="text-sm font-medium text-[#1D1B20] underline underline-offset-[3px] cursor-pointer"
      >
        로그인없이 둘러보기
      </span>

      {error && (
        <p className="mt-4 text-xs text-amber-500 text-center bg-amber-50 rounded-lg px-3 py-1.5 w-full max-w-[308px]">
          {error}
        </p>
      )}
    </div>
  )
}

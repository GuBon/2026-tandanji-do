import { useCallback } from 'react'
import useAuthStore from '../../store/useAuthStore'

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI

export function useKakaoLogin() {
  const { setGuest, clearAuth, setError } = useAuthStore()

  const login = useCallback(() => {
    if (!window.Kakao) {
      setError('Kakao SDK가 로드되지 않았습니다.')
      return
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_APP_KEY)
    }

    window.Kakao.Auth.authorize({ redirectUri: REDIRECT_URI })
  }, [setError])

  const logout = useCallback(async () => {
    const { jwtAccessToken } = useAuthStore.getState()
    try {
      if (jwtAccessToken) {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${jwtAccessToken}` },
        })
      }
    } catch {
      // 로그아웃 실패해도 로컬 상태는 항상 초기화
    } finally {
      clearAuth()
    }
  }, [clearAuth])

  const browseAsGuest = useCallback(() => {
    setGuest()
  }, [setGuest])

  return { login, logout, browseAsGuest }
}

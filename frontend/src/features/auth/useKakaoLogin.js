import { useCallback } from 'react'
import useAuthStore from '../../store/useAuthStore'

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY

export function useKakaoLogin() {
  const { setAuth, setGuest, clearAuth, setLoading, setError } = useAuthStore()

  const login = useCallback(() => {
    if (!window.Kakao) {
      setError('Kakao SDK가 로드되지 않았습니다.')
      return
    }

    try {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_APP_KEY)
      }

      setLoading(true)

      window.Kakao.Auth.login({
        success: (authObj) => {
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: (res) => {
              setAuth(
                { id: res.id, nickname: res.kakao_account?.profile?.nickname },
                authObj.access_token,
              )
            },
            fail: (err) => setError(err?.message ?? '사용자 정보 요청 실패'),
          })
        },
        fail: (err) => setError(err?.error_description ?? '카카오 로그인 실패'),
      })
    } catch (err) {
      setError(err?.message ?? '로그인 중 오류가 발생했습니다.')
    }
  }, [setAuth, setLoading, setError])

  const logout = useCallback(() => {
    try {
      if (window.Kakao?.Auth?.getAccessToken()) {
        window.Kakao.Auth.logout(() => clearAuth())
      } else {
        clearAuth()
      }
    } catch (err) {
      clearAuth()
    }
  }, [clearAuth])

  const browseAsGuest = useCallback(() => {
    setGuest()
  }, [setGuest])

  return { login, logout, browseAsGuest }
}

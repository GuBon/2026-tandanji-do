import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(persist(
  (set) => ({
    user: null,            // { userId: Long, nickname: string }
    jwtAccessToken: null,  // 메모리만 (persist 제외 — 단기 토큰)
    jwtRefreshToken: null, // localStorage 영속
    isGuest: false,
    isLoading: false,
    error: null,

    setAuth: (user, jwtAccessToken, jwtRefreshToken) =>
      set({ user, jwtAccessToken, jwtRefreshToken, isGuest: false, isLoading: false, error: null }),
    setGuest: () =>
      set({ isGuest: true, user: null, jwtAccessToken: null, jwtRefreshToken: null, isLoading: false, error: null }),
    clearAuth: () =>
      set({ user: null, jwtAccessToken: null, jwtRefreshToken: null, isGuest: false, isLoading: false, error: null }),
    setAccessToken: (jwtAccessToken) => set({ jwtAccessToken }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error, isLoading: false }),
  }),
  {
    name: 'auth-storage',
    partialize: (state) => ({
      user: state.user,
      jwtRefreshToken: state.jwtRefreshToken,
    }),
  }
))

export default useAuthStore

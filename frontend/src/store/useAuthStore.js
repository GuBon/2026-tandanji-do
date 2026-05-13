import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(persist(
  (set) => ({
    user: null,            // { userId, nickname, role, height?, weight?, gender?, createdAt? }
    jwtAccessToken: null,  // 메모리만 (persist 제외 — 단기 토큰)
    jwtRefreshToken: null, // localStorage 영속
    isGuest: false,
    isLoading: false,
    error: null,
    profileLoaded: false,  // /users/me 호출 완료 여부

    setAuth: (user, jwtAccessToken, jwtRefreshToken) =>
      set({ user, jwtAccessToken, jwtRefreshToken, isGuest: false, isLoading: false, error: null, profileLoaded: false }),
    updateUser: (profile) =>
      set((s) => ({ user: { ...s.user, ...profile }, profileLoaded: true })),
    setGuest: () =>
      set({ isGuest: true, user: null, jwtAccessToken: null, jwtRefreshToken: null, isLoading: false, error: null, profileLoaded: false }),
    clearAuth: () =>
      set({ user: null, jwtAccessToken: null, jwtRefreshToken: null, isGuest: false, isLoading: false, error: null, profileLoaded: false }),
    setAccessToken: (jwtAccessToken) => set({ jwtAccessToken }),
    setTokens: (jwtAccessToken, jwtRefreshToken) => set({ jwtAccessToken, jwtRefreshToken }),
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

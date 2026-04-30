import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isGuest: false,
  isLoading: false,
  error: null,

  setAuth: (user, accessToken) =>
    set({ user, accessToken, isGuest: false, isLoading: false, error: null }),
  setGuest: () =>
    set({ isGuest: true, user: null, accessToken: null, isLoading: false, error: null }),
  clearAuth: () =>
    set({ user: null, accessToken: null, isGuest: false, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}))

export default useAuthStore

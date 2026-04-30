import { create } from 'zustand'

const useChatbotStore = create((set) => ({
  messages: [],
  isLoading: false,

  addMessage: (role, text) =>
    set((s) => ({
      messages: [...s.messages, { id: crypto.randomUUID(), role, text, time: new Date() }],
    })),

  setLoading: (isLoading) => set({ isLoading }),
  clearMessages: () => set({ messages: [] }),
}))

export default useChatbotStore

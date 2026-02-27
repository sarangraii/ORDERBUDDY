import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

interface AuthStore {
  token: string | null
  user: any | null
  restaurantId: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuth: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      restaurantId: null,

      login: async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password })
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        set({ token: data.token, user: data.user, restaurantId: data.user.restaurantId })
      },

      logout: () => {
        delete axios.defaults.headers.common['Authorization']
        set({ token: null, user: null, restaurantId: null })
      },

      isAuth: () => !!get().token
    }),
    {
      name: 'ob-manage-auth',
      onRehydrateStorage: () => (state) => {
        if (state?.token) axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
      }
    }
  )
)

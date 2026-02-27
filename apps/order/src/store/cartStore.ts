import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, MenuItem, QRData } from '../types'

interface CartStore {
  items: CartItem[]
  restaurantId: string | null
  tableNumber: string | null
  qrData: QRData | null

  setQRData: (data: QRData) => void
  addItem: (item: MenuItem, qty?: number, instructions?: string) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  getTotal: () => number
  getCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      tableNumber: null,
      qrData: null,

      setQRData: (data) =>
        set({ qrData: data, restaurantId: data.restaurantId, tableNumber: data.tableNumber ?? null }),

      addItem: (menuItem, qty = 1, specialInstructions = '') => {
        set((state) => {
          const idx = state.items.findIndex(i => i.menuItem._id === menuItem._id)
          if (idx >= 0) {
            const updated = [...state.items]
            updated[idx] = {
              ...updated[idx],
              quantity: updated[idx].quantity + qty,
              subtotal: menuItem.price * (updated[idx].quantity + qty)
            }
            return { items: updated }
          }
          return {
            items: [...state.items, {
              menuItem, quantity: qty,
              selectedOptions: {}, specialInstructions,
              subtotal: menuItem.price * qty
            }]
          }
        })
      },

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter(i => i.menuItem._id !== id) })),

      updateQty: (id, qty) => {
        if (qty <= 0) { get().removeItem(id); return }
        set((s) => ({
          items: s.items.map(i =>
            i.menuItem._id === id
              ? { ...i, quantity: qty, subtotal: i.menuItem.price * qty }
              : i
          )
        }))
      },

      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((s, i) => s + i.subtotal, 0),
      getCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'ob-cart' }
  )
)

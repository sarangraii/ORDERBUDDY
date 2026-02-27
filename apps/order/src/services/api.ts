import axios from 'axios'
import type { MenuItem, Category, Order, CartItem } from '../types'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

export const getMenu = async (restaurantId: string): Promise<{ categories: Category[]; items: MenuItem[] }> => {
  const { data } = await api.get(`/menu/${restaurantId}`)
  return data
}

export const getRestaurant = async (restaurantId: string) => {
  const { data } = await api.get(`/restaurants/${restaurantId}`)
  return data
}

export const createOrder = async (payload: {
  restaurantId: string
  tableNumber?: string
  orderType?: string
  items: CartItem[]
  specialInstructions?: string
}): Promise<Order> => {
  const items = payload.items.map(i => ({
    menuItemId: i.menuItem._id,
    name: i.menuItem.name,
    price: i.menuItem.price,
    quantity: i.quantity,
    selectedOptions: i.selectedOptions,
    specialInstructions: i.specialInstructions,
    subtotal: i.subtotal
  }))
  const { data } = await api.post('/orders', { ...payload, items })
  return data
}

export const getOrder = async (orderId: string): Promise<Order> => {
  const { data } = await api.get(`/orders/${orderId}`)
  return data
}

export interface Restaurant {
  _id: string
  name: string
  description: string
  logo?: string
  address: string
  phone: string
  isOpen: boolean
  branding: { primaryColor: string; accentColor: string }
  settings: { autoAccept: boolean; estimatedPrepTime: number }
}

export interface Category {
  _id: string
  restaurantId: string
  name: string
  description?: string
  sortOrder: number
  isActive: boolean
}

export interface MenuItemOption {
  name: string
  required: boolean
  multiSelect: boolean
  choices: { name: string; priceModifier: number }[]
}

export interface MenuItem {
  _id: string
  restaurantId: string
  categoryId: string
  name: string
  description: string
  price: number
  image?: string
  isAvailable: boolean
  tags: string[]
  allergens: string[]
  options: MenuItemOption[]
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  selectedOptions: Record<string, string[]>
  specialInstructions: string
  subtotal: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export interface Order {
  _id: string
  restaurantId: string
  tableNumber: string
  orderType: 'table' | 'pickup' | 'parking'
  status: OrderStatus
  items: any[]
  subtotal: number
  tax: number
  total: number
  createdAt: string
  updatedAt: string
  estimatedReadyAt?: string
  statusHistory: { status: string; timestamp: string; note?: string }[]
}

export interface QRData {
  restaurantId: string
  tableNumber?: string
}

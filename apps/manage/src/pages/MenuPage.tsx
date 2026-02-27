import { useState } from 'react'
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'

const DEMO_MENU = {
  categories: [
    { _id: 'starters', name: 'Starters' }, { _id: 'mains', name: 'Mains' },
    { _id: 'desserts', name: 'Desserts' }, { _id: 'drinks', name: 'Drinks' }
  ],
  items: [
    { _id: '1', categoryId: 'starters', name: 'Crispy Calamari', price: 8.99, isAvailable: true },
    { _id: '2', categoryId: 'starters', name: 'Bruschetta', price: 6.99, isAvailable: true },
    { _id: '3', categoryId: 'mains', name: 'Grilled Salmon', price: 22.99, isAvailable: true },
    { _id: '4', categoryId: 'mains', name: 'Beef Burger', price: 16.99, isAvailable: true },
    { _id: '5', categoryId: 'mains', name: 'Pasta Carbonara', price: 14.99, isAvailable: true },
    { _id: '6', categoryId: 'mains', name: 'Margherita Pizza', price: 13.99, isAvailable: false },
    { _id: '7', categoryId: 'desserts', name: 'Tiramisu', price: 7.99, isAvailable: true },
    { _id: '8', categoryId: 'desserts', name: 'Chocolate Lava Cake', price: 8.99, isAvailable: true },
    { _id: '9', categoryId: 'drinks', name: 'Fresh Lemonade', price: 4.99, isAvailable: true },
    { _id: '10', categoryId: 'drinks', name: 'Iced Coffee', price: 5.49, isAvailable: true },
  ]
}

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <div onClick={onChange} style={{ width: 44, height: 24, borderRadius: 999, background: checked ? 'var(--success)' : 'var(--surface-3)', border: `1px solid ${checked ? 'var(--success)' : 'var(--border)'}`, cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0 }}>
    <div style={{ position: 'absolute', top: 2, width: 18, height: 18, borderRadius: '50%', background: 'white', left: checked ? 22 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
  </div>
)

const MenuPage = () => {
  const { restaurantId } = useAuthStore()
  const qc = useQueryClient()
  const [localItems, setLocalItems] = useState(DEMO_MENU.items)

  // const { data } = useQuery({
  //   queryKey: ['menu-manage', restaurantId],
  //   queryFn: () => axios.get(`/api/menu/${restaurantId}`).then(r => r.data),
  //   enabled: !!restaurantId,
  //   onSuccess: (d: any) => { if (d.items?.length) setLocalItems(d.items) }
  // } as any)

  // const items = (data?.items?.length ? data.items : localItems)
  // const categories = data?.categories?.length ? data.categories : DEMO_MENU.categories
  const { data } = useQuery<{ items: any[]; categories: any[] }>({
    queryKey: ['menu-manage', restaurantId],
    queryFn: () => axios.get(`/api/menu/${restaurantId}`).then(r => r.data),
    enabled: !!restaurantId,
  })

  const items = data?.items?.length ? data.items : localItems
  const categories = data?.categories?.length ? data.categories : DEMO_MENU.categories

  const toggle = async (id: string) => {
    setLocalItems(prev => prev.map(i => i._id === id ? { ...i, isAvailable: !i.isAvailable } : i))
    try { await axios.patch(`/api/menu/items/${id}/toggle`) } catch {}
    qc.invalidateQueries({ queryKey: ['menu-manage'] })
  }

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Menu</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Manage items and availability</p>
        </div>
        <button className="btn btn-primary" style={{ gap: 6, display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 16 }}>+</span> Add Item
        </button>
      </div>

      {categories.map((cat: any) => {
        const catItems = items.filter((i: any) => i.categoryId === cat._id)
        if (!catItems.length) return null
        return (
          <div key={cat._id} style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{cat.name}</h3>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {catItems.map((item: any, i: number, arr: any[]) => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', opacity: item.isAvailable ? 1 : 0.5, transition: 'opacity 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 1 }}>{item.name}</p>
                      {!item.isAvailable && <p style={{ fontSize: 11, color: 'var(--error)' }}>Out of stock</p>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontFamily: 'Syne', fontWeight: 800, color: 'var(--primary)' }}>${item.price.toFixed(2)}</span>
                    <Toggle checked={item.isAvailable} onChange={() => toggle(item._id)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MenuPage

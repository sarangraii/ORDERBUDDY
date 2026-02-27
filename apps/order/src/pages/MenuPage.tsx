import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useCartStore } from '../store/cartStore'
import { getMenu } from '../services/api'
import type { MenuItem } from '../types'

const DEMO = {
  categories: [
    { _id: 'starters', name: 'Starters', sortOrder: 1, restaurantId: 'demo', isActive: true },
    { _id: 'mains', name: 'Mains', sortOrder: 2, restaurantId: 'demo', isActive: true },
    { _id: 'desserts', name: 'Desserts', sortOrder: 3, restaurantId: 'demo', isActive: true },
    { _id: 'drinks', name: 'Drinks', sortOrder: 4, restaurantId: 'demo', isActive: true },
  ],
  items: [
    { _id: '1', categoryId: 'starters', name: 'Crispy Calamari', description: 'Lightly battered squid rings with marinara dip', price: 8.99, isAvailable: true, tags: ['popular'], restaurantId: 'demo', allergens: [], options: [], image: '' },
    { _id: '2', categoryId: 'starters', name: 'Bruschetta', description: 'Grilled bread with tomato, garlic and fresh basil', price: 6.99, isAvailable: true, tags: [], restaurantId: 'demo', allergens: [], options: [], image: '' },
    { _id: '3', categoryId: 'mains', name: 'Grilled Salmon', description: 'Atlantic salmon with lemon butter sauce and seasonal veg', price: 22.99, isAvailable: true, tags: ['popular', 'healthy'], restaurantId: 'demo', allergens: [], options: [], image: '' },
    { _id: '4', categoryId: 'mains', name: 'Beef Burger', description: 'Half pound Angus beef, cheddar, lettuce, tomato', price: 16.99, isAvailable: true, tags: ['popular'], restaurantId: 'demo', allergens: [], options: [], image: '' },
    { _id: '5', categoryId: 'mains', name: 'Pasta Carbonara', description: 'Spaghetti, pancetta, egg, pecorino romano', price: 14.99, isAvailable: true, tags: [], restaurantId: 'demo', allergens: [], options: [], image: '' },
    { _id: '6', categoryId: 'mains', name: 'Margherita Pizza', description: 'San Marzano tomatoes, fresh mozzarella, basil', price: 13.99, isAvailable: false, tags: [], restaurantId: 'demo', allergens: [], options: [], image: '' },
    { _id: '7', categoryId: 'desserts', name: 'Tiramisu', description: 'Classic Italian dessert with mascarpone and espresso', price: 7.99, isAvailable: true, tags: [], restaurantId: 'demo', allergens: [], options: [], image: '' },
    { _id: '8', categoryId: 'desserts', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with liquid center', price: 8.99, isAvailable: true, tags: ['popular'], restaurantId: 'demo', allergens: [], options: [], image: '' },
    { _id: '9', categoryId: 'drinks', name: 'Fresh Lemonade', description: 'House-made with fresh lemons and mint', price: 4.99, isAvailable: true, tags: [], restaurantId: 'demo', allergens: [], options: [], image: '' },
    { _id: '10', categoryId: 'drinks', name: 'Iced Coffee', description: 'Cold brew with oat milk and vanilla', price: 5.49, isAvailable: true, tags: ['popular'], restaurantId: 'demo', allergens: [], options: [], image: '' },
  ] as MenuItem[]
}

const MenuItemCard = ({ item, onAdd }: { item: MenuItem; onAdd: () => void }) => (
  <div className="card fade-up" style={{ marginBottom: 10, opacity: item.isAvailable ? 1 : 0.45, display: 'flex', gap: 12 }}>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 4, alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif' }}>{item.name}</span>
        {item.tags?.includes('popular') && <span className="badge" style={{ background: '#FF6B3518', color: 'var(--primary)', fontSize: 10 }}>🔥 Popular</span>}
        {item.tags?.includes('healthy') && <span className="badge" style={{ background: '#22C55E18', color: '#4ADE80', fontSize: 10 }}>🥗 Healthy</span>}
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.4, marginBottom: 10 }}>{item.description}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--primary)', fontFamily: 'Syne, sans-serif' }}>${item.price.toFixed(2)}</span>
        {item.isAvailable
          ? <button onClick={onAdd} style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--primary)', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s' }} onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.9)')} onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}>+</button>
          : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Unavailable</span>
        }
      </div>
    </div>
  </div>
)

const MenuPage = () => {
  const navigate = useNavigate()
  const { restaurantId, addItem, getCount } = useCartStore()
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => getMenu(restaurantId!),
    enabled: !!restaurantId && restaurantId !== 'demo',
    placeholderData: DEMO
  })

  const { categories, items } = (restaurantId === 'demo' ? DEMO : data) ?? DEMO

  const filtered = items.filter(i => {
    const s = search.toLowerCase()
    return (!s || i.name.toLowerCase().includes(s) || i.description.toLowerCase().includes(s))
      && (!activeCat || i.categoryId === activeCat)
  })

  const count = getCount()

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20 }}>🍽 Menu</h1>
        {count > 0 && (
          <button onClick={() => navigate('/cart')} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 10, padding: '8px 16px', fontWeight: 700, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            🛒 {count} · ${useCartStore.getState().getTotal().toFixed(2)}
          </button>
        )}
      </div>

      <div style={{ padding: '12px 16px' }}>
        {/* Search */}
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search menu..."
          style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', marginBottom: 12 }}
        />

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
          {[{ _id: null, name: 'All' }, ...categories].map((c: any) => (
            <button key={c._id ?? 'all'} onClick={() => setActiveCat(c._id)}
              style={{ whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.15s', background: activeCat === c._id ? 'var(--primary)' : 'var(--surface)', color: activeCat === c._id ? 'white' : 'var(--text-muted)' }}
            >{c.name}</button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>Loading menu...</div>}

        {/* Items grouped by category */}
        {categories.filter(c => !activeCat || c._id === activeCat).map(cat => {
          const catItems = filtered.filter(i => i.categoryId === cat._id)
          if (!catItems.length) return null
          return (
            <div key={cat._id} style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, marginBottom: 12, letterSpacing: '-0.3px' }}>{cat.name}</h2>
              {catItems.map(item => (
                <MenuItemCard key={item._id} item={item} onAdd={() => addItem(item)} />
              ))}
            </div>
          )
        })}
        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}

export default MenuPage

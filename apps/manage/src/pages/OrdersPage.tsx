import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { io } from 'socket.io-client'

type Status = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

const DEMO_ORDERS = [
  { _id: 'o1', tableNumber: '3', orderType: 'table', status: 'preparing' as Status, total: 30.98, createdAt: new Date(Date.now() - 5 * 60000).toISOString(), items: [{ name: 'Grilled Salmon', quantity: 1 }, { name: 'Tiramisu', quantity: 1 }] },
  { _id: 'o2', tableNumber: '7', orderType: 'table', status: 'confirmed' as Status, total: 38.47, createdAt: new Date(Date.now() - 8 * 60000).toISOString(), items: [{ name: 'Beef Burger', quantity: 2 }, { name: 'Lemonade', quantity: 1 }] },
  { _id: 'o3', tableNumber: '1', orderType: 'table', status: 'ready' as Status, total: 18.48, createdAt: new Date(Date.now() - 14 * 60000).toISOString(), items: [{ name: 'Pasta Carbonara', quantity: 1 }] },
  { _id: 'o4', tableNumber: '5', orderType: 'table', status: 'pending' as Status, total: 22.97, createdAt: new Date(Date.now() - 2 * 60000).toISOString(), items: [{ name: 'Calamari', quantity: 1 }, { name: 'Iced Coffee', quantity: 2 }] },
]

const NEXT: Partial<Record<Status, Status>> = {
  pending: 'confirmed', confirmed: 'preparing', preparing: 'ready', ready: 'delivered'
}

const BADGE: Record<Status, string> = {
  pending: 'badge-pending', confirmed: 'badge-confirmed', preparing: 'badge-preparing',
  ready: 'badge-ready', delivered: 'badge-delivered', cancelled: 'badge-cancelled'
}

const NEXT_LABEL: Partial<Record<Status, string>> = {
  pending: 'Accept', confirmed: 'Start Prep', preparing: 'Mark Ready', ready: 'Mark Delivered'
}

const OrdersPage = () => {
  const { restaurantId } = useAuthStore()
  const [orders, setOrders] = useState(DEMO_ORDERS)
  const [filter, setFilter] = useState<string>('active')

  useEffect(() => {
    if (!restaurantId) return
    axios.get(`/api/orders?restaurantId=${restaurantId}`)
      .then(r => { if (r.data.length) setOrders(r.data) })
      .catch(() => {})

    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const socket = io(socketUrl, { transports: ['websocket', 'polling'] })
    socket.emit('join:restaurant', restaurantId)
    socket.on('order:new', (order: any) => setOrders(prev => [order, ...prev]))
    socket.on('order:updated', (updated: any) => setOrders(prev => prev.map(o => o._id === updated._id ? updated : o)))
    return () => { socket.disconnect() }
  }, [restaurantId])

  const advance = async (id: string, current: Status) => {
    const next = NEXT[current]
    if (!next) return
    try {
      await axios.patch(`/api/orders/${id}/status`, { status: next })
    } catch {
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: next } : o))
    }
  }

  const FILTERS = [
    { key: 'active', label: 'Active', count: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length },
    { key: 'all', label: 'All', count: orders.length },
    { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { key: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { key: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
  ]

  const filtered = orders.filter(o => {
    if (filter === 'all') return true
    if (filter === 'active') return !['delivered', 'cancelled'].includes(o.status)
    return o.status === filter
  })

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Orders</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Manage and route incoming orders in real-time</p>
      </div>

      {/* Filter tabs - added overflowX scroll for mobile */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: filter === f.key ? 'var(--primary)' : 'var(--surface)',
            color: filter === f.key ? 'white' : 'var(--text-muted)',
            fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
            whiteSpace: 'nowrap', flexShrink: 0
          }}>
            {f.label}
            {f.count > 0 && <span style={{ background: filter === f.key ? 'rgba(255,255,255,0.25)' : 'var(--surface-3)', borderRadius: 999, padding: '1px 7px', fontSize: 11 }}>{f.count}</span>}
          </button>
        ))}
      </div>

      {/* Orders grid - added className="orders-grid" */}
      <div className="orders-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {filtered.map(order => (
          <div key={order._id} className="card fade-up" style={{ borderLeft: order.status === 'pending' ? '3px solid var(--primary)' : '3px solid transparent' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, marginBottom: 2 }}>
                  Table {order.tableNumber}
                  <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 12, marginLeft: 6 }}>#{order._id.slice(-4).toUpperCase()}</span>
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000)} min ago</p>
              </div>
              <span className={`badge ${BADGE[order.status]}`}>{order.status}</span>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginBottom: 12 }}>
              {order.items.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                  <span>{item.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>×{item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Syne', fontWeight: 800, color: 'var(--primary)' }}>${order.total.toFixed(2)}</span>
              {NEXT[order.status] && (
                <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 12 }} onClick={() => advance(order._id, order.status)}>
                  {NEXT_LABEL[order.status]} →
                </button>
              )}
              {order.status === 'delivered' && <span style={{ color: 'var(--success)', fontSize: 13, fontWeight: 600 }}>✓ Done</span>}
            </div>
          </div>
        ))}
        {!filtered.length && <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', padding: '32px 0', textAlign: 'center' }}>No orders found</p>}
      </div>
    </div>
  )
}

export default OrdersPage
import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { io } from 'socket.io-client'

const STATS = [
  { label: 'Active Orders', value: '8', icon: '🟢', sub: '+2 from last hour' },
  { label: "Today's Revenue", value: '$1,284', icon: '💰', sub: '+12% vs yesterday' },
  { label: 'Orders Today', value: '47', icon: '🧾', sub: '5 pending' },
  { label: 'Avg Prep Time', value: '14 min', icon: '⏱', sub: '-2 min vs last week' },
]

const RECENT = [
  { id: 'ORD-047', table: '3', items: 'Grilled Salmon, Tiramisu', status: 'preparing', time: '2 min ago', total: '$30.98' },
  { id: 'ORD-046', table: '7', items: 'Beef Burger ×2, Lemonade', status: 'confirmed', time: '5 min ago', total: '$38.47' },
  { id: 'ORD-045', table: '1', items: 'Pasta Carbonara, Water', status: 'ready', time: '8 min ago', total: '$18.48' },
  { id: 'ORD-044', table: '5', items: 'Calamari, Pizza, Drinks', status: 'delivered', time: '22 min ago', total: '$52.45' },
]

const BADGE: Record<string, string> = {
  pending: 'badge-pending', confirmed: 'badge-confirmed',
  preparing: 'badge-preparing', ready: 'badge-ready', delivered: 'badge-delivered'
}

const DashboardPage = () => {
  const restaurantId = useAuthStore(s => s.restaurantId)
  const [newOrders, setNewOrders] = useState(0)

  useEffect(() => {
    if (!restaurantId) return
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const socket = io(socketUrl, { transports: ['websocket', 'polling'] })
    socket.emit('join:restaurant', restaurantId)
    socket.on('order:new', () => setNewOrders(n => n + 1))
    return () => { socket.disconnect() }
  }, [restaurantId])

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Live restaurant overview</p>
        </div>
        {newOrders > 0 && (
          <div style={{ background: 'var(--primary)', color: 'white', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }} onClick={() => setNewOrders(0)}>
            🔔 {newOrders} new order{newOrders > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Stats - added className="stats-grid" */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {STATS.map(s => (
          <div key={s.label} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
            </div>
            <p style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>{s.value}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent orders - added table-wrap div */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ fontWeight: 800, fontSize: 17 }}>Recent Orders</h2>
          <a href="/orders" style={{ color: 'var(--primary)', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>View all →</a>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['Order', 'Table', 'Items', 'Status', 'Time', 'Total'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {RECENT.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700 }}>{o.id}</td>
                  <td style={{ color: 'var(--text-muted)' }}>Table {o.table}</td>
                  <td style={{ color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.items}</td>
                  <td><span className={`badge ${BADGE[o.status]}`}>{o.status}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{o.time}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{o.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
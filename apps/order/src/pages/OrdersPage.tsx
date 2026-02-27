import { useNavigate } from 'react-router-dom'
import type { OrderStatus } from '../types'

const DEMO_ORDERS = [
  { _id: 'demo-1', status: 'preparing' as OrderStatus, total: 45.97, createdAt: new Date(Date.now() - 10 * 60000).toISOString(), items: [{ name: 'Grilled Salmon' }, { name: 'Tiramisu' }] },
  { _id: 'demo-2', status: 'delivered' as OrderStatus, total: 28.48, createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), items: [{ name: 'Beef Burger' }, { name: 'Lemonade' }] },
]

const BADGE: Record<OrderStatus, string> = {
  pending: 'badge-pending', confirmed: 'badge-confirmed', preparing: 'badge-preparing',
  ready: 'badge-ready', delivered: 'badge-delivered', cancelled: 'badge-cancelled'
}

const OrdersPage = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className="page-header">
        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20 }}>📋 My Orders</h1>
      </div>
      <div style={{ padding: 16 }}>
        {DEMO_ORDERS.length === 0
          ? <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}><div style={{ fontSize: 48 }}>📭</div><p style={{ marginTop: 12 }}>No orders yet</p></div>
          : DEMO_ORDERS.map(order => (
            <div key={order._id} className="card fade-up" style={{ marginBottom: 10, cursor: 'pointer' }} onClick={() => navigate(`/track/${order._id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15 }}>Order #{order._id.slice(-4).toUpperCase()}</span>
                <span className={`badge ${BADGE[order.status]}`}>{order.status}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 6 }}>{order.items.map((i: any) => i.name).join(', ')}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'Syne' }}>${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default OrdersPage

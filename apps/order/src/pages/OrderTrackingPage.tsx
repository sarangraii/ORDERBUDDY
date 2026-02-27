import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getOrder } from '../services/api'
import { joinOrderRoom, onOrderUpdate } from '../services/socket'
import type { Order, OrderStatus } from '../types'

const STEPS: { status: OrderStatus; label: string; icon: string; desc: string }[] = [
  { status: 'pending', label: 'Order Received', icon: '📋', desc: 'Your order is being reviewed' },
  { status: 'confirmed', label: 'Confirmed', icon: '✅', desc: 'Kitchen has your order' },
  { status: 'preparing', label: 'Preparing', icon: '👨‍🍳', desc: 'Your food is being prepared' },
  { status: 'ready', label: 'Ready!', icon: '🔔', desc: 'Your order is ready to serve' },
  { status: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Enjoy your meal!' },
]

const DEMO_ORDER: Order = {
  _id: 'demo', restaurantId: 'demo', tableNumber: '5', orderType: 'table',
  status: 'preparing', items: [], subtotal: 30, tax: 3, total: 33,
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  estimatedReadyAt: new Date(Date.now() + 12 * 60000).toISOString(),
  statusHistory: [
    { status: 'pending', timestamp: new Date(Date.now() - 8 * 60000).toISOString() },
    { status: 'confirmed', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
    { status: 'preparing', timestamp: new Date(Date.now() - 2 * 60000).toISOString() },
  ]
}

const OrderTrackingPage = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const isDemo = orderId?.startsWith('demo')
  const [liveOrder, setLiveOrder] = useState<Order | null>(null)

  const { data: fetchedOrder } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId!),
    enabled: !!orderId && !isDemo,
    refetchInterval: 15000,
  })

  const order = liveOrder || fetchedOrder || (isDemo ? DEMO_ORDER : null)

  // Real-time updates via Socket.io
  useEffect(() => {
    if (!orderId || isDemo) return
    joinOrderRoom(orderId)
    const unsub = onOrderUpdate((updated) => {
      if (updated._id === orderId) setLiveOrder(updated)
    })
    return unsub
  }, [orderId, isDemo])

  if (!order) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: 'var(--text-muted)' }}>Loading order...</p>
    </div>
  )

  const currentIdx = STEPS.findIndex(s => s.status === order.status)
  const minutesLeft = order.estimatedReadyAt
    ? Math.max(0, Math.round((new Date(order.estimatedReadyAt).getTime() - Date.now()) / 60000))
    : null

  return (
    <div style={{ padding: 24, minHeight: '100vh' }}>
      {/* Back */}
      <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
        ← My Orders
      </button>

      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 4 }}>Order #{String(orderId).slice(-8).toUpperCase()}</p>
      {order.tableNumber && <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>🪑 Table {order.tableNumber}</p>}

      {/* Big status */}
      <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeUp 0.4s ease' }}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>{STEPS[currentIdx]?.icon}</div>
        <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{STEPS[currentIdx]?.label}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{STEPS[currentIdx]?.desc}</p>
        {minutesLeft !== null && order.status === 'preparing' && (
          <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--surface)', padding: '8px 16px', borderRadius: 999, border: '1px solid var(--border)' }}>
            <span className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>~{minutesLeft} min remaining</span>
          </div>
        )}
      </div>

      {/* Progress steps */}
      <div style={{ maxWidth: 320, margin: '0 auto' }}>
        {STEPS.map((step, i) => {
          const done = i < currentIdx
          const active = i === currentIdx
          const future = i > currentIdx
          return (
            <div key={step.status} style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  background: done ? 'var(--primary)' : active ? 'var(--primary)' : 'var(--surface)',
                  border: `2px solid ${done || active ? 'var(--primary)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, opacity: future ? 0.35 : 1,
                  boxShadow: active ? '0 0 16px rgba(255,107,53,0.4)' : 'none',
                  transition: 'all 0.3s'
                }}>
                  {done ? '✓' : step.icon}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 2, height: 32, background: done ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }} />
                )}
              </div>
              <div style={{ paddingTop: 10, paddingBottom: 24, opacity: future ? 0.35 : 1 }}>
                <p style={{ fontFamily: 'Syne', fontWeight: active ? 800 : 600, fontSize: active ? 16 : 14, color: active ? 'var(--text)' : 'var(--text-muted)', marginBottom: 2 }}>{step.label}</p>
                {active && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{step.desc}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderTrackingPage

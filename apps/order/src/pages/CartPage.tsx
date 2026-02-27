import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useCartStore } from '../store/cartStore'
import { createOrder } from '../services/api'

const CartPage = () => {
  const navigate = useNavigate()
  const { items, restaurantId, tableNumber, updateQty, removeItem, clearCart, getTotal } = useCartStore()
  const [notes, setNotes] = useState('')

  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: () => createOrder({ restaurantId: restaurantId!, tableNumber: tableNumber || undefined, items, specialInstructions: notes }),
    onSuccess: (order) => { clearCart(); navigate(`/track/${order._id}`) },
    onError: () => {
      const fakeId = 'demo-' + Date.now()
      clearCart()
      navigate(`/track/${fakeId}`)
    }
  })

  if (!items.length) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16, padding: 24 }}>
      <span style={{ fontSize: 64 }}>🛒</span>
      <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>Your cart is empty</p>
      <button className="btn btn-primary" style={{ width: 'auto', padding: '12px 32px' }} onClick={() => navigate('/menu')}>Browse Menu</button>
    </div>
  )

  const subtotal = getTotal()
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <div>
      <div className="page-header">
        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20 }}>🛒 Cart</h1>
        {tableNumber && <span style={{ background: 'var(--surface-2)', padding: '6px 12px', borderRadius: 8, fontSize: 13, color: 'var(--text-soft)' }}>Table {tableNumber}</span>}
      </div>

      <div style={{ padding: 16 }}>
        {/* Items */}
        {items.map(item => (
          <div key={item.menuItem._id} className="card fade-up" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <p style={{ fontWeight: 700, fontFamily: 'Syne', marginBottom: 2 }}>{item.menuItem.name}</p>
                <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 16 }}>${item.subtotal.toFixed(2)}</p>
              </div>
              <button onClick={() => removeItem(item.menuItem._id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => updateQty(item.menuItem._id, item.quantity - 1)} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center', fontSize: 16 }}>{item.quantity}</span>
              <button onClick={() => updateQty(item.menuItem._id, item.quantity + 1)} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary)', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
          </div>
        ))}

        {/* Notes */}
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Special instructions or allergies..." rows={3}
          style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, color: 'var(--text)', fontSize: 14, resize: 'none', outline: 'none', marginBottom: 16 }} />

        {/* Summary */}
        <div className="card" style={{ marginBottom: 16 }}>
          {[['Subtotal', `$${subtotal.toFixed(2)}`], ['Tax (10%)', `$${tax.toFixed(2)}`]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'var(--text-muted)', fontSize: 14 }}>
              <span>{k}</span><span>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 800, fontSize: 17, fontFamily: 'Syne' }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--primary)', fontFamily: 'Syne' }}>${total.toFixed(2)}</span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => placeOrder()} disabled={isPending}>
          {isPending ? '⏳ Placing Order...' : `Place Order · $${total.toFixed(2)}`}
        </button>
        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}

export default CartPage

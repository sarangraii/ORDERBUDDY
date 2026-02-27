import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'

const QRScanPage = () => {
  const navigate = useNavigate()
  const setQRData = useCartStore(s => s.setQRData)
  const [restaurantId, setRestaurantId] = useState('')
  const [tableNum, setTableNum] = useState('')

  const handleGo = (rid: string, table?: string) => {
    setQRData({ restaurantId: rid, tableNumber: table })
    navigate('/menu')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeUp 0.5s ease' }}>
        <div style={{
          width: 88, height: 88, borderRadius: 24, background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44, margin: '0 auto 20px',
          boxShadow: '0 0 40px rgba(255,107,53,0.3)'
        }}>🍽</div>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 8 }}>OrderBuddy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Scan a QR code to start ordering</p>
      </div>

      {/* QR placeholder */}
      <div style={{
        width: '100%', maxWidth: 340,
        background: 'var(--surface)', border: '2px dashed var(--border)',
        borderRadius: 24, padding: '48px 24px', textAlign: 'center', marginBottom: 32,
        cursor: 'pointer', transition: 'border-color 0.2s'
      }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <div style={{ fontSize: 56, marginBottom: 12 }}>📷</div>
        <p style={{ color: 'var(--text-soft)', fontSize: 14 }}>Tap to scan QR code</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>Camera permission required</p>
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 340, gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>or enter manually</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* Manual */}
      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          value={restaurantId}
          onChange={e => setRestaurantId(e.target.value)}
          placeholder="Restaurant ID"
          style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
            padding: '14px 16px', color: 'var(--text)', fontSize: 15, outline: 'none', width: '100%'
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
        <input
          value={tableNum}
          onChange={e => setTableNum(e.target.value)}
          placeholder="Table number (optional)"
          style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
            padding: '14px 16px', color: 'var(--text)', fontSize: 15, outline: 'none', width: '100%'
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
        <button className="btn btn-primary" onClick={() => handleGo(restaurantId || 'demo', tableNum || undefined)}>
          View Menu →
        </button>
        <button className="btn btn-outline" onClick={() => handleGo('demo', '5')} style={{ border: '1px solid var(--border)' }}>
          Try Demo Restaurant
        </button>
      </div>
    </div>
  )
}

export default QRScanPage

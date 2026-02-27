import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useCartStore } from './store/cartStore'
import QRScanPage from './pages/QRScanPage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import OrderTrackingPage from './pages/OrderTrackingPage'

const TABS = [
  { path: '/menu', icon: '🍽', label: 'Menu' },
  { path: '/cart', icon: '🛒', label: 'Cart' },
  { path: '/orders', icon: '📋', label: 'Orders' },
]

const TabBar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const count = useCartStore(s => s.getCount())
  const hide = pathname === '/scan' || pathname.startsWith('/track')
  if (hide) return null

  return (
    <nav className="tab-bar">
      {TABS.map(t => (
        <button
          key={t.path}
          className={`tab-btn ${pathname === t.path ? 'active' : ''}`}
          onClick={() => navigate(t.path)}
        >
          <span className="icon" style={{ position: 'relative' }}>
            {t.icon}
            {t.path === '/cart' && count > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -8,
                background: 'var(--primary)', color: 'white',
                borderRadius: '50%', width: 18, height: 18,
                fontSize: 10, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{count}</span>
            )}
          </span>
          <span className="label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 64 }}>
      <Routes>
        <Route path="/scan" element={<QRScanPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/track/:orderId" element={<OrderTrackingPage />} />
        <Route path="*" element={<Navigate to="/scan" replace />} />
      </Routes>
      <TabBar />
    </div>
  </BrowserRouter>
)

export default App

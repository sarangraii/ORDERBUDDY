import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const NAV = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/orders', icon: '🧾', label: 'Orders' },
  { path: '/menu', icon: '🍽', label: 'Menu' },
]

const Sidebar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, logout } = useAuthStore()

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, paddingLeft: 4 }}>
        <div style={{ width: 34, height: 34, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🍽</div>
        <div>
          <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>OrderBuddy</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Manage</p>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {NAV.map(item => (
          <button key={item.path} className={`nav-btn ${pathname.startsWith(item.path) ? 'active' : ''}`} onClick={() => navigate(item.path)}>
            <span style={{ fontSize: 17 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
        <div style={{ paddingLeft: 4, marginBottom: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{user?.name || 'Manager'}</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</p>
        </div>
        <button className="nav-btn" onClick={() => { logout(); navigate('/login') }}>
          <span style={{ fontSize: 15 }}>🚪</span> Sign out
        </button>
      </div>
    </div>
  )
}

export default Sidebar

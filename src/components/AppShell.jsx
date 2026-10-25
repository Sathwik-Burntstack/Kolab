import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icon'
import { Avatar } from './ui'
import { api } from '../services/api'
import NotificationsPanel from '../overlays/NotificationsPanel'

const NAV = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/jobs', label: 'Find jobs', icon: 'search' },
  { to: '/bids', label: 'My bids', icon: 'bids', count: 'bids' },
  { to: '/active', label: 'Active jobs', icon: 'briefcase', count: 'activeJobs' },
  { to: '/earnings', label: 'Earnings', icon: 'wallet' },
  { to: '/messages', label: 'Messages', icon: 'message', count: 'messages' },
  { to: '/profile', label: 'Profile', icon: 'user' },
]
const MOBILE_NAV = [NAV[0], NAV[1], NAV[2], NAV[3], { to: '/more', label: 'More', icon: 'more' }]

export default function AppShell() {
  const [me, setMe] = useState(null)
  const [showNotes, setShowNotes] = useState(false)
  const [unread, setUnread] = useState(true)
  const loc = useLocation()
  const nav = useNavigate()

  useEffect(() => { api.getMe().then(setMe) }, [])
  useEffect(() => { window.scrollTo({ top: 0 }) }, [loc.pathname])
  useEffect(() => {
    const open = () => setShowNotes(true)
    window.addEventListener('kolab:notifications', open)
    return () => window.removeEventListener('kolab:notifications', open)
  }, [])

  const counts = me?.counts || {}
  return (
    <div className="shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="sidebar__top">
          <div className="wordmark">kolab<i /></div>
          <button className="iconbtn" aria-label="Notifications" onClick={() => setShowNotes(true)}>
            <Icon name="bell" />{unread && <span className="dot" />}
          </button>
        </div>
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav ${isActive ? 'active' : ''}`}>
            <Icon name={n.icon} />
            <span className="lbl">{n.label}</span>
            {n.count && counts[n.count] ? <span className="count">{counts[n.count]}</span> : null}
          </NavLink>
        ))}
        <div className="sidebar__spacer" />
        <NavLink to="/help" className={({ isActive }) => `nav ${isActive ? 'active' : ''}`}><Icon name="help" /><span className="lbl">Help</span></NavLink>
        <button className="account" onClick={() => nav('/profile')}>
          <Avatar initials={me?.initials || 'AK'} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="acct-name">{me?.name || 'Ananya Kumar'}</div>
            <div className="acct-handle">{me?.handle || '@ananya.eats'}</div>
          </div>
          <Icon name="more" style={{ color: 'var(--text-tertiary)' }} />
        </button>
      </aside>

      <header className="topbar">
        <div className="wordmark">kolab<i /></div>
        <button className="iconbtn" aria-label="Notifications" onClick={() => setShowNotes(true)}>
          <Icon name="bell" size={20} />{unread && <span className="dot" style={{ borderColor: '#fff' }} />}
        </button>
      </header>

      <main className={`main ${loc.pathname.startsWith('/messages') ? 'main--bleed' : ''}`}>
        <div key={loc.pathname} className="page-enter"><Outlet /></div>
      </main>

      <nav className="bottomnav" aria-label="Main navigation">
        {MOBILE_NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `bn ${isActive ? 'active' : ''}`}>
            <Icon name={n.icon} size={22} />
            {n.count && counts[n.count] ? <span className="badge-dot">{counts[n.count]}</span> : null}
            {n.label}
          </NavLink>
        ))}
      </nav>

      {showNotes && <NotificationsPanel onClose={() => { setShowNotes(false); setUnread(false) }} />}
    </div>
  )
}

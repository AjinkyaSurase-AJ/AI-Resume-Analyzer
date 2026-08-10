import React, { useEffect, useState } from 'react'
import { checkHealth } from '@/api'
import { Icon } from '@/components'
import { navByRole } from '@/constants/navigation'
import { cx, initials, titleCase } from '@/utils'

export function AppShell({ session, current, setCurrent, onLogout, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [health, setHealth] = useState('checking')
  useEffect(() => {
    let active = true
    const check = () => checkHealth().then(() => active && setHealth('online')).catch(() => active && setHealth('offline'))
    check()
    const timer = setInterval(check, 60000)
    return () => { active = false; clearInterval(timer) }
  }, [])
  const role = session.user?.role || 'candidate'
  const nav = navByRole[role] || navByRole.candidate
  const active = nav.find((item) => item.id === current) || nav[0]
  return <div className="shell"><aside className={cx('sidebar', mobileOpen && 'sidebar-open')}><div className="sidebar-brand"><span className="brand-mark"><Icon name="analyze" size={21} /></span><div><strong>AI Resume Analyzer</strong><small>Professional Platform</small></div><button className="mobile-close" onClick={() => setMobileOpen(false)}><Icon name="close" /></button></div><div className="workspace-label">{titleCase(role)} workspace</div><nav className="side-nav">{nav.map((item) => <button key={item.id} className={current === item.id ? 'active' : ''} onClick={() => { setCurrent(item.id); setMobileOpen(false) }}><Icon name={item.icon} /><span>{item.label}</span>{current === item.id && <Icon name="chevron" size={15} className="nav-chevron" />}</button>)}</nav><div className="sidebar-bottom"><div className="sidebar-user"><span className="avatar">{initials(session.user?.name)}</span><div><strong>{session.user?.name || 'User'}</strong><small>{session.user?.email}</small></div></div><button className="logout-button" onClick={onLogout}><Icon name="logout" /><span>Sign out</span></button></div></aside>{mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}<main className="workspace"><header className="topbar"><div className="topbar-title"><button className="menu-button" onClick={() => setMobileOpen(true)}><Icon name="menu" /></button><div><span>{titleCase(role)} portal</span><h1>{active.label}</h1></div></div><div className="topbar-actions"><div className={cx('api-status', health)}><i /><span>{health === 'online' ? 'API connected' : health === 'offline' ? 'API offline' : 'Checking API'}</span></div><button className="icon-button" aria-label="Notifications"><Icon name="bell" /></button><span className="top-avatar">{initials(session.user?.name)}</span></div></header><div className="workspace-content">{children}</div></main></div>
}


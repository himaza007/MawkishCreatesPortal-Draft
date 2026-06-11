import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CheckSquare, Calendar, Megaphone,
  GitBranch, BookOpen, LogOut
} from 'lucide-react'
import { api } from '../lib/api'
import type { User } from '../types'
import styles from './Sidebar.module.css'

const NAV = [
  { section: 'MAIN', items: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
  ]},
  { section: 'TEAM', items: [
    { to: '/announcements', label: 'Announcements', icon: Megaphone },
    { to: '/pipelines', label: 'Pipelines', icon: GitBranch },
    { to: '/resources', label: 'Resources', icon: BookOpen },
  ]},
]

interface Props { user: User }

export default function Sidebar({ user }: Props) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await api.auth.logout()
    navigate('/')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img
          src="/logo.png"
          alt="Mawkish Creates"
          className={styles.logoImg}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('style') }}
        />
        <div className={styles.logoFallback} style={{ display: 'none' }}>
          <div className={styles.logoMark}>M</div>
          <span className={styles.logoText}>Mawkish <em>Creates</em></span>
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV.map(group => (
          <div key={group.section}>
            <div className={styles.sectionLabel}>{group.section}</div>
            {group.items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <Icon size={17} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.bottom}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>{user.avatar || user.name.slice(0, 2).toUpperCase()}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userRole}>{user.department || user.role}</div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Sign out">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}

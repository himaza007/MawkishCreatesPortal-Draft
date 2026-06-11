import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import type { User } from '../types'
import styles from './Layout.module.css'

interface Props { user: User }

export default function Layout({ user }: Props) {
  return (
    <div className={styles.shell}>
      <Sidebar user={user} />
      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  )
}

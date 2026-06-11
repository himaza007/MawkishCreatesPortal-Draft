import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { api } from './lib/api'
import { UserContext } from './lib/userContext'
import type { User } from './types'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import CalendarPage from './pages/CalendarPage'
import Announcements from './pages/Announcements'
import Pipelines from './pages/Pipelines'
import Resources from './pages/Resources'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.auth.me()
      .then(d => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--purple-950)', color: 'rgba(191,160,251,0.6)', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
      Loading…
    </div>
  )

  return (
    <UserContext.Provider value={user}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login onLogin={setUser} />} />
          {user ? (
            <Route element={<Layout user={user} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/pipelines" element={<Pipelines />} />
              <Route path="/resources" element={<Resources />} />
            </Route>
          ) : null}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

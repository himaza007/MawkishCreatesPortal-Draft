import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import type { User } from '../types'
import styles from './Login.module.css'

interface Props { onLogin: (user: User) => void }

export default function Login({ onLogin }: Props) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setError(''); setLoading(true)
    try {
      const data = await api.auth.login(email, password)
      onLogin(data.user)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('401')) setError('Invalid credentials. Please try again.')
      else if (msg.includes('fetch') || msg.includes('Network') || msg.includes('500')) setError(`Server unreachable — make sure the backend is running. (${msg})`)
      else setError(`Error: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
        <img src="/logo.webp" alt="Mawkish Creates" className={styles.logo} />
        <div className={styles.brand}>
          <h1 className={styles.headline}>Your team,<br /><span>one place.</span></h1>
          <p className={styles.subline}>The internal hub for tasks, pipelines, resources, and everything in between.</p>
        </div>
        <ul className={styles.features}>
          {['Task & project tracking', 'Team announcements & notices', 'Client pipeline management', 'Shared resources & templates', 'Calendar & important dates'].map(f => (
            <li key={f} className={styles.feature}><span className={styles.dot} />{f}</li>
          ))}
        </ul>
      </div>

      <div className={styles.right}>
        <h2 className={styles.formTitle}>Welcome back</h2>
        <p className={styles.formSub}>Sign in to your portal account</p>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@mawkishcreates.com" className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className={styles.input} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        <button className={styles.loginBtn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        {error && <div className={styles.error}>{error}</div>}

        <p className={styles.footer}>Internal use only · <span>Mawkish Creates</span> © 2026</p>
      </div>
    </div>
  )
}
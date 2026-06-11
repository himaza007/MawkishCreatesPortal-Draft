import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    try {
      await api.auth.login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid credentials. Please try again.')
    }
  }

  // For testing — bypass login
  const handleBypass = () => navigate('/dashboard')

  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <div className={styles.logoRow}>
            <div className={styles.logoMark}>M</div>
            <span className={styles.logoText}>Mawkish <em>Creates</em></span>
          </div>
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
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@mawkish.com" className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className={styles.input} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        <button className={styles.loginBtn} onClick={handleLogin}>Sign In</button>
        <button className={styles.bypassBtn} onClick={handleBypass}>Enter without credentials (testing)</button>

        {error && <div className={styles.error}>{error}</div>}

        <p className={styles.footer}>Internal use only · <span>Mawkish Creates</span> © 2026</p>
      </div>
    </div>
  )
}

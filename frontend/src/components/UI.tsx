import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import styles from './UI.module.css'

// ---- Topbar ----
interface TopbarProps { title: string; children?: ReactNode }
export function Topbar({ title, children }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <h1 className={styles.pageTitle}>{title}</h1>
      <div className={styles.topbarRight}>{children}</div>
    </header>
  )
}

// ---- Page ----
export function Page({ children }: { children: ReactNode }) {
  return <main className={styles.page}>{children}</main>
}

// ---- Card ----
interface CardProps { children: ReactNode; className?: string }
export function Card({ children, className }: CardProps) {
  return <div className={`${styles.card} ${className || ''}`}>{children}</div>
}

// ---- Button ----
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type BtnSize = 'sm' | 'md' | 'icon'
interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: BtnVariant
  size?: BtnSize
  type?: 'button' | 'submit'
  disabled?: boolean
  title?: string
}
export function Button({ children, onClick, variant = 'primary', size = 'md', type = 'button', disabled, title }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${styles.btn} ${styles[`btn_${variant}`]} ${styles[`btn_${size}`]}`}
    >
      {children}
    </button>
  )
}

// ---- Badge ----
interface BadgeProps { children: ReactNode; variant?: string }
export function Badge({ children, variant = '' }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[`badge_${variant}`] || ''}`}>{children}</span>
}

// ---- Modal ----
interface ModalProps { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  if (!open) return null
  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.modalClose} onClick={onClose}><X size={17} /></button>
        </div>
        <div className={styles.modalBody}>{children}</div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  )
}

// ---- Form Controls ----
interface InputProps {
  label?: string
  id?: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}
export function Input({ label, id, type = 'text', value, onChange, placeholder, required }: InputProps) {
  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.label} htmlFor={id}>{label}</label>}
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} className={styles.input} />
    </div>
  )
}

interface SelectProps {
  label?: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}
export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.label}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} className={styles.input}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

interface TextareaProps {
  label?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}
export function Textarea({ label, value, onChange, placeholder, rows = 3 }: TextareaProps) {
  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${styles.input} ${styles.textarea}`} />
    </div>
  )
}

// ---- Empty State ----
export function EmptyState({ message }: { message: string }) {
  return (
    <div className={styles.emptyState}>
      <p>{message}</p>
    </div>
  )
}

// ---- Grid helpers ----
export function Grid2({ children }: { children: ReactNode }) {
  return <div className={styles.grid2}>{children}</div>
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className={styles.statGrid}>{children}</div>
}

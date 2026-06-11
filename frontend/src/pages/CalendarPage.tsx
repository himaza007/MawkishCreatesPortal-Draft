import { useEffect, useState } from 'react'
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../lib/api'
import type { CalendarEvent } from '../types'
import { Topbar, Page, Card, Button, Badge, Modal, Input, Select, Textarea, Grid2 } from '../components/UI'
import styles from './CalendarPage.module.css'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const empty = (): Partial<CalendarEvent> => ({ title: '', date: '', time: '', type: 'internal', location: '', description: '' })

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<Partial<CalendarEvent>>(empty())
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const load = () => api.events.list().then(setEvents)
  useEffect(() => { load() }, [])

  const changeMonth = (dir: number) => {
    setMonth(m => {
      const next = m + dir
      if (next > 11) { setYear(y => y + 1); return 0 }
      if (next < 0) { setYear(y => y - 1); return 11 }
      return next
    })
  }

  const save = async () => {
    if (!form.title?.trim() || !form.date) return
    await api.events.create(form); setModal(false); setForm(empty()); load()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete event?')) return
    await api.events.delete(id); load()
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const cells: { day: number; current: boolean; dateStr: string }[] = []
  for (let i = 0; i < firstDay; i++) cells.push({ day: daysInPrev - firstDay + i + 1, current: false, dateStr: '' })
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, current: true, dateStr })
  }
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, current: false, dateStr: '' })

  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <>
      <Topbar title="Calendar">
        <Button onClick={() => setModal(true)} size="sm"><Plus size={14} /> Add Event</Button>
      </Topbar>
      <Page>
        <Grid2>
          <Card>
            <div className={styles.calHead}>
              <span className={styles.monthLabel}>{MONTHS[month]} {year}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className={styles.navBtn} onClick={() => changeMonth(-1)}><ChevronLeft size={15} /></button>
                <button className={styles.navBtn} onClick={() => changeMonth(1)}><ChevronRight size={15} /></button>
              </div>
            </div>
            <div className={styles.calGrid}>
              {DAYS.map(d => <div key={d} className={styles.dayHead}>{d}</div>)}
              {cells.map((c, i) => {
                const isToday = c.current && c.day === now.getDate() && month === now.getMonth() && year === now.getFullYear()
                const dayEvents = events.filter(e => e.date === c.dateStr)
                return (
                  <div key={i} className={`${styles.cell} ${!c.current ? styles.other : ''} ${isToday ? styles.today : ''}`}>
                    <div className={`${styles.dayNum} ${isToday ? styles.todayNum : ''}`}>{c.day}</div>
                    {dayEvents.slice(0, 2).map(e => (
                      <div key={e._id} className={`${styles.eventChip} ${styles[e.type]}`}>{e.title}</div>
                    ))}
                    {dayEvents.length > 2 && <div className={styles.more}>+{dayEvents.length - 2}</div>}
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--purple-800)', marginBottom: 14 }}>All Events</div>
            {sorted.length === 0 && <div style={{ color: 'var(--grey-400)', fontSize: '0.83rem', padding: '20px 0', textAlign: 'center' }}>No events yet</div>}
            {sorted.map(e => (
              <div key={e._id} className={styles.eventRow}>
                <div className={styles.dateBadge}>
                  <span className={styles.dateDay}>{new Date(e.date + 'T00:00').getDate()}</span>
                  <span className={styles.dateMon}>{new Date(e.date + 'T00:00').toLocaleDateString('en-GB', { month: 'short' })}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div className={styles.eTitle}>{e.title}</div>
                  <div className={styles.eMeta}>{e.time}{e.location ? ` · ${e.location}` : ''}</div>
                  <Badge variant={e.type}>{e.type}</Badge>
                </div>
                <button className={styles.delBtn} onClick={() => remove(e._id)}><Trash2 size={13} /></button>
              </div>
            ))}
          </Card>
        </Grid2>
      </Page>

      <Modal open={modal} onClose={() => setModal(false)} title="New Event"
        footer={<><Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button><Button onClick={save}>Save Event</Button></>}
      >
        <Input label="Event Title *" value={form.title || ''} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Mawkish Creates | Client Onboarding" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Date *" type="date" value={form.date || ''} onChange={v => setForm(f => ({ ...f, date: v }))} />
          <Input label="Time" type="time" value={form.time || ''} onChange={v => setForm(f => ({ ...f, time: v }))} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Select label="Type" value={form.type || 'internal'} onChange={v => setForm(f => ({ ...f, type: v as CalendarEvent['type'] }))}
            options={[{ value: 'internal', label: 'Internal' }, { value: 'client', label: 'Client' }]} />
          <Input label="Location" value={form.location || ''} onChange={v => setForm(f => ({ ...f, location: v }))} placeholder="e.g. Charles Place" />
        </div>
        <Textarea label="Description" value={form.description || ''} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Brief agenda…" rows={2} />
      </Modal>
    </>
  )
}

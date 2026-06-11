import { useEffect, useState } from 'react'
import { Plus, Trash2, Pin } from 'lucide-react'
import { api } from '../lib/api'
import { useUser, canEdit } from '../lib/userContext'
import type { Announcement } from '../types'
import { Topbar, Page, Card, Button, Badge, Modal, Input, Select, Textarea } from '../components/UI'
import { formatDate } from '../lib/utils'
import styles from './Announcements.module.css'

const empty = (): Partial<Announcement> => ({ title: '', content: '', priority: 'medium', pinned: false })

export default function Announcements() {
  const user = useUser()
  const editor = canEdit(user)
  const [items, setItems] = useState<Announcement[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<Partial<Announcement>>(empty())
  const [filter, setFilter] = useState('all')

  const load = () => api.announcements.list().then(setItems)
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.title?.trim() || !form.content?.trim()) return
    await api.announcements.create(form)
    setModal(false); setForm(empty()); load()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    await api.announcements.delete(id); load()
  }

  const filtered = items.filter(a =>
    filter === 'all' ? true : filter === 'pinned' ? a.pinned : a.priority === filter
  )

  return (
    <>
      <Topbar title="Announcements">
        {editor && <Button onClick={() => setModal(true)} size="sm"><Plus size={14} /> New</Button>}
      </Topbar>
      <Page>
        <div className={styles.filters}>
          {[['all','All'],['high','High Priority'],['pinned','Pinned']].map(([v, l]) => (
            <button key={v} className={`${styles.filterBtn} ${filter === v ? styles.active : ''}`} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>
        <div className={styles.list}>
          {filtered.length === 0 && <div className={styles.empty}>No announcements</div>}
          {filtered.map(a => (
            <Card key={a._id} className={`${styles.annCard} ${a.pinned ? styles.pinned : ''}`}>
              <div className={styles.head}>
                <div className={styles.titleRow}>
                  {a.pinned && <Pin size={13} color="var(--gold)" style={{ flexShrink: 0 }} />}
                  <h3 className={styles.title}>{a.title}</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge variant={a.priority}>{a.priority}</Badge>
                  {editor && <button className={styles.delBtn} onClick={() => remove(a._id)}><Trash2 size={13} /></button>}
                </div>
              </div>
              <p className={styles.content}>{a.content}</p>
              <div className={styles.meta}>Posted by {a.author} · {formatDate(a.createdAt)}</div>
            </Card>
          ))}
        </div>
      </Page>

      {editor && <Modal open={modal} onClose={() => setModal(false)} title="New Announcement"
        footer={<><Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button><Button onClick={save}>Post</Button></>}
      >
        <Input label="Title *" value={form.title || ''} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="Announcement headline" />
        <Textarea label="Content *" value={form.content || ''} onChange={v => setForm(f => ({ ...f, content: v }))} placeholder="Write your announcement…" rows={4} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Select label="Priority" value={form.priority || 'medium'} onChange={v => setForm(f => ({ ...f, priority: v as Announcement['priority'] }))}
            options={[{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 22 }}>
            <input type="checkbox" id="pinned" checked={!!form.pinned} onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))} style={{ width: 15, height: 15, accentColor: 'var(--purple-600)' }} />
            <label htmlFor="pinned" style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--grey-800)', cursor: 'pointer' }}>Pin this</label>
          </div>
        </div>
      </Modal>}
    </>
  )
}

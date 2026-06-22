import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { api } from '../lib/api'
import { useUser, canEdit } from '../lib/userContext'
import type { Pipeline } from '../types'
import { Topbar, Page, Card, Button, Badge, Modal, Input, Select } from '../components/UI'
import { formatDate } from '../lib/utils'
import { clearDashboardCache } from '../lib/dashboardCache'
import styles from './Pipelines.module.css'

const STAGES: Pipeline['stage'][] = ['Proposal', 'Onboarding', 'Active', 'Completed']
const STATUS_OPTS = [
  { value: 'new', label: 'New' },
  { value: 'on-track', label: 'On Track' },
  { value: 'pending', label: 'At Risk' },
  { value: 'completed', label: 'Completed' },
]
const STAGE_OPTS = STAGES.map(s => ({ value: s, label: s }))

const empty = (): Partial<Pipeline> => ({ client: '', stage: 'Proposal', service: '', value: '', pm: '', startDate: '', status: 'new' })

export default function Pipelines() {
  const user = useUser()
  const editor = canEdit(user)
  const [items, setItems] = useState<Pipeline[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<Partial<Pipeline>>(empty())
  const [filter, setFilter] = useState('all')

  const load = () => api.pipelines.list().then(setItems)
  useEffect(() => { load() }, [])

  const openEdit = (p: Pipeline) => { setForm(p); setModal(true) }
  const openNew = () => { setForm(empty()); setModal(true) }

  const save = async () => {
    if (!form.client?.trim()) return
    if (form._id) await api.pipelines.update(form._id, form)
    else await api.pipelines.create(form)
    clearDashboardCache(); setModal(false); load()
  }

  const remove = async (id: string) => {
    if (!confirm('Remove this client?')) return
    await api.pipelines.delete(id); clearDashboardCache(); load()
  }

  const filtered = filter === 'all' ? items : items.filter(p => p.stage === filter)

  return (
    <>
      <Topbar title="Client Pipelines">
        {editor && <Button onClick={openNew} size="sm"><Plus size={14} /> Add Client</Button>}
      </Topbar>
      <Page>
        <div className={styles.banner}>
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80" alt="Team" className={styles.bannerImg} />
          <div className={styles.bannerOverlay}>
            <h2 className={styles.bannerTitle}>Client Pipeline</h2>
            <p className={styles.bannerSub}>Track every client from proposal to delivery</p>
          </div>
        </div>

        <Card>
          <div className={styles.tableHead}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--purple-800)' }}>All Clients</div>
            <div className={styles.filters}>
              {['all', ...STAGES].map(s => (
                <button key={s} className={`${styles.filterBtn} ${filter === s ? styles.active : ''}`} onClick={() => setFilter(s)}>
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Client</th><th>Stage</th><th>Service</th><th>Value</th><th>PM</th><th>Start</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--grey-400)' }}>No clients in this stage</td></tr>
                )}
                {filtered.map(p => (
                  <tr key={p._id}>
                    <td><strong>{p.client}</strong></td>
                    <td><span className={styles.tag}>{p.stage}</span></td>
                    <td className={styles.secondary}>{p.service || '—'}</td>
                    <td className={styles.value}>{p.value || '—'}</td>
                    <td className={styles.secondary}>{p.pm || '—'}</td>
                    <td className={styles.secondary}>{p.startDate ? formatDate(p.startDate + 'T00:00') : '—'}</td>
                    <td><Badge variant={p.status}>{p.status}</Badge></td>
                    <td>
                      {editor && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className={styles.iconBtn} onClick={() => openEdit(p)}><Pencil size={13} /></button>
                          <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => remove(p._id)}><Trash2 size={13} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Page>

      {editor && <Modal open={modal} onClose={() => setModal(false)} title={form._id ? 'Edit Client' : 'Add Client'}
        footer={<><Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button><Button onClick={save}>Save</Button></>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Client Name *" value={form.client || ''} onChange={v => setForm(f => ({ ...f, client: v }))} placeholder="Company name" />
          <Select label="Stage" value={form.stage || 'Proposal'} onChange={v => setForm(f => ({ ...f, stage: v as Pipeline['stage'] }))} options={STAGE_OPTS} />
        </div>
        <Input label="Service / Scope" value={form.service || ''} onChange={v => setForm(f => ({ ...f, service: v }))} placeholder="e.g. Brand Identity + Social Media" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Value" value={form.value || ''} onChange={v => setForm(f => ({ ...f, value: v }))} placeholder="LKR 250,000" />
          <Input label="Project Manager" value={form.pm || ''} onChange={v => setForm(f => ({ ...f, pm: v }))} placeholder="PM name" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Start Date" type="date" value={form.startDate || ''} onChange={v => setForm(f => ({ ...f, startDate: v }))} />
          <Select label="Status" value={form.status || 'new'} onChange={v => setForm(f => ({ ...f, status: v as Pipeline['status'] }))} options={STATUS_OPTS} />
        </div>
      </Modal>}
    </>
  )
}

import { useEffect, useState } from 'react'
import { Plus, Trash2, FileText, Wrench, LayoutTemplate, Image, Link } from 'lucide-react'
import { api } from '../lib/api'
import type { Resource } from '../types'
import { Topbar, Page, Button, Modal, Input, Select, Textarea, Badge } from '../components/UI'
import styles from './Resources.module.css'

const TYPE_ICONS: Record<string, React.ReactNode> = {
  document: <FileText size={20} />,
  tool: <Wrench size={20} />,
  template: <LayoutTemplate size={20} />,
  media: <Image size={20} />,
  link: <Link size={20} />,
}

const CAT_OPTS = [
  { value: 'Brand', label: 'Brand' },
  { value: 'Design', label: 'Design' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Other', label: 'Other' },
]

const TYPE_OPTS = [
  { value: 'document', label: 'Document' },
  { value: 'tool', label: 'Tool' },
  { value: 'template', label: 'Template' },
  { value: 'media', label: 'Media' },
  { value: 'link', label: 'Link' },
]

const empty = (): Partial<Resource> => ({ title: '', description: '', category: 'Brand', type: 'document', url: '' })

export default function Resources() {
  const [items, setItems] = useState<Resource[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<Partial<Resource>>(empty())
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const load = () => api.resources.list().then(setItems)
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.title?.trim()) return
    await api.resources.create(form); setModal(false); setForm(empty()); load()
  }

  const remove = async (id: string) => {
    if (!confirm('Remove this resource?')) return
    await api.resources.delete(id); load()
  }

  const filtered = items.filter(r => {
    const matchCat = filter === 'all' || r.category === filter
    const matchQ = !search || r.title.toLowerCase().includes(search.toLowerCase()) || (r.description || '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchQ
  })

  return (
    <>
      <Topbar title="Resources">
        <Button onClick={() => setModal(true)} size="sm"><Plus size={14} /> Add Resource</Button>
      </Topbar>
      <Page>
        <div className={styles.filters}>
          <input className={styles.search} placeholder="Search resources…" value={search} onChange={e => setSearch(e.target.value)} />
          {['all', 'Brand', 'Design', 'Operations'].map(c => (
            <button key={c} className={`${styles.filterBtn} ${filter === c ? styles.active : ''}`} onClick={() => setFilter(c)}>
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filtered.length === 0 && <div className={styles.empty}>No resources found</div>}
          {filtered.map(r => (
            <div key={r._id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.icon}>{TYPE_ICONS[r.type] || <Link size={20} />}</div>
                <button className={styles.delBtn} onClick={() => remove(r._id)}><Trash2 size={13} /></button>
              </div>
              <div className={styles.title}>{r.title}</div>
              {r.description && <p className={styles.desc}>{r.description}</p>}
              <div className={styles.tags}>
                <Badge variant="tag">{r.category}</Badge>
                <span className={styles.typeTag}>{r.type}</span>
              </div>
              {r.url && r.url !== '#'
                ? <a href={r.url} target="_blank" rel="noreferrer" className={styles.openBtn}>Open Resource</a>
                : <button className={styles.openBtn} disabled style={{ opacity: 0.45, cursor: 'default' }}>No link added</button>
              }
            </div>
          ))}
        </div>
      </Page>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Resource"
        footer={<><Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button><Button onClick={save}>Add Resource</Button></>}
      >
        <Input label="Title *" value={form.title || ''} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="Resource name" />
        <Textarea label="Description" value={form.description || ''} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Brief description" rows={2} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Select label="Category" value={form.category || 'Brand'} onChange={v => setForm(f => ({ ...f, category: v as Resource['category'] }))} options={CAT_OPTS} />
          <Select label="Type" value={form.type || 'document'} onChange={v => setForm(f => ({ ...f, type: v as Resource['type'] }))} options={TYPE_OPTS} />
        </div>
        <Input label="URL / Link" value={form.url || ''} onChange={v => setForm(f => ({ ...f, url: v }))} placeholder="https://…" />
      </Modal>
    </>
  )
}

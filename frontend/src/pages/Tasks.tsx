import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { api } from '../lib/api'
import { useUser, canEdit, TEAM_MEMBERS, TEAMS } from '../lib/userContext'
import type { Task } from '../types'
import { Topbar, Page, Button, Badge, Modal, Input, Select, Textarea } from '../components/UI'
import { formatDate } from '../lib/utils'
import { clearDashboardCache } from '../lib/dashboardCache'
import styles from './Tasks.module.css'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const PERSON_OPTIONS = [
  { value: '', label: 'None' },
  ...TEAM_MEMBERS.map(n => ({ value: n, label: n })),
]

const TEAM_OPTIONS = [
  { value: '', label: 'None' },
  ...Object.keys(TEAMS).map(t => ({ value: t, label: t })),
]

const COLUMNS: { status: Task['status']; label: string; color: string }[] = [
  { status: 'pending', label: 'Pending', color: '#f59e0b' },
  { status: 'in-progress', label: 'In Progress', color: '#3b82f6' },
  { status: 'completed', label: 'Completed', color: '#10b981' },
]

const empty = (): Partial<Task> => ({ title: '', description: '', status: 'pending', priority: 'medium', assignee: '', assignedTeam: '', dueDate: '' })

export default function Tasks() {
  const user = useUser()
  const editor = canEdit(user)
  const [tasks, setTasks] = useState<Task[]>([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Partial<Task>>(empty())

  const load = () => api.tasks.list().then(setTasks)
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(empty()); setModal(true) }
  const openEdit = (t: Task) => { setEditing(t); setModal(true) }

  const save = async () => {
    if (!editing.title?.trim()) return
    if (editing._id) {
      await api.tasks.update(editing._id, editing)
    } else {
      await api.tasks.create(editing)
    }
    clearDashboardCache()
    setModal(false)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this task?')) return
    await api.tasks.delete(id)
    clearDashboardCache()
    load()
  }

  return (
    <>
      <Topbar title="Tasks">
        {editor && (
          <Button onClick={openNew} size="sm">
            <Plus size={14} /> New Task
          </Button>
        )}
      </Topbar>
      <Page>
        <div className={styles.board}>
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.status)
            return (
              <div key={col.status} className={styles.column}>
                <div className={styles.colHeader}>
                  <div className={styles.colDot} style={{ background: col.color }} />
                  <span className={styles.colLabel}>{col.label}</span>
                  <span className={styles.colCount}>{colTasks.length}</span>
                </div>
                {colTasks.length === 0 && <div className={styles.empty}>No tasks</div>}
                {colTasks.map(t => (
                  <div key={t._id} className={styles.taskCard}>
                    <div className={styles.taskTop}>
                      <div className={styles.taskTitle}>{t.title}</div>
                      {editor && (
                        <div className={styles.taskActions}>
                          <button className={styles.iconBtn} onClick={() => openEdit(t)}><Pencil size={13} /></button>
                          <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => remove(t._id)}><Trash2 size={13} /></button>
                        </div>
                      )}
                    </div>
                    {t.description && <p className={styles.taskDesc}>{t.description}</p>}
                    <div className={styles.taskMeta}>
                      <Badge variant={t.priority}>{t.priority}</Badge>
                      {t.assignee && <span className={styles.meta}>{t.assignee}</span>}
                      {t.assignedTeam && <span className={styles.meta} style={{ color: 'var(--purple-600)' }}>{t.assignedTeam}</span>}
                      {t.dueDate && <span className={styles.meta}>Due {formatDate(t.dueDate)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </Page>

      {editor && (
        <Modal
          open={modal}
          onClose={() => setModal(false)}
          title={editing._id ? 'Edit Task' : 'New Task'}
          footer={
            <>
              <Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
              <Button onClick={save}>Save Task</Button>
            </>
          }
        >
          <Input label="Task Title *" value={editing.title || ''} onChange={v => setEditing(e => ({ ...e, title: v }))} placeholder="What needs to be done?" />
          <Textarea label="Description" value={editing.description || ''} onChange={v => setEditing(e => ({ ...e, description: v }))} placeholder="Add details…" />
          <div className={styles.formRow}>
            <Select label="Status" value={editing.status || 'pending'} onChange={v => setEditing(e => ({ ...e, status: v as Task['status'] }))} options={STATUS_OPTIONS} />
            <Select label="Priority" value={editing.priority || 'medium'} onChange={v => setEditing(e => ({ ...e, priority: v as Task['priority'] }))} options={PRIORITY_OPTIONS} />
          </div>
          <div className={styles.formRow}>
            <Select label="Assign to Person" value={editing.assignee || ''} onChange={v => setEditing(e => ({ ...e, assignee: v }))} options={PERSON_OPTIONS} />
            <Select label="Assign to Team" value={editing.assignedTeam || ''} onChange={v => setEditing(e => ({ ...e, assignedTeam: v }))} options={TEAM_OPTIONS} />
          </div>
          <Input label="Due Date" type="date" value={editing.dueDate || ''} onChange={v => setEditing(e => ({ ...e, dueDate: v }))} />
        </Modal>
      )}
    </>
  )
}

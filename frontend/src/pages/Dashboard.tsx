import { useEffect, useState } from 'react'
import { CheckSquare, Calendar, GitBranch, Megaphone, MapPin } from 'lucide-react'
import { api } from '../lib/api'
import { useUser } from '../lib/userContext'
import type { Task, Announcement, CalendarEvent, Pipeline } from '../types'
import { Topbar, Page, Card, Badge, StatGrid, Grid2 } from '../components/UI'
import { formatDate, timeAgo } from '../lib/utils'
import { readDashboardCache, writeDashboardCache, clearDashboardCache } from '../lib/dashboardCache'
import styles from './Dashboard.module.css'

interface StatCardProps {
  icon: React.ReactNode
  value: number
  label: string
  color: string
  progress?: number
}

function StatCard({ icon, value, label, color, progress }: StatCardProps) {
  return (
    <Card>
      <div className={styles.statIcon} style={{ background: color + '22', color }}>{icon}</div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {progress !== undefined && (
        <div className={styles.progressWrap}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>
      )}
    </Card>
  )
}

function LogoLoader() {
  return (
    <div className={styles.loadingScreen}>
      <img src="/logo.webp" alt="Loading…" className={styles.loadingLogo} />
    </div>
  )
}

export default function Dashboard() {
  const user = useUser()
  const cached = readDashboardCache()
  const [tasks, setTasks] = useState<Task[]>(cached?.tasks ?? [])
  const [announcements, setAnnouncements] = useState<Announcement[]>(cached?.announcements ?? [])
  const [events, setEvents] = useState<CalendarEvent[]>(cached?.events ?? [])
  const [pipelines, setPipelines] = useState<Pipeline[]>(cached?.pipelines ?? [])
  const [loading, setLoading] = useState(!cached)

  useEffect(() => {
    api.dashboard.get().then(d => {
      setTasks(d.tasks); setAnnouncements(d.announcements); setEvents(d.events); setPipelines(d.pipelines)
      writeDashboardCache(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const activeTasks = tasks.filter(t => t.status !== 'completed')
  const myTasks = user?.role === 'admin'
    ? activeTasks
    : activeTasks.filter(t =>
        t.assignee === user?.name ||
        (t.assignedTeam && t.assignedTeam === user?.department)
      )
  const completedTasks = tasks.filter(t => t.status === 'completed')

  const canChangeStatus = (t: Task) =>
    user?.role === 'admin' ||
    t.assignee === user?.name ||
    (!!t.assignedTeam && t.assignedTeam === user?.department)

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      await api.tasks.updateStatus(taskId, newStatus)
      clearDashboardCache()
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t))
    } catch (e) {
      console.error('Failed to update task status:', e)
    }
  }

  const progress = tasks.length ? Math.round(completedTasks.length / tasks.length * 100) : 0
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date())
  const activeClients = pipelines.filter(p => p.stage !== 'Completed')
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  if (loading) return <LogoLoader />

  return (
    <>
      <Topbar title="Dashboard">
        <span className={styles.date}>{today}</span>
        <span className={styles.pill}>Internal</span>
      </Topbar>
      <Page>
        <StatGrid>
          <StatCard icon={<CheckSquare size={19} />} value={activeTasks.length} label="Active Tasks" color="#420f8a" progress={progress} />
          <StatCard icon={<Calendar size={19} />} value={upcomingEvents.length} label="Upcoming Events" color="#92400e" />
          <StatCard icon={<GitBranch size={19} />} value={activeClients.length} label="Active Clients" color="#065f46" />
          <StatCard icon={<Megaphone size={19} />} value={announcements.length} label="Announcements" color="#065f46" />
        </StatGrid>

        <Grid2>
          <Card>
            <div className={styles.cardHead}>
              <div>
                <div className={styles.cardTitle}>Announcements</div>
                <div className={styles.cardSub}>Latest team notices</div>
              </div>
              <a href="/announcements" className={styles.viewAll}>View all</a>
            </div>
            {announcements.length === 0
              ? <div className={styles.empty}>No announcements yet</div>
              : announcements.slice(0, 3).map(a => (
                <div key={a._id} className={`${styles.annCard} ${a.pinned ? styles.pinned : ''}`}>
                  <div className={styles.annHead}>
                    <div className={styles.annTitle}>{a.title}</div>
                    <Badge variant={a.priority}>{a.priority}</Badge>
                  </div>
                  <p className={styles.annContent}>{a.content.slice(0, 100)}{a.content.length > 100 ? '…' : ''}</p>
                  <div className={styles.annMeta}>By {a.author} · {timeAgo(a.createdAt)}</div>
                </div>
              ))
            }
          </Card>

          <Card>
            <div className={styles.cardHead}>
              <div>
                <div className={styles.cardTitle}>Upcoming Events</div>
                <div className={styles.cardSub}>Next 30 days</div>
              </div>
              <a href="/calendar" className={styles.viewAll}>Calendar</a>
            </div>
            {upcomingEvents.length === 0
              ? <div className={styles.empty}>No upcoming events</div>
              : upcomingEvents.slice(0, 4).map(e => (
                <div key={e._id} className={styles.eventRow}>
                  <div className={styles.dateBadge}>
                    <span className={styles.dateDay}>{new Date(e.date + 'T00:00').getDate()}</span>
                    <span className={styles.dateMon}>{new Date(e.date + 'T00:00').toLocaleDateString('en-GB', { month: 'short' })}</span>
                  </div>
                  <div>
                    <div className={styles.eventTitle}>{e.title}</div>
                    <div className={styles.eventMeta}>{e.time}{e.location ? ` · ${e.location}` : ''}</div>
                    <Badge variant={e.type}>{e.type}</Badge>
                  </div>
                </div>
              ))
            }
          </Card>
        </Grid2>

        <div style={{ marginTop: 20 }}>
          <Grid2>
            <Card>
              <div className={styles.cardHead}>
                <div>
                  <div className={styles.cardTitle}>My Tasks</div>
                  <div className={styles.cardSub}>Pending & in progress</div>
                </div>
                <a href="/tasks" className={styles.viewAll}>All tasks</a>
              </div>
              {myTasks.length === 0
                ? <div className={styles.empty}>No tasks assigned to you yet.</div>
                : myTasks.slice(0, 4).map(t => (
                  <div key={t._id} className={styles.taskRow}>
                    <div className={styles.taskDot} data-status={t.status} />
                    <div style={{ flex: 1 }}>
                      <div className={styles.taskTitle}>{t.title}</div>
                      <div className={styles.taskMeta}>Due {formatDate(t.dueDate)} · {t.assignedTeam || t.assignee || '—'}</div>
                    </div>
                    <Badge variant={t.priority}>{t.priority}</Badge>
                    {canChangeStatus(t) && (
                      <select
                        className={`${styles.statusSelect} ${styles[`status_${t.status.replace('-', '_')}`]}`}
                        value={t.status}
                        onChange={e => handleStatusChange(t._id, e.target.value as Task['status'])}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    )}
                  </div>
                ))
              }
            </Card>

            <Card>
              <div className={styles.cardTitle} style={{ marginBottom: 14 }}>Our Offices</div>
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" alt="Office" className={styles.officeImg} />
              <div className={styles.officeList}>
                {[
                  { name: 'Charles Place Office', addr: '5 Charles Place, Colombo 00300' },
                  { name: 'One Galle Face Tower', addr: 'Level 12, 1A Centre Road, Colombo 00200' },
                ].map(o => (
                  <div key={o.name} className={styles.officeItem}>
                    <MapPin size={14} color="var(--purple-600)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div className={styles.officeName}>{o.name}</div>
                      <div className={styles.officeAddr}>{o.addr}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Grid2>
        </div>
      </Page>
    </>
  )
}

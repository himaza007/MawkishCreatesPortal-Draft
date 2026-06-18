const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export const api = {
  auth: {
    me: () => request<{ user: import('../types').User }>('/auth/me'),
    login: (email: string, password: string) =>
      request<{ user: import('../types').User }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
  },
  tasks: {
    list: () => request<import('../types').Task[]>('/tasks'),
    create: (data: Partial<import('../types').Task>) => request<import('../types').Task>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<import('../types').Task>) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) => request(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    delete: (id: string) => request(`/tasks/${id}`, { method: 'DELETE' }),
  },
  announcements: {
    list: () => request<import('../types').Announcement[]>('/announcements'),
    create: (data: Partial<import('../types').Announcement>) => request<import('../types').Announcement>('/announcements', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<import('../types').Announcement>) => request(`/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/announcements/${id}`, { method: 'DELETE' }),
  },
  events: {
    list: () => request<import('../types').CalendarEvent[]>('/events'),
    create: (data: Partial<import('../types').CalendarEvent>) => request<import('../types').CalendarEvent>('/events', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/events/${id}`, { method: 'DELETE' }),
  },
  pipelines: {
    list: () => request<import('../types').Pipeline[]>('/pipelines'),
    create: (data: Partial<import('../types').Pipeline>) => request<import('../types').Pipeline>('/pipelines', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<import('../types').Pipeline>) => request(`/pipelines/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/pipelines/${id}`, { method: 'DELETE' }),
  },
  resources: {
    list: () => request<import('../types').Resource[]>('/resources'),
    create: (data: Partial<import('../types').Resource>) => request<import('../types').Resource>('/resources', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<import('../types').Resource>) => request<import('../types').Resource>(`/resources/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/resources/${id}`, { method: 'DELETE' }),
  },
}

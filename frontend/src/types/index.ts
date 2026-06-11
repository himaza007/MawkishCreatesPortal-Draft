export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff'
  department: string
  avatar: string
}

export interface Task {
  _id: string
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'high' | 'medium' | 'low'
  assignee?: string
  assignedTeam?: string
  dueDate?: string
  tags?: string[]
  createdAt: string
  createdBy?: string
}

export interface Announcement {
  _id: string
  title: string
  content: string
  priority: 'high' | 'medium' | 'low'
  author: string
  createdAt: string
  pinned: boolean
}

export interface CalendarEvent {
  _id: string
  title: string
  date: string
  time?: string
  type: 'internal' | 'client'
  location?: string
  description?: string
}

export interface Pipeline {
  _id: string
  client: string
  stage: 'Proposal' | 'Onboarding' | 'Active' | 'Completed'
  service?: string
  value?: string
  pm?: string
  startDate?: string
  status: 'new' | 'on-track' | 'pending' | 'completed'
}

export interface Resource {
  _id: string
  title: string
  description?: string
  category: 'Brand' | 'Design' | 'Operations' | 'Other'
  type: 'document' | 'tool' | 'template' | 'media' | 'link'
  url?: string
  addedAt: string
  addedBy?: string
}

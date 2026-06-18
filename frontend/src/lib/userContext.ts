import { createContext, useContext } from 'react'
import type { User } from '../types'

export const UserContext = createContext<User | null>(null)
export const useUser = () => useContext(UserContext)

const EDITORS = new Set(['Booso', 'Himaza', 'Faraz', 'Bianca'])
export const canEdit = (user: User | null): boolean =>
  user !== null && (EDITORS.has(user.name) || user.role === 'admin')

export const TEAM_MEMBERS = ['Booso', 'Harish', 'Aathif', 'Himaza', 'Hakam', 'Krish', 'Bianca', 'Faraz', 'Wazeem', 'Adithya'] as const

export const TEAMS: Record<string, string[]> = {
  'Social Media Team':     ['Bianca', 'Krish', 'Aathif', 'Hakam'],
  'Digital Solution Team': ['Himaza', 'Harish'],
  'Event Management Team': ['Faraz', 'Wazeem', 'Adithya'],
}

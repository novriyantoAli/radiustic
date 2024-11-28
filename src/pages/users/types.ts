import { Project } from '../projects/types'
import { Level } from '../levels/types'
export type UserRole = 'admin' | 'user' | 'owner'

export type User = {
  id: number
  fullname: string
  email: string
  username: string
  role: UserRole
  avatar: string
  projects: Project[]
  notes: string
  active: boolean
}

export type Usr = {
  id: number
  id_level: number
  name: string
  email: string
  password: string
  usr_level: Level
  created: string
}

import { sleep } from '../../services/utils'
import { User, Usr } from './../../pages/users/types'
import usersDb from './users-db.json'
import projectsDb from './projects-db.json'
import { Project } from '../../pages/projects/types'
import { useAuthStore } from '../../stores/auth-store'
import axios from 'axios'

export const users = usersDb as User[]

const getUserProjects = (userId: number | string) => {
  return projectsDb
    .filter((project) => project.team.includes(Number(userId)))
    .map((project) => ({
      ...project,
      project_owner: users.find((user) => user.id === project.project_owner)!,
      team: project.team.map((userId) => users.find((user) => user.id === userId)!),
      status: project.status as Project['status'],
    }))
}

// Simulate API calls

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Usr | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

const getSortItem = (obj: any, sortBy: string) => {
  if (sortBy === 'projects') {
    return obj.projects.map((project: any) => project.project_name).join(', ')
  }

  return obj[sortBy]
}

export const getUsrs = async (filters: Partial<Filters & Pagination & Sorting>) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
  const usr = res.data.data as Usr[]
  const { isActive, search, sortBy, sortingOrder } = filters
  let filteredUsers = usr
  console.log(isActive)

  if (search) {
    filteredUsers = filteredUsers.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
  }
  filteredUsers = filteredUsers.map((user) => ({ ...user }))
  if (sortBy && sortingOrder) {
    filteredUsers = filteredUsers.sort((a, b) => {
      const first = getSortItem(a, sortBy)
      const second = getSortItem(b, sortBy)
      if (first > second) {
        return sortingOrder === 'asc' ? 1 : -1
      }
      if (first < second) {
        return sortingOrder === 'asc' ? -1 : 1
      }
      return 0
    })
  }

  const { page = 1, perPage = 10 } = filters || {}
  return {
    data: filteredUsers.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredUsers.length,
    },
  }
}

export const getUsers = async (filters: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  const { isActive, search, sortBy, sortingOrder } = filters
  let filteredUsers = users

  filteredUsers = filteredUsers.filter((user) => user.active === isActive)

  if (search) {
    filteredUsers = filteredUsers.filter((user) => user.fullname.toLowerCase().includes(search.toLowerCase()))
  }

  filteredUsers = filteredUsers.map((user) => ({ ...user, projects: getUserProjects(user.id) }))

  if (sortBy && sortingOrder) {
    filteredUsers = filteredUsers.sort((a, b) => {
      const first = getSortItem(a, sortBy)
      const second = getSortItem(b, sortBy)
      if (first > second) {
        return sortingOrder === 'asc' ? 1 : -1
      }
      if (first < second) {
        return sortingOrder === 'asc' ? -1 : 1
      }
      return 0
    })
  }

  const { page = 1, perPage = 10 } = filters || {}
  return {
    data: filteredUsers.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredUsers.length,
    },
  }
}

export const addUser = async (usr: Usr) => {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/register`,
    { name: usr.name, email: usr.email, id_level: usr.usr_level.id, password: usr.password },
    { headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` } },
  )
}

export const updateUser = async (usr: Usr) => {
  console.log(usr)
}

export const removeUser = async (usr: Usr) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/users`, {
    data: usr,
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
}

export const resetPasswordUser = async (usr: Usr) => {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/user/reset`,
    { id: usr.id, email: usr.email },
    { headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` } },
  )
}

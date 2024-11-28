import { Level } from './../../pages/levels/types'
import { useAuthStore } from '../../stores/auth-store'
import axios from 'axios'

// Simulate API calls
export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Level | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = { search: string }

const getSortItem = (obj: any, sortBy: string) => {
  if (sortBy === 'name') {
    return obj.name
  }

  return obj[sortBy]
}

export const getLevels = async (filters: Partial<Filters & Pagination & Sorting>) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/levels`, {
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
  const levels = res.data.data as Level[]
  const { search, sortBy, sortingOrder } = filters
  let filteredLevels = levels

  if (search) {
    filteredLevels = filteredLevels.filter((level) => level.name.toLowerCase().includes(search.toLowerCase()))
  }
  filteredLevels = filteredLevels.map((level) => ({ ...level }))
  if (sortBy && sortingOrder) {
    filteredLevels = filteredLevels.sort((a, b) => {
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
    data: filteredLevels.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredLevels.length,
    },
  }
}

export const addLevel = async (level: Level) => {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/user/levels`,
    { name: level.name },
    { headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` } },
  )
}

export const updateLevel = async (level: Level) => {
  console.log(level)

  // await axios.post('http://127.0.0.1:3031/api/v1/user/levels', { id: level.id, name: level.name }, { headers: {"Authorization" : `Bearer ${user.token}`} });
}

export const removeLevel = async (level: Level) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/user/levels`, {
    data: level,
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
}

// export const addLevels = async (project: Omit<(typeof projectsDb)[number], 'id' | 'creation_date'>) => {
//   await sleep(1000)

//   const newProject = {
//     ...project,
//     id: projectsDb.length + 1,
//     creation_date: new Date().toLocaleDateString('gb', { day: 'numeric', month: 'short', year: 'numeric' }),
//   }

//   projectsDb.push(newProject)

//   return {
//     ...newProject,
//     project_owner: usersDb.find((user) => user.id === project.project_owner)! as (typeof usersDb)[number],
//     team: usersDb.filter((user) => project.team.includes(user.id)) as (typeof usersDb)[number][],
//   }
// }

// export const updateLevel = async (project: (typeof projectsDb)[number]) => {
//   await sleep(1000)

//   const index = projectsDb.findIndex((p) => p.id === project.id)
//   projectsDb[index] = project

//   return project
// }

// export const removeLevel = async (project: (typeof projectsDb)[number]) => {
//   await sleep(1000)

//   const index = projectsDb.findIndex((p) => p.id === project.id)
//   projectsDb.splice(index, 1)

//   return project
// }

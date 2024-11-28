import { Radreply } from './../../pages/hotspot-profile-radreply-properties/types'
import { useAuthStore } from '../../stores/auth-store'
import axios from 'axios'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Radreply | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = { search: string }

const getSortItem = (obj: any, sortBy: string) => {
  if (sortBy === 'groupname') {
    return obj.groupname
  }

  return obj[sortBy]
}

export const getRadreplys = async (query: string, filters: Partial<Filters & Pagination & Sorting>) => {
  if (query === undefined) {
    query = ''
  }
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/radgroup/reply?groupname=${query}`, {
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })

  const radreplys = res.data.data as Radreply[]

  console.log(res)

  const { search, sortBy, sortingOrder } = filters
  let filteredRadreplys = radreplys

  if (search) {
    filteredRadreplys = filteredRadreplys.filter((radreply) =>
      radreply.groupname.toLowerCase().includes(search.toLowerCase()),
    )
  }
  filteredRadreplys = filteredRadreplys.map((radreply) => ({ ...radreply }))
  if (sortBy && sortingOrder) {
    filteredRadreplys = filteredRadreplys.sort((a, b) => {
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
    data: filteredRadreplys.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredRadreplys.length,
    },
  }
}

export const addRadreply = async (radreply: Radreply) => {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/radgroup/reply`,
    {
      groupname: radreply.profile.groupname,
      attribute: radreply.attribute,
      op: radreply.op,
      value: radreply.value,
    },
    { headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` } },
  )
}

export const updateRadreply = async (radreply: Radreply) => {
  console.log(radreply)

  // await axios.post('http://127.0.0.1:3031/api/v1/user/levels', { id: level.id, name: level.name }, { headers: {"Authorization" : `Bearer ${user.token}`} });
}

export const removeRadreply = async (radreply: Radreply) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/radgroup/reply`, {
    data: radreply,
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

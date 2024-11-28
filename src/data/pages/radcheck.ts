import { Radcheck } from './../../pages/hotspot-profile-radcheck-properties/types'
import { useAuthStore } from '../../stores/auth-store'
import axios from 'axios'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Radcheck | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = { search: string }

const getSortItem = (obj: any, sortBy: string) => {
  if (sortBy === 'groupname') {
    return obj.groupname
  }

  return obj[sortBy]
}

export const getRadchecks = async (query: string, filters: Partial<Filters & Pagination & Sorting>) => {
  if (query === undefined) {
    query = ''
  }
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/radgroup/check?groupname=${query}`, {
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })

  const radchecks = res.data.data as Radcheck[]

  const { search, sortBy, sortingOrder } = filters
  let filteredRadchecks = radchecks

  if (search) {
    filteredRadchecks = filteredRadchecks.filter((radcheck) =>
      radcheck.groupname.toLowerCase().includes(search.toLowerCase()),
    )
  }
  filteredRadchecks = filteredRadchecks.map((radcheck) => ({ ...radcheck }))
  if (sortBy && sortingOrder) {
    filteredRadchecks = filteredRadchecks.sort((a, b) => {
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
    data: filteredRadchecks.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredRadchecks.length,
    },
  }
}

export const addRadcheck = async (radcheck: Radcheck) => {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/radgroup/check`,
    {
      groupname: radcheck.profile.groupname,
      attribute: radcheck.attribute,
      op: radcheck.op,
      value: radcheck.value,
    },
    { headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` } },
  )
}

export const updateRadcheck = async (radcheck: Radcheck) => {
  console.log(radcheck)

  // await axios.post('http://127.0.0.1:3031/api/v1/user/levels', { id: level.id, name: level.name }, { headers: {"Authorization" : `Bearer ${user.token}`} });
}

export const removeRadcheck = async (radcheck: Radcheck) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/radgroup/check`, {
    data: radcheck,
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

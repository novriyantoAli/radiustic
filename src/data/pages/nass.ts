import { Nas } from '../../pages/nas/types'
import { useAuthStore } from '../../stores/auth-store'
import axios from 'axios'

// Simulate API calls
export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Nas | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = { search: string }

const getSortItem = (obj: any, sortBy: string) => {
  if (sortBy === 'nasname') {
    return obj.nasname
  }

  return obj[sortBy]
}

export const getNass = async (filters: Partial<Filters & Pagination & Sorting>) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/nas`, {
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
  const nas = res.data.data as Nas[]
  const { search, sortBy, sortingOrder } = filters
  let filteredNas = nas

  if (search) {
    filteredNas = filteredNas.filter((nas) => nas.nasname.toLowerCase().includes(search.toLowerCase()))
  }
  filteredNas = filteredNas.map((nas) => ({ ...nas }))
  if (sortBy && sortingOrder) {
    filteredNas = filteredNas.sort((a, b) => {
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
    data: filteredNas.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredNas.length,
    },
  }
}

export const addNas = async (nas: Nas) => {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/nas`,
    {
      nasname: nas.nasname,
      shortname: nas.shortname,
      type: nas.type,
      ports: nas.ports,
      secret: nas.secret,
      server: nas.server,
      community: nas.community,
      description: nas.description,
    },
    { headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` } },
  )
}

export const updateNas = async (nas: Nas) => {
  console.log(nas)

  // await axios.post('http://127.0.0.1:3031/api/v1/user/levels', { id: level.id, name: level.name }, { headers: {"Authorization" : `Bearer ${user.token}`} });
}

export const removeNas = async (nas: Nas) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/nas`, {
    data: nas,
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
}

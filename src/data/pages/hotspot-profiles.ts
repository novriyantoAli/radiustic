import { HotspotProfile } from './../../pages/hotspot-profiles/types'
import { useAuthStore } from '../../stores/auth-store'
import axios from 'axios'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof HotspotProfile | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = { search: string }

const getSortItem = (obj: any, sortBy: string) => {
  if (sortBy === 'username') {
    return obj.username
  }

  return obj[sortBy]
}

export const getHotspotProfiles = async (filters: Partial<Filters & Pagination & Sorting>) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/profiles`, {
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })

  const hprofiles = res.data.data as HotspotProfile[]

  const { search, sortBy, sortingOrder } = filters
  let filteredHotspotProfiles = hprofiles

  if (search) {
    filteredHotspotProfiles = filteredHotspotProfiles.filter((hprofile) =>
      hprofile.username.toLowerCase().includes(search.toLowerCase()),
    )
  }
  filteredHotspotProfiles = filteredHotspotProfiles.map((hprofile) => ({ ...hprofile }))
  if (sortBy && sortingOrder) {
    filteredHotspotProfiles = filteredHotspotProfiles.sort((a, b) => {
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
    data: filteredHotspotProfiles.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredHotspotProfiles.length,
    },
  }
}

export const addHotspotProfile = async (hprofile: HotspotProfile) => {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/profiles`,
    {
      username: hprofile.username,
      groupname: hprofile.username,
      priority: hprofile.priority,
      Radcheck: [],
      Radreply: [],
    },
    { headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` } },
  )
}

export const updateHotspotProfile = async (hprofile: HotspotProfile) => {
  console.log(hprofile)

  // let user = JSON.parse(localStorage.getItem('user'));
  // await axios.post('http://127.0.0.1:3031/api/v1/user/levels', { id: level.id, name: level.name }, { headers: {"Authorization" : `Bearer ${user.token}`} });
}

export const removeHotspotProfile = async (hprofile: HotspotProfile) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/profiles`, {
    data: hprofile,
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
}

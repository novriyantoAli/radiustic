import { HotspotPackage } from './../../pages/hotspot-packages/types'
import { useAuthStore } from '../../stores/auth-store'
import axios from 'axios'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof HotspotPackage | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = { search: string }

const getSortItem = (obj: any, sortBy: string) => {
  if (sortBy === 'name') {
    return obj.name
  }

  return obj[sortBy]
}

export const getHotspotPackages = async (filters: Partial<Filters & Pagination & Sorting>) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/packages`, {
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
  const hpackages = res.data.data as HotspotPackage[]

  const { search, sortBy, sortingOrder } = filters
  let filteredHotspotPackages = hpackages

  if (search) {
    filteredHotspotPackages = filteredHotspotPackages.filter((hpackage) =>
      hpackage.name.toLowerCase().includes(search.toLowerCase()),
    )
  }
  filteredHotspotPackages = filteredHotspotPackages.map((hpackage) => ({ ...hpackage }))
  if (sortBy && sortingOrder) {
    filteredHotspotPackages = filteredHotspotPackages.sort((a, b) => {
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
    data: filteredHotspotPackages.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredHotspotPackages.length,
    },
  }
}

export const addHotspotPackage = async (hpackage: HotspotPackage) => {
  hpackage.profile = hpackage.selection_profile.username
  hpackage.validity_value = hpackage.validity_value.toString()
  hpackage.price = hpackage.price.toString()
  hpackage.margin = hpackage.margin.toString()
  const data = JSON.stringify(hpackage)
  await axios.post(`${import.meta.env.VITE_API_URL}/packages`, data, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
}

export const updateHotspotPackage = async (hpackage: HotspotPackage) => {
  hpackage.profile = hpackage.selection_profile.username
  hpackage.validity_value = hpackage.validity_value.toString()
  hpackage.price = hpackage.price.toString()
  hpackage.margin = hpackage.margin.toString()
  const data = JSON.stringify(hpackage)
  await axios.put(`${import.meta.env.VITE_API_URL}/packages`, data, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
}

export const removeHotspotPackage = async (hpackage: HotspotPackage) => {
  hpackage.validity_value = hpackage.validity_value.toString()
  hpackage.price = hpackage.price.toString()
  hpackage.margin = hpackage.margin.toString()
  const data = JSON.stringify(hpackage)
  await axios.delete(`${import.meta.env.VITE_API_URL}/packages`, {
    data: data,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
}

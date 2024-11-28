import { ClientBinding } from './../../pages/client-binding/types'
import { useAuthStore } from '../../stores/auth-store'
import axios from 'axios'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof ClientBinding | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = { search: string }

const getSortItem = (obj: any, sortBy: string) => {
  if (sortBy === 'mac') {
    return obj.mac
  }

  return obj[sortBy]
}

export const getClientBindings = async (filters: Partial<Filters & Pagination & Sorting>) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/clients/binding`, {
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
  const clientBindings = res.data.data as ClientBinding[]
  const { search, sortBy, sortingOrder } = filters
  let filteredClientBindings = clientBindings

  if (search) {
    filteredClientBindings = filteredClientBindings.filter((clientbinding) =>
      clientbinding.mac.toLowerCase().includes(search.toLowerCase()),
    )
  }
  filteredClientBindings = filteredClientBindings.map((clientbinding) => ({ ...clientbinding }))
  if (sortBy && sortingOrder) {
    filteredClientBindings = filteredClientBindings.sort((a, b) => {
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
    data: filteredClientBindings.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredClientBindings.length,
    },
  }
}

export const addClientBinding = async (clientbinding: ClientBinding) => {
  if (clientbinding.client !== undefined) {
    clientbinding.id_client = clientbinding.client.id
  }
  await axios.post(
    `${import.meta.env.VITE_API_URL}/clients/binding`,
    {
      id_client: clientbinding.id_client,
      mac: clientbinding.mac,
    },
    {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${useAuthStore().$state.user.token}` },
    },
  )
}

export const updateClientBinding = async (clientbinding: ClientBinding) => {
  console.log(clientbinding)

  // let user = JSON.parse(localStorage.getItem('user'));
  // await axios.post('http://127.0.0.1:3031/api/v1/user/levels', { id: level.id, name: level.name }, { headers: {"Authorization" : `Bearer ${user.token}`} });
}

export const removeClientBinding = async (clientbinding: ClientBinding) => {
  if (clientbinding.client !== undefined) {
    clientbinding.id_client = clientbinding.client.id
  }
  const data = JSON.stringify(clientbinding)
  await axios.delete(`${import.meta.env.VITE_API_URL}/clients/binding`, {
    data: data,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
}

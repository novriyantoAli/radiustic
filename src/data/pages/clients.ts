import { Client } from './../../pages/clients/types'
import { useAuthStore } from '../../stores/auth-store'
import axios from 'axios'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Client | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = { search: string }

const getSortItem = (obj: any, sortBy: string) => {
  if (sortBy === 'username') {
    return obj.username
  }

  return obj[sortBy]
}

export const getClients = async (filters: Partial<Filters & Pagination & Sorting>) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/clients`, {
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
  const clients = res.data.data as Client[]
  const { search, sortBy, sortingOrder } = filters
  let filteredClients = clients

  if (search) {
    filteredClients = filteredClients.filter((client) => client.username.toLowerCase().includes(search.toLowerCase()))
  }
  filteredClients = filteredClients.map((client) => ({ ...client }))
  if (sortBy && sortingOrder) {
    filteredClients = filteredClients.sort((a, b) => {
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
    data: filteredClients.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredClients.length,
    },
  }
}

export const addClient = async (client: Client) => {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/clients`,
    {
      id_customer: client.customer.id,
      username: client.customer.identity,
      password: client.password,
      price: client.price.toString(),
      speed: client.speed,
      session: client.session.toString(),
      validity_unit: client.validity_unit,
      validity_value: client.validity_value.toString(),
      notes: client.notes,
    },
    { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${useAuthStore().$state.user.token}` } },
  )
}

export const updateClient = async (client: Client) => {
  console.log(client)

  // let user = JSON.parse(localStorage.getItem('user'));
  // await axios.post('http://127.0.0.1:3031/api/v1/user/levels', { id: level.id, name: level.name }, { headers: {"Authorization" : `Bearer ${user.token}`} });
}

export const removeClient = async (client: Client) => {
  client.price = client.price.toString()
  client.session = client.session.toString()
  client.validity_value = client.validity_value.toString()
  const data = JSON.stringify(client)
  await axios.delete(`${import.meta.env.VITE_API_URL}/clients`, {
    data: data,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
}

import { Customer } from './../../pages/customers/types'
import { useAuthStore } from '../../stores/auth-store'
import axios from 'axios'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Customer | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = { search: string }

const getSortItem = (obj: any, sortBy: string) => {
  if (sortBy === 'name') {
    return obj.name
  }

  return obj[sortBy]
}

export const getCustomers = async (filters: Partial<Filters & Pagination & Sorting>) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/customers`, {
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
  const customers = res.data.data as Customer[]
  const { search, sortBy, sortingOrder } = filters
  let filteredCustomers = customers
  if (search) {
    filteredCustomers = filteredCustomers.filter((level) => level.name.toLowerCase().includes(search.toLowerCase()))
  }
  filteredCustomers = filteredCustomers.map((level) => ({ ...level }))
  if (sortBy && sortingOrder) {
    filteredCustomers = filteredCustomers.sort((a, b) => {
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
    data: filteredCustomers.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredCustomers.length,
    },
  }
}

export const addCustomer = async (customer: Customer) => {
  const birthDate = new Date(customer.birth_date)

  const formData = new FormData()

  if (customer.avatar != undefined) {
    const blob = new Blob([customer.avatar], { type: 'image' })
    formData.append('image', blob, customer.avatar.name)
  }

  formData.append('birth_date', birthDate.toLocaleDateString())
  formData.append('name', customer.name)
  formData.append('identity', customer.identity)
  formData.append('sex', customer.sex)
  formData.append('phone', customer.phone)
  formData.append('email', customer.email)
  formData.append('job', customer.job)
  formData.append('lat', customer.lat)
  formData.append('lng', customer.lng)

  await axios.post(`${import.meta.env.VITE_API_URL}/customers`, formData, {
    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
}

export const updateCustomer = async (customer: Customer) => {
  console.log(customer)

  // let user = JSON.parse(localStorage.getItem('user'));
  // await axios.post('http://127.0.0.1:3031/api/v1/user/levels', { id: level.id, name: level.name }, { headers: {"Authorization" : `Bearer ${user.token}`} });
}

export const removeCustomer = async (customer: Customer) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/customers`, {
    data: customer,
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
}

export type CustomerSex = 'p' | 'w'

export type Customer = {
  id: number
  name: string
  identity: string
  sex: CustomerSex
  email: string
  phone: string
  job: string
  image: string
  birth_date: string
  lat: string
  lng: string
  avatar?: File
}

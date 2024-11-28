import { Customer } from '../customers/types'
import { ValidityUnit } from '../hotspot-packages/types'
export type Client = {
  id: number
  id_customer: number
  username: string
  password: string
  price: string
  speed: string
  session: string
  validity_value: string
  validity_unit: ValidityUnit
  notes: string | ''
  customer: Customer
  created_at: string
  updated_at: string
}

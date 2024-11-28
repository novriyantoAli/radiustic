import { HotspotPackage } from '../hotspot-packages/types'
import { Customer } from '../customers/types'
import { Usr } from '../users/types'
import { Client } from '../clients/types'

export enum PaymentSystemType {
  Visa = 'visa',
  MasterCard = 'mastercard',
}

export enum PaymentType {
  Cash = 'cash',
  Credit = 'credit',
}

export enum TipeBayar {
  Cash = 'debit',
  Credit = 'credit',
}

export type Order = {
  id: number
  id_user: number
  id_customer: number
  id_batch: string
  amount: string
  payment: PaymentType
  package: HotspotPackage
  customer: Customer
  user: Usr
  order_hotspot: OrderHotspot
  order_client: OrderClient
}

export type OrderHotspot = {
  id_batch: string
  include_symbols: boolean
  include_numbers: boolean
  include_lowercase_letters: boolean
  include_uppercase_letters: boolean
  exclude_similar_characters: boolean
  exclude_ambiguous_characters: boolean
  activated: boolean
  id_package: number
}

export type OrderClient = {
  id_batch: string
  id_client: number
  client: Client
  expire: string
}

export interface PaymentCard {
  id: string
  name: string
  isPrimary: boolean // show Primary badge
  paymentSystem: PaymentSystemType // Enum or union type for various payment systems
  cardNumberMasked: string // ****1679
  expirationDate: string // 09/24
}

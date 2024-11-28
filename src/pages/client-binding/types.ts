import { Client } from '../clients/types'

export type ClientBinding = {
  id: number
  id_client: number
  mac: string
  client: Client | undefined
}

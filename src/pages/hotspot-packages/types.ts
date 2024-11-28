import { HotspotProfile } from '../hotspot-profiles/types'

export type ValidityUnit = 'HOUR' | 'DAY' | 'MONTH'

export type HotspotPackage = {
  id: number
  name: string
  validity_value: string
  validity_unit: ValidityUnit
  price: string
  margin: string
  profile: string
  selection_profile: HotspotProfile
  created_at: string
  updated_at: string
}

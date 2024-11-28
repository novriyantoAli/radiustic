import { HotspotProfile } from '../hotspot-profiles/types'

export type Radcheck = {
  id: number
  profile: HotspotProfile
  groupname: string
  attribute: string
  op: string
  value: string
}

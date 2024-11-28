import { HotspotProfile } from '../hotspot-profiles/types'

export type Radreply = {
  id: number
  profile: HotspotProfile
  groupname: string
  attribute: string
  op: string
  value: string
}

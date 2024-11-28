export type Radcheck = {
  id: number
  groupname: string
  attribute: string
  op: string
  value: string
}

export type Radreply = {
  id: number
  groupname: string
  attribute: string
  op: string
  value: string
}

export type HotspotProfile = {
  username: string
  groupname: string
  priority: number
  Radgroupcheck: Radcheck[]
  Radgroupreply: Radreply[]
}

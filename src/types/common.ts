export interface Customer {
  name: string
  abbreviation: string
  dirctor: string
  phone: string
  address: string
  contacts: string
  contactNumber: string
}

export interface User {
  id: number | null
  name: string
  user_name: string
  phone: string
  station: string // 岗位
  is_admin: 1 | 2 // 权限
  module_info: string  // 模块JSON.stringify()
  status?: boolean
}

export interface YarnType {
  id: number | null
  name: string,
  [key: string]: any
}

export interface PartyB {
  id: number | null
  name: string
  abbreviation: string
  client_type?: string
  user_name: string
  phone: string
  address: string
  contact: string
  contact_phone: string
  status?: boolean
  type?: 1 | 2 | 3
}

export interface Color {
  id: number | null
  name: string,
  [key: string]: any
}

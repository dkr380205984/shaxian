export interface Customer {
  name: string
  abbreviation: string
  dirctor: string
  phone: string
  address: string
  contacts: string
  contactNumber: string
}

export interface Supplier {
  code?: string
  name: string
  abbreviation: string
  principal: string
  telephone: string
  address: string
  contacts: string
  contact_tel: string
  status?: boolean
}

export interface User {
  name: string
  username: string
  phone: string
  post: string // 岗位
  status: number // 权限
  modules: string // 模块JSON.stringify()
}

export interface Yarn {
  name: string,
  [key: string]: any
}

export interface Factory {
  code?: string
  name: string
  abbreviation: string
  type: string | []
  principal: string
  telephone: string
  address: string
  contacts: string
  contact_tel: string
  status?: boolean
}

export interface Client {
  code?: string
  name: string
  abbreviation: string
  principal: string
  telephone: string
  address: string
  contacts: string
  contact_tel: string
  status?: boolean
}

export interface Color {
  name: string,
  [key: string]: any
}

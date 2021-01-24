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
  name: string
  abbreviation: string
  dirctor: string
  phone: string
  address: string
  contacts: string
  contactNumber: string
}

export interface User {
  name: string
  username: string
  phone: string
  post: string // 岗位
  status: number // 权限
  modules: string // 模块JSON.stringify()
}

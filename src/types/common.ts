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
  status?: boolean | number
  type?: 1 | 2 | 3
}

export interface Color {
  id: number | null
  name: string,
  [key: string]: any
}

export interface Store {
  id: number | null
  name: string
  type: 1 | 2 // 1本厂仓库2染厂仓库
  store_type: 1 | 2 // 1沙县仓库2毛条仓库
  admins: Array<string | number>
  LV2_info: Array<{ name: string, id: number | null }>
  desc: string
  checked?: boolean
  total_weight?: number
}
export interface StoreDetail {
  id: number
  name: string
  type: 1 | 2
  manager_data: Array<{ name: string, user_id: number | string }>
  second_data: Array<{ id: number, store_id?: number, name: string }>
  create_time: Date | null,
  user_name: string
  desc: string | null
}

export interface MaterialType {
  id?: number | string
  name: string
}

// 扣款信息
export interface DeductInfo {
  code?: string
  deduct_type: 1 | 2 | 3 | 4 | 5
  pid: string | number
  total_price: string | number
  deduct_content: string
  deduct_file: string
  desc: string
}

// 审核信息
export interface CheckInfo {
  id?: number
  pid: number | string // 关联id
  is_check: 1 | 2 // 1审核通过，2驳回
  check_type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 // 1纱线订购 2纱线加工 3毛条订购 4毛条加工 5 订单 6 扣款单 7 调取单 8 报价单
  check_desc: string // 常见驳回理由
  desc: string // 备注信息
  user_name?: string
  create_time?: string
}

export interface Print {
  id: number | null,
  [key: string]: any
}

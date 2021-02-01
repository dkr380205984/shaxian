// 乙方————加工厂客户供应商
export interface PartyBCreateParams {
  id: number | null
  name: string
  abbreviation: string
  client_type?: string
  user_name: string
  phone: string
  address: string
  contact: string
  contact_phone: string
  type: 1 | 2 | 3 //1客户2供应商3加工厂
  [key: string]: any
}
export interface PartyBListParams {
  page?: number
  limit?: number
  name?: string | null
  status?: number | null
  client_type?: string | null
  type?: 1 | 2 | 3
}
export interface PartyBCheckParams {
  id: number | null
}
// 纱线类型
export interface YarnTypeCreateParams {
  id: number | null
  name: string
}
export interface YarnTypeListParams {
  page?: number
  limit?: number
  name?: string | null
  status?: number | null
}
export interface YarnTypeDetailParams {
  id: number | null
}
// 纱线颜色
export interface YarnColorCreateParams {
  id: number | null
  name: string
}
export interface YarnColorListParams {
  page?: number
  limit?: number
  name?: string | null
  status?: number | null
}
export interface YarnColorDetailParams {
  id: number | null
}
// 系统用户
export interface UserCreateParams {
  id: number | null
  name: string,
  user_name: string,
  phone: string,
  station: string,
  is_admin: 1 | 2 // 1管理员2普通
  module_info: string
}
export interface UserListParams {
  page?: number
  limit?: number
  name?: string | null
  phone?: number | null
}
export interface UserDetailParams {
  id: number | null
}

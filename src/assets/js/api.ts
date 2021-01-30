import http from './http'
import { ListParam, DetailParam, DeleteParam } from '@/types/axiosParam'
const baseUrl = '/api'

// 登录
const login = (params: { user_name: string, password: string }) => http.post(`${baseUrl}/auth/login`, params, 'application/json')
// token
const getToken = () => http.get(`${baseUrl}/upload/token`)
// 用户信息
const authInfo = (params: any) => http.post(`${baseUrl}/auth/info`, params, 'application/json')
// 纱线类型
const yarnType = {
  create: (params: any) => http.post(`${baseUrl}/yarn/type/save`, params, 'application/json'),
  detail: (params: any) => http.get(`${baseUrl}/yarn/type/detail`, params),
  delete: (params: any) => http.post(`${baseUrl}/yarn/type/delete`, params, 'application/json'),
  list: (params?: ListParam) => http.get(`${baseUrl}/yarn/type/lists`, params)
}
// 纱线颜色
const yarnColor = {
  create: (params: any) => http.post(`${baseUrl}/yarn/color/save`, params, 'application/json'),
  detail: (params: any) => http.get(`${baseUrl}/yarn/color/detail`, params),
  delete: (params: any) => http.post(`${baseUrl}/yarn/color/delete`, params, 'application/json'),
  list: (params: any) => http.get(`${baseUrl}/yarn/color/lists`, params)
}

// 产品
import { Product, ProductDetail } from '@/types/product'
const product = {
  create: (params: { data: Product[] }) => http.post(`${baseUrl}/yarn/save`, params, 'application/json'),
  list: (params: ListParam) => http.get(`${baseUrl}/yarn/lists`, params),
  delete: (params: DeleteParam) => http.post(`${baseUrl}/yarn/delete`, params, 'application/json'),
  detail: (params: DetailParam) => http.get(`${baseUrl}/yarn/detail`, params),
  editPro: (params: { id: string, name: string, yarn_type: number }) => http.post(`${baseUrl}/yarn/edit`, params, 'application/json'),
  editProChild: (params: ProductDetail) => http.post(`${baseUrl}/yarn/child/edit`, params, 'application/json'),
  deleteChild: (params: DeleteParam) => http.post(`${baseUrl}/yarn/child/delete`, params, 'application/json')
}
export {
  login,
  authInfo,
  getToken,
  yarnType,
  yarnColor,
  product
}

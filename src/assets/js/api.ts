import http from './http'
import { ListParam, DetailParam, DeleteParam } from '@/types/axiosParam'
const baseUrl = '/api'

// 登录
const login = (params: { user_name: string, password: string }) => http.post(`${baseUrl}/auth/login`, params, 'application/json')
// token
const getToken = () => http.get(`${baseUrl}/upload/token`)

// 产品
import { Product } from '@/types/product'
const product = {
  create: (params: Product[]) => http.post(`${baseUrl}/yarn/save`, params, 'application/json')
}
export {
  login,
  getToken,
  product
}

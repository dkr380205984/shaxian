import http from './http'
import { ListParam, DetailParam, DeleteParam } from '@/types/axiosParam'
const baseUrl = '/api'

// 登录
const login = (params: any) => http.post(`${baseUrl}/auth/login`, params, 'application/json')
// token
const getToken = () => http.get(`${baseUrl}/upload/token`)
//用户信息
const authInfo = (params: any) => http.post(`${baseUrl}/auth/info`, params, 'application/json')
// 纱线类型
const yarnType = {
  create: (params: any) => http.post(`${baseUrl}/yarn/type/save`, params, 'application/json'),
  detail: (params: any) => http.get(`${baseUrl}/yarn/type/detail`, params),
  delete: (params: any) => http.post(`${baseUrl}/yarn/type/delete`, params, 'application/json'),
  list: (params: any) => http.get(`${baseUrl}/yarn/type/lists`, params)
}
// 纱线颜色
const yarnColor = {
  create: (params: any) => http.post(`${baseUrl}/yarn/color/save`, params, 'application/json'),
  detail: (params: any) => http.get(`${baseUrl}/yarn/color/detail`, params),
  delete: (params: any) => http.post(`${baseUrl}/yarn/color/delete`, params, 'application/json'),
  list: (params: any) => http.get(`${baseUrl}/yarn/color/lists`, params)
}

export {
  login,
  authInfo,
  getToken,
  yarnType,
  yarnColor
}

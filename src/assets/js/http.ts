import axios from 'axios'
import Message from 'element-ui'
import router from '../../router'
import qs from 'qs'
// 设置请求头
axios.defaults.headers.get['Content-Type'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'
axios.defaults.headers.delete['Content-Type'] = 'application/json'
// 请求超时时间
axios.defaults.timeout = 30000

// 在请求拦截器中 设置token,更新token
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token_type') + ' ' + window.sessionStorage.getItem('token')
  return config
}, (error) => {
  return Promise.reject(error)
})

// 回调拦截
axios.interceptors.response.use(
  // 请求成功回调
  (res) => {
    if (res.data.code === 200) {
      // do nothing
    } else {
      Message.Message.error('服务器出错')
    }
    return res
  },
  // 请求失败回调
  (error) => {
    router.push({ path: '/index/error/' + error.response.status })
    return Promise.reject(error)
  }
)
function get(url: string, params?: object) {
  params = typeof (params) === 'object' ? params : {}
  const response = axios({
    method: 'get',
    url,
    params
  })
  return Promise.resolve(response)
}

function post(url: any, params?: object | string, contentType?: string, responseType?: any) {
  params = typeof (params) === 'object' ? params : {}
  // 设置请求头
  let headers = {}
  if (contentType && contentType === 'application/json') {
    headers = { 'Content-Type': 'application/json' }
  } else if (contentType && contentType === 'form-data') {
    headers = {
      'Content-Type': 'multipart/form-data',
      'processData': false
    }
  } else {
    params = qs.stringify(params)
    headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
  }
  // 设置响应头
  responseType = responseType || 'json'
  const response = axios({
    method: 'post',
    data: params,
    url,
    headers,
    responseType
  })
  return Promise.resolve(response)
}
const http = {
  get,
  post
}
export default http

import { User, YarnType } from '@/types/common'
interface StatusAndArr {
  status: boolean
  arr: any[]
}

interface UserInfo {
  status: boolean
  arr: User[]
}

interface YarnTypeInfo {
  status: boolean
  arr: YarnType[]
}

// 维护api公共state
export interface ApiState {
  user: UserInfo
  yarnType: YarnTypeInfo
  [propName: string]: StatusAndArr
}

// 全局state
export interface State {
  api: {
    [propName: string]: StatusAndArr
  }
  status: {
    breadUrl: Array<{
      url: string
      name: string
    }>
    token: string
  }
}

// 维护全局的state，暂时保留，没什么用
export interface SelfState {
  api: ApiState
}

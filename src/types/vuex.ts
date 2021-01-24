import { User } from '@/types/common'
interface StatusAndArr {
  status: boolean
  arr: any[]
}

interface UserInfo {
  status: boolean
  arr: User[]
}

// 维护api公共state
export interface ApiState {
  user: UserInfo
  [propName: string]: StatusAndArr
}


// 维护全局的state，暂时保留，没什么用
export interface SelfState {
  api: ApiState
}
// 在.vue文件里用以下代码会报错，state指定为unknown类型，恶心坏了
// computed: {
//   ...mapState({
//     userList: (state: SelfState) => state.api.user
//   })
// },

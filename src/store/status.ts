import { getToken } from '@/assets/js/api'
import { ApiState } from '@/types/vuex'
import { ActionContext } from 'vuex'
// 该模块用于管理公共状态，如面包屑信息，token，用户信息等
interface State {
  breadUrl: BreadUrl[]
  token: string
}
interface BreadUrl {
  url: string
  name: string
}
const statusState: State = {
  breadUrl: [],
  token: ''
}

const statusMutations = {
  getBreadUrl(state: State, breadUrl: BreadUrl) {
    const findIndex = state.breadUrl.findIndex((item) => item.name === breadUrl.name)
    if (findIndex !== -1) {
      state.breadUrl.splice(findIndex + 1, state.breadUrl.length - findIndex - 1)
    } else {
      if (state.breadUrl.length > 10) {
        state.breadUrl.shift()
      }
      state.breadUrl.push(breadUrl)
    }
  },
  getToken(state: State, token: string) {
    state.token = token
  }
}

const statusActions = {
  getTokenAsync(content: ActionContext<ApiState, any>) {
    getToken().then((res) => {
      if (res.data.status) {
        content.commit('getToken', res.data.data)
      }
    })
  }
}
export default {
  // 表示允许  使用namespaced方法使用该模块，必须有
  namespaced: true,
  state: statusState,
  mutations: statusMutations,
  actions: statusActions
}

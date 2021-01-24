import { ActionContext } from 'vuex'
import { User } from '@/types/common'
import { ApiState } from '@/types/vuex'
// state
const apiState: ApiState = {
  user: {
    status: false,
    arr: []
  }
}
// mutations
const apiMutations = {
  getUser(state: ApiState, user: User[]) {
    state.user.status = true
    state.user.arr = user
  }
}
// actions
const apiActions = {
  getUserAsync(content: ActionContext<ApiState, any>) {
    setTimeout(() => {
      content.commit('getUser', [{
        name: 'string',
        username: 'string',
        phone: 'string',
        post: 'string', // 岗位
        status: 1 // 权限
      }])
    }, 3000)
  }
}
export default {
  // 表示允许  使用namespaced方法使用该模块，必须有
  namespaced: true,
  state: apiState,
  mutations: apiMutations,
  actions: apiActions
}

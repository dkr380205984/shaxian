import { ActionContext } from 'vuex'
import { User, YarnType } from '@/types/common'
import { ApiState } from '@/types/vuex'
import { yarnType } from '@/assets/js/api'
// state
const apiState: ApiState = {
  user: {
    status: false,
    arr: []
  },
  yarnType: {
    status: false,
    arr: []
  }
}
// mutations
const apiMutations = {
  getUser(state: ApiState, user: User[]) {
    state.user.status = true
    state.user.arr = user
  },
  getYarnType(state: ApiState, yarnTypeSelf: YarnType[]) {
    state.yarnType.status = true
    state.yarnType.arr = yarnTypeSelf
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
  },
  getYarnTypeAsync(content: ActionContext<ApiState, any>) {
    yarnType.list().then((res) => {
      if (res.data.status) {
        content.commit('getYarnType', res.data.data)
      }
    })
  }
}
export default {
  // 表示允许  使用namespaced方法使用该模块，必须有
  namespaced: true,
  state: apiState,
  mutations: apiMutations,
  actions: apiActions
}

import { ActionContext } from 'vuex'
import { User, YarnType, Color, PartyB } from '@/types/common'
import { ApiState } from '@/types/vuex'
import { partyB, yarnType, yarnColor } from '@/assets/js/api'
// state
const apiState: ApiState = {
  user: {
    status: false,
    arr: []
  },
  yarnType: {
    status: false,
    arr: []
  },
  yarnColor: {
    status: false,
    arr: []
  },
  client: {
    status: false,
    arr: []
  },
  factory: {
    status: false,
    arr: []
  },
  supplier: {
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
  },
  getYarnColor(state: ApiState, yarnColorSelf: Color[]) {
    state.yarnColor.status = true
    state.yarnColor.arr = yarnColorSelf
  },
  getPartyB(state: ApiState, partyBSelf: PartyB[]) {
    state.client.status = true
    state.factory.status = true
    state.supplier.status = true
    state.client.arr = partyBSelf.filter((itemF: PartyB) => itemF.type === 1)
    state.factory.arr = partyBSelf.filter((itemF: PartyB) => itemF.type === 2)
    state.supplier.arr = partyBSelf.filter((itemF: PartyB) => itemF.type === 3)
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
      if (res.data.status !== false) {
        content.commit('getYarnType', res.data.data)
      }
    })
  },
  getYarnColorAsync(content: ActionContext<ApiState, any>) {
    yarnColor.list().then((res) => {
      if (res.data.status !== false) {
        content.commit('getYarnColor', res.data.data)
      }
    })
  },
  getPartyBAsync(content: ActionContext<ApiState, any>) {
    partyB.list().then((res) => {
      if (res.data.status !== false) {
        content.commit('getPartyB', res.data.data)
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

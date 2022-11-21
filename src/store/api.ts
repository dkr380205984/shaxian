import { ActionContext } from 'vuex'
import { User, YarnType, Color, PartyB, MaterialType } from '@/types/common'
import { StoreCreateParams } from '@/types/store'
import { ApiState } from '@/types/vuex'
import { partyB, yarnType, yarnColor, store, material, user } from '@/assets/js/api'
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
  allClient: {
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
  },
  storeHouse: {
    status: false,
    arr: []
  },
  materialType: {
    status: false,
    arr: []
  }
}
// mutations
const apiMutations = {
  getUser(state: ApiState, userSelf: User[]) {
    state.user.status = true
    state.user.arr = userSelf
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
    state.allClient.status = true
    state.allClient.arr = partyBSelf
    state.client.arr = partyBSelf.filter((itemF: PartyB) => itemF.type === 1)
    state.factory.arr = partyBSelf.filter((itemF: PartyB) => itemF.type === 2)
    state.supplier.arr = partyBSelf.filter((itemF: PartyB) => itemF.type === 3)
  },
  getStore(state: ApiState, storeHouse: StoreCreateParams[]) {
    state.storeHouse.status = true
    state.storeHouse.arr = storeHouse
  },
  getMaterialType(state: ApiState, materialType: MaterialType[]) {
    state.materialType.status = true
    state.materialType.arr = materialType
  }
}
// actions
const apiActions = {
  getUserAsync(content: ActionContext<ApiState, any>) {
    user.list().then((res) => {
      if (res.data.status) {
        content.commit('getUser', res.data.data)
      }
    })
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
    partyB.list({status: 1}).then((res) => {
      if (res.data.status !== false) {
        content.commit('getPartyB', res.data.data)
      }
    })
  },
  getStoreAsync(content: ActionContext<ApiState, any>) {
    store.list().then((res) => {
      if (res.data.status !== false) {
        content.commit('getStore', res.data.data)
      }
    })
  },
  getMaterialTypeAsync(content: ActionContext<ApiState, any>) {
    material.typeList().then((res) => {
      if (res.data.status !== false) {
        content.commit('getMaterialType', res.data.data)
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

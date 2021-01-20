// 该模块用于管理公共状态，基本没什么用
const state = {
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
}
export default {
  // 表示允许  使用namespaced方法使用该模块，必须有
  namespaced: true,
  ...state
}

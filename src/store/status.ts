// 该模块用于管理公共状态，基本没什么用
interface State {
  breadUrl: BreadUrl[]
}
interface BreadUrl {
  url: string
  name: string
}
const statusState: State = {
  breadUrl: []
}

const statusMutations = {
  // 这个路由逻辑有问题，有时间修复
  getBreadUrl(state: State, breadUrl: BreadUrl) {
    // 判断要去的路由是不是等于上一个页面的路由，如果是上一个路由就去掉最后一个，模拟返回操作
    if (state.breadUrl.length > 1 && breadUrl.name === state.breadUrl[state.breadUrl.length - 2].name) {
      state.breadUrl.pop()
    } else {
      if (state.breadUrl.length > 10) {
        state.breadUrl.shift()
      }
      state.breadUrl.push(breadUrl)
    }

  }
}
export default {
  // 表示允许  使用namespaced方法使用该模块，必须有
  namespaced: true,
  state: statusState,
  mutations: statusMutations
}

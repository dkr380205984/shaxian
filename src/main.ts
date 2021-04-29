import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import plugin from '@/assets/js/plugin'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import mycomponent from './components'
Vue.prototype.window = window
Vue.config.productionTip = false;
Vue.use(mycomponent)
Vue.use(plugin)
Vue.use(ElementUI)
// 审核公共图
Vue.filter('checkFilter', (val: 0 | 1 | 2 | null) => {
  const index = Number(val) || 0
  const imgArr = [
    require('@/assets/image/common/waiting.png'),
    require('@/assets/image/common/pass.png'),
    require('@/assets/image/common/return.png')
  ]
  return imgArr[index]
})
// 订单公共状态
Vue.filter('orderStatusFilter', (val: 1 | 2 | 3) => {
  const statusArr = ['未知', '已创建', '进行中', '已完成']
  return statusArr[val]
})
// 审核状态
Vue.filter('orderCheckFilter', (val: 0 | 1 | 2 | null) => {
  const index = Number(val) || 0
  const statusArr = ['待审核', '已通过', '已驳回']
  return statusArr[index]
})
// 出入库操作类型
Vue.filter('stockTypeFilter', (val: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) => {
  const statusArr = ['未知', '仓库入库', '仓库出库', '订购入库', '调取出库', '加工回库', '加工出库', '订购出库', '工艺单入库', '订单发货', '移库出库', '移库入库']
  return statusArr[val]
})
// 票据类型
Vue.filter('ticketFilter', (val: 1 | 2 | 3 | 4 | 5) => {
  const statusArr = ['', '纱线订购', '纱线加工', '毛条订购', '毛条加工', '订单票据']
  return statusArr[val]
})
// 纱线类型
Vue.filter('yarnTypeFilter', (val: any[]) => {
  return val.map((item) => item.type_name).join(',')
})
// 注册公共方法后需要声明
type regNormal = 'isNum' | 'isEmail' | 'isPhone' | 'isNull'
interface CheckCommonInfo {
  checkWhich: string // 需要的公告数据
  getInfoMethed?: string // commit or dispatch,api一般都是异步，用dispatch调用，status一般是同步，用commit调用,默认就是dispatch
  getInfoApi: string // 没有公共数据的时候需要调用的函数
}
declare module 'vue/types/vue' {
  interface Vue {
    $getHash: any
    $getDataType: any
    $mergeData: any
    $clone<T extends any[]>(data: T): T
    $diffDate(date: DateConstructor): string
    $diffByDate(date: DateConstructor): string | number
    $getDate(date?: Date, connector?: string): string
    $downloadExcel(data: any[], mapTitle: Array<{ title: string, key: string }>, excelName: string): void
    $addItem<T>(father: T[], son: T): void
    $deleteItem(father: any[], index: number | string): void
    $checkCommonInfo(info: CheckCommonInfo[]): void
    $flatten(data: any[]): any[]
    $formCheck(
      data: any,
      checkArr: Array<{ key: string, errMsg?: string, regExp?: RegExp, regNormal?: regNormal }>
    ): boolean
  }
}

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');

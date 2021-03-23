import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import plugin from '@/assets/js/plugin'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import mycomponent from './components'
Vue.config.productionTip = false;
Vue.use(mycomponent)
Vue.use(plugin)
Vue.use(ElementUI)
// 注册公共方法后需要声明
type regNormal = 'isNum' | 'isEmail' | 'isPhone' | 'isNull'
interface CheckCommonInfo {
  checkWhich: string // 需要的公告数据
  getInfoMethed?: string // commit or dispatch,api一般都是异步，用dispatch调用，status一般是同步，用commit调用,默认就是dispatch
  getInfoApi: string // 没有公共数据的时候需要调用的函数
}
declare module 'vue/types/vue' {
  interface Vue {
    $getHash: any,
    $clone: any,
    $getDataType: any
    $mergeData: any
    $diffDate: any
    $getDate: any
    $downloadExcel: any
    $addItem: any
    $deleteItem: any
    $checkCommonInfo(info: CheckCommonInfo[]): void
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

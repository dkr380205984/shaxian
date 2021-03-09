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
declare module 'vue/types/vue' {
  interface Vue {
    $getHash: any,
    $clone: any,
    $getDataType: any
    $mergeData: any
    $diffDate: any
    $getDate: any
    $downloadExcel: any
    $checkCommonInfo: any
    $addItem: any
    $deleteItem: any
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

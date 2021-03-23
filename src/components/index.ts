import sort from './sort/sort.vue'
import deduct from './deduct/deduct.vue'
import deductDetail from './deduct/deductDetail.vue'
export default {
  install: (vue: any) => {
    vue.component('sort', sort)
    vue.component('deduct', deduct)
    vue.component('deductDetail', deductDetail)
  }
}

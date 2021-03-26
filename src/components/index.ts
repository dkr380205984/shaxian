import sort from './sort/sort.vue'
import deduct from './deduct/deduct.vue'
import deductDetail from './deduct/deductDetail.vue'
import extraFee from './extraFee/extraFee.vue'
import check from './check/check.vue'
import checkDetail from './check/checkDetail.vue'
export default {
  install: (vue: any) => {
    vue.component('sort', sort)
    vue.component('deduct', deduct)
    vue.component('deductDetail', deductDetail)
    vue.component('extraFee', extraFee)
    vue.component('check', check)
    vue.component('checkDetail', checkDetail)
  }
}

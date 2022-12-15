import sort from './sort/sort.vue'
import deduct from './deduct/deduct.vue'
import deductDetail from './deduct/deductDetail.vue'
import extraFee from './extraFee/extraFee.vue'
import check from './check/check.vue'
import checkDetail from './check/checkDetail.vue'
import inAndOut from './inAndOut/inAndOut.vue'
import inAndOutMat from './inAndOut/inAndOutMat.vue'
import bill from './bill/bill.vue'
import collection from './collection/collection.vue'
import relatedInfo from './relatedInfo/relatedInfo.vue'
import productCreate from './productCreate/productCreate.vue'
import shaxianAddPO from './shaxianAddPO/shaxianAddPO.vue'
import yarnStoreSelect from './yarnStoreSelect/yarnStoreSelect.vue'
import addTransProcess from './addTransProcess/addTransProcess.vue'
import zhList from './zhList/zhList.vue'
import zhListSetting from './zhListSetting/zhListSetting.vue'
import othersFeeData from './othersFeeData/othersFeeData.vue'
import addMaterial from './addMaterial/addMaterial.vue'
import zhCharts from './zhCharts/zhCharts.vue'
export default {
  install: (vue: any) => {
    vue.component('sort', sort)
    vue.component('deduct', deduct)
    vue.component('deductDetail', deductDetail)
    vue.component('extraFee', extraFee)
    vue.component('check', check)
    vue.component('checkDetail', checkDetail)
    vue.component('inAndOut', inAndOut)
    vue.component('inAndOutMat', inAndOutMat)
    vue.component('bill', bill)
    vue.component('collection', collection)
    vue.component('relatedInfo', relatedInfo)
    vue.component('productCreate', productCreate)
    vue.component('shaxianAddPO', shaxianAddPO)
    vue.component('yarnStoreSelect', yarnStoreSelect)
    vue.component('addTransProcess', addTransProcess)
    vue.component('zhList', zhList)
    vue.component('zhListSetting', zhListSetting)
    vue.component('addTransProcess', addTransProcess)
    vue.component('othersFeeData', othersFeeData)
    vue.component('addMaterial', addMaterial)
    vue.component('zhCharts', zhCharts)
  }
}

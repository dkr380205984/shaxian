import Vue from 'vue';
import Vuex from 'vuex';
import api from './api'
import status from './status'
Vue.use(Vuex);

export default new Vuex.Store({
  strict: true, // 严格模式，不然state可直接修改并且不报错
  modules: {
    api,
    status
  }
})

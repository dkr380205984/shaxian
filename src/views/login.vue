<template>
  <div>login
    <button @click="goRouter">跳转到首页</button>
  </div>
</template>

<script lang="ts">
import { login } from '@/assets/js/api'
import { Vue } from 'vue-property-decorator'
export default Vue.extend({
  methods: {
    goRouter() {
      login({
        user_name: '17602103060 ',
        password: '1234567'
      }).then((res) => {
        if (res.data.status !== false) {
          window.sessionStorage.setItem('token_type', res.data.data.token_type)
          window.sessionStorage.setItem('token', res.data.data.access_token)
          const { authInfo } = require('@/assets/js/api')
          authInfo().then((res: any) => {
            if (res.data.status !== false) {
              this.$router.push('/homePage/homePage')
            }
          })
        }
      })
    }
  }
})
</script>

<style>
</style>
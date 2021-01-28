<template>
  <div>login
    <button @click="goRouter">跳转到首页</button>
  </div>
</template>

<script lang="ts">
import { login } from '@/assets/js/api'
import { Vue } from 'vue-property-decorator'
import { login } from '@/assets/js/api'
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
  },
  mounted() {
    this.$store.dispatch('api/getUserAsync')
    login({
      user_name: '17602103060',
      password: '1234567'
    }).then((res) => {
      window.sessionStorage.setItem('token', res.data.data.access_token)
      window.sessionStorage.setItem('token_type', res.data.data.token_type)
      console.log(res)
    })
  }
})
</script>

<style>
</style>
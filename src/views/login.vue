<template>
  <div>login
    <button @click="goRouter">跳转到首页</button>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
export default Vue.extend({
  methods: {
    goRouter() {
      console.log('fuck')
      this.$router.push('/homePage/homePage')
    }
  },
  mounted() {
    this.$store.dispatch('api/getUserAsync')
  }
})
</script>

<style>
</style>
<template>
  <div>login</div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
export default Vue.extend({
  mounted() {
    this.$store.dispatch('api/getUserAsync')
  }
})
</script>

<style>
</style>
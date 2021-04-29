<template>
  <!-- 0 不排序 1 升序 2 降序 -->
  <div class="sortCtn">
    <i class="el-icon-caret-top"
      :class="{'blue':value===1}"
      @click="changeStatus(1)"></i>
    <i class="el-icon-caret-bottom"
      :class="{'blue':value===2}"
      @click="changeStatus(2)"></i>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Sort extends Vue {
  @Prop({ default: 0 }) value?: number
  changeStatus(status: number): void {
    const realStatus = this.value === status ? 0 : status // 连点两下代表清除排序
    this.$emit('beforeChange', realStatus) // 触发这个事件主要是为了一个页面有多个排序的时候清除其他的排序条件
    this.$emit('input', realStatus)
  }
}
</script>

<style lang="less" scoped>
@import './sort.less';
</style>
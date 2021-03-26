<template>
  <div class="extraFeeCtn popup"
    v-if="show">
    <div class="main">
      <div class="titleCtn">
        <span class="text">额外费用</span>
        <i class="close_icon el-icon-close"
          @click="reset"></i>
      </div>
      <div class="contentCtn">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">额外费用名称</div>
              <div class="tcolumn">额外费用金额</div>
              <div class="tcolumn">额外费用备注</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in feeArr"
              :key="index">
              <div class="tcolumn">{{item.name}}</div>
              <div class="tcolumn">{{item.price}}元</div>
              <div class="tcolumn">{{item.desc}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
// 额外费用
interface AditionalFee {
  name: string
  price: string
  desc: string
}
@Component
export default class ExtraFee extends Vue {
  @Prop() show!: boolean
  @Prop() feeArr!: AditionalFee[]
  reset() {
    this.$emit('update:show', false)
  }
}
</script>

<style lang="less" scoped>
@import './extraFee.less';
</style>
<template>
  <div class="deductCtn popup"
    v-if="show">
    <div class="main">
      <div class="titleCtn">
        <span class="text">扣款详情</span>
        <i class="close_icon el-icon-close"
          @click="reset"></i>
      </div>
      <div class="contentCtn">
        <div class="row">
          <div class="label">扣款单号：</div>
          <div class="info text"
            style="color:#1a95ff">{{deductInfo.code}}</div>
        </div>
        <div class="row">
          <div class="label">扣款金额：</div>
          <div class="info text">{{deductInfo.total_price}}</div>
        </div>
        <div class="row"
          v-for="(item,index) in JSON.parse(deductInfo.deduct_content)"
          :key="index">
          <div class="label">具体扣款项：</div>
          <div class="info text">{{item.name}} {{item.price}}</div>
        </div>
        <div class="row">
          <div class="label">补充说明：</div>
          <div class="info text"></div>
        </div>
        <div class="row">
          <div class="label">备注信息：</div>
          <div class="info text">{{deductInfo.desc}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DeductInfo } from '@/types/common'
@Component
export default class DeductDetail extends Vue {
  @Prop() show!: boolean
  @Prop() deductInfo!: DeductInfo
  reset() {
    this.$emit('update:show', false)
  }
}
</script>

<style lang="less" scoped>
@import './deductDetail.less';
</style>
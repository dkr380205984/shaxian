<template>
  <div class="relatedInfoCtn popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <span class="text">关联单据信息</span>
        <i class="close_icon el-icon-close"
          @click="reset"></i>
      </div>
      <div class="contentCtn">
        <div class="row">
          <div class="label">关联类型：</div>
          <div class="info text">{{ type | ticketFilter}}</div>
        </div>
        <div class="row">
          <div class="label">关联单号：</div>
          <div class="info text"
            style="color:#1a95ff">
            <span style="cursor:pointer;margin-right:8px"
              v-for="item in data"
              :key="item.code"
              @click="goRoute">{{item.code}}</span>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <div class="opr"
          @click="reset">关闭</div>
        <div class="opr blue"
          @click="reset">确认</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class RelatedInfo extends Vue {
  @Prop() type!: number
  @Prop() show!: boolean
  @Prop() data!: Array<{
    code: string
  }>

  goRoute() {
    this.$message.warning('暂不支持跳转')
  }
  reset() {
    this.$emit('update:show', false)
  }
}
</script>

<style lang="less" scoped>
@import './relatedInfo.less';
</style>
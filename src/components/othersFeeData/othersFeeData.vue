<template>
  <div class="othersFeeData">
    <span :class="data.length>0&&data[0].price>0?'blue':'gray'"
      @click="data.length>0&&data[0].price>0?lookDetail=true:''"
      :style="{'cursor':data.length>0&&data[0].price>0?'pointer':''}">{{data.length>0&&data[0].price?'查看额外费用':'无额外费用'}}</span>
    <div class="popup"
      v-show="lookDetail">
      <div class="main">
        <div class="titleCtn">
          <div class="text">额外费用</div>
          <div class="closeCtn"
            @click="lookDetail=false">
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div style="max-height: 60vh;overflow-y:scroll">
          <div class="contentCtn"
            v-for="(item,index) in data"
            :key="index">
            <div class="row">
              <div class="label">费用名称：</div>
              <div class="info">
                {{item.name || '无'}}
              </div>
            </div>
            <div class="row">
              <div class="label">费用价格：</div>
              <div class="info blue">
                {{item.price || '无'}}元
              </div>
            </div>
            <div class="row">
              <div class="label">备注信息：</div>
              <div class="info">
                {{item.desc || '无'}}
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="btn borderBtn"
            @click="lookDetail=false">取消</div>
          <div class="btn backHoverBlue"
            @click="lookDetail=false">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    data: {
      type: Array,
      required: true,
      default: []
    }
  },
  data() {
    return {
      lookDetail: false
    }
  }
})
</script>

<style lang="less" scoped>
@import './othersFeeData.less';
</style>
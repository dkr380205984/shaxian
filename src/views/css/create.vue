<template>
  <div class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">添加纱线</span>
      </div>
      <div class="createCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">纱线颜色</span>
              <span class="explanation">(不填则默认为白胚)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input placeholder="请输入纱线颜色"
                  v-model="value"></el-input>
              </div>
              <div class="editBtn addBtn">添加颜色</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      value: ''
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/css/create.less';
</style>
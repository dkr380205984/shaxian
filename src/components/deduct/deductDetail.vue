<template>
  <div class="deductCtn popup"
    v-if="show">
    <div class="main"
      style="width:766px">
      <div class="titleCtn">
        <span class="text">扣款详情</span>
        <i class="close_icon el-icon-close"
          @click="reset"></i>
      </div>
      <div class="contentCtn">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">扣款单号</div>
              <div class="tcolumn noPad"
                style="flex:3">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:2">扣款项</div>
                  <div class="tcolumn">扣款金额</div>
                </div>
              </div>
              <div class="tcolumn">扣款总额</div>
              <div class="tcolumn">补充说明</div>
              <div class="tcolumn">扣款备注</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in selfInfo"
              :key="index">
              <div class="tcolumn blue">{{item.code}}</div>
              <div class="tcolumn noPad"
                style="flex:3">
                <div class="trow"
                  v-for="(itemChild,indexChild) in item.deduct_content?JSON.parse(item.deduct_content):[]"
                  :key="indexChild">
                  <div class="tcolumn"
                    style="flex:2">{{itemChild.yarn}}</div>
                  <div class="tcolumn">{{itemChild.price}}元</div>
                </div>
              </div>
              <div class="tcolumn blue">{{item.total_price}}元</div>
              <div class="tcolumn">
                <el-image style="width: 50px; height: 50px;line-height:50px;text-align:center;font-size:22px"
                  :src="item.deduct_file"
                  :preview-src-list="[item.deduct_file]">
                  <div slot="error"
                    class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
              <div class="tcolumn">{{item.desc}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { DeductInfo } from '@/types/common'
import { deduct } from '@/assets/js/api'
@Component
export default class DeductDetail extends Vue {
  @Prop() show!: boolean
  @Prop() pid?: number
  @Prop() deductType?: 1 | 2 | 3 | 4 | 5
  @Prop() deductInfo?: DeductInfo
  selfInfo: DeductInfo[] = [
    {
      deduct_type: 1,
      deduct_content: '',
      pid: '',
      code: '',
      deduct_file: '',
      total_price: '',
      desc: ''
    }
  ]
  reset() {
    this.$emit('update:show', false)
  }
  @Watch('show')
  getInfo(val: boolean) {
    if (val) {
      if (this.pid) {
        deduct
          .list({
            pid: this.pid,
            deduct_type: this.deductType
          })
          .then((res) => {
            this.selfInfo = res.data.data
          })
      } else {
        this.selfInfo = [this.deductInfo!]
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './deductDetail.less';
</style>
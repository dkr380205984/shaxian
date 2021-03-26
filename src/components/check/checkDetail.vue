<template>
  <div class="popup"
    v-if="show">
    <div class="main"
      style="width:766px">
      <div class="titleCtn">
        <div class="text">审核信息</div>
        <i class="el-icon-close"
          @click="reset"></i>
      </div>
      <div class="contentCtn">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">审核时间</div>
              <div class="tcolumn">审核人</div>
              <div class="tcolumn">审核信息</div>
              <div class="tcolumn"
                style="flex:2">驳回理由</div>
              <div class="tcolumn"
                style="flex:1.5">备注信息</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in checkArr"
              :key="index">
              <div class="tcolumn">{{item.check_time}}</div>
              <div class="tcolumn">{{item.check_user}}</div>
              <div class="tcolumn">{{item.is_check|orderCheckFilter}}</div>
              <div class="tcolumn"
                style="flex:2">{{item.check_desc || '无'}}</div>
              <div class="tcolumn"
                style="flex:1.5">{{item.desc  || '无'}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <div class="opr blue"
          @click="reset">确定</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { check } from '@/assets/js/api'
@Component
export default class CheckDetail extends Vue {
  @Prop() show!: boolean
  @Prop() pid!: number | string
  @Prop() checkType!: 1 | 2 | 3 | 4 | 5 | 6 | 7
  checkArr: any[] = []
  reset() {
    this.$emit('update:show', false)
  }

  @Watch('show')
  getList(val: boolean) {
    if (val) {
      check
        .list({
          pid: this.pid,
          check_type: this.checkType
        })
        .then((res) => {
          this.checkArr = res.data.data
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import './checkDeatil.less';
</style>
<template>
  <div id='store'
    class='printHtml'>
    <div class="printTable crosswise">
      <div class="print_body">
        <div class="print_row">
          <div class="row_item center"
            style="height:60px">{{companyName}}</div>
        </div>
        <div class="print_row bgGray">
          <div class="row_item center">序号</div>
          <div class="row_item center flex30">毛条名称</div>
          <div class="row_item col"
            style="flex:6">
            <div class="print_row noBorder">
              <div class="row_item center">批号</div>
              <div class="row_item center">数量</div>
              <div class="row_item center">件数</div>
            </div>
          </div>
        </div>
        <div class="print_row"
          v-for="(itemYarn,indexYarn) in stockYarnArr"
          :key="indexYarn">
          <div class="row_item center">{{indexYarn + 1}}</div>
          <div class="row_item center flex30">{{itemYarn.name}}</div>
          <div class="row_item col"
            style="flex:6">
            <div class="print_row noBorder"
              v-for="(itemOther,indexOther) in itemYarn.other_info"
              :key="indexOther">
              <div class="row_item center">{{itemOther.batch_code}}</div>
              <div class="row_item center">{{itemOther.action_weight || 0}}KG</div>
              <div class="row_item center">{{itemOther.item || 0}}件</div>
            </div>
          </div>
        </div>
      </div>
      <div class="print_row print_remark"
        style="flex-direction:column">
        <div class="print_row noBorder">
          <div class="row_item center w180">{{$route.params.type === '1' ? '入' : '出'}}库单号</div>
          <div class="row_item center">{{stockInfo.code}}</div>
          <div class="row_item center w180">{{$route.params.type === '1' ? '入' : '出'}}库日期</div>
          <div class="row_item center">{{$getDate(stockInfo.create_time)}}</div>
          <div class="row_item center w180">操作人</div>
          <div class="row_item center">{{stockInfo.user_name}}</div>
        </div>
        <div class="print_row">
          <div class="row_item center w180">总数量</div>
          <div class="row_item center">{{totalCom}}</div>
          <div class="row_item center w180">{{$route.params.type === '1' ? '入' : '出'}}库仓库</div>
          <div class="row_item center">{{`${stockInfo.second_store_name}/${stockInfo.store_name}`}}</div>
          <div class="row_item center w180">{{$route.params.type === '1' ? '入' : '出'}}库单位</div>
          <div class="row_item center">{{stockInfo.client_name}}</div>
        </div>
        <div class="print_row">
          <div class="row_item center w180">页码</div>
          <div class="row_item"></div>
          <div class="row_item center w180">备注信息</div>
          <div class="row_item"></div>
          <div class="row_item center w180">管理员签字</div>
          <div class="row_item"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { printList } from '@/assets/js/settingCommon'
import { stock } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [key: string]: any
  } {
    return {
      companyName: '',
      stockInfo: {},
      stockYarnArr: []
    }
  },
  methods: {},
  created() {
    Promise.all([
      stock.materialDetail({
        id: +this.$route.query.documentId
      }),
      printList(undefined, this.$route.params.type === '1' ? 8 : 9)
    ]).then((res) => {
      this.companyName = (res[1] as any).title
      this.stockInfo = res[0].data.data
      this.stockYarnArr = this.stockInfo.child_data
        ? this.$mergeData(this.stockInfo.child_data, { mainRule: 'name', childrenName: 'other_info' })
        : []
    })
  },
  computed: {
    totalCom(): number {
      return this.stockYarnArr
        .map((itemN: any) => {
          return itemN.other_info.map((itemM: any) => {
            return +itemM.action_weight || 0
          })
        })
        .flat(1)
        .reduce((total: number, current: number) => total + current, 0)
    }
  }
})
</script>

<style scoped lang='less'>
@import '~@/assets/less/print/store.less';
</style>
 
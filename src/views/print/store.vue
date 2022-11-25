<template>
  <div id='store'
    class='printHtml'>
    <div class="printTable crosswise">
      <div class="print_body">
        <div class="print_row">
          <div class="row_item center title"
            style="height:60px">{{companyName}}</div>
        </div>
        <div class="print_row bgGray">
          <div class="row_item center">序号</div>
          <div class="row_item center flex30">纱线名称</div>
          <div class="row_item flex80 col">
            <div class="print_row noBorder">
              <div class="row_item center flex20">纱线颜色</div>
              <div class="row_item center">属性</div>
              <div class="row_item center">批号</div>
              <div class="row_item center">色号</div>
              <div class="row_item center">缸号</div>
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
          <div class="row_item flex80 col">
            <div class="print_row noBorder"
              v-for="(itemOther,indexOther) in itemYarn.other_info"
              :key="indexOther">
              <div class="row_item center flex20">{{itemOther.color}}</div>
              <div class="row_item center">{{itemOther.attribute}}</div>
              <div class="row_item center">{{itemOther.batch_code}}</div>
              <div class="row_item center">{{itemOther.color_code}}</div>
              <div class="row_item center">{{itemOther.vat_code}}</div>
              <div class="row_item center">{{itemOther.action_weight || 0}}KG</div>
              <div class="row_item center">{{itemOther.item || 0}}件</div>
            </div>
          </div>
        </div>
      </div>
      <div class="print_row print_remark"
        style="flex-direction:column">
        <div class="print_row noBorder">
          <div class="row_item center w180">{{actionName}}单号</div>
          <div class="row_item center">{{stockInfo.code}}</div>
          <div class="row_item center w180">{{actionName}}日期</div>
          <div class="row_item center">{{$getDate(stockInfo.create_time)}}</div>
          <div class="row_item center w180">操作人</div>
          <div class="row_item center">{{stockInfo.user_name}}</div>
        </div>
        <div class="print_row">
          <div class="row_item center w180">总数量</div>
          <div class="row_item center">{{totalCom}}</div>
          <div class="row_item center w180">{{(actionType === 10 || actionType === 11) ? '来源仓库' : `${actionName}仓库`}}</div>
          <div class="row_item center">{{`${stockInfo.second_store_name}/${stockInfo.store_name}`}}</div>
          <div class="row_item center w180">{{(actionType === 10 || actionType === 11) ? '出库仓库' : `${actionName}单位`}}</div>
          <div class="row_item center">{{(actionType === 10 || actionType === 11) ? `${stockInfo.move_second_store_name}/${stockInfo.move_store_name}` : stockInfo.client_name}}</div>
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
      stock.detail({
        id: +this.$route.params.documentId
      }),
      printList(undefined, this.actionType === 10 || this.actionType === 1 ? 4 : 5)
    ]).then((res) => {
      this.stockInfo = res[0].data.data
      this.stockYarnArr = this.stockInfo.child_data
        ? this.$mergeData(this.stockInfo.child_data, { mainRule: 'name', childrenName: 'other_info' })
        : []
      this.companyName = (res[1] as any).title
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
    },
    actionType(): number {
      if (this.$route.params.type === '10') {
        return 10
      } else if (this.$route.params.type === '11') {
        return 11
      } else if (['1', '3', '5', '8'].includes(this.$route.params.type)) {
        return 1
      } else if (['2', '4', '6', '7', '9'].includes(this.$route.params.type)) {
        return 2
      } else {
        return NaN
      }
    },
    actionName(): string {
      switch (this.actionType) {
        case 1:
          return '入库'
        case 2:
          return '出库'
        case 10:
          return '移库入库'
        case 11:
          return '移库出库'
        default:
          return ''
      }
    }
  }
})
</script>

<style scoped lang='less'>
@import '~@/assets/less/print/store.less';
</style>
 
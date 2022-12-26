<template>
  <div id='orderYarnFC'
    class='printHtml'>
    <div class="printTable">
      <div class="print_head" style="height:unset">
        <div style="width:100%;font-size: 31px;text-align: center;font-weight:bold">
          {{ companyName }}
        </div>
      </div>
      <div class="print_head">
        <div class="left">
          <span class="item">
            <span class="label">采购单号：</span>
            {{documentInfo.code}}
          </span>
          <span class="item">
            <span class="label">操作人/时间：</span>
            {{`${documentInfo.user_name},${$getDate(documentInfo.create_time)}`}}
          </span>
          <span class="item">
            <span class="label">打印人/时间：</span>
            {{print_user}},{{$getDate()}}
          </span>
        </div>
        <div class="left">
          <span class="item">
            <span class="label">结算方式：</span>
            {{documentInfo.settle_type}}
          </span>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row has_marginBottom"
          v-if="$route.query.orderId">
          <div class="row_item center w180">客户单号</div>
          <div class="row_item center">{{orderInfo.code}}</div>
          <div class="row_item center w180">下单公司</div>
          <div class="row_item center">{{orderInfo.client_name}}</div>
        </div>
        <div class="print_row">
          <div class="row_item center w180">采购单位</div>
          <div class="row_item center">{{documentInfo.client_name}}</div>
          <div class="row_item center w180">审核状态</div>
          <div class="row_item center">{{documentInfo.is_check === 0 ? '审核中' : '审核通过'}}</div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item center w180">采购总价</div>
          <div class="row_item center">{{documentInfo.total_price || 0}}元</div>
          <div class="row_item center w180">截止交货日期</div>
          <div class="row_item center">{{documentInfo.delivery_time}}</div>
        </div>
        <div class="print_row bgGray">
          <div class="row_item center">序号</div>
          <div class="row_item center flex30">纱线名称</div>
          <div class="row_item flex80 col">
            <div class="print_row noBorder">
              <span class="row_item center">纱线颜色</span>
              <span class="row_item center">纱线属性</span>
              <span class="row_item center">采购单价</span>
              <span class="row_item center">计划采购数量</span>
            </div>
          </div>
        </div>
        <div class="print_row"
          v-for="(itemYarn,indexYarn) in yarnOrderArr"
          :key="indexYarn">
          <div class="row_item center">{{indexYarn + 1}}</div>
          <div class="row_item center flex30">{{itemYarn.name}}</div>
          <div class="row_item flex80 col">
            <div :class="`print_row ${indexColor === 0 && 'noBorder'}`"
              v-for="(itemColor,indexColor) in itemYarn.color_info"
              :key="`order_${indexColor}`">
              <span class="row_item center">{{itemColor.color}}</span>
              <span class="row_item center">{{itemColor.attribute}}</span>
              <span class="row_item center">{{itemColor.price || 0}}元</span>
              <span class="row_item center">{{itemColor.weight || 0}}KG</span>
            </div>
          </div>
        </div>
        <div class="print_row has_marginBottom bgGray">
          <div class="row_item center flex40"
            style="border-left:1px solid transparent">合计</div>
          <div class="row_item flex80 col">
            <div class="print_row noBorder">
              <span class="row_item center flex30"
                style="border-left:1px solid transparent">{{totalCom.orderPrice || 0}}元</span>
              <span class="row_item center">{{totalCom.orderWeight}}KG</span>
            </div>
          </div>
        </div>
        <template v-if="otherFeeArr > 0">
          <div class="print_row bgGray">
            <div class="row_item center">序号</div>
            <div class="row_item center flex30">其它费用名称</div>
            <div class="row_item center flex40">费用金额</div>
            <div class="row_item center flex40">费用描述</div>
          </div>
          <div class="print_row"
            v-for="(itemOther,indexOther) in otherFeeArr"
            :key="`other_${indexOther}`">
            <div class="row_item center">{{indexOther + 1}}</div>
            <div class="row_item center flex30">{{itemOther.name}}</div>
            <div class="row_item center flex40">{{itemOther.price || 0}}元</div>
            <div class="row_item center flex40">{{itemOther.desc}}</div>
          </div>
          <div class="print_row has_marginBottom bgGray">
            <div class="row_item center flex40"
              style="border-left:1px solid transparent">合计</div>
            <div class="row_item flex80 center">{{totalCom.otherPrice || 0}}元</div>
          </div>
        </template>
      </div>
      <div class="print_row print_remark"
        style="flex-direction:column">
        <div class="print_row noBorder">
          <div class="row_item center w180"
            style="height:60px">采购备注</div>
          <div class="row_item"></div>
        </div>
        <div class="print_row">
          <div class="row_item center w180">合同条款</div>
          <div class="remark_span left"
            style="height:80px"
            v-html="desc"></div>
        </div>
        <div class="print_row">
          <div class="row_item center w180">签字</div>
          <div class="row_item"></div>
          <div class="row_item center w180">日期</div>
          <div class="row_item"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { printList } from '@/assets/js/settingCommon'
import { order, yarnOrder } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    companyName: string
    [key: string]: any
  } {
    return {
      companyName: window.sessionStorage.getItem('full_name') + '纱线采购单',
      desc: '',
      print_user: window.sessionStorage.getItem('user_name'),
      orderInfo: {
        code: '',
        client_name: ''
      },
      documentInfo: {},
      yarnOrderArr: [],
      otherFeeArr: []
    }
  },
  created() {
    if (this.$route.query.orderId) {
      Promise.all([
        order.detail({
          id: +this.$route.query.orderId
        }),
        printList(undefined, 1)
      ]).then((res) => {
        // 初始化订单详情信息
        const orderDetail = res[0].data.data
        this.orderInfo = {
          code: orderDetail.code,
          client_name: orderDetail.client_name
        }
        // 初始化采购单数据
        this.documentInfo =
          orderDetail.purchase_log.find((itemF: any) => +itemF.id === +this.$route.params.documentId) || {}
        this.yarnOrderArr = this.documentInfo.child_data
          ? this.$mergeData(this.documentInfo.child_data, { mainRule: 'name', childrenName: 'color_info' })
          : []
        this.otherFeeArr = this.documentInfo.additional_fee ? JSON.parse(this.documentInfo.additional_fee) : []
        // 获取打印标题信息
        this.companyName = (res[1] as any).title
        this.desc = (res[1] as any).desc
      })
    } else {
      Promise.all([
        yarnOrder.detail({
          id: +this.$route.params.documentId
        }),
        printList(undefined, 1)
      ]).then((res) => {
        // 初始化采购单数据
        this.documentInfo = res[0].data.data
        this.yarnOrderArr = this.documentInfo.child_data
          ? this.$mergeData(this.documentInfo.child_data, { mainRule: 'name', childrenName: 'color_info' })
          : []
        this.otherFeeArr = this.documentInfo.additional_fee ? JSON.parse(this.documentInfo.additional_fee) : []
        // 获取打印标题信息
        this.companyName = (res[1] as any).title
        this.desc = (res[1] as any).desc
        this.settle_type = (res[1] as any).settle_type
      })
    }
  },
  computed: {
    totalCom(): {
      orderPrice: number
      orderWeight: number
      otherPrice: number
    } {
      return {
        orderPrice: this.$toFixed(
          this.yarnOrderArr
            .map((itemM: any) => {
              return itemM.color_info.map((itemC: any) => itemC.price * itemC.weight)
            })
            .flat(1)
            .reduce((total: number, current: number) => total + current, 0)
        ),
        orderWeight: this.$toFixed(
          this.yarnOrderArr
            .map((itemM: any) => {
              return itemM.color_info.map((itemC: any) => +itemC.weight, 0)
            })
            .flat(1)
            .reduce((total: number, current: number) => total + current, 0)
        ),
        otherPrice: this.$toFixed(
          this.otherFeeArr
            .map((itemM: any) => +itemM.price || 0)
            .reduce((total: number, current: number) => total + current, 0)
        )
      }
    }
  }
})
</script>

<style scoped lang='less'>
@import '~@/assets/less/print/orderYarnFC.less';
</style>
 
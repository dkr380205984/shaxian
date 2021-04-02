<template>
  <div id='orderYarnFS'
    class='printHtml'>
    <div class="printTable">
      <div class="print_head">
        <div class="left">
          <span class="title">{{companyName}}纱线调取单</span>
          <span class="item">
            <span class="label">调取单号：</span>
            {{storeInfo.code}}
          </span>
          <span class="item">
            <span class="label">操作人/时间：</span>
            {{`${handler_user},${handler_time}`}}
          </span>
          <span class="item">
            <span class="label">打印人/时间：</span>
            {{print_user}},{{$getDate()}}
          </span>
        </div>
        <div class="right">
          <span class="text"></span>
          <span class="qrCode_box">
            <img src=""
              alt="">
          </span>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row">
          <div class="row_item center w180">客户单号</div>
          <div class="row_item center">{{orderInfo.code}}</div>
          <div class="row_item center w180">下单公司</div>
          <div class="row_item center">{{orderInfo.client_name}}</div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item center w180">下单时间</div>
          <div class="row_item center">{{orderInfo.order_time}}</div>
          <div class="row_item center w180">交货时间</div>
          <div class="row_item center">{{orderInfo.delivery_time}}</div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item center w180">调取仓库</div>
          <div class="row_item center">{{`${storeInfo.second_store_name}/${storeInfo.store_name}`}}</div>
          <div class="row_item center w180">审核状态</div>
          <div class="row_item center">{{storeInfo.is_check === 0 ? '审核中' : '审核通过'}}</div>
        </div>
        <div class="print_row bgGray">
          <div class="row_item center">序号</div>
          <div class="row_item center flex30">纱线名称</div>
          <div class="row_item flex80 col">
            <div class="print_row noBorder">
              <span class="row_item center flex20">纱线颜色</span>
              <span class="row_item center">属性</span>
              <span class="row_item center">批号</span>
              <span class="row_item center">色号</span>
              <span class="row_item center">缸号</span>
              <span class="row_item center flex20">计划调取数量</span>
            </div>
          </div>
        </div>
      </div>
      <div class="print_row print_remark"
        style="flex-direction:column">
        <div class="print_row noBorder">
          <div class="row_item center w180">调取备注</div>
          <div class="row_item"></div>
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
import { order, store } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    companyName: string
    [key: string]: any
  } {
    return {
      companyName: window.sessionStorage.getItem('full_name') || '桐庐凯瑞针纺有限公司',
      print_user: window.sessionStorage.getItem('user_name'),
      handler_user: '',
      handler_time: '',
      orderInfo: {
        code: ''
      },
      storeInfo: {}
    }
  },
  methods: {},
  created() {
    Promise.all([
      order.detail({
        id: this.$route.params.orderId
      }),
      store.orderList({
        order_id: this.$route.params.orderId
      })
    ]).then((res) => {
      // 初始化订单详情信息
      const orderDetail = res[0].data.data
      this.orderInfo = {
        code: orderDetail.code,
        client_name: orderDetail.client_name,
        order_time: orderDetail.order_time,
        delivery_time: orderDetail.delivery_time
      }
      // 初始化调取单号信息
      this.storeInfo = res[1].data.data.find((itemF: any) => +itemF.id === +this.$route.query.purchaseId) || {}
    })
  },
  mounted() {
    const qrCode = require('qrcode')
  }
})
</script>

<style scoped lang='less'>
@import '~@/assets/less/print/orderYarnFS.less';
</style>
 
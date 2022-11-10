<template>
  <div id="orderPrint" class="printHtml" style="font-size: 16px">
    <div class="printTable">
      <div class="print_head">
        <div class="left">
          <span class="title" style="font-size: 31px">{{ companyName }}</span>
          <span class="item" style="font-size: 17px">
            <span class="label">订单编号：</span>
            {{ orderInfo.code }}
          </span>
          <span class="item" style="font-size: 17px">
            <span class="label">订单创建信息：</span>
            {{ `${orderInfo.user_name},${$getDate(orderInfo.create_time)}` }}
          </span>
        </div>
        <div class="right">
          <span class="text"></span>
          <span class="qrCode_box">
            <img :src="qrCodeUrl || require('@/assets/image/noPic.jpg')" alt="" />
          </span>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row">
          <div class="row_item center bgGray flex05">客户单号</div>
          <div class="row_item center">{{ orderInfo.order_code }}</div>
          <div class="row_item center bgGray flex05">下单客户</div>
          <div class="row_item center">{{ orderInfo.client_name }}</div>
          <div class="row_item center bgGray flex05">下单日期</div>
          <div class="row_item center">{{ $getDate(orderInfo.create_time) }}</div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item center bgGray flex05">{{ orderInfo.type == 1 ? '生产' : '销售' }}总数</div>
          <div class="row_item center">{{ orderInfo.total_weight || 0 }}kg</div>
          <div class="row_item center bgGray flex05">{{ orderInfo.type == 1 ? '生产' : '销售' }}总价</div>
          <div class="row_item center">{{ orderInfo.total_price || 0 }}元</div>
          <div class="row_item center bgGray flex05" v-if="orderInfo.type == 2"></div>
          <div class="row_item center" v-if="orderInfo.type == 2"></div>
          <div class="row_item center bgGray flex05" v-if="orderInfo.type == 1">交货日期</div>
          <div class="row_item center" v-if="orderInfo.type == 1">{{ orderInfo.delivery_time }}</div>
        </div>
        <div
          v-for="(item, index) in orderInfo.product_info"
          :key="index"
          style="margin-bottom: 16px; border-bottom: 1px solid rgba(0, 0, 0, 0.25)"
        >
          <div class="print_row">
            <div class="row_item center bgGray flex05">纱线名称</div>
            <div class="row_item flex20" style="padding-left: 20px">{{ item.product_name }}</div>
            <div class="row_item center bgGray flex05">数量小计</div>
            <div class="row_item center flex05">{{ item.total_weight }}kg</div>
            <div class="row_item center bgGray flex05">金额小计</div>
            <div class="row_item center flex05">{{ item.total_price }}元</div>
          </div>
          <div class="print_row fz14">
            <div class="row_item center bgGray flex15">纱线颜色</div>
            <div class="row_item center bgGray flex07">纱线属性</div>
            <div class="row_item center bgGray flex07">数量属性</div>
            <div class="row_item center bgGray flex06" v-if="orderInfo.type == 2">批号</div>
            <div class="row_item center bgGray flex06" v-if="orderInfo.type == 2">缸号</div>
            <div class="row_item center bgGray flex06" v-if="orderInfo.type == 2">色号</div>
            <div class="row_item center bgGray flex07">{{ orderInfo.type == 2 ? '销售' : '下单' }}单价</div>
            <div class="row_item center bgGray flex15" v-if="orderInfo.type == 2">出库仓库</div>
            <div class="row_item center bgGray flex08">{{ orderInfo.type == 2 ? '销售' : '下单' }}数量</div>
            <div class="row_item center bgGray flex08" v-if="orderInfo.type == 2">销售件数</div>
          </div>
          <div
            class="print_row fz14"
            v-for="(itemChild, indexChild) in item.child_data"
            :key="indexChild + 'child_data'"
          >
            <div class="row_item center flex15">{{ itemChild.color }}</div>
            <div class="row_item center flex07">{{ itemChild.attribute }}</div>
            <div class="row_item center flex07">{{ itemChild.number_attribute }}</div>
            <div class="row_item center flex06" v-if="orderInfo.type == 2">{{ itemChild.batch_code }}</div>
            <div class="row_item center flex06" v-if="orderInfo.type == 2">{{ itemChild.vat_code }}</div>
            <div class="row_item center flex06" v-if="orderInfo.type == 2">{{ itemChild.color_code }}</div>
            <div class="row_item center flex07">{{ itemChild.price }}</div>
            <div class="row_item center flex15" v-if="orderInfo.type == 2">{{ itemChild.store }}</div>
            <div class="row_item center flex08">{{ itemChild.weight }}</div>
            <div class="row_item center flex08" v-if="orderInfo.type == 2">{{ itemChild.item }}</div>
          </div>
        </div>
        <div class="print_row" v-for="(itemFee, indexFee) in orderInfo.additional_fee" :key="'itemFee' + indexFee">
          <div class="row_item center bgGray flex05">额外费用名称</div>
          <div class="row_item center">{{ itemFee.name }}</div>
          <div class="row_item center bgGray flex05">额外费用金额</div>
          <div class="row_item center">{{ itemFee.price ? itemFee.price + '元' : '' }}</div>
          <div class="row_item center bgGray flex05">额外费用备注</div>
          <div class="row_item center">{{ itemFee.desc }}</div>
        </div>
        <div class="print_row">
          <div class="row_item center bgGray flex05">备注信息</div>
          <div class="row_item center" style="border-right: unset; flex: 4.05" v-html="orderInfo.desc"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { order } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [key: string]: any
  } {
    return {
      companyName: window.sessionStorage.getItem('full_name') + '销售订单',
      print_user: window.sessionStorage.getItem('user_name'),
      orderInfo: {},
      qrCodeUrl: '',
      stockYarnArr: []
    }
  },
  mounted() {
    const QRCode = require('qrcode')
    QRCode.toDataURL(
      window.location.origin + '/order/detail/' + this.$route.query.id,
      { errorCorrectionLevel: 'H' },
      (err: any, url: string) => {
        if (!err) {
          this.qrCodeUrl = url
        }
      }
    )
  },
  created() {
    order
      .detail({
        id: +this.$route.query.id
      })
      .then((res) => {
        this.id = res.data.data.id
        this.orderInfo = res.data.data
        this.companyName =
          window.sessionStorage.getItem('full_name') + (this.orderInfo.type == 2 ? '销售订单' : '生产订单-计划单')
        this.orderInfo.additional_fee = JSON.parse(this.orderInfo.additional_fee) || ['']
        this.orderInfo.product_info.forEach((item: any) => (item.priceNumber = (item.price || 0) * (item.weight || 0)))
        this.orderInfo.product_info = this.$mergeData(this.orderInfo.product_info, {
          mainRule: 'product_name',
          childrenName: 'child_data'
        })
        this.orderInfo.product_info.forEach((item: any) => {
          item.total_weight = item.child_data.reduce((a: any, b: any) => {
            return a + b.weight
          }, 0)
          item.total_price = item.child_data.reduce((a: any, b: any) => {
            return a + (b.weight || 0) * (b.price || 0)
          }, 0)
        })
      })
  }
})
</script>

<style scoped lang='less'>
@import '~@/assets/less/print/orderPrint.less';
</style>
 
<template>
  <div id="orderPrint" class="printHtml">
    <div class="printTable">
      <div class="print_head">
        <div class="left">
          <span class="title">{{ companyName }}</span>
          <span class="item">
            <span class="label">订单编号：</span>
            {{ orderInfo.code }}
          </span>
          <span class="item">
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
          <div class="row_item center bgGray">客户单号</div>
          <div class="row_item center w180">{{ orderInfo.order_code }}</div>
          <div class="row_item center bgGray">下单客户</div>
          <div class="row_item center w180">{{ orderInfo.client_name }}</div>
          <div class="row_item center bgGray">下单日期</div>
          <div class="row_item center w180">{{ $getDate(orderInfo.create_time) }}</div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item center bgGray">销售总数</div>
          <div class="row_item center w180">{{ orderInfo.total_weight || 0 }}kg</div>
          <div class="row_item center bgGray">销售总价</div>
          <div class="row_item center w180">{{ orderInfo.total_price || 0 }}元</div>
          <div class="row_item center bgGray"></div>
          <div class="row_item center w180"></div>
        </div>
        <div
          v-for="(item, index) in orderInfo.product_info"
          :key="index"
          style="margin-bottom: 16px; border-bottom: 1px solid rgba(0, 0, 0, 0.25)"
        >
          <div class="print_row">
            <div class="row_item center bgGray">纱线名称</div>
            <div class="row_item center flex30">{{ item.product_name }}</div>
            <div class="row_item center bgGray">数量小计</div>
            <div class="row_item center">{{ item.total_weight }}kg</div>
            <div class="row_item center bgGray">金额小计</div>
            <div class="row_item center">{{ item.total_price }}元</div>
          </div>
          <div class="print_row">
            <div class="row_item center bgGray">纱线颜色</div>
            <div class="row_item center bgGray">纱线属性</div>
            <div class="row_item center bgGray">数量属性</div>
            <div class="row_item center bgGray">批号</div>
            <div class="row_item center bgGray">缸号</div>
            <div class="row_item center bgGray">色号</div>
            <div class="row_item center bgGray">销售单价</div>
            <div class="row_item center bgGray">出库仓库</div>
            <div class="row_item center bgGray">销售数量</div>
            <div class="row_item center bgGray">销售件数</div>
          </div>
          <div class="print_row" v-for="(itemChild, indexChild) in item.child_data" :key="indexChild + 'child_data'">
            <div class="row_item center">{{ itemChild.color }}</div>
            <div class="row_item center">{{ itemChild.attribute }}</div>
            <div class="row_item center">{{ itemChild.number_attribute }}</div>
            <div class="row_item center">{{ itemChild.batch_code }}</div>
            <div class="row_item center">{{ itemChild.vat_code }}</div>
            <div class="row_item center">{{ itemChild.color_code }}</div>
            <div class="row_item center">{{ itemChild.price }}</div>
            <div class="row_item center">{{ itemChild.store }}</div>
            <div class="row_item center">{{ itemChild.weight }}</div>
            <div class="row_item center">{{ itemChild.item }}</div>
          </div>
        </div>
        <div class="print_row" v-for="(itemFee, indexFee) in orderInfo.additional_fee" :key="'itemFee' + indexFee">
          <div class="row_item center bgGray">额外费用名称</div>
          <div class="row_item center">{{ itemFee.name }}</div>
          <div class="row_item center bgGray">额外费用金额</div>
          <div class="row_item center">{{ itemFee.price }}元</div>
          <div class="row_item center bgGray">额外费用备注</div>
          <div class="row_item center">{{ itemFee.desc }}</div>
        </div>
        <div class="print_row">
            <div class="row_item center bgGray">备注信息</div>
            <div class="row_item center" style="border-right:unset;flex:5" v-html="orderInfo.desc"></div>
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
  methods: {},
  created() {
    order
      .detail({
        id: +this.$route.query.id
      })
      .then((res) => {
        this.id = res.data.data.id
        this.orderInfo = res.data.data
        this.orderInfo.additional_fee = JSON.parse(this.orderInfo.additional_fee)
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
 
<template>
  <div id="processPrint" class="printHtml" style="font-size: 16px">
    <div
      v-for="(item, index) in orderArr"
      :key="index + 'orderArr'"
      class="printTable crosswise"
      style="
        max-width: 1140px !important;
        min-width: 1140px !important;
        max-height: 620px !important;
        min-height: 620px !important;
        page-break-after: always;
        font-size: 16px;
        position: relative;
      "
    >
      <div class="print_head" style="height:unset">
        <div style="width:100%;font-size: 31px;text-align: center;font-weight:bold">
          {{ companyName }}
        </div>
      </div>
      <div class="print_head" style="flex-direction: unset">
        <div class="left">
          <span style="font-size: 17px">
            <span class="label">订单编号：</span>
            {{ orderInfo.code }}
          </span>
          <span style="font-size: 17px">
            <span class="label">出库打印信息：</span>
            {{ `${orderInfo.user_name},${$getDate(orderInfo.create_time)}` }}
          </span>
        </div>
        <div class="left">
          <span style="font-size: 17px">
            <span class="label">公司地址：</span>
            {{ address }}
          </span>
          <span style="font-size: 17px">
            <span class="label">电话手机：</span>
            {{ phone }}
          </span>
        </div>
        <div class="left">
          <span style="font-size: 17px">
            <span class="label">结算方式：</span>
            {{ orderInfo.settle_type }}
          </span>
        </div>
        <div class="right">
          <span style="font-size: 17px">
            <span class="label">页码：</span>
            {{ index + 1 }} / {{ orderArr.length }}
          </span>
        </div>
      </div>
      <div class="print_body" style="position:relative">
        <div v-for="(itemSon, indexSon) in item" class="lastOneBorder" :key="indexSon + 'product_info'">
          <div class="print_row fz14" v-if="itemSon === 'proName'" style="min-height: 39px; max-height: 39px">
            <div class="row_item center bgGray" style="">纱线名称</div>
            <div class="row_item center bgGray" style="">加工工序</div>
            <div class="row_item center bgGray" style="">加工详情</div>
            <div class="row_item center bgGray" style="">加工数量</div>
            <div class="row_item center bgGray" style="">加工单价</div>
          </div>
          <div class="print_row fz14" v-if="itemSon.id" style="min-height: 39px; max-height: 39px">
            <div class="row_item center">{{ itemSon.name }}</div>
            <div class="row_item center">{{ orderInfo.type }}</div>
            <div class="row_item center">
              <span v-if="orderInfo.type === '倒筒'">
                {{ itemSon.before_attribute }}
                <i class="el-icon-right"></i>
                {{ itemSon.after_attribute }}
              </span>
              <span v-if="orderInfo.type === '染色'">
                {{ itemSon.before_color }}
                <i class="el-icon-right"></i>
                {{ itemSon.after_color }}
              </span>
              <span v-if="orderInfo.type === '膨纱'">
                {{ itemSon.color }}
                <i class="el-icon-right"></i>
                {{ itemSon.attribute }}
              </span>
            </div>
            <div class="row_item center">{{ itemSon.weight }}kg</div>
            <div class="row_item center">{{ itemSon.price }}元</div>
          </div>
          <div
            class="print_row fz14"
            v-if="itemSon.isTotal"
            style="min-height: 39px; max-height: 39px; border-bottom: 1px solid rgba(0, 0, 0, 0.25)"
          >
            <div class="row_item center bgGray">合计</div>
            <div class="row_item center bgGray"></div>
            <div class="row_item center bgGray"></div>
            <div class="row_item center bgGray">{{ orderInfo.total_weight || 0 }}kg</div>
            <div class="row_item center bgGray">{{ orderInfo.total_price || 0 }}元</div>
          </div>
          <div class="print_row fz14" style="min-height: 39px; max-height: 39px;border-bottom: 1px solid rgba(0, 0, 0, 0.25);border-top:unset" v-if="itemSon.isAddFee">
            <div class="row_item center bgGray flex05">额外费用名称</div>
            <div class="row_item center">{{ itemSon.name }}</div>
            <div class="row_item center bgGray flex05">额外费用金额</div>
            <div class="row_item center">{{ itemSon.price ? itemSon.price + '元' : '' }}</div>
            <div class="row_item center bgGray flex05">额外费用备注</div>
            <div class="row_item center">{{ itemSon.desc }}</div>
          </div>
          <div class="print_row fz14" v-if="itemSon.orderInfoDesc" style="min-height: 39px; max-height: 39px;border-bottom: 1px solid rgba(0, 0, 0, 0.25)">
            <div class="row_item center bgGray flex05">备注信息</div>
            <div
              class="row_item"
              style="
                border-right: unset;
                flex: 4;
                display: -webkit-box;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              "
            >
              <div v-html="orderInfo.desc"></div>
            </div>
          </div>
        </div>
        <div class="print_row fz14" style="min-height: 49px; max-height: 49px; position: absolute; bottom: 125px">
          <div class="row_item center bgGray flex05">加工单位</div>
          <div class="row_item center">{{ orderInfo.client_name }}</div>
          <div class="row_item center bgGray flex05">加工日期</div>
          <div class="row_item center">{{ orderInfo.order_time }}</div>
          <div class="row_item center bgGray flex05">完成日期</div>
          <div class="row_item center">{{ $getDate(orderInfo.delivery_time) }}</div>
          <div class="row_item center bgGray flex05">单位签字</div>
          <div class="row_item center"></div>
        </div>
        <div class="print_row fz14" style="min-height: 50px; max-height: 50px; position: absolute; bottom: 75px">
          <div class="row_item center bgGray flex05">加工总数</div>
          <div class="row_item center">{{ orderInfo.total_weight || 0 }}kg</div>
          <div class="row_item center bgGray flex05">加工总价</div>
          <div class="row_item center">{{ orderInfo.total_price || 0 }}元</div>
          <div class="row_item center bgGray flex05"></div>
          <div class="row_item center"></div>
          <div class="row_item center bgGray flex05">签字日期</div>
          <div class="row_item center"></div>
        </div>
        <div class="print_row fz14" style="max-height: 75px; position: absolute; bottom: 0; min-height: 75px; border-bottom: unset">
          <div class="row_item center bgGray flex05">出库声明</div>
          <div
            class="row_item"
            style="
              border-right: unset;
              flex: 4;
              display: -webkit-box;
              overflow: hidden;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            "
          >
            <div v-html="desc"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { printList } from '@/assets/js/settingCommon'
import { yarnProcess } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [key: string]: any
  } {
    return {
      companyName: window.sessionStorage.getItem('full_name') + '加工出库单',
      print_user: window.sessionStorage.getItem('user_name'),
      address: window.sessionStorage.getItem('address'),
      phone: window.sessionStorage.getItem('phone'),
      companyDesc: window.sessionStorage.getItem('companyDesc'),
      desc: '',
      printA4Type: false,
      orderArr: [],
      orderInfo: {},
      stockYarnArr: []
    }
  },
  created() {
    printList(undefined, 3).then((res: any) => {
      this.desc = res.desc
      this.settle_type = res.settle_type
    })
    yarnProcess
      .detail({
        id: +this.$route.query.id
      })
      .then((res) => {
        this.id = res.data.data.id
        this.orderInfo = res.data.data
        this.orderInfo.additional_fee = JSON.parse(this.orderInfo.additional_fee) || []
        this.orderInfo.additional_fee.map((item: any) => {
          item.isAddFee = true
          return item
        })
        this.orderInfo.total_weight = this.orderInfo.child_data.reduce((a: any, b: any) => {
          return a + Number(b.weight)
        }, 0)
        let arr: any = ['proName'].concat(this.$clone(this.orderInfo.child_data))
        arr.push(
          { total_price: this.orderInfo.total_price, total_weight: this.orderInfo.total_weight, isTotal: true }
        )
        arr = arr.concat(this.orderInfo.additional_fee)

        if (this.orderInfo.desc) {
          arr.push(
            { orderInfoDesc: this.orderInfo.desc || '' }
          )
        }

        this.companyName = window.sessionStorage.getItem('full_name') + '加工出库单'

        if (arr.length > 9) {
          arr.forEach((item: any, index: number) => {
            if (index % 9 === 0) {
              this.orderArr.push([item])
            } else {
              this.orderArr[this.orderArr.length - 1].push(item)
            }
          })
        } else {
          this.orderArr = [this.$clone(arr)]
        }
      })
  }
})
</script>

<style scoped lang='less'>
@import '~@/assets/less/print/processPrint.less';
.bgGray {
  background-color: #f5f5f5;
}
.lastOneBorder:last-child {
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}
</style>
<style>
p {
  margin-top: 8px;
}
</style>
 
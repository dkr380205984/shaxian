<template>
  <div id="inStore" class="printHtml" style="font-size: 16px">
    <!-- 针式打印 -->
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
      <div class="print_head" style="height: unset">
        <div style="width: 100%; font-size: 31px; text-align: center; font-weight: bold">
          {{ companyName }}
        </div>
      </div>
      <div class="print_head" style="flex-direction: unset">
        <div class="left">
          <span style="font-size: 17px">
            <span class="label">发货编号：</span>
            {{ orderInfo.code }}
          </span>
          <span style="font-size: 17px">
            <span class="label">收货客户：</span>
            <span style="font-weight: bold">{{ `${orderInfo.client_name}` }}</span>
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
            {{ settle_type }}
          </span>
        </div>
        <div class="right">
          <span style="font-size: 17px">
            <span class="label">页码：</span>
            {{ index + 1 }} / {{ orderArr.length }}
          </span>
        </div>
      </div>
      <div class="print_body" style="position: relative">
        <div v-for="(itemSon, indexSon) in item" class="lastOneBorder" :key="indexSon + 'product_info'">
          <div class="print_row" v-if="itemSon === 'proName'" style="min-height: 39px; max-height: 39px">
            <div class="row_item center bgGray flex15">纱线名称</div>
            <div class="row_item center bgGray flex15">纱线颜色</div>
            <div class="row_item center bgGray flex07">纱线属性</div>
            <div class="row_item center bgGray flex07">所属客户</div>
            <div class="row_item center bgGray flex06">批号</div>
            <div class="row_item center bgGray flex06">色号</div>
            <div class="row_item center bgGray flex06">缸号</div>
            <div class="row_item center bgGray flex15">入库仓库</div>
            <div class="row_item center bgGray flex08">入库数量</div>
            <div class="row_item center bgGray flex07" v-if="orderInfo.action_type === 3">单价</div>
            <div class="row_item center bgGray flex08" v-if="orderInfo.action_type === 3">金额小计</div>
            <div class="row_item center bgGray flex08">件数</div>
          </div>
          <div class="print_row" v-if="itemSon.id" style="min-height: 39px; max-height: 39px">
            <div class="row_item center flex15">{{ itemSon.name }}</div>
            <div class="row_item center flex15">{{ itemSon.color }}</div>
            <div class="row_item center flex07">{{ itemSon.attribute }}</div>
            <div class="row_item center flex07">{{ itemSon.store_client_name }}</div>
            <div class="row_item center flex06">{{ itemSon.batch_code || '无' }}</div>
            <div class="row_item center flex06">{{ itemSon.color_code || '无' }}</div>
            <div class="row_item center flex06">{{ itemSon.vat_code || '无' }}</div>
            <div class="row_item center flex15">
              {{ orderInfo.store_name || '无' }} / {{ orderInfo.second_store_name || '无' }}
            </div>
            <div class="row_item center flex08">{{ itemSon.action_weight }}kg</div>
            <div class="row_item center flex07" v-if="orderInfo.action_type === 3">
              {{ itemSon.purchase_info ? itemSon.purchase_info.price : '0.00' }}元
            </div>
            <div class="row_item center flex08" v-if="orderInfo.action_type === 3">
              {{
                ((itemSon.purchase_info ? itemSon.purchase_info.price : 0) * (itemSon.action_weight || 0)).toFixed(2)
              }}元
            </div>
            <div class="row_item center flex08">{{ itemSon.item || 0 }}</div>
          </div>
          <div
            class="print_row"
            v-if="itemSon.isTotal"
            style="min-height: 39px; max-height: 39px; border-bottom: 1px solid rgba(0, 0, 0, 0.25)"
          >
            <div class="row_item center bgGray flex15">合计</div>
            <div class="row_item center bgGray flex15"></div>
            <div class="row_item center bgGray flex07"></div>
            <div class="row_item center bgGray flex07"></div>
            <div class="row_item center bgGray flex06"></div>
            <div class="row_item center bgGray flex06"></div>
            <div class="row_item center bgGray flex06"></div>
            <div class="row_item center bgGray flex15"></div>
            <div class="row_item center bgGray flex08">{{ orderInfo.total_weight || '0.0' }}kg</div>
            <div class="row_item center bgGray flex07" v-if="orderInfo.action_type === 3"></div>
            <div class="row_item center bgGray flex08" v-if="orderInfo.action_type === 3">
              {{ orderInfo.total_price.toFixed(2) || '0.00' }}元
            </div>
            <div class="row_item center bgGray flex08"></div>
          </div>
          <div
            class="print_row"
            v-if="itemSon.orderInfoDesc"
            style="min-height: 39px; max-height: 39px; border-bottom: 1px solid rgba(0, 0, 0, 0.25)"
          >
            <div class="row_item center bgGray flex05">备注信息</div>
            <div
              class="row_item"
              style="
                border-right: unset;
                flex: 3.12;
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
        <div class="print_row" style="min-height: 49px; max-height: 49px; position: absolute; bottom: 125px">
          <div class="row_item center bgGray flex05">客户单号</div>
          <div class="row_item center">{{ orderInfo.related_info ? orderInfo.related_info.code : '无' }}</div>
          <div class="row_item center bgGray flex05">创建人</div>
          <div class="row_item center">{{ orderInfo.user_name }}</div>
          <div class="row_item center bgGray flex05">创建日期</div>
          <div class="row_item center">{{ $getDate(orderInfo.create_time) }}</div>
          <div class="row_item center bgGray flex05">客户签字</div>
          <div class="row_item center"></div>
        </div>
        <div class="print_row" style="min-height: 50px; max-height: 50px; position: absolute; bottom: 75px">
          <div class="row_item center bgGray flex05">数量合计</div>
          <div class="row_item center">{{ orderInfo.total_weight || 0 }}kg</div>
          <div class="row_item center bgGray flex05" v-if="orderInfo.action_type === 3">金额合计</div>
          <div class="row_item center bgGray flex05" v-else></div>
          <div class="row_item center" v-if="orderInfo.action_type === 3">
            {{ Number(+orderInfo.total_price + +orderInfo.total_additional_fee).toFixed(2) || 0 }}元
          </div>
          <div class="row_item center" v-else></div>
          <div class="row_item center bgGray flex05">发货日期</div>
          <div class="row_item center">{{ $getDate(orderInfo.complete_time) }}</div>
          <div class="row_item center bgGray flex05">签字日期</div>
          <div class="row_item center"></div>
        </div>
        <div
          class="print_row"
          style="max-height: 75px; position: absolute; bottom: 0; min-height: 75px; border-bottom: unset"
        >
          <div class="row_item center bgGray flex05">公司声明</div>
          <div
            class="row_item"
            style="
              border-right: unset;
              flex: 5.55;
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
import { stock } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [key: string]: any
  } {
    return {
      companyName: window.sessionStorage.getItem('full_name') + '入库单',
      print_user: window.sessionStorage.getItem('user_name'),
      address: window.sessionStorage.getItem('address'),
      phone: window.sessionStorage.getItem('phone'),
      settle_type: '',
      companyDesc: window.sessionStorage.getItem('companyDesc'),
      X_position: 0,
      Y_position: 0,
      desc: '',
      orderArr: [],
      orderInfo: {},
      qrCodeUrl: '',
      stockYarnArr: []
    }
  },
  methods: {},
  created() {
    printList(undefined, 4).then((res: any) => {
      this.desc = res.desc
      this.settle_type = res.settle_type
    })
    stock
      .detail({
        id: +this.$route.query.id
      })
      .then((res) => {
        this.id = res.data.data.id
        this.orderInfo = res.data.data
        this.companyName = window.sessionStorage.getItem('full_name') + '入库单'
        this.orderInfo.child_data.forEach((item: any) => (item.priceNumber = (item.price || 0) * (item.weight || 0)))

        this.orderInfo.total_weight = this.orderInfo.child_data
          .reduce((a: any, b: any) => {
            return a + (Number(b.action_weight) || 0)
          }, 0)
          .toFixed(1)
        this.orderInfo.total_price = this.orderInfo.child_data.reduce((a: any, b: any) => {
          return a + (b?.purchase_info?.price * b?.action_weight || 0)
        }, 0)
        this.orderInfo.total_additional_fee = this.orderInfo.related_info
          ? this.orderInfo.related_info.total_additional_fee
          : '0.00'

        let arr: any = ['proName'].concat(this.$clone(this.orderInfo.child_data))
        arr.push({ total_price: this.orderInfo.total_price, total_weight: this.orderInfo.total_weight, isTotal: true })

        if (this.orderInfo.desc) {
          arr.push({ orderInfoDesc: this.orderInfo.desc })
        }

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
@import '~@/assets/less/print/inStore.less';
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
 
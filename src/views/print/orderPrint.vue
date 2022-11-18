<template>
  <div
    id="orderPrint"
    class="printHtml"
    style="font-size: 16px"
    @click.right="handleClickRight"
    @click="showMenu = false"
  >
    <div v-if="printA4Type" class="printTable">
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
        <div class="left">
          <span class="title" style="height: 41px"></span>
          <span class="item" style="font-size: 17px">
            <span class="label">公司地址：</span>
            {{ address }}
          </span>
          <span class="item" style="font-size: 17px">
            <span class="label">电话手机：</span>
            {{ phone }}
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
          <div class="row_item center bgGray flex05">{{ orderInfo.type == 1 ? '下单' : '收货' }}客户</div>
          <div class="row_item center">{{ orderInfo.client_name }}</div>
          <div class="row_item center bgGray flex05">{{ orderInfo.type == 1 ? '下单' : '出库' }}日期</div>
          <div class="row_item center">{{ $getDate(orderInfo.create_time) }}</div>
          <div class="row_item center bgGray flex05" v-if="orderInfo.type == 2">客户签字</div>
          <div class="row_item center"></div>
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
          <div class="row_item center bgGray flex05" v-if="orderInfo.type == 2">签字日期</div>
          <div class="row_item center"></div>
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
            <div class="row_item center flex05">
              {{ item.total_weight ? Number(item.total_weight).toFixed(1) : 0 }}kg
            </div>
            <div class="row_item center bgGray flex05">金额小计</div>
            <div class="row_item center flex05">{{ item.total_price }}元</div>
          </div>
          <div class="print_row fz14">
            <div class="row_item center bgGray flex15">纱线颜色</div>
            <div class="row_item center bgGray flex07">纱线属性</div>
            <div class="row_item center bgGray flex07">数量属性</div>
            <div class="row_item center bgGray flex06" v-if="orderInfo.type == 2">批号</div>
            <div class="row_item center bgGray flex06" v-if="orderInfo.type == 2">色号</div>
            <div class="row_item center bgGray flex06" v-if="orderInfo.type == 2">缸号</div>
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
            <div class="row_item center flex06" v-if="orderInfo.type == 2">{{ itemChild.color_code }}</div>
            <div class="row_item center flex06" v-if="orderInfo.type == 2">{{ itemChild.vat_code }}</div>
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
        <div class="print_row">
          <div class="row_item center bgGray flex05">公司声明</div>
          <div
            class="row_item"
            style="
              border-right: unset;
              flex: 4.05;
              display: -webkit-box;
              overflow: hidden;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            "
            v-html="desc"
          ></div>
        </div>
      </div>
    </div>
    <!-- 针式打印 -->
    <div v-else>
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
        <div class="print_head" style="flex-direction: unset">
          <div class="left">
            <span class="title" style="font-size: 31px">{{ companyName }}</span>
            <span style="font-size: 17px">
              <span class="label">订单编号：</span>
              {{ orderInfo.code }}
            </span>
            <span style="font-size: 17px">
              <span class="label">订单创建信息：</span>
              {{ `${orderInfo.user_name},${$getDate(orderInfo.create_time)}` }}
            </span>
          </div>
          <div class="left">
            <span class="title" style="height: 41px"></span>
            <span style="font-size: 17px">
              <span class="label">公司地址：</span>
              {{ address }}
            </span>
            <span style="font-size: 17px">
              <span class="label">电话手机：</span>
              {{ phone }}
            </span>
          </div>
          <div class="right">
            <span style="font-size: 17px">
              <span class="label">页码：</span>
              {{ index + 1 }} / {{orderArr.length}}
            </span>
          </div>
        </div>
        <div class="print_body" style="position:relative">
          <div v-for="(itemSon, indexSon) in item" class="lastOneBorder" :key="indexSon + 'product_info'">
            <div class="print_row fz14" v-if="itemSon === 'proName'" style="min-height: 39px; max-height: 39px">
              <div class="row_item center bgGray flex15">纱线名称</div>
              <div class="row_item center bgGray flex15">纱线颜色</div>
              <div class="row_item center bgGray flex07">纱线属性</div>
              <div class="row_item center bgGray flex07">数量属性</div>
              <div class="row_item center bgGray flex06">批号</div>
              <div class="row_item center bgGray flex06">色号</div>
              <div class="row_item center bgGray flex06">缸号</div>
              <div class="row_item center bgGray flex15">出库仓库</div>
              <div class="row_item center bgGray flex08">{{orderInfo.type === 1?'下单':'销售'}}数量</div>
              <div class="row_item center bgGray flex07">{{orderInfo.type === 1?'下单':'销售'}}单价</div>
              <div class="row_item center bgGray flex08">金额小计</div>
              <div class="row_item center bgGray flex08">{{orderInfo.type === 1?'下单':'销售'}}件数</div>
            </div>
            <div class="print_row fz14" v-if="itemSon.id" style="min-height: 39px; max-height: 39px">
              <div class="row_item center flex15">{{ itemSon.product_name }}</div>
              <div class="row_item center flex15">{{ itemSon.color }}</div>
              <div class="row_item center flex07">{{ itemSon.attribute }}</div>
              <div class="row_item center flex07">{{ itemSon.number_attribute }}</div>
              <div class="row_item center flex06">{{ itemSon.batch_code }}</div>
              <div class="row_item center flex06">{{ itemSon.color_code }}</div>
              <div class="row_item center flex06">{{ itemSon.vat_code }}</div>
              <div class="row_item center flex15">{{ itemSon.store }}</div>
              <div class="row_item center flex08">{{ itemSon.weight }}kg</div>
              <div class="row_item center flex07">{{ itemSon.price }}元</div>
              <div class="row_item center flex08">
                {{ ((itemSon.price || 0) * (itemSon.weight || 0)).toFixed(2) }}元
              </div>
              <div class="row_item center flex08">{{ itemSon.item }}</div>
            </div>
            <div
              class="print_row fz14"
              style="min-height: 39px; max-height: 39px"
              v-if="itemSon.name"
            >
              <div class="row_item center bgGray flex05">额外费用名称</div>
              <div class="row_item center">{{ itemSon.name }}</div>
              <div class="row_item center bgGray flex05">额外费用金额</div>
              <div class="row_item center">{{ itemSon.price ? itemSon.price + '元' : '' }}</div>
              <div class="row_item center bgGray flex05">额外费用备注</div>
              <div class="row_item center">{{ itemSon.desc }}</div>
            </div>
            <div class="print_row fz14" v-if="itemSon.orderInfoDesc" style="min-height: 39px; max-height: 39px">
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
            <div class="print_row fz14" style="max-height: 78px;position:absolute;bottom:78px" v-if="itemSon.companyDesc">
              <div class="row_item center bgGray flex05">公司声明</div>
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
              <div class="print_row fz14" v-if="itemSon.kehuqianzi" style="min-height: 39px; max-height: 39px;position:absolute;bottom:39px">
                <div class="row_item center bgGray flex05">客户单号</div>
                <div class="row_item center">{{ itemSon.order_code }}</div>
                <div class="row_item center bgGray flex05">收货客户</div>
                <div class="row_item center">{{ itemSon.client_name }}</div>
                <div class="row_item center bgGray flex05">出库日期</div>
                <div class="row_item center">{{ $getDate(itemSon.order_time) }}</div>
                <div class="row_item center bgGray flex05">客户签字</div>
                <div class="row_item center"></div>
              </div>
              <div class="print_row fz14" v-if="itemSon.total_weight" style="min-height: 39px; max-height: 39px;position:absolute;bottom:0">
                <div class="row_item center bgGray flex05">{{orderInfo.type === 1?'下单':'销售'}}总数</div>
                <div class="row_item center">{{ orderInfo.total_weight || 0 }}kg</div>
                <div class="row_item center bgGray flex05">{{orderInfo.type === 1?'下单':'销售'}}总价</div>
                <div class="row_item center">{{ orderInfo.total_price || 0 }}元</div>
                <div class="row_item center bgGray flex05"></div>
                <div class="row_item center"></div>
                <div class="row_item center bgGray flex05">签字日期</div>
                <div class="row_item center"></div>
              </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="setting_sign_style"
      v-if="showMenu && orderInfo.type == 2"
      :style="`left:${X_position || 0}px;top:${Y_position}px`"
      @click.stop
    >
      <div class="setting_item" @click="windowMethod(1)">刷新页面</div>
      <div class="setting_item" @click="windowMethod(2)">打印单据</div>
      <div class="setting_item" @click="windowMethod(3)">切换格式</div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { printList } from '@/assets/js/settingCommon'
import { order } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [key: string]: any
  } {
    return {
      companyName: window.sessionStorage.getItem('full_name') + '销售订单',
      print_user: window.sessionStorage.getItem('user_name'),
      address: window.sessionStorage.getItem('address'),
      phone: window.sessionStorage.getItem('phone'),
      companyDesc: window.sessionStorage.getItem('companyDesc'),
      X_position: 0,
      Y_position: 0,
      showMenu: false,
      desc: '',
      printA4Type: true,
      orderArr: [],
      orderInfo: {},
      qrCodeUrl: '',
      stockYarnArr: []
    }
  },
  methods: {
    windowMethod(type: number) {
      this.showPrintSetting = false
      window.requestAnimationFrame(() => {
        if (type === 1) {
          window.location.reload()
        } else if (type === 2) {
          this.showMenu = false
          setTimeout(() => {
            window.print()
          }, 100)
        } else if (type === 3) {
          this.printA4Type = !this.printA4Type
        }
      })
    },
    handleClickRight(e: any, type = true) {
      this.showMenu = type
      this.X_position = e.clientX
      this.Y_position = e.clientY
      e.preventDefault()
      e.stopPropagation()
    },
    saveSetting() {
      const realSave = {
        editor: '',
        desc: this.descArr.desc
      }
      this.$setLocalStorage('accessoriesManagePrintTitle', this.title)
      this.$setLocalStorage('accessoriesManagePrintDesc', JSON.stringify(realSave))
      this.$message.success('保存成功')
      this.settingFlag = false
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
    printList(undefined, 10).then((res: any) => {
      this.desc = res.desc
    })
    this.printA4Type = this.$route.query.printA4Type === 'true'
    order
      .detail({
        id: +this.$route.query.id
      })
      .then((res) => {
        this.id = res.data.data.id
        this.orderInfo = res.data.data
        this.orderInfo.additional_fee = JSON.parse(this.orderInfo.additional_fee) || [{name:' ',price:'',desc:''}]
        let arr: any = ['proName'].concat(this.$clone(this.orderInfo.product_info))
        arr = arr.concat(this.orderInfo.additional_fee)
        arr.push(
          { orderInfoDesc: this.orderInfo.desc || ' ' },
          { companyDesc: this.desc || ' '},
          {
            order_code: this.orderInfo.order_code,
            client_name: this.orderInfo.client_name,
            create_time: this.orderInfo.create_time,
            kehuqianzi:true
          }
        )
        this.companyName =
          window.sessionStorage.getItem('full_name') + (this.orderInfo.type == 2 ? '销售订单' : '生产订单-计划单')
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
        arr.push({ total_price: this.orderInfo.total_price, total_weight: this.orderInfo.total_weight })
        
        // console.log(arr)
        if (arr.length > 13) {
          arr.forEach((item: any, index: number) => {
            if (index % 13 === 0) {
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
@import '~@/assets/less/print/orderPrint.less';
.bgGray {
  background-color: #f5f5f5;
}
.lastOneBorder:last-child{
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}
</style>
<style>
p {
  margin-top: 8px;
}
</style>
 
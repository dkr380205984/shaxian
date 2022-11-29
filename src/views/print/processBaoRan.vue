<template>
  <div id="processBaoRan" class="printHtml" style="font-size: 16px">
    <div class="printTable">
      <div class="print_head" style="height: unset">
        <div style="width: 100%; font-size: 31px; text-align: center; font-weight: bold">
          {{ companyName }}
        </div>
      </div>
      <div class="print_head" style="height: unset">
        <div class="left">
          <span class="item" style="font-size: 17px">
            <span class="label">加工单号：</span>
            {{ detail.code }}
          </span>
          <span class="item" style="font-size: 17px">
            <span class="label">订单创建信息：</span>
            {{ `${detail.user_name},${$getDate(detail.create_time)}` }}
          </span>
        </div>
        <div class="left">
          <span class="item" style="font-size: 17px">
            <span class="label">公司地址：</span>
            {{ address }}
          </span>
          <span class="item" style="font-size: 17px">
            <span class="label">电话手机：</span>
            {{ phone }}
          </span>
        </div>
        <div class="left">
          <span class="item" style="font-size: 17px">
            <span class="label">结算方式：</span>
            {{ settle_type }}
          </span>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row">
          <div class="row_item center bgGray flex06">订单号</div>
          <div class="row_item center">{{ detail.order_code }}</div>
          <div class="row_item center bgGray flex06">下单客户</div>
          <div class="row_item center">{{ detail.client_name }}</div>
          <div class="row_item center bgGray flex06">下单日期</div>
          <div class="row_item center">{{ $getDate(detail.create_time) }}</div>
          <div class="row_item center bgGray flex06">负责人/小组</div>
          <div class="row_item center"></div>
        </div>
        <div
          v-for="(item, index) in detail.yarnInfo"
          :key="item.name + index"
          style="margin-bottom: 16px; border-bottom: 1px solid rgba(0, 0, 0, 0.25)"
        >
          <div class="print_row">
            <div class="row_item center bgGray flex05">原料名称</div>
            <div class="row_item center" style="flex: 2.19">{{ item.name }}</div>
            <div class="row_item center" style="flex: 1.34">{{ item.total_weight || 0 }}kg</div>
            <div class="row_item center" style="flex: 1.34">{{ item.total_price || 0 }}元</div>
          </div>
          <div class="print_row">
            <div class="row_item center bgGray" style="flex: 0.535">序号</div>
            <div class="row_item center bgGray" style="flex: 1.85">加工详情</div>
            <div class="row_item center bgGray flex05">单价</div>
            <div class="row_item center bgGray flex05">数量</div>
            <div class="row_item center bgGray" style="flex: 2.38">原样颜色</div>
          </div>
          <div v-for="(itemChild, indexChild) in item.child_data" :key="indexChild + '序号' + index">
            <div class="print_row">
              <div class="row_item center" style="flex: 0.535">{{ indexChild + 1 }}</div>
              <div class="row_item center" style="flex: 1.85">
                <div v-if="detail.type === '倒筒'">
                  {{ itemChild.before_attribute }}
                  <i class="el-icon-right"></i>
                  {{ itemChild.after_attribute }}
                </div>
                <div v-if="detail.type === '染色'">
                  {{ itemChild.before_color }}
                  <i class="el-icon-right"></i>
                  {{ itemChild.after_color }}
                </div>
                <div v-if="detail.type === '膨纱'">
                  {{ itemChild.color }}
                  <i class="el-icon-right"></i>
                  {{ itemChild.attribute }}
                </div>
              </div>
              <div class="row_item center flex05">{{ itemChild.price }}</div>
              <div class="row_item center flex05">{{ itemChild.weight }}</div>
              <div class="row_item center" style="flex: 2.38"></div>
            </div>
          </div>
        </div>
        <div
          v-for="(item, index) in detail.product_info"
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
            <div class="row_item center bgGray flex06" v-if="detail.type == 2">批号</div>
            <div class="row_item center bgGray flex06" v-if="detail.type == 2">色号</div>
            <div class="row_item center bgGray flex06" v-if="detail.type == 2">缸号</div>
            <div class="row_item center bgGray flex07">{{ detail.type == 2 ? '销售' : '下单' }}单价(元)</div>
            <div class="row_item center bgGray flex15" v-if="detail.type == 2">出库仓库</div>
            <div class="row_item center bgGray flex08">{{ detail.type == 2 ? '销售' : '下单' }}数量</div>
            <div class="row_item center bgGray flex08" v-if="detail.type == 2">销售件数</div>
          </div>
          <div
            class="print_row fz14"
            v-for="(itemChild, indexChild) in item.child_data"
            :key="indexChild + 'child_data'"
          >
            <div class="row_item center flex15">{{ itemChild.color }}</div>
            <div class="row_item center flex07">{{ itemChild.attribute }}</div>
            <div class="row_item center flex07">{{ itemChild.number_attribute }}</div>
            <div class="row_item center flex06" v-if="detail.type == 2">{{ itemChild.batch_code }}</div>
            <div class="row_item center flex06" v-if="detail.type == 2">{{ itemChild.color_code }}</div>
            <div class="row_item center flex06" v-if="detail.type == 2">{{ itemChild.vat_code }}</div>
            <div class="row_item center flex07">{{ itemChild.price }}</div>
            <div class="row_item center flex15" v-if="detail.type == 2">{{ itemChild.store }}</div>
            <div class="row_item center flex08">{{ itemChild.weight }}</div>
            <div class="row_item center flex08" v-if="detail.type == 2">{{ itemChild.item }}</div>
          </div>
        </div>
        <div class="print_row" v-for="(itemFee, indexFee) in detail.additional_fee" :key="'itemFee' + indexFee">
          <div class="row_item center bgGray flex05">额外费用名称</div>
          <div class="row_item center">{{ itemFee.name }}</div>
          <div class="row_item center bgGray flex05">额外费用金额</div>
          <div class="row_item center">{{ itemFee.price ? itemFee.price + '元' : '' }}</div>
          <div class="row_item center bgGray flex05">额外费用备注</div>
          <div class="row_item center">{{ itemFee.desc }}</div>
        </div>
        <div class="print_row">
          <div class="row_item center bgGray flex05">备注信息</div>
          <div class="row_item center" style="border-right: unset; flex: 4.9" v-html="detail.desc"></div>
        </div>
        <div class="print_row">
          <div class="row_item center bgGray flex05">公司声明</div>
          <div
            class="row_item"
            style="
              border-right: unset;
              padding-left: 10px;
              flex: 4.85;
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
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { printList } from '@/assets/js/settingCommon'
import { order, yarnProcess } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [key: string]: any
  } {
    return {
      companyName: window.sessionStorage.getItem('full_name') + '加工单',
      print_user: window.sessionStorage.getItem('user_name'),
      address: window.sessionStorage.getItem('address'),
      phone: window.sessionStorage.getItem('phone'),
      companyDesc: window.sessionStorage.getItem('companyDesc'),
      X_position: 0,
      Y_position: 0,
      showMenu: false,
      settle_type: '',
      desc: '',
      detail: {},
      orderArr: [],
      stockYarnArr: []
    }
  },
  methods: {
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
        this.detail = res.data.data
        this.detail.yarnInfo = this.$mergeData(this.detail.child_data, {
          mainRule: 'name',
          childrenName: 'child_data'
        })
        this.detail.yarnInfo.forEach((item: any) => {
          item.total_weight = item.child_data
            .reduce((a: any, b: any) => {
              return a + (Number(b.weight) || 0)
            }, 0)
            .toFixed(1)
          item.total_price = item.child_data
            .reduce((a: any, b: any) => {
              return a + (Number(b.weight) * Number(b.price) || 0)
            }, 0)
            .toFixed(2)
        })
      })
    // order
    //   .detail({
    //     id: +this.$route.query.id
    //   })
    //   .then((res) => {
    //     this.id = res.data.data.id
    //     this.orderInfo = res.data.data
    //     if(this.orderInfo.type === 2){
    //       this.printA4Type = window.sessionStorage.getItem('printA4Type') === 'true'
    //     }
    //     this.orderInfo.additional_fee = JSON.parse(this.orderInfo.additional_fee) || [
    //       { name: ' ', price: '', desc: '' }
    //     ]
    //     let arr: any = ['proName'].concat(this.$clone(this.orderInfo.product_info))
    //     arr.push({ total_price: this.orderInfo.total_price, total_weight: this.orderInfo.total_weight,isHeJi:true })
    //     arr = arr.concat(this.orderInfo.additional_fee)
    //     arr.push(
    //       { orderInfoDesc: this.orderInfo.desc || ' ' },
    //       { companyDesc: this.desc || ' ' },
    //       {
    //         order_code: this.orderInfo.order_code,
    //         client_name: this.orderInfo.client_name,
    //         create_time: this.orderInfo.create_time,
    //         kehuqianzi: true
    //       }
    //     )
    //     this.companyName =
    //       window.sessionStorage.getItem('full_name') + (this.orderInfo.type == 2 ? '销售订单' : '生产订单-计划单')
    //     this.orderInfo.product_info.forEach((item: any) => (item.priceNumber = (item.price || 0) * (item.weight || 0)))
    //     this.orderInfo.product_info = this.$mergeData(this.orderInfo.product_info, {
    //       mainRule: 'product_name',
    //       childrenName: 'child_data'
    //     })
    //     this.orderInfo.product_info.forEach((item: any) => {
    //       item.total_weight = item.child_data.reduce((a: any, b: any) => {
    //         return a + (Number(b.weight) || 0)
    //       }, 0)
    //       item.total_price = item.child_data.reduce((a: any, b: any) => {
    //         return a + (b.weight || 0) * (b.price || 0)
    //       }, 0)
    //     })

    //     arr.push({isLast: true})

    //     // console.log(arr)
    //     if (arr.length > 13) {
    //       arr.forEach((item: any, index: number) => {
    //         if (index % 13 === 0) {
    //           this.orderArr.push([item])
    //         } else {
    //           this.orderArr[this.orderArr.length - 1].push(item)
    //         }
    //       })
    //     } else {
    //       this.orderArr = [this.$clone(arr)]
    //     }
    //   })
  }
})
</script>

<style scoped lang='less'>
@import '~@/assets/less/print/processBaoRan.less';
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
 
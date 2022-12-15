<template>
  <div
    id="processBaoRan"
    class="printHtml"
    style="font-size: 16px"
    @click.right="handleClickRight"
    @click="showMenu = false"
  >
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
        <div class="print_row has_marginBottom">
          <div class="row_item center bgGray flex06">加工单号</div>
          <div class="row_item center">{{ detail.code }}</div>
          <div class="row_item center bgGray flex06">加工单位</div>
          <div class="row_item center">{{ detail.client_name }}</div>
          <div class="row_item center bgGray flex06">下单日期</div>
          <div class="row_item center">{{ $getDate(detail.create_time) }}</div>
          <div class="row_item center bgGray flex06">交货日期</div>
          <div class="row_item center">{{ $getDate(detail.delivery_time) }}</div>
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
            <div class="row_item center" style="flex: 1.34">{{ showPrice ? (item.total_price || 0) + '元' : '' }}</div>
          </div>
          <div class="print_row">
            <div class="row_item center bgGray" style="flex: 0.535">序号</div>
            <div class="row_item center bgGray" style="flex: 1.85">加工详情</div>
            <div class="row_item center bgGray flex05">单价</div>
            <div class="row_item center bgGray flex05">数量</div>
            <div class="row_item center bgGray" style="flex: 2.38">原样颜色</div>
          </div>
          <div v-for="(itemChild, indexChild) in item.child_data" :key="indexChild + '序号' + index">
            <div class="print_row" style="height: 100px">
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
              <div class="row_item center flex05">{{ showPrice ? itemChild.price : '' }}</div>
              <div class="row_item center flex05">{{ itemChild.weight }}</div>
              <div class="row_item center" style="flex: 2.38"></div>
            </div>
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
    <div
      class="setting_sign_style"
      v-if="showMenu"
      :style="`left:${X_position || 0}px;top:${Y_position}px`"
      @click.stop
    >
      <div class="setting_item" @click="windowMethod(1)">刷新页面</div>
      <div class="setting_item" @click="windowMethod(2)">打印单据</div>
      <div class="setting_item" @click="windowMethod(3)">价格{{ showPrice ? '隐藏' : '显示' }}</div>
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
      showPrice: true,
      settle_type: '',
      desc: '',
      detail: {},
      orderArr: [],
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
          this.showPrice = !this.showPrice
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
        this.detail.additional_fee = this.detail.additional_fee ? JSON.parse(this.detail.additional_fee) : ['']
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
 
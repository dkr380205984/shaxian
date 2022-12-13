<template>
  <div id="deductPrint" class="printHtml" style="font-size: 16px">
    <!-- 针式打印 -->
    <div
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
            <span class="label">公司地址：</span>
            {{ address }}
          </span>
        </div>
        <div class="left">
          <span style="font-size: 17px">
            <span class="label">基本信息：</span>
            {{ $getDate(deductInfo.create_time) }}，{{ deductInfo.user_name }}，{{ phone }}
          </span>
        </div>
        <div class="left"></div>
      </div>
      <div class="print_body" style="position: relative">
        <div class="print_row">
          <div class="row_item col">
            <div class="print_row" style="border: unset">
              <div class="row_item center bgGray flex02">扣款单号</div>
              <div class="row_item center">{{ deductInfo.code }}</div>
            </div>
            <div class="print_row">
              <div class="row_item center bgGray flex02">扣款单位</div>
              <div class="row_item center">{{ deductInfo.client_name }}</div>
            </div>
            <div class="print_row">
              <div class="row_item center bgGray flex02">扣款金额</div>
              <div class="row_item center">{{ Number(deductInfo.total_price || 0).toFixed(2) }} 元</div>
            </div>
            <div class="print_row">
              <div class="row_item center bgGray flex02">扣款日期</div>
              <div class="row_item center">{{ $getDate(deductInfo.date) }}</div>
            </div>
            <div class="print_row">
              <div class="row_item center bgGray flex02">操作人</div>
              <div class="row_item center">{{ deductInfo.user_name }}</div>
            </div>
            <div class="print_row">
              <div class="row_item center bgGray flex02">操作日期</div>
              <div class="row_item center">{{ $getDate(deductInfo.create_time) }}</div>
            </div>
            <div class="print_row" style="height: 71px">
              <div class="row_item center bgGray flex02">签字确认</div>
              <div class="row_item center"></div>
            </div>
            <div class="print_row">
              <div class="row_item center bgGray flex02">签字日期</div>
              <div class="row_item center"></div>
            </div>
          </div>
          <div class="row_item col">
            <div class="print_row" style="border: unset">
              <div class="row_item center bgGray flex02" style="height: 421px">相关文件</div>
              <div class="row_item center" style="height: 421px">
                <el-image style="width: 90%; height: 90%" :src="deductInfo.deduct_file || require('@/assets/image/noPic.jpg')" > </el-image>
              </div>
            </div>
          </div>
        </div>
        <div class="print_row">
          <div class="row_item center bgGray flex02">扣款信息</div>
          <div class="row_item" style="border-right: unset; flex: 2.2">
            <div
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 1042px;
                padding-left: 15px;
                box-sizing: border-box;
              "
            >
              {{ deductInfo.desc }}
            </div>
          </div>
        </div>
        <div
          class="print_row"
          style="max-height: 75px; position: absolute; bottom: 0; min-height: 75px; border-bottom: unset"
        >
          <div class="row_item center bgGray flex02">公司声明</div>
          <div
            class="row_item"
            style="
              border-right: unset;
              flex: 2.2;
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
import { stock, deduct } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [key: string]: any
  } {
    return {
      companyName: window.sessionStorage.getItem('full_name') + '扣款单',
      print_user: window.sessionStorage.getItem('user_name'),
      address: window.sessionStorage.getItem('address'),
      phone: window.sessionStorage.getItem('phone'),
      settle_type: '',
      companyDesc: window.sessionStorage.getItem('companyDesc'),
      X_position: 0,
      Y_position: 0,
      desc: '',
      orderArr: [],
      deductInfo: {},
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
    deduct
      .detail({
        id: +this.$route.query.id
      })
      .then((res) => {
        this.deductInfo = res.data.data
      })
  }
})
</script>

<style scoped lang='less'>
@import '~@/assets/less/print/deductPrint.less';
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
 
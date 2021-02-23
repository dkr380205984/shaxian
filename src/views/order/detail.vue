<template>
  <div class="indexMain"
    id="orderDeatil">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">订单号：</span>
            <span class="text green">暂时没有，自己编的</span>
          </div>
          <div class="colCtn">
            <span class="label">客户单号：</span>
            <span class="text green">{{order_info.order_code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">下单客户：</span>
            <span class="text">{{order_info.client_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{order_info.order_time}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">交货日期：</span>
            <span class="text blue">{{order_info.delivery_time}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">创建人：</span>
            <span class="text">{{order_info.user_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">创建时间：</span>
            <span class="text">没给</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="text"
              v-html="order_info.desc"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">下单信息</span>
      </div>
      <div style="padding:20px 32px">
        <div class="btnCtn clearfix">
          <div class="btn btnBlue">订购白胚</div>
          <div class="btn btnBlue">订购色纱</div>
          <div class="btn btnGray">库存调取</div>
          <div class="btn btnGray">纱线加工</div>
        </div>
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn"
                style="flex:0.3">
                <el-checkbox v-model="checkAll"></el-checkbox>
              </div>
              <div class="tcolumn">纱线名称</div>
              <div class="tcolumn">纱线颜色</div>
              <div class="tcolumn">纱线属性</div>
              <div class="tcolumn">下单价格(元)</div>
              <div class="tcolumn">下单数量(kg)</div>
              <div class="tcolumn">数量属性</div>
              <div class="tcolumn">调取数量</div>
              <div class="tcolumn">订购数量</div>
              <div class="tcolumn">加工数量</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item) in order_info.product_info"
              :key="item.id">
              <div class="tcolumn"
                style="flex:0.3">
                <el-checkbox v-model="item.check"></el-checkbox>
              </div>
              <div class="tcolumn">{{item.product_name}}</div>
              <div class="tcolumn">{{item.color}}</div>
              <div class="tcolumn">{{item.attribute}}</div>
              <div class="tcolumn">{{item.price}}</div>
              <div class="tcolumn blue">{{item.weight}}</div>
              <div class="tcolumn">{{item.number_attribute}}</div>
              <div class="tcolumn blue">0</div>
              <div class="tcolumn blue">0</div>
              <div class="tcolumn blue">
                <div class="once">
                  <span class="green"
                    style="margin-right:5px">染色</span>
                  <span class="blue">100</span>
                </div>
                <div class="once">
                  <span class="green"
                    style="margin-right:5px">倒纱</span>
                  <span class="blue">100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">库存调取信息</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">订购信息</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">加工信息</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Order } from '@/types/order'
import { order } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    order_info: Order
    [propName: string]: any
  } {
    return {
      checkAll: false,
      order_info: {
        order_code: '',
        order_time: '',
        delivery_time: '',
        client_id: '',
        total_price: 0,
        total_weight: 0,
        desc: '',
        product_info: []
      }
    }
  },
  // computed: {
  //   checkList(): Order[] {
  //     return this.order_info.filter((item: Order) => item.check)
  //   }
  // },
  mounted() {
    order
      .detail({
        id: this.$route.params.id
      })
      .then((res) => {
        console.log(res)
        this.order_info = res.data.data
      })
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/less/order/detail.less';
</style>
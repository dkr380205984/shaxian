<template>
  <div id="poductDetail"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">纱线名称：</span>
            <span class="text green">{{product_info.name}}</span>
          </div>
          <div class="colCtn">
            <span class="label">纱线类型：</span>
            <span class="text green">{{product_info.yarn_type_name}}</span>
          </div>
          <div class="colCtn">
            <span class="label">创建人：</span>
            <span class="text green">{{product_info.user_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="tableCtn"
            style="margin:0;width:100%;">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">纱线颜色</div>
                <div class="tcolumn">纱线属性</div>
                <div class="tcolumn">单价/元</div>
                <div class="tcolumn">库存数/kg</div>
                <div class="tcolumn">备注信息</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="item in product_info.child_data"
                :key="item.id">
                <div class="tcolumn">{{item.color}}</div>
                <div class="tcolumn">{{item.attribute}}</div>
                <div class="tcolumn">{{item.price}}元</div>
                <div class="tcolumn">{{item.store||0}}</div>
                <div class="tcolumn">{{item.desc||'无备注'}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-show="false">
      <div class="titleCtn">
        <span class="title">关联库存</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { product } from '@/assets/js/api'
import { Product } from '@/types/product'
export default Vue.extend({
  data(): {
    product_info: Product
    [propName: string]: any
  } {
    return {
      product_info: {
        name: '',
        yarn_type: '',
        yarn_type_name: '',
        user_name: '',
        child_data: []
      }
    }
  },
  mounted() {
    product.detail({ id: this.$route.params.id }).then((res) => {
      this.product_info = res.data.data
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/product/detail.less';
</style>
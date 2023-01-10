<template>
  <div id="poductDetail" class="indexMain" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">毛条类型：</span>
            <span class="text">{{ product_info.rel_type|maotiaoTypeFilter }}</span>
          </div>
          <div class="colCtn">
            <span class="label">创建人：</span>
            <span class="text">{{ product_info.user.name }}</span>
          </div>
          <div class="colCtn">
            <span class="label">更新时间：</span>
            <span class="text">{{ $getDate(product_info.updated_at) }}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="tableCtn" style="margin:0;width:100%;">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">毛条名称</div>
                <div class="tcolumn">参考单价(元)</div>
                <div class="tcolumn">毛条属性</div>
                <div class="tcolumn">单价备注</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow">
                <div class="tcolumn">{{ product_info.name }}</div>
                <div class="tcolumn">{{ product_info.price }}元</div>
                <div class="tcolumn">{{ product_info.attribute }}</div>
                <div class="tcolumn">{{ product_info.desc || '无' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">库存信息</span>
      </div>
      <div style="padding:20px 32px">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">仓库</div>
              <div class="tcolumn">毛条名称</div>
              <div class="tcolumn">属性</div>
              <div class="tcolumn noPad" style="flex:5">
                <div class="trow">
                  <div class="tcolumn">批号</div>
                  <div class="tcolumn">库存数量(kg)</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow" v-for="item in store_info.list" :key="item.id">
              <div class="tcolumn">{{ item.store_name }}/{{ item.second_store_name || '-' }}</div>
              <div class="tcolumn">{{ item.name }}</div>
              <div class="tcolumn">{{ item.attribute || '无'}}</div>
              <div class="tcolumn noPad" style="flex: 5">
                <div class="trow" v-for="(itemStore, indexStore) in item.store_info" :key="indexStore">
                  <div class="tcolumn">{{ itemStore.batch_code }}</div>
                  <div class="tcolumn">{{ itemStore.reality_weight && $formatNum(itemStore.reality_weight) || '-' }}
                  </div>
                </div>
              </div>
            </div>
            <div class="trow bgGray noBorder">
              <div class="tcolumn">合计</div>
              <div class="tcolumn"></div>
              <div class="tcolumn"></div>
              <div class="tcolumn noPad" style="flex:5">
                <div class="trow">
                  <div class="tcolumn"></div>
                  <div class="tcolumn">{{ $formatNum(store_info.reality_weight) }}kg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">出入库日志</span>
      </div>
      <div style="padding:20px 32px">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">单号</div>
              <div class="tcolumn">类型</div>
              <div class="tcolumn" style="flex:2">出入库信息</div>
              <div class="tcolumn noPad" style="flex:4">
                <div class="trow">
                  <div class="tcolumn">毛条名称</div>
                  <div class="tcolumn">属性</div>
                  <div class="tcolumn">批号</div>
                  <div class="tcolumn">数量</div>
                  <!-- <div class="tcolumn">关联单号</div> -->
                </div>
              </div>
              <div class="tcolumn">创建人</div>
              <div class="tcolumn">创建时间</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow" v-for="item in store_log_info.list" :key="item.id">
              <div class="tcolumn">{{ item.code }}</div>
              <div class="tcolumn"
                :class="{ 'blue': item.action_type === 1 || item.action_type === 3 || item.action_type === 5 || item.action_type === 8 || item.action_type === 11 || item.action_type === 13 || item.action_type === 14 || item.action_type === 15, 'green': item.action_type === 2 || item.action_type === 4 || item.action_type === 6 || item.action_type === 7 || item.action_type === 9 || item.action_type === 10 || item.action_type === 12 }">
                {{ item.action_type | stockTypeFilter }}</div>
              <div class="tcolumn" style="flex:2" :style="{ 'height': 50 * item.child_data.length + 'px' }">
                <span
                  v-if="item.action_type === 1 || item.action_type === 3 || item.action_type === 5 || item.action_type === 8 || item.action_type === 13 || item.action_type === 14 || item.action_type === 15">
                  <span class="green">{{ item.client_name || '无来源' }}</span>
                  <i class="el-icon-s-unfold orange" style="margin:0 5px;font-size:16px"></i>
                  <span class="blue">{{ item.store_name }}/{{ item.second_store_name }}</span>
                </span>
                <span
                  v-if="item.action_type === 2 || item.action_type === 4 || item.action_type === 6 || item.action_type === 7 || item.action_type === 9 || item.action_type === 12">
                  <span class="blue">{{ item.store_name }}/{{ item.second_store_name }}</span>
                  <i class="el-icon-s-unfold orange" style="margin:0 5px;font-size:16px"></i>
                  <span class="green">{{ item.client_name }}</span>
                </span>
                <span v-if="item.action_type === 10 || item.action_type === 11">
                  <span class="green">{{ item.store_name }}/{{ item.second_store_name }}</span>
                  <i class="el-icon-s-unfold orange" style="margin:0 5px;font-size:16px"></i>
                  <span class="blue">{{ item.move_store_name }}/{{ item.move_second_store_name }}</span>
                </span>
              </div>
              <div class="tcolumn noPad" style="flex:4">
                <div class="trow" v-for="(itemChilid, indexChild) in item.child_data" :key="indexChild">
                  <div class="tcolumn">{{ itemChilid.name }}</div>
                  <div class="tcolumn">{{ itemChilid.attribute || '无' }}</div>
                  <div class="tcolumn">{{ itemChilid.batch_code || '无' }}</div>
                  <div class="tcolumn">{{ itemChilid.action_weight || 0 }}</div>
                  <!-- <div class="tcolumn"
                    :class="{ 'blue': item.action_type === 1 || item.action_type === 3 || item.action_type === 5 || item.action_type === 8, 'green': item.action_type === 2 || item.action_type === 4 || item.action_type === 6 || item.action_type === 7 || item.action_type === 9 }">
                    {{ itemChilid.action_weight }}</div> -->
                </div>
              </div>
              <div class="tcolumn">{{ item.user_name }}</div>
              <div class="tcolumn">{{ item.complete_time }}</div>
            </div>
            <div class="trow bgGray noBorder">
              <div class="tcolumn" style="display:block;line-height:46px">合计出库：<span class="green">{{
                $formatNum(store_log_info.total_pop)
              }}</span>kg</div>
              <div class="tcolumn"></div>
              <div class="tcolumn" style="display:block;line-height:46px">合计入库：<span class="blue">{{
                $formatNum(store_log_info.total_push)
              }}</span>kg</div>
              <div class="tcolumn"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray" @click="$router.go(-1)">返回</div>
          <!-- <div class="btn btnOrange" @click="$router.push('/product/update/' + $route.params.id)">修改</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { material, store, stock } from '@/assets/js/api'
import { Product } from '@/types/product'
import productCreate from '@/components/productCreate/productCreate.vue'
export default Vue.extend({
  components: { productCreate },
  data(): {
    product_info: Product
    [propName: string]: any
  } {
    return {
      loading: true,
      product_info: {
        name: '',
        user: {
          name: ''
        },
        price: '',
        desc: '',
        type_name: '',
        user_name: '',
        child_data: []
      },
      store_info: {
        reality_weight: 0,
        useable_weight: 0,
        list: []
      },
      store_log_info: {
        total_pop: 0,
        total_push: 0,
        list: 0
      }
    }
  },
  mounted() {
    material.detail({ id: this.$route.params.id }).then((res) => {
      this.product_info = res.data.data
      stock
        .materialList({
          store_id: '',
          page: 1,
          limit: 999,
          store_second_id: '',
          name: this.product_info.name,
          color: '',
          attribute: '',
          action_type: '',
          start_time: '',
          end_time: ''
        })
        .then((resLog) => {
          console.log(resLog.data.data)
          this.store_log_info = {
            total_pop: resLog.data.data.additional.total_pop || 0,
            total_push: resLog.data.data.additional.total_push || 0,
            list: resLog.data.data.items
          }
        })
      store
        .detailMateiralList({
          store_id: '',
          second_store_id: '',
          name: this.product_info.name,
          color: '',
          weight: 0
        })
        .then((resStore) => {
          this.store_info = {
            reality_weight: resStore.data.data
              .map((itemM: any) => +itemM.total_weight)
              .reduce((a: number, b: number) => a + b, 0),
            useable_weight: resStore.data.data
              .map((itemM: any) => +itemM.use_weight)
              .reduce((a: number, b: number) => a + b, 0),
            list: this.$mergeData(resStore.data.data, {
              mainRule: ['second_store_id', 'name', 'color', 'attribute'],
              otherRule: [{ name: 'second_store_name' }, { name: 'store_name' }],
              childrenName: 'store_info',
              childrenRule: {
                mainRule: ['color_code', 'vat_code', 'batch_code'],
                otherRule: [
                  { name: 'total_weight/reality_weight', type: 'add' },
                  { name: 'use_weight/useable_weight', type: 'add' }
                ]
              }
            })
          }
          this.loading = false
        })
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/product/detail.less';
</style>
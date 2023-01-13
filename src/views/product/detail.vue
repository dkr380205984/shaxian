<template>
  <div id="poductDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">纱线类型：</span>
            <span class="text">{{product_info.yarn_type|yarnTypeFilter}}</span>
          </div>
          <div class="colCtn">
            <span class="label">创建人：</span>
            <span class="text">{{product_info.user_name}}</span>
          </div>
          <div class="colCtn">
            <span class="label">更新时间：</span>
            <span class="text">{{$getDate(product_info.updated_at)}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="tableCtn"
            style="margin:0;width:100%;">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">纱线名称</div>
                <div class="tcolumn">纱线颜色</div>
                <div class="tcolumn">纱线属性</div>
                <div class="tcolumn">参考单价(元)</div>
                <div class="tcolumn">备注信息</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="item in product_info.child_data"
                :key="item.id">
                <div class="tcolumn">{{product_info.name}}</div>
                <div class="tcolumn">{{item.color}}</div>
                <div class="tcolumn">{{item.attribute}}</div>
                <div class="tcolumn">{{item.price}}元</div>
                <div class="tcolumn">{{item.desc||'无备注'}}</div>
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
              <div class="tcolumn">仓库信息</div>
              <div class="tcolumn">纱线颜色</div>
              <div class="tcolumn">纱线属性</div>
              <div class="tcolumn">所属客户</div>
              <div class="tcolumn noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcolumn">批号</div>
                  <div class="tcolumn">色号</div>
                  <div class="tcolumn">缸号</div>
                  <div class="tcolumn">库存数量(kg)</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in store_info.list"
              :key="item.id">
              <div class="tcolumn">{{item.store_name}}/{{item.second_store_name || '-'}}</div>
              <div class="tcolumn">{{item.color}}</div>
              <div class="tcolumn">{{item.attribute}}</div>
              <div class="tcolumn">{{item.store_client_name || '无'}}</div>
              <div class="tcolumn noPad"
                style="flex: 5">
                <div class="trow"
                  v-for="(itemStore,indexStore) in item.store_info"
                  :key="indexStore">
                  <div class="tcolumn">{{itemStore.batch_code}}</div>
                  <div class="tcolumn">{{itemStore.color_code}}</div>
                  <div class="tcolumn">{{itemStore.vat_code}}</div>
                  <div class="tcolumn">{{itemStore.reality_weight && $formatNum(itemStore.reality_weight) || '-'}}</div>
                </div>
              </div>
            </div>
            <div class="trow bgGray noBorder">
              <div class="tcolumn">合计</div>
              <div class="tcolumn"></div>
              <div class="tcolumn"></div>
              <div class="tcolumn"></div>
              <div class="tcolumn noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn">{{$formatNum(store_info.reality_weight)}}kg</div>
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
      <div class="listCtn">
        <div class="list fz14">
          <div class="overflow" style="overflow-y:hidden" @mousewheel.prevent="listenWheel" ref="list">
            <div class="tableCtn" style="margin:unset">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">单号</div>
                    <div class="column" style="min-width: 80px">操作类型</div>
                    <div class="column" style="min-width: 200px">出入库信息</div>
                    <div class="column" style="flex: 10; flex-direction: column">
                      <div class="row">
                        <div class="column min120">纱线名称</div>
                        <div class="column min120">颜色</div>
                        <div class="column min120">属性</div>
                        <div class="column min120">数量</div>
                        <div class="column min120">所属客户</div>
                        <div class="column min120">批号</div>
                        <div class="column min120">色号</div>
                        <div class="column min120">缸号</div>
                      </div>
                    </div>
                    <div class="column min120">绑定单号</div>
                    <div class="column min120">备注信息</div>
                    <div class="column min120">日期</div>
                    <div class="column min120">操作人</div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div class="row" style="height:unset" v-for="item in store_log_info.list" :key="item.id + item.code">
                    <!-- 订购入库 -->
                    <div class="column min120 hoverBlue" style="cursor:pointer" v-if="item.action_type === 3" @click="$router.push('/directOrder/yarnDetail/' + item.related_id)">{{ item.code }}</div>
                    <!-- 工艺单入库 -->
                    <div class="column min120 hoverBlue" style="cursor:pointer" v-else-if="item.action_type === 8" @click="$router.push('/material/craftDetail/' + item.related_id)">{{ item.code }}</div>
                    <!-- 订单发货 和 加工单位直接发货 -->
                    <div class="column min120 hoverBlue" style="cursor:pointer" v-else-if="item.action_type === 9 || item.action_type === 18" @click="$router.push('/order/detail/' + item.order_id)">{{ item.code }}</div>
                    <!-- 销售出库 -->
                    <div class="column min120 hoverBlue" style="cursor:pointer" v-else-if="item.action_type === 12" @click="$router.push('/order/detail/' + item.id)">{{ item.code }}</div>
                    <!-- 加工调取 -->
                    <div class="column min120 hoverBlue" style="cursor:pointer" v-else-if="item.action_type === 16" @click="$router.push('/directProcess/yarnDetailNew/' + item.id)">{{ item.code }}</div>
                    <!-- 加工回库，跳转到调取单 -->
                    <div class="column min120 hoverBlue" style="cursor:pointer" v-else-if="item.action_type === 17" @click="$router.push('/directProcess/yarnDetailNew/' + item.related_id  )">{{ item.code }}</div>
                    <div class="column min120" v-else>{{ item.code }}</div>
                    <div
                      class="column"
                      style="min-width: 80px; max-width: 80px"
                      :class="{
                        blue:
                          item.action_type === 1 ||
                          item.action_type === 3 ||
                          item.action_type === 5 ||
                          item.action_type === 8 ||
                          item.action_type === 11 ||
                          item.action_type === 13 ||
                          item.action_type === 14 ||
                          item.action_type === 15 ||
                          item.action_type === 17,
                        green:
                          item.action_type === 2 ||
                          item.action_type === 4 ||
                          item.action_type === 6 ||
                          item.action_type === 7 ||
                          item.action_type === 9 ||
                          item.action_type === 10 ||
                          item.action_type === 12 ||
                          item.action_type === 16 ||
                          item.action_type === 18
                      }"
                    >
                      {{ item.action_type | stockTypeFilter }}
                    </div>
                    <div
                      class="column"
                      style="min-width: 200px; max-width: 200px"
                      :style="{ height: 50.6 * item.child_data.length + 'px' }"
                    >
                      <span
                        v-if="
                          item.action_type === 1 ||
                          item.action_type === 3 ||
                          item.action_type === 5 ||
                          item.action_type === 8 ||
                          item.action_type === 13 ||
                          item.action_type === 14 ||
                          item.action_type === 15 ||
                          item.action_type === 17
                        "
                      >
                        <span class="green">{{ item.client_name || '无来源' }}</span>
                        <i class="el-icon-s-unfold orange" style="margin: 0 5px; font-size: 16px"></i>
                        <span class="blue">{{ item.store_name }}/{{ item.second_store_name }}</span>
                      </span>
                      <span
                        v-if="
                          item.action_type === 2 ||
                          item.action_type === 4 ||
                          item.action_type === 6 ||
                          item.action_type === 7 ||
                          item.action_type === 9 ||
                          item.action_type === 12 ||
                          item.action_type === 16 || 
                          item.action_type === 18
                        "
                      >
                        <span class="blue">{{ item.store_name }}/{{ item.second_store_name }}</span>
                        <i class="el-icon-s-unfold orange" style="margin: 0 5px; font-size: 16px"></i>
                        <span class="green">{{ item.client_name }}</span>
                      </span>
                      <span v-if="item.action_type === 10 || item.action_type === 11">
                        <span class="green">{{ item.store_name }}/{{ item.second_store_name }}</span>
                        <i class="el-icon-s-unfold orange" style="margin: 0 5px; font-size: 16px"></i>
                        <span class="blue">{{ item.move_store_name }}/{{ item.move_second_store_name }}</span>
                      </span>
                    </div>
                    <div class="column noPad" style="flex-direction: column; width: 0; overflow: hidden">
                      <div
                        class="row"
                        v-for="(itemChild, indexChild) in item.child_data"
                        :key="indexChild + itemChild.name"
                         style="height: 60px"
                      >
                        <div class="column min120">{{ itemChild.name }}</div>
                        <div class="column min120">{{ itemChild.color }}</div>
                        <div class="column min120">{{ itemChild.attribute }}</div>
                        <div class="column min120 blue">{{ itemChild.action_weight }}</div>
                        <div class="column min120">{{ itemChild.batch_code }}</div>
                        <div class="column min120">{{ itemChild.color_code }}</div>
                        <div class="column min120">{{ itemChild.vat_code }}</div>
                      </div>
                    </div>
                    <div class="column" style="flex: 10; flex-direction: column">
                      <div
                        class="row"
                        v-for="(itemChild, indexChild) in item.child_data"
                        :key="indexChild + itemChild.name"
                      >
                        <div class="column min120">{{ itemChild.name }}</div>
                        <div class="column min120">{{ itemChild.color }}</div>
                        <div class="column min120">{{ itemChild.attribute }}</div>
                        <div class="column min120 blue">{{ itemChild.action_weight }}</div>
                        <div class="column min120">{{ itemChild.store_client_name || '无' }}</div>
                        <div class="column min120">{{ itemChild.batch_code }}</div>
                        <div class="column min120">{{ itemChild.color_code }}</div>
                        <div class="column min120">{{ itemChild.vat_code }}</div>
                      </div>
                    </div>
                    <div
                      class="column min120"
                      :class="{ blue: item.related_info }"
                      :style="{ cursor: item.related_info ? 'pointer' : '' }"
                      @click="goFromStore(item.action_type, item.related_info)"
                    >
                      {{ item.related_info ? item.related_info.code : '无单号' }}
                    </div>
                    <div class="column min120">{{ item.desc || '无' }}</div>
                    <div class="column min120">{{ item.complete_time }}</div>
                    <div class="column min120">{{ item.user_name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="display: flex">
          <span class="blue" style="font-weight: bold">合计入库：{{ store_log_info.total_pop }}kg</span>
          <span class="green" style="font-weight: bold; margin-left: 20px"
            >合计出库：{{ store_log_info.total_push }}kg</span
          >
        </div>
      </div>
      <!-- <div style="padding:20px 32px">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">单号</div>
              <div class="tcolumn">类型</div>
              <div class="tcolumn"
                style="flex:2">库存变动</div>
              <div class="tcolumn noPad"
                style="flex:4">
                <div class="trow">
                  <div class="tcolumn">颜色/属性</div>
                  <div class="tcolumn">所属客户</div>
                  <div class="tcolumn">批号</div>
                  <div class="tcolumn">色号</div>
                  <div class="tcolumn">缸号</div>
                  <div class="tcolumn">数量</div>
                </div>
              </div>
              <div class="tcolumn">日期</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in store_log_info.list"
              :key="item.id">
              <div class="tcolumn">{{item.code}}</div>
              <div class="tcolumn"
                :class="{'blue':item.action_type===1||item.action_type===3||item.action_type===5||item.action_type===8||item.action_type===11||item.action_type===13||item.action_type===14||item.action_type===15,'green':item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7||item.action_type===9||item.action_type===10||item.action_type===12}">{{item.action_type|stockTypeFilter}}</div>
              <div class="tcolumn"
                style="flex:2"
                :style="{'height':50*item.child_data.length + 'px'}">
                <span v-if="item.action_type===1||item.action_type===3||item.action_type===5||item.action_type===8||item.action_type===13||item.action_type===14||item.action_type===15">
                  <span class="green">{{item.client_name ||'无来源'}}</span>
                  <i class="el-icon-s-unfold orange"
                    style="margin:0 5px;font-size:16px"></i>
                  <span class="blue">{{item.store_name}}/{{item.second_store_name}}</span>
                </span>
                <span v-if="item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7||item.action_type===9 || item.action_type===12">
                  <span class="blue">{{item.store_name}}/{{item.second_store_name}}</span>
                  <i class="el-icon-s-unfold orange"
                    style="margin:0 5px;font-size:16px"></i>
                  <span class="green">{{item.client_name}}</span>
                </span>
                <span v-if="item.action_type===10 || item.action_type===11">
                  <span class="green">{{item.store_name}}/{{item.second_store_name}}</span>
                  <i class="el-icon-s-unfold orange"
                    style="margin:0 5px;font-size:16px"></i>
                  <span class="blue">{{item.move_store_name}}/{{item.move_second_store_name}}</span>
                </span>
              </div>
              <div class="tcolumn noPad"
                style="flex:4">
                <div class="trow"
                  v-for="(itemChilid,indexChild) in item.child_data"
                  :key="indexChild">
                  <div class="tcolumn">{{itemChilid.color}}/{{itemChilid.attribute}}</div>
                  <div class="tcolumn">{{itemChilid.store_client_name || '无'}}</div>
                  <div class="tcolumn">{{itemChilid.batch_code}}</div>
                  <div class="tcolumn">{{itemChilid.color_code}}</div>
                  <div class="tcolumn">{{itemChilid.vat_code}}</div>
                  <div class="tcolumn"
                    :class="{'blue':item.action_type===1||item.action_type===3||item.action_type===5||item.action_type===8,'green':item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7||item.action_type===9 }">{{itemChilid.action_weight}}</div>
                </div>
              </div>
              <div class="tcolumn">{{item.complete_time}}</div>
            </div>
            <div class="trow bgGray noBorder">
              <div class="tcolumn"
                style="display:block;line-height:46px">合计出库：<span class="green">{{$formatNum(store_log_info.total_pop)}}</span>kg</div>
              <div class="tcolumn"></div>
              <div class="tcolumn"
                style="display:block;line-height:46px">合计入库：<span class="blue">{{$formatNum(store_log_info.total_push)}}</span>kg</div>
              <div class="tcolumn"></div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnOrange"
            @click="$router.push('/product/update/'+$route.params.id)">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { product, store, stock } from '@/assets/js/api'
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
        yarn_type: [],
        yarn_type_name: '',
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
  methods: {
    // 监听一下鼠标滚轮
    listenWheel(ev: any) {
      const detail = ev.wheelDelta || ev.detail
      // 定义滚动方向，其实也可以在赋值的时候写
      const moveForwardStep = 1
      const moveBackStep = -1
      // 定义滚动距离
      let step = 0
      // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
      if (detail < 0) {
        step = moveForwardStep * 50
      } else {
        step = moveBackStep * 50
      }
      // @ts-ignore 对需要滚动的元素进行滚动操作
      this.$refs.list.scrollLeft += step
    },
  },
  mounted() {
    product.detail({ id: this.$route.params.id }).then((res) => {
      this.product_info = res.data.data
      stock
        .list({
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
        .detailYarnList({
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
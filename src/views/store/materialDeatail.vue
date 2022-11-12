<template>
  <div class="indexMain"
    id="storeDetail"
    v-loading='loading.page'>
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">仓库名称：</span>
            <span class="text green">{{storeDetail.name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">仓库类型：</span>
            <span class="text">{{storeDetail.type|filterStoreType}}</span>
          </div>
          <div class="colCtn">
            <span class="label">仓库管理员：</span>
            <span class="text">{{storeDetail.manager_data.map(itemM=>itemM.name).join('、')}}</span>
          </div>
          <div class="colCtn">
            <span class="label">二级仓库名：</span>
            <span class="text">{{storeDetail.second_data.map(itemM=>itemM.name).join('、')}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">创建人：</span>
            <span class="text">{{storeDetail.user_name}}</span>
          </div>
          <div class="colCtn">
            <span class="label flex3">创建时间：</span>
            <span class="text">{{$getDate(storeDetail.create_time)}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{storeDetail.desc}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">库存信息</span>
        <span class="addBtn btn btnMain"
          @click="openStore">新增出入库</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-select v-model="storeListFilter.LV2_name"
                clearable
                @change="getStoreInfoList"
                placeholder="请选择二级仓库名称">
                <el-option v-for="item in storeDetail.second_data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-input v-model="storeListFilter.name"
                @change="getStoreInfoList"
                placeholder="请输入毛条名称"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="storeListFilter.color"
                @change="getStoreInfoList"
                placeholder="请输入毛条颜色"></el-input>
            </div>
            <div class="elCtn">
              <el-checkbox v-model="storeListFilter.isFilterZero"
                @change="getStoreInfoList">过滤库存为0的毛条</el-checkbox>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr"
              @click="resetFilter(1)">重置</div>
          </div>
        </div>
        <div class="tableCtn"
          style="margin:24px 0"
          v-loading='!loading.page && loading.info'>
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">二级仓库名称</div>
              <div class="tcolumn">毛条名称</div>
              <div class="tcolumn noPad flex5">
                <div class="trow">
                  <div class="tcolumn">批号</div>
                  <div class="tcolumn">实际库存(KG)</div>
                  <div class="tcolumn">可用库存(KG)</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in storeListCom.data"
              :key="item.id">
              <div class="tcolumn">{{item.second_store_name || '-'}}</div>
              <div class="tcolumn">{{item.name}}</div>
              <div class="tcolumn noPad flex5">
                <div class="trow"
                  v-for="(itemStore,indexStore) in item.store_info"
                  :key="indexStore">
                  <div class="tcolumn">{{itemStore.batch_code}}</div>
                  <div class="tcolumn">{{itemStore.reality_weight && $formatNum(itemStore.reality_weight) || '-'}}</div>
                  <div class="tcolumn blue">{{itemStore.useable_weight && $formatNum(itemStore.useable_weight) || '-'}}</div>
                  <div class="tcolumn flexRow">
                    <span class="opr green"
                      @click="goLogEl(item)">日志</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow bgGray noBorder">
              <div class="tcolumn">合计</div>
              <div class="tcolumn"></div>
              <div class="tcolumn noPad flex5">
                <div class="trow">
                  <div class="tcolumn"></div>
                  <div class="tcolumn">{{$formatNum($toFixed(storeListCom.reality_weight))}}</div>
                  <div class="tcolumn blue">{{$formatNum($toFixed(storeListCom.useable_weight))}}</div>
                  <div class="tcolumn"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      id="stockLogEl">
      <div class="titleCtn">
        <span class="title">出入库日志</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn showMore">
          <div class="leftCtn" style="padding-right:unset;">
            <div class="label">筛选条件：</div>
            <!-- <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div> -->
            <div class="elCtn">
              <el-select v-model="storeLogListFilter.LV2_name"
                clearable
                @change="getStoreLogList(1)"
                placeholder="请选择二级仓库名称">
                <el-option v-for="item in storeDetail.second_data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-input v-model="storeLogListFilter.name"
                @change="getStoreLogList(1)"
                placeholder="输入毛条名称"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="storeLogListFilter.type"
                clearable
                @change="getStoreLogList(1)"
                placeholder="选择操作类型">
                <el-option v-for="item in commonInit.typeArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-input v-model="storeLogListFilter.code"
                @change="getStoreLogList(1)"
                placeholder="输入关联单号"></el-input>
            </div>
            <div class="elCtn">
              <el-date-picker v-model="storeLogListFilter.time"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getStoreLogList(1)">
              </el-date-picker>
              
            </div>
            <div class="elCtn">
              <el-select v-model="storeLogListFilter.limit"
                clearable
                @change="getStoreLogList(1)"
                placeholder="每页展示条数（默认5）">
                <el-option v-for="item in [
                  {
                    id:5,
                    name:'5条'
                  },
                  {
                    id:10,
                    name:'10条'
                  },
                  {
                    id:15,
                    name:'15条'
                  },
                  {
                    id:20,
                    name:'20条'
                  },
                  {
                    id:25,
                    name:'25条'
                  }
                ]"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="rightCtn" style="min-width:94px">
            <div class="btn btnGray fr"
              @click="resetFilter(2)">重置</div>
          </div>
        </div>
        <div style="padding:20px 0">
          <div class="tableCtn"
            v-loading='!loading.page && loading.log'>
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">单号</div>
                <div class="tcolumn">类型</div>
                <div class="tcolumn"
                  style="flex:2">库存变动</div>
                <div class="tcolumn noPad"
                  style="flex:3">
                  <div class="trow">
                    <div class="tcolumn">名称</div>
                    <div class="tcolumn">数量</div>
                    <div class="tcolumn">批号</div>
                  </div>
                </div>
                <div class="tcolumn">日期</div>
                <div class="tcolumn">操作</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="item in  storeLogInfo.list"
                :key="item.id">
                <div class="tcolumn">{{item.code}}</div>
                <div class="tcolumn"
                  :class="{'blue':item.action_type===1||item.action_type===3||item.action_type===5||item.action_type===8||item.action_type===11,'green':item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7||item.action_type===9||item.action_type===10}">{{item.action_type|stockTypeFilter}}</div>
                <div class="tcolumn"
                  style="flex:2">
                  <span v-if="item.action_type===1||item.action_type===3||item.action_type===5||item.action_type===8">
                    <span class="green">{{item.client_name ||'无来源'}}</span>
                    <i class="el-icon-s-unfold orange"
                      style="margin:0 5px;font-size:16px"></i>
                    <span class="blue">{{item.second_store_name}}</span>
                  </span>
                  <span v-if="item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7||item.action_type===9">
                    <span class="blue">{{item.second_store_name}}</span>
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
                  style="flex:3">
                  <div class="trow"
                    v-for="(itemChilid,indexChild) in item.child_data"
                    :key="indexChild">
                    <div class="tcolumn">{{itemChilid.name}}</div>
                    <div class="tcolumn"
                      :class="{'blue':item.action_type===1||item.action_type===3||item.action_type===5,'green':item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7}">{{itemChilid.action_weight}}</div>
                    <div class="tcolumn">{{itemChilid.batch_code}}</div>
                  </div>
                </div>
                <div class="tcolumn">{{item.complete_time}}</div>
                <div class="tcolumn">
                  <span class="blue"
                    style="cursor: pointer"
                    @click="$openUrl(`/print/materialStore/${ (item.action_type===1||item.action_type===3||item.action_type===5) ?  1 : 2}/${item.id}${(item.order_id && ('?orderId=' + item.order_id)) || ''}`)">打印</span>
                </div>
              </div>
              <div class="trow bgGray noBorder">
                <div class="tcolumn"
                  style="display:block;line-height:46px">合计出库：<span class="green">{{$formatNum(storeLogInfo.total_pop)}}</span>kg</div>
                <div class="tcolumn"></div>
                <div class="tcolumn"
                  style="display:block;line-height:46px">合计入库：<span class="blue">{{$formatNum(storeLogInfo.total_push)}}</span>kg</div>
                <div class="tcolumn"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            @current-change="getStoreLogList"
            :current-page.sync="storeLogListFilter.pages"
            :page-size="storeLogListFilter.limit"
            layout="prev, pager, next"
            :total="storeLogListFilter.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
    <in-and-out-mat :noChange="false"
      :firstStoreId="$route.params.id"
      :show.sync="show_store"></in-and-out-mat>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { StoreDetail } from '@/types/common'
import { store, stock } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    storeDetail: StoreDetail
    storeList: Array<{
      [key: string]: any
    }>
    commonInit: {
      typeArr: Array<{ id: number; name: string }>
    }
    [propName: string]: any
  } {
    return {
      show_store: false,
      showMore: false,
      loading: {
        page: true,
        info: true,
        log: true
      },
      // 仓库数据
      storeDetail: {
        id: NaN,
        name: '',
        manager_data: [],
        second_data: [],
        type: 1,
        create_time: null,
        user_name: '',
        desc: ''
      },
      // 库存数据
      storeList: [],
      storeListFilter: {
        LV2_name: '',
        name: '',
        color: '',
        isFilterZero: true,
        page: 1,
        total: 1
      },
      // 日志数据
      storeLogInfo: {
        total_push: 0,
        total_pop: 0,
        list: []
      },
      storeLogListFilter: {
        LV2_name: '',
        name: '',
        color: '',
        attr: '',
        type: '',
        code: '',
        limit: 10,
        pages: 1,
        total: 1,
        time: ''
      },
      // 初始化公共数据
      commonInit: {
        typeArr: [
          {
            id: 1,
            name: '仓库入库'
          },
          {
            id: 2,
            name: '仓库出库'
          },
          {
            id: 3,
            name: '采购入库'
          },
          {
            id: 4,
            name: '调取出库'
          },
          {
            id: 5,
            name: '加工回库'
          },
          {
            id: 6,
            name: '加工出库'
          },
          {
            id: 8,
            name: '工艺单入库'
          },
          {
            id: 9,
            name: '订单发货'
          },
          {
            id: 10,
            name: '仓库移库'
          },
          {
            id: 16,
            name: '加工调取'
          }
        ]
      }
    }
  },

  methods: {
    init() {
      Promise.all([
        store.detail({
          id: Number(this.$route.params.id)
        })
      ]).then((res) => {
        this.loading.page = false
        this.storeDetail = res[0].data.data
      })
      this.getStoreInfoList()
      this.getStoreLogList()
    },
    getStoreInfoList() {
      this.loading.info = true
      store
        .detailMateiralList({
          store_id: this.$route.params.id,
          second_store_id: this.storeListFilter.LV2_name || null,
          name: this.storeListFilter.name || null,
          color: this.storeListFilter.color || null,
          weight: this.storeListFilter.isFilterZero ? 0 : null
        })
        .then((res) => {
          this.storeList = res.data.data
          this.loading.info = false
        })
    },
    // 1是库存信息2是日志
    resetFilter(type: 1 | 2) {
      if (type === 1) {
        this.storeListFilter = {
          LV2_name: '',
          name: '',
          color: '',
          isFilterZero: true,
          page: 1,
          total: 1
        }
        this.getStoreInfoList()
      } else if (type === 2) {
        this.storeLogListFilter = {
          LV2_name: '',
          name: '',
          color: '',
          attr: '',
          type: '',
          code: '',
          limit: 10,
          pages: 1,
          total: 1,
          time: ''
        }
        this.getStoreLogList()
      } else {
        this.$message.warning('未知重置错误')
      }
    },
    // 获取出入库日志
    getStoreLogList(pages: number = 1) {
      this.loading.log = true
      stock
        .materialList({
          store_id: this.$route.params.id,
          page: pages,
          limit: this.storeLogListFilter.limit || 10,
          store_second_id: this.storeLogListFilter.LV2_name || null,
          name: this.storeLogListFilter.LV2_name || null,
          action_type: this.storeLogListFilter.type || null,
          start_time:
            this.storeLogListFilter.time && this.storeLogListFilter.time.length > 0
              ? this.storeLogListFilter.time[0]
              : '',
          end_time:
            this.storeLogListFilter.time && this.storeLogListFilter.time.length > 0
              ? this.storeLogListFilter.time[1]
              : ''
        })
        .then((res) => {
          console.log(res)
          this.storeLogInfo = {
            total_pop: res.data.data.others_data.total_pop || 0,
            total_push: res.data.data.others_data.total_push || 0,
            list: res.data.data.data.items
          }
          this.storeLogListFilter.total = res.data.data.data.total

          this.loading.log = false
          // 更新页码
          if (pages !== this.storeLogListFilter.pages) {
            this.storeLogListFilter.pages = pages
          }
        })
    },
    // 跳转日志
    goLogEl(item: { second_store_id: number; name: string; color: string; attr: string; [key: string]: any }) {
      this.storeLogListFilter.LV2_name = item.second_store_id
      this.storeLogListFilter.name = item.name
      this.storeLogListFilter.color = item.color
      this.storeLogListFilter.attr = item.attribute
      this.$goElView('stockLogEl')
      this.getStoreLogList()
    },
    openStore() {
      this.show_store = true
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/client',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPartyBAsync'
      },
      {
        checkWhich: 'api/materialType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getMaterialTypeAsync'
      }
    ])
    this.init()
  },
  filters: {
    filterStoreType(item: number) {
      switch (item) {
        case 1:
          return '本厂仓库'
        case 2:
          return '染厂仓库'
        default:
          return 'unknown type'
      }
    },
    filterType(item: number) {
      switch (item) {
        case 1:
          return '入库'
        case 2:
          return '出库'
        default:
          return 'unknown type'
      }
    }
  },
  computed: {
    storeListCom(): {
      reality_weight: number
      useable_weight: number
      data: object[]
    } {
      return {
        reality_weight: this.storeList.map((itemM) => +itemM.total_weight).reduce((a, b) => a + b, 0),
        useable_weight: this.storeList.map((itemM) => +itemM.use_weight).reduce((a, b) => a + b, 0),
        data: this.$mergeData(this.storeList, {
          mainRule: ['second_store_id', 'name'],
          otherRule: [{ name: 'second_store_name' }],
          childrenName: 'store_info',
          childrenRule: {
            mainRule: ['batch_code'],
            otherRule: [
              { name: 'total_weight/reality_weight', type: 'add' },
              { name: 'use_weight/useable_weight', type: 'add' }
            ]
          }
        })
      }
    },
    mat_type_list() {
      return this.$store.state.api.materialType.arr.map((item: any) => {
        return {
          value: item.id,
          label: item.name,
          children: item.child_data.map((itemChild: any) => {
            return {
              value: itemChild.id,
              label: itemChild.name
            }
          })
        }
      })
    },
    client_list() {
      return this.$store.state.api.client.arr
        .concat(this.$store.state.api.supplier.arr)
        .concat(this.$store.state.api.factory.arr)
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/store/detail.less';
</style>
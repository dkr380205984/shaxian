<template>
  <div id="yarnList" class="indexMain" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">纱线采购单列表</span>
        <span class="addBtn btn btnMain" @click="showAddPO = true">添加采购单</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn showMore">
          <div class="leftCtn" style="padding: unset; max-width: unset">
            <div class="label">筛选条件：</div>
            <!-- <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div> -->
            <div class="elCtn">
              <el-input v-model="code" placeholder="请输入采购单号搜索" @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="client_id" placeholder="选择采购单位" clearable @change="changeRouter(1)">
                <el-option v-for="item in client_arr" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-input v-model="name" placeholder="搜索纱线名称" @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="user_id" clearable placeholder="选择创建人" @change="changeRouter(1)">
                <el-option v-for="item in user_list" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-select v-model="page_size" placeholder="选择每页展示的条数" @change="changeRouter(1)">
                <el-option label="每页10条" :value="10"></el-option>
                <el-option label="每页20条" :value="20"></el-option>
                <el-option label="每页30条" :value="30"></el-option>
              </el-select>
            </div>
            <div class="elCtn middle" style="width: 350px">
              <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeRouter(1)"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="rightCtn" style="min-width: 94px">
            <div class="btn btnGray fr" @click="reset">重置</div>
          </div>
        </div>
        <!-- 
          <el-table-column prop="delivery_time" label="交货日期" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.status !== 3" style="display: flex; flex-direction: column">
                  <span>{{ scope.row.delivery_time }}</span>
                  <span
                    :class="{
                      red: $diffByDate(scope.row.delivery_time) <= 0,
                      green: $diffByDate(scope.row.delivery_time) > 7,
                      orange: $diffByDate(scope.row.delivery_time) <= 7 && $diffByDate(scope.row.delivery_time) > 0
                    }"
                  >
                    {{
                      $diffByDate(scope.row.delivery_time) > 0
                        ? '交货还剩' + $diffByDate(scope.row.delivery_time) + '天'
                        : '延期发货' + Math.abs($diffByDate(scope.row.delivery_time)) + '天'
                    }}
                  </span>
                </div>
                <div v-if="scope.row.status === 3" style="display: flex; flex-direction: column">
                  <span>{{ scope.row.delivery_time }}</span>
                  <span class="green">已完成</span>
                </div>
              </template>
            </el-table-column>
        -->
        <div class="filterCtn" style="min-height: 33px; justify-content: unset; margin-bottom: 18px">
          <div class="btn backHoverOrange" @click="showSetting = true" style="margin-left: 0">列表设置</div>
          <div
            class="btn backHoverGreen"
            style="margin-left: 20px"
            @click="
              getFilters()
              getList()
            "
          >
            刷新列表
          </div>
        </div>
        <zh-list
          :list="list"
          :check="true"
          :checkedCount="checkedCount"
          :listKey="listKey"
          :loading="loading"
          :oprList="oprList"
        ></zh-list>
        <div class="pageCtn">
          <el-pagination
            background
            :current-page.sync="page"
            :page-size="page_size"
            layout="prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <shaxianAddPO
      :show="showAddPO"
      :update="update_flag"
      @close="resetInfo"
      :info="order_yarn_info"
      @afterCreate="afterCreate"
    ></shaxianAddPO>
    <!-- 列表设置 -->
    <zh-list-setting
      @close="showSetting = false"
      @afterSave="getListSetting"
      :show="showSetting"
      :id="listSettingId"
      :type="2"
      :data.sync="listKey"
      :originalData="originalSetting"
    ></zh-list-setting>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { product, yarnOrder, listSetting } from '@/assets/js/api'
import { OrderYarn } from '@/types/orderProcessYarn'
export default Vue.extend({
  data(): {
    order_yarn_info: OrderYarn
    [propName: string]: any
  } {
    return {
      loading: true,
      page: 1,
      total: 1,
      page_size: 10,
      showMore: false,
      client_id: '',
      code: '',
      name: '',
      status: '',
      date: [],
      user_id: '',
      showAddPO: false,
      update_flag: false,
      select_loading: false,
      showSetting: false,
      listSettingId: null,
      listKey: [],
      checkedCount: [],
      originalSetting: [
        {
          key: 'code',
          name: '采购单号',
          ifShow: true,
          ifLock: true,
          index: 0
        },
        {
          key: 'client_name',
          name: '采购单位',
          ifShow: true,
          ifLock: true,
          index: 1
        },
        {
          key: 'status',
          name: '采购单状态',
          filterArr: ['未知', '已创建', '进行中', '已完成', '已取消'],
          classArr: ['', 'orange', 'blue', 'green', 'gray'],
          ifShow: true,
          ifLock: false,
          index: 2,
          isStatus: true
        },
        {
          key: 'is_check',
          name: '审核信息',
          filterArr: ['待审核', '已通过', '已驳回'],
          classArr: ['orange', 'green', 'red'],
          ifShow: true,
          ifLock: false,
          index: 3,
          isStatus: true
        },
        {
          key: 'name',
          name: '纱线名称',
          ifShow: true,
          ifLock: false,
          index: 4,
          from: 'child_data',
          mark: true
        },
        {
          key: 'color',
          name: '颜色',
          ifShow: true,
          ifLock: false,
          index: 5,
          from: 'child_data'
        },
        {
          key: 'weight',
          name: '采购数量(kg)',
          ifShow: true,
          ifLock: false,
          index: 6,
          from: 'child_data',
          numberToString: true
        },
        {
          key: 'total_weight',
          name: '采购总数(kg)',
          ifShow: true,
          ifLock: false,
          index: 7,
          numberToString: true
        },
        {
          key: 'push_weight',
          name: '入库总数(kg)',
          ifShow: true,
          ifLock: false,
          index: 8,
          numberToString: true
        },
        {
          key: 'total_price',
          name: '下单总价（元）',
          ifShow: true,
          ifLock: false,
          index: 9,
          numberToString: true
        },
        {
          key: 'delivery_time',
          name: '交货日期',
          ifShow: true,
          ifLock: false,
          index: 10
        },
        {
          key: 'order_time',
          name: '下单日期',
          ifShow: true,
          ifLock: false,
          index: 11
        },
        {
          key: 'image_data',
          name: '补充说明',
          ifShow: true,
          ifLock: false,
          ifImage: true,
          index: 12
        },
        {
          key: 'user_name',
          name: '操作人',
          ifShow: true,
          ifLock: false,
          index: 13
        }
      ],
      oprList: [
        {
          name: '详情',
          class: 'hoverBlue',
          fn: (item: any) => {
            this.$router.push('/directOrder/yarnDetail/' + item.id)
          }
        },
        {
          name: '修改',
          class: 'hoverOrange',
          fn: (item: any) => {
            // @ts-ignore
            this.openUpdate(item)
          }
        },
        {
          name: '删除',
          class: 'hoverRed',
          fn: (item: any) => {
            // @ts-ignore
            this.openDelete(item.id)
          }
        }
      ],
      order_yarn_info: {
        order_id: '',
        client_id: '',
        total_price: '',
        child_data: [
          {
            name: '',
            weight: '',
            color: '白胚',
            attribute: '',
            price: ''
          }
        ],
        order_time: this.$getDate(new Date()),
        delivery_time: '',
        additional_fee: [
          {
            name: '',
            price: '',
            desc: ''
          }
        ],
        total_additional_fee: 0,
        file_url: '',
        desc: ''
      },
      list: [],
      product_arr: []
    }
  },
  computed: {
    client_arr() {
      return this.$store.state.api.factory.arr
    },
    user_list() {
      return this.$store.state.api.user.arr
    }
  },
  watch: {
    page(newVal) {
      this.changeRouter(newVal)
    },
    checkedCount(newVal) {
      if (newVal.length > 0) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
    $route() {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    getListSetting() {
      this.listKey = []
      listSetting
        .detail({
          type: 2
        })
        .then((res) => {
          this.listSettingId = res.data.data ? res.data.data.id : null
          this.listKey = res.data.data
            ? JSON.parse(res.data.data.content).length > 0
              ? JSON.parse(res.data.data.content)
              : this.$clone(this.originalSetting)
            : this.$clone(this.originalSetting)
        })
    },
    changeRouter(page: string) {
      const pages = page || 1
      this.$router.push(
        '/directOrder/yarnList?page=' +
          pages +
          '&code=' +
          this.code +
          '&name=' +
          this.name +
          '&client_id=' +
          this.client_id +
          '&user_id=' +
          this.user_id +
          '&page_size=' +
          this.page_size +
          '&date=' +
          this.date
      )
    },
    // 下面两个函数是让el-table滚动的
    reset() {
      this.$router.push('/directOrder/yarnList?page=1&code=&name=&client_id=&user_id=&page_size=10&date=')
    },
    getFilters() {
      const params = this.$route.query
      this.page = Number(params.page)
      this.page_size = Number(params.page_size)
      this.user_id = params.user_id ? Number(params.user_id) : ''
      this.client_id = params.client_id ? Number(params.client_id) : ''
      this.name = params.name
      this.code = params.code
      if (params.date !== 'null' && params.date !== '') {
        this.date = (params.date as string).split(',')
      } else {
        this.date = []
      }
    },
    afterCreate() {
      this.getList()
      this.resetInfo()
    },
    searchPro(query: string) {
      if (query !== '') {
        product
          .list({
            limit: 5,
            page: 1,
            name: query
          })
          .then((res) => {
            this.product_arr = res.data.data.items
          })
      } else {
        this.product_arr = []
      }
    },
    resetInfo() {
      this.showAddPO = false
      this.update_flag = false
      this.order_yarn_info = {
        order_id: '',
        client_id: '',
        total_price: '',
        total_additional_fee: 0,
        child_data: [
          {
            name: '',
            weight: '',
            color: '白胚',
            attribute: '',
            price: ''
          }
        ],
        order_time: this.$getDate(new Date()),
        delivery_time: '',
        file_url: '',
        additional_fee: [
          {
            name: '',
            price: '',
            desc: ''
          }
        ],
        desc: ''
      }
    },
    changeIndex(father: any, type: string) {
      if (!father.index) {
        father.index = 0
      }
      if (type === 'add') {
        if (father.index < father.child_data.length - 1) {
          father.index++
        } else {
          father.index = 0
        }
      }
      if (type === 'delete') {
        if (father.index === 0) {
          father.index = father.child_data.length - 1
        } else {
          father.index--
        }
      }
      this.$forceUpdate()
    },
    openUpdate(info: OrderYarn) {
      const selfInfo = JSON.parse(JSON.stringify(info))
      this.showAddPO = true
      this.update_flag = true
      selfInfo.additional_fee = selfInfo.additional_fee
        ? JSON.parse(info.additional_fee as string)
        : [
            {
              name: '',
              price: '',
              desc: ''
            }
          ]
      this.order_yarn_info = selfInfo
    },
    getList() {
      this.loading = true
      yarnOrder
        .list({
          code: this.code,
          client_id: this.client_id,
          name: this.name,
          user_id: this.user_id,
          start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          end_time: this.date && this.date.length > 0 ? this.date[1] : '',
          page: this.page,
          limit: this.page_size
        })
        .then((res) => {
          res.data.data.items.forEach((item: any) => {
            item.image_data = item.file_url ? [item.file_url] : []
          })
          this.list = res.data.data.items
          this.total = res.data.data.total
          this.list.forEach((item: any) => {
            item.total_weight = item.child_data
              .reduce((total: number, current: any) => {
                return total + +current.weight
              }, 0)
              .toFixed(1)
          })
          this.loading = false
        })
    },
    openDelete(id: number) {
      this.$confirm('是否删除该订购单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          yarnOrder
            .delete({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('删除成功')
                this.getList()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      },
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      }
    ])
    this.getListSetting()
    this.getFilters()
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/directOrder/yarnList.less';
</style>

<style>
/* el-table 自定义滚动条的时候没有白线 */
.el-table__fixed-right::before,
.el-table__fixed::before {
  content: unset;
}
</style>
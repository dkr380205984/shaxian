<template>
  <div id="orderList" class="indexMain" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">订单列表</span>
        <span class="addBtn btn btnMain" @click="$router.push('/order/create')">添加生产订单</span>
        <span class="addBtn btn btnMain" @click="$router.push('/order/salesOrderCreate')">添加销售订单</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn showMore">
          <div class="leftCtn" style="padding: unset; max-width: unset">
            <div class="label">筛选条件：</div>
            <!-- <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div> -->
            <div class="elCtn">
              <el-input v-model="order_code" placeholder="输入客户单号" @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-cascader
                v-model="productName"
                filterable
                clearable
                :show-all-levels="false"
                placeholder="请选择纱线"
                :options="yarn_list"
                @change="changeProductName"
              ></el-cascader>
              <!-- <el-input v-model="product_name" placeholder="输入纱线名称" @change="changeRouter(1)"></el-input> -->
            </div>
            <div class="elCtn">
              <el-select v-model="client_id" placeholder="选择下单客户" clearable filterable @change="changeRouter(1)">
                <el-option
                  v-for="item in client_list"
                  :key="item.id"
                  :value="item.id"
                  :label="(item.code || item.id) + ' - ' + item.name"
                ></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-select v-model="user_id" placeholder="选择下单人员" clearable @change="changeRouter(1)">
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
            <div class="elCtn">
              <el-select v-model="type" placeholder="选择订单类型" clearable @change="changeRouter(1)">
                <el-option value="1" label="生产单"></el-option>
                <el-option value="2" label="销售单"></el-option>
              </el-select>
            </div>
            <div class="elCtn" style="width: 350px">
              <el-date-picker
                v-model="date"
                type="daterange"
                value-format="yyyy-MM-dd"
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
                <span class="green">已发货</span>
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
    <!-- 列表设置 -->
    <zh-list-setting
      @close="showSetting = false"
      @afterSave="getListSetting"
      :show="showSetting"
      :id="listSettingId"
      :type="1"
      :data.sync="listKey"
      :originalData="originalSetting"
    ></zh-list-setting>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order, listSetting } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      order_code: '',
      product_name: '',
      productName: '',
      client_id: '',
      user_id: '',
      type: '',
      loading: true,
      showSetting: false,
      listSettingId: null,
      listKey: [],
      checkedCount: [],
      originalSetting: [
        {
          key: 'code',
          name: '订单号',
          ifShow: true,
          ifLock: true,
          index: 0
        },
        {
          key: 'order_code',
          name: '客户单号',
          ifShow: true,
          ifLock: true,
          index: 1
        },
        {
          key: 'client_name',
          name: '客户名称',
          ifShow: true,
          ifLock: false,
          index: 2
        },
        {
          key: 'type',
          name: '订单类型',
          filterArr: ['', '生产单', '销售单'],
          classArr: ['', '', ''],
          ifShow: true,
          ifLock: false,
          index: 3,
          isStatus: true
        },
        {
          key: 'status',
          name: '订单状态',
          filterArr: ['未知', '已创建', '进行中', '已完成', '已取消', '已延期'],
          classArr: ['', 'orange', 'blue', 'green', 'gray', 'red'],
          ifShow: true,
          ifLock: false,
          index: 4,
          isStatus: true
        },
        {
          key: 'is_check',
          name: '审核信息',
          filterArr: ['待审核', '已通过', '已驳回'],
          classArr: ['orange', 'green', 'red'],
          ifShow: true,
          ifLock: false,
          index: 5,
          isStatus: true
        },
        {
          key: 'product_name',
          name: '纱线名称',
          ifShow: true,
          ifLock: false,
          index: 6,
          from: 'product_info',
          mark: true
        },
        {
          key: 'color',
          name: '颜色',
          ifShow: true,
          ifLock: false,
          index: 7,
          from: 'product_info'
        },
        {
          key: 'attribute',
          name: '属性',
          ifShow: true,
          ifLock: false,
          index: 8,
          from: 'product_info'
        },
        {
          key: 'number_attribute',
          name: '数量属性',
          ifShow: true,
          ifLock: false,
          index: 9,
          from: 'product_info'
        },
        {
          key: 'weight',
          name: '下单数量（kg）',
          ifShow: true,
          ifLock: false,
          index: 10,
          from: 'product_info',
          numberToString: true
        },
        {
          key: 'total_number',
          name: '下单总数（kg）',
          ifShow: true,
          ifLock: false,
          index: 11,
          numberToString: true
        },
        {
          key: 'reality_push_weight',
          name: '发货总数（kg）',
          ifShow: true,
          ifLock: false,
          index: 12,
          numberToString: true
        },
        {
          key: 'total_price',
          name: '下单总价（元）',
          ifShow: true,
          ifLock: false,
          index: 13,
          numberToString: true
        },
        {
          key: 'delivery_time',
          name: '交货日期',
          ifShow: true,
          ifLock: false,
          index: 14
        },
        {
          key: 'order_time',
          name: '下单日期',
          ifShow: true,
          ifLock: false,
          index: 15
        },
        {
          key: 'image_data',
          name: '补充说明',
          ifShow: true,
          ifLock: false,
          ifImage: true,
          index: 16
        },
        {
          key: 'user_name',
          name: '操作人',
          ifShow: true,
          ifLock: false,
          index: 17
        }
      ],
      oprList: [
        {
          name: '详情',
          class: 'hoverBlue',
          fn: (item: any) => {
            this.$router.push('/order/detail/' + item.id)
          }
        },
        {
          name: '修改',
          class: 'hoverOrange',
          fn: (item: any) => {
            if (item.type === 2) {
              this.$message.error('销售订单不可更改')
              return
            }
            this.$router.push('/order/update/' + item.id)
          }
        }
      ],
      page: 1,
      total: 100,
      page_size: 10,
      list: [],
      showMore: false,
      date: []
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
  computed: {
    yarn_list() {
      return this.$store.state.api.yarnType.arr.map((item: any) => {
        return {
          value: item.name,
          label: item.name,
          children: item.yarns.map((itemChild: any) => {
            return {
              value: itemChild.name,
              label: itemChild.name
            }
          })
        }
      })
    },
    client_list() {
      return this.$store.state.api.client.arr
    },
    user_list() {
      return this.$store.state.api.user.arr
    }
  },
  methods: {
    changeRouter(page: string | number) {
      const pages = page || 1
      this.$router.push(
        '/order/list?page=' +
          pages +
          '&order_code=' +
          this.order_code +
          '&product_name=' +
          this.product_name +
          '&productName=' +
          this.productName +
          '&client_id=' +
          this.client_id +
          '&user_id=' +
          this.user_id +
          '&type=' +
          this.type +
          '&page_size=' +
          this.page_size +
          '&date=' +
          this.date
      )
    },
    changeProductName(str: any) {
      if (str.length === 0) {
        str = ['', '']
      }
      this.productName = str
      this.product_name = str[1]
      this.changeRouter(1)
    },
    getListSetting() {
      this.listKey = []
      listSetting
        .detail({
          type: 1
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
    reset() {
      this.$router.push(
        '/order/list?page=1&order_code=&product_name=&client_id=&user_id=&page_size=10&date=&type=&productName=,'
      )
    },
    getFilters() {
      const params = this.$route.query
      this.page = Number(params.page)
      this.page_size = Number(params.page_size)
      this.user_id = params.user_id ? Number(params.user_id) : ''
      this.client_id = params.client_id ? Number(params.client_id) : ''
      this.product_name = params.product_name
      this.type = params.type || ''
      // @ts-ignore
      this.productName = params.productName ? params.productName.split(',') : ['', '']
      this.order_code = params.order_code
      if (params.date !== 'null' && params.date !== '') {
        this.date = (params.date as string).split(',')
      } else {
        this.date = []
      }
    },
    changeIndex(father: any, type: string) {
      if (!father.index) {
        father.index = 0
      }
      if (type === 'add') {
        if (father.index < father.product_info.length - 1) {
          father.index++
        } else {
          father.index = 0
        }
      }
      if (type === 'delete') {
        if (father.index === 0) {
          father.index = father.product_info.length - 1
        } else {
          father.index--
        }
      }
      // 类型断言防止报错，更新表格
      const tableMetheds = this.$refs.table as any
      tableMetheds.doLayout()
    },
    getList() {
      this.loading = true
      order
        .list({
          order_code: this.order_code,
          product_name: this.product_name,
          client_id: this.client_id,
          user_id: this.user_id,
          type: this.type,
          start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          end_time: this.date && this.date.length > 0 ? this.date[1] : '',
          limit: this.page_size,
          page: this.page
        })
        .then((res) => {
          if (res.data.status) {
            res.data.data.items.forEach((item: any) => {
              item.image_data = item.file_url ? [item.file_url] : []
            })
            this.list = res.data.data.items
            this.total = res.data.data.total
          }
          this.loading = false
        })
    },
    deleteOrder(id: number) {
      this.$confirm('是否删除该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          order.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
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
  created() {
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
@import '~@/assets/less/order/list.less';
</style>

<style>
/* el-table 自定义滚动条的时候没有白线 */
.el-table__fixed-right::before,
.el-table__fixed::before {
  content: unset;
}
</style>
<template>
  <div id="orderList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">订购加工列表</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn"
          :class="{'showMore':showMore}">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div>
            <div class="elCtn">
              <el-input v-model="order_code"
                placeholder="输入订单号"
                @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="product_name"
                placeholder="输入纱线名称"
                @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="client_id"
                placeholder="选择下单公司"
                clearable
                filterable
                @change="changeRouter(1)">
                <el-option v-for="item in client_list"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-select v-model="user_id"
                placeholder="选择下单人员"
                clearable
                @change="changeRouter(1)">
                <el-option v-for="item in user_list"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="elCtn middle"
              style="width:350px;">
              <el-date-picker v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeRouter(1)">
              </el-date-picker>
            </div>
            <div class="elCtn middle">
              <el-select v-model="page_size"
                placeholder="选择每页展示的条数"
                @change="changeRouter(1)">
                <el-option label="每页10条"
                  :value="10"></el-option>
                <el-option label="每页20条"
                  :value="20"></el-option>
                <el-option label="每页30条"
                  :value="30"></el-option>
              </el-select>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr"
              @click="reset">重置</div>
          </div>
        </div>
        <div class="list">
          <el-table :data="list"
            style="width: 100%"
            ref="table">
            <el-table-column fixed
              prop="order_code"
              label="订单号"
              width="120">
            </el-table-column>
            <el-table-column fixed
              prop="client_name"
              label="客户名称"
              width="140">
            </el-table-column>
            <el-table-column label="纱线名称"
              width="170">
              <template slot-scope="scope">
                <div class="sortContainer">
                  <div class="sort">
                    <i class="el-icon-caret-top hover"
                      @click="changeIndex(scope.row,'add')"></i>
                    <div class="number">
                      {{(scope.row.index||0)+1}}/{{scope.row.product_info.length}}
                    </div>
                    <i class="el-icon-caret-bottom hover"
                      @click="changeIndex(scope.row,'delete')"></i>
                  </div>
                  <span>{{scope.row.product_info[scope.row.index||0].product_name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="total_price"
              label="颜色/属性"
              width="150">
              <template slot-scope="scope">
                <span>{{scope.row.product_info[scope.row.index||0].color}}/{{scope.row.product_info[scope.row.index||0].attribute}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="total_price"
              label="数量属性"
              width="120">
              <template slot-scope="scope">
                <span>{{scope.row.product_info[scope.row.index||0].number_attribute}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="total_price"
              label="下单数量"
              width="120">
              <template slot-scope="scope">
                <span>{{scope.row.product_info[scope.row.index||0].weight}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="total_weight"
              label="下单总数(kg)"
              width="120">
            </el-table-column>
            <el-table-column prop="total_price"
              label="下单总价(元)"
              width="120">
            </el-table-column>
            <el-table-column label="已发货(kg)"
              width="120">
              <template>
                <span class="blue">0</span>
              </template>
            </el-table-column>
            <el-table-column prop="delivery_time"
              label="交货日期"
              width="120">
            </el-table-column>
            <el-table-column prop="order_time"
              label="下单日期"
              width="120">
            </el-table-column>
            <el-table-column prop="user_name"
              label="操作人"
              width="120">
            </el-table-column>
            <el-table-column fixed="right"
              label="操作"
              width="140">
              <template slot-scope="scope">
                <span class="blue opr"
                  @click="$router.push('/orderProcessYarn/detail/'+scope.row.id)">订购加工</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :current-page.sync="page"
            :page-size="page_size"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      order_code: '',
      product_name: '',
      client_id: '',
      user_id: '',
      loading: true,
      page: 1,
      total: 100,
      page_size: 10,
      list: [],
      showMore: false,
      date: [],
      value: ''
    }
  },
  watch: {
    page(newVal) {
      this.changeRouter(newVal)
    },
    $route() {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  computed: {
    client_list() {
      return this.$store.state.api.client.arr
    },
    user_list() {
      return this.$store.state.api.user.arr
    }
  },
  methods: {
    changeRouter(page: string) {
      const pages = page || 1
      this.$router.push(
        '/order/list?page=' +
          pages +
          '&order_code=' +
          this.order_code +
          '&product_name=' +
          this.product_name +
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
    reset() {
      this.$router.push('/order/list?page=1&order_code=&product_name=&client_id=&user_id=&page_size=10&date=')
    },
    getFilters() {
      const params = this.$route.query
      this.page = Number(params.page)
      this.page_size = Number(params.page_size)
      this.user_id = params.user_id ? Number(params.user_id) : ''
      this.client_id = params.client_id ? Number(params.client_id) : ''
      this.product_name = params.product_name
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
          start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          end_time: this.date && this.date.length > 0 ? this.date[1] : '',
          limit: this.page_size,
          page: this.page
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
          this.loading = false
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
      }
    ])
    this.getFilters()
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/order/list.less';
</style>
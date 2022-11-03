<template>
  <div id="orderList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">订单列表</span>
        <span class="addBtn btn btnMain"
          @click="$router.push('/order/create')">添加生产订单</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn showMore">
          <div class="leftCtn" style="padding: unset; max-width: unset">
            <div class="label">筛选条件：</div>
            <!-- <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div> -->
            <div class="elCtn">
              <el-input v-model="order_code"
                placeholder="输入客户单号"
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
            <div class="elCtn">
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
            <div class="elCtn middle"
              style="width:350px;">
              <el-date-picker v-model="date"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeRouter(1)">
              </el-date-picker>
            </div>
          </div>
          <div class="rightCtn" style="min-width: 94px">
            <div class="btn btnGray fr"
              @click="reset">重置</div>
          </div>
        </div>
        <div class="list">
          <el-table :data="list"
            style="width: 100%"
            ref="table">
            <el-table-column fixed
              prop="code"
              label="订单号"
              width="120">
            </el-table-column>
            <el-table-column fixed
              prop="order_code"
              label="客户单号"
              width="120">
            </el-table-column>
            <el-table-column prop="client_name"
              label="客户名称"
              width="140">
            </el-table-column>
            <el-table-column prop="status"
              label="订单状态"
              width="120">
              <template slot-scope="scope">
                <span :class="{'orange':scope.row.status===1,'blue':scope.row.status===2,'green':scope.row.status===3,'gray':scope.row.status===4}">{{scope.row.status | orderStatusFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="is_check"
              label="审核信息"
              width="120">
              <template slot-scope="scope">
                <span :class="{'orange':scope.row.is_check===0,'green':scope.row.is_check===1,'red':scope.row.is_check===2}">{{scope.row.is_check | orderCheckFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="纱线名称"
              width="170">
              <template slot-scope="scope">
                <div class="sortContainer">
                  <div class="sort">
                    <i class="el-icon-caret-top hover"
                      @click="changeIndex(scope.row,'delete')"></i>
                    <div class="number">
                      {{(scope.row.index||0)+1}}/{{scope.row.product_info.length}}
                    </div>
                    <i class="el-icon-caret-bottom hover"
                      @click="changeIndex(scope.row,'add')"></i>
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
            <el-table-column prop="reality_push_weight"
              label="发货总数(kg)"
              width="120">
            </el-table-column>
            <el-table-column prop="total_price"
              label="下单总价(元)"
              width="120">
            </el-table-column>
            <el-table-column prop="delivery_time"
              label="交货日期"
              width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.status!==3"
                  style="display:flex;flex-direction:column">
                  <span>{{scope.row.delivery_time}}</span>
                  <span :class="{'red':$diffByDate(scope.row.delivery_time)<=0,'green':$diffByDate(scope.row.delivery_time)>7,'orange':$diffByDate(scope.row.delivery_time)<=7 &&$diffByDate(scope.row.delivery_time)>0 }">
                    {{$diffByDate(scope.row.delivery_time)>0?'交货还剩'+$diffByDate(scope.row.delivery_time)+'天':'延期发货'+Math.abs($diffByDate(scope.row.delivery_time))+'天'}}
                  </span>
                </div>
                <div v-if="scope.row.status===3"
                  style="display:flex;flex-direction:column">
                  <span>{{scope.row.delivery_time}}</span>
                  <span class="green">已发货</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="order_time"
              label="下单日期"
              width="120">
            </el-table-column>
            <el-table-column prop="file_url"
              label="补充说明"
              width="120">
              <template slot-scope="scope">
                <div class="column">
                  <el-image style="width: 50px; height: 50px;line-height:50px;text-align:center;font-size:22px"
                    :src="scope.row.file_url"
                    :preview-src-list="[scope.row.file_url]">
                    <div slot="error"
                      class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="user_name"
              label="操作人"
              width="120">
            </el-table-column>
            <el-table-column fixed="right"
              label="操作"
              width="150">
              <template slot-scope="scope">
                <span class="blue opr"
                  @click="$router.push('/order/detail/'+scope.row.id)">详情</span>
                <span class="orange opr"
                  @click="$router.push('/order/update/'+scope.row.id)">修改</span>
                <el-dropdown>
                  <span class="green"
                    style="margin-left:8px;cursor:pointer">更多</span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="$router.push('/orderProcessYarn/detail/'+scope.row.id)">
                      <span class="blue">订购加工</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="$router.push('/inAndOut/detail/'+scope.row.id)">
                      <span class="blue">出入库</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="deleteOrder(scope.row.id)">
                      <span class="red">删除订单</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
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
      date: []
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
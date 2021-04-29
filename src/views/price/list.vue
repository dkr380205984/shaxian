<template>
  <div id="priceList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">报价单列表</span>
        <span class="addBtn btn btnMain"
          @click="$router.push('/price/create')">添加报价</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn"
          :class="{'showMore':showMore}">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div>
            <div class="elCtn">
              <el-input v-model="code"
                placeholder="输入编号筛选"
                @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="name"
                placeholder="输入报价单名称筛选"
                @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="client"
                placeholder="筛选报价客户"
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
              <el-select v-model="status"
                placeholder="筛选报价单状态"
                clearable
                filterable
                @change="changeRouter(1)">
                <el-option v-for="item in statusArr"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="elCtn middle">
              <el-select v-model="user"
                placeholder="筛选创建人"
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
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeRouter(1)">
              </el-date-picker>
            </div>
            <div class="elCtn middle">
              <el-select v-model="limit"
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
          <div class="headCtn">
            <div class="row">
              <span class="column center flex02">
                <el-checkbox />
              </span>
              <span class="column">报价单编号</span>
              <span class="column">报价单名称</span>
              <span class="column">报价客户</span>
              <span class="column">纱线名称</span>
              <span class="column">纱线报价</span>
              <span class="column">审核状态</span>
              <span class="column">创建人</span>
              <span class="column">创建时间</span>
              <span class="column">操作</span>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row"
              v-for="item in list"
              :key="item.id">
              <span class="column center flex02">
                <el-checkbox />
              </span>
              <span class="column">{{item.code}}</span>
              <span class="column">{{item.title}}</span>
              <span class="column">{{item.client_name}}</span>
              <span class="column">{{item.child_data[item.showIndex] && item.child_data[item.showIndex].yarn_name}}</span>
              <span class="column">
                <div class="sortContainer">
                  <div class="sort">
                    <i class="el-icon-caret-top hover"
                      @click="changeIndex(item,'delete')"></i>
                    <div class="number">
                      {{(item.index||0)+1}}/{{item.child_data.length}}
                    </div>
                    <i class="el-icon-caret-bottom hover"
                      @click="changeIndex(item,'add')"></i>
                  </div>
                  <span>{{item.child_data[item.index||0].total_price}}元/kg</span>
                </div>
              </span>
              <span :class="{'column':true,'orange':item.is_check === 0,'green':item.is_check === 1,'red':item.is_check === 2}">{{item.is_check|filterCheck}}</span>
              <span class="column">{{item.user_name}}</span>
              <span class="column">{{$getDate(item.create_time)}}</span>
              <span class="column">
                <span class="opr orange"
                  @click="$router.push(`/price/update/${item.id}`)">修改</span>
                <span class="opr blue"
                  @click="$router.push(`/price/detail/${item.id}`)">详情</span>
              </span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :current-page.sync="page"
            :page-size="limit"
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
import { price } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      code: '',
      name: '',
      client: '',
      status: '',
      statusArr: [
        { id: '0', name: '待审核' },
        { id: '1', name: '已通过' },
        { id: '2', name: '已驳回' }
      ],
      user: '',
      date: [],
      limit: 10,
      loading: true,
      page: 1,
      total: 1,
      list: [],
      showMore: false
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
    changeRouter(pages: number = 1) {
      this.$router.push(
        `/price/list?page=${pages}&code=${this.code}&name=${this.name}&client=${this.client}&status=${this.status}&user=${this.user}&date=${this.date}&limit=${this.limit}`
      )
    },
    reset() {
      this.$router.push('/price/list')
    },
    getFilters() {
      const params = this.$route.query
      this.page = Number(params.page) || 1
      this.code = params.code || ''
      this.name = params.name || ''
      this.client = Number(params.client) || ''
      this.status = params.status || ''
      this.user = Number(params.user) || ''
      if (params.date && params.date !== 'null' && params.date !== '') {
        this.date = (params.date as string).split(',')
      } else {
        this.date = []
      }
      this.limit = Number(params.limit) || 10
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
    getList() {
      this.loading = true
      price
        .list({
          code: this.code || null,
          title: this.name || null,
          client_id: this.client || null,
          is_check: this.status || null,
          start_time: this.date ? this.date[0] : null,
          end_time: this.date ? this.date[1] : null,
          page: this.page,
          limit: this.limit
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            this.list = res.data.data.items.map((itemM: any) => {
              return {
                ...itemM,
                showIndex: 0
              }
            })
            this.total = res.data.data.total
            this.loading = false
          }
        })
    },
    deleteOrder(id: number) {
      this.$confirm('是否删除该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          price.delete({ id }).then((res: any) => {
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
  filters: {
    filterCheck(item: 0 | 1 | 2) {
      switch (item) {
        case 0:
          return '待审核'
        case 1:
          return '已通过'
        case 2:
          return '已驳回'
      }
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
@import '~@/assets/less/price/list.less';
</style>
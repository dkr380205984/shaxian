<template>
  <div class="indexMain">
    <div class="module"
      v-loading="loading">
      <div class="titleCtn">
        <span class="title hasBorder">工艺单列表</span>
        <span class="addBtn btn btnMain"
          @click="$router.push('/material/craftCreate')">添加工艺单</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn"
          :class="{'showMore':showMore}">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div>
            <div class="elCtn">
              <el-input v-model="name"
                placeholder="搜索纺纱名称"
                @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="code"
                placeholder="搜索工艺单编号"
                @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="client_id"
                clearable
                placeholder="筛选混纺单位"
                @change="changeRouter(1)">
                <el-option v-for="item in supplier_list"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-select v-model="user_id"
                clearable
                placeholder="筛选创建人"
                @change="changeRouter(1)">
                <el-option v-for="item in user_list"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="elCtn middle">
              <el-select v-model="status"
                clearable
                placeholder="筛选状态">
              </el-select>
            </div>
            <div class="elCtn middle"
              style="width:350px;">
              <el-date-picker v-model="date"
                value-format="yyyy-MM-dd"
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
          <div class="list">
            <el-table :data="list"
              style="width: 100%"
              ref="table">
              <el-table-column fixed
                prop="code"
                label="工艺单号"
                width="120">
              </el-table-column>
              <el-table-column fixed
                prop="client_name"
                label="加工单位"
                width="140">
              </el-table-column>
              <el-table-column prop="status"
                label="工艺单状态"
                width="120">
                <template slot-scope="scope">
                  <span :class="{'orange':scope.row.status===1,'blue':scope.row.status===2,'green':scope.row.status===3}">{{scope.row.status | orderStatusFilter}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="is_check"
                label="审核信息"
                width="120">
                <template slot-scope="scope">
                  <span :class="{'orange':!scope.row.is_check,'green':scope.row.is_check===1,'red':scope.row.is_check===2}">{{scope.row.is_check | orderCheckFilter}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="yarn_name"
                label="纺纱名称"
                width="140">
              </el-table-column>
              <el-table-column prop="weight"
                label="纺纱重量(吨)"
                width="140">
              </el-table-column>
              <el-table-column prop="total_fee"
                label="总费用(元)"
                width="140">
              </el-table-column>
              <el-table-column prop="date"
                label="交货日期"
                width="120">
                <template slot-scope="scope">
                  <div v-if="scope.row.status!==3"
                    style="display:flex;flex-direction:column">
                    <span>{{scope.row.date}}</span>
                    <span :class="{'red':$diffByDate(scope.row.date)<=0,'green':$diffByDate(scope.row.date)>7,'orange':$diffByDate(scope.row.date)<=7 &&$diffByDate(scope.row.date)>0 }">
                      {{$diffByDate(scope.row.date)>0?'交货还剩'+$diffByDate(scope.row.date)+'天':'延期发货'+Math.abs($diffByDate(scope.row.date))+'天'}}
                    </span>
                  </div>
                  <div v-if="scope.row.status===3"
                    style="display:flex;flex-direction:column">
                    <span>{{scope.row.date}}</span>
                    <span class="green">已完成</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="order_time"
                label="下单日期"
                width="120">
              </el-table-column>
              <el-table-column label="补充说明">
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
                  <span class="opr blue"
                    @click="$router.push('/material/craftDetail/' + scope.row.id)">详情</span>
                  <span class="opr orange"
                    @click="$router.push('/material/craftUpdate/' + scope.row.id)">修改</span>
                  <span class="opr red"
                    @click="deleteCraft(scope.row.id)">删除</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
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
import { craft } from '@/assets/js/api'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      name: '',
      code: '',
      date: [],
      user_id: '',
      status: '',
      client_id: '',
      page: 1,
      page_size: 10,
      total: 1,
      showMore: false,
      value: '',
      list: []
    }
  },
  computed: {
    supplier_list() {
      return this.$store.state.api.supplier.arr.filter((item: any) => item.client_type === '混纺单位')
    },
    user_list() {
      return this.$store.state.api.user.arr
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
  methods: {
    changeRouter(page: string) {
      const pages = page || 1
      this.$router.push(
        '/material/craftList?page=' +
          pages +
          '&code=' +
          this.code +
          '&name=' +
          this.name +
          '&client_id=' +
          this.client_id +
          '&user_id=' +
          this.user_id +
          '&status=' +
          this.status +
          '&page_size=' +
          this.page_size +
          '&date=' +
          this.date
      )
    },
    reset() {
      this.$router.push('/material/craftList?page=1&code=&name=&client_id=&user_id=&status=&page_size=10&date=')
    },
    getFilters() {
      const params = this.$route.query
      this.page = Number(params.page)
      this.page_size = Number(params.page_size)
      this.user_id = params.user_id ? Number(params.user_id) : ''
      this.client_id = params.client_id ? Number(params.client_id) : ''
      this.name = params.name
      this.code = params.code
      this.status = params.status ? Number(params.status) : ''
      if (params.date !== 'null' && params.date !== '') {
        this.date = (params.date as string).split(',')
      } else {
        this.date = []
      }
    },
    getList() {
      this.loading = true
      craft
        .list({
          yarn_name: this.name,
          code: this.code,
          start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          end_time: this.date && this.date.length > 0 ? this.date[1] : '',
          user_id: this.user_id,
          status: this.status,
          client_id: this.client_id,
          limit: this.page_size,
          page: this.page
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
          this.loading = false
        })
    },
    deleteCraft(id: string) {
      this.$confirm('是否删除该工艺单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          craft.delete({ id }).then((res) => {
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
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/supplier',
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
@import '~@/assets/less/material/craftList.less';
</style>
<template>
  <div id="orderList"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">纱线出入库列表</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn"
          :class="{'showMore':showMore}">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div>
            <div class="elCtn">
              <el-input v-model="value"
                placeholder="输入订单号"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="value"
                placeholder="输入纱线名称"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="value"
                placeholder="选择下单公司"></el-select>
            </div>
            <div class="elCtn">
              <el-select v-model="value"
                placeholder="选择下单人员"></el-select>
            </div>
            <div class="elCtn middle"
              style="width:350px;">
              <el-date-picker v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
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
            <div class="btn btnGray fr">重置</div>
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
                  @click="$router.push('/inAndOut/detail/'+scope.row.id)">纱线出入库</span>
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
  data() {
    return {
      page: 1,
      total: 100,
      page_size: 10,
      list: [],
      showMore: false,
      date: [],
      value: ''
    }
  },
  methods: {
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
      order
        .list({
          limit: this.page_size,
          page: this.page
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
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
  mounted() {
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/order/list.less';
</style>
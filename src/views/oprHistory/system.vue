<template>
  <div id="productList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">系统操作列表</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn"
            style="padding-right:0">
            <div class="elCtn">
              <el-input v-model="keyword"
                placeholder="搜索关键字"
                @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="user_id"
                placeholder="选择操作人"
                clearable
                @change="changeRouter(1)">
                <el-option v-for="item in user_list"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-select v-model="type"
                placeholder="选择操作类型"
                clearable
                @change="changeRouter(1)">
                <el-option label="订单管理"
                  value="订单管理"></el-option>
                <el-option label="纱线加工"
                  value="纱线加工"></el-option>
                <el-option label="纱线库存"
                  value="纱线库存"></el-option>
                <el-option label="毛条库存"
                  value="毛条库存"></el-option>
                <el-option label="报价管理"
                  value="报价管理"></el-option>
                <el-option label="工艺单管理"
                  value="工艺单管理"></el-option>
                <el-option label="纱线采购单管理"
                  value="纱线采购单管理"></el-option>
                <el-option label="毛条采购"
                  value="毛条采购"></el-option>
              </el-select>
            </div>
            <div class="elCtn"
              style="width:320px;">
              <el-date-picker v-model="date"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeRouter(1)">
              </el-date-picker>
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
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr"
              @click="reset">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">操作类型</div>
              <div class="column"
                style="flex:2">操作信息</div>
              <div class="column">操作日期</div>
              <div class="column">操作人</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row"
              v-for="(item,index) in list"
              :key="index">
              <div class="column">{{item.type}}</div>
              <div class="column"
                style="flex:2">{{item.description}}</div>
              <div class="column">{{item.created_at}}</div>
              <div class="column">{{item.user.name}}</div>
            </div>
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
import Vue from 'vue'
import { oprHistory } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      list: [],
      page: 1,
      page_size: 10,
      total: 0,
      keyword: '',
      user_id: '',
      type: '',
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
    user_list() {
      return this.$store.state.api.user.arr
    }
  },
  methods: {
    reset() {
      this.$router.push('/oprHistory/system?page=1&page_size=10&keyword=&user_id=&date=&type=')
    },
    changeRouter(page: string) {
      this.$router.push(
        '/oprHistory/system?page=' +
          (page || 1) +
          '&page_size=' +
          this.page_size +
          '&keyword=' +
          this.keyword +
          '&user_id=' +
          this.user_id +
          '&type=' +
          this.type +
          '&date=' +
          this.date
      )
    },
    getFilters() {
      const params = this.$route.query
      this.page = Number(params.page)
      this.page_size = Number(params.page_size)
      this.user_id = params.user_id ? Number(params.user_id) : ''
      this.keyword = params.keyword
      this.type = params.type
      if (params.date !== 'null' && params.date !== '') {
        this.date = (params.date as string).split(',')
      } else {
        this.date = []
      }
    },
    getList() {
      this.loading = true
      oprHistory
        .system({
          type: this.type,
          start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          end_time: this.date && this.date.length > 0 ? this.date[1] : '',
          keyword: this.keyword,
          user_id: this.user_id,
          limit: 10,
          page: this.page
        })
        .then((res) => {
          this.list = res.data.data.data
          this.total = res.data.data.total
          this.loading = false
        })
    }
  },
  mounted() {
    this.getList()
    this.$checkCommonInfo([
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/oprHistory/system.less';
</style>
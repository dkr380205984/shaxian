<template>
  <div class="indexMain"
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">客户列表</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name"
                @change="changeRouter(1)"
                placeholder="搜索客户名称"></el-input>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr"
              @click="resetFilter">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">客户编码</div>
              <div class="column">客户名称</div>
              <div class="column">客户简称</div>
              <div class="column">主要负责人</div>
              <div class="column">地址</div>
              <div class="column">总下单数</div>
              <div class="column">总发货数</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row"
              v-for="item in clientList"
              :key="item.id">
              <div class="column">{{item.id}}</div>
              <div class="column">{{item.name}}</div>
              <div class="column">{{item.abbreviation}}</div>
              <div class="column">{{item.user_name}}</div>
              <div class="column">{{item.address || '/'}}</div>
              <div class="column">总下单数</div>
              <div class="column">总发货数</div>
              <div class="column">
                <span class="col_btn blue"
                  @click="$router.push('/finance/clientDetail/'+item.id)">详情</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :current-page.sync="page"
            @current-change="changeRouter"
            :page-size="10"
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
import { partyB } from '@/assets/js/api'
import { PartyB } from '@/types/common'
export default Vue.extend({
  data(): {
    clientList: PartyB[]
    [propName: string]: any
  } {
    return {
      loading: true,
      addFlag: false,
      clientList: [],
      page: 1,
      total: 1,
      name: '',
      statusArr: [
        {
          id: '0',
          name: '禁用中'
        },
        {
          id: '1',
          name: '合作中'
        }
      ]
    }
  },
  methods: {
    changeRouter(pages: number = 1) {
      this.$router.replace(`/settings/client?pages=${pages}&name=${this.name || ''}&status=${this.status || ''}`)
    },
    init() {
      this.name = this.$route.query.name || ''
      this.status = this.$route.query.status || ''
      this.getList(Number(this.$route.query.pages) || 1)
    },
    getList(pages: number = 1) {
      this.loading = true
      partyB
        .list({
          type: 1,
          limit: 10,
          page: pages,
          name: this.name || null,
          status: null
        })
        .then((res: any) => {
          if (res.data.staus !== false) {
            this.clientList = res.data.data.items
            this.total = res.data.data.total
            this.loading = false
            // 更新页码
            if (pages !== this.page) {
              this.page = pages
            }
          }
        })
    },
    resetFilter() {
      this.name = ''
      this.changeRouter()
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route(newVal) {
      this.init()
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/settings/client.less';
</style>
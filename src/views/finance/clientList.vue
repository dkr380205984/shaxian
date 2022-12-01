<template>
  <div class="indexMain" v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">客户财务列表</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name" @change="changeRouter(1)" placeholder="搜索客户名称"></el-input>
            </div>
            <div class="elCtn" style="width:350px;">
              <el-date-picker v-model="date" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期" @change="changeRouter(1)"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr" @click="resetFilter">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">客户名称</div>
              <div class="column">下单数量
                <sort v-model="total_weight" @beforeChange="getSort($event, 'total_weight')"></sort>
              </div>
              <div class="column">下单金额
                <sort v-model="total_price" @beforeChange="getSort($event, 'total_price')"></sort>
              </div>
              <div class="column">发货数量
                <sort v-model="real_total_weight" @beforeChange="getSort($event, 'real_total_weight')"></sort>
              </div>
              <div class="column">发货金额
                <sort v-model="real_total_price" @beforeChange="getSort($event, 'real_total_price')"></sort>
              </div>
              <div class="column">开票总额
                <sort v-model="collection_total_price" @beforeChange="getSort($event, 'collection_total_price')"></sort>
              </div>
              <div class="column">收款总额
                <sort v-model="invoice_total_price" @beforeChange="getSort($event, 'invoice_total_price')"></sort>
              </div>
              <div class="column">对方扣款
                <sort v-model="deduct_total_price" @beforeChange="getSort($event, 'deduct_total_price')"></sort>
              </div>
              <div class="column">对方欠款
                <sort v-model="invoice_wait" @beforeChange="getSort($event, 'invoice_wait')"></sort>
              </div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row" v-for="item in clientList" :key="item.id">
              <div class="column">{{ item.client_name }}</div>
              <div class="column">{{ $toFixed(item.total_weight / 1000, 2, true) }}吨</div>
              <div class="column">{{ $toFixed(item.total_price / 10000, 2, true) }}万元</div>
              <div class="column">{{ $toFixed(item.real_total_weight / 1000, 2, true) }}吨</div>
              <div class="column">{{ $toFixed(item.real_total_price / 10000, 2, true) }}万元</div>
              <div class="column">{{ $toFixed((item.collection_total_price / 10000 || 0), 2, true) }}万元</div>
              <div class="column">{{ $toFixed((item.invoice_total_price || 0) / 10000, 2, true) }}万元</div>
              <div class="column">{{ $toFixed((item.deduct_total_price || 0) / 10000, 2, true) }}万元</div>
              <div class="column">{{ $toFixed(((item.invoice_wait) || 0) / 10000, 2, true) }}万元</div>
              <div class="column">
                <span class="col_btn blue" @click="$router.push('/finance/clientDetail/' + item.client_id)">详情</span>
              </div>
            </div>
            <div class="row">
              <div class="column green">合计</div>
              <div class="column green">{{ $toFixed(total_sts.total_weight / 1000, 2, true) }}吨</div>
              <div class="column green">{{ $toFixed(total_sts.total_price / 10000, 2, true) }}万元</div>
              <div class="column green">{{ $toFixed(total_sts.real_total_weight / 1000, 2, true) }}吨</div>
              <div class="column green">{{ $toFixed((total_sts.real_total_price / 10000), 2, true) }}万元</div>
              <div class="column green">{{ $toFixed((total_sts.collection_total_price / 10000), 2, true) }}万元</div>
              <div class="column green">{{ $toFixed((total_sts.invoice_total_price / 10000), 2, true) }}万元</div>
              <div class="column green">{{ $toFixed((total_sts.deduct_total_price / 10000), 2, true) }}万元</div>
              <div class="column green">{{ $toFixed(((total_sts.invoice_wait) || 0) / 10000, 2, true) }}万元</div>
              <div class="column green"></div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background :current-page.sync="page" @current-change="changePage" :page-size="10"
            layout="prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { finance } from '@/assets/js/api'
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
      date: [],
      allList: [],
      total_price: '',
      total_weight: '',
      real_total_weight: '',
      real_total_price: '',
      deduct_total_price: '',
      invoice_total_price: '',
      collection_total_price: '',
      invoice_wait: '',
      total_sts: {
        total_weight: 0,
        total_price: 0,
        real_total_weight: 0,
        real_total_price: 0,
        collection_total_price: 0,
        invoice_total_price: 0,
        deduct_total_price: 0,
        invoice_wait: 0,
      },
      sort_type: '',
      sort_cloum: '',
      statusArr: [
        {
          id: '0',
          name: '禁用中'
        },
        {
          id: '1',
          name: '合作中'
        }
      ],
      order_weight: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '今年',
            onClick(picker: any) {
              const year = new Date().getFullYear()
              const start = year + '-01-01'
              const end = year + '-12-31'
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '去年',
            onClick(picker: any) {
              const year = new Date().getFullYear() - 1
              const start = year + '-01-01'
              const end = year + '-12-31'
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  methods: {
    changeRouter(pages: number = 1) {
      this.$router.replace(
        `/finance/clientList?pages=${pages}&name=${this.name || ''}&sort_type=${this.sort_type || ''}&sort_cloum=${this.sort_cloum || ''
        }&date=${this.date || ''}`
      )
    },
    init() {
      this.name = this.$route.query.name || ''
      this.sort_cloum = this.$route.query.sort_cloum || ''
      this.sort_type = this.$route.query.sort_type || ''
      if (this.sort_cloum) {
        this[this.sort_cloum] = this.sort_type === 'asc' ? 1 : this.sort_type === 'desc' ? 2 : 0
      }
      if (this.$route.query.date !== 'null' && this.$route.query.date !== '') {
        this.date = (this.$route.query.date as string).split(',')
      } else {
        const year = new Date().getFullYear()
        const start = year + '-01-01'
        const end = year + '-12-31'
        this.date = [start, end]
      }
      this.getList(Number(this.$route.query.pages) || 1)
    },
    changePage(page: any) {
      this.clientList = this.$clone(this.allList).splice((page - 1) * 10, 10)
    },
    getList(pages: number = 1) {
      this.loading = true
      finance
        .clientList({
          type: 1,
          limit: 10,
          page: pages,
          name: this.name || null,
          start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          end_time: this.date && this.date.length > 0 ? this.date[1] : '',
          sort_cloum: this.sort_cloum,
          sort_type: this.sort_type,
          status: null
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            res.data.data.forEach((item: any) => {
              item.invoice_wait = item.real_total_price - item.invoice_total_price
            })

            this.allList = res.data.data
            this.total = res.data.data.length
            this.clientList = this.$clone(this.allList).splice(0, 10)

            this.total_sts = {
              total_weight: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.total_weight) || 0)
              }, 0),
              total_price: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.total_price) || 0)
              }, 0),
              real_total_weight: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.real_total_weight) || 0)
              }, 0),
              real_total_price: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.real_total_price) || 0)
              }, 0),
              collection_total_price: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.collection_total_price) || 0)
              }, 0),
              invoice_total_price: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.invoice_total_price) || 0)
              }, 0),
              deduct_total_price: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.deduct_total_price) || 0)
              }, 0),
              invoice_wait: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.invoice_wait) || 0)
              }, 0),
            }

            this.loading = false
            // 更新页码
            if (pages !== this.page) {
              this.page = pages
            }
          }
        })
    },
    getSort(ev: number, type: string) {
      const filterArr = ['', 'asc', 'desc']
      this.sort_cloum = type
      this.sort_type = filterArr[ev]
      this.total_price = ''
      this.total_weight = ''
      this.real_total_weight = ''
      this.real_total_price = ''
      this.deduct_total_price = ''
      this.invoice_total_price = ''
      this.invoice_wait = ''
      this.collection_total_price = ''
      this[type] = ev
      if (this.sort_type === 'asc') {
        this.allList.sort((a: any, b: any) => {
          return a[this.sort_cloum] - b[this.sort_cloum]
        })
      } else if (this.sort_type === 'desc') {
        this.allList.sort((a: any, b: any) => {
          return b[this.sort_cloum] - a[this.sort_cloum]
        })
      }
      this.changePage(this.page)
    },
    resetFilter() {
      this.total_price = ''
      this.total_weight = ''
      this.real_total_weight = ''
      this.real_total_price = ''
      this.deduct_sum_total_price = ''
      this.invoice_total_price = ''
      this.collection_total_price = ''
      this.invoice_wait = ''
      this.sort_type = ''
      this.sort_cloum = ''
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
@import '~@/assets/less/finance/clientList.less';
</style>
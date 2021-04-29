<template>
  <div class="indexMain"
    v-loading='loading'>
    <div class="module">
      <div class="stsCtn"
        style="margin-top:0">
        <div class="box">
          <div class="title">采购总量</div>
          <div class="number">{{(total_sts.purchase_sum_total_weight/1000).toFixed(2)}}
            <span class="unit">吨</span>
          </div>
        </div>
        <div class="box">
          <div class="title">采购总额</div>
          <div class="number">{{(total_sts.purchase_sum_total_price/10000).toFixed(2)}}
            <span class="unit">万元</span>
          </div>
        </div>
        <div class="box">
          <div class="title">入库总量</div>
          <div class="number">{{(total_sts.total_push_weight/1000).toFixed(2)}}
            <span class="unit">吨</span>
          </div>
        </div>
        <div class="box">
          <div class="title">入库总额</div>
          <div class="number">{{(total_sts.total_push_price/10000).toFixed(2)}}
            <span class="unit">万元</span>
          </div>
        </div>
        <div class="box">
          <div class="title">开票总额</div>
          <div class="number">{{(total_sts.collection_sum_collect_price/10000).toFixed(2)}}
            <span class="unit">万元</span>
          </div>
        </div>
        <div class="box">
          <div class="title">待开票总额</div>
          <div class="number">{{(total_sts.wait_collection/10000).toFixed(2)}}
            <span class="unit">万元</span>
          </div>
        </div>
        <div class="box">
          <div class="title">付款总额</div>
          <div class="number">{{(total_sts.invoice_sum_invoice_price/10000).toFixed(2)}}
            <span class="unit">万元</span>
          </div>
        </div>
        <div class="box">
          <div class="title">扣款总额</div>
          <div class="number">{{(total_sts.deduct_sum_total_price/10000).toFixed(2)}}
            <span class="unit">万元</span>
          </div>
        </div>
        <div class="box">
          <div class="title">欠款总额</div>
          <div class="number">{{(total_sts.wait_invoice/10000).toFixed(2)}}
            <span class="unit">万元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">客户财务列表</span>
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
            <div class="elCtn"
              style="width:350px;">
              <el-date-picker v-model="date"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeRouter(1)"
                :picker-options="pickerOptions">
              </el-date-picker>
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
              <div class="column">客户名称</div>
              <div class="column">采购数量
              </div>
              <div class="column">采购金额
                <sort v-model="purchase_sum_total_price"
                  @beforeChange="getSort($event,'purchase_sum_total_price')"></sort>
              </div>
              <div class="column">入库数量</div>
              <div class="column">入库金额</div>
              <div class="column">对方已开票
                <sort v-model="invoice_sum_invoice_price"
                  @beforeChange="getSort($event,'invoice_sum_invoice_price')"></sort>
              </div>
              <div class="column">对方待开票</div>
              <div class="column">我方已付款
                <sort v-model="collection_sum_collect_price"
                  @beforeChange="getSort($event,'collection_sum_collect_price')"></sort>
              </div>
              <div class="column">我方扣款
                <sort v-model="deduct_sum_total_price"
                  @beforeChange="getSort($event,'deduct_sum_total_price')"></sort>
              </div>
              <div class="column">我方欠款</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row"
              v-for="item in clientList"
              :key="item.id">
              <div class="column">{{item.name}}</div>
              <div class="column">{{item.financial_data.purchase_sum_total_weight}}kg</div>
              <div class="column">{{item.financial_data.purchase_sum_total_price||0}}元</div>
              <div class="column">{{item.financial_data.total_push_weight}}kg</div>
              <div class="column">{{item.financial_data.total_push_price}}元</div>
              <div class="column">{{item.financial_data.collection_sum_collect_price || 0}}元</div>
              <div class="column">{{item.financial_data.wait_collection || 0}}元</div>
              <div class="column">{{item.financial_data.invoice_sum_invoice_price || 0}}元</div>
              <div class="column">{{item.financial_data.deduct_sum_total_price || 0}}元</div>
              <div class="column">{{item.financial_data.wait_invoice || 0}}元</div>
              <div class="column">
                <span class="col_btn blue"
                  @click="$router.push('/finance/supplierDetail/'+item.id)">详情</span>
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
      purchase_sum_total_price: '',
      purchase_sum_total_weight: '',
      deduct_sum_total_price: '',
      invoice_sum_invoice_price: '',
      collection_sum_collect_price: '',
      total_sts: {
        collection_sum_collect_price: 0,
        deduct_sum_total_price: 0,
        invoice_sum_invoice_price: 0,
        order_sum_total_price: 0,
        purchase_sum_total_weight: 0,
        purchase_sum_total_price: 0,
        total_push_price: 0,
        total_push_weight: 0,
        wait_collection: 0,
        wait_invoice: 0,
        wait_push: 0
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
        `/finance/supplierList?pages=${pages}&name=${this.name || ''}&sort_type=${this.sort_type || ''}&sort_cloum=${
          this.sort_cloum || ''
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
    getList(pages: number = 1) {
      this.loading = true
      finance
        .clientList({
          type: 2,
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
          if (res.data.staus !== false) {
            this.clientList = res.data.data.items
            this.total_sts = res.data.data.additional
            this.total = res.data.data.total
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
      this.purchase_sum_total_price = ''
      this.purchase_sum_total_weight = ''
      this.deduct_sum_total_price = ''
      this.invoice_sum_invoice_price = ''
      this.collection_sum_collect_price = ''
      this[type] = ev
      this.changeRouter()
    },
    resetFilter() {
      this.purchase_sum_total_price = ''
      this.purchase_sum_total_weight = ''
      this.deduct_sum_total_price = ''
      this.invoice_sum_invoice_price = ''
      this.collection_sum_collect_price = ''
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
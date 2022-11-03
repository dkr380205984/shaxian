<template>
  <div class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">开票列表</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="code"
                placeholder="输入发票单号"
                @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="invoice_type"
                placeholder="筛选发票类型"
                filterable
                clearable
                @change="changeRouter(1)">
                <el-option :value="1"
                  label="纱线订购"></el-option>
                <el-option :value="2"
                  label="纱线加工"></el-option>
                <el-option :value="3"
                  label="毛条订购"></el-option>
                <el-option :value="4"
                  label="毛条加工"></el-option>
                <el-option :value="5"
                  label="订单发票"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-select v-model="client_id"
                placeholder="筛选公司名称"
                filterable
                clearable
                @change="changeRouter(1)">
                <el-option v-for="item in client_arr"
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
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="overflow" @mousewheel.prevent="listenWheel" ref="list">
            <div class="tableCtn">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">发票类型</div>
                    <div class="column min120">发票单位</div>
                    <div class="column min120">发票号码</div>
                    <div class="column min120">发票金额</div>
                    <div class="column min120">发票备注</div>
                    <div class="column min120">发票日期</div>
                    <div class="column min120">发票凭证</div>
                    <div class="column min120">关联单号</div>
                    <div class="column min120">开票人</div>
                    <div class="column min120">创建日期</div>
                    <div class="column min120">操作</div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div class="row"
                    v-for="item in list"
                    :key="item.id">
                    <div class="column  min120"
                      :class="{'blue':Number(item.invoice_type)===5,'orange':Number(item.invoice_type)!==5}">{{item.invoice_type | ticketFilter}}</div>
                    <div class="column min120">{{item.client_name}}</div>
                    <div class="column min120">{{item.invoice_code}}</div>
                    <div class="column min120">{{item.invoice_price}}元</div>
                    <div class="column min120">{{item.desc}}</div>
                    <div class="column min120">{{item.invoice_date}}</div>
                    <div class="column min120">
                      <el-image style="width: 50px; height: 50px;line-height:50px;text-align:center;font-size:22px"
                        :src="item.file_url"
                        :preview-src-list="[item.file_url]">
                        <div slot="error"
                          class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                      </el-image>
                    </div>
                    <div class="column min120"
                      :style="{'cursor':item.related_info?'pointer':'not-allowed'}"
                      :class="{'blue':item.related_info,'gray':!item.related_info}"
                      @click="readRelatedInfo(item.invoice_type,item.related_info)">{{item.related_info?'查看关联单据':'暂无'}}</div>
                    <div class="column min120">{{item.user_name}}</div>
                    <div class="column min120">{{item.create_time.slice(0,10)}}</div>
                    <div class="column min120">
                      <div class="opr blue">打印</div>
                      <div class="opr red">删除</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="coverTable">
            <div class="floatL">
              <div class="headCtn">
                <div class="row">
                  <div class="column min120">发票类型</div>
                </div>
              </div>
              <div class="bodyCtn">
                <div class="row"
                  v-for="item in list"
                  :key="item.id">
                  <div class="column  min120"
                    :class="{'blue':item.invoice_type===5,'orange':item.invoice_type!==5}">{{item.invoice_type | ticketFilter}}</div>
                </div>
              </div>
            </div>
            <div class="floatR">
              <div class="headCtn">
                <div class="row">
                  <div class="column min120">操作</div>
                </div>
              </div>
              <div class="bodyCtn"
                v-for="item in list"
                :key="item.id">
                <div class="row">
                  <div class="column min120">
                    <div class="opr blue">打印</div>
                    <div class="opr red"
                      @click="deleteLog(item.id)">删除</div>
                  </div>
                </div>
              </div>
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
    <related-info :show.sync="related_show"
      :type="related_type"
      :data="related_info"></related-info>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { bill } from '@/assets/js/api'
import { BillInfo } from '@/types/common'
export default Vue.extend({
  data(): {
    list: BillInfo[]
    [propName: string]: any
  } {
    return {
      loading: false,
      page: 1,
      page_size: 10,
      total: 1,
      code: '',
      invoice_type: '',
      client_id: '',
      related_info: [],
      related_type: 1,
      related_show: false,
      list: []
    }
  },
  computed: {
    client_arr() {
      return this.$store.state.api.allClient.arr
    }
  },
  methods: {
    changeRouter(page: string) {
      this.$router.push(
        '/finance/billList?page=' +
          (page || 1) +
          '&page_size=' +
          this.page_size +
          '&code=' +
          this.code +
          '&client_id=' +
          this.client_id +
          '&invoice_type=' +
          this.invoice_type
      )
    },
    getFilters() {
      const params = this.$route.query
      this.page = Number(params.page)
      this.page_size = Number(params.page_size)
      this.client_id = Number(params.client_id) || ''
      this.invoice_type = Number(params.invoice_type) || ''
      this.code = params.code || ''
    },
    getList() {
      this.loading = true
      bill
        .list({
          limit: 10,
          page: this.page,
          client_id: this.client_id,
          invoice_type: this.invoice_type,
          code: this.code
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
            this.loading = false
          }
        })
    },
    // 监听一下鼠标滚轮
    listenWheel(ev: any) {
      const detail = ev.wheelDelta || ev.detail
      // 定义滚动方向，其实也可以在赋值的时候写
      const moveForwardStep = 1
      const moveBackStep = -1
      // 定义滚动距离
      let step = 0
      // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
      if (detail < 0) {
        step = moveForwardStep * 50
      } else {
        step = moveBackStep * 50
      }
      // @ts-ignore 对需要滚动的元素进行滚动操作
      this.$refs.list.scrollLeft += step
    },
    deleteLog(id: number) {
      this.$confirm('是否要删除该发票?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          bill
            .delete({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }
            })
          this.getFilters()
          this.getList()
          this.$forceUpdate()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    readRelatedInfo(type: number, info: Array<{ code: string }>) {
      this.related_type = type
      this.related_info = info
      this.related_show = true
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
  mounted() {
    this.getFilters()
    this.getList()
    this.$checkCommonInfo([
      {
        checkWhich: 'api/allClient',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPartyBAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/css/list.less';
</style>
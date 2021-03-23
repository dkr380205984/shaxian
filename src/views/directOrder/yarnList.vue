<template>
  <div id="yarnList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">纱线采购单列表</span>
        <span class="addBtn btn btnMain"
          @click="openOrder">添加采购单</span>
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
                placeholder="请输入采购单号搜索"
                @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="client_id"
                placeholder="选择采购单位"
                clearable
                @change="changeRouter(1)">
                <el-option v-for="item in client_arr"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-input v-model="name"
                placeholder="搜索纱线名称"
                @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="user_id"
                clearable
                placeholder="选择创建人">
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
          <div class="headCtn">
            <div class="row">
              <div class="column min120">采购单号</div>
              <div class="column min120">采购单位</div>
              <div class="column min120">纱线名称</div>
              <div class="column min120">颜色属性</div>
              <div class="column min120">数量/单价</div>
              <div class="column min120">采购总数</div>
              <div class="column min120">交货日期</div>
              <div class="column min120">创建人</div>
              <div class="column min120">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row"
              v-for="item in list"
              :key="item.id">
              <div class="column min120">{{item.code}}</div>
              <div class="column min120">{{item.client_name}}</div>
              <div class="column min120">
                <div class="sortContainer">
                  <div class="sort">
                    <i class="el-icon-caret-top hover"
                      @click="changeIndex(item,'add')"></i>
                    <div class="number">
                      {{(item.index||0)+1}}/{{item.child_data.length}}
                    </div>
                    <i class="el-icon-caret-bottom hover"
                      @click="changeIndex(item,'delete')"></i>
                  </div>
                  <span>{{item.child_data[item.index||0].name}}</span>
                </div>
              </div>
              <div class="column min120">{{item.child_data[item.index||0].color}}/{{item.child_data[item.index||0].attribute}}</div>
              <div class="column min120">{{item.child_data[item.index||0].weight}}kg/{{item.child_data[item.index||0].price}}元</div>
              <div class="column min120">{{item.total_weight}}kg</div>
              <div class="column min120">{{item.delivery_time}}</div>
              <div class="column min120">{{item.user_name}}</div>
              <div class="column min120">
                <div class="opr blue"
                  @click="$router.push('/directOrder/yarnDetail/' + item.id)">详情</div>
                <div class="opr orange"
                  @click="openUpdate(item)">修改</div>
                <div class="opr red"
                  @click="openDelete(item.id)">删除</div>
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
    <div class="popup"
      v-show="create_flag || update_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">添加采购单</span>
          <i class="close_icon el-icon-close"
            @click="resetInfo"></i>
        </div>
        <div class="contentCtn"
          style="padding:0">
          <div class="createCtn">
            <div class="rowCtn">
              <div class="colCtn">
                <div class="label">
                  <span class="text">供货商</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-select placeholder="请选择供货商"
                      v-model="order_yarn_info.client_id">
                      <el-option v-for="item in client_arr"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">合计采购价格</span>
                  <span class="explanation">(自动计算)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input v-model="order_yarn_info.total_price"
                      disabled
                      placeholder="自动计算合计价格"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">下单日期</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="elCtn">
                  <el-date-picker v-model="order_yarn_info.order_time"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择下单日期">
                  </el-date-picker>
                </div>
              </div>
            </div>
            <div class="rowCtn"
              v-for="(item,index) in order_yarn_info.child_data"
              :key="'yarn' + index">
              <div class="colCtn">
                <div class="label"
                  v-if="index===0">
                  <span class="text">纱线名称</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-select v-model="item.name"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请输入纱线名称搜索"
                      :remote-method="searchPro"
                      :loading="select_loading">
                      <el-option v-for="itemPro in product_arr"
                        :key="itemPro.id"
                        :label="itemPro.name"
                        :value="itemPro.name">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label"
                  v-if="index===0">
                  <span class="text">颜色/属性</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="content flexRow">
                  <div class="elCtn">
                    <el-input placeholder="颜色"
                      v-model="item.color"></el-input>
                  </div>
                  <div class="elCtn">
                    <el-select placeholder="属性"
                      v-model="item.attribute">
                      <el-option label="筒纱"
                        value="筒纱"></el-option>
                      <el-option label="绞纱"
                        value="绞纱"></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label"
                  v-if="index===0">
                  <span class="text">单价/数量</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="content flexRow">
                  <div class="elCtn">
                    <el-input placeholder="单价"
                      v-model="item.price"
                      @input="cmpTotalPrice">
                    </el-input>
                  </div>
                  <div class="elCtn">
                    <el-input placeholder="数量"
                      v-model="item.weight"
                      @input="cmpTotalPrice"></el-input>
                  </div>
                </div>
                <div v-if="index===0"
                  class="editBtn blue"
                  @click="$addItem(order_yarn_info.child_data,{
                  name: '',
                  weight: '',
                  color: '',
                  attribute: '',
                  price: ''
                })">添加</div>
                <div v-if="index>0"
                  class="editBtn red"
                  @click="$deleteItem(order_yarn_info.child_data,index)">删除</div>
              </div>
            </div>
            <div class="rowCtn"
              v-for="(item,index) in order_yarn_info.additional_fee"
              :key="'fee' + index">
              <div class="colCtn">
                <div class="label"
                  v-if="index===0">
                  <span class="text">额外费用名称</span>
                  <span class="explanation">(选填)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-select v-model="item.name"
                      placeholder="请选择额外费用名称">
                      <el-option value="运费"
                        label="运费"></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label"
                  v-if="index===0">
                  <span class="text">额外费用金额</span>
                  <span class="explanation">(选填)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input v-model="item.price"
                      placeholder="请输入额外费用金额"
                      @input="cmpTotalPrice"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label"
                  v-if="index===0">
                  <span class="text">额外费用备注</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="elCtn">
                  <el-input v-model="item.desc"
                    placeholder="请输入额外费用备注"></el-input>
                </div>
                <div v-if="index===0"
                  class="editBtn blue"
                  @click="$addItem(order_yarn_info.additional_fee,{
                  name: '',
                  price: '',
                  desc:''
                })">添加</div>
                <div v-if="index>0"
                  class="editBtn red"
                  @click="$deleteItem(order_yarn_info.additional_fee,index)">删除</div>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn"
                style="max-width:224.67px">
                <div class="label">
                  <span class="text">交货日期</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-date-picker v-model="order_yarn_info.delivery_time"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择交货日期">
                    </el-date-picker>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">备注信息</span>
                  <span class="explanation">(选填)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input v-model="order_yarn_info.desc"
                      placeholder="请输入备注信息"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="resetInfo">取消</div>
          <div class="opr"
            :class="{'blue':create_flag,'orange':update_flag}"
            @click="saveOrder">{{create_flag?'确认采购':'确认修改'}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { product } from '@/assets/js/api'
import { OrderYarn } from '@/types/orderProcessYarn'
import { yarnOrder } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    order_yarn_info: OrderYarn
    [propName: string]: any
  } {
    return {
      loading: true,
      page: 1,
      total: 1,
      page_size: 10,
      showMore: false,
      client_id: '',
      code: '',
      name: '',
      status: '',
      date: [],
      user_id: '',
      create_flag: false,
      update_flag: false,
      select_loading: false,
      order_yarn_info: {
        order_id: '',
        client_id: '',
        total_price: '',
        child_data: [
          {
            name: '',
            weight: '',
            color: '',
            attribute: '',
            price: ''
          }
        ],
        order_time: this.$getDate(new Date()),
        delivery_time: '',
        additional_fee: [
          {
            name: '',
            price: '',
            desc: ''
          }
        ],
        desc: ''
      },
      list: [],
      product_arr: []
    }
  },
  computed: {
    client_arr() {
      return this.$store.state.api.client.arr
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
        '/directOrder/yarnList/page=' +
          pages +
          '&&code=' +
          this.code +
          '&&name=' +
          this.name +
          '&&client_id=' +
          this.client_id +
          '&&user_id=' +
          this.user_id +
          '&&page_size=' +
          this.page_size +
          '&&date=' +
          this.date
      )
    },
    reset() {
      this.$router.push('/directOrder/yarnList/page=1&&code=&&name=&&client_id=&&user_id=&&page_size=10&&date=')
    },
    getFilters() {
      const params = this.$getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.page_size = Number(params.page_size)
      this.user_id = params.user_id ? Number(params.user_id) : ''
      this.client_id = params.client_id ? Number(params.client_id) : ''
      this.name = params.name
      this.code = params.code
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = []
      }
    },
    cmpTotalPrice() {
      this.order_yarn_info.total_price =
        this.order_yarn_info.child_data.reduce((total, current) => {
          return total + Number(current.price) * Number(current.weight)
        }, 0) +
        (this.order_yarn_info.additional_fee as any[]).reduce((total, current) => {
          return total + Number(current.price)
        }, 0)
    },
    searchPro(query: string) {
      if (query !== '') {
        product
          .list({
            limit: 5,
            page: 1,
            name: query
          })
          .then((res) => {
            this.product_arr = res.data.data.items
          })
      } else {
        this.product_arr = []
      }
    },
    openOrder() {
      this.create_flag = true
    },
    saveOrder() {
      if (
        this.$formCheck(this.order_yarn_info, [
          {
            key: 'client_id',
            errMsg: '请选择供货商'
          },
          {
            key: 'delivery_time',
            errMsg: '请选择交货日期'
          }
        ])
      ) {
        return
      }
      if (
        this.order_yarn_info.child_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'name',
              errMsg: '请选择纱线名称'
            },
            {
              key: 'color',
              errMsg: '请输入纱线颜色'
            },
            {
              key: 'attribute',
              errMsg: '请选择纱线属性'
            },
            {
              key: 'price',
              errMsg: '请输入单价'
            },
            {
              key: 'weight',
              errMsg: '请输入数量'
            }
          ])
        })
      ) {
        return
      }
      this.loading = true
      this.order_yarn_info.additional_fee = JSON.stringify(this.order_yarn_info.additional_fee)
      yarnOrder
        .create({
          data: [this.order_yarn_info]
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.resetInfo()
          }
        })
    },
    resetInfo() {
      this.create_flag = false
      this.update_flag = false
      this.order_yarn_info = {
        order_id: '',
        client_id: '',
        total_price: '',
        child_data: [
          {
            name: '',
            weight: '',
            color: '',
            attribute: '',
            price: ''
          }
        ],
        order_time: this.$getDate(new Date()),
        delivery_time: '',
        additional_fee: [
          {
            name: '',
            price: '',
            desc: ''
          }
        ],
        desc: ''
      }
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
    openUpdate(info: OrderYarn) {
      this.update_flag = true
      info.additional_fee = JSON.parse(info.additional_fee as string)
      this.order_yarn_info = info
    },
    getList() {
      this.loading = true
      yarnOrder
        .list({
          code: this.code,
          client_id: this.client_id,
          user_id: this.user_id,
          start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          end_time: this.date && this.date.length > 0 ? this.date[1] : '',
          page: this.page,
          limit: this.page_size
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
          this.list.forEach((item: any) => {
            item.total_weight = item.child_data.reduce((total: number, current: any) => {
              return total + current.weight
            }, 0)
          })
          this.loading = false
        })
    },
    openDelete(id: number) {
      this.$confirm('是否删除该订购单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          yarnOrder
            .delete({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('删除成功')
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
        checkWhich: 'api/client',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPartyBAsync'
      }
    ])
    this.getFilters()
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/directOrder/yarnList.less';
</style>
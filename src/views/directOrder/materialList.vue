<template>
  <div id="yarnList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">毛条采购单列表</span>
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
                placeholder="搜索毛条名称"
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
          <el-table :data="list"
            style="width: 100%"
            ref="table">
            <el-table-column fixed
              prop="code"
              label="采购单号"
              width="120">
            </el-table-column>
            <el-table-column fixed
              prop="client_name"
              label="采购单位"
              width="140">
            </el-table-column>
            <el-table-column prop="status"
              label="采购单状态"
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
            <el-table-column label="毛条名称"
              width="200">
              <template slot-scope="scope">
                <div class="sortContainer">
                  <div class="sort">
                    <i class="el-icon-caret-top hover"
                      @click="changeIndex(scope.row,'add')"></i>
                    <div class="number">
                      {{(scope.row.index||0)+1}}/{{scope.row.child_data.length}}
                    </div>
                    <i class="el-icon-caret-bottom hover"
                      @click="changeIndex(scope.row,'delete')"></i>
                  </div>
                  <span>{{scope.row.child_data[scope.row.index||0].name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="total_price"
              label="采购数量(kg)"
              width="120">
              <template slot-scope="scope">
                <span>{{scope.row.child_data[scope.row.index||0].weight}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="total_weight"
              label="采购总数(kg)"
              width="120">
              <template slot-scope="scope">
                <span class="blue">{{scope.row.total_weight}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="push_weight"
              label="入库总数(kg)"
              width="120">
              <template slot-scope="scope">
                <span class="green">{{scope.row.push_weight || 0}}</span>
              </template>
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
                  @click="$router.push('/directOrder/materialDetail/' + scope.row.id)">详情</span>
                <span class="opr orange"
                  @click="openUpdate(scope.row)">修改</span>
                <span class="opr red"
                  @click="openDelete(scope.row.id)">删除</span>
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
    <div class="popup"
      v-show="create_flag || update_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">{{create_flag?'添加':'修改'}}采购单</span>
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
                  <span class="text">毛条名称</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-cascader v-model="item.name"
                      filterable
                      placeholder="请选择毛条"
                      :options="material_arr"></el-cascader>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label"
                  v-if="index===0">
                  <span class="text">单价</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input placeholder="单价"
                      v-model="item.price"
                      @input="cmpTotalPrice">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label"
                  v-if="index===0">
                  <span class="text">数量</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="content">
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
                    <el-input v-model="item.name"
                      placeholder="请输入额外费用名称">
                    </el-input>
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
                      @input="cmpTotalPrice">
                      <template slot="append">元</template>
                    </el-input>
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
            <div class="rowCtn">
              <div class="colCtn">
                <div class="label">
                  <span class="text">图片补充说明</span>
                  <span class="explanation">(选填)</span>
                </div>
                <el-upload class="upload"
                  action="https://upload.qiniup.com/"
                  accept="image/jpeg,image/gif,image/png,image/bmp"
                  :before-upload="beforeAvatarUpload"
                  :multiple="false"
                  :data="postData"
                  :file-list="order_yarn_info.file_url?[{name:'说明文件',url:order_yarn_info.file_url}]:[]"
                  :limit="1"
                  :on-success="successFile"
                  ref="uploada"
                  list-type="picture">
                  <div class="uploadBtn">
                    <i class="el-icon-upload"></i>
                    <span>上传文件</span>
                  </div>
                  <div slot="tip"
                    class="el-upload__tip">只能上传一张jpg/png图片文件，且不超过10M</div>
                </el-upload>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="resetInfo"
            style="padding-left:8px">取消</div>
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
import { material } from '@/assets/js/api'
import { OrderMaterialInfo } from '@/types/material'
export default Vue.extend({
  data(): {
    order_yarn_info: OrderMaterialInfo
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
        client_id: '',
        total_price: '',
        child_data: [
          {
            name: [],
            weight: '',
            price: '',
            batch_code: ''
          }
        ],
        file_url: '',
        order_time: this.$getDate(new Date()),
        delivery_time: '',
        additional_fee: [
          {
            name: '',
            price: '',
            desc: ''
          }
        ],
        total_additional_fee: 0,
        desc: ''
      },
      list: [],
      product_arr: [],
      postData: { key: '', token: '' }
    }
  },
  computed: {
    client_arr() {
      return this.$store.state.api.factory.arr
    },
    user_list() {
      return this.$store.state.api.user.arr
    },
    token() {
      return this.$store.state.status.token
    },
    material_arr() {
      return this.$store.state.api.materialType.arr.map((item: any) => {
        return {
          value: item.name,
          label: item.name,
          children: item.child_data.map((itemChild: any) => {
            return {
              value: itemChild.name,
              label: itemChild.name
            }
          })
        }
      })
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
        '/directOrder/materialList?page=' +
          pages +
          '&code=' +
          this.code +
          '&name=' +
          this.name +
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
      this.$router.push('/directOrder/materialList?page=1&code=&name=&client_id=&user_id=&page_size=10&date=')
    },
    getFilters() {
      const params = this.$route.query
      this.page = Number(params.page)
      this.page_size = Number(params.page_size)
      this.user_id = params.user_id ? Number(params.user_id) : ''
      this.client_id = params.client_id ? Number(params.client_id) : ''
      this.name = params.name
      this.code = params.code
      if (params.date !== 'null' && params.date !== '') {
        this.date = (params.date as string).split(',')
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
        material
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
              errMsg: '请选择毛条名称'
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
      this.order_yarn_info.total_additional_fee = (this.order_yarn_info.additional_fee as any[]).reduce(
        (total, current) => {
          return total + Number(current.price)
        },
        0
      )
      this.order_yarn_info.additional_fee = JSON.stringify(this.order_yarn_info.additional_fee)
      this.order_yarn_info.child_data.forEach((item) => (item.name = (item.name as unknown as any[])[1]))
      material
        .orderCreate({
          data: [this.order_yarn_info]
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.resetInfo()
            this.getList()
          }
        })
    },
    openUpdate(info: OrderMaterialInfo) {
      const selfInfo = JSON.parse(JSON.stringify(info))
      this.update_flag = true
      selfInfo.additional_fee = selfInfo.additional_fee
        ? JSON.parse(info.additional_fee as string)
        : [
            {
              name: '',
              price: '',
              desc: ''
            }
          ]
      this.order_yarn_info = selfInfo
    },
    resetInfo() {
      this.update_flag = false
      this.create_flag = false
      this.order_yarn_info = {
        client_id: '',
        total_price: '',
        child_data: [
          {
            name: '',
            weight: '',
            price: '',
            batch_code: ''
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
    getList() {
      this.loading = true
      material
        .orderList({
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
          this.list.forEach((item: any) => {
            item.total_weight = item.child_data.reduce((total: number, current: any) => {
              return total + current.weight
            }, 0)
          })
          this.total = res.data.data.total
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
          material
            .orderDelete({
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
    },
    beforeAvatarUpload(file: any) {
      const fileName = file.name.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
      const fileNameLength = file.name.length // 取到文件名长度
      const fileFormat = file.name.substring(fileName + 1, fileNameLength) // 截
      this.postData.token = this.token
      this.postData.key = Date.parse(new Date() + '') + '.' + fileFormat
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!')
        return false
      }
    },
    successFile(response: any) {
      this.order_yarn_info.file_url = 'https://file.zwyknit.com/' + response.key
      console.log(this.order_yarn_info)
    }
  },
  mounted() {
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
      },
      {
        checkWhich: 'status/token',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getTokenAsync'
      },
      {
        checkWhich: 'api/materialType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getMaterialTypeAsync'
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
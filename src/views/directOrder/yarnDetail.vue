<template>
  <div class="indexMain"
    id="yarnDetail"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="checkCtn">
          <el-tooltip class="item"
            effect="dark"
            content="点击查看审核日志"
            placement="bottom">
            <img @click="checkReason"
              :src="order_yarn_info.is_check|checkFilter" />
          </el-tooltip>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">采购单号：</span>
            <span class="text green">{{order_yarn_info.code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">采购单位：</span>
            <span class="text">{{order_yarn_info.client_name}}</span>
          </div>
          <div class="colCtn">
            <span class="label">采购总价：</span>
            <span class="text">{{order_yarn_info.total_price}}元</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">创建人：</span>
            <span class="text">{{order_yarn_info.user_name}}</span>
          </div>
          <div class="colCtn">
            <span class="label">下单日期：</span>
            <span class="text">{{order_yarn_info.order_time}}</span>
          </div>
          <div class="colCtn">
            <span class="label">交货日期：</span>
            <span class="text">{{order_yarn_info.delivery_time}}
              （<span :class="{'red':$diffByDate(order_yarn_info.delivery_time)<=0,'green':$diffByDate(order_yarn_info.delivery_time)>7,'yellow':$diffByDate(order_yarn_info.delivery_time)<=7 &&$diffByDate(order_yarn_info.delivery_time)>0 }">
                {{$diffByDate(order_yarn_info.delivery_time)>0?'交货还剩'+$diffByDate(order_yarn_info.delivery_time)+'天':'延期发货'+Math.abs($diffByDate(order_yarn_info.delivery_time))+'天'}}
              </span>）
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="min-width:796px">
            <span class="label">备注信息：</span>
            <span class="text">{{order_yarn_info.desc || '无'}}</span>
          </div>
          <div class="colCtn">
            <span class="label">入库数量：</span>
            <span class="text green">{{order_yarn_info.push_weight || 0}}kg</span>
          </div>
        </div>
        <div class="rowCtn"
          v-if="order_yarn_info.additional_fee.length>0">
          <div class="colCtn">
            <span class="label">额外费用：</span>
            <div class="text">
              <div class="tableCtn"
                style="margin-top:6px">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn">额外费用名称</div>
                    <div class="tcolumn">额外费用金额</div>
                    <div class="tcolumn">额外费用备注</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in order_yarn_info.additional_fee"
                    :key="index">
                    <div class="tcolumn">{{item.name}}</div>
                    <div class="tcolumn">{{item.price}}元</div>
                    <div class="tcolumn">{{item.desc||'无'}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">纱线采购信息</span>
        <span class="addBtn btn btnMain"
          @click="openOrderIn">纱线入库</span>
      </div>
      <div style="padding:20px 32px">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">纱线名称</div>
              <div class="tcolumn">纱线颜色</div>
              <div class="tcolumn">纱线属性</div>
              <div class="tcolumn">采购单价(元)</div>
              <div class="tcolumn">采购数量(kg)</div>
              <div class="tcolumn">入库数量(kg)</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in order_yarn_info.child_data"
              :key="index">
              <div class="tcolumn">{{item.name}}</div>
              <div class="tcolumn">{{item.color}}</div>
              <div class="tcolumn">{{item.attribute}}</div>
              <div class="tcolumn">{{item.price}}元</div>
              <div class="tcolumn blue">{{item.weight}}kg</div>
              <div class="tcolumn green">{{item.push_weight}}kg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-show="order_in_log.length>0">
      <div class="titleCtn">
        <span class="title">纱线入库信息</span>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="overflow">
            <div class="tableCtn">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">入库单号</div>
                    <div class="column min120">入库仓库</div>
                    <div class="column"
                      style="flex-direction:column">
                      <div class="row">
                        <div class="column min120">纱线名称</div>
                        <div class="column min120">订购颜色</div>
                        <div class="column min120">订购属性</div>
                        <div class="column min120">入库数量</div>
                        <div class="column min120">批号</div>
                        <div class="column min120">色号</div>
                        <div class="column min120">缸号</div>
                      </div>
                    </div>
                    <div class="column min120">备注信息</div>
                    <div class="column min120">入库日期</div>
                    <div class="column min120">操作人</div>
                    <div class="column min120">操作</div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div class="row"
                    v-for="item in order_in_log"
                    :key="item.id">
                    <div class="column min120">{{item.code}}</div>
                    <div class="column min120">{{item.store_name}}/{{item.second_store_name}}</div>
                    <div class="column"
                      style="flex-direction:column">
                      <div class="row"
                        v-for="(itemChild,indexChild) in item.child_data"
                        :key="indexChild">
                        <div class="column min120">{{itemChild.name}}</div>
                        <div class="column min120">{{itemChild.color}}</div>
                        <div class="column min120">{{itemChild.attribute}}</div>
                        <div class="column min120 blue">{{itemChild.action_weight}}</div>
                        <div class="column min120">{{itemChild.batch_code}}</div>
                        <div class="column min120">{{itemChild.color_code}}</div>
                        <div class="column min120">{{itemChild.vat_code}}</div>
                      </div>
                    </div>
                    <div class="column min120">{{item.desc||'无'}}</div>
                    <div class="column min120">{{item.complete_time}}</div>
                    <div class="column min120">{{item.user_name}}</div>
                    <div class="column min120">操作</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="coverTable">
            <div class="floatL">
              <div class="headCtn">
                <div class="row">
                  <div class="column min120">入库单号</div>
                  <div class="column min120">入库仓库</div>
                </div>
              </div>
              <div class="bodyCtn">
                <div class="row"
                  v-for="item in order_in_log"
                  :key="item.id">
                  <div class="column min120 blue"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.code}}</div>
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.store_name}}/{{item.second_store_name}}</div>
                </div>
              </div>
            </div>
            <div class="floatR">
              <div class="headCtn">
                <div class="row">
                  <div class="column min120">操作</div>
                </div>
              </div>
              <div class="bodyCtn">
                <div class="row"
                  v-for="item in order_in_log"
                  :key="item.id">
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">
                    <span class="blue opr"
                      @click="$openUrl(`/print/store/1/${item.id}`)">打印</span>
                    <span class="red opr"
                      @click="deleteLog(item.id)">删除</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-show="deduct_list.length>0">
      <div class="titleCtn">
        <span class="title">扣款信息</span>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">扣款单号</div>
              <div class="column">纱线信息</div>
              <div class="column">扣款单价</div>
              <div class="column">图片说明</div>
              <div class="column">扣款总价</div>
              <div class="column">备注信息</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row"
              v-for="item in deduct_list"
              :key="item.id">
              <div class="column blue">{{item.code}}</div>
              <div class="column">
                <div class="sortContainer">
                  <div class="sort">
                    <i class="el-icon-caret-top hover"
                      @click="changeIndex(item,'add')"></i>
                    <div class="number">
                      {{(item.index||0)+1}}/{{item.deduct_content.length}}
                    </div>
                    <i class="el-icon-caret-bottom hover"
                      @click="changeIndex(item,'delete')"></i>
                  </div>
                  <span>{{item.deduct_content[item.index||0].yarn}}</span>
                </div>
              </div>
              <div class="column">{{item.deduct_content[item.index||0].price}}元</div>
              <div class="column">
                <el-image style="width: 50px; height: 50px;line-height:50px;text-align:center;font-size:22px"
                  :src="item.deduct_file"
                  :preview-src-list="[item.deduct_file]">
                  <div slot="error"
                    class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
              <div class="column red">{{item.total_price}}元</div>
              <div class="column">{{item.desc}}</div>
              <div class="column">
                <div class="opr blue">打印</div>
                <div class="opr red">删除</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="$openUrl(`/print/orderYarn/2/${$route.params.id}`)">打印</div>
          <div class="btn btnGreen"
            @click="openCheck">审核</div>
          <div class="btn btnRed"
            @click="openDeduct">扣款</div>
          <div class="btn btnBlue"
            @click="confirm"
            v-if="order_yarn_info.status!==3">确认完成</div>
        </div>
      </div>
    </div>
    <deduct :show.sync="deduct_show"
      :data="deduct_info"></deduct>
    <check :show.sync="check_flag"
      :pid="$route.params.id"
      @afterCheck="init"
      :checkType="1"
      :checkList="[{
        value:'费用问题',
        label:'费用问题'
      },{
        value:'质量问题',
        label:'质量问题'
      },{
        value:'产品问题',
        label:'产品问题'
      },{
        value:'交期问题',
        label:'交期问题'
      },{
        value:'数量问题',
        label:'数量问题'
      }]"></check>
    <check-detail :show.sync="check_detail_flag"
      :checkType="1"
      :pid="$route.params.id"></check-detail>

    <in-and-out :relatedCode="order_yarn_info.code"
      :relatedId="$route.params.id"
      :yarnArr="store_info.yarn_arr"
      :outClientArr="store_info.out_client_arr"
      :clientId="store_info.client_id"
      :show.sync="store_info.show"
      :type="store_info.type"
      @close="init"></in-and-out>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { StoreCreate } from '@/types/store'
import { OrderYarn } from '@/types/orderProcessYarn'
import { yarnOrder, stock, deduct, check } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    order_yarn_info: OrderYarn
    [propName: string]: any
  } {
    return {
      loading: true,
      check_flag: false,
      check_detail_flag: false,
      deduct_show: false,
      deduct_info: {
        yarn: [],
        pid: 1,
        pcode: '',
        type: 1
      },
      order_yarn_info: {
        code: '',
        is_check: '',
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
        order_time: '',
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
      store_info: {
        type: 3,
        show: false,
        out_client_arr: [],
        client_id: '',
        yarn_arr: []
      },
      deduct_list: [],
      order_in_log: []
    }
  },
  computed: {
    store_list() {
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 1)
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        yarnOrder.detail({
          id: this.$route.params.id
        }),
        stock.list({
          related_id: this.$route.params.id,
          action_type: [3]
        }),
        deduct.list({
          pid: this.$route.params.id,
          deduct_type: 1
        })
      ]).then((res) => {
        this.order_yarn_info = res[0].data.data
        this.order_yarn_info.additional_fee = this.order_yarn_info.additional_fee
          ? JSON.parse(this.order_yarn_info.additional_fee as string)
          : []
        this.order_in_log = res[1].data.data.data.items
        this.order_yarn_info.child_data.forEach((item) => {
          item.push_weight = 0
          this.order_in_log.forEach((itemLog: any) => {
            itemLog.child_data.forEach((itemChild: any) => {
              if (
                itemChild.name === item.name &&
                itemChild.color === item.color &&
                itemChild.attribute === item.attribute
              ) {
                item.push_weight = Number(itemChild.action_weight) + Number(item.push_weight)
              }
            })
          })
        })
        this.deduct_list = res[2].data.data
        this.deduct_list.forEach((item: any) => {
          item.deduct_content = JSON.parse(item.deduct_content)
        })
        this.loading = false
      })
    },
    checkReason() {
      if (!this.order_yarn_info.is_check) {
        this.$message.warning('暂无审核信息')
        return
      }
      this.check_detail_flag = true
    },
    // 打开扣款窗口
    openDeduct() {
      this.deduct_info = {
        yarn: this.order_yarn_info.child_data.map((item) => {
          return {
            value: item.name,
            label: item.name + '/' + item.color + '/' + item.attribute
          }
        }),
        pid: this.$route.params.id,
        pcode: this.order_yarn_info.code,
        type: 1
      }
      this.deduct_show = true
    },
    openCheck() {
      this.check_flag = true
    },
    confirm() {
      this.$confirm('是否确认采购单完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          check
            .confirm({
              pid: this.$route.params.id,
              complete_type: 1
            })
            .then((res) => {
              if (res.data.status) {
                this.init()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    openOrderIn() {
      this.store_info.out_client_arr = [
        {
          id: this.order_yarn_info.client_id,
          name: this.order_yarn_info.client_name
        }
      ]
      this.store_info.related_code = this.order_yarn_info.code
      this.store_info.type = 3
      this.store_info.yarn_arr = this.$mergeData(this.order_yarn_info.child_data, {
        mainRule: 'name'
      })
      this.store_info.client_id = this.order_yarn_info.client_id
      this.store_info.show = true
    },
    deleteLog(id: number) {
      this.$confirm('是否删除该日志，这可能会导致相关库存变动?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          stock.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.init()
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
        checkWhich: 'api/storeHouse',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getStoreAsync'
      }
    ])
    this.init()
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/less/directOrder/yarnDetail.less';
</style>
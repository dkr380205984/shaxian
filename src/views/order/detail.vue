<template>
  <div class="indexMain"
    id="orderDeatil"
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
              :src="order_info.is_check|checkFilter" />
          </el-tooltip>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">订单号：</span>
            <span class="text blue">{{order_info.code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">客户单号：</span>
            <span class="text green">{{order_info.order_code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">下单客户：</span>
            <span class="text">{{order_info.client_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{order_info.order_time}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">交货日期：</span>
            <span class="text">{{order_info.delivery_time}}（
              <span :class="{'red':$diffByDate(order_info.delivery_time)<=0,'green':$diffByDate(order_info.delivery_time)>7,'yellow':$diffByDate(order_info.delivery_time)<=7 &&$diffByDate(order_info.delivery_time)>0 }">
                {{$diffByDate(order_info.delivery_time)>0?'交货还剩'+$diffByDate(order_info.delivery_time)+'天':'延期发货'+Math.abs($diffByDate(order_info.delivery_time))+'天'}}
              </span>）
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">下单总额：</span>
            <span class="text green">{{order_info.total_price}}元</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">创建人：</span>
            <span class="text">{{order_info.user_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">创建时间：</span>
            <span class="text">{{order_info.create_time.slice(0,10)||'暂无'}}</span>
          </div>
        </div>
        <div class="rowCtn"
          v-if="order_info.additional_fee">
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
                    v-for="(item,index) in JSON.parse(order_info.additional_fee)"
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
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="text"
              v-html="order_info.desc"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">下单信息</span>
        <span class="addBtn btn btnMain"
          @click="$router.push('/orderProcessYarn/detail/' + $route.params.id)">订购加工信息</span>
        <span class="addBtn btn btnMain"
          @click="$router.push('/inAndOut/detail/' + $route.params.id)">出入库信息</span>
      </div>
      <div style="padding:20px 32px">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">纱线名称</div>
              <div class="tcolumn noPad"
                style="flex:7">
                <div class="trow">
                  <div class="tcolumn">纱线颜色</div>
                  <div class="tcolumn">纱线属性</div>
                  <div class="tcolumn">下单价格(元)</div>
                  <div class="tcolumn">下单数量(kg)</div>
                  <div class="tcolumn">数量属性</div>
                  <div class="tcolumn">调取数量</div>
                  <div class="tcolumn">订购数量</div>
                </div>
              </div>
              <div class="tcolumn">加工信息</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item) in order_info.product_info"
              :key="item.id">
              <div class="tcolumn">
                {{item.product_name}}
              </div>
              <div class="tcolumn noPad"
                style="flex:7">
                <div class="trow"
                  v-for="itemChild in item.child_data"
                  :key="itemChild.id">
                  <div class="tcolumn">
                    {{itemChild.color}}
                  </div>
                  <div class="tcolumn">{{itemChild.attribute}}</div>
                  <div class="tcolumn">{{itemChild.price}}元</div>
                  <div class="tcolumn blue">{{itemChild.weight}}kg</div>
                  <div class="tcolumn">{{itemChild.number_attribute}}</div>
                  <div class="tcolumn blue">{{itemChild.transfer_weight||0}}kg</div>
                  <div class="tcolumn blue">{{itemChild.purchase_weight||0}}kg</div>
                </div>
              </div>
              <div class="tcolumn blue">
                <div class="once gray"
                  v-if="item.process_info.length===0">暂无加工信息</div>
                <div class="once"
                  v-for="item in item.process_info"
                  :key="item.type">
                  <span class="green"
                    style="margin-right:5px">{{item.type}}</span>
                  <span class="blue">{{item.total_weight}}kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-show="final_out_log.length>0">
      <div class="titleCtn">
        <span class="title">发货信息</span>
      </div>
      <div style="padding:20px 32px">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">出库单号</div>
              <div class="tcolumn">来源仓库</div>
              <div class="tcolumn noPad"
                style="flex:4;">
                <div class="trow">
                  <div class="tcolumn">纱线名称</div>
                  <div class="tcolumn">出库颜色</div>
                  <div class="tcolumn">出库属性</div>
                  <div class="tcolumn">出库数量</div>
                </div>
              </div>
              <div class="tcolumn">备注信息</div>
              <div class="tcolumn">出库日期</div>
              <div class="tcolumn">操作人</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in final_out_log"
              :key="item.id">
              <div class="tcolumn">{{item.code}}</div>
              <div class="tcolumn">{{item.store_name}}/{{item.second_store_name}}</div>
              <div class="tcolumn noPad"
                style="flex:4;">
                <div class="trow"
                  v-for="(itemChild,indexChild) in item.child_data"
                  :key="indexChild">
                  <div class="tcolumn">{{itemChild.name}}</div>
                  <div class="tcolumn">{{itemChild.color}}</div>
                  <div class="tcolumn">{{itemChild.attribute}}</div>
                  <div class="tcolumn blue">{{itemChild.action_weight}}kg</div>
                </div>
              </div>
              <div class="tcolumn">{{item.desc||'无'}}</div>
              <div class="tcolumn">{{item.complete_time}}</div>
              <div class="tcolumn">{{item.user_name}}</div>
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
          <div class="btn btnGreen"
            @click="openCheck">审核</div>
          <div class="btn btnRed"
            @click="openDeduct">扣款</div>
          <div class="btn btnBlue"
            @click="confirm"
            v-if="order_info.status!==3">确认完成</div>
        </div>
      </div>
    </div>
    <!-- 订单审核 -->
    <check :show.sync="check_flag"
      :pid="$route.params.id"
      @afterCheck="init"
      :checkType="5"
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
    <!-- 订单扣款 -->
    <deduct :show.sync="deduct_show"
      :data="deduct_info"></deduct>
    <check-detail :show.sync="check_detail_flag"
      :checkType="5"
      :pid="$route.params.id"></check-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Order } from '@/types/order'
import { order, deduct, stock, check } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    order_info: Order
    [propName: string]: any
  } {
    return {
      loading: true,
      deduct_show: false,
      deduct_info: {
        yarn: [],
        pid: 1,
        pcode: '',
        type: 1
      },
      final_out_log: [],
      deduct_list: [],
      order_info: {
        order_code: '',
        order_time: '',
        delivery_time: '',
        client_id: '',
        total_price: '',
        total_weight: 0,
        desc: '',
        create_time: '',
        additional_fee: '',
        is_check: 0,
        product_info: []
      },
      check_flag: false,
      check_detail_flag: false
    }
  },
  methods: {
    openCheck() {
      this.check_flag = true
    },
    checkReason() {
      if (this.order_info.is_check === 0 || !this.order_info.is_check) {
        this.$message.warning('暂无审核信息')
        return
      }
      this.check_detail_flag = true
    },
    init() {
      this.loading = true
      Promise.all([
        order.detail({
          id: this.$route.params.id
        }),
        deduct.list({
          pid: this.$route.params.id,
          deduct_type: 5
        }),
        stock.list({
          order_id: this.$route.params.id
        })
      ]).then((res) => {
        this.order_info = res[0].data.data
        this.order_info.product_info = this.$mergeData(this.order_info.product_info, {
          mainRule: 'product_name',
          childrenName: 'child_data',
          otherRule: [{ name: 'product_id' }]
        })
        this.order_info.product_info.forEach((item: any) => {
          let processArr: any[] = []
          this.order_info.process_log?.forEach((itemProcess) => {
            itemProcess.child_data.forEach((itemChild: any) => {
              const copy = this.$clone(itemChild)
              copy.type = itemProcess.type
              processArr.push(copy)
            })
          })
          processArr = processArr.filter((itemFind) => itemFind.name === item.product_name)
          const processMerge = this.$mergeData(processArr, {
            mainRule: 'type',
            childrenName: 'child_data'
          })
          processMerge.forEach((itemChild: any) => {
            itemChild.total_weight = itemChild.child_data.reduce((total: number, current: any) => {
              return total + Number(current.weight)
            }, 0)
          })
          item.process_info = processMerge
        })
        this.deduct_list = res[1].data.data
        this.deduct_list.forEach((item: any) => {
          item.deduct_content = JSON.parse(item.deduct_content)
        })
        this.final_out_log = res[2].data.data.data.items.filter(
          (item: any) => Number(item.client_id) === Number(this.order_info.client_id)
        )
        console.log(this.final_out_log)
        this.loading = false
      })
    },
    // 打开扣款窗口
    openDeduct() {
      this.deduct_info = {
        yarn: this.order_info.product_info.map((item) => {
          return {
            value: item.product_name,
            label: item.product_name
          }
        }),
        pid: this.$route.params.id,
        pcode: this.order_info.order_code,
        type: 5
      }
      this.deduct_show = true
    },
    confirm() {
      this.$confirm('是否确认订单完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          check
            .confirm({
              pid: this.$route.params.id,
              complete_type: 5
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
    }
  },
  mounted() {
    this.init()
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/less/order/detail.less';
</style>
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
              :src="process_info.is_check|checkFilter" />
          </el-tooltip>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">加工单号：</span>
            <span class="text green">{{process_info.code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">加工单位：</span>
            <span class="text">{{process_info.client_name}}</span>
          </div>
          <div class="colCtn">
            <span class="label">加工总价：</span>
            <span class="text">{{process_info.total_price}}元</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">创建人：</span>
            <span class="text">{{process_info.user_name}}</span>
          </div>
          <div class="colCtn">
            <span class="label">下单日期：</span>
            <span class="text">{{process_info.order_time}}</span>
          </div>
          <div class="colCtn">
            <span class="label">交货日期：</span>
            <span class="text">{{process_info.delivery_time}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="min-width:796px">
            <span class="label">备注信息：</span>
            <span class="text">{{process_info.desc || '无'}}</span>
          </div>
          <div class="colCtn">
            <span class="label">入库数量：</span>
            <span class="text green">{{process_info.push_weight || 0}}kg</span>
          </div>
        </div>
        <div class="rowCtn"
          v-if="process_info.additional_fee.length>0">
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
                    v-for="(item,index) in process_info.additional_fee"
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
        <span class="title">纱线加工信息</span>
        <span class="addBtn btn btnMain"
          @click="openStore(6)">加工出库</span>
        <span class="addBtn btn btnMain"
          @click="openStore(5)">加工回库</span>
      </div>
      <div style="padding:20px 32px">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">纱线名称</div>
              <div class="tcolumn">加工信息</div>
              <div class="tcolumn">采购单价(元)</div>
              <div class="tcolumn">采购数量(kg)</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in process_info.child_data"
              :key="index">
              <div class="tcolumn">{{item.name}}</div>
              <div class="tcolumn">
                <span class="green"
                  style="margin-right:12px">{{process_info.type}}</span>
                <span v-if="process_info.type==='倒筒'">
                  {{item.before_attribute}}
                  <i class="el-icon-d-arrow-right"></i>
                  {{item.after_attribute}}
                </span>
                <span v-if="process_info.type==='染色'">
                  {{item.before_color}}
                  <i class="el-icon-d-arrow-right"></i>
                  {{item.after_color}}
                </span>
                <span v-if="process_info.type==='膨纱'">
                  {{item.color}}
                  /
                  {{item.attribute}}
                </span>
              </div>
              <div class="tcolumn">{{item.price}}元</div>
              <div class="tcolumn">{{item.weight}}kg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-show="process_store_log.length>0">
      <div class="titleCtn">
        <span class="title">纱线出入库信息</span>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="overflow">
            <div class="tableCtn">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">单号</div>
                    <div class="column min120">仓库</div>
                    <div class="column min120">操作类型</div>
                    <div class="column"
                      style="flex-direction:column">
                      <div class="row">
                        <div class="column min120">纱线名称</div>
                        <div class="column min120">纱线颜色</div>
                        <div class="column min120">纱线属性</div>
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
                    v-for="item in process_store_log"
                    :key="item.id">
                    <div class="column min120">{{item.code}}</div>
                    <div class="column min120">{{item.store_name}}/{{item.second_store_name}}</div>
                    <div class="column min120">操作类型</div>
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
                  <div class="column min120">单号</div>
                  <div class="column min120">仓库</div>
                  <div class="column min120">操作类型</div>
                </div>
              </div>
              <div class="bodyCtn">
                <div class="row"
                  v-for="item in process_store_log"
                  :key="item.id">
                  <div class="column min120 blue"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.code}}</div>
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.store_name}}/{{item.second_store_name}}</div>
                  <div class="column min120"
                    :class="{'blue':item.action_type===5,'green':item.action_type===6}"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.action_type===5?'回库':'出库'}}</div>
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
                  v-for="item in process_store_log"
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
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnOrange">打印</div>
          <div class="btn btnGreen"
            @click="openCheck">审核</div>
          <div class="btn btnBlue"
            @click="confirm"
            v-if="process_info.status!==3">确认完成</div>
        </div>
      </div>
    </div>
    <check :show.sync="check_flag"
      :pid="$route.params.id"
      @afterCheck="init"
      :checkType="2"
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
      :checkType="2"
      :pid="$route.params.id"></check-detail>
    <in-and-out :orderId="process_info.order_id"
      :relatedCode="process_info.code"
      :relatedId="process_info.id"
      :outClientArr="store_info.out_client_arr"
      :clientId="store_info.client_id"
      :show.sync="store_info.show"
      :type="store_info.type"
      @close="init"></in-and-out>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { yarnProcess, check, stock } from '@/assets/js/api'
import { ProcessYarn, ProcessYarnChild } from '@/types/orderProcessYarn'
export default Vue.extend({
  data(): {
    process_info: ProcessYarn
    [propName: string]: any
  } {
    return {
      check_flag: false,
      check_detail_flag: false,
      process_info: {
        order_id: '',
        client_id: '',
        type: '',
        price: '',
        desc: '',
        order_time: '',
        delivery_time: '',
        total_price: '',
        file_url: '',
        client_name: '',
        total_additional_fee: 0,
        additional_fee: [
          {
            name: '',
            price: '',
            desc: ''
          }
        ],
        child_data: [
          {
            name: '',
            before_attribute: '',
            after_attribute: '',
            before_color: '白胚',
            after_color: '',
            color: '',
            attribute: '',
            weight: ''
          }
        ]
      },
      store_info: {
        show: false,
        client_id: '',
        out_client_arr: [],
        type: 0
      },
      process_store_log: [],
      loading: false
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        yarnProcess.detail({
          id: this.$route.params.id
        }),
        stock.list({
          related_id: this.$route.params.id,
          action_type: [5, 6]
        })
      ]).then((res) => {
        this.process_info = res[0].data.data
        this.process_info.additional_fee = this.process_info.additional_fee
          ? JSON.parse(this.process_info.additional_fee as string)
          : []
        this.process_store_log = res[1].data.data.data.items
        this.process_info.child_data.forEach((item) => {
          item.push_weight = 0
          this.process_store_log.forEach((itemLog: any) => {
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
    openStore(type: number) {
      this.store_info = {
        show: true,
        type,
        client_id: this.process_info.client_id,
        out_client_arr: [
          {
            id: this.process_info.client_id,
            name: this.process_info.client_name
          }
        ]
      }
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
    this.init()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/directProcess/yarnDetail.less';
</style>
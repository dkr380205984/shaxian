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
          @click="openOrderIn">纱线入库</span>
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
              <div class="tcolumn">
                <el-checkbox v-model="item.check">{{item.name}}</el-checkbox>
              </div>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { yarnProcess } from '@/assets/js/api'
import { ProcessYarn } from '@/types/orderProcessYarn'
export default Vue.extend({
  data(): {
    process_info: ProcessYarn
    [propName: string]: any
  } {
    return {
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
      check_detail_flag: false,
      loading: false
    }
  },
  methods: {
    init() {
      Promise.all([
        yarnProcess.detail({
          id: this.$route.params.id
        })
      ]).then((res) => {
        this.process_info = res[0].data.data
        console.log(this.process_info)
        this.process_info.additional_fee = JSON.parse(this.process_info.additional_fee as string)
      })
    },
    checkReason() {
      if (!this.order_yarn_info.is_check) {
        this.$message.warning('暂无审核信息')
        return
      }
      this.check_detail_flag = true
    },
    openOrderIn() {
      // ..
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
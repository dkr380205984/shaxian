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
              :src="order_material_info.is_check|checkFilter" />
          </el-tooltip>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">采购单号：</span>
            <span class="text green">{{order_material_info.code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">采购单位：</span>
            <span class="text">{{order_material_info.client_name}}</span>
          </div>
          <div class="colCtn">
            <span class="label">采购总价：</span>
            <span class="text">{{order_material_info.total_price}}元</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">创建人：</span>
            <span class="text">{{order_material_info.user_name}}</span>
          </div>
          <div class="colCtn">
            <span class="label">下单日期：</span>
            <span class="text">{{order_material_info.order_time}}</span>
          </div>
          <div class="colCtn">
            <span class="label">交货日期：</span>
            <span class="text">{{order_material_info.delivery_time}}
              （<span :class="{'red':$diffByDate(order_material_info.delivery_time)<=0,'green':$diffByDate(order_material_info.delivery_time)>7,'yellow':$diffByDate(order_material_info.delivery_time)<=7 &&$diffByDate(order_material_info.delivery_time)>0 }">
                {{$diffByDate(order_material_info.delivery_time)>0?'交货还剩'+$diffByDate(order_material_info.delivery_time)+'天':'延期发货'+Math.abs($diffByDate(order_material_info.delivery_time))+'天'}}
              </span>）
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="min-width:796px">
            <span class="label">备注信息：</span>
            <span class="text">{{order_material_info.desc || '无'}}</span>
          </div>
          <div class="colCtn">
            <span class="label">入库数量：</span>
            <span class="text green">{{order_material_info.push_weight || 0}}kg</span>
          </div>
        </div>
        <div class="rowCtn"
          v-if="order_material_info.additional_fee.length>0">
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
                    v-for="(item,index) in order_material_info.additional_fee"
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
        <span class="title">毛条采购信息</span>
        <span class="addBtn btn btnMain"
          @click="openOrderIn">毛条入库</span>
      </div>
      <div style="padding:20px 32px">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">毛条名称</div>
              <div class="tcolumn">采购单价(元)</div>
              <div class="tcolumn">采购数量(kg)</div>
              <div class="tcolumn">入库数量(kg)</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in order_material_info.child_data"
              :key="index">
              <div class="tcolumn">
                <el-checkbox v-model="item.check">{{item.name}}</el-checkbox>
              </div>
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
        <span class="title">毛条入库信息</span>
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
                      style="flex:2;flex-direction:column">
                      <div class="row">
                        <div class="column min120">毛条名称</div>
                        <div class="column min120">入库数量</div>
                        <div class="column min120">入库件数</div>
                        <div class="column min120">入库批号</div>
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
                      style="flex:2;flex-direction:column">
                      <div class="row"
                        v-for="(itemChild,indexChild) in item.child_data"
                        :key="indexChild">
                        <div class="column min120">{{itemChild.name}}</div>
                        <div class="column min120 blue">{{itemChild.action_weight}}kg</div>
                        <div class="column min120">{{itemChild.item}}件</div>
                        <div class="column min120">{{itemChild.batch_code}}</div>
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
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.second_store_name}}</div>
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
                      @click="$openUrl(`/print/materialStore/1/${item.id}`)">打印</span>
                    <span class="red opr">删除</span>
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
              <div class="column">毛条信息</div>
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
          <div class="btn btnOrange"
            @click="$openUrl(`/print/orderMaterial/2/${$route.params.id}`)">打印</div>
          <div class="btn btnGreen"
            @click="openCheck">审核</div>
          <div class="btn btnRed"
            @click="openDeduct">扣款</div>
          <div class="btn btnBlue"
            @click="confirm"
            v-if="order_material_info.status!==3">确认完成</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="order_in_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">毛条入库</span>
          <i class="close_icon el-icon-close"
            @click="resetOrderIn"></i>
        </div>
        <div class="contentCtn">
          <div class="createCtn">
            <div style="background:#f0f0f0;padding:12px;margin:12px 0"
              v-for="(itemChild,indexChild) in order_in_info.child_data"
              :key="indexChild">
              <div class="rowCtn"
                style="background:#f0f0f0">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">毛条信息</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input disabled
                        placeholder="请输入毛条信息"
                        v-model="itemChild.name"></el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">采购数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input disabled
                        placeholder="请输入采购数量"
                        v-model="itemChild.order_number">
                        <template slot="append">kg</template>
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn"></div>
              </div>
              <div class="rowCtn"
                style="background:#f0f0f0">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">入库数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input placeholder="数量"
                        v-model="itemChild.action_weight">
                        <template slot="append">kg</template>
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">入库件数</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input placeholder="件数"
                        v-model="itemChild.item">
                        <template slot="append">件</template>
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">批号</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input placeholder="批号"
                        v-model="itemChild.batch_code">
                      </el-input>
                    </div>
                    <div class="oprCtn">
                      <div class="editBtn deleteBtn"
                        @click="$deleteItem(order_in_info.child_data,indexChild)">删除</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn">
                <div class="label">
                  <span class="text">入库仓库</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-cascader v-model="order_in_info.select_id"
                      :options="store_list"
                      :props="{value:'id',label:'name',children:'second_data'}"
                      placeholder="请选择入库仓库">
                    </el-cascader>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">入库时间</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-date-picker class="el"
                      style="width:100%"
                      v-model="order_in_info.date"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                    </el-date-picker>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">备注信息</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input placeholder="请输入备注信息"
                      v-model="order_in_info.desc"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="resetOrderIn">取消</div>
          <div class="opr blue"
            @click="saveOrderIn">确认入库</div>
        </div>
      </div>
    </div>
    <check :show.sync="check_flag"
      :pid="$route.params.id"
      @afterCheck="init"
      :checkType="3"
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
    <deduct :show.sync="deduct_show"
      :data="deduct_info"></deduct>
    <check-detail :show.sync="check_detail_flag"
      :checkType="3"
      :pid="$route.params.id"></check-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { StoreCreate } from '@/types/store'
import { OrderMaterialInfo } from '@/types/material'
import { stock, deduct, material, check } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    order_material_info: OrderMaterialInfo
    [propName: string]: any
  } {
    return {
      loading: true,
      deduct_show: false,
      check_flag: false,
      check_detail_flag: false,
      deduct_info: {
        yarn: [],
        pid: 1,
        pcode: '',
        type: 1
      },
      order_material_info: {
        code: '',
        client_id: '',
        is_check: '',
        total_price: '',
        child_data: [
          {
            name: '',
            weight: '',
            price: '',
            batch_code: ''
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
      order_in_info: {
        code: '',
        client_name: '',
        select_id: '',
        action_type: '',
        child_data: [],
        desc: '',
        date: this.$getDate(new Date())
      },
      deduct_list: [],
      order_in_log: [],
      order_in_flag: false
    }
  },
  computed: {
    checkList(): any {
      return this.order_material_info.child_data.filter((item: any) => item.check)
    },
    store_list() {
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 2)
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        material.orderDetail({
          id: this.$route.params.id
        }),
        stock.materialList({
          action_type: 3,
          related_id: this.$route.params.id
        }),
        deduct.list({
          pid: this.$route.params.id,
          deduct_type: 3
        })
      ]).then((res) => {
        this.order_material_info = res[0].data.data
        this.order_material_info.additional_fee = this.order_material_info.additional_fee
          ? JSON.parse(this.order_material_info.additional_fee as string)
          : []
        this.order_in_log = res[1].data.data.data.items
        this.order_material_info.child_data.forEach((item) => {
          item.push_weight = 0
          this.order_in_log.forEach((itemLog: any) => {
            itemLog.child_data.forEach((itemChild: any) => {
              if (itemChild.name === item.name) {
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
    resetOrderIn() {
      this.order_in_flag = false
    },
    openOrderIn() {
      if (this.checkList.length === 0) {
        this.$message.error('请选择至少一种毛条入库')
        return
      }
      this.order_in_info = {
        code: '',
        client_name: this.order_material_info.client_name,
        select_id: '',
        action_type: 3,
        child_data: this.checkList.map((item: any) => {
          return {
            yarn_name: item.name,
            name: item.name,
            order_number: item.weight,
            weight: '',
            item: '',
            price: ''
          }
        }),
        desc: '',
        date: this.$getDate(new Date())
      }
      this.order_in_flag = true
    },
    saveOrderIn() {
      // 数据验证
      if (
        this.$formCheck(this.order_in_info, [
          {
            key: 'select_id',
            errMsg: '请选择入库仓库'
          }
        ])
      ) {
        return
      }
      if (
        this.order_in_info.child_data.some((itemChild: any) => {
          return this.$formCheck(itemChild, [
            {
              key: 'action_weight',
              errMsg: '请输入入库重量'
            },
            {
              key: 'item',
              errMsg: '请输入入库件数'
            }
          ])
        })
      ) {
        return
      }
      this.loading = true
      // 数据验证结束
      const formData: StoreCreate = {
        order_id: '',
        related_id: this.$route.params.id, // 关联采购单id
        action_type: 3,
        complete_time: this.order_in_info.date,
        desc: this.order_in_info.desc,
        store_id: this.order_in_info.select_id[0],
        second_store_id: this.order_in_info.select_id[1],
        client_id: '',
        child_data: this.order_in_info.child_data.map((item: any) => {
          return {
            order_id: '',
            name: item.yarn_name,
            action_weight: item.action_weight,
            batch_code: item.batch_code || 'NOT_SET',
            item: item.item,
            related_info_id: '',
            desc: ''
          }
        })
      }
      stock.materialCreate({ data: [formData] }).then((res) => {
        if (res.data.status) {
          this.$message.success('入库成功')
          this.resetOrderIn()
          this.init()
        }
      })
    },
    checkReason() {
      if (!this.order_material_info.is_check) {
        this.$message.warning('暂无审核信息')
        return
      }
      this.check_detail_flag = true
    },
    // 打开扣款窗口
    openDeduct() {
      this.deduct_info = {
        yarn: this.order_material_info.child_data.map((item) => {
          return {
            value: item.name,
            label: item.name
          }
        }),
        pid: this.$route.params.id,
        pcode: this.order_material_info.code,
        type: 3
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
              complete_type: 3
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
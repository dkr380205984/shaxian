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
            <span class="text">{{order_yarn_info.delivery_time}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{order_yarn_info.desc || '无'}}</span>
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
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in order_yarn_info.child_data"
              :key="index">
              <div class="tcolumn">
                <el-checkbox v-model="item.check">{{item.name}}</el-checkbox>
              </div>
              <div class="tcolumn">{{item.color}}</div>
              <div class="tcolumn">{{item.attribute}}</div>
              <div class="tcolumn">{{item.price}}元</div>
              <div class="tcolumn">{{item.weight}}kg</div>
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
                      style="flex:4;flex-direction:column">
                      <div class="row">
                        <div class="column min120">纱线名称</div>
                        <div class="column min120">订购颜色</div>
                        <div class="column min120">订购属性</div>
                        <div class="column min120">入库数量</div>
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
                      style="flex:4;flex-direction:column">
                      <div class="row"
                        v-for="(itemChild,indexChild) in item.child_data"
                        :key="indexChild">
                        <div class="column min120">{{itemChild.name}}</div>
                        <div class="column min120">{{itemChild.color}}</div>
                        <div class="column min120">{{itemChild.attribute}}</div>
                        <div class="column min120 blue">{{itemChild.action_weight}}</div>
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
                    <span class="blue opr">打印</span>
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
          <div class="btn btnBlue">打印</div>
          <div class="btn btnGreen"
            @click="openCheck">审核</div>
          <div class="btn btnRed"
            @click="openDeduct">扣款</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="order_in_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">纱线入库</span>
          <i class="close_icon el-icon-close"
            @click="resetOrderIn"></i>
        </div>
        <div class="contentCtn">
          <div class="createCtn">
            <div class="rowCtn"
              v-for="(itemChild,indexChild) in order_in_info.child_data"
              :key="indexChild">
              <div class="colCtn">
                <div class="label"
                  v-if="indexChild===0">
                  <span class="text">纱线信息</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="请输入纱线信息"
                      v-model="itemChild.name"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label"
                  v-if="indexChild===0">
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
              <div class="colCtn">
                <div class="label"
                  v-if="indexChild===0">
                  <span class="text">入库数量/件数</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="content flexRow">
                  <div class="elCtn">
                    <el-input placeholder="数量"
                      v-model="itemChild.action_weight">
                    </el-input>
                  </div>
                  <div class="elCtn">
                    <el-input placeholder="件数"
                      v-model="itemChild.item">
                    </el-input>
                  </div>
                  <div class="oprCtn">
                    <div class="editBtn deleteBtn"
                      @click="$deleteItem(order_in_info.child_data,indexChild)">删除</div>
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
                  <span class="explanation">(必填)</span>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { StoreCreate } from '@/types/store'
import { OrderYarn } from '@/types/orderProcessYarn'
import { yarnOrder, stock, deduct } from '@/assets/js/api'
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
      return this.order_yarn_info.child_data.filter((item: any) => item.check)
    },
    store_list() {
      return this.$store.state.api.storeHouse.arr
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
          related_id: this.$route.params.id
        }),
        deduct.list({
          pid: this.$route.params.id,
          deduct_type: 1
        })
      ]).then((res) => {
        this.order_yarn_info = res[0].data.data
        this.order_yarn_info.additional_fee = JSON.parse(this.order_yarn_info.additional_fee as string)
        this.order_in_log = res[1].data.data.data.items
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
    resetOrderIn() {
      this.order_in_flag = false
    },
    openOrderIn() {
      console.log(this.checkList)
      if (this.checkList.length === 0) {
        this.$message.error('请选择至少一种纱线入库')
        return
      }
      this.order_in_info = {
        code: '',
        client_name: this.order_yarn_info.client_name,
        select_id: '',
        action_type: 3,
        child_data: this.checkList.map((item: any) => {
          return {
            yarn_name: item.name,
            name: item.name + '/' + item.color + '/' + item.attribute,
            order_number: item.weight,
            weight: '',
            color: item.color,
            attribute: item.attribute,
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
            color: item.color,
            attribute: item.attribute,
            color_code: 'NOT_SET',
            vat_code: 'NOT_SET',
            item: item.item,
            related_info_id: '',
            desc: ''
          }
        })
      }
      stock.create({ data: [formData] }).then((res) => {
        if (res.data.status) {
          this.$message.success('入库成功')
          this.resetOrderIn()
          this.init()
        }
      })
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
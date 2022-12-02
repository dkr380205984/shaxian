<template>
  <div class="indexMain" id="yarnDetail" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="checkCtn">
          <el-tooltip class="item" effect="dark" content="点击查看审核日志" placement="bottom">
            <img @click="checkReason" :src="order_yarn_info.is_check | checkFilter" />
          </el-tooltip>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">采购单号：</span>
            <span class="text green">{{ order_yarn_info.code }}</span>
          </div>
          <div class="colCtn">
            <span class="label">采购单位：</span>
            <span class="text">{{ order_yarn_info.client_name }}</span>
          </div>
          <div class="colCtn">
            <span class="label">采购总价：</span>
            <span class="text">
              <span class="text">计划：{{ order_yarn_info.total_price }}元</span>
              <br/>
              <span class="text">实际：{{ (+order_yarn_info.total_push_price + +order_yarn_info.total_additional_fee).toFixed(2)}}元</span>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">创建人：</span>
            <span class="text">{{ order_yarn_info.user_name }}</span>
          </div>
          <div class="colCtn">
            <span class="label">下单日期：</span>
            <span class="text">{{ order_yarn_info.order_time }}</span>
          </div>
          <div class="colCtn">
            <span class="label">交货日期：</span>
            <span class="text"
              >{{ order_yarn_info.delivery_time }} （<span
                :class="{
                  red: $diffByDate(order_yarn_info.delivery_time) <= 0,
                  green: $diffByDate(order_yarn_info.delivery_time) > 7,
                  yellow:
                    $diffByDate(order_yarn_info.delivery_time) <= 7 && $diffByDate(order_yarn_info.delivery_time) > 0
                }"
              >
                {{
                  $diffByDate(order_yarn_info.delivery_time) > 0
                    ? '交货还剩' + $diffByDate(order_yarn_info.delivery_time) + '天'
                    : '延期发货' + Math.abs($diffByDate(order_yarn_info.delivery_time)) + '天'
                }} </span
              >）
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{ order_yarn_info.desc || '无' }}</span>
          </div>
          <div class="colCtn">
            <span class="label">单据状态：</span>
            <span
              class="text"
              :class="{
                orange: order_yarn_info.status === 1,
                blue: order_yarn_info.status === 2,
                green: order_yarn_info.status === 3,
                gray: order_yarn_info.status === 4
              }"
              >{{ order_yarn_info.status | orderStatusFilter }}</span
            >
          </div>
          <div class="colCtn">
            <span class="label">已入库数量：</span>
            <span class="text green" style="padding-left: 10px">{{ order_yarn_info.push_weight || 0 }}kg</span>
          </div>
        </div>
        <div class="rowCtn" v-if="order_yarn_info.additional_fee.length > 0">
          <div class="colCtn">
            <span class="label">额外费用：</span>
            <div class="text">
              <div class="tableCtn" style="margin-top: 6px">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn">额外费用名称</div>
                    <div class="tcolumn">额外费用金额</div>
                    <div class="tcolumn">额外费用备注</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow" v-for="(item, index) in order_yarn_info.additional_fee" :key="index">
                    <div class="tcolumn">{{ item.name || '无'}}</div>
                    <div class="tcolumn">{{ item.price }}元</div>
                    <div class="tcolumn">{{ item.desc || '无' }}</div>
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
        <span class="addBtn btn btnMain" @click="openOrderIn">纱线入库</span>
      </div>
      <div style="padding: 20px 32px">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">纱线名称</div>
              <div class="tcolumn">纱线颜色</div>
              <div class="tcolumn">纱线属性</div>
              <div class="tcolumn">采购单价(元)</div>
              <div class="tcolumn">计划采购数量(kg)</div>
              <div class="tcolumn">已入库数量(kg)</div>
              <div class="tcolumn">待入库数量(kg)</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow" v-for="(item, index) in order_yarn_info.child_data" :key="index">
              <div class="tcolumn">{{ item.name }}</div>
              <div class="tcolumn">{{ item.color }}</div>
              <div class="tcolumn">{{ item.attribute }}</div>
              <div class="tcolumn">{{ item.price }}元</div>
              <div class="tcolumn blue">{{ item.weight }}kg</div>
              <div class="tcolumn green">{{ item.push_weight }}kg</div>
              <div class="tcolumn red">{{ item.weight - item.push_weight }}kg</div>
            </div>
            <div class="trow" style="background:#F4F4F4;">
              <div class="tcolumn">合计</div>
              <div class="tcolumn"></div>
              <div class="tcolumn"></div>
              <div class="tcolumn">
                <div>计划:{{(+order_yarn_info.total_price - +order_yarn_info.total_additional_fee).toFixed(2)}} 元</div>
                <div class="green">实际:{{ order_yarn_info.total_push_price }} 元</div>
              </div>
              <div class="tcolumn blue">{{ (order_yarn_info.total_weight || 0).toFixed(1) }}kg</div>
              <div class="tcolumn green">{{ order_yarn_info.push_weight }} kg</div>
              <div class="tcolumn red">{{ order_yarn_info.total_weight - order_yarn_info.push_weight }}kg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module" v-show="order_in_log.length > 0">
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
                    <div class="column" style="flex-direction: column">
                      <div class="row">
                        <div class="column min120">纱线名称</div>
                        <div class="column min120">订购颜色</div>
                        <div class="column min120">订购属性</div>
                        <div class="column min120">所属客户</div>
                        <div class="column min120">已入库数量</div>
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
                  <div class="row" v-for="item in order_in_log" :key="item.id">
                    <div class="column min120">{{ item.code }}</div>
                    <div class="column min120">{{ item.store_name }}/{{ item.second_store_name }}</div>
                    <div class="column" style="flex-direction: column">
                      <div class="row" v-for="(itemChild, indexChild) in item.child_data" :key="indexChild">
                        <div class="column min120">{{ itemChild.name }}</div>
                        <div class="column min120">{{ itemChild.color }}</div>
                        <div class="column min120">{{ itemChild.attribute }}</div>
                        <div class="column min120">{{ itemChild.store_client_name }}</div>
                        <div class="column min120 blue">{{ itemChild.action_weight }}</div>
                        <div class="column min120">{{ itemChild.batch_code }}</div>
                        <div class="column min120">{{ itemChild.color_code }}</div>
                        <div class="column min120">{{ itemChild.vat_code }}</div>
                      </div>
                    </div>
                    <div class="column min120">{{ item.desc || '无' }}</div>
                    <div class="column min120">{{ item.complete_time }}</div>
                    <div class="column min120">{{ item.user_name }}</div>
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
                <div class="row" v-for="item in order_in_log" :key="item.id">
                  <div class="column min120 blue" :style="{ height: 50 * item.child_data.length + 'px' }">
                    {{ item.code }}
                  </div>
                  <div class="column min120" :style="{ height: 50 * item.child_data.length + 'px' }">
                    {{ item.store_name }}/{{ item.second_store_name }}
                  </div>
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
                <div class="row" v-for="item in order_in_log" :key="item.id">
                  <div class="column min120" :style="{ height: 50 * item.child_data.length + 'px' }">
                    <span class="blue opr" @click="$openUrl(`/print/store/1/${item.id}`)">打印</span>
                    <span class="red opr" @click="deleteLog(item.id)">删除</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module" v-show="deduct_list.length > 0">
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
            <div class="row" v-for="item in deduct_list" :key="item.id">
              <div class="column blue">{{ item.code }}</div>
              <div class="column">
                <div class="sortContainer" v-if="item.deduct_content.length > 0">
                  <div class="sort">
                    <i class="el-icon-caret-top hover" @click="changeIndex(item, 'add')"></i>
                    <div class="number">{{ (item.index || 0) + 1 }}/{{ item.deduct_content.length }}</div>
                    <i class="el-icon-caret-bottom hover" @click="changeIndex(item, 'delete')"></i>
                  </div>
                  <span>{{ item.deduct_content[item.index || 0].yarn }}</span>
                </div>
                <div class="gray" v-else>暂无纱线</div>
              </div>
              <div class="column">
                <template v-if="item.deduct_content.length.length > 0"
                  >{{ item.deduct_content[item.index || 0].price }}元</template
                >
                <div class="gray" v-else>暂无单价</div>
              </div>
              <div class="column">
                <el-image
                  style="width: 50px; height: 50px; line-height: 50px; text-align: center; font-size: 22px"
                  :src="item.deduct_file"
                  :preview-src-list="[item.deduct_file]"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
              <div class="column red">{{ item.total_price }}元</div>
              <div class="column">{{ item.desc }}</div>
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
          <div class="btn btnGray" @click="$router.go(-1)">返回</div>
          <div v-if="order_yarn_info.status !== 4" class="buttonList" style="margin-left: 12px">
            <div class="showButton">
              <i class="el-icon-s-grid"></i>
              <span class="text">采购单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="button btnGreen" @click="openCheck">
                  <i class="iconfont">&#xe638;</i>
                  <span class="text">单据审核</span>
                </div>
                <div class="button btnRed" @click="openDeduct">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">单据扣款</span>
                </div>
                <div class="button btnBlue" @click="confirm" v-if="order_yarn_info.status !== 3">
                  <i class="iconfont">&#xe636;</i>
                  <span class="text">确认完成</span>
                </div>
                <div class="button btnBlack" @click="openCancel">
                  <i class="el-icon-circle-close"></i>
                  <span class="text">取消采购</span>
                </div>
                <div class="button btnBlue" @click="$openUrl(`/print/orderYarn/2/${$route.params.id}`)">
                  <i class="el-icon-printer"></i>
                  <span class="text">打印单据</span>
                </div>
                <div class="button btnRed" @click="deleteThis">
                  <i class="el-icon-delete"></i>
                  <span class="text">删除单据</span>
                </div>
                <div class="button btnOrange" @click="showAddPO = true">
                  <i class="el-icon-edit"></i>
                  <span class="text">修改单据</span>
                </div>
              </div>
            </div>
          </div>
          <el-tooltip v-if="order_yarn_info.status === 4" class="item" effect="dark" placement="top">
            <div slot="content">
              取消原因：{{ cancel_reason }}
              <br />
              取消日期：{{ cancel_date }}
              <br />
              操作人：{{ user_name }}
              <br />
              对方承担：{{ client_fee || 0 }}元
            </div>
            <div class="btn btnWhiteRed">采购单已取消</div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <deduct :show.sync="deduct_show" :data="deduct_info"></deduct>
    <check
      :show.sync="check_flag"
      :pid="$route.params.id"
      @afterCheck="init"
      :checkType="1"
      :checkList="[
        {
          value: '费用问题',
          label: '费用问题'
        },
        {
          value: '质量问题',
          label: '质量问题'
        },
        {
          value: '产品问题',
          label: '产品问题'
        },
        {
          value: '交期问题',
          label: '交期问题'
        },
        {
          value: '数量问题',
          label: '数量问题'
        }
      ]"
    ></check>
    <check-detail :show.sync="check_detail_flag" :checkType="1" :pid="$route.params.id"></check-detail>
    <in-and-out
      :relatedCode="order_yarn_info.code"
      :relatedId="$route.params.id"
      :yarnArr="store_info.yarn_arr"
      :outClientArr="store_info.out_client_arr"
      :clientId="store_info.client_id"
      :show.sync="store_info.show"
      :type="store_info.type"
      @close="init"
    ></in-and-out>
    <div class="popup" v-show="cancel_flag">
      <div class="main">
        <div class="titleCtn">
          <div class="text">取消采购单</div>
          <i class="el-icon-close" @click="cancel_flag = false"></i>
        </div>
        <div class="contentCtn">
          <div class="stepCtn">
            <div class="step" :class="{ now: cancel_step === 2, confirm: cancel_step > 2 }">
              <div class="circle">1</div>
              <div class="info">取消原因</div>
            </div>
            <div class="line"></div>
            <div class="step" :class="{ now: cancel_step === 3, confirm: cancel_step > 3 }">
              <div class="circle">2</div>
              <div class="info">确认取消</div>
            </div>
          </div>
          <template v-if="cancel_step === 2">
            <div class="createCtn">
              <div class="rowCtn">
                <div class="colCtn" style="margin-right: 0">
                  <div class="label">
                    <span class="text">取消原因</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input placeholder="请输入取消原因" v-model="cancel_info.cancel_reason"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rowCtn">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">采购金额</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input placeholder="采购总额" v-model="order_yarn_info.total_price" disabled>
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn" style="margin-right: 0">
                  <div class="label">
                    <span class="text">客户承担金额</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input placeholder="客户承担金额" v-model="cancel_info.client_fee">
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rowCtn">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">文件说明</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <div class="info">
                        <el-upload
                          class="upload"
                          action="https://upload.qiniup.com/"
                          accept="image/jpeg,image/gif,image/png,image/bmp"
                          :before-upload="beforeAvatarUpload"
                          :multiple="false"
                          :data="postData"
                          :limit="1"
                          :on-success="successFile"
                          ref="uploada"
                          list-type="picture"
                        >
                          <div class="uploadBtn">
                            <i class="el-icon-upload"></i>
                            <span>上传文件</span>
                          </div>
                          <div slot="tip" class="el-upload__tip">只能上传一张jpg/png图片文件，且不超过10M</div>
                        </el-upload>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="colCtn" style="margin-right: 0">
                  <div class="label">
                    <span class="text">取消日期</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-date-picker
                        class="el"
                        v-model="cancel_info.cancel_date"
                        style="width: 100%"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-if="cancel_step === 3">
            <div class="msgCtn">
              <p class="msg">注意：</p>
              <p class="msg">1. 点击完成后，该订单状态将切换为已取消，且状态不能复原。</p>
              <p class="msg">2. 相关库存将更新已结余入库的纱线数据。</p>
              <p class="msg">
                3. 客户财务统计将扣除客户未承担的部分：{{
                  parseInt(order_yarn_info.total_price - cancel_info.client_fee)
                }}元。
              </p>
            </div>
          </template>
        </div>
        <div class="oprCtn">
          <div class="opr" @click="cancel_flag = false">取消</div>
          <div class="opr orange" @click="cancel_step--" v-if="cancel_step > 2">上一步</div>
          <div class="opr blue" @click="cancel_step === 3 ? cancelOrder() : cancel_step++">
            {{ cancel_step === 3 ? '确认取消' : '下一步' }}
          </div>
        </div>
      </div>
    </div>
    <shaxianAddPO
      :show="showAddPO"
      :update="true"
      @close="showAddPO = false"
      :info="order_yarn_info"
      @afterCreate="init"
    ></shaxianAddPO>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CancelOrder } from '@/types/order'
import { OrderYarn } from '@/types/orderProcessYarn'
import { yarnOrder, stock, deduct, check } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    cancel_info: CancelOrder
    order_yarn_info: OrderYarn
    [propName: string]: any
  } {
    return {
      loading: true,
      showAddPO: false,
      postData: { key: '', token: '' },
      cancel_date: '',
      cancel_reason: '',
      client_fee: '',
      user_name: '',
      cancel_flag: false,
      cancel_info: {
        order_id: '',
        cancel_reason: '',
        cancel_date: this.$getDate(new Date()),
        file: '',
        client_fee: '',
        document_type: 1,
        deduct_data: {
          deduct_content: '',
          total_price: '',
          deduct_type: 1,
          pid: '',
          date: '',
          deduct_file: '',
          client_id: '',
          desc: ''
        }
      },
      store_data: [],
      cancel_step: 2,
      check_flag: false,
      check_detail_flag: false,
      deduct_show: false,
      deduct_info: {
        yarn: [],
        pid: 1,
        pcode: '',
        type: 2
      },
      order_yarn_info: {
        code: '',
        is_check: '',
        client_id: '',
        total_price: '',
        total_additional_fee: 0,
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
    },
    token() {
      return this.$store.state.status.token
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
        }),
        yarnOrder.cancelDetail({
          pid: this.$route.params.id,
          document_type: 1
        })
      ]).then((res) => {
        this.order_yarn_info = res[0].data.data
        this.order_yarn_info.additional_fee = this.order_yarn_info.additional_fee
          ? JSON.parse(this.order_yarn_info.additional_fee as string)
          : []
        this.order_yarn_info.total_weight = this.order_yarn_info.child_data.reduce((total, current) => {
          return total + Number(current.weight)
        }, 0)
        this.order_yarn_info.total_push_price = this.order_yarn_info.child_data.reduce((total, current) => {
          return total + Number(current.push_price)
        }, 0).toFixed(2)
        this.order_yarn_info.total_push_weight = this.order_yarn_info.child_data.reduce((total, current) => {
          return total + Number(current.push_weight)
        }, 0)
        this.order_in_log = res[1].data.data.items
        this.deduct_list = res[2].data.data
        this.deduct_list.forEach((item: any) => {
          item.deduct_content = JSON.parse(item.deduct_content) || []
        })
        if (this.order_yarn_info.status === 4) {
          this.cancel_reason = res[3].data.data.cancel_reason
          this.cancel_date = res[3].data.data.cancel_date
          this.client_fee = res[3].data.data.client_fee
          this.user_name = res[3].data.data.user_name
        }
        this.loading = false
      })
    },
    // 删除单据
    deleteThis() {
      this.$confirm('是否删除该订购单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          yarnOrder
            .delete({
              id: this.$route.params.id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('删除成功')
                this.$router.push('/directOrder/yarnList?page=1&code=&name=&client_id=&user_id=&page_size=10&date=')
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
    // 打开取消订单窗口
    openCancel() {
      this.cancel_flag = true
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
      this.cancel_order_info.file = 'https://file.zwyknit.com/' + response.key
    },
    // 取消采购
    cancelOrder() {
      const fromData: CancelOrder = {
        pid: this.$route.params.id,
        document_type: 1,
        order_id: this.$route.params.id,
        cancel_reason: this.cancel_info.cancel_reason,
        cancel_date: this.cancel_info.cancel_date,
        file: this.cancel_info.file,
        client_fee: this.cancel_info.client_fee,
        store_data: [],
        deduct_data: {
          deduct_content: '',
          total_price: (Number(this.order_yarn_info.total_price) - Number(this.cancel_info.client_fee)).toFixed(1),
          deduct_type: 1,
          pid: this.$route.params.id,
          date: this.cancel_info.cancel_date,
          deduct_file: this.cancel_info.file,
          client_id: this.order_yarn_info.client_id,
          desc: this.cancel_info.cancel_reason ? this.cancel_info.cancel_reason : '取消采购单扣款'
        }
      }
      yarnOrder.cancel(fromData).then((res) => {
        if (res.data.status) {
          this.$message.success('采购单已取消')
          this.cancel_flag = false
          this.init()
        }
      })
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/storeHouse',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getStoreAsync'
      },
      {
        checkWhich: 'status/token',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getTokenAsync'
      }
    ])
    this.init()
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/less/directOrder/yarnDetail.less';
</style>
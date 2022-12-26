<template>
  <div class="indexMain" id="yarnDetail" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">调取单信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">调取单号：</span>
            <span class="text green">{{ process_info.code }}</span>
          </div>
          <div class="colCtn">
            <span class="label">创建人：</span>
            <span class="text">{{ process_info.user_name }}</span>
          </div>
          <div class="colCtn">
            <span class="label">创建日期：</span>
            <span class="text">{{ $getDate(process_info.create_time) }}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">加工总数：</span>
            <span class="text">{{ process_info.total_weight }}</span>
          </div>
          <div class="colCtn">
            <span class="label">加工总价：</span>
            <span class="text">{{ process_info.all_total_price }}</span>
          </div>
          <div class="colCtn">
            <span class="label"></span>
            <span class="text"></span>
          </div>
        </div>
        <div style="padding: 0 32px">
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">调取仓库</div>
                <div class="tcolumn">纱线名</div>
                <div class="tcolumn">颜色</div>
                <div class="tcolumn">纱线属性</div>
                <div class="tcolumn">所属客户</div>
                <div class="tcolumn">批号</div>
                <div class="tcolumn">色号</div>
                <div class="tcolumn">缸号</div>
                <div class="tcolumn">调取数量(kg)</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow" v-for="(item, index) in process_info.child_data" :key="index">
                <div class="tcolumn">{{ process_info.store_name }} / {{ process_info.second_store_name }}</div>
                <div class="tcolumn">{{ item.name }}</div>
                <div class="tcolumn">{{ item.color }}</div>
                <div class="tcolumn">{{ item.attribute }}</div>
                <div class="tcolumn">{{ item.store_client_name || '无' }}</div>
                <div class="tcolumn">{{ item.batch_code || '无' }}</div>
                <div class="tcolumn">{{ item.color_code || '无' }}</div>
                <div class="tcolumn">{{ item.vat_code || '无' }}</div>
                <div class="tcolumn">{{ item.action_weight }}kg</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <el-tabs type="border-card" v-model="materialOrderIndex">
        <el-tab-pane v-for="(item, index) in process_info.process_info" :key="index" :name="item.id.toString()">
          <div slot="label">
            <div style="display: flex; flex-direction: column">
              <div style="line-height: 20px; font-size: 14px">加工单{{ index + 1 }}</div>
              <div style="line-height: 20px; font-size: 14px">{{ item.code }} - {{ item.type }}</div>
            </div>
          </div>
          <div class="titleCtn" style="padding: 0 17px">
            <span class="title">基本信息</span>
            <span style="margin-left: 20px; color: #999">注：加工单操作仅针对当前选中加工单</span>
          </div>
          <div class="detailCtn" style="padding-bottom: 0">
            <div class="rowCtn">
              <div class="colCtn">
                <span class="label">加工单号：</span>
                <span class="text green">{{ item.code }}</span>
              </div>
              <div class="colCtn">
                <span class="label">加工单位：</span>
                <span class="text">{{ item.client_name }}</span>
              </div>
              <div class="colCtn">
                <span class="label">单据状态：</span>
                <span class="text">
                  <span
                    :class="{
                      orange: !item.is_check,
                      green: item.is_check === 1,
                      red: item.is_check === 2
                    }"
                  >
                    {{ item.is_check | orderCheckFilter }}
                  </span>
                </span>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn">
                <span class="label">下单日期：</span>
                <span class="text">{{ $getDate(item.create_time) }}</span>
              </div>
              <div class="colCtn">
                <span class="label">交货日期：</span>
                <span class="text">{{ item.delivery_time }}</span>
              </div>
              <div class="colCtn flex3">
                <span class="label">结算方式：</span>
                <span class="text">{{ item.settle_type }}</span>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn">
                <span class="label">备注信息：</span>
                <span class="text">{{ item.desc || '无' }}</span>
              </div>
              <div class="colCtn">
                <span class="label"></span>
                <span class="text"></span>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn">
                <span class="label">补充说明：</span>
                <div class="text">
                  <el-image
                    style="width: 50px; height: 50px; line-height: 50px; text-align: center; font-size: 22px"
                    :src="item.file_url"
                    :preview-src-list="[item.file_url]"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
              </div>
            </div>
            <div style="padding: 10px 32px">
              <div class="tableCtn" style="margin-top: 6px">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn">额外费用</div>
                    <div class="tcolumn">我方扣款金额</div>
                    <div class="tcolumn">加工数量</div>
                    <div class="tcolumn">实际回库数量</div>
                    <div class="tcolumn">计划总额（含额外、扣款）</div>
                    <div class="tcolumn">实际总额（含额外、扣款）</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow">
                    <div class="tcolumn">{{ $toFixed(item.addFeePrice, 2, true) }} 元</div>
                    <div class="tcolumn red">{{ $toFixed(item.total_deduct_price, 2, true) }} 元</div>
                    <div class="tcolumn blue">{{ $toFixed(item.total_weight || 0, 1, true) }} kg</div>
                    <div class="tcolumn green">{{ $toFixed(item.total_real_number || 0, 1, true) }} kg</div>
                    <div class="tcolumn">
                      {{ $toFixed(+item.total_price + +item.total_deduct_price || 0, 2, true) }}
                      元
                    </div>
                    <div class="tcolumn green">
                      {{
                        $toFixed(+item.total_real_price + +item.addFeePrice + +item.total_deduct_price || 0, 2, true)
                      }}
                      元
                    </div>
                  </div>
                  <div class="trow">
                    <div class="tcolumn" style="margin: unset">
                      <othersFeeData :data="item.additional_fee"></othersFeeData>
                    </div>
                    <div class="tcolumn gray">详情见下表</div>
                    <div class="tcolumn gray">详情见下表</div>
                    <div class="tcolumn gray">详情见下表</div>
                    <div class="tcolumn gray">详情见下表</div>
                    <div class="tcolumn gray">详情见下表</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="titleCtn" style="padding: 0 17px">
            <span class="title">纱线加工信息</span>
          </div>
          <div style="padding: 0 32px">
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">纱线名称</div>
                  <div class="tcolumn">加工信息</div>
                  <div class="tcolumn">加工单价(元)</div>
                  <div class="tcolumn">加工数量(kg)</div>
                  <div class="tcolumn">金额小计(元)</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow" v-for="(itemPro, index) in item.child_data" :key="index + '纱线层级'">
                  <div class="tcolumn">{{ itemPro.name }}</div>
                  <div class="tcolumn">
                    <span class="green" style="margin-right: 12px">{{ item.type }}</span>
                    <span v-if="item.type === '倒筒'">
                      {{ itemPro.before_attribute }}
                      <i class="el-icon-right"></i>
                      {{ itemPro.after_attribute }}
                    </span>
                    <span v-if="item.type === '染色'">
                      {{ itemPro.before_color }}
                      <i class="el-icon-right"></i>
                      {{ itemPro.after_color }}
                    </span>
                    <span v-if="item.type === '膨纱'">
                      {{ itemPro.color }}
                      <i class="el-icon-right"></i>
                      {{ itemPro.attribute }}
                    </span>
                  </div>
                  <div class="tcolumn">{{ itemPro.price }}元</div>
                  <div class="tcolumn">{{ itemPro.weight }}kg</div>
                  <div class="tcolumn">{{ (itemPro.price * itemPro.weight).toFixed(2) }}元</div>
                </div>
              </div>
            </div>
          </div>
          <div class="titleCtn" v-if="item.deduct.length > 0">
            <span class="title">扣款信息</span>
          </div>
          <div class="listCtn" v-if="item.deduct.length > 0">
            <div class="list">
              <div class="headCtn">
                <div class="row">
                  <div class="column">扣款单号</div>
                  <div class="column">扣款总额</div>
                  <div class="column">图片说明</div>
                  <div class="column">备注信息</div>
                  <div class="column">日期</div>
                  <div class="column">操作</div>
                </div>
              </div>
              <div class="bodyCtn">
                <div class="row" v-for="itemDeduct in item.deduct" :key="itemDeduct.id + '扣款'">
                  <div class="column blue">{{ itemDeduct.code }}</div>
                  <div class="column red">{{ itemDeduct.total_price }}元</div>
                  <div class="column">
                    <el-image
                      style="width: 50px; height: 50px; line-height: 50px; text-align: center; font-size: 22px"
                      :src="itemDeduct.deduct_file"
                      :preview-src-list="[itemDeduct.deduct_file]"
                    >
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                  </div>
                  <div class="column">{{ itemDeduct.desc }}</div>
                  <div class="column">{{ itemDeduct.date }}</div>
                  <div class="column">
                    <div class="opr blue" @click="$openUrl('/print/deductPrint?id=' + itemDeduct.id)">打印</div>
                    <div class="opr red" @click="deleteLog('扣款', item.id)">删除</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray" @click="$router.go(-1)">返回</div>
          <div class="btnBlue btn" @click="openStore(17)">加工回库</div>
          <div class="buttonList" style="margin-left: 12px" v-if="process_info.status !== 4">
            <div class="showButton">
              <i class="el-icon-s-grid"></i>
              <span class="text">加工单操作</span>
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
                <div class="button btnRed" @click="deleteAdd">
                  <i class="iconfont">&#xe639;</i>
                  <span class="text">删除加工单</span>
                </div>
                <div class="button btnBlue" @click="confirm" v-if="process_info.status !== 3">
                  <i class="iconfont">&#xe636;</i>
                  <span class="text">确认完成</span>
                </div>
                <div class="button btnBlack" @click="openCancel">
                  <i class="el-icon-circle-close"></i>
                  <span class="text">取消加工</span>
                </div>
                <div class="button btnBlue" @click="$openUrl(`/print/processPrint?id=${materialOrderIndex}`)">
                  <i class="el-icon-printer"></i>
                  <span class="text">打印出库单</span>
                </div>
                <div class="button btnBlue" @click="$openUrl(`/print/processBaoRan?id=${materialOrderIndex}`)">
                  <i class="el-icon-printer"></i>
                  <span class="text">打印报染单</span>
                </div>
              </div>
            </div>
          </div>
          <el-tooltip v-if="process_info.status === 4" class="item" effect="dark" placement="top">
            <div slot="content">
              取消原因：{{ cancel_reason }}
              <br />
              取消日期：{{ cancel_date }}
              <br />
              操作人：{{ user_name }}
              <br />
              对方承担：{{ client_fee || 0 }}元
            </div>
            <div class="btn btnWhiteRed">加工单已取消</div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <check
      :show.sync="check_flag"
      :pid="materialOrderIndex"
      @afterCheck="init"
      :checkType="2"
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
    <deduct :show.sync="deduct_show" :data="deduct_info"></deduct>
    <check-detail :show.sync="check_detail_flag" :checkType="2" :pid="materialOrderIndex"></check-detail>
    <in-and-out
      :orderId="process_info.order_id"
      :relatedCode="process_info.code"
      :relatedId="process_info.id"
      :outClientArr="store_info.out_client_arr"
      :show.sync="store_info.show"
      :type="store_info.type"
      @close="init"
    ></in-and-out>
    <div class="popup" v-show="cancel_flag">
      <div class="main">
        <div class="titleCtn">
          <div class="text">取消加工单</div>
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
                    <span class="text">加工金额</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input placeholder="加工总额" v-model="process_info.total_price" disabled>
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
                  parseInt(process_info.total_price - cancel_info.client_fee)
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CancelOrder } from '@/types/order'
import { yarnProcess, check, stock, bill, collection, deduct } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    cancel_info: CancelOrder
    [propName: string]: any
  } {
    return {
      postData: { key: '', token: '' },
      cancel_flag: false,
      checkAll: false,
      materialOrderIndex: '',
      cancel_date: '',
      cancel_reason: '',
      client_fee: '',
      user_name: '',
      cancel_info: {
        pid: '',
        document_type: 2,
        order_id: '',
        cancel_reason: '',
        cancel_date: this.$getDate(new Date()),
        file: '',
        client_fee: '',
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
        out_client_arr: [],
        storeId: [],
        type: 0
      },
      process_store_log: [],
      loading: false
    }
  },
  methods: {
    deleteLog(type: string, id: number) {
      this.$confirm('是否删除该扣款单据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (type === '开票') {
            bill
              .delete({
                id
              })
              .then((res) => {
                if (res.data.status) {
                  this.$message.success('删除成功')
                }
                this.loading = false
              })
          } else if (type === '收款') {
            collection
              .delete({
                id
              })
              .then((res) => {
                if (res.data.status) {
                  this.$message.success('删除成功')
                }
                this.loading = false
              })
          } else {
            deduct
              .delete({
                id
              })
              .then((res) => {
                if (res.data.status) {
                  this.$message.success('删除成功')
                }
                this.loading = false
              })
          }

          this.init()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    init() {
      this.loading = true
      Promise.all([
        stock.detail({
          id: Number(this.$route.params.id)
        }),
        stock.list({
          related_id: this.$route.params.id,
          action_type: [5, 6]
        }),
        yarnProcess.cancelDetail({
          pid: this.$route.params.id,
          document_type: 2
        })
      ]).then((res) => {
        this.process_info = res[0].data.data
        // 计算每个的重量 以及 顺路对额外金额和扣款金额和入库数量进行处理
        this.process_info.process_info.forEach((item: any) => {
          item.total_weight = item.child_data
            .reduce((a: any, b: any) => {
              return a + (Number(b.weight) || 0)
            }, 0)
            .toFixed(1)

          item.push_weight = item.child_data.reduce((a: any, b: any) => {
            return (
              a +
              b.transfer_log_info.transfer_push.reduce((a1: any, b1: any) => {
                return a1 + (Number(b1.action_weight) || 0)
              }, 0)
            )
          }, 0)

          item.additional_fee = item.additional_fee ? JSON.parse(item.additional_fee as string) : []
          item.addFeePrice = item.additional_fee.reduce((a: any, b: any) => {
            return a + (Number(b.price) || 0)
          }, 0)

          item.total_deduct_price = item.deduct.reduce((total: any, current: any) => {
            return total + Number(current.total_price)
          }, 0)
        })
        // 算总重量
        this.process_info.total_weight = this.process_info.process_info
          .reduce((a: any, b: any) => {
            return (
              a +
              b.child_data.reduce((a1: any, b1: any) => {
                return a1 + (Number(b1.weight) || 0)
              }, 0)
            )
          }, 0)
          .toFixed(1)
        // 算不含额外金额的总价
        this.process_info.total_price = this.process_info.process_info
          .reduce((a: any, b: any) => {
            return (
              a +
              b.child_data.reduce((a1: any, b1: any) => {
                return a1 + (Number(b1.price) * Number(b1.weight) || 0)
              }, 0)
            )
          }, 0)
          .toFixed(2)
        // 对额外金额进行处理
        // this.process_info.process_info.forEach((itemPro: any) => {})
        // 算含额外金额的总价
        this.process_info.all_total_price = (
          Number(this.process_info.total_price) +
          Number(
            this.process_info.process_info.reduce((a: any, b: any) => {
              return Number(a) + b.addFeePrice
            }, 0)
          )
        ).toFixed(2)
        // tab页默认
        this.materialOrderIndex = this.process_info.process_info[0].id + ''
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
        storeId: [this.process_info.store_id, this.process_info.second_store_id],
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
    // 删除加工单
    deleteAdd() {
      if (this.process_info.process_info.length === 1) {
        this.$message.error('当前调取单只有一张加工单，不可删除，如需删除调取单，请返回上一级列表进行删除')
        return
      }
      yarnProcess.delete({ id: this.materialOrderIndex }).then((res) => {
        if (res.data.status) {
          this.$message.success('删除成功')
          this.init()
        }
      })
    },
    // 打开扣款窗口
    openDeduct() {
      let index = this.process_info.process_info.findIndex((items: any) => {
        return items.id === this.materialOrderIndex
      })
      let item = this.process_info.process_info.find((items: any) => {
        return items.id === this.materialOrderIndex
      })
      this.deduct_info = {
        yarn: this.process_info.process_info[index].child_data.map((items: any) => {
          return {
            value: items.name,
            label: items.name + '/' + items.color + '/' + items.attribute
          }
        }),
        client_id: item.client_id,
        pid: this.materialOrderIndex,
        pcode: this.process_info.process_info[index].code,
        type: 2
      }
      this.deduct_show = true
    },
    confirm() {
      this.$confirm('是否确认加工单完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          check
            .confirm({
              pid: this.materialOrderIndex,
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
    // 打开取消加工窗口
    openCancel() {
      this.cancel_flag = true
    },
    // 取消加工
    cancelOrder() {
      const fromData: CancelOrder = {
        pid: this.materialOrderIndex,
        document_type: 2,
        order_id: this.materialOrderIndex,
        cancel_reason: this.cancel_info.cancel_reason,
        cancel_date: this.cancel_info.cancel_date,
        file: this.cancel_info.file,
        client_fee: this.cancel_info.client_fee,
        store_data: [],
        deduct_data: {
          deduct_content: '',
          total_price: (Number(this.process_info.total_price) - Number(this.cancel_info.client_fee)).toFixed(1),
          deduct_type: 1,
          pid: this.materialOrderIndex,
          date: this.cancel_info.cancel_date,
          deduct_file: this.cancel_info.file,
          client_id: this.process_info.client_id,
          desc: this.cancel_info.cancel_reason ? this.cancel_info.cancel_reason : '取消加工单扣款'
        }
      }
      yarnProcess.cancel(fromData).then((res) => {
        if (res.data.status) {
          this.$message.success('加工单已取消')
          this.cancel_flag = false
          this.init()
        }
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
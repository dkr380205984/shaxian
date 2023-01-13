<template>
  <div class="indexMain" id="yarnDetail" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="checkCtn">
          <el-tooltip class="item" effect="dark" content="点击查看审核日志" placement="bottom">
            <img @click="checkReason" :src="order_material_info.is_check | checkFilter" />
          </el-tooltip>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">采购单号：</span>
            <span class="text green">{{ order_material_info.code }}</span>
          </div>
          <div class="colCtn">
            <span class="label">采购单位：</span>
            <span class="text">{{ order_material_info.client_name }}</span>
          </div>
          <div class="colCtn">
            <span class="label">单据状态：</span>
            <span class="text" :class="{
              orange: order_material_info.status === 1,
              blue: order_material_info.status === 2,
              green: order_material_info.status === 3,
              gray: order_material_info.status === 4
            }">{{ order_material_info.status | orderStatusFilter }}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">创建人：</span>
            <span class="text">{{ order_material_info.user_name }}</span>
          </div>
          <div class="colCtn">
            <span class="label">下单日期：</span>
            <span class="text">{{ order_material_info.order_time }}</span>
          </div>
          <div class="colCtn">
            <span class="label">交货日期：</span>
            <span class="text">{{ order_material_info.delivery_time }} （<span :class="{
              red: $diffByDate(order_material_info.delivery_time) <= 0,
              green: $diffByDate(order_material_info.delivery_time) > 7,
              yellow:
                $diffByDate(order_material_info.delivery_time) <= 7 && $diffByDate(order_material_info.delivery_time) > 0
            }">
                {{
  $diffByDate(order_material_info.delivery_time) > 0
  ? '交货还剩' + $diffByDate(order_material_info.delivery_time) + '天'
  : '延期发货' + Math.abs($diffByDate(order_material_info.delivery_time)) + '天'
                }} </span>）
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">结算方式：</span>
            <span class="text">{{ order_material_info.settle_type }}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{ order_material_info.desc || '无' }}</span>
          </div>
          <div class="colCtn"></div>
          <div class="colCtn"></div>
        </div>
        <div style="padding: 10px 32px">
          <div class="tableCtn" style="margin-top: 6px">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">额外费用</div>
                <div class="tcolumn">我方扣款金额</div>
                <div class="tcolumn">计划采购数量</div>
                <div class="tcolumn">实际入库数量</div>
                <div class="tcolumn">计划总额（含额外、扣款）</div>
                <div class="tcolumn">实际总额（含额外、扣款）</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow">
                <div class="tcolumn">{{ $toFixed(order_material_info.total_additional_fee, 2, true) }} 元</div>
                <div class="tcolumn red">{{ $toFixed(order_material_info.total_deduct_price, 2, true) }} 元</div>
                <div class="tcolumn blue">{{ $toFixed(order_material_info.total_weight || 0, 1, true) }} kg</div>
                <div class="tcolumn green">{{ $toFixed(order_material_info.push_weight || 0, 1, true) }} kg</div>
                <div class="tcolumn">
                  {{
  $toFixed(
                  + order_material_info.total_price +
  +order_material_info.total_additional_fee +
  +order_material_info.total_deduct_price || 0,
  2,
  true
)
                  }}
                  元
                </div>
                <div class="tcolumn green">
                  {{
  $toFixed(
                  + order_material_info.total_push_price +
  +order_material_info.total_add_fee_price +
  +order_material_info.total_deduct_price || 0,
  2,
  true
)
                  }}
                  元
                </div>
              </div>
              <div class="trow">
                <div class="tcolumn" style="margin: unset">
                  <othersFeeData :data="order_material_info.additional_fee"></othersFeeData>
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
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">毛条采购信息</span>
        <span class="addBtn btn btnMain" @click="openOrderIn">毛条入库</span>
      </div>
      <div style="padding: 20px 32px">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">毛条名称</div>
              <div class="tcolumn">毛条属性</div>
              <div class="tcolumn">采购单价(元)</div>
              <div class="tcolumn">计划采购数量(kg)</div>
              <div class="tcolumn">已入库数量(kg)</div>
              <div class="tcolumn">待入库数量(kg)</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow" v-for="(item, index) in order_material_info.child_data" :key="index">
              <div class="tcolumn">
                <el-checkbox v-model="item.check">{{ item.name }}</el-checkbox>
              </div>
              <div class="tcolumn">{{ item.attribute }}</div>
              <div class="tcolumn">{{ item.price }}元</div>
              <div class="tcolumn blue">{{ item.weight }}kg</div>
              <div class="tcolumn green">{{ item.push_weight }}kg</div>
              <div class="tcolumn red">{{ item.weight - item.push_weight }}kg</div>
            </div>
            <div class="trow" style="background: #f4f4f4">
              <div class="tcolumn">合计</div>
              <div class="tcolumn"></div>
              <div class="tcolumn">
                <div>计划:{{ order_material_info.total_price }} 元</div>
                <div class="green">实际:{{ order_material_info.total_push_price }} 元</div>
              </div>
              <div class="tcolumn blue">{{ $toFixed(order_material_info.total_weight || 0, 1, true) }}kg</div>
              <div class="tcolumn green">{{ order_material_info.total_push_weight }} kg</div>
              <div class="tcolumn red">{{ order_material_info.total_weight - order_material_info.total_push_weight }}kg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module" v-show="order_in_log.length > 0">
      <div class="titleCtn">
        <span class="title">毛条入库信息</span>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="overflow" @mousewheel.prevent="listenWheel" ref="list">
            <div class="tableCtn">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">入库单号</div>
                    <div class="column min120">入库仓库</div>
                    <div class="column" style="flex:2;flex-direction:column">
                      <div class="row">
                        <div class="column min120">毛条名称</div>
                        <div class="column min120">毛条属性</div>
                        <div class="column min120">已入库数量</div>
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
                  <div class="row" v-for="item in order_in_log" :key="item.id">
                    <div class="column min120">{{ item.code }}</div>
                    <div class="column min120">{{ item.store_name }}/{{ item.second_store_name }}</div>
                    <div class="column" style="flex:2;flex-direction:column">
                      <div class="row" v-for="(itemChild, indexChild) in item.child_data" :key="indexChild">
                        <div class="column min120">{{ itemChild.name }}</div>
                        <div class="column min120">{{ itemChild.attribute || '无' }}</div>
                        <div class="column min120 blue">{{ itemChild.action_weight }}kg</div>
                        <div class="column min120">{{ itemChild.item || 0 }}件</div>
                        <div class="column min120">{{ itemChild.batch_code }}</div>
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
                  <div class="column min120 blue" :style="{ 'height': 50 * item.child_data.length + 'px' }">{{
                    item.code
                  }}
                  </div>
                  <div class="column min120" :style="{ 'height': 50 * item.child_data.length + 'px' }">
                    {{ item.second_store_name }}</div>
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
                  <div class="column min120" :style="{ 'height': 50 * item.child_data.length + 'px' }">
                    <span class="blue opr" @click="$openUrl(`/print/materialInStore?id=${item.id}`)">打印</span>
                    <span class="red opr">删除</span>
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
              <!-- <div class="column">毛条信息</div>
              <div class="column">扣款单价</div> -->
              <div class="column">图片说明</div>
              <div class="column">扣款总价</div>
              <div class="column">备注信息</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row" v-for="item in deduct_list" :key="item.id">
              <div class="column blue">{{ item.code }}</div>
              <!-- <div class="column">
                <div class="sortContainer" v-if="item.deduct_content && item.deduct_content.length > 0">
                  <div class="sort">
                    <i class="el-icon-caret-top hover" @click="changeIndex(item, 'add')"></i>
                    <div class="number">{{ (item.index || 0) + 1 }}/{{ item.deduct_content.length }}</div>
                    <i class="el-icon-caret-bottom hover" @click="changeIndex(item, 'delete')"></i>
                  </div>
                  <span>{{ item.deduct_content[item.index || 0].yarn }}</span>
                </div>
                <div class="gray" v-else>暂无毛条</div>
              </div>
              <div class="column">
                <template v-if="item.deduct_content && item.deduct_content.length.length > 0"
                  >{{ item.deduct_content[item.index || 0].price }}元</template
                >
                <div class="gray" v-else>暂无单价</div>
              </div> -->
              <div class="column">
                <el-image style="width: 50px; height: 50px; line-height: 50px; text-align: center; font-size: 22px"
                  :src="item.deduct_file" :preview-src-list="[item.deduct_file]">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
              <div class="column red">{{ item.total_price }}元</div>
              <div class="column">{{ item.desc }}</div>
              <div class="column">
                <div class="opr blue" @click="$openUrl('/print/deductPrint?id=' + item.id)">打印</div>
                <div class="opr red" @click="deleteDeductLog('扣款', item.id)">删除</div>
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
          <div v-if="order_material_info.status !== 4" class="buttonList" style="margin-left: 12px">
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
                <div class="button btnBlue" @click="confirm" v-if="order_material_info.status !== 3">
                  <i class="iconfont">&#xe636;</i>
                  <span class="text">确认完成</span>
                </div>
                <div class="button btnBlack" @click="openCancel">
                  <i class="el-icon-circle-close"></i>
                  <span class="text">取消采购</span>
                </div>
                <!-- <div class="button btnBlue" @click="$openUrl(`/print/orderYarn/2/${$route.params.id}`)">
                  <i class="el-icon-printer"></i>
                  <span class="text">打印单据</span>
                </div> -->
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
          <el-tooltip v-if="order_material_info.status === 4" class="item" effect="dark" placement="top">
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
    <div class="popup" v-show="order_in_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">毛条入库</span>
          <i class="close_icon el-icon-close" @click="resetOrderIn"></i>
        </div>
        <div class="contentCtn">
          <div class="createCtn">
            <div style="background:#f0f0f0;padding:12px;margin:12px 0"
              v-for="(itemChild, indexChild) in order_in_info.child_data" :key="indexChild">
              <div class="rowCtn" style="background:#f0f0f0">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">毛条信息</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input disabled placeholder="请输入毛条信息" v-model="itemChild.name"></el-input>
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
                      <el-input disabled placeholder="请输入采购数量" v-model="itemChild.order_number">
                        <template slot="append">kg</template>
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">属性</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input disabled placeholder="请输入毛条属性" v-model="itemChild.attribute">
                      </el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rowCtn" style="background:#f0f0f0">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">入库数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input placeholder="数量" v-model="itemChild.action_weight">
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
                      <el-input placeholder="件数" v-model="itemChild.item">
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
                      <el-input placeholder="批号" v-model="itemChild.batch_code">
                      </el-input>
                    </div>
                    <div class="oprCtn">
                      <div class="editBtn deleteBtn" @click="$deleteItem(order_in_info.child_data, indexChild)">删除</div>
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
                    <el-cascader v-model="order_in_info.select_id" :options="store_list"
                      :props="{ value: 'id', label: 'name', children: 'second_data' }" placeholder="请选择入库仓库">
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
                    <el-date-picker class="el" style="width:100%" v-model="order_in_info.date" type="date"
                      value-format="yyyy-MM-dd" placeholder="选择日期">
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
                    <el-input placeholder="请输入备注信息" v-model="order_in_info.desc"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr" @click="resetOrderIn">取消</div>
          <div class="opr blue" @click="saveOrderIn">确认入库</div>
        </div>
      </div>
    </div>
    <check :show.sync="check_flag" :pid="$route.params.id" @afterCheck="init" :checkType="3" :checkList="[{
      value: '费用问题',
      label: '费用问题'
    }, {
      value: '质量问题',
      label: '质量问题'
    }, {
      value: '产品问题',
      label: '产品问题'
    }, {
      value: '交期问题',
      label: '交期问题'
    }, {
      value: '数量问题',
      label: '数量问题'
    }]"></check>
    <deduct :show.sync="deduct_show" :data="deduct_info"></deduct>
    <materialAddPO :show="showAddPO" :update="true" @close="showAddPO = false" :info="order_material_info"
      @afterCreate="init"></materialAddPO>
    <check-detail :show.sync="check_detail_flag" :checkType="3" :pid="$route.params.id"></check-detail>
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
                      <el-input placeholder="采购总额" v-model="order_material_info.total_price" disabled>
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
                        <el-upload class="upload" action="https://upload.qiniup.com/"
                          accept="image/jpeg,image/gif,image/png,image/bmp" :before-upload="beforeAvatarUpload"
                          :multiple="false" :data="postData" :limit="1" :on-success="successFile" ref="uploada"
                          list-type="picture">
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
                      <el-date-picker class="el" v-model="cancel_info.cancel_date" style="width: 100%" type="date"
                        value-format="yyyy-MM-dd" placeholder="选择日期">
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
                  parseInt(order_material_info.total_price - cancel_info.client_fee)
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
import { StoreCreate } from '@/types/store'
import { CancelOrder } from '@/types/order'
import { OrderMaterialInfo } from '@/types/material'
import { stock, deduct, material, check, yarnOrder } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    order_material_info: OrderMaterialInfo
    cancel_info: CancelOrder
    [propName: string]: any
  } {
    return {
      loading: true,
      showAddPO: false,
      deduct_show: false,
      check_flag: false,
      check_detail_flag: false,
      cancel_flag: false,
      deduct_info: {
        yarn: [],
        pid: 1,
        pcode: '',
        type: 1
      },
      postData: { key: '', token: '' },
      cancel_step: 2,
      cancel_reason: '',
      cancel_date: '',
      user_name: '',
      client_fee: '',
      cancel_info: {
        order_id: '',
        cancel_reason: '',
        cancel_date: this.$getDate(new Date()),
        file: '',
        client_fee: '',
        document_type: 3,
        deduct_data: {
          deduct_content: '',
          total_price: '',
          rel_doc_type: 1,
          rel_doc_id: '',
          date: '',
          deduct_file: '',
          client_id: '',
          desc: ''
        }
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
          rel_doc_id: this.$route.params.id,
          rel_doc_type: 3
        }),
        yarnOrder.cancelDetail({
          pid: this.$route.params.id,
          document_type: 3
        })
      ]).then((res) => {
        this.order_material_info = res[0].data.data
        this.order_material_info.additional_fee = this.order_material_info.additional_fee
          ? JSON.parse(this.order_material_info.additional_fee as string)
          : []
          // @ts-ignore
          this.order_material_info.total_add_fee_price = this.order_material_info.additional_fee.reduce((total, current) => {
            return total + (Number(current.price) || 0)
          }, 0)
          .toFixed(2)
        this.order_material_info.total_price = this.order_material_info.child_data
          .reduce((total, current) => {
            return total + (Number(current.price) || 0) * (Number(current.weight) || 0)
          }, 0)
          .toFixed(2)
        this.order_material_info.total_weight = this.order_material_info.child_data.reduce((total, current) => {
          return total + Number(current.weight)
        }, 0)
        this.order_material_info.total_push_price = this.order_material_info.child_data
          .reduce((total, current) => {
            return total + (Number(current.push_price) || 0)
          }, 0)
          .toFixed(2)
        this.order_in_log = res[1].data.data.items
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
        this.order_material_info.total_push_weight = this.order_material_info.child_data.reduce((total, current) => {
          return total + (Number(current.push_weight) || 0)
        }, 0)
        this.deduct_list = res[2].data.data
        this.deduct_list.forEach((item: any) => {
          item.deduct_content = item.deduct_content ? JSON.parse(item.deduct_content) : []
        })
        if (this.order_material_info.status === 4) {
          this.cancel_reason = res[3].data.data.cancel_reason
          this.cancel_date = res[3].data.data.cancel_date
          this.client_fee = res[3].data.data.client_fee
          this.user_name = res[3].data.data.user_name
        }
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
            attribute: item.attribute,
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
            attribute: item.attribute,
            action_weight: item.action_weight,
            batch_code: item.batch_code || '',
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
    // 打开取消订单窗口
    openCancel() {
      this.cancel_flag = true
    },
    // 监听一下鼠标滚轮
    listenWheel(ev: any) {
      const detail = ev.wheelDelta || ev.detail
      // 定义滚动方向，其实也可以在赋值的时候写
      const moveForwardStep = 1
      const moveBackStep = -1
      // 定义滚动距离
      let step = 0
      // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
      if (detail < 0) {
        step = moveForwardStep * 50
      } else {
        step = moveBackStep * 50
      }
      // @ts-ignore 对需要滚动的元素进行滚动操作
      this.$refs.list.scrollLeft += step
    },
    // 删除单据
    deleteThis() {
      this.$confirm('是否删除该订购单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          material
            .orderDelete({
              id: this.$route.params.id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('删除成功')
                this.$router.push('/directOrder/materialList?page=1&code=&name=&client_id=&user_id=&page_size=10&date=')
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
    },
    successFile(response: any) {
      this.cancel_order_info.file = 'https://file.zwyknit.com/' + response.key
    },
    // 取消采购
    cancelOrder() {
      const fromData: CancelOrder = {
        pid: this.$route.params.id,
        document_type: 3,
        order_id: this.$route.params.id,
        cancel_reason: this.cancel_info.cancel_reason,
        cancel_date: this.cancel_info.cancel_date,
        file: this.cancel_info.file,
        client_fee: this.cancel_info.client_fee,
        store_data: [],
        deduct_data: {
          deduct_content: '',
          total_price: (Number(this.order_material_info.total_price) - Number(this.cancel_info.client_fee)).toFixed(1),
          rel_doc_type: 1,
          rel_doc_id: this.$route.params.id,
          date: this.cancel_info.cancel_date,
          deduct_file: this.cancel_info.file,
          client_id: this.order_material_info.client_id,
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
      }
    ])
    this.init()
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/less/directOrder/yarnDetail.less';
</style>
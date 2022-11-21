<template>
  <div class="indexMain" id="orderDeatil" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="checkCtn">
          <el-tooltip class="item" effect="dark" content="点击查看审核日志" placement="bottom">
            <img @click="checkReason" :src="order_info.is_check | checkFilter" />
          </el-tooltip>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">订单号：</span>
            <span class="text blue">{{ order_info.code }}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">客户单号：</span>
            <span class="text green">{{ order_info.order_code }}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">下单客户：</span>
            <span class="text">{{ order_info.client_name }}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{ order_info.order_time }}</span>
          </div>
          <div class="colCtn flex3" v-if="order_info.type == 1">
            <span class="label">交货日期：</span>
            <span class="text"
              >{{ order_info.delivery_time }}
              <template v-if="order_info.status !== 3 && order_info.status !== 4"
                >（
                <span
                  :class="{
                    red: $diffByDate(order_info.delivery_time) <= 0,
                    green: $diffByDate(order_info.delivery_time) > 7,
                    yellow: $diffByDate(order_info.delivery_time) <= 7 && $diffByDate(order_info.delivery_time) > 0
                  }"
                >
                  {{
                    $diffByDate(order_info.delivery_time) > 0
                      ? '交货还剩' + $diffByDate(order_info.delivery_time) + '天'
                      : '延期发货' + Math.abs($diffByDate(order_info.delivery_time)) + '天'
                  }} </span
                >）
              </template>
              <template v-else
                >（<span v-if="order_info.status === 3" class="green">已完成</span>
                <span v-if="order_info.status === 4" class="gray">订单已取消</span>）</template
              >
            </span>
          </div>
          <div class="colCtn flex3" v-if="order_info.type == 2">
            <span class="label">销售总数：</span>
            <span class="text green">{{ order_info.total_weight }}kg</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">销售总额：</span>
            <span class="text green">{{ order_info.total_price }}元</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">创建人：</span>
            <span class="text">{{ order_info.user_name }}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">创建时间：</span>
            <span class="text">{{ order_info.create_time.slice(0, 10) || '暂无' }}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单状态：</span>
            <span
              class="text"
              :class="{
                orange: order_info.status === 1,
                blue: order_info.status === 2,
                green: order_info.status === 3,
                gray: order_info.status === 4
              }"
              >{{ order_info.status | orderStatusFilter }}</span
            >
          </div>
        </div>
        <div class="rowCtn" v-if="order_info.additional_fee">
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
                  <div class="trow" v-for="(item, index) in JSON.parse(order_info.additional_fee)" :key="index">
                    <div class="tcolumn">{{ item.name }}</div>
                    <div class="tcolumn">{{ item.price }}元</div>
                    <div class="tcolumn">{{ item.desc || '无' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="text" v-html="order_info.desc"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{ order_info.type == 1 ? '下单' : '销售' }}信息</span>
        <span class="addBtn btn btnMain" v-if="order_info.type == 1" @click="chooseTrans = true">加工回库</span>
        <span class="addBtn btn btnMain" v-if="order_info.type == 1" @click="create_flag = true">调取并加工</span>
        <span class="addBtn btn btnMain" v-if="order_info.type == 1" @click="showAddPO = true">采购并入库</span>
      </div>
      <div style="padding: 20px 32px" v-if="order_info.type == 1">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">纱线名称</div>
              <div class="tcolumn noPad" style="flex: 7">
                <div class="trow">
                  <div class="tcolumn">纱线颜色</div>
                  <div class="tcolumn">纱线属性</div>
                  <div class="tcolumn">数量属性</div>
                  <div class="tcolumn">下单价格(元)</div>
                  <div class="tcolumn">下单数量(kg)</div>
                  <div class="tcolumn">采购数量</div>
                  <div class="tcolumn">发货数量</div>
                </div>
              </div>
              <div class="tcolumn">加工数量</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow" v-for="item in order_info.product_info" :key="item.id">
              <div class="tcolumn">
                {{ item.product_name }}
              </div>
              <div class="tcolumn noPad" style="flex: 7">
                <div class="trow" style="height: 100%" v-for="itemChild in item.child_data" :key="itemChild.id">
                  <div class="tcolumn">
                    {{ itemChild.color }}
                  </div>
                  <div class="tcolumn">{{ itemChild.attribute }}</div>
                  <div class="tcolumn">{{ itemChild.number_attribute }}</div>
                  <div class="tcolumn">{{ itemChild.price }}元</div>
                  <div class="tcolumn blue">{{ itemChild.weight }}kg</div>
                  <div class="tcolumn blue">{{ itemChild.purchase_weight || 0 }}kg</div>
                  <div class="tcolumn blue">{{ itemChild.transfer_weight || 0 }}kg</div>
                </div>
              </div>
              <div class="tcolumn blue">
                <div class="once gray" v-if="item.process_info.length === 0">暂无加工信息</div>
                <div class="once" v-for="(item, index) in item.process_info" :key="item.type + index">
                  <span class="green" style="margin-right: 5px">{{ item.type }}</span>
                  <span class="blue">{{ item.total_weight }}kg</span>
                </div>
              </div>
            </div>
            <div class="trow bgGray">
              <div class="tcolumn">合计</div>
              <div class="tcolumn noPad" style="flex: 7">
                <div class="trow">
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn">{{ order_info.total_weight }}kg</div>
                  <div class="tcolumn">{{ order_info.total_purchase_weight }}kg</div>
                  <div class="tcolumn">{{ order_info.total_transfer_weight }}kg</div>
                </div>
              </div>
              <div class="tcolumn"></div>
            </div>
          </div>
        </div>
      </div>
      <div style="padding: 20px 32px" v-if="order_info.type == 2">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">纱线名称</div>
              <div class="tcolumn noPad" style="flex: 7">
                <div class="trow">
                  <div class="tcolumn">纱线颜色</div>
                  <div class="tcolumn">纱线属性</div>
                  <div class="tcolumn">数量属性</div>
                  <div class="tcolumn">批号/色号/缸号</div>
                  <div class="tcolumn">销售仓库</div>
                  <div class="tcolumn">销售单价(元)</div>
                  <div class="tcolumn">销售数量(kg)</div>
                  <div class="tcolumn">销售件数(件)</div>
                  <div class="tcolumn">金额小计(元)</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow" v-for="item in order_info.product_info" :key="item.id">
              <div class="tcolumn">
                {{ item.product_name }}
              </div>
              <div class="tcolumn noPad" style="flex: 7">
                <div class="trow" v-for="itemChild in item.child_data" :key="itemChild.id">
                  <div class="tcolumn">
                    {{ itemChild.color }}
                  </div>
                  <div class="tcolumn">{{ itemChild.attribute }}</div>
                  <div class="tcolumn">{{ itemChild.number_attribute }}</div>
                  <div class="tcolumn">
                    {{ itemChild.batch_code }}/{{ itemChild.color_code }}/{{ itemChild.vat_code }}
                  </div>
                  <div class="tcolumn">{{ itemChild.store }}/<br />{{ itemChild.secondary_store }}</div>
                  <div class="tcolumn">{{ itemChild.price }}元</div>
                  <div class="tcolumn blue">{{ itemChild.weight }}kg</div>
                  <div class="tcolumn">{{ itemChild.item || 0 }}件</div>
                  <div class="tcolumn">{{ ((itemChild.price || 0) * (itemChild.weight || 0)).toFixed(2) }}元</div>
                </div>
              </div>
            </div>
            <div class="trow" style="background: #f4f4f4">
              <div class="tcolumn">合计</div>
              <div class="tcolumn noPad" style="flex: 7">
                <div class="trow">
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn">{{ order_info.total_weight }}kg</div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn">
                    {{ (order_info.total_price - order_info.total_additional_fee).toFixed(2) }}元
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module" v-if="order_info.type == 1">
      <div class="titleCtn">
        <span class="title">发货信息</span>
        <span class="addBtn btn btnMain" v-if="order_info.type == 1" @click="jiagongdanList.length>0?showProcessClient = true:$message.error('请先创建加工单')">加工单位发货</span>
        <span class="addBtn btn btnMain" v-if="order_info.type == 1" @click="showStore = true">库存发货</span>
      </div>
      <div style="padding: 20px 32px">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">发货日期</div>
              <div class="tcolumn">发货单号</div>
              <div class="tcolumn">发货仓库</div>
              <div class="tcolumn noPad" style="flex: 9">
                <div class="trow">
                  <div class="tcolumn">纱线名称</div>
                  <div class="tcolumn">纱线颜色</div>
                  <div class="tcolumn">纱线属性</div>
                  <!-- <div class="tcolumn">数量属性</div> -->
                  <div class="tcolumn">批号/色号/缸号</div>
                  <!-- <div class="tcolumn">发货单价(元)</div> -->
                  <div class="tcolumn">发货数量</div>
                  <div class="tcolumn">发货件数</div>
                </div>
              </div>
              <!-- <div class="tcolumn">小计</div> -->
              <div class="tcolumn">备注信息</div>
              <div class="tcolumn">操作人</div>
              <!-- <div class="tcolumn">操作</div> -->
            </div>
          </div>
          <div class="tbody">
            <div class="trow gray" v-if="final_out_log.length === 0" style="line-height: 46px">暂无发货信息</div>
            <div class="trow" v-for="item in final_out_log" :key="item.id">
              <div class="tcolumn">{{ item.complete_time }}</div>
              <div class="tcolumn">{{ item.code }}</div>
              <div class="tcolumn">{{ item.store_name }}/{{ item.second_store_name }}</div>
              <div class="tcolumn noPad" style="flex: 9">
                <div class="trow" v-for="(itemChild, indexChild) in item.child_data" :key="indexChild">
                  <div class="tcolumn">{{ itemChild.name }}</div>
                  <div class="tcolumn">{{ itemChild.color }}</div>
                  <div class="tcolumn">{{ itemChild.attribute }}</div>
                  <!-- <div class="tcolumn">{{ itemChild.number_attribute || '无' }}</div> -->
                  <div class="tcolumn" style="word-break: break-all;">{{ itemChild.batch_code }}/{{ itemChild.color_code }}/{{ itemChild.vat_code }}</div>
                  <!-- <div class="tcolumn">{{ itemChild.price || 0}}</div> -->
                  <div class="tcolumn blue">{{ itemChild.action_weight }}kg</div>
                  <div class="tcolumn blue">{{ itemChild.item || 0 }}</div>
                </div>
              </div>
              <!-- <div class="tcolumn">{{ item.total_price || 0 }}</div> -->
              <div class="tcolumn">{{ item.desc || '无' }}</div>
              <div class="tcolumn">{{ item.user_name }}</div>
              <!-- <div class="tcolumn">打印</div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module" v-if="order_info.status === 4">
      <div class="titleCtn">
        <span class="title">结余入库</span>
      </div>
      <div style="padding: 20px 32px">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">入库单号</div>
              <div class="tcolumn">入库仓库</div>
              <div class="tcolumn noPad" style="flex: 4">
                <div class="trow">
                  <div class="tcolumn">纱线名称</div>
                  <div class="tcolumn">入库颜色</div>
                  <div class="tcolumn">入库属性</div>
                  <div class="tcolumn">入库数量</div>
                </div>
              </div>
              <div class="tcolumn">备注信息</div>
              <div class="tcolumn">入库日期</div>
              <div class="tcolumn">操作人</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow gray" v-if="order_cancel_log.length === 0" style="line-height: 46px">暂无结余入库信息</div>
            <div class="trow" v-for="item in order_cancel_log" :key="item.id">
              <div class="tcolumn">{{ item.code }}</div>
              <div class="tcolumn">{{ item.store_name }}/{{ item.second_store_name }}</div>
              <div class="tcolumn noPad" style="flex: 4">
                <div class="trow" v-for="(itemChild, indexChild) in item.child_data" :key="indexChild">
                  <div class="tcolumn">{{ itemChild.name }}</div>
                  <div class="tcolumn">{{ itemChild.color }}</div>
                  <div class="tcolumn">{{ itemChild.attribute }}</div>
                  <div class="tcolumn blue">{{ itemChild.action_weight }}kg</div>
                </div>
              </div>
              <div class="tcolumn">{{ item.desc || '无' }}</div>
              <div class="tcolumn">{{ item.complete_time }}</div>
              <div class="tcolumn">{{ item.user_name }}</div>
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
              <div class="column">扣款日期</div>
              <div class="column">操作人</div>
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
              <div class="column">{{ item.related_info.create_time.slice(0, 10) }}</div>
              <div class="column">{{ item.related_info.user_name }}</div>
              <div class="column">
                <div class="opr blue">打印</div>
                <div class="opr red">删除</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module" v-if="order_info.type == 1">
      <div class="titleCtn">
        <span class="title">财务概览</span>
      </div>
      <div style="padding: 20px 32px">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">费用名称</div>
              <div class="tcolumn">费用数量</div>
              <div class="tcolumn">总价(元)</div>
              <div class="tcolumn">均价</div>
              <div class="tcolumn">操作</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow">
              <div class="tcolumn">下单纱线</div>
              <div class="tcolumn">{{ order_info.total_weight }}</div>
              <div class="tcolumn green">{{ order_info.total_price }}元</div>
              <div class="tcolumn">{{ (order_info.total_price / order_info.total_weight).toFixed(1) }}元/kg</div>
              <div class="tcolumn gray">暂无操作</div>
            </div>
            <div class="trow">
              <div class="tcolumn">额外费用</div>
              <div class="tcolumn gray">暂无</div>
              <div class="tcolumn green">
                {{
                  order_info.additional_fee
                    ? JSON.parse(order_info.additional_fee).reduce((total, current) => total + Number(current.price), 0)
                    : 0
                }}元
              </div>
              <div class="tcolumn gray">暂无</div>
              <div class="tcolumn gray">暂无操作</div>
            </div>
            <!-- <div class="trow">
              <div class="tcolumn">纱线成本</div>
              <div class="tcolumn">费用数量</div>
              <div class="tcolumn orange">{{total.chengben_price.toFixed(1)}}</div>
              <div class="tcolumn">均价</div>
              <div class="tcolumn">操作</div>
            </div> -->
            <div class="trow">
              <div class="tcolumn">倒筒加工</div>
              <div class="tcolumn">{{ total.daotong_weight.toFixed(1) }}kg</div>
              <div class="tcolumn orange">{{ total.daotong_price.toFixed(1) }}元</div>
              <div class="tcolumn">
                {{ total.daotong_weight ? (total.daotong_price / total.daotong_weight).toFixed(1) : 0 }}元/kg
              </div>
              <div class="tcolumn">
                <div class="oprCtn">
                  <div class="opr blue" @click="window.open('/orderProcessYarn/detail/' + $route.params.id)">
                    倒筒详情
                  </div>
                </div>
              </div>
            </div>
            <div class="trow">
              <div class="tcolumn">染色加工</div>
              <div class="tcolumn">{{ total.ranse_weight.toFixed(1) }}kg</div>
              <div class="tcolumn orange">{{ total.ranse_price.toFixed(1) }}元</div>
              <div class="tcolumn">
                {{ total.ranse_weight ? (total.ranse_price / total.ranse_weight).toFixed(1) : 0 }}元/kg
              </div>
              <div class="tcolumn">
                <div class="oprCtn">
                  <div class="opr blue" @click="window.open('/orderProcessYarn/detail/' + $route.params.id)">
                    染色详情
                  </div>
                </div>
              </div>
            </div>
            <div class="trow">
              <div class="tcolumn">膨纱加工</div>
              <div class="tcolumn">{{ total.pengsha_weight.toFixed(1) }}kg</div>
              <div class="tcolumn orange">{{ total.pengsha_price.toFixed(1) }}元</div>
              <div class="tcolumn">
                {{ total.pengsha_weight ? (total.pengsha_price / total.pengsha_weight).toFixed(1) : 0 }}元/kg
              </div>
              <div class="tcolumn">
                <div class="oprCtn">
                  <div class="opr blue" @click="window.open('/orderProcessYarn/detail/' + $route.params.id)">
                    膨纱详情
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
        <div class="btnCtn" v-if="order_info.type == 1" style="float: left">
          <div class="buttonList">
            <div class="showButton" @click="showGuanLian = true">
              <i class="el-icon-s-grid"></i>
              <span class="text">关联单据</span>
            </div>
            <!-- <div class="otherInfoCtn" style="left: 0">
              <div class="otherInfo">
                <div class="button btnMain" @click="$router.push('/inAndOut/detail/' + $route.params.id)">
                  <i class="iconfont">&#xe637;</i>
                  <span class="text">出入库</span>
                </div>
                <div class="button btnMain" @click="$router.push('/orderProcessYarn/detail/' + $route.params.id)">
                  <i class="iconfont">&#xe63c;</i>
                  <span class="text">采购加工</span>
                </div>
              </div>
            </div> -->
          </div>
        </div>
        <div class="btnCtn">
          <div class="btn btnGray" @click="$router.go(-1)">返回</div>
          <div class="buttonList" style="margin-left: 12px" v-if="order_info.status !== 4">
            <div class="showButton">
              <i class="el-icon-s-grid"></i>
              <span class="text">订单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="button btnGreen" @click="openCheck" v-if="order_info.status !== 3 || order_info.type !== 2">
                  <i class="iconfont">&#xe638;</i>
                  <span class="text">订单审核</span>
                </div>
                <div class="button btnRed" @click="openDeduct">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">客户扣款</span>
                </div>
                <div class="button btnBlue" @click="$openUrl('/print/orderPrint?id=' + $route.params.id)">
                  <i class="el-icon-printer"></i>
                  <span class="text">订单打印</span>
                </div>
                <div
                  class="button btnOrange"
                  @click="$router.push('/order/update/' + $route.params.id)"
                  v-if="order_info.status !== 3 && order_info.type !== 2"
                >
                  <i class="iconfont">&#xe63a;</i>
                  <span class="text">订单修改</span>
                </div>
                <div class="button btnRed" @click="deleteOrder" v-if="order_info.status !== 3">
                  <i class="iconfont">&#xe639;</i>
                  <span class="text">订单删除</span>
                </div>
                <!-- <div
                  class="button btnMain"
                  @click="store_info.show = true"
                  v-if="order_info.status !== 3 && order_info.type !== 2"
                >
                  <i class="iconfont">&#xe614;</i>
                  <span class="text">订单发货</span>
                </div> -->
                <div class="button btnBlue" @click="confirm" v-if="order_info.status !== 3 && order_info.type !== 2">
                  <i class="iconfont">&#xe636;</i>
                  <span class="text">确认完成</span>
                </div>
                <div class="button btnBlack" @click="openCancel">
                  <i class="el-icon-circle-close"></i>
                  <span class="text">取消订单</span>
                </div>
              </div>
            </div>
          </div>
          <el-tooltip v-if="order_info.status === 4" class="item" effect="dark" placement="top">
            <div slot="content">
              取消原因：{{ cancel_reason }}
              <br />
              取消日期：{{ cancel_date }}
              <br />
              操作人：{{ user_name }}
              <br />
              对方承担：{{ client_fee || 0 }}元
            </div>
            <div class="btn btnWhiteRed">订单已取消</div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <!-- 订单审核 -->
    <check
      :show.sync="check_flag"
      :pid="$route.params.id"
      @afterCheck="init"
      :checkType="5"
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
    <!-- 订单扣款 -->
    <deduct :show.sync="deduct_show" :data="deduct_info"></deduct>
    <check-detail :show.sync="check_detail_flag" :checkType="5" :pid="$route.params.id"></check-detail>
    <in-and-out
      :type="9"
      :relatedCode="order_info.order_code"
      :relatedId="$route.params.id"
      :show.sync="store_info.show"
      @close="init"
    ></in-and-out>
    <div class="popup" v-show="cancel_flag">
      <div class="main">
        <div class="titleCtn">
          <div class="text">取消订单</div>
          <i class="el-icon-close" @click="cancel_flag = false"></i>
        </div>
        <div class="contentCtn">
          <div class="stepCtn">
            <div class="step" :class="{ now: cancel_step === 1, confirm: cancel_step > 1 }">
              <div class="circle">1</div>
              <div class="info">结余入库</div>
            </div>
            <div class="line"></div>
            <div class="step" :class="{ now: cancel_step === 2, confirm: cancel_step > 2 }">
              <div class="circle">2</div>
              <div class="info">取消原因</div>
            </div>
            <div class="line"></div>
            <div class="step" :class="{ now: cancel_step === 3, confirm: cancel_step > 3 }">
              <div class="circle">3</div>
              <div class="info">确认取消</div>
            </div>
          </div>
          <template v-if="cancel_step === 1">
            <div class="createCtn">
              <div class="rowCtn">
                <div class="colCtn flex3">
                  <div class="label">
                    <span class="text">仓库信息</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-cascader
                        v-model="cancel_order_info.store_data[0].select_id"
                        :options="store_list"
                        :props="{ value: 'id', label: 'name', children: 'second_data' }"
                        placeholder="请选择入库仓库"
                      >
                      </el-cascader>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tableCtn">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn" style="flex: 1.5">纱线名称</div>
                    <div class="tcolumn">纱线颜色</div>
                    <div class="tcolumn">纱线属性</div>
                    <div class="tcolumn" style="flex: 2.2">批号/色号/缸号</div>
                    <div class="tcolumn">
                      <span
                        >数量(kg)
                        <el-tooltip class="item" effect="dark" content="入库数量为0的不会产生入库日志" placement="top">
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </span>
                    </div>
                    <div class="tcolumn">件数(件)</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow" v-for="(item, index) in cancel_order_info.store_data[0].child_data" :key="index">
                    <div class="tcolumn" style="flex: 1.5">{{ item.name }}</div>
                    <div class="tcolumn">{{ item.color }}</div>
                    <div class="tcolumn">{{ item.attribute }}</div>
                    <div class="tcolumn" style="flex: 2.2; flex-direction: row; align-items: center">
                      <el-input
                        class="el"
                        v-model="item.batch_code"
                        placeholder="批号"
                        style="margin-right: 4px"
                      ></el-input>
                      <el-input
                        class="el"
                        v-model="item.color_code"
                        placeholder="色号"
                        style="margin-right: 4px"
                      ></el-input>
                      <el-input
                        class="el"
                        v-model="item.vat_code"
                        placeholder="缸号"
                        style="margin-right: 4px"
                      ></el-input>
                    </div>
                    <div class="tcolumn">
                      <el-input class="el" v-model="item.action_weight" placeholder="数量"></el-input>
                    </div>
                    <div class="tcolumn">
                      <el-input class="el" v-model="item.items" placeholder="件数"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rowCtn">
                <div class="colCtn flex3">
                  <div class="label">
                    <span class="text">操作时间</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-date-picker
                        class="el"
                        v-model="cancel_order_info.cancel_date"
                        style="width: 100%"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </div>
                  </div>
                </div>
                <div class="colCtn" style="margin-right: 0">
                  <div class="label">
                    <span class="text">备注信息</span>
                    <span class="explanation">(选填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input v-model="cancel_order_info.store_data[0].desc" placeholder="请输入备注信息"></el-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
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
                      <el-input placeholder="请输入取消原因" v-model="cancel_order_info.cancel_reason"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rowCtn">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">下单金额</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input placeholder="下单总额" v-model="order_info.total_price" disabled>
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
                      <el-input placeholder="客户承担金额" v-model="cancel_order_info.client_fee">
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
                        v-model="cancel_order_info.cancel_date"
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
                  parseInt(order_info.total_price - cancel_order_info.client_fee)
                }}元。
              </p>
            </div>
          </template>
        </div>
        <div class="oprCtn">
          <div class="opr" @click="cancel_flag = false">取消</div>
          <div class="opr orange" @click="cancel_step--" v-if="cancel_step > 1">上一步</div>
          <div class="opr blue" @click="cancel_step === 3 ? cancelOrder() : cancel_step++">
            {{ cancel_step === 3 ? '确认取消' : '下一步' }}
          </div>
        </div>
      </div>
    </div>
    <add-trans-process
      :update_flag="false"
      :create_flag="create_flag"
      :info="{}"
      @close="create_flag = false"
      @afterCreate="init()"
      :yarnList="yarnList"
      :orderId="'' + order_info.id"
    ></add-trans-process>
    <shaxianAddPO
      :show="showAddPO"
      :update="false"
      @close="showAddPO = false"
      :info="shaxianInfo"
      :orderId="'' + order_info.id"
      @afterCreate="init()"
    ></shaxianAddPO>
    <yarn-store-select
      :show="showStore"
      @close="showStore = false"
      @confirm="getYarnSelect"
      :yarnList="yarnList"
    ></yarn-store-select>
    <in-and-out
      :orderId="order_info.id"
      :show.sync="showBack"
      :relatedCode="process_info.code"
      :relatedId="process_info.id"
      :type="17"
      @close="init()"
    ></in-and-out>
    <div class="popup" v-show="chooseTrans">
      <div class="main">
        <div class="titleCtn">
          <div class="text">选择调取单</div>
          <i class="el-icon-close" @click="chooseTrans = false"></i>
        </div>
        <div class="contentCtn">
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">调取单号</div>
                <div class="tcolumn noPad" style="flex: 4">
                  <div class="trow">
                    <div class="tcolumn">加工工序</div>
                    <div class="tcolumn noPad" style="flex: 3">
                      <div class="trow">
                        <div class="tcolumn">调取纱线</div>
                        <div class="tcolumn">加工信息</div>
                        <div class="tcolumn">加工数量</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tcolumn">操作</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow" v-for="(item, index) in order_info.transfer_log" :key="index + '选择调取单'">
                <div class="tcolumn">{{ item.code }}</div>
                <div class="tcolumn noPad" style="flex: 4">
                  <div class="trow" v-for="(itemPro, indexPro) in item.process_info" :key="indexPro + '加工工序信息'">
                    <div class="tcolumn">{{ itemPro.type }}</div>
                    <div class="tcolumn noPad" style="flex: 3">
                      <div
                        class="trow"
                        v-for="(itemChild, indexChild) in itemPro.child_data"
                        :key="indexChild + '加工纱线信息'"
                      >
                        <div class="tcolumn">{{ itemChild.name }}</div>
                        <div class="tcolumn">
                          <span v-if="itemPro.type === '倒筒'">
                            {{ itemChild.before_attribute }}
                            <i class="el-icon-right"></i>
                            {{ itemChild.after_attribute }}
                          </span>
                          <span v-if="itemPro.type === '染色'">
                            {{ itemChild.before_color }}
                            <i class="el-icon-right"></i>
                            {{ itemChild.after_color }}
                          </span>
                          <span v-if="itemPro.type === '膨纱'">
                            {{ itemChild.color }}
                            <i class="el-icon-right"></i>
                            {{ itemChild.attribute }}
                          </span>
                        </div>
                        <div class="tcolumn">{{ itemChild.weight }}kg</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="tcolumn hoverBlue"
                  style="cursor: pointer"
                  @click="
                    process_info = { id: item.id, code: item.code }
                    showBack = true
                    chooseTrans = false
                  "
                >
                  加工回库
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr" @click="chooseTrans = false">取消</div>
        </div>
      </div>
    </div>
    <div class="popup" v-show="showKucunFahuo">
      <div class="main" style="min-width:1360px">
        <div class="titleCtn">
          <div class="text">从库存发货</div>
          <i class="el-icon-close" @click="showKucunFahuo = false;fahuoList = []"></i>
        </div>
        <div class="listCtn">
          <el-steps :active="1" process-status="finish" finish-status="success">
            <el-step title="选择仓库和纱线名称"></el-step>
            <el-step title="从库存发货"></el-step>
          </el-steps>
        </div>
        <div class="createCtn">
          <div class="rowCtn">
            <div class="colCtn" style="flex:3">
              <div class="label">
                <span class="text">库存纱线</span>
                <span class="explanation">(必选)</span>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">下单数量</span>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">已发货数量</span>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">当前发货数</span>
                <span class="explanation">(必填)</span>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">件数</span>
                <span class="explanation">(选填)</span>
              </div>
            </div>
          </div>
          <div style="max-height: 600px; overflow: scroll">
            <div class="rowCtn" v-for="(item, index) in fahuoList" :key="index + '发货数量'">
              <div class="colCtn" style="flex:3">
                {{ item.store_name }} / {{ item.second_store_name }} / {{item.name}} / {{item.attribute}} / {{item.color}} / {{item.batch_code}} / {{item.color_code}} / {{item.vat_color}}
              </div>
              <div class="colCtn">
                <div class="elCtn">
                  <el-input v-model="item.reality_weight" disabled><template slot="append">kg</template></el-input>
                </div>
              </div>
              <div class="colCtn">
                <div class="elCtn">
                  <el-input v-model="item.weight" disabled><template slot="append">kg</template></el-input>
                </div>
              </div>
              <div class="colCtn">
                <div class="elCtn">
                  <el-input v-model="item.action_weight" type="number" @input="getTotalInfo()" placeholder="发货数量"><template slot="append">kg</template></el-input>
                </div>
              </div>
              <div class="colCtn">
                <div class="elCtn">
                  <el-input v-model="item.item" type="number" @input="getTotalInfo()" placeholder="件数"><template slot="append">件</template></el-input>
                </div>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn" style="flex:3"></div>
              <div class="colCtn">
                <div class="elCtn">
                  {{fahuoListObj.total_reality_weight}}kg
                </div>
              </div>
              <div class="colCtn">
                <div class="elCtn">
                  {{fahuoListObj.total_weight}}kg
                </div>
              </div>
              <div class="colCtn">
                <div class="elCtn">
                  {{fahuoListObj.total_action_weight}}kg
                </div>
              </div>
              <div class="colCtn">
                <div class="elCtn">
                  {{fahuoListObj.total_item}}件
                </div>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn">
              <div class="label">
                <span class="text">发货日期</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="elCtn">
                <el-date-picker
                  v-model="fahuoObj.date"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="发货日期">
                </el-date-picker>
              </div>
            </div>
            <div class="colCtn" style="flex:4">
              <div class="label">
                <span class="text">备注信息</span>
                <span class="explanation">(选填)</span>
              </div>
              <div class="elCtn">
                <el-input v-model="fahuoObj.desc" placeholder="备注信息"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr" @click="showKucunFahuo = false;fahuoList = []">取消</div>
          <div class="opr backHoverBlue" @click="confirmFahuo(false)">确认发货</div>
          <div class="opr backHoverBlue" @click="confirmFahuo('print')">确认并打印</div>
        </div>
      </div>
    </div>
    <div class="popup" v-show="showProcessClient">
      <div class="main" style="min-width:1360px">
        <div class="titleCtn">
          <div class="text">加工单位直接发货</div>
          <i class="el-icon-close" @click="showProcessClient = false;jiagongdanList = []"></i>
        </div>
        <div class="createCtn">
          <div class="rowCtn">
            <div class="colCtn">
              <div class="label">
                <span class="text">库存纱线</span>
                <span class="explanation">(必选)</span>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">当前发货数量</span>
                <span class="explanation">(必填)</span>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">批号/缸号/色号</span>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">件数</span>
                <span class="explanation">(选填)</span>
              </div>
            </div>
          </div>
          <div style="max-height: 600px; overflow: scroll">
            <div class="rowCtn" v-for="(item, index) in jiagongdanList" :key="index + '发货数量'">
              <div class="colCtn">
                {{ item.client_name }} / {{item.name}} / {{item.color}} / {{item.attribute}}
              </div>
              <div class="colCtn">
                <div class="elCtn" style="display:flex">
                  <el-input step="margin-left:10px" v-model="item.batch_code" placeholder="批号"></el-input>
                  <el-input step="margin-left:10px" v-model="item.color_code" placeholder="色号"></el-input>
                  <el-input step="margin-left:10px" v-model="item.vat_code" placeholder="缸号"></el-input>
                </div>
              </div>
              <div class="colCtn">
                <div class="elCtn">
                  <el-input v-model="item.action_weight" placeholder="发货数量"><template slot="append">kg</template></el-input>
                </div>
              </div>
              <div class="colCtn">
                <div class="elCtn">
                  <el-input v-model="item.item" placeholder="件数"><template slot="append">件</template></el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn">
              <div class="label">
                <span class="text">发货日期</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="elCtn">
                <el-date-picker
                  v-model="jiagongdanObj.date"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="发货日期">
                </el-date-picker>
              </div>
            </div>
            <div class="colCtn" style="flex:4">
              <div class="label">
                <span class="text">备注信息</span>
                <span class="explanation">(选填)</span>
              </div>
              <div class="elCtn">
                <el-input v-model="jiagongdanObj.desc" placeholder="备注信息"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr" @click="showProcessClient = false;jiagongdanList = []">取消</div>
          <div class="opr backHoverBlue" @click="confirmJiaGong(false)">确认发货</div>
          <div class="opr backHoverBlue" @click="confirmJiaGong('print')">确认并打印</div>
        </div>
      </div>
    </div>
    <div class="popup" v-show="showGuanLian">
      <div class="main">
        <div class="titleCtn">
          <div class="text">关联单据</div>
          <i class="el-icon-close" @click="showGuanLian = false"></i>
        </div>
        <div class="createCtn" style="max-height: 600px;overflow:scroll">
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">单据类型</div>
                <div class="tcolumn">单据编号</div>
                <div class="tcolumn">创建人</div>
                <div class="tcolumn">创建时间</div>
                <div class="tcolumn">操作</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow">
                <div class="tcolumn">采购并入库</div>
                <div class="tcolumn noPad" style="flex:4.5">
                  <div class="trow" v-for="item,index in caigouList" :key="index + '日志'">
                    <div class="tcolumn">{{item.code}}</div>
                    <div class="tcolumn">{{item.user_name}}</div>
                    <div class="tcolumn">{{$getDate(item.created_at)}}</div>
                    <div class="tcolumn hoverBlue" style="cursor:pointer" @click="$router.push('/directOrder/yarnDetail/'+item.related_id)">详情</div>
                  </div>
                  <div v-if="caigouList.length === 0" class="trow tc" style="align-items:center">
                    暂无单据
                  </div>
                </div>
              </div>
              <div class="trow">
                <div class="tcolumn">库存发货</div>
                <div class="tcolumn noPad" style="flex:4.5">
                  <div class="trow" v-for="item,index in kucunList" :key="index + '日志1'">
                    <div class="tcolumn">{{item.code}}</div>
                    <div class="tcolumn">{{item.user_name}}</div>
                    <div class="tcolumn">{{$getDate(item.created_at)}}</div>
                    <div class="tcolumn gray">暂无操作</div>
                  </div>
                  <div v-if="kucunList.length === 0" class="trow tc" style="align-items:center">
                    暂无单据
                  </div>
                </div>
              </div>
              <div class="trow">
                <div class="tcolumn">调取并加工</div>
                <div class="tcolumn noPad" style="flex:4.5">
                  <div class="trow" v-for="item,index in diaoquList" :key="index + '日志2'">
                    <div class="tcolumn">{{item.code}}</div>
                    <div class="tcolumn">{{item.user_name}}</div>
                    <div class="tcolumn">{{$getDate(item.created_at)}}</div>
                    <div class="tcolumn hoverBlue" style="cursor:pointer" @click="$router.push('/directProcess/yarnDetailNew/'+item.id)">详情</div>
                  </div>
                  <div v-if="kucunList.length === 0" class="trow tc" style="align-items:center">
                    暂无单据
                  </div>
                </div>
              </div>
              <div class="trow">
                <div class="tcolumn">加工回库</div>
                <div class="tcolumn noPad" style="flex:4.5">
                  <div class="trow" v-for="item,index in huikuList" :key="index + '日志3'">
                    <div class="tcolumn">{{item.code}}</div>
                    <div class="tcolumn">{{item.user_name}}</div>
                    <div class="tcolumn">{{$getDate(item.created_at)}}</div>
                    <div class="tcolumn gray">暂无操作</div>
                    <!-- <div class="tcolumn hoverBlue" style="cursor:pointer" v-if="item.action_type === 16" @click="$router.push('/directProcess/yarnDetailNew/'+item.id)">详情</div> -->
                  </div>
                  <div v-if="huikuList.length === 0" class="trow tc" style="align-items:center">
                    暂无单据
                  </div>
                </div>
              </div>
              <div class="trow">
                <div class="tcolumn">加工单发货</div>
                <div class="tcolumn noPad" style="flex:4.5">
                  <div class="trow" v-for="item,index in jiagsdjList" :key="index + '日志4'">
                    <div class="tcolumn">{{item.code}}</div>
                    <div class="tcolumn">{{item.user_name}}</div>
                    <div class="tcolumn">{{$getDate(item.created_at)}}</div>
                    <div class="tcolumn gray">暂无操作</div>
                  </div>
                  <div v-if="jiagsdjList.length === 0" class="trow tc" style="align-items:center">
                    暂无单据
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Order, CancelOrder } from '@/types/order'
import { StoreCreate } from '@/types/store'
import { order, deduct, stock, check } from '@/assets/js/api'

export default Vue.extend({
  data(): {
    order_info: Order
    cancel_order_info: CancelOrder
    [propName: string]: any
  } {
    return {
      loading: true,
      create_flag: false,
      showAddPO: false,
      showBack: false,
      showStore: false,
      chooseTrans: false,
      showKucunFahuo: false,
      showProcessClient: false,
      showGuanLian: false,
      yarnList: [],
      fahuoList: [],
      jiagongdanList: [],
      order_log_list: [],
      caigouList: [],
      kucunList: [],
      diaoquList: [],
      huikuList: [],
      jiagsdjList:[],
      fahuoListObj:{
        total_reality_weight:0,
        total_weight:0,
        total_action_weight:0,
        total_item:0,
      },
      fahuoObj:{
        desc:'',
        date: this.$getDate(new Date()),
      },
      jiagongdanObj:{
        desc:'',
        date: this.$getDate(new Date()),
      },
      shaxianInfo: {},
      process_info: {
        id: '',
        code: ''
      },
      deduct_show: false,
      cancel_date: '',
      cancel_reason: '',
      client_fee: '',
      user_name: '',
      postData: { key: '', token: '' },
      store_info: {
        show: false
      },
      deduct_info: {
        yarn: [],
        pid: 1,
        pcode: '',
        type: 1
      },
      final_out_log: [], // 发货出库信息
      order_cancel_log: [], // 订单取消结余入库
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
        product_info: [],
        total_additional_fee: 0
      },
      check_flag: false,
      check_detail_flag: false,
      total: {
        chengben_price: 0,
        daotong_weight: 0,
        daotong_price: 0,
        ranse_weight: 0,
        ranse_price: 0,
        pengsha_weight: 0,
        pengsha_price: 0
      },
      cancel_flag: false,
      cancel_step: 1,
      cancel_order_info: {
        order_id: '',
        cancel_reason: '',
        cancel_date: this.$getDate(new Date()),
        file: '',
        client_fee: '',
        document_type: 5,
        store_data: [
          {
            order_code: '',
            related_id: '',
            client_id: '',
            select_id: [],
            store_id: '',
            second_store_id: '',
            action_type: '',
            child_data: [
              {
                name: '',
                action_weight: '',
                color: '',
                attribute: '',
                batch_code: '',
                color_code: '',
                vat_code: '',
                item: ''
              }
            ],
            desc: '',
            complete_time: ''
          }
        ],
        deduct_data: {
          deduct_content: '',
          total_price: '',
          deduct_type: 5,
          pid: '',
          date: '',
          deduct_file: '',
          client_id: '',
          desc: ''
        }
      }
    }
  },
  computed: {
    token() {
      return this.$store.state.status.token
    },
    store_list() {
      return this.$store.state.api.storeHouse.arr
    }
  },
  methods: {
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
        }),
        order.cancelDetail({
          pid: this.$route.params.id,
          document_type: 5
        })
      ]).then((res) => {
        this.order_info = res[0].data.data
        this.order_info.product_info = this.$mergeData(this.order_info.product_info, {
          mainRule: 'product_name',
          childrenName: 'child_data',
          otherRule: [{ name: 'product_id' }]
        })
        // @ts-ignore
        this.order_info.total_purchase_weight = this.order_info.product_info
          .reduce((a: any, b: any) => {
            return a + (Number(b.total_purchase_weight) || 0)
          }, 0)
          .toFixed(1)
        // @ts-ignore
        this.order_info.total_transfer_weight = this.order_info.product_info
          .reduce((a: any, b: any) => {
            return a + (Number(b.total_transfer_weight) || 0)
          }, 0)
          .toFixed(1)
        this.order_info.product_info.forEach((item: any) => {
          let processArr: any[] = []
          item.total_purchase_weight = item.child_data.reduce((a: any, b: any) => {
            return a + (b.purchase_weight || 0)
          }, 0)
          item.total_transfer_weight = item.child_data.reduce((a: any, b: any) => {
            return a + (b.transfer_weight || 0)
          }, 0)
          // @ts-ignore
          this.order_info.transfer_log?.forEach((itemTrans: any) => {
            itemTrans.process_info.forEach((itemProcess: any) => {
              itemProcess.child_data.forEach((itemChild: any) => {
                // let obj = this.order_info.product_info.find((item:any) => {
                //   console.log(itemChild,item)
                //   return (
                //     itemChild.before_attribute === item.attribute &&
                //     itemChild.before_color === item.color &&
                //     itemChild.name === item.name
                //   )
                // })
                // console.log(obj)
                // if (obj) {
                //   // obj.weight = obj.action_weight
                //   // obj.action_weight = ''
                //   // this.fahuoList.push(obj)
                // } else {

                // }
                this.jiagongdanList.push({
                  action_weight: '',
                  attribute: itemChild.after_attribute || itemChild.before_attribute,
                  color: itemChild.after_color || itemChild.before_color,
                  name: itemChild.name,
                  client_name: itemProcess.client_name,
                  reality_weight: 0
                })
                const copy = this.$clone(itemChild)
                copy.type = itemProcess.type
                processArr.push(copy)
              })
            })
          })
          processArr = processArr.filter((itemFind) => itemFind.name === item.product_name)
          const processMerge = this.$mergeData(processArr, {
            mainRule: 'type',
            childrenName: 'child_data'
          })
          processMerge.forEach((itemChild: any) => {
            itemChild.total_price = itemChild.child_data.reduce((total: number, current: any) => {
              return total + Number(current.weight) * Number(current.price)
            }, 0)
            itemChild.total_weight = itemChild.child_data.reduce((total: number, current: any) => {
              return total + Number(current.weight)
            }, 0)
          })
          item.process_info = processMerge
        })
        this.order_info.product_info.forEach((item: any) => {
          item.process_info.forEach((itemChild: any) => {
            if (itemChild.type === '倒筒') {
              this.total.daotong_weight += itemChild.total_weight
              this.total.daotong_price += itemChild.total_price
            }
            if (itemChild.type === '染色') {
              this.total.ranse_weight += itemChild.total_weight
              this.total.ranse_price += itemChild.total_price
            }
            if (itemChild.type === '膨纱') {
              this.total.pengsha_weight += itemChild.total_weight
              this.total.pengsha_price += itemChild.total_price
            }
          })
        })
        this.deduct_list = res[1].data.data
        this.deduct_list.forEach((item: any) => {
          item.deduct_content = JSON.parse(item.deduct_content) || []
        })
        //  跟订单相关的有三种数据，一种是普通发货action_type:9,一种是无单据生成的订单，action_type:12，一种加工厂发货,还有订单结余入库action_type:15
        this.final_out_log = res[2].data.data.items.filter(
          (item: any) =>
            Number(item.client_id) === Number(this.order_info.client_id) &&
            (item.action_type === 9 || item.action_type === 12 || item.action_type === 18)
        )
        this.order_cancel_log = res[2].data.data.items.filter(
          (item: any) => Number(item.client_id) === Number(this.order_info.client_id) && item.action_type === 15
        )
        this.caigouList = res[2].data.data.items.filter((item: any) =>(item.action_type === 3))
        this.kucunList = res[2].data.data.items.filter((item: any) =>(item.action_type === 9))
        this.diaoquList = res[2].data.data.items.filter((item: any) =>(item.action_type === 16))
        this.huikuList = res[2].data.data.items.filter((item: any) =>(item.action_type === 17))
        this.jiagsdjList = res[2].data.data.items.filter((item: any) =>(item.action_type === 18))
        this.order_log_list = res[2].data.data.items
        if (this.order_info.status === 4) {
          if (res[3].data.data) {
            this.cancel_reason = res[3].data.data.cancel_reason
            this.cancel_date = res[3].data.data.cancel_date
            this.client_fee = res[3].data.data.client_fee
            this.user_name = res[3].data.data.user_name
          }
        }
        // console.log(this.order_info)
        this.shaxianInfo = {
          // @ts-ignore
          orderId: this.order_info.id,
          additional_fee: this.order_info.additional_fee || [{ name: '', price: '', desc: '' }],
          total_additional_fee: this.order_info.total_additional_fee,
          file_url: '',
          desc: '',
          order_time: this.$getDate(new Date()),
          delivery_time: this.$GetDateStr(5),
          client_id: '',
          total_price: '',
          child_data: []
        }
        this.yarnList = []
        this.order_info.product_info.forEach((item: any) => {
          this.yarnList.push({ label: item.product_name, value: item.product_name })
          item.child_data.forEach((itemChild: any) => {
            this.shaxianInfo.child_data.push({
              name: item.product_name,
              color: itemChild.color,
              attribute: itemChild.attribute,
              weight: '',
              price: ''
            })
          })
        })
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
        pcode: this.order_info.code,
        type: 5
      }
      this.deduct_show = true
    },
    confirmFahuo(print:any){
      if(!this.fahuoObj.date){
        this.$message.error('请选择发货日期')
        return
      }
      this.fahuoList.find((item:any) => {
        !item.action_weight?item.action_weight='0':''
      })
      this.fahuoList = this.fahuoList.filter((item:any) => {return item.action_weight !== '0' || !item.action_weight})
      let params = {
        second_store_id:this.fahuoList[0].second_store_id,
        store_id:this.fahuoList[0].store_id,
        desc: this.fahuoObj.desc,
        complete_time: this.fahuoObj.date,
        // @ts-ignore
        order_id: this.order_info.id,
        // @ts-ignore
        related_id:this.order_info.id,
        client_id: this.order_info.client_id,
        child_data: this.fahuoList,
        action_type: 9
      }
      stock.create({
        // @ts-ignore
        data:[params]
      }).then(res => {
        if(res.data.status){
          this.$message.success('创建成功')
          this.init()
          this.showKucunFahuo = false
          this.fahuoList = []
        }
      })
      if(print){
        // @ts-ignore
        this.$openUrl('/print/orderPrint?id='+this.order_info.id +'&printA4Type=false')
      }
    },
    confirmJiaGong(print:any){
      if(!this.jiagongdanObj.date){
        this.$message.error('请选择发货日期')
        return
      }
      this.jiagongdanList.find((item:any) => {
        !item.action_weight?item.action_weight='0':''
      })
      this.jiagongdanList = this.jiagongdanList.filter((item:any) => {return item.action_weight !== '0' || !item.action_weight})
      let params = {
        desc: this.jiagongdanObj.desc,
        complete_time: this.jiagongdanObj.date,
        // @ts-ignore
        order_id: this.order_info.id,
        // @ts-ignore
        related_id:this.order_info.id,
        client_id: this.order_info.client_id,
        child_data: this.jiagongdanList,
        action_type: 18
      }
      stock.create({
        // @ts-ignore
        data:[params]
      }).then(res => {
        if(res.data.status){
          this.$message.success('创建成功')
          this.init()
          this.showProcessClient = false
          this.jiagongdanList = []
        }
      })
      if(print){
        // @ts-ignore
        this.$openUrl('/print/orderPrint?id='+this.order_info.id +'&printA4Type=false')
      }
    },
    getYarnSelect(dataList: any) {
      // 库存发货
      let arr: any = []
      let arrOrder: any = []
      this.final_out_log.forEach((item: any) => {
        item.child_data.forEach((itemChild: any) => {
          arr.push(itemChild)
        })
      })
      this.order_info.product_info.forEach((item: any) => {
        item.child_data.forEach((itemChild: any) => {
          itemChild.name = item.product_name
          arrOrder.push(itemChild)
        })
      })
      dataList.forEach((item: any) => {
        let obj = arr.find((itemArr: any) => {
          return (
            itemArr.attribute === item.attribute &&
            item.color === itemArr.color &&
            item.vat_code === itemArr.vat_code &&
            item.color_code === itemArr.color_code &&
            item.batch_code === itemArr.batch_code &&
            item.name === itemArr.name
          )
        })
        let objOrder = arrOrder.find((itemArr: any) => {
          return (
            itemArr.attribute === item.attribute &&
            item.color === itemArr.color &&
            item.name === itemArr.name
          )
        })
        if (obj) {
          obj.store_name = item.store_name
          obj.second_store_name = item.second_store_name
          obj.store_id = item.store_id
          obj.second_store_id = item.second_store_id
          obj.reality_weight = objOrder.weight || 0
          obj.weight = arr.reduce((a:any,b:any) => {
            if(b.attribute === item.attribute &&
            item.color === b.color &&
            item.vat_code === b.vat_code &&
            item.color_code === b.color_code &&
            item.batch_code === b.batch_code &&
            item.name === b.name){
              return a + Number(b.action_weight)
            }
          },0)
          obj.action_weight = ''
          this.fahuoList.push(obj)
        } else {
          this.fahuoList.push({
            action_weight: '',
            attribute: item.attribute,
            color: item.color,
            batch_code: item.batch_code,
            vat_code: item.vat_code,
            color_code: item.color_code,
            name: item.name,
            store_name: item.store_name,
            second_store_name: item.second_store_name,
            store_id: item.store_id,
            second_store_id: item.second_store_id,
            weight: 0,
            reality_weight: objOrder?objOrder.weight : 0
          })
        }
      })
      this.getTotalInfo()
      this.showKucunFahuo = true
    },
    getTotalInfo(){
      this.fahuoListObj = {
        total_reality_weight:this.fahuoList.reduce((a:any,b:any) => {return a+(Number(b.reality_weight) || 0)},0),
        total_weight:this.fahuoList.reduce((a:any,b:any) => {return a+(Number(b.weight) || 0)},0),
        total_action_weight:this.fahuoList.reduce((a:any,b:any) => {return a+(Number(b.action_weight) || 0)},0),
        total_item:this.fahuoList.reduce((a:any,b:any) => {return a+(Number(b.item) || 0)},0),
      }
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
    },
    // 打开取消订单窗口
    openCancel() {
      // console.log(this.order_info)
      this.getStoreInPro()
      this.cancel_flag = true
    },
    // 确认取消
    cancelOrder() {
      // 结余入库数据过滤
      let storeData: StoreCreate[] = []
      let childData = []
      if ((this.cancel_order_info.store_data![0].select_id as number[]).length !== 0) {
        childData = this.cancel_order_info.store_data![0].child_data.filter(
          (item: any) => Number(item.action_weight) > 0
        )
        if (childData.length > 0) {
          storeData = [
            {
              order_code: this.order_info.code,
              order_id: this.$route.params.id,
              related_id: this.$route.params.id,
              client_id: this.order_info.client_id,
              store_id: (this.cancel_order_info.store_data as any)[0].select_id[0],
              second_store_id: (this.cancel_order_info.store_data as any)[0].select_id[1],
              action_type: 15,
              child_data: childData,
              desc: (this.cancel_order_info.store_data as any)[0].desc || '取消订单结余入库',
              complete_time: this.cancel_order_info.cancel_date
            }
          ]
        }
      }
      const fromData: CancelOrder = {
        pid: this.$route.params.id,
        document_type: 5,
        order_id: this.$route.params.id,
        cancel_reason: this.cancel_order_info.cancel_reason,
        cancel_date: this.cancel_order_info.cancel_date,
        file: this.cancel_order_info.file,
        client_fee: this.cancel_order_info.client_fee,
        store_data: storeData,
        deduct_data: {
          deduct_content: '',
          total_price: (Number(this.order_info.total_price) - Number(this.cancel_order_info.client_fee)).toFixed(1),
          deduct_type: 5,
          pid: this.$route.params.id,
          date: this.cancel_order_info.cancel_date,
          deduct_file: this.cancel_order_info.file,
          client_id: this.order_info.client_id,
          desc: this.cancel_order_info.cancel_reason ? this.cancel_order_info.cancel_reason : '取消订单扣款'
        }
      }
      order.cancel(fromData).then((res) => {
        if (res.data.status) {
          this.$message.success('订单已取消')
          this.cancel_flag = false
          this.init()
        }
      })
    },
    // 处理订单数据变成回库数据
    getStoreInPro() {
      this.cancel_order_info.store_data![0].child_data = []
      this.order_info.product_info.forEach((item: any) => {
        item.child_data.forEach((itemChild: any) => {
          this.cancel_order_info.store_data![0].child_data.push({
            name: item.product_name as string,
            action_weight: 0,
            color: itemChild.color,
            attribute: itemChild.attribute,
            batch_code: '',
            color_code: '',
            vat_code: '',
            item: ''
          })
        })
      })
    },
    deleteOrder() {
      this.$confirm('是否删除该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          order.delete({ id: this.$route.params.id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$router.push('/order/list?page=1&order_code=&product_name=&client_id=&user_id=&page_size=10&date=')
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
@import '~@/assets/less/order/detail.less';
.colCtn{
  margin-right: 15px!important;
}
</style>
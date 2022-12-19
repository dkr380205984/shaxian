<template>
  <div class="indexMain" id="clientDetail" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">供货商：</span>
            <span class="text blue">{{ client_info.client_name }}</span>
          </div>
          <div class="colCtn">
            <span class="label">简称：</span>
            <span class="text">{{ client_info.abbreviation || '无' }}</span>
          </div>
          <div class="colCtn">
            <span class="label">负责人：</span>
            <span class="text">{{ client_info.user_name || '无' }}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">电话：</span>
            <span class="text">{{ client_info.phone || '无' }}</span>
          </div>
          <div class="colCtn">
            <span class="label">联系人：</span>
            <span class="text">{{ client_info.contact || '无' }}</span>
          </div>
          <div class="colCtn">
            <span class="label">手机号：</span>
            <span class="text">{{ client_info.contact_phone || '无' }}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">公司地址：</span>
            <span class="text">{{ client_info.address || '无' }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">统计数据</span>
      </div>
      <div class="tableCtn" style="padding: 20px 32px 0 32px; margin: 0">
        <div class="thead">
          <div class="trow">
            <div class="tcolumn">总下单数量</div>
            <div class="tcolumn">总下单金额（含额外费用）</div>
            <div class="tcolumn">入库数量</div>
            <div class="tcolumn">总入库金额（含额外费用）</div>
          </div>
        </div>
        <div class="tbody" style="font-weight: bold; font-size: 16px">
          <div class="trow">
            <div class="tcolumn">{{ $toFixed(client_info.total_weight, 2, true) || 0 }}kg</div>
            <div class="tcolumn">
              {{ $toFixed(client_info.total_price, 2, true) || 0 }}元 (含额外费用
              {{ $toFixed(client_info.total_other_fee, 2, true) }}元)
            </div>
            <div class="tcolumn">{{ $toFixed(client_info.real_total_weight, 2, true) || 0 }}kg</div>
            <div class="tcolumn">
              {{ $toFixed(client_info.real_total_price, 2, true) || 0 }}元 (含额外费用
              {{ $toFixed(client_info.total_other_fee, 2, true) }}元)
            </div>
          </div>
        </div>
      </div>
      <div class="tableCtn" style="padding: 20px 32px 20px 32px; margin: 0">
        <div class="thead">
          <div class="trow">
            <div class="tcolumn">我方扣款</div>
            <div class="tcolumn">开票总额</div>
            <div class="tcolumn">付款总额</div>
            <div class="tcolumn">我方欠款</div>
          </div>
        </div>
        <div class="tbody" style="font-weight: bold; font-size: 16px">
          <div class="trow">
            <div class="tcolumn red">{{ $toFixed(client_info.deduct_total_price, 2, true) || 0 }}元</div>
            <div class="tcolumn">{{ $toFixed(client_info.invoice_total_price, 2, true) || 0 }}元</div>
            <div class="tcolumn">{{ $toFixed(client_info.collection_total_price, 2, true) || 0 }}元</div>
            <div class="tcolumn red">
              {{
                $toFixed(
                  client_info.real_total_price - client_info.collection_total_price - client_info.deduct_total_price,
                  2,
                  true
                ) || 0
              }}元
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <el-tabs type="border-card">
        <el-tab-pane label="入库信息">
          <div class="titleCtn" style="padding: 0 17px">
            <span class="title">入库信息</span>
            <span class="addBtn btn btnMain" @click="getPurchaseList(updatePriceInfo.date)">修改订购单价</span>
          </div>
          <div class="listCtn" style="padding: 20px 17px">
            <div class="filterCtn">
              <div class="leftCtn" style="max-width: unset; padding: unset">
                <div class="label">筛选条件：</div>
                <div class="elCtn">
                  <el-input v-model="stockObj.stock_code" placeholder="输入入库单号" @change="getStockList"></el-input>
                </div>
                <div class="elCtn">
                  <el-input
                    v-model="stockObj.order_code"
                    placeholder="输入关联订单号"
                    @change="getStockList"
                  ></el-input>
                </div>
                <div class="elCtn">
                  <el-input
                    v-model="stockObj.purchase_code"
                    placeholder="关联采购号"
                    @change="getStockList"
                    clearable
                  ></el-input>
                </div>
                <div class="elCtn" style="width: 120px">
                  <el-input v-model="stockObj.batch_code" placeholder="批号" @change="getStockList"></el-input>
                </div>
                <div class="elCtn" style="width: 120px">
                  <el-input v-model="stockObj.color_code" placeholder="色号" @change="getStockList"></el-input>
                </div>
                <div class="elCtn" style="width: 120px">
                  <el-input v-model="stockObj.vat_code" placeholder="缸号" @change="getStockList"></el-input>
                </div>
              </div>
              <div class="rightCen">
                <div class="btn btnGray fr" @click="resetStockObj">重置</div>
              </div>
            </div>
            <div class="filterCtn" style="margin-top: 10px">
              <div class="leftCtn" style="max-width: unset; padding: unset">
                <div class="elCtn">
                  <el-cascader
                    v-model="stockObj.name"
                    filterable
                    clearable
                    :show-all-levels="false"
                    placeholder="请选择纱线"
                    :options="yarn_list"
                    @change="getStockList"
                  ></el-cascader>
                </div>
                <div class="elCtn">
                  <el-select v-model="stockObj.user_id" placeholder="选择操作人" clearable @change="getStockList">
                    <el-option v-for="item in user_list" :key="item.id" :value="item.id" :label="item.name"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-cascader
                    v-model="stockObj.LV2_name"
                    :options="store_list"
                    clearable
                    @change="getStockList"
                    :props="{ value: 'id', label: 'name', children: 'second_data' }"
                    placeholder="请选择仓库"
                  >
                  </el-cascader>
                </div>
                <div class="elCtn" style="width: unset">
                  <el-date-picker
                    v-model="stockObj.date"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    @change="getStockList"
                  >
                  </el-date-picker>
                </div>
              </div>
            </div>
            <div class="list">
              <div class="overflow" @mousewheel.prevent="listenWheel" ref="list">
                <div class="tableCtn">
                  <div class="table">
                    <div class="headCtn">
                      <div class="row">
                        <div class="column min120">入库时间</div>
                        <div class="column min120">入库单号</div>
                        <div class="column min120">关联订单号</div>
                        <div class="column min120">关联采购单号</div>
                        <div class="column noPad">
                          <div class="row">
                            <div class="column min120">纱线名称</div>
                            <div class="column min120">纱线颜色</div>
                            <div class="column min120">纱线属性</div>
                            <div class="column min120">数量属性</div>
                            <div class="column min120">批/色/缸号</div>
                            <div class="column min120">入库仓库</div>
                            <div class="column min120">单价(元)</div>
                            <div class="column min120">数量</div>
                            <div class="column min120">件数</div>
                            <div class="column min120">小计(元)</div>
                          </div>
                        </div>
                        <div class="column min120">入库备注</div>
                        <div class="column min120">操作人</div>
                        <div class="column min120">操作时间</div>
                        <div class="column min120">操作</div>
                      </div>
                    </div>
                    <div class="bodyCtn">
                      <div class="row" v-for="(item, index) in stock_list" :key="index + '入库'">
                        <div class="column min120">{{ item.complete_time }}</div>
                        <div class="column min120">{{ item.code }}</div>
                        <div
                          class="column min120 hoverBlue"
                          v-if="item.order_code"
                          @click="$router.push('/order/detail/' + item.order_id)"
                          style="cursor: pointer"
                        >
                          {{ item.order_code }}
                        </div>
                        <div class="column min120 gray" v-else style="cursor: default">无关联订单</div>
                        <div
                          class="column min120"
                          @click="$router.push('/directOrder/yarnDetail/' + item.related_id)"
                          :class="item.related_info ? 'hoverBlue' : 'gray'"
                          :style="item.related_info ? 'cursor:pointer' : 'cursor:default'"
                        >
                          {{ item.related_info ? item.related_info.code : '无关联采购单' }}
                        </div>
                        <div class="column noPad" style="flex-direction: column">
                          <div
                            class="row"
                            v-for="(itemChild, indexChild) in item.child_data"
                            :key="indexChild + '入库二级'"
                          >
                            <div class="column min120">{{ itemChild.name }}</div>
                            <div class="column min120">{{ itemChild.color }}</div>
                            <div class="column min120">{{ itemChild.attribute }}</div>
                            <div class="column min120">{{ itemChild.number_attribute || '无' }}</div>
                            <div class="column min120">
                              {{ itemChild.batch_code }}/{{ itemChild.color_code }}/{{ itemChild.vat_code }}
                            </div>
                            <div class="column min120">{{ item.store_name }}/{{ item.second_store_name }}</div>
                            <div class="column min120">
                              {{ itemChild.purchase_info ? itemChild.purchase_info.price : '0.00' }}
                            </div>
                            <div class="column min120">{{ itemChild.action_weight }}</div>
                            <div class="column min120">{{ itemChild.item || 0 }}</div>
                            <div class="column min120">
                              {{
                                (
                                  (itemChild.action_weight || 0) *
                                  (itemChild.purchase_info ? itemChild.purchase_info.price : 0)
                                ).toFixed(2)
                              }}
                            </div>
                          </div>
                        </div>
                        <div class="column min120">{{ item.desc || '无' }}</div>
                        <div class="column min120">{{ item.user_name }}</div>
                        <div class="column min120">{{ $getDate(item.create_time) }}</div>
                        <div
                          class="column min120 hoverBlue"
                          style="cursor: pointer"
                          @click="$openUrl('/print/transPrint?id=' + item.related_id)"
                        >
                          打印
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="coverTable">
                <div class="floatL">
                  <div class="headCtn">
                    <div class="row">
                      <div class="column min120">入库时间</div>
                      <div class="column min120">入库单号</div>
                      <div class="column min120">关联订单号</div>
                      <div class="column min120">关联采购单号</div>
                    </div>
                  </div>
                  <div class="bodyCtn">
                    <div class="row" v-for="(item, index) in stock_list" :key="index + '入库←'">
                      <div class="column min120">{{ item.complete_time }}</div>
                      <div
                        class="column min120"
                        v-if="item.related_id"
                        style="cursor: pointer"
                        @click="$router.push('/directOrder/yarnDetail/' + item.related_id)"
                      >
                        {{ item.code }}
                      </div>
                      <div class="column min120" v-else>{{ item.code }}</div>
                      <div
                        class="column min120 hoverBlue"
                        v-if="item.order_code"
                        @click="$router.push('/order/detail/' + item.order_id)"
                        style="cursor: pointer"
                      >
                        {{ item.order_code }}
                      </div>
                      <div class="column min120 gray" v-else style="cursor: default">无关联订单</div>
                      <div
                        class="column min120"
                        @click="$router.push('/directOrder/yarnDetail/' + item.related_id)"
                        :class="item.related_info ? 'hoverBlue' : 'gray'"
                        :style="item.related_info ? 'cursor:pointer' : 'cursor:default'"
                      >
                        {{ item.related_info ? item.related_info.code : '无关联采购单' }}
                      </div>
                      <div class="column noPad" style="width: 0; overflow: hidden; flex-direction: column">
                        <div
                          class="row"
                          v-for="(itemChild, indexChild) in item.child_data"
                          :key="indexChild + '入库二级←'"
                        >
                          <div class="column min120">{{ itemChild.name }}</div>
                        </div>
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
                    <div class="row" v-for="(item, index) in stock_list" :key="index + '入库→'">
                      <div class="column noPad" style="width: 0; overflow: hidden; flex-direction: column">
                        <div
                          class="row"
                          v-for="(itemChild, indexChild) in item.child_data"
                          :key="indexChild + '入库二级→'"
                        >
                          <div class="column min120">{{ itemChild.name }}</div>
                        </div>
                      </div>
                      <div
                        class="column min120 hoverBlue"
                        style="cursor: pointer"
                        @click="$openUrl('/print/inStore?id=' + item.id)"
                      >
                        打印
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="green" style="display: flex; font-weight: bold">
              <div>合计总价：{{ $toFixed(stock_statistics.total_price, 2, true) }} 元</div>
              <div style="margin-left: 20px">合计总数：{{ $toFixed(stock_statistics.total_number, 2, true) }} kg</div>
            </div>
            <div class="pageCtn">
              <el-pagination
                background
                :current-page.sync="stock_page"
                :page-size="5"
                layout="prev, pager, next"
                :total="stock_total"
                @current-change="getStockList"
              >
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="额外费用">
          <div class="titleCtn" style="padding: 0 17px">
            <span class="title">额外费用</span>
          </div>
          <div class="listCtn" style="padding: 20px 17px">
            <div class="list">
              <div class="tableCtn">
                <div class="table">
                  <div class="headCtn">
                    <div class="row">
                      <div class="column">采购单号</div>
                      <div class="column">下单时间</div>
                      <div class="column noPad" style="flex: 3">
                        <div class="row">
                          <div class="column">额外费用名称</div>
                          <div class="column">额外费用金额</div>
                          <div class="column">额外费用备注</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bodyCtn">
                    <div class="row" v-for="(item, index) in client_info.others_fee" :key="index + '额外费用'">
                      <div class="column">{{ item.code }}</div>
                      <div class="column">{{ item.order_time }}</div>
                      <div class="column noPad" style="flex: 3; flex-direction: column">
                        <div
                          class="row"
                          v-for="(itemFee, indexFee) in item.others_fee"
                          :key="indexFee + '额外费用子集'"
                        >
                          <div class="column">{{ itemFee.name || '无' }}</div>
                          <div class="column">{{ Number(itemFee.price).toFixed(2) || '0.00' }} 元</div>
                          <div class="column">{{ itemFee.desc || '无' }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="row" style="background: #f4f4f4">
                      <div class="column">合计</div>
                      <div class="column"></div>
                      <div class="column noPad" style="flex: 3">
                        <div class="column"></div>
                        <div class="column">{{ client_info.total_other_fee }}元</div>
                        <div class="column"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">开票单据</span>
        <span class="addBtn btn btnMain" @click="show_bill = true">新增开票</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="bill_code" placeholder="输入单号按回车键搜索" @change="getBillList"></el-input>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">开票单号</div>
              <div class="column">发票号码</div>
              <div class="column">开票金额</div>
              <div class="column">发票图片</div>
              <div class="column">备注</div>
              <div class="column">日期</div>
              <div class="column">操作人</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row" v-for="item in bill_list" :key="item.id">
              <div class="column">{{ item.code }}</div>
              <div class="column">{{ item.invoice_code }}</div>
              <div class="column">{{ item.invoice_price }}</div>
              <div class="column">
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
              <div class="column">{{ item.desc }}</div>
              <div class="column">{{ item.invoice_date }}</div>
              <div class="column">{{ item.user_name }}</div>
              <div class="column">
                <div class="opr blue">打印</div>
                <div class="opr red" @click="deleteLog('开票', item.id)">删除</div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination
            background
            :current-page.sync="bill_page"
            :page-size="5"
            layout="prev, pager, next"
            :total="bill_total"
            @current-change="getBillList"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">付款单据</span>
        <span class="addBtn btn btnMain" @click="show_collection = true">新增付款</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input
                v-model="collection_code"
                placeholder="输入单号按回车键搜索"
                @change="getCollectionList"
              ></el-input>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">付款单号</div>
              <div class="column">付款方式</div>
              <div class="column">付款金额</div>
              <div class="column">付款凭据</div>
              <div class="column">备注</div>
              <div class="column">日期</div>
              <div class="column">操作人</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row" v-for="item in collection_list" :key="item.id">
              <div class="column">{{ item.code }}</div>
              <div class="column">{{ item.type }}</div>
              <div class="column">{{ item.collect_price }}</div>
              <div class="column">
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
              <div class="column">{{ item.desc }}</div>
              <div class="column">{{ item.invoice_date }}</div>
              <div class="column">{{ item.user_name }}</div>
              <div class="column">
                <div class="opr blue">打印</div>
                <div class="opr red" @click="deleteLog('付款', item.id)">删除</div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination
            background
            :current-page.sync="collection_page"
            :page-size="5"
            layout="prev, pager, next"
            :total="collection_total"
            @current-change="getCollectionList"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">扣款单据</span>
        <span class="addBtn btn btnMain" @click="show_deduct = true">新增扣款</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="deduct_code" placeholder="输入单号按回车键搜索" @change="getDeductList"></el-input>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">扣款单号</div>
              <div class="column">扣款金额</div>
              <div class="column">图片说明</div>
              <div class="column">备注信息</div>
              <div class="column">日期</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row" v-for="item in deduct_list" :key="item.id">
              <div class="column blue">{{ item.code }}</div>
              <div class="column red">{{ item.total_price }}元</div>
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
              <div class="column">{{ item.desc }}</div>
              <div class="column">{{ item.date }}</div>
              <div class="column">
                <div class="opr blue" @click="$openUrl('/print/deductPrint?id=' + item.id)">打印</div>
                <div class="opr red" @click="deleteLog('扣款', item.id)">删除</div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination
            background
            :current-page.sync="deduct_page"
            :page-size="5"
            layout="prev, pager, next"
            :total="deduct_total"
            @current-change="getDeductList"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray" @click="$router.go(-1)">返回</div>
          <div class="buttonList" style="margin-left: 12px">
            <div class="showButton">
              <i class="el-icon-s-grid"></i>
              <span class="text">导出报表</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="button btnBlue" @click="exportExcel('purchase')">
                  <i class="iconfont">&#xe636;</i>
                  <span class="text">入库报表</span>
                </div>
                <!-- <div class="button btnBlue"
                  @click="exportExcel('store')">
                  <i class="iconfont">&#xe636;</i>
                  <span class="text">仓库报表</span>
                </div> -->
                <div class="button btnBlue" @click="exportExcel('invoice')">
                  <i class="iconfont">&#xe636;</i>
                  <span class="text">开票报表</span>
                </div>
                <div class="button btnBlue" @click="exportExcel('collection')">
                  <i class="iconfont">&#xe636;</i>
                  <span class="text">付款报表</span>
                </div>
                <div class="button btnBlue" @click="exportExcel('deduct')">
                  <i class="iconfont">&#xe636;</i>
                  <span class="text">扣款报表</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup" v-show="excel_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">导出Excel</span>
          <i class="close_icon el-icon-close" @click="excel_flag = false"></i>
        </div>
        <div class="contentCtn">
          <div class="content">
            <div class="label">请选择要导出的时间段：</div>
            <el-date-picker
              v-model="excel_date"
              type="daterange"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr" @click="excel_flag = false">取消</div>
          <div class="opr blue" @click="getExcel">导出</div>
        </div>
      </div>
    </div>
    <bill :data="{ type: 1, client_id: $route.params.id, myType: 2 }" :show.sync="show_bill" @afterBill="init"></bill>
    <deduct
      :data="{ type: 1, client_id: $route.params.id, myType: 2 }"
      :show.sync="show_deduct"
      @afterDeduct="init"
    ></deduct>
    <collection
      :data="{ type: 1, client_id: $route.params.id }"
      :show.sync="show_collection"
      @afterCollection="init"
      :collectType="2"
    ></collection>
    <!-- 批量修改调取单价功能 -->
    <div class="popup" id="updatePrice" v-show="updatePriceFlag">
      <div class="main" style="width: 1200px">
        <div class="titleCtn">
          <span class="text">批量修改订购单价</span>
          <div class="closeCtn" @click="updatePriceFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="explainCtn" style="margin-left: unset; margin-right: unset">
            <p>1.必须筛选日期跨度尽量不要超过一年</p>
            <p>2.点击提交后只会更新重新填写的订购单价</p>
          </div>
          <div class="listCtn" style="padding: 20px 0">
            <div class="filterCtn" style="margin-bottom: 20px; display: block">
              <div class="elCtn" style="width: 200px; display: inline-block; margin-right: 16px">
                <el-autocomplete
                  v-model="updatePriceInfo.name"
                  :fetch-suggestions="searchMaterialNew"
                  placeholder="物料名称搜索"
                  @keydown.native.enter="getMatShowList"
                  @select="getMatShowList"
                  @clear="getMatShowList"
                  clearable
                ></el-autocomplete>
              </div>
              <div class="elCtn" style="width: 200px; display: inline-block; margin-right: 16px">
                <el-autocomplete
                  :fetch-suggestions="searchAttribute"
                  v-model="updatePriceInfo.attribute"
                  placeholder="物料属性"
                  @keydown.native.enter="getMatShowList"
                  @change="getMatShowList"
                  clearable
                ></el-autocomplete>
              </div>
              <div class="elCtn" style="width: 200px; display: inline-block; margin-right: 16px">
                <el-select v-model="updatePriceInfo.color" placeholder="请选择种类" clearable @change="getMatShowList">
                  <el-option label="色纱" value="色纱"></el-option>
                  <el-option label="白胚" value="白胚"></el-option>
                </el-select>
              </div>
              <div class="elCtn" style="width: 250px; display: inline-block; margin-right: 16px">
                <el-date-picker
                  v-model="updatePriceInfo.date"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  @click="getPurchaseList(updatePriceInfo.date)"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">日期</div>
                  <div class="tcolumn noPad" style="flex: 9">
                    <div class="trow">
                      <div class="tcolumn">原料名称</div>
                      <div class="tcolumn">颜色</div>
                      <div class="tcolumn">属性</div>
                      <div class="tcolumn">订购单价</div>
                      <div class="tcolumn">订购总数</div>
                      <div class="tcolumn">修改单价</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow" v-if="this.updatePriceOriginList.length === 0">
                  <div class="tcolumn red" style="text-align: center">请筛选日期后搜索纱线数据</div>
                </div>
                <div class="trow" v-for="(item, index) in updatePriceShowList" :key="index">
                  <div class="tcolumn">{{ item.created_at }}</div>
                  <div class="tcolumn noPad" style="flex: 9">
                    <div class="trow" v-for="(itemChild, indexChild) in item.realChildren" :key="indexChild">
                      <div class="tcolumn">{{ itemChild.name || '无' }}</div>
                      <div class="tcolumn">{{ itemChild.color }}</div>
                      <div class="tcolumn">{{ itemChild.attribute }}</div>
                      <div class="tcolumn blue">{{ itemChild.old_price }}元/kg</div>
                      <div class="tcolumn">{{ itemChild.number }}kg</div>
                      <div class="tcolumn blue">
                        <div class="elCtn">
                          <el-input placeholder="单价" v-model="itemChild.price">
                            <template slot="append">元/kg</template>
                          </el-input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn" @click="updatePriceFlag = false">取消</span>
          <span class="btn backHoverBlue" @click="saveUpdatePrice">提交更新</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { deduct, bill, collection, finance, yarnOrder, stock, exportExcel, lostEdit } from '@/assets/js/api'
import { DeductInfo, BillInfo, CollectionInfo } from '@/types/common'
export default Vue.extend({
  data(): {
    excel_type: 'purchase' | 'deduct' | 'invoice' | 'collection'
    deduct_list: DeductInfo[]
    bill_list: BillInfo[]
    collection_list: CollectionInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      excel_flag: false,
      excel_date: [new Date().getFullYear() + '-01-01', this.$getDate(new Date())],
      excel_type: 'purchase',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      client_info: {
        name: '',
        abbreviation: '',
        address: '',
        contact: '',
        contact_phone: '',
        phone: '',
        user_name: '',
        total_price: 0,
        total_weight: 0,
        total_other_fee: 0,
        real_total_weight: 0,
        real_total_price: 0,
        deduct_total_price: 0,
        invoice_total_price: 0
      },
      updatePriceFlag: false,
      updatePriceInfo: {
        name: '',
        color: '',
        attribute: '',
        start_time: '',
        end_time: '',
        date: [],
        client_id: this.$route.params.id
      },
      updatePriceYarnList: [],
      updatePriceShowList: [],
      updatePriceOriginList: [],
      yarnAttributeList: [
        {
          label: '绞纱',
          value: '绞纱'
        },
        {
          label: '筒纱',
          value: '筒纱'
        }
      ],
      stockObj: {
        date: [new Date().getFullYear() + '-01-01', new Date().getFullYear() + '-12-31'],
        order_code: '',
        purchase_code: '',
        LV2_name: [],
        stock_code: '',
        name: '',
        batch_code: '',
        color_code: '',
        vat_code: '',
        user_id: ''
      },
      show_bill: false,
      show_deduct: false,
      show_collection: false,
      deduct_list: [],
      deduct_total: 1,
      deduct_page: 1,
      deduct_code: '',
      bill_list: [],
      bill_total: 1,
      bill_page: 1,
      bill_code: '',
      collection_list: [],
      collection_total: 1,
      collection_page: 1,
      collection_code: '',
      order_list: [],
      order_page: 1,
      order_total: 1,
      order_code: '',
      stock_list: [],
      stock_page: 1,
      stock_total: 1,
      stock_code: '',
      stock_statistics: {
        total_pop: 0,
        total_push: 0,
        total_price: 0,
        total_number: 0
      }
    }
  },
  methods: {
    init() {
      this.updatePriceInfo.date = [new Date().getFullYear() + '-01-01', this.$formatDate(new Date())]
      this.loading = true
      Promise.all([
        deduct.list({
          client_id: this.$route.params.id,
          limit: 5,
          page: this.deduct_page
        }),
        bill.list({
          client_id: this.$route.params.id,
          limit: 5,
          page: this.bill_page
        }),
        collection.list({
          client_id: this.$route.params.id,
          limit: 5,
          page: this.collection_page
        }),
        finance.clientDetail({
          id: Number(this.$route.params.id)
        }),
        yarnOrder.list({
          client_id: this.$route.params.id,
          limit: 2,
          page: this.order_page
        }),
        stock.list({
          client_id: this.$route.params.id,
          action_type: [1, 3, 8, 11, 13, 15, 17],
          limit: 5,
          page: this.stock_page
        })
      ]).then((res) => {
        this.deduct_list = res[0].data.data.items
        this.deduct_total = res[0].data.data.total
        this.bill_list = res[1].data.data.items
        this.bill_total = res[1].data.data.total
        this.collection_list = res[2].data.data.items
        this.collection_total = res[2].data.data.total
        res[3].data.data.total_other_fee = res[3].data.data.others_fee.reduce((a: any, b: any) => {
          return (
            a +
            b.others_fee.reduce((a1: any, b1: any) => {
              return a1 + (Number(b1.price) || 0)
            }, 0)
          )
        }, 0)
        this.client_info = res[3].data.data
        this.order_list = res[4].data.data?.items
        this.order_total = res[4].data.data?.total
        this.stock_list = res[5].data.data.items
        this.stock_total = res[5].data.data.total
        this.stock_statistics = res[5].data.data.additional
        this.loading = false
      })
    },
    resetStockObj() {
      this.stockObj = {
        date: [new Date().getFullYear() + '-01-01', new Date().getFullYear() + '-12-31'],
        order_code: '',
        purchase_code: '',
        LV2_name: [],
        stock_code: '',
        name: '',
        batch_code: '',
        color_code: '',
        vat_code: '',
        user_id: ''
      }
      this.getStockList()
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
    deleteLog(type: string, id: number) {
      this.$confirm('是否删除该日志?', '提示', {
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
          } else if (type === '付款') {
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getDeductList() {
      this.loading = true
      deduct
        .list({
          client_id: this.$route.params.id,
          limit: 5,
          code: this.deduct_code,
          page: this.deduct_page
        })
        .then((res) => {
          this.deduct_list = res.data.data.items
          this.deduct_total = res.data.data.total
          this.loading = false
        })
    },
    getBillList() {
      this.loading = true
      bill
        .list({
          client_id: this.$route.params.id,
          limit: 5,
          code: this.bill_code,
          page: this.bill_page
        })
        .then((res) => {
          this.bill_list = res.data.data.items
          this.bill_total = res.data.data.total
          this.loading = false
        })
    },
    getCollectionList() {
      this.loading = true
      collection
        .list({
          client_id: this.$route.params.id,
          limit: 5,
          code: this.collection_code,
          page: this.collection_page
        })
        .then((res) => {
          this.collection_list = res.data.data.items
          this.collection_total = res.data.data.total
          this.loading = false
        })
    },
    getOrderList() {
      this.loading = true
      yarnOrder
        .list({
          client_id: this.$route.params.id,
          limit: 5,
          code: this.order_code,
          page: this.order_page
        })
        .then((res) => {
          this.order_list = res.data.data.items
          this.order_total = res.data.data.total
          this.loading = false
        })
    },
    getStockList() {
      this.loading = true
      this.stockObj.date = this.stockObj.date
        ? this.stockObj.date
        : [new Date().getFullYear() + '-01-01', new Date().getFullYear() + '-12-31']

      stock
        .list({
          action_type: [1, 3, 8, 11, 13, 15],
          client_id: this.$route.params.id,
          limit: 5,
          name: this.stockObj.name[1] || '',
          user_id: this.stockObj.user_id || '',
          batch_code: this.stockObj.batch_code,
          color_code: this.stockObj.color_code,
          vat_code: this.stockObj.vat_code,
          store_id: this.stockObj.LV2_name[0],
          second_store_id: this.stockObj.LV2_name[1],
          start_time: this.stockObj.date[0],
          end_time: this.stockObj.date[1],
          page: this.stock_page,
          order_code: this.stockObj.order_code,
          purchase_code: this.stockObj.purchase_code,
          code: this.stockObj.stock_code
        })
        .then((res) => {
          this.stock_list = res.data.data.items
          this.stock_total = res.data.data.total
          this.loading = false
        })
    },
    exportExcel(type: 'purchase' | 'deduct' | 'invoice' | 'collection') {
      this.excel_flag = true
      this.excel_type = type
    },
    getPurchaseList(date: any) {
      this.updatePriceFlag = true
      lostEdit
        .purchaseList({
          client_id: this.updatePriceInfo.client_id,
          start_time: date[0],
          end_time: date[1]
        })
        .then((res) => {
          if (res.data.status) {
            res.data.data.forEach((item: any) => {
              item.number = Number(item.number)
              item.old_price = Number(item.price)
              item.price = ''
              this.updatePriceYarnList.push(item)
            })
            this.updatePriceYarnList = Array.from(new Set(this.updatePriceYarnList.map((item: any) => item.name))).map(
              (item) => {
                return {
                  value: item
                }
              }
            )
            const mergeList = this.$mergeData(res.data.data, {
              mainRule: 'created_at',
              childrenRule: {
                mainRule: ['name', 'attribute', 'old_price']
              }
            })
            mergeList.forEach((item: any) => {
              item.childrenMergeInfo.forEach((itemChild: any) => {
                itemChild.baipeiNum = itemChild.childrenMergeInfo
                  .filter((itemMin: any) => itemMin.color === '白胚')
                  .reduce((total: number, cur: any) => {
                    return total + Number(cur.weight)
                  }, 0)
                itemChild.seshaNum = itemChild.childrenMergeInfo
                  .filter((itemMin: any) => itemMin.color !== '白胚')
                  .reduce((total: number, cur: any) => {
                    return total + Number(cur.weight)
                  }, 0)
              })
              item.realChildren = []
              item.childrenMergeInfo.forEach((itemChild: any) => {
                if (itemChild.baipeiNum > 0) {
                  item.realChildren.push({
                    name: itemChild.name,
                    old_price: itemChild.old_price,
                    price: '',
                    attribute: itemChild.attribute,
                    number: itemChild.baipeiNum,
                    color: '白胚'
                  })
                }
                if (itemChild.seshaNum > 0) {
                  item.realChildren.push({
                    name: itemChild.name,
                    old_price: itemChild.old_price,
                    price: '',
                    attribute: itemChild.attribute,
                    number: itemChild.seshaNum,
                    color: '色纱'
                  })
                }
              })
            })
            this.updatePriceOriginList = mergeList
            this.updatePriceFlag = true
            this.getMatShowList()
          }
        })
    },
    // 前端做筛选
    getMatShowList() {
      this.updatePriceShowList = this.$clone(this.updatePriceOriginList).filter((item: any) => {
        item.realChildren = item.realChildren.filter((itemChild: any) => {
          let nameFlag =
            this.updatePriceInfo.name && itemChild.name
              ? itemChild.name.toLowerCase().indexOf(this.updatePriceInfo.name.toLowerCase()) === 0
              : true
          let attrFlag = this.updatePriceInfo.attribute
            ? itemChild.attribute.toLowerCase().indexOf(this.updatePriceInfo.attribute.toLowerCase()) === 0
            : true
          let colorFlag = this.updatePriceInfo.color
            ? itemChild.color.toLowerCase().indexOf(this.updatePriceInfo.color.toLowerCase()) === 0
            : true
          return nameFlag && attrFlag && colorFlag
        })
        return item.realChildren.length > 0
      })
    },
    searchMaterialNew(str: string, cb: any) {
      let results = str ? this.updatePriceYarnList.filter(this.createFilter(str)) : this.updatePriceYarnList
      cb(results)
    },
    // 原料属性搜索
    searchAttribute(str: string, cb: any) {
      let results = str ? this.yarnAttributeList.filter(this.createFilter(str)) : this.yarnAttributeList
      cb(results)
    },
    createFilter(queryString: string) {
      return (restaurant: any) => {
        return restaurant.value && restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    saveUpdatePrice() {
      const formData: any[] = []
      this.updatePriceShowList.forEach((item: any) => {
        item.realChildren.forEach((itemChild: any) => {
          if (itemChild.price) {
            formData.push({
              name: itemChild.name,
              color: itemChild.color,
              attribute: itemChild.attribute,
              old_price: itemChild.old_price,
              price: itemChild.price,
              start_time: this.updatePriceInfo.date[0],
              end_time: this.updatePriceInfo.date[1],
              client_id: this.$route.params.id
            })
          }
        })
      })
      if (formData.length > 0) {
        lostEdit.purchaseEdit({ data: formData }).then((res) => {
          if (res.data.status) {
            this.$message.success('修改成功')
            this.init()
          }
          this.updatePriceInfo = {
            name: '',
            color: '',
            attribute: '',
            start_time: '',
            end_time: '',
            date: [new Date().getFullYear() + '-01-01', this.$formatDate(new Date())],
            client_id: this.$route.params.id
          }
          this.updatePriceOriginList = []
          this.updatePriceShowList = []
          this.updatePriceFlag = false
        })
      } else {
        this.$message.error('请填写单价')
      }
    },
    getExcel() {
      if (this.excel_date.length === 0) {
        this.$message.error('请选择日期范围')
        return
      }
      this.$message.success('正在导出Excel')

      let param: any = {
        client_id: this.$route.params.id,
        start_time: this.excel_date[0],
        end_time: this.excel_date[1]
      }

      if (this.excel_type === 'purchase') {
        param.action_type = [1, 3, 8, 11, 13, 15]
        param.export_excel = 1
        stock.list(param).then((res) => {
          this.excel_flag = false
          this.$downLoadFile(res.data.data)
        })
        return
      }

      exportExcel[this.excel_type]({
        client_id: this.$route.params.id,
        start_time: this.excel_date[0],
        end_time: this.excel_date[1]
      }).then((res) => {
        if (res.data.status) {
          this.excel_flag = false
          this.$downLoadFile(res.data.data)
        }
      })
    }
  },
  computed: {
    yarn_list() {
      return this.$store.state.api.yarnType.arr.map((item: any) => {
        return {
          value: item.name,
          label: item.name,
          children: item.yarns.map((itemChild: any) => {
            return {
              value: itemChild.name,
              label: itemChild.name
            }
          })
        }
      })
    },
    user_list() {
      return this.$store.state.api.user.arr
    },
    store_list() {
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 1)
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      },
      {
        checkWhich: 'api/storeHouse',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getStoreAsync'
      },
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      }
    ])
    this.init()
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/less/finance/clientDetail.less';
</style>
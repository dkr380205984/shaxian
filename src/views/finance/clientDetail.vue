<template>
  <div class="indexMain" id="clientDetail" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">客户名称：</span>
            <span class="text blue">{{ client_info.client_name }}</span>
          </div>
          <div class="colCtn">
            <span class="label">客户简称：</span>
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
            <span class="text">{{ client_info.phone || '无'}}</span>
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
      <div class="tableCtn" style="padding: 20px 32px 0 32px; margin: 0;">
        <div class="thead">
          <div class="trow">
            <div class="tcolumn">总下单数量</div>
            <div class="tcolumn">总下单金额（含额外费用）</div>
            <div class="tcolumn">发货数量</div>
            <div class="tcolumn">总发货金额（含额外费用）</div>
          </div>
        </div>
        <div class="tbody" style="font-weight:bold; font-size:16px">
          <div class="trow">
            <div class="tcolumn">{{ $toFixed(client_info.total_weight,2,true) }}kg</div>
            <div class="tcolumn">{{ $toFixed(client_info.total_price,2,true) }}元 (含额外费用 {{$toFixed(client_info.total_other_fee,2,true)}}元)</div>
            <div class="tcolumn">{{ $toFixed(client_info.real_total_weight,2,true) }}kg</div>
            <div class="tcolumn">{{ $toFixed(client_info.real_total_price,2,true) }}元 (含额外费用 {{$toFixed(client_info.total_other_fee,2,true)}}元)</div>
          </div>
        </div>
      </div>
      <div class="tableCtn" style="padding: 20px 32px 20px 32px; margin: 0;">
        <div class="thead">
          <div class="trow">
            <div class="tcolumn">客户扣款</div>
            <div class="tcolumn">开票总额</div>
            <div class="tcolumn">收款总额</div>
            <div class="tcolumn">客户欠款</div>
          </div>
        </div>
        <div class="tbody" style="font-weight:bold; font-size:16px">
          <div class="trow">
            <div class="tcolumn red">{{ $toFixed(client_info.deduct_total_price,2,true) }}元</div>
            <div class="tcolumn">{{ $toFixed(client_info.invoice_total_price,2,true) }}元</div>
            <div class="tcolumn">{{ $toFixed(client_info.deduct_total_price,2,true) }}元</div>
            <div class="tcolumn red">{{ $toFixed(client_info.real_total_price-client_info.invoice_total_price,2,true) }}元</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <el-tabs type="border-card">
        <el-tab-pane label="发货信息">
          <div class="titleCtn" style="padding: 0 17px">
            <span class="title">发货信息</span>
          </div>
          <div class="listCtn" style="padding: 20px 17px">
            <div class="filterCtn">
              <div class="leftCtn" style="max-width:unset;padding:unset">
                <div class="label">筛选条件：</div>
                <div class="elCtn">
                  <el-input v-model="stockObj.stock_code" placeholder="输入发货单号" @change="getStockList"></el-input>
                </div>
                <div class="elCtn">
                  <el-input v-model="stockObj.order_code" placeholder="输入关联订单号" @change="getStockList"></el-input>
                </div>
                <div class="elCtn">
                  <el-input v-model="stockObj.client_code" placeholder="客户单号" @change="getStockList" clearable></el-input>
                </div>
                <div class="elCtn" style="width: 120px;">
                  <el-input v-model="stockObj.batch_code" placeholder="批号" @change="getStockList"></el-input>
                </div>
                <div class="elCtn" style="width: 120px;">
                  <el-input v-model="stockObj.color_code" placeholder="色号" @change="getStockList"></el-input>
                </div>
                <div class="elCtn" style="width: 120px;">
                  <el-input v-model="stockObj.vat_code" placeholder="缸号" @change="getStockList"></el-input>
                </div>
              </div>
              <div class="rightCen">
                <div class="btn btnGray fr" @click="resetStockObj">
                  重置
                </div>
              </div>
            </div>
            <div class="filterCtn" style="margin-top:10px">
              <div class="leftCtn" style="max-width:unset;padding:unset">
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
                <div class="elCtn" style="width:unset">
                  <el-date-picker
                    v-model="stockObj.date"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    @change="getStockList">
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
                        <div class="column min120">发货时间</div>
                        <div class="column min120">发货单号</div>
                        <div class="column min120">关联订单号</div>
                        <div class="column min120">客户单号</div>
                        <div class="column noPad">
                          <div class="row">
                            <div class="column min120">纱线名称</div>
                            <div class="column min120">纱线颜色</div>
                            <div class="column min120">纱线属性</div>
                            <div class="column min120">数量属性</div>
                            <div class="column min120">批/色/缸号</div>
                            <div class="column min120">发货仓库</div>
                            <div class="column min120">单价(元)</div>
                            <div class="column min120">数量</div>
                            <div class="column min120">件数</div>
                            <div class="column min120">小计(元)</div>
                          </div>
                        </div>
                        <div class="column min120">发货备注</div>
                        <div class="column min120">操作人</div>
                        <div class="column min120">操作时间</div>
                        <div class="column min120">操作</div>
                      </div>
                    </div>
                    <div class="bodyCtn">
                      <div class="row" v-for="item,index in stock_list" :key="index+'发货'">
                        <div class="column min120">{{item.complete_time}}</div>
                        <div class="column min120" v-if="item.order_code" style="cursor:pointer" @click="$router.push('/order/detail/' + item.order_id)">{{item.code}}</div>
                        <div class="column min120" v-else>{{item.code}}</div>
                        <div class="column min120 hoverBlue" v-if="item.order_code" @click="$router.push('/order/detail/' + item.order_id)" style="cursor:pointer">{{item.order_code}}</div>
                        <div class="column min120 gray" v-else style="cursor:default">无关联订单</div>
                        <div class="column min120">{{item.order_client_code || '无'}}</div>
                        <div class="column noPad" style="flex-direction: column">
                          <div class="row" v-for="itemChild,indexChild in item.child_data" :key="indexChild + '发货二级'">
                            <div class="column min120">{{itemChild.name}}</div>
                            <div class="column min120">{{itemChild.color}}</div>
                            <div class="column min120">{{itemChild.attribute}}</div>
                            <div class="column min120">{{itemChild.number_attribute || '无'}}</div>
                            <div class="column min120">{{itemChild.batch_code}}/{{itemChild.color_code}}/{{itemChild.vat_code}}</div>
                            <div class="column min120">{{item.store_name}}/{{item.second_store_name}}</div>
                            <div class="column min120">{{itemChild.order_info ? itemChild.order_info.price : '0.00'}}</div>
                            <div class="column min120">{{itemChild.action_weight}}</div>
                            <div class="column min120">{{itemChild.item || 0}}</div>
                            <div class="column min120">{{((itemChild.action_weight || 0) * (itemChild.order_info?itemChild.order_info.price:'0.00')).toFixed(2)}}</div>
                          </div>
                        </div>
                        <div class="column min120">{{item.desc || '无'}}</div>
                        <div class="column min120">{{item.user_name}}</div>
                        <div class="column min120">{{$getDate(item.create_time)}}</div>
                        <div class="column min120 hoverBlue" style="cursor:pointer" @click="$openUrl('/print/transPrint?id=' + item.id)">打印</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="coverTable">
                <div class="floatL">
                  <div class="headCtn">
                    <div class="row">
                      <div class="column min120">发货时间</div>
                      <div class="column min120">发货单号</div>
                      <div class="column min120">关联订单号</div>
                    </div>
                  </div>
                  <div class="bodyCtn">
                    <div class="row" v-for="item,index in stock_list" :key="index+'发货←'">
                      <div class="column min120">{{item.complete_time}}</div>
                      <div class="column min120" v-if="item.order_code" style="cursor:pointer" @click="$router.push('/order/detail/' + item.order_id)">{{item.code}}</div>
                      <div class="column min120" v-else>{{item.code}}</div>
                      <div class="column min120 hoverBlue" v-if="item.order_code" @click="$router.push('/order/detail/' + item.order_id)" style="cursor:pointer">{{item.order_code}}</div>
                      <div class="column min120 gray" v-else style="cursor:default">无关联订单</div>
                      <div class="column noPad" style="width:0;overflow:hidden;flex-direction: column">
                        <div class="row" v-for="itemChild,indexChild in item.child_data" :key="indexChild + '发货二级←'">
                          <div class="column min120">{{itemChild.name}}</div>
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
                    <div class="row" v-for="item,index in stock_list" :key="index+'发货→'">
                      <div class="column noPad" style="width:0;overflow:hidden;flex-direction: column">
                          <div class="row" v-for="itemChild,indexChild in item.child_data" :key="indexChild + '发货二级→'">
                            <div class="column min120">{{itemChild.name}}</div>
                          </div>
                        </div>
                      <div class="column min120 hoverBlue" style="cursor:pointer" @click="$openUrl('/print/transPrint?id=' + item.id)">打印</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="green" style="display:flex;font-weight: bold;">
              <div>合计总价：{{$toFixed(stock_statistics.total_price,2,true)}} 元</div>
              <div style="margin-left:20px">合计总数：{{$toFixed(stock_statistics.total_number,2,true)}} kg</div>
            </div>
            <div class="pageCtn">
              <el-pagination background
                :current-page.sync="stock_page"
                :page-size="5"
                layout="prev, pager, next"
                :total="stock_total"
                @current-change="getStockList">
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
                      <div class="column">订单号</div>
                      <div class="column">订单类型</div>
                      <div class="column">下单时间</div>
                      <div class="column noPad" style="flex:3">
                        <div class="row">
                          <div class="column">额外费用名称</div>
                          <div class="column">额外费用金额</div>
                          <div class="column">额外费用备注</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bodyCtn">
                    <div class="row" v-for="item,index in client_info.others_fee" :key="index+'额外费用'">
                      <div class="column">{{item.code}}</div>
                      <div class="column">{{item.type === 1?'生产单':item.type === 2?'销售单':'未识别单据'}}</div>
                      <div class="column">{{item.order_time}}</div>
                      <div class="column noPad" style="flex:3;flex-direction: column">
                        <div class="row" v-for="itemFee,indexFee in item.others_fee" :key="indexFee + '额外费用子集'">
                          <div class="column">{{itemFee.name || '无'}}</div>
                          <div class="column">{{Number(itemFee.price).toFixed(2) || '0.00'}} 元</div>
                          <div class="column">{{itemFee.desc || '无'}}</div> 
                        </div>
                      </div>
                    </div>
                    <div class="row" style="background: #F4F4F4;">
                      <div class="column">合计</div>
                      <div class="column"></div>
                      <div class="column"></div>
                      <div class="column noPad" style="flex:3">
                        <div class="column"></div>
                        <div class="column">{{client_info.total_other_fee}}元</div>
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
    <!-- <div class="module">
      <div class="titleCtn">
        <span class="title">出入库信息</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="stock_code"
                placeholder="输入出库单号按回车键搜索"
                @change="getStockList"></el-input>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="overflow" @mousewheel.prevent="listenWheel" ref="list">
            <div class="tableCtn">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">单号</div>
                    <div class="column"
                      style="min-width:80px;max-width:80px">操作类型</div>
                    <div class="column"
                      style="min-width:200px;max-width:200px">出入库信息</div>
                    <div class="column"
                      style="flex:10;flex-direction:column">
                      <div class="row">
                        <div class="column min120">纱线名称</div>
                        <div class="column min120">颜色</div>
                        <div class="column min120">属性</div>
                        <div class="column min120">所属客户</div>
                        <div class="column min120">数量</div>
                        <div class="column min120">批号</div>
                        <div class="column min120">色号</div>
                        <div class="column min120">缸号</div>
                      </div>
                    </div>
                    <div class="column min120">备注信息</div>
                    <div class="column min120">日期</div>
                    <div class="column min120">操作人</div>
                    <div class="column min120">操作</div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div class="row"
                    v-for="item in stock_list"
                    :key="item.id">
                    <div class="column min120">{{item.code}}</div>
                    <div class="column"
                      style="min-width:80px;max-width:80px">{{item.action_type|stockTypeFilter}}</div>
                    <div class="column"
                      style="min-width:200px;max-width:200px">
                      <span v-if="item.action_type===1||item.action_type===3||item.action_type===5||item.action_type===8">
                        <span class="green">{{item.client_name ||'无来源'}}</span>
                        <i class="el-icon-s-unfold orange"
                          style="margin:0 5px;font-size:16px"></i>
                        <span class="blue">{{item.store_name}}/{{item.second_store_name}}</span>
                      </span>
                      <span v-if="item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7||item.action_type===9">
                        <span class="blue">{{item.store_name}}/{{item.second_store_name}}</span>
                        <i class="el-icon-s-unfold orange"
                          style="margin:0 5px;font-size:16px"></i>
                        <span class="green">{{item.client_name}}</span>
                      </span>
                    </div>
                    <div class="column"
                      style="flex:10;flex-direction:column">
                      <div class="row"
                        v-for="(itemChild,indexChild) in item.child_data"
                        :key="indexChild">
                        <div class="column min120">{{itemChild.name}}</div>
                        <div class="column min120">{{itemChild.color}}</div>
                        <div class="column min120">{{itemChild.attribute}}</div>
                        <div class="column min120">{{itemChild.store_client_name||'无'}}</div>
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
                  <div class="column"
                    style="min-width:80px;max-width:80px">操作类型</div>
                  <div class="column"
                    style="min-width:200px;max-width:200px">出入库信息</div>
                </div>
              </div>
              <div class="bodyCtn">
                <div class="row"
                  v-for="item in stock_list"
                  :key="item.id">
                  <div class="column min120">{{item.code}}</div>
                  <div class="column"
                    style="min-width:80px;max-width:80px">{{item.action_type|stockTypeFilter}}</div>
                  <div class="column"
                    style="min-width:200px;max-width:200px">
                    <span v-if="item.action_type===1||item.action_type===3||item.action_type===5||item.action_type===8">
                      <span class="green">{{item.client_name ||'无来源'}}</span>
                      <i class="el-icon-s-unfold orange"
                        style="margin:0 5px;font-size:16px"></i>
                      <span class="blue">{{item.store_name}}/{{item.second_store_name}}</span>
                    </span>
                    <span v-if="item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7||item.action_type===9">
                      <span class="blue">{{item.store_name}}/{{item.second_store_name}}</span>
                      <i class="el-icon-s-unfold orange"
                        style="margin:0 5px;font-size:16px"></i>
                      <span class="green">{{item.client_name}}</span>
                    </span>
                  </div>
                  <div class="column noPad"
                    style="flex-direction:column">
                    <div class="row" style="width:0;overflow:hidden"
                      v-for="(itemChild,indexChild) in item.child_data"
                      :key="indexChild">
                      <div class="column min120">{{itemChild.name}}</div>
                      <div class="column min120">{{itemChild.color}}</div>
                      <div class="column min120">{{itemChild.attribute}}</div>
                      <div class="column min120">{{itemChild.store_client_name||'无'}}</div>
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
                <div class="row"
                    v-for="item in stock_list"
                    :key="item.id">
                    <div class="column noPad"
                      style="flex-direction:column">
                      <div class="row"
                        style="width:0;overflow:hidden"
                        v-for="(itemChild,indexChild) in item.child_data"
                        :key="indexChild">
                        <div class="column min120">{{itemChild.name}}</div>
                        <div class="column min120">{{itemChild.color}}</div>
                        <div class="column min120">{{itemChild.attribute}}</div>
                        <div class="column min120">{{itemChild.store_client_name||'无'}}</div>
                      </div>
                    </div>
                    <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">
                    <span class="blue opr"
                      @click="$openUrl(`/print/store/2/${item.id}?orderId=${$route.params.id}`)">打印</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="otherInfo">
          <div class="box">
            <span class="label">总入库数：</span>
            <span class="info blue">{{stock_statistics.total_push}}kg</span>
          </div>
          <div class="box">
            <span class="label">总出库数：</span>
            <span class="info green">{{stock_statistics.total_pop}}kg</span>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :current-page.sync="stock_page"
            :page-size="5"
            layout="prev, pager, next"
            :total="stock_total"
            @current-change="getStockList">
          </el-pagination>
        </div>
      </div>
    </div> -->
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
            :page-size="10"
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
        <span class="title">收款单据</span>
        <span class="addBtn btn btnMain" @click="show_collection = true">新增收款</span>
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
            <div class="elCtn">
              <el-select @change="getCollectionList" v-model="collection_type" placeholder="请选择收款方式">
                <el-option label="现金收款" value="现金收款"></el-option>
                <el-option label="银行转账" value="银行转账"></el-option>
                <el-option label="网银支付" value="网银支付"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">收款单号</div>
              <div class="column">收款方式</div>
              <div class="column">收款金额</div>
              <div class="column">收款凭据</div>
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
                <div class="opr red" @click="deleteLog('收款', item.id)">删除</div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination
            background
            :current-page.sync="collection_page"
            :page-size="10"
            layout="prev, pager, next"
            :total="collection_total"
            :current-change="getCollectionList"
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
                <div class="opr blue">打印</div>
                <div class="opr red" @click="deleteLog('扣款', item.id)">删除</div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination
            background
            :current-page.sync="deduct_page"
            :page-size="10"
            layout="prev, pager, next"
            :total="deduct_total"
            :current-change="getDeductList"
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
                <div class="button btnBlue" @click="exportExcel('order')">
                  <i class="iconfont">&#xe636;</i>
                  <span class="text">发货报表</span>
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
    <bill :data="{ type: 5, client_id: $route.params.id,myType:1 }" :show.sync="show_bill" @afterBill="init"></bill>
    <deduct :data="{ type: 5, client_id: $route.params.id, myType:1 }" :show.sync="show_deduct" @afterDeduct="init"></deduct>
    <collection
      :data="{ type: 5, client_id: $route.params.id }"
      :show.sync="show_collection"
      @afterCollection="init"
      :collectType="1"
    ></collection>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { deduct, bill, collection, order, stock, finance, exportExcel } from '@/assets/js/api'
import { DeductInfo, BillInfo, CollectionInfo } from '@/types/common'
export default Vue.extend({
  data(): {
    excel_type: 'order' | 'deduct' | 'invoice' | 'collection'
    deduct_list: DeductInfo[]
    bill_list: BillInfo[]
    collection_list: CollectionInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      excel_flag: false,
      excel_date: [new Date().getFullYear() + '-01-01', this.$getDate(new Date())],
      excel_type: 'order',
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
        total_price:0,
        total_weight:0,
        total_other_fee:0,
        real_total_weight:0,
        real_total_price:0,
        deduct_total_price:0,
        invoice_total_price:0,
      },
      stockObj:{
        date:[new Date().getFullYear() + '-01-01',new Date().getFullYear() + '-12-31'],
        order_code:'',
        client_code:'',
        LV2_name:[],
        stock_code:'',
        name:'',
        batch_code:'',
        color_code:'',
        vat_code:'',
        user_id:'',
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
      collection_type: '',
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
        total_price:0,
        total_number:0,
      }
    }
  },
  methods: {
    init() {
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
        order.list({
          client_id: this.$route.params.id,
          limit: 5,
          page: this.order_page
        }),
        stock.list({
          client_id: this.$route.params.id,
          start_time: this.stockObj.date[0],
          end_time: this.stockObj.date[1],
          action_type: [18, 9],
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
        res[3].data.data.total_other_fee = res[3].data.data.others_fee.reduce((a:any,b:any) => {
          return a + b.others_fee?b.others_fee?.reduce((a1:any,b1:any) => {
            return a1 + (Number(b1.price) || 0)
          },0) : 0
        },0)
        this.client_info = res[3].data.data
        this.order_list = res[4].data.data.items
        this.order_total = res[4].data.data.total
        this.stock_list = res[5].data.data.items
        this.stock_total = res[5].data.data.total
        this.stock_statistics = res[5].data.data.additional
        this.loading = false
      })
    },
    resetStockObj(){
      this.stockObj = {
        date:[new Date().getFullYear() + '-01-01',new Date().getFullYear() + '-12-31'],
        order_code:'',
        client_code:'',
        LV2_name:[],
        stock_code:'',
        name:'',
        batch_code:'',
        color_code:'',
        vat_code:'',
        user_id:'',
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
          type: this.collection_type,
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
      order
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
      this.stockObj.date = this.stockObj.date?this.stockObj.date:[new Date().getFullYear() + '-01-01',new Date().getFullYear() + '-12-31']

      stock
        .list({
          client_id: this.$route.params.id,
          limit: 5,
          action_type: [18, 9],
          name:this.stockObj.name[1] || '',
          user_id:this.stockObj.user_id || '',
          batch_code:this.stockObj.batch_code,
          color_code:this.stockObj.color_code,
          vat_code:this.stockObj.vat_code,
          store_id:this.stockObj.LV2_name[0],
          second_store_id:this.stockObj.LV2_name[1],
          start_time: this.stockObj.date[0],
          end_time: this.stockObj.date[1],
          page: this.stock_page,
          order_code: this.stockObj.order_code,
          client_code: this.stockObj.client_code,
          code: this.stockObj.stock_code
        })
        .then((res) => {
          this.stock_list = res.data.data.items
          this.stock_total = res.data.data.total
          this.loading = false
        })
    },
    changeIndex(father: any, type: string) {
      if (!father.index) {
        father.index = 0
      }
      if (type === 'add') {
        if (father.index < father.child_data.length - 1) {
          father.index++
        } else {
          father.index = 0
        }
      }
      if (type === 'delete') {
        if (father.index === 0) {
          father.index = father.child_data.length - 1
        } else {
          father.index--
        }
      }
      this.$forceUpdate()
    },
    exportExcel(type: 'order' | 'deduct' | 'invoice' | 'collection') {
      this.excel_flag = true
      this.excel_type = type
    },
    getExcel() {
      if (this.excel_date.length === 0) {
        this.$message.error('请选择日期范围')
        return
      }
      this.$message.success('正在导出Excel')
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
  computed:{
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
    },
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
      },
    ])
    this.init()
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/less/finance/clientDetail.less';
</style>
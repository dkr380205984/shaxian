<template>
  <div class="indexMain"
    id="inAndOutDetail"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">订单号：</span>
            <span class="text green">{{order_info.code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">客户单号：</span>
            <span class="text green">{{order_info.order_code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">下单客户：</span>
            <span class="text">{{order_info.client_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{order_info.order_time}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">交货日期：</span>
            <span class="text blue">{{order_info.delivery_time}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">创建人：</span>
            <span class="text">{{order_info.user_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">创建时间：</span>
            <span class="text">{{order_info.create_time.slice(0,10)}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="text"
              v-html="order_info.desc"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">下单信息</span>
      </div>
      <div style="padding:20px 32px">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">纱线名称</div>
              <div class="tcolumn noPad"
                style="flex:7">
                <div class="trow">
                  <div class="tcolumn">纱线颜色</div>
                  <div class="tcolumn">纱线属性</div>
                  <div class="tcolumn">下单价格(元)</div>
                  <div class="tcolumn">下单数量(kg)</div>
                  <div class="tcolumn">数量属性</div>
                  <div class="tcolumn">调取数量(kg)</div>
                  <div class="tcolumn">订购数量(kg)</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item) in order_info.product_info"
              :key="item.id">
              <div class="tcolumn">{{item.product_name}}</div>
              <div class="tcolumn noPad"
                style="flex:7">
                <div class="trow"
                  v-for="itemChild in item.child_data"
                  :key="itemChild.id">
                  <div class="tcolumn">{{itemChild.color}}</div>
                  <div class="tcolumn">{{itemChild.attribute}}</div>
                  <div class="tcolumn">{{itemChild.price}}</div>
                  <div class="tcolumn blue">{{itemChild.weight}}</div>
                  <div class="tcolumn">{{itemChild.number_attribute}}</div>
                  <div class="tcolumn blue">{{itemChild.transfer_weight}}</div>
                  <div class="tcolumn blue">{{itemChild.purchase_weight}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-show="order_yarn_list.length>0">
      <div class="titleCtn">
        <span class="title">采购信息</span>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="overflow">
            <div class="tableCtn">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">采购单号</div>
                    <div class="column min120">供货商</div>
                    <div class="column"
                      style="flex:10;flex-direction:column">
                      <div class="row">
                        <div class="column min120">纱线名称</div>
                        <div class="column min120">订购颜色</div>
                        <div class="column min120">订购属性</div>
                        <div class="column min120">采购数量</div>
                        <div class="column min120">备注信息</div>
                      </div>
                    </div>
                    <div class="column min120">入库数量</div>
                    <div class="column min120">创建人</div>
                    <div class="column min120">下单日期</div>
                    <div class="column min120">交货日期</div>
                    <div class="column min120">操作</div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div class="row"
                    v-for="item in order_yarn_list"
                    :key="item.id">
                    <div class="column min120">{{item.code}}</div>
                    <div class="column min120">{{item.client_name}}</div>
                    <div class="column"
                      style="flex:10;flex-direction:column">
                      <div class="row"
                        v-for="(itemChild,indexChild) in item.child_data"
                        :key="indexChild">
                        <div class="column min120">{{itemChild.name}}</div>
                        <div class="column min120">{{itemChild.color}}</div>
                        <div class="column min120">{{itemChild.attribute}}</div>
                        <div class="column min120 blue">{{itemChild.reality_weight}}</div>
                        <div class="column min120">{{itemChild.desc||'无'}}</div>
                      </div>
                    </div>
                    <div class="column min120 green">{{item.push_weight}}</div>
                    <div class="column min120">{{item.user_name}}</div>
                    <div class="column min120">{{item.order_time}}</div>
                    <div class="column min120">{{item.delivery_time}}</div>
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
                  <div class="column min120">订购单号</div>
                  <div class="column min120">供货商</div>
                </div>
              </div>
              <div class="bodyCtn">
                <div class="row"
                  v-for="item in order_yarn_list"
                  :key="item.id">
                  <div class="column min120 blue"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.code}}</div>
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.client_name}}</div>
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
                  v-for="item in order_yarn_list"
                  :key="item.id">
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">
                    <span class="blue opr"
                      @click="openOrderIn(item)">入库</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-show="store_yarn_list.length>0">
      <div class="titleCtn">
        <span class="title">调取信息</span>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="overflow">
            <div class="tableCtn">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">调取单号</div>
                    <div class="column min120">仓库名称</div>
                    <div class="column min120">调取纱线</div>
                    <div class="column min120">调取颜色/属性</div>
                    <div class="column min120">所属客户</div>
                    <div class="column"
                      style="flex-direction:column">
                      <div class="row">
                        <div class="column min120">订单纱线</div>
                        <div class="column min120">下单颜色/属性</div>
                        <div class="column min120">实际调取数量</div>
                      </div>
                    </div>
                    <div class="column min120">批号</div>
                    <div class="column min120">色号</div>
                    <div class="column min120">缸号</div>
                    <div class="column min120">出库数量</div>
                    <div class="column min120">操作日期</div>
                    <div class="column min120">备注信息</div>
                    <div class="column min120">操作</div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div class="row"
                    v-for="item in store_yarn_list"
                    :key="item.id">
                    <div class="column min120">{{item.code}}</div>
                    <div class="column min120">{{item.store_name}}</div>
                    <div class="column min120">{{item.name}}</div>
                    <div class="column min120">{{item.color}}/{{item.attribute}}</div>
                    <div class="column min120">{{item.store_client_name||'无'}}</div>
                    <div class="column"
                      style="flex-direction:column">
                      <div class="row"
                        v-for="itemChild in item.child_data"
                        :key="itemChild.order_info_id">
                        <div class="column min120">{{itemChild.name}}</div>
                        <div class="column min120">{{itemChild.color}}/{{itemChild.attribute}}</div>
                        <div class="column min120 blue">{{itemChild.reality_weight}}</div>
                      </div>
                    </div>
                    <div class="column min120">{{item.batch_code}}</div>
                    <div class="column min120">{{item.color_code}}</div>
                    <div class="column min120">{{item.vat_code}}</div>
                    <div class="column min120 green">{{item.pop_weight}}</div>
                    <div class="column min120">{{item.create_time || '暂无'}}</div>
                    <div class="column min120">{{item.desc||'无'}}</div>
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
                  <div class="column min120">调取单号</div>
                  <div class="column min120">仓库名称</div>
                  <div class="column min120">调取纱线</div>
                  <div class="column min120">调取颜色/属性</div>
                </div>
              </div>
              <div class="bodyCtn">
                <div class="row"
                  v-for="item in store_yarn_list"
                  :key="item.id">
                  <div class="column min120 blue"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.code}}</div>
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.store_name}}</div>
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.name}}</div>
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.color}}/{{item.attribute}}</div>
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
                  v-for="item in store_yarn_list"
                  :key="item.id">
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">
                    <span class="blue opr"
                      @click="openStoreOut(item,4)">加工出库</span>
                    <span class="green opr"
                      @click="openStoreOut(item,9)">订单发货</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="process_yarn_list.length>0">
      <div class="titleCtn">
        <span class="title">加工信息</span>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="overflow">
            <div class="tableCtn">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">单号</div>
                    <div class="column min120">加工单位</div>
                    <div class="column"
                      style="flex:5;flex-direction:column">
                      <div class="row">
                        <div class="column min120">纱线名称</div>
                        <div class="column min120">加工详情</div>
                        <div class="column min120">计划加工数量</div>
                        <div class="column min120">实际加工数量</div>
                        <div class="column min120">加工单价</div>
                      </div>
                    </div>
                    <div class="column min120">合计金额</div>
                    <div class="column min120">创建人</div>
                    <div class="column min120">额外费用</div>
                    <div class="column min120">扣款信息</div>
                    <div class="column min120">备注信息</div>
                    <div class="column min120">下单日期</div>
                    <div class="column min120">交货日期</div>
                    <div class="column min120">补充信息</div>
                    <div class="column min120">操作</div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div class="row"
                    v-for="item in process_yarn_list"
                    :key="item.id">
                    <div class="column min120">{{item.code}}</div>
                    <div class="column min120">{{item.client_name}}
                      <span class="blue">({{item.type}})</span>
                    </div>
                    <div class="column"
                      style="flex:5;flex-direction:column">
                      <div class="row"
                        v-for="(itemChild,indexChild) in item.child_data"
                        :key="indexChild">
                        <div class="column min120">{{itemChild.name}}</div>
                        <div class="column min120">
                          <span v-if="item.type==='倒筒'">
                            {{itemChild.before_attribute}}
                            <i class="el-icon-d-arrow-right"></i>
                            {{itemChild.after_attribute}}
                          </span>
                          <span v-if="item.type==='染色'">
                            {{itemChild.before_color}}
                            <i class="el-icon-d-arrow-right"></i>
                            {{itemChild.after_color}}
                          </span>
                          <span v-if="item.type==='膨纱'">
                            {{itemChild.color}}
                            /
                            {{itemChild.attribute}}
                          </span>
                        </div>
                        <div class="column min120">{{itemChild.weight}}</div>
                        <div class="column min120 blue">{{itemChild.reality_weight}}</div>
                        <div class="column min120">{{itemChild.price}}元</div>
                      </div>
                    </div>
                    <div class="column min120 green">{{item.total_price||0}}元</div>
                    <div class="column min120">{{item.user_name}}</div>
                    <div class="column min120"
                      :style="{'cursor':item.additional_fee?'pointer':'auto'}"
                      :class="{'blue':item.additional_fee,'gray':!item.additional_fee}"
                      @click="lookExtraFee(item.additional_fee)">{{item.additional_fee?'查看费用':'无额外费用'}}</div>
                    <div class="column min120"
                      :style="{'cursor':item.is_deduct===1?'pointer':'auto'}"
                      :class="{'blue':item.is_deduct===1,'gray':item.is_deduct === 0}"
                      @click="lookDeduct(item.id,2)">{{item.is_deduct===1?'查看费用':'无扣款'}}</div>
                    <div class="column min120">{{item.desc}}</div>
                    <div class="column min120">{{item.order_time}}</div>
                    <div class="column min120">{{item.delivery_time}}</div>
                    <div class="column min120">
                      <el-image style="width: 50px; height: 50px;line-height:50px;text-align:center;font-size:22px"
                        :src="item.file_url"
                        :preview-src-list="[item.file_url]">
                        <div slot="error"
                          class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                      </el-image>
                    </div>
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
                  <div class="column min120">加工单位</div>
                </div>
              </div>
              <div class="bodyCtn">
                <div class="row"
                  v-for="item in process_yarn_list"
                  :key="item.id">
                  <div class="column min120 blue"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.code}}</div>
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.client_name}}</div>
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
                  v-for="item in process_yarn_list"
                  :key="item.id">
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">
                    <span class="blue opr"
                      @click="openProcess(item,6)">出库</span>
                    <span class="green opr"
                      @click="openProcess(item,5)">回库</span>
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
        <span class="title">出入库日志</span>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="overflow">
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
                    <div class="column min120">创建时间</div>
                    <div class="column min120">操作日期</div>
                    <div class="column min120">操作人</div>
                    <div class="column min120">操作</div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div class="row"
                    v-for="item in store_log_list"
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
                        <div class="column min120">{{itemChild.store_client_name || '无'}}</div>
                        <div class="column min120 blue">{{itemChild.action_weight}}</div>
                        <div class="column min120">{{itemChild.batch_code}}</div>
                        <div class="column min120">{{itemChild.color_code}}</div>
                        <div class="column min120">{{itemChild.vat_code}}</div>
                      </div>
                    </div>
                    <div class="column min120">{{item.desc||'无'}}</div>
                    <div class="column min120">{{item.create_time.slice(0,10)}}</div>
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
                  v-for="item in store_log_list"
                  :key="item.id">
                  <div class="column min120 blue"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.code}}</div>
                  <div class="column"
                    style="min-width:80px;max-width:80px"
                    :style="{'height':50*item.child_data.length + 'px'}"
                    :class="{'blue':item.action_type===1||item.action_type===3||item.action_type===5||item.action_type===8||item.action_type===11||item.action_type===13||item.action_type===14||item.action_type===15,'green':item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7||item.action_type===9||item.action_type===10||item.action_type===12}">{{item.action_type|stockTypeFilter}}</div>
                  <div class="column"
                    style="min-width:200px;max-width:200px"
                    :style="{'height':50*item.child_data.length + 'px'}">
                    <span v-if="item.action_type===1||item.action_type===3||item.action_type===5||item.action_type===8||item.action_type===13||item.action_type===14||item.action_type===15">
                      <span class="green">{{item.client_name ||'无来源'}}</span>
                      <i class="el-icon-s-unfold orange"
                        style="margin:0 5px;font-size:16px"></i>
                      <span class="blue">{{item.store_name}}/{{item.second_store_name}}</span>
                    </span>
                    <span v-if="item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7||item.action_type===9 || item.action_type===12">
                      <span class="blue">{{item.store_name}}/{{item.second_store_name}}</span>
                      <i class="el-icon-s-unfold orange"
                        style="margin:0 5px;font-size:16px"></i>
                      <span class="green">{{item.client_name}}</span>
                    </span>
                    <span v-if="item.action_type===10 || item.action_type===11">
                      <span class="green">{{item.store_name}}/{{item.second_store_name}}</span>
                      <i class="el-icon-s-unfold orange"
                        style="margin:0 5px;font-size:16px"></i>
                      <span class="blue">{{item.move_store_name}}/{{item.move_second_store_name}}</span>
                    </span>
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
                  v-for="item in store_log_list"
                  :key="item.id">
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">
                    <span class="blue opr"
                      @click="$openUrl(`/print/store/2/${item.id}?orderId=${$route.params.id}`)">打印</span>
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
          <div class="btn btnBlue"
            @click="$router.push('/orderProcessYarn/detail/' + $route.params.id)">订购加工</div>
        </div>
      </div>
    </div>
    <in-and-out :orderId="$route.params.id"
      :relatedCode="store_info.related_code"
      :relatedId="store_info.related_id"
      :yarnArr="store_info.yarn_arr"
      :outClientArr="store_info.out_client_arr"
      :clientId="store_info.client_id"
      :storeId="store_info.store_id"
      :show.sync="store_info.show"
      :type="store_info.type"
      :yarnName="store_info.yarn_name"
      :yarnColor="store_info.yarn_color"
      :yarnAttr="store_info.yarn_attr"
      @close="resetStoreInfo"></in-and-out>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Order } from '@/types/order'
import { order, yarnOrder, store, yarnProcess, stock } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    order_info: Order
    [propName: string]: any
  } {
    return {
      loading: true,
      store_info: {
        store_id: '',
        related_id: '',
        related_code: '',
        show: false,
        yarn_arr: [],
        out_client_arr: [],
        yarn_color: '',
        yarn_attr: '',
        yarn_name: '',
        type: ''
      },
      process_client_arr: [], // 保存一份加工单位数据防止被reset
      order_info: {
        order_code: '',
        order_time: '',
        delivery_time: '',
        client_id: '',
        total_price: '',
        total_weight: 0,
        desc: '',
        additional_fee: '',
        total_additional_fee: 0,
        product_info: []
      },
      order_yarn_list: [],
      store_yarn_list: [],
      process_yarn_list: [],
      store_log_list: []
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        order.detail({
          id: this.$route.params.id
        }),
        yarnOrder.list({
          order_id: this.$route.params.id
        }),
        store.orderList({
          order_id: this.$route.params.id
        }),
        yarnProcess.list({
          order_id: this.$route.params.id
        }),
        stock.list({
          order_id: this.$route.params.id
        })
      ]).then((res) => {
        this.order_info = res[0].data.data
        this.order_info.product_info = this.$mergeData(this.order_info.product_info, {
          mainRule: 'product_name',
          childrenName: 'child_data',
          otherRule: [{ name: 'product_id' }]
        })
        this.order_yarn_list = res[1].data.data
        this.store_yarn_list = res[2].data.data
        this.process_yarn_list = res[3].data.data
        this.process_client_arr = this.$mergeData(res[3].data.data, {
          mainRule: 'client_id/id',
          otherRule: [{ name: 'client_name/name' }]
        })
        this.store_log_list = res[4].data.data.data.items
        this.loading = false
      })
    },
    // 订购入库
    openOrderIn(info: any) {
      this.store_info.out_client_arr = [
        {
          id: info.client_id,
          name: info.client_name
        }
      ]
      this.store_info.related_code = info.code
      this.store_info.related_id = info.id
      this.store_info.type = 3
      this.store_info.yarn_arr = this.$mergeData(info.child_data, {
        mainRule: 'name'
      })
      this.store_info.client_id = info.client_id
      this.store_info.show = true
    },
    // 调取出库
    openStoreOut(info: any, type: number) {
      this.store_info.related_code = info.code
      this.store_info.related_id = info.id
      this.store_info.type = type
      this.store_info.store_id = [info.store_id, info.second_store_id]
      this.store_info.yarn_arr = [
        {
          name: info.name,
          childrenMergeInfo: [
            {
              color: info.color,
              attribute: info.attribute
            }
          ]
        }
      ]
      if (type === 4) {
        this.store_info.out_client_arr = this.process_client_arr
      }
      if (type === 9) {
        this.store_info.out_client_arr = [
          {
            id: this.order_info.client_id,
            name: this.order_info.client_name
          }
        ]
        this.store_info.client_id = this.order_info.client_id
      }
      this.store_info.yarn_color = info.color
      this.store_info.yarn_attr = info.attribute
      this.store_info.yarn_name = info.name
      this.store_info.show = true
    },
    // 加工出库/回库
    openProcess(info: any, type: number) {
      this.store_info.related_code = info.code
      this.store_info.related_id = info.id
      this.store_info.type = type
      this.store_info.out_client_arr = this.process_client_arr
      this.store_info.client_id = info.client_id
      this.store_info.show = true
    },
    resetStoreInfo() {
      this.store_info = {
        store_id: '',
        related_id: '',
        related_code: '',
        show: false,
        out_client_arr: [],
        yarn_arr: [],
        type: ''
      }
      this.init()
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
@import '~@/assets/less/inAndOut/detail.less';
</style>
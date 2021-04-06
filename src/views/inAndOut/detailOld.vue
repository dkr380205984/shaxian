<template>
  <!-- 旧代码备份 -->
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
            <span class="text">没给</span>
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
                  <div class="tcolumn">调取数量</div>
                  <div class="tcolumn">订购数量</div>
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
    <div class="switchCtn">
      <div class="switch"
        :class="{'active':module_state===1}"
        @click="module_state=1">
        <i class="icon"></i>
        <span class="text">纱线订购入库</span>
      </div>
      <div class="switch"
        :class="{'active':module_state===2}"
        @click="module_state=2">
        <i class="icon"></i>
        <span class="text">订购调取出库</span>
      </div>
      <div class="switch"
        :class="{'active':module_state===3}"
        @click="module_state=3">
        <i class="icon"></i>
        <span class="text">纱线加工回库/出库</span>
      </div>
      <div class="switch"
        :class="{'active':module_state===4}"
        @click="module_state=4">
        <i class="icon"></i>
        <span class="text">最终出库日志</span>
      </div>
    </div>
    <div class="module"
      v-show="module_state===2">
      <div class="titleCtn">
        <span class="title">调取待出库</span>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="overflow">
            <div class="tableCtn">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">单号</div>
                    <div class="column min120">仓库名称</div>
                    <div class="column min120">调取纱线</div>
                    <div class="column min120">调取颜色/属性</div>
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
                      @click="openStoreOut(item)">出库</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-show="module_state===1">
      <div class="titleCtn">
        <span class="title">采购待入库</span>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="overflow">
            <div class="tableCtn">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">订购单号</div>
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
      v-show="module_state===2">
      <div class="titleCtn">
        <span class="title">采购待出库</span>
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
                      style="flex-direction:column">
                      <div class="row">
                        <div class="column min120">纱线名称</div>
                        <div class="column min120">订购颜色</div>
                        <div class="column min120">订购属性</div>
                        <div class="column min120">入库数量</div>
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
                  <div class="row"
                    v-for="item in log_info.order_in_log"
                    :key="item.id">
                    <div class="column min120">{{item.code}}</div>
                    <div class="column min120">{{item.store_name}}/{{item.second_store_name}}</div>
                    <div class="column"
                      style="flex-direction:column">
                      <div class="row"
                        v-for="(itemChild,indexChild) in item.child_data"
                        :key="indexChild">
                        <div class="column min120">{{itemChild.name}}</div>
                        <div class="column min120">{{itemChild.color}}</div>
                        <div class="column min120">{{itemChild.attribute}}</div>
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
                  <div class="column min120">入库单号</div>
                  <div class="column min120">入库仓库</div>
                </div>
              </div>
              <div class="bodyCtn">
                <div class="row"
                  v-for="item in log_info.order_in_log"
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
                  v-for="item in log_info.order_in_log"
                  :key="item.id">
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">
                    <span class="blue opr"
                      @click="openOrderOut(item)">出库</span>
                    <span class="blue opr"
                      @click="$openUrl(`/print/store/1/${item.id}?orderId=${$route.params.id}`)">打印入库单</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-show="module_state===3">
      <div class="titleCtn">
        <span class="title">加工待入库</span>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="overflow">
            <div class="tableCtn">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">出库单号</div>
                    <div class="column min120">出库工厂</div>
                    <div class="column"
                      style="flex:10;flex-direction:column">
                      <div class="row">
                        <div class="column min120">纱线名称</div>
                        <div class="column min120">出库颜色</div>
                        <div class="column min120">出库属性</div>
                        <div class="column min120">出库数量</div>
                      </div>
                    </div>
                    <div class="column min120">备注信息</div>
                    <div class="column min120">出库日期</div>
                    <div class="column min120">操作人</div>
                    <div class="column min120">操作</div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div class="row"
                    v-for="item in log_info.order_store_out_log"
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
                  <div class="column min120">出库单号</div>
                  <div class="column min120">出库工厂</div>
                </div>
              </div>
              <div class="bodyCtn">
                <div class="row"
                  v-for="item in log_info.order_store_out_log"
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
                  v-for="item in log_info.order_store_out_log"
                  :key="item.id">
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">
                    <span class="blue opr"
                      @click="openOrderStoreIn(item)">入库</span>
                    <span class="blue opr"
                      @click="$openUrl(`/print/store/2/${item.id}?orderId=${$route.params.id}`)">打印出库单</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-show="module_state===3">
      <div class="titleCtn">
        <span class="title">加工待出库</span>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="overflow">
            <div class="tableCtn">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">入库单号</div>
                    <div class="column min120">来源仓库</div>
                    <div class="column"
                      style="flex-direction:column">
                      <div class="row">
                        <div class="column min120">纱线名称</div>
                        <div class="column min120">入库颜色</div>
                        <div class="column min120">入库属性</div>
                        <div class="column min120">入库数量</div>
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
                  <div class="row"
                    v-for="item in log_info.process_in_log"
                    :key="item.id">
                    <div class="column min120">{{item.code}}</div>
                    <div class="column min120">{{item.store_name}}/{{item.second_store_name}}</div>
                    <div class="column"
                      style="flex-direction:column">
                      <div class="row"
                        v-for="(itemChild,indexChild) in item.child_data"
                        :key="indexChild">
                        <div class="column min120">{{itemChild.name}}</div>
                        <div class="column min120">{{itemChild.color}}</div>
                        <div class="column min120">{{itemChild.attribute}}</div>
                        <div class="column min120 blue">{{itemChild.action_weight}}</div>
                        <div class="column min120">{{itemChild.batch_code}}</div>
                        <div class="column min120">{{itemChild.color_code}}</div>
                        <div class="column min120">{{itemChild.vat_code}}</div>
                      </div>
                    </div>
                    <div class="column min120">{{item.desc}}</div>
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
                  <div class="column min120">来源仓库</div>
                </div>
              </div>
              <div class="bodyCtn">
                <div class="row"
                  v-for="item in log_info.process_in_log"
                  :key="item.id">
                  <div class="column min120 blue"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.code}}</div>
                  <div class="column min120 "
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.store_name}}/{{item.second_store_name}}</div>
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
                  v-for="item in log_info.process_in_log"
                  :key="item.id">
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">
                    <span class="blue opr"
                      @click="openProcessOut(item)">出库</span>
                    <span class="blue opr"
                      @click="$openUrl(`/print/store/1/${item.id}?orderId=${$route.params.id}`)">打印入库单</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-show="module_state===4">
      <div class="titleCtn">
        <span class="title">最终出库日志</span>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="overflow">
            <div class="tableCtn">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">出库单号</div>
                    <div class="column min120">出库单位</div>
                    <div class="column"
                      style="flex:10;flex-direction:column">
                      <div class="row">
                        <div class="column min120">纱线名称</div>
                        <div class="column min120">出库颜色</div>
                        <div class="column min120">出库属性</div>
                        <div class="column min120">出库数量</div>
                      </div>
                    </div>
                    <div class="column min120">备注信息</div>
                    <div class="column min120">出库日期</div>
                    <div class="column min120">操作人</div>
                    <div class="column min120">操作</div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div class="row"
                    v-for="item in log_info.final_out_log"
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
                  <div class="column min120">出库单号</div>
                  <div class="column min120">出库单位</div>
                </div>
              </div>
              <div class="bodyCtn">
                <div class="row"
                  v-for="item in log_info.final_out_log"
                  :key="item.id">
                  <div class="column min120 blue"
                    :style="{'height':50*item.child_data.length + 'px'}">{{item.code}}</div>
                  <div class="column min120 "
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
                  v-for="item in log_info.final_out_log"
                  :key="item.id">
                  <div class="column min120"
                    :style="{'height':50*item.child_data.length + 'px'}">
                    <span class="blue opr"
                      @click="$openUrl(`/print/store/2/${item.id}?orderId=${$route.params.id}`)">打印出库单</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="flags.order_in_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">纱线入库</span>
          <i class="close_icon el-icon-close"
            @click="resetOrderIn"></i>
        </div>
        <div class="contentCtn">
          <div class="createCtn">
            <div class="rowCtn">
              <div class="colCtn">
                <div class="label">
                  <span class="text">单号</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="请输入单号"
                      v-model="order_in_info.code"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">采购单位</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="请输入采购单位"
                      v-model="order_in_info.client_name"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn"></div>
            </div>
            <div style="background:#f0f0f0;padding:12px;margin:12px 0"
              v-for="(itemChild,indexChild) in order_in_info.child_data"
              :key="indexChild">
              <div class="rowCtn"
                style="background:#f0f0f0">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">纱线名称</span>
                    <span class="explanation">(默认)</span>
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
                  <div class="label">
                    <span class="text">纱线颜色</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input disabled
                        placeholder="请输入纱线信息"
                        v-model="itemChild.color"></el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">纱线属性</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input disabled
                        placeholder="请输入纱线信息"
                        v-model="itemChild.attribute"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rowCtn"
                style="background:#f0f0f0">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">入库批号</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input placeholder="请输入入库批号"
                        v-model="itemChild.batch_code"></el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">入库色号</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input placeholder="请输入入库色号"
                        v-model="itemChild.color_code"></el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">入库缸号</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input placeholder="请输入入库缸号"
                        v-model="itemChild.vat_code"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rowCtn"
                style="background:#f0f0f0">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">采购数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input disabled
                        placeholder="请输入采购数量"
                        v-model="itemChild.order_weight">
                        <template slot="append">kg</template>
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">入库数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input placeholder="请输入入库数量"
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
                  <span class="explanation">(选填)</span>
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
    <div class="popup"
      v-show="flags.store_out_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">调取出库</span>
          <i class="close_icon el-icon-close"
            @click="resetStoreOut"></i>
        </div>
        <div class="contentCtn">
          <div class="createCtn">
            <div class="rowCtn">
              <div class="colCtn">
                <div class="label">
                  <span class="text">调取单号</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="请输入单号"
                      v-model="store_out_info.code"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">来源仓库</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="请输入来源仓库"
                      v-model="store_out_info.store_name"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">纱线名称</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="请输入纱线名称"
                      v-model="store_out_info.name"></el-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn">
                <div class="label">
                  <span class="text">调取颜色/属性</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content flexRow">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="请输入单号"
                      v-model="store_out_info.color"></el-input>
                  </div>
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="请输入来源仓库"
                      v-model="store_out_info.attribute"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">调取纱线批号</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="调取纱线批号"
                      v-model="store_out_info.batch_code"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">色号/批(缸)号</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content flexRow">
                  <div class="elCtn">
                    <el-input style="margin-right:12px"
                      disabled
                      placeholder="色号"
                      v-model="store_out_info.color_code"></el-input>
                  </div>
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="批(缸)号"
                      v-model="store_out_info.vat_code"></el-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn">
                <div class="label">
                  <span class="text">调取数量</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="调取数量"
                      v-model="store_out_info.total_weight">
                      <template slot="append">kg</template>
                    </el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">出库数量/件数</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="content flexRow">
                  <div class="elCtn">
                    <el-input placeholder="数量"
                      v-model="store_out_info.action_weight">
                      <template slot="append">kg</template>
                    </el-input>
                  </div>
                  <div class="elCtn">
                    <el-input placeholder="件数"
                      v-model="store_out_info.item">
                      <template slot="append">件</template>
                    </el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">出库时间</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-date-picker class="el"
                      style="width:100%"
                      v-model="store_out_info.date"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                    </el-date-picker>
                  </div>
                </div>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn"
                style="max-width:255px">
                <div class="label">
                  <span class="text">出库单位</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-select placeholder="请选择出库去向"
                      v-model="store_out_info.client_id">
                      <el-option v-for="item in process_client_arr"
                        :key="item.client_id"
                        :value="item.client_id"
                        :label="item.client_name"></el-option>
                    </el-select>
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
                      v-model="store_out_info.desc">
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="resetStoreOut">取消</div>
          <div class="opr blue"
            @click="saveStoreOut">确认出库</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="flags.order_out_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">采购出库</span>
          <i class="close_icon el-icon-close"
            @click="resetOrderOut"></i>
        </div>
        <div class="contentCtn">
          <div class="createCtn">
            <div class="rowCtn">
              <div class="colCtn">
                <div class="label">
                  <span class="text">入库单号</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="请输入单号"
                      v-model="order_out_info.code"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">来源仓库</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="来源仓库"
                      v-model="order_out_info.store_name"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn"></div>
            </div>
            <div style="background:#f0f0f0;padding:12px;margin:12px 0"
              v-for="(item,index) in order_out_info.child_data"
              :key="index">
              <div class="rowCtn"
                style="background:#f0f0f0">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">纱线信息</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input disabled
                        placeholder="请输入纱线信息"
                        v-model="item.yarn_info"></el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">批号/色号/缸号</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input disabled
                        placeholder="色号/缸号"
                        v-model="item.yarn_other"></el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">入库数量</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input style="margin-right:12px"
                        disabled
                        placeholder="入库数量"
                        v-model="item.in_weight">
                        <template slot="append">kg</template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rowCtn"
                style="background:#f0f0f0;">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">出库数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input style="margin-right:12px"
                        placeholder="出库数量"
                        v-model="item.action_weight">
                        <template slot="append">kg</template>
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">出库件数</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input style="margin-right:12px"
                        placeholder="出库件数"
                        v-model="item.item">
                        <template slot="append">件</template>
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn"></div>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn">
                <div class="label">
                  <span class="text">出库单位</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-select placeholder="请选择出库去向"
                      v-model="order_out_info.client_id">
                      <el-option v-for="item in process_client_arr"
                        :key="item.client_id"
                        :value="item.client_id"
                        :label="item.client_name"></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">出库日期</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-date-picker class="el"
                      style="width:100%"
                      v-model="order_out_info.complete_time"
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
                      v-model="order_out_info.desc">
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="resetOrderOut">取消</div>
          <div class="opr blue"
            @click="saveOrderOut">确认出库</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="flags.order_store_in_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">加工入库</span>
          <i class="close_icon el-icon-close"
            @click="resetOrderStoreIn"></i>
        </div>
        <div class="contentCtn">
          <div class="createCtn">
            <div class="rowCtn">
              <div class="colCtn">
                <div class="label">
                  <span class="text">出库单号</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="请输入单号"
                      v-model="order_store_in_info.code"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">来源单位</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="来源单位"
                      v-model="order_store_in_info.client_name"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn"></div>
            </div>
            <div style="background:#f0f0f0;padding:12px;margin:12px 0"
              v-for="(item,index) in order_store_in_info.child_data"
              :key="index">
              <div class="rowCtn"
                style="background:#f0f0f0;">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">纱线名称</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input disabled
                        placeholder="请输入单号"
                        v-model="item.name"></el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">出库/入库颜色</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="content">
                    <div class="content flexRow">
                      <div class="elCtn">
                        <el-input style="margin-right:12px"
                          disabled
                          placeholder="出库颜色"
                          v-model="item.before_color"></el-input>
                      </div>
                      <div class="elCtn">
                        <el-autocomplete class="inline-input"
                          v-model="item.color"
                          :fetch-suggestions="searchColor"
                          placeholder="入库颜色"></el-autocomplete>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">出库/入库属性</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="content flexRow">
                    <div class="elCtn">
                      <el-input style="margin-right:12px"
                        disabled
                        placeholder="出库属性"
                        v-model="item.before_attribute"></el-input>
                    </div>
                    <div class="elCtn">
                      <el-select placeholder="入库属性"
                        v-model="item.attribute">
                        <el-option label="筒纱"
                          value="筒纱"></el-option>
                        <el-option label="绞纱"
                          value="绞纱"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rowCtn"
                style="background:#f0f0f0;">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">入库批号</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input placeholder="入库批号"
                        v-model="item.batch_code">
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">入库色号/缸号</span>
                  </div>
                  <div class="content flexRow">
                    <div class="elCtn">
                      <el-input placeholder="色号"
                        v-model="item.color_code"></el-input>
                    </div>
                    <div class="elCtn">
                      <el-input placeholder="缸号"
                        v-model="item.vat_code"></el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">入库数量/件数</span>
                  </div>
                  <div class="content flexRow">
                    <div class="elCtn">
                      <el-input placeholder="数量"
                        v-model="item.action_weight">
                        <template slot="append">kg</template>
                      </el-input>
                    </div>
                    <div class="elCtn">
                      <el-input placeholder="件数"
                        v-model="item.item">
                        <template slot="append">件</template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn">
                <div class="label">
                  <span class="text">入库仓库</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-cascader v-model="order_store_in_info.select_id"
                      :options="store_list"
                      :props="{value:'id',label:'name',children:'second_data'}"
                      placeholder="请选择入库仓库">
                    </el-cascader>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">入库日期</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-date-picker class="el"
                      style="width:100%"
                      v-model="order_store_in_info.complete_time"
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
                      v-model="order_store_in_info.desc">
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="resetOrderStoreIn">取消</div>
          <div class="opr blue"
            @click="saveOrderStoreIn">确认入库</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="flags.process_out_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">加工出库</span>
          <i class="close_icon el-icon-close"
            @click="resetProcessOut"></i>
        </div>
        <div class="contentCtn">
          <div class="createCtn">
            <div class="rowCtn">
              <div class="colCtn">
                <div class="label">
                  <span class="text">入库单号</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="请输入单号"
                      v-model="process_out_info.code"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">来源仓库</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="来源仓库"
                      v-model="process_out_info.store_name"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn"></div>
            </div>
            <div class="rowCtn"
              v-for="(item,index) in process_out_info.child_data"
              :key="index">
              <div class="colCtn">
                <div class="label"
                  v-if="index===0">
                  <span class="text">纱线信息</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="请输入纱线信息"
                      v-model="item.yarn_info"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label"
                  v-if="index===0">
                  <span class="text">入库数量</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-input disabled
                      placeholder="入库数量"
                      v-model="item.in_weight"></el-input>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label"
                  v-if="index===0">
                  <span class="text">出库数量/件数</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="content flexRow">
                  <div class="elCtn">
                    <el-input placeholder="数量"
                      v-model="item.action_weight">
                      <template slot="append">kg</template>
                    </el-input>
                  </div>
                  <div class="elCtn">
                    <el-input placeholder="件数"
                      v-model="item.item">
                      <template slot="append">件</template>
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn">
                <div class="label">
                  <span class="text">出库单位</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-select placeholder="请选择出库去向"
                      v-model="process_out_info.client_id">
                      <el-option v-for="item in process_client_arr"
                        :key="item.client_id"
                        :value="item.client_id"
                        :label="item.client_name"></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="colCtn">
                <div class="label">
                  <span class="text">出库日期</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-date-picker class="el"
                      style="width:100%"
                      v-model="process_out_info.complete_time"
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
                      v-model="process_out_info.desc">
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="resetProcessOut">取消</div>
          <div class="opr blue"
            @click="saveProcessOut">确认出库</div>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Order } from '@/types/order'
import { order, yarnOrder, store, yarnProcess, stock } from '@/assets/js/api'
import { OrderYarn } from '@/types/orderProcessYarn'
import { StoreCreate, OrderStoreInfo } from '@/types/store'
export default Vue.extend({
  data(): {
    order_info: Order
    order_yarn_list: OrderYarn[]
    order_out_info: StoreCreate
    order_store_in_info: StoreCreate
    process_out_info: StoreCreate
    [propName: string]: any
  } {
    return {
      loading: true,
      checkAll: false,
      indeterminate: false,
      module_state: 1,
      color_arr: [],
      order_info: {
        order_code: '',
        order_time: '',
        delivery_time: '',
        client_id: '',
        total_price: '',
        total_weight: 0,
        desc: '',
        additional_fee: '',
        product_info: []
      },
      flags: {
        in_flag: false,
        out_flag: false,
        order_in_flag: false,
        store_out_flag: false,
        order_out_flag: false,
        order_store_in_flag: false,
        process_out_flag: false
      },
      order_yarn_list: [],
      store_yarn_list: [],
      process_client_arr: [],
      log_info: {
        order_in_log: [], // 采购入库日志
        order_store_out_log: [], // 订购调取出库日志
        process_in_log: [], // 加工入库日志
        final_out_log: [] // 最终出库日志
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
      store_out_info: {
        code: '',
        client_name: '',
        select_id: '',
        action_type: '',
        desc: '',
        date: this.$getDate(new Date())
      },
      order_out_info: {
        id: '',
        code: '',
        client_id: '',
        action_type: 8,
        complete_time: this.$getDate(new Date()),
        desc: '',
        child_data: []
      },
      order_store_in_info: {
        id: '',
        code: '',
        client_id: '',
        action_type: 5,
        complete_time: this.$getDate(new Date()),
        desc: '',
        select_id: [],
        child_data: []
      },
      process_out_info: {
        id: '',
        code: '',
        client_id: '',
        action_type: 6,
        complete_time: this.$getDate(new Date()),
        desc: '',
        child_data: []
      }
    }
  },
  computed: {
    store_list() {
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 1)
    }
  },
  methods: {
    init() {
      // 初始化弹窗信息
      this.flags = {
        in_flag: false,
        out_flag: false,
        order_in_flag: false,
        store_out_flag: false,
        order_out_flag: false,
        order_store_in_flag: false,
        process_out_flag: false
      }
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
        this.order_info.product_info.forEach((itemChild: any) => {
          if (!this.color_arr.find((itemFind: any) => itemFind.value === itemChild.color)) {
            this.color_arr.push({
              value: itemChild.color
            })
          }
        })
        this.order_info.product_info = this.$mergeData(this.order_info.product_info, {
          mainRule: 'product_name',
          childrenName: 'child_data',
          otherRule: [{ name: 'product_id' }]
        })
        this.order_yarn_list = res[1].data.data
        this.store_yarn_list = res[2].data.data
        this.process_client_arr = this.$mergeData(res[3].data.data, {
          mainRule: 'client_id',
          otherRule: [{ name: 'client_name' }]
        })
        this.process_client_arr.push({
          client_id: this.order_info.client_id,
          client_name: this.order_info.client_name
        })
        this.log_info.order_in_log = res[4].data.data.data.items.filter(
          (item: StoreCreate) => Number(item.action_type) === 3
        )
        this.log_info.order_store_out_log = res[4].data.data.data.items.filter(
          (item: StoreCreate) =>
            (Number(item.action_type) === 4 || Number(item.action_type) === 7) &&
            Number(item.client_id) !== Number(this.order_info.client_id)
        )
        this.log_info.process_in_log = res[4].data.data.data.items.filter(
          (item: StoreCreate) => Number(item.action_type) === 5
        )
        // 这里用action_type===9 或 client
        this.log_info.final_out_log = res[4].data.data.data.items.filter(
          (item: StoreCreate) => Number(item.client_id) === Number(this.order_info.client_id)
        )
        this.loading = false
      })
    },
    openOrderIn(info: OrderYarn) {
      this.order_in_info = {
        id: info.id,
        code: info.code,
        client_name: info.client_name,
        client_id: info.client_id,
        select_id: '',
        action_type: 3,
        child_data: info.child_data.map((item) => {
          return {
            name: item.name,
            yarn_name: item.name,
            order_weight: item.reality_weight,
            action_weight: '',
            color: item.color,
            attribute: item.attribute,
            batch_code: '',
            color_code: '',
            vat_code: '',
            item: '',
            related_id: item.id // 关联单据
          }
        }),
        date: this.$getDate(new Date()),
        desc: ''
      }
      this.flags.order_in_flag = true
    },
    resetOrderIn() {
      this.flags.order_in_flag = false
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
      // 数据验证结束
      const formData: StoreCreate = {
        order_id: this.$route.params.id,
        related_id: this.order_in_info.id,
        action_type: 3,
        complete_time: this.order_in_info.date,
        desc: this.order_in_info.desc,
        store_id: this.order_in_info.select_id[0],
        second_store_id: this.order_in_info.select_id[1],
        client_id: this.order_in_info.client_id,
        child_data: this.order_in_info.child_data.map((item: any) => {
          return {
            order_id: this.$route.params.id,
            name: item.yarn_name,
            action_weight: item.action_weight,
            color: item.color,
            attribute: item.attribute,
            batch_code: item.batch_code || 'NOT_SET',
            color_code: item.color_code || 'NOT_SET',
            vat_code: item.vat_code || 'NOT_SET',
            item: item.item,
            related_info_id: item.related_id,
            desc: ''
          }
        })
      }
      stock.create({ data: [formData] }).then((res) => {
        if (res.data.status) {
          this.$message.success('入库成功')
          this.init()
        }
      })
    },
    openStoreOut(info: OrderStoreInfo) {
      this.store_out_info = {
        id: info.id,
        code: info.code,
        client_id: '',
        store_id: info.store_id,
        second_store_id: info.second_store_id,
        store_name: info.store_name + '/' + info.second_store_name,
        action_type: 4,
        name: info.name,
        color: info.color,
        color_code: info.color_code,
        vat_code: info.vat_code,
        batch_code: info.batch_code,
        attribute: info.attribute,
        total_weight: info.total_weight,
        action_weight: '',
        desc: '',
        item: '',
        date: this.$getDate(new Date())
      }
      this.flags.store_out_flag = true
    },
    resetStoreOut() {
      this.flags.store_out_flag = false
    },
    saveStoreOut() {
      if (
        this.$formCheck(this.store_out_info, [
          {
            key: 'client_id',
            errMsg: '请选择出库单位'
          },
          {
            key: 'action_weight',
            errMsg: '请输入出库数量'
          },
          {
            key: 'item',
            errMsg: '请选择出库件数'
          }
        ])
      ) {
        return
      }
      const formData: StoreCreate = {
        order_id: this.$route.params.id,
        related_id: this.store_out_info.id,
        action_type: 4,
        complete_time: this.store_out_info.date,
        desc: this.store_out_info.desc,
        store_id: this.store_out_info.store_id,
        second_store_id: this.store_out_info.second_store_id,
        client_id: this.store_out_info.client_id,
        child_data: [
          {
            name: this.store_out_info.name,
            action_weight: this.store_out_info.action_weight,
            color: this.store_out_info.color,
            batch_code: this.store_out_info.batch_code,
            attribute: this.store_out_info.attribute,
            color_code: this.store_out_info.color_code,
            vat_code: this.store_out_info.vat_code,
            related_info_id: '',
            item: this.store_out_info.item,
            desc: ''
          }
        ]
      }
      stock.create({ data: [formData] }).then((res) => {
        if (res.data.status) {
          this.$message.success('出库成功')
          this.init()
        }
      })
    },
    openOrderOut(info: StoreCreate) {
      this.order_out_info = {
        id: info.id,
        code: info.code,
        client_id: '',
        action_type: 7,
        store_id: info.store_id,
        second_store_id: info.second_store_id,
        store_name: info.store_name + '/' + info.second_store_name,
        complete_time: this.$getDate(new Date()),
        desc: '',
        child_data: info.child_data.map((item) => {
          return {
            yarn_info: item.name + '/' + item.color + '/' + item.attribute,
            yarn_other:
              (item.batch_code === 'NOT_SET' ? '无批号' : item.batch_code) +
              '/' +
              (item.color_code === 'NOT_SET' ? '无色号' : item.color_code) +
              '/' +
              (item.vat_code === 'NOT_SET' ? '无缸号' : item.vat_code),
            item: '',
            name: item.name,
            client_id: '',
            in_weight: item.action_weight,
            action_weight: '',
            color: item.color,
            attribute: item.attribute,
            batch_code: item.batch_code,
            color_code: item.color_code,
            vat_code: item.vat_code,
            related_info_id: '',
            desc: ''
          }
        })
      }
      this.flags.order_out_flag = true
    },
    resetOrderOut() {
      this.flags.order_out_flag = false
    },
    saveOrderOut() {
      if (
        this.$formCheck(this.order_out_info, [
          {
            key: 'client_id',
            errMsg: '请选择出库单位'
          }
        ])
      ) {
        return
      }
      if (
        this.order_out_info.child_data.some((itemChild: any) => {
          return this.$formCheck(itemChild, [
            {
              key: 'action_weight',
              errMsg: '请输入出库重量'
            },
            {
              key: 'item',
              errMsg: '请输入出库件数'
            }
          ])
        })
      ) {
        return
      }
      const formData: StoreCreate = {
        order_id: this.$route.params.id,
        related_id: this.order_out_info.id,
        action_type: Number(this.order_out_info.client_id) === Number(this.order_info.client_id) ? 9 : 7,
        complete_time: this.order_out_info.complete_time,
        desc: this.order_out_info.desc,
        store_id: this.order_out_info.store_id,
        second_store_id: this.order_out_info.second_store_id,
        client_id: this.order_out_info.client_id,
        child_data: this.order_out_info.child_data.map((item) => {
          return {
            name: item.name,
            item: item.item,
            action_weight: item.action_weight,
            color: item.color,
            attribute: item.attribute,
            batch_code: item.batch_code,
            color_code: item.color_code,
            vat_code: item.vat_code,
            related_info_id: '',
            desc: ''
          }
        })
      }
      stock.create({ data: [formData] }).then((res) => {
        if (res.data.status) {
          this.$message.success('出库成功')
          this.init()
        }
      })
    },
    openOrderStoreIn(info: StoreCreate) {
      this.order_store_in_info = {
        id: info.id,
        code: info.code,
        action_type: 7,
        complete_time: this.$getDate(new Date()),
        desc: '',
        client_id: info.client_id,
        client_name: info.client_name,
        store_id: '',
        second_store_id: '',
        select_id: [],
        child_data: info.child_data.map((item) => {
          return {
            name: item.name,
            out_weight: item.action_weight,
            action_weight: '',
            before_color: item.color,
            color: '',
            before_attribute: item.attribute,
            attribute: '',
            before_color_code: item.color_code,
            color_code: '',
            before_vat_code: item.vat_code,
            vat_code: '',
            before_batch_code: item.batch_code,
            batch_code: '',
            related_info_id: '',
            desc: '',
            item: ''
          }
        })
      }
      this.flags.order_store_in_flag = true
    },
    resetOrderStoreIn() {
      this.flags.order_store_in_flag = false
    },
    saveOrderStoreIn() {
      if (
        this.$formCheck(this.order_store_in_info, [
          {
            key: 'select_id',
            errMsg: '请选择入库仓库'
          }
        ])
      ) {
        return
      }
      if (
        this.order_store_in_info.child_data.some((itemChild: any) => {
          return this.$formCheck(itemChild, [
            {
              key: 'action_weight',
              errMsg: '请输入入库重量'
            },
            {
              key: 'item',
              errMsg: '请输入入库件数'
            },
            {
              key: 'color',
              errMsg: '请输入入库颜色'
            },
            {
              key: 'attribute',
              errMsg: '请选择入库属性'
            },
            {
              key: 'color_code',
              errMsg: '请输入入库色号'
            },
            {
              key: 'vat_code',
              errMsg: '请输入入库批/缸号'
            }
          ])
        })
      ) {
        return
      }
      const formData: StoreCreate = {
        order_id: this.$route.params.id,
        related_id: this.order_store_in_info.id,
        action_type: 5,
        store_id: (this.order_store_in_info.select_id as number[])[0],
        second_store_id: (this.order_store_in_info.select_id as number[])[1],
        client_id: this.order_store_in_info.client_id,
        complete_time: this.order_store_in_info.complete_time,
        desc: this.order_store_in_info.desc,
        child_data: this.order_store_in_info.child_data.map((item) => {
          return {
            name: item.name,
            action_weight: item.action_weight,
            color: item.color,
            attribute: item.attribute,
            batch_code: item.batch_code,
            color_code: item.color_code,
            vat_code: item.vat_code,
            related_info_id: '',
            desc: '',
            item: item.item
          }
        })
      }
      stock.create({ data: [formData] }).then((res) => {
        if (res.data.status) {
          this.$message.success('入库成功')
          this.init()
        }
      })
    },
    openProcessOut(info: StoreCreate) {
      this.process_out_info = {
        id: info.id,
        code: info.code,
        client_id: this.order_info.client_id,
        action_type: 6,
        complete_time: this.$getDate(new Date()),
        desc: '',
        store_id: info.store_id,
        store_name: info.store_name + '/' + info.second_store_name,
        second_store_id: info.second_store_id,
        child_data: info.child_data.map((item) => {
          return {
            yarn_info:
              item.name +
              '/' +
              item.color +
              '/' +
              item.attribute +
              '/' +
              (item.batch_code === 'NOT_SET' ? '无批号' : item.batch_code) +
              '/' +
              (item.color_code === 'NOT_SET' ? '无色号' : item.color_code) +
              '/' +
              (item.vat_code === 'NOT_SET' ? '无批号' : item.vat_code),
            name: item.name,
            client_id: '',
            in_weight: item.action_weight,
            action_weight: item.action_weight,
            color: item.color,
            attribute: item.attribute,
            batch_code: item.batch_code,
            color_code: item.color_code,
            vat_code: item.vat_code,
            related_info_id: '',
            desc: '',
            item: ''
          }
        })
      }
      this.flags.process_out_flag = true
    },
    resetProcessOut() {
      this.flags.process_out_flag = false
    },
    saveProcessOut() {
      if (
        this.$formCheck(this.process_out_info, [
          {
            key: 'client_id',
            errMsg: '请选择出库单位'
          }
        ])
      ) {
        return
      }
      if (
        this.process_out_info.child_data.some((itemChild: any) => {
          return this.$formCheck(itemChild, [
            {
              key: 'action_weight',
              errMsg: '请输入出库重量'
            },
            {
              key: 'item',
              errMsg: '请输入出库件数'
            }
          ])
        })
      ) {
        return
      }
      const formData: StoreCreate = {
        order_id: this.$route.params.id,
        related_id: this.process_out_info.id,
        action_type: Number(this.order_out_info.client_id) === Number(this.order_info.client_id) ? 9 : 6,
        complete_time: this.process_out_info.complete_time,
        store_id: this.process_out_info.store_id,
        second_store_id: this.process_out_info.second_store_id,
        client_id: this.process_out_info.client_id,
        desc: this.process_out_info.desc,
        child_data: this.process_out_info.child_data.map((item) => {
          return {
            name: item.name,
            action_weight: item.action_weight,
            color: item.color,
            attribute: item.attribute,
            color_code: item.color_code,
            batch_code: item.batch_code,
            vat_code: item.vat_code,
            related_info_id: '',
            desc: '',
            item: item.item
          }
        })
      }
      stock.create({ data: [formData] }).then((res) => {
        if (res.data.status) {
          this.$message.success('出库成功')
          this.init()
        }
      })
    },
    // 颜色优化
    searchColor(queryString: string, cb: any) {
      const results = queryString
        ? this.color_arr.filter((item: any) => {
            return item.value.toLowerCase().indexOf(item.toLowerCase()) === 0
          })
        : this.color_arr
      // 调用 callback 返回建议列表的数据
      cb(results)
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
@import '~@/assets/less/inAndOut/detail.less';
</style>
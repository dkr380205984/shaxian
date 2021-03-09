<template>
  <div class="indexMain"
    id="yarnOrderDetail">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">订单号：</span>
            <span class="text green">暂时没有，自己编的</span>
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
        <div class="btnCtn clearfix">
          <div class="btn"
            :class="{'btnMain':checkList.length>0,'btnGray':checkList.length===0}"
            @click="openOrder('白胚')">订购白胚</div>
          <div class="btn"
            :class="{'btnMain':checkList.length>0,'btnGray':checkList.length===0}"
            @click="openOrder()">订购色纱</div>
          <div class="btn"
            :class="{'btnMain':checkList.length===1,'btnGray':checkList.length!==1}"
            @click="openStore">库存调取</div>
          <div class="btn"
            :class="{'btnMain':checkList.length>0,'btnGray':checkList.length===0}"
            @click="openProcess('染色')">染色加工</div>
          <div class="btn"
            :class="{'btnMain':checkList.length>0,'btnGray':checkList.length===0}"
            @click="openProcess('倒筒')">倒筒加工</div>
          <div class="btn"
            :class="{'btnMain':checkList.length>0,'btnGray':checkList.length===0}"
            @click="openProcess('膨纱')">膨纱加工</div>
        </div>
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">
                <el-checkbox v-model="checkAll"
                  :indeterminate="indeterminate"
                  @change="checkAllPro">纱线名称</el-checkbox>
              </div>
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
              <div class="tcolumn">
                <el-checkbox v-model="item.check"
                  :indeterminate="item.indeterminate"
                  @change="checkAllSize($event,item)">{{item.product_name}}</el-checkbox>
              </div>
              <div class="tcolumn noPad"
                style="flex:7">
                <div class="trow"
                  v-for="itemChild in item.child_data"
                  :key="itemChild.id">
                  <div class="tcolumn">
                    <el-checkbox v-model="itemChild.check"
                      @change="checkSize($event,item)">{{itemChild.color}}</el-checkbox>
                  </div>
                  <div class="tcolumn">{{itemChild.attribute}}</div>
                  <div class="tcolumn">{{itemChild.price}}</div>
                  <div class="tcolumn blue">{{itemChild.weight}}</div>
                  <div class="tcolumn">{{itemChild.number_attribute}}</div>
                  <div class="tcolumn blue">0</div>
                  <div class="tcolumn blue">0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">库存调取信息</span>
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
                      style="flex:10;flex-direction:column">
                      <div class="row">
                        <div class="column min120">订单纱线</div>
                        <div class="column min120">下单颜色/属性</div>
                        <div class="column min120">调取数量</div>
                        <div class="column min120">实际调取数量</div>
                      </div>
                    </div>
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
                      style="flex:10;flex-direction:column">
                      <div class="row"
                        v-for="itemChild in item.child_data"
                        :key="itemChild.order_info_id">
                        <div class="column min120">{{itemChild.name}}</div>
                        <div class="column min120">{{itemChild.color}}/{{itemChild.attribute}}</div>
                        <div class="column min120 blue">{{itemChild.weight}}</div>
                        <div class="column min120 blue">{{itemChild.reality_weight}}</div>
                      </div>
                    </div>
                    <div class="column min120">操作日期</div>
                    <div class="column min120">备注信息</div>
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
                    <span class="blue opr">打印</span>
                    <span class="red opr"
                      @click="deleteStore(item.id)">删除</span>
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
        <span class="title">订购信息</span>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="overflow">
            <div class="tableCtn">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">单号</div>
                    <div class="column min120">供货商</div>
                    <div class="column"
                      style="flex:10;flex-direction:column">
                      <div class="row">
                        <div class="column min120">纱线名称</div>
                        <div class="column min120">订购颜色</div>
                        <div class="column min120">订购属性</div>
                        <div class="column min120">订购数量</div>
                        <div class="column min120">实际订购数量</div>
                        <div class="column min120">备注信息</div>
                        <div class="column min120">创建人</div>
                        <div class="column min120">审核状态</div>
                        <div class="column min120">结算状态</div>
                        <div class="column min120">扣款信息</div>
                      </div>
                    </div>
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
                        <div class="column min120">{{itemChild.price}}</div>
                        <div class="column min120 blue">{{itemChild.weight}}</div>
                        <div class="column min120 blue">{{itemChild.reality_weight}}</div>
                        <div class="column min120">{{itemChild.desc||'无'}}</div>
                        <div class="column min120">创建人</div>
                        <div class="column min120">审核状态</div>
                        <div class="column min120">结算状态</div>
                        <div class="column min120">扣款信息</div>
                      </div>
                    </div>
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
                  <div class="column min120">单号</div>
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
                    <span class="blue opr">打印</span>
                    <span class="orange opr"
                      @click="getUpdateInfo(item)">修改</span>
                    <span class="red opr"
                      @click="deleteOrder(item.id)">删除</span>
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
                      style="flex:8;flex-direction:column">
                      <div class="row">
                        <div class="column min120">纱线名称</div>
                        <div class="column min120">加工详情</div>
                        <div class="column min120">计划加工数量</div>
                        <div class="column min120">实际加工数量</div>
                        <div class="column min120">创建人</div>
                        <div class="column min120">审核状态</div>
                        <div class="column min120">结算状态</div>
                        <div class="column min120">扣款信息</div>
                      </div>
                    </div>
                    <div class="column min120">创建人</div>
                    <div class="column min120">备注信息</div>
                    <div class="column min120">下单日期</div>
                    <div class="column min120">交货日期</div>
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
                      style="flex:8;flex-direction:column">
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
                        <div class="column min120 blue">{{itemChild.weight}}</div>
                        <div class="column min120 blue">没给</div>
                        <div class="column min120">创建人</div>
                        <div class="column min120">审核状态</div>
                        <div class="column min120">结算状态</div>
                        <div class="column min120">扣款信息</div>
                      </div>
                    </div>
                    <div class="column min120">没给</div>
                    <div class="column min120">{{item.desc}}</div>
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
                    <span class="blue opr">打印</span>
                    <span class="red opr"
                      @click="deleteProcess(item.id)">删除</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="flags.order_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">订购白胚</span>
          <i class="close_icon el-icon-close"
            @click="flags.order_flag = false"></i>
        </div>
        <div class="contentCtn">
          <div class="editCtn">
            <div class="editContainer"
              v-for="(item,index) in order_yarn_info"
              :key="index">
              <i class="el-icon-circle-close"></i>
              <div class="eRow">
                <div class="eColumn">
                  <div class="label isMust">供货商名称</div>
                  <div class="from">
                    <el-select placeholder="请选择供货商"
                      v-model="item.client_id">
                      <el-option v-for="item in client_arr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label isMust">统一属性</div>
                  <div class="from">
                    <el-select placeholder="选择统一订购属性"
                      v-model="item.common_attr">
                      <el-option label="筒纱"
                        value="筒纱"></el-option>
                      <el-option label="绞纱"
                        value="绞纱"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label isMust">统一单价</div>
                  <div class="from">
                    <el-input v-model="item.common_price"
                      placeholder="快捷填写统一单价">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
              </div>
              <div class="eRowCtn"
                v-for="(itemChild,indexChild) in item.child_data"
                :key="indexChild">
                <div class="sort">{{indexChild+1}}</div>
                <div class="eRow">
                  <div class="eColumn flex2">
                    <div class="label isMust">下单纱线</div>
                    <div class="from">
                      <el-select placeholder="请选择纱线"
                        v-model="itemChild.order_info_id"
                        @change="getOrderNumber($event,itemChild)">
                        <el-option v-for="item in select_yarn_arr"
                          :key="item.id"
                          :value="item.id"
                          :label="item.product_name + '/' + item.color + '/' + item.attribute"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="eColumn">
                    <div class="label isMust">订单数量</div>
                    <div class="from">
                      <el-input placeholder="有默认值"
                        disabled
                        v-model="itemChild.order_number">
                        <template slot="append">kg</template>
                      </el-input>
                    </div>
                  </div>
                  <div class="opr blue"
                    v-if="indexChild===0"
                    @click="$addItem(item.child_data,{
                      order_id: $route.params.id,
                      order_number: '',
                      order_info_id: '',
                      weight: '',
                      color: '',
                      attribute: '',
                      price: ''
                    })">添加</div>
                  <div class="opr red"
                    v-if="indexChild>0"
                    @click="$deleteItem(item.child_data,indexChild)">删除</div>
                </div>
                <div class="eRow">
                  <div class="eColumn">
                    <div class="label isMust">订购颜色/属性</div>
                    <div class="from flex">
                      <el-input placeholder="颜色"
                        v-model="itemChild.color"
                        style="margin-right:12px"></el-input>
                      <el-select placeholder="属性"
                        v-model="itemChild.attribute"></el-select>
                    </div>
                  </div>
                  <div class="eColumn">
                    <div class="label isMust">订购数量</div>
                    <div class="from">
                      <el-input placeholder="请输入订购数量"
                        v-model="itemChild.weight">
                        <template slot="append">kg</template>
                      </el-input>
                    </div>
                  </div>
                  <div class="eColumn">
                    <div class="label isMust">订购单价</div>
                    <div class="from">
                      <el-input placeholder="请输入订购数量"
                        v-model="itemChild.price">
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="eRow">
                <div class="eColumn">
                  <div class="label isMust">下单日期</div>
                  <div class="from">
                    <el-date-picker v-model="item.order_time"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择下单日期">
                    </el-date-picker>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label isMust">交货日期</div>
                  <div class="from">
                    <el-date-picker v-model="item.delivery_time"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择交货日期">
                    </el-date-picker>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label">备注信息</div>
                  <div class="from">
                    <el-input v-model="item.desc"
                      placeholder="请输入备注"></el-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="btns">
              <div class="btn btnMain">新增采购单</div>
              <div class="btn btnMain"
                style="margin-left:12px">复制上一组</div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="flags.order_flag = false">取消</div>
          <div class="opr blue"
            @click="saveOrder">确定</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="flags.order_update_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">修改订购信息</span>
          <i class="close_icon el-icon-close"
            @click="flags.order_update_flag = false"></i>
        </div>
        <div class="contentCtn">
          <div class="editCtn">
            <div class="editContainer">
              <i class="el-icon-circle-close"></i>
              <div class="eRow">
                <div class="eColumn">
                  <div class="label isMust">供货商名称</div>
                  <div class="from">
                    <el-select placeholder="请选择供货商"
                      v-model="update_order_info.client_id">
                      <el-option v-for="item in client_arr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="eRowCtn"
                v-for="(itemChild,indexChild) in update_order_info.child_data"
                :key="indexChild">
                <div class="sort">{{indexChild+1}}</div>
                <div class="eRow">
                  <div class="eColumn">
                    <div class="label isMust">纱线名称</div>
                    <div class="from">
                      <el-select placeholder="请选择纱线"
                        v-model="itemChild.order_info_id">
                        <el-option v-for="item in select_yarn_arr"
                          :key="item.id"
                          :value="item.id"
                          :label="item.product_name + '/' + item.color + '/' + item.attribute"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="eColumn">
                    <div class="label isMust">订购颜色</div>
                    <div class="from">
                      <el-input placeholder="颜色"
                        v-model="itemChild.color"
                        style="margin-right:12px"></el-input>
                    </div>
                  </div>
                  <div class="eColumn">
                    <div class="label isMust">订购属性</div>
                    <div class="from">
                      <el-select placeholder="属性"
                        v-model="itemChild.attribute">
                        <el-option label="筒纱"
                          value="筒纱"></el-option>
                        <el-option label="绞纱"
                          value="绞纱"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="opr blue"
                    v-if="indexChild===0"
                    @click="$addItem(update_order_info.child_data,{
                      order_id: $route.params.id,
                      order_number: '',
                      order_info_id: '',
                      weight: '',
                      color: '',
                      attribute: '',
                      price: ''
                    })">添加</div>
                  <div class="opr red"
                    v-if="indexChild>0"
                    @click="$deleteItem(update_order_info.child_data,indexChild)">删除</div>
                </div>
                <div class="eRow">
                  <div class="eColumn">
                    <div class="label isMust">订购数量</div>
                    <div class="from">
                      <el-input placeholder="请输入订购数量"
                        v-model="itemChild.weight">
                        <template slot="append">kg</template>
                      </el-input>
                    </div>
                  </div>
                  <div class="eColumn">
                    <div class="label isMust">订购单价</div>
                    <div class="from">
                      <el-input placeholder="请输入订购数量"
                        v-model="itemChild.price">
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                  </div>
                  <div class="eColumn">
                    <div class="label isMust">实际订购数量</div>
                    <div class="from">
                      <el-input placeholder="实际订购数量"
                        v-model="itemChild.reality_weight">
                        <template slot="append">kg</template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="eRow">
                <div class="eColumn">
                  <div class="label isMust">下单日期</div>
                  <div class="from">
                    <el-date-picker v-model="update_order_info.order_time"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择下单日期">
                    </el-date-picker>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label isMust">交货日期</div>
                  <div class="from">
                    <el-date-picker v-model="update_order_info.delivery_time"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择交货日期">
                    </el-date-picker>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label">备注信息</div>
                  <div class="from">
                    <el-input v-model="update_order_info.desc"
                      placeholder="请输入备注"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="flags.order_update_flag = false">取消</div>
          <div class="opr orange"
            @click="updateOrder">修改</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="flags.store_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">库存调取</span>
          <i class="close_icon el-icon-close"
            @click="resetStore"></i>
        </div>
        <div class="contentCtn">
          <div class="stepCtn">
            <div class="step"
              :class="{'active':store_step===1,'confirm':store_step>1}">
              <div class="index">1</div>
              <div class="text">选择仓库</div>
            </div>
            <div class="step"
              :class="{'active':store_step===2,'confirm':store_step>2}">
              <div class="index">2</div>
              <div class="text">调取信息</div>
            </div>
          </div>
          <div class="listCtn"
            v-if="store_step===1">
            <div class="filterCtn">
              <div class="leftCtn"
                style="padding-right:0">
                <div class="label">筛选条件：</div>
                <div class="elCtn">
                  <el-input v-model="store_filter.name"
                    placeholder="搜索纱线名称"></el-input>
                </div>
                <div class="elCtn">
                  <el-input v-model="store_filter.color"
                    placeholder="搜索颜色"></el-input>
                </div>
                <div class="elCtn">
                  <el-select v-model="store_filter.store_id"
                    placeholder="筛选仓库"></el-select>
                </div>
              </div>
              <div class="rightCtn"
                style="min-width:100px">
                <div class="btn btnGray fr">重置</div>
              </div>
            </div>
            <div class="tableCtn"
              style="margin:12px 0">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">纱线名称</div>
                  <div class="tcolumn noPad"
                    style="flex:8">
                    <div class="trow">
                      <div class="tcolumn">纱线颜色</div>
                      <div class="tcolumn">纱线属性</div>
                      <div class="tcolumn">色号</div>
                      <div class="tcolumn">批/缸号</div>
                      <div class="tcolumn">仓库名称</div>
                      <div class="tcolumn">实际库存</div>
                      <div class="tcolumn">可用库存</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="item in store_list"
                  :key="item.name">
                  <div class="tcolumn">{{item.name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:8">
                    <div class="trow"
                      v-for="itemChild in item.child_data"
                      :key="itemChild.id">
                      <div class="tcolumn">{{itemChild.color}}</div>
                      <div class="tcolumn">{{itemChild.attribute}}</div>
                      <div class="tcolumn">{{itemChild.color_code}}</div>
                      <div class="tcolumn">{{itemChild.vat_code}}</div>
                      <div class="tcolumn">{{itemChild.store_name}}</div>
                      <div class="tcolumn">{{itemChild.total_weight}}</div>
                      <div class="tcolumn">{{itemChild.use_weight}}</div>
                      <div class="tcolumn">
                        <span class="opr blue"
                          @click="getStoreInfo(itemChild,item.name)">调取</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="ctn"
            v-if="store_step===2">
            <div class="listCtn smallHeight">
              <div class="list">
                <div class="headCtn">
                  <div class="row">
                    <div class="column">纱线名称</div>
                    <div class="column">纱线颜色</div>
                    <div class="column">属性</div>
                    <div class="column">色号</div>
                    <div class="column">批/缸号</div>
                    <div class="column">仓库名称</div>
                    <div class="column">实际库存</div>
                    <div class="column">可用库存</div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div class="row">
                    <div class="column">{{store_info.product_name}}</div>
                    <div class="column">{{store_info.color}}</div>
                    <div class="column">{{store_info.attribute}}</div>
                    <div class="column">{{store_info.color_code}}</div>
                    <div class="column">{{store_info.vat_code}}</div>
                    <div class="column">{{store_info.store_name}}</div>
                    <div class="column">{{store_info.reality_weight}}</div>
                    <div class="column">{{store_info.use_weight}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tableCtn"
              style="margin:12px 0">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">纱线名称</div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcolumn">下单颜色</div>
                      <div class="tcolumn">下单属性</div>
                      <div class="tcolumn">下单数量</div>
                      <div class="tcolumn">库存调取数量</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow">
                  <div class="tcolumn">{{checkList[0].product_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in store_info.child_data"
                      :key="index">
                      <div class="tcolumn">{{item.color}}</div>
                      <div class="tcolumn">{{item.attribute}}</div>
                      <div class="tcolumn">{{item.order_weight}}</div>
                      <div class="tcolumn">
                        <el-input class="el"
                          v-model="item.weight"
                          placeholder="请输入调取数量"
                          @input="getTotalStore"></el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="total_info">
              <div>
                <span class="label">合计调取：</span>
                <span class="text blue">{{store_info.total_weight}}kg</span>
              </div>
              <div>
                <el-input style="width:720px"
                  v-model="store_info.desc"
                  placeholder="请输入备注信息"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="resetStore">取消</div>
          <div class="opr orange"
            v-if="store_step===2"
            @click="store_step= 1">上一步</div>
          <div class="opr blue"
            v-if="store_step===2"
            @click="saveStore">确认调取</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="flags.process_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">{{flags.process_flag}}加工</span>
          <i class="close_icon el-icon-close"
            @click="resetProcess"></i>
        </div>
        <div class="contentCtn">
          <div class="editCtn">
            <div class="editContainer"
              v-for="(item,index) in process_yarn_info"
              :key="index">
              <i class="el-icon-circle-close"></i>
              <div class="eRow">
                <div class="eColumn">
                  <div class="label isMust">加工单位名称</div>
                  <div class="from">
                    <el-select v-model="item.client_id"
                      placeholder="请选择加工单位"
                      v-if="item.type==='倒筒'">
                      <el-option v-for="item in supplier_arr_a"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"></el-option>
                    </el-select>
                    <el-select v-model="item.client_id"
                      placeholder="请选择加工单位"
                      v-if="item.type==='染色'">
                      <el-option v-for="item in supplier_arr_b"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"></el-option>
                    </el-select>
                    <el-select v-model="item.client_id"
                      placeholder="请选择加工单位"
                      v-if="item.type==='膨纱'">
                      <el-option v-for="item in supplier_arr_c"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label isMust">加工单价</div>
                  <div class="from">
                    <el-input v-model="item.price"
                      placeholder="请输入加工单价">
                      <template slot="append">元/kg</template>
                    </el-input>
                  </div>
                </div>
              </div>
              <div class="eRow"
                v-for="(itemChild,indexChild) in  item.child_data"
                :key="indexChild">
                <div class="eColumn">
                  <div class="label isMust"
                    v-if="indexChild===0">纱线名称</div>
                  <div class="from">
                    <el-select v-model="itemChild.name"
                      placeholder="请选择加工纱线">
                      <el-option v-for="item in process_select_yarn"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="eColumn"
                  v-if="item.type==='倒筒' ">
                  <div class="label isMust"
                    v-if="indexChild===0">加工前/加工后</div>
                  <div class="from flex">
                    <el-select v-model="itemChild.before_attribute"
                      placeholder="加工前属性"
                      style="margin-right:12px">
                      <el-option label="筒纱"
                        value="筒纱"></el-option>
                      <el-option label="绞纱"
                        value="绞纱"></el-option>
                    </el-select>
                    <el-select v-model="itemChild.after_attribute"
                      placeholder="加工后属性">
                      <el-option label="筒纱"
                        value="筒纱"></el-option>
                      <el-option label="绞纱"
                        value="绞纱"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="eColumn"
                  v-if="item.type==='染色'">
                  <div class="label isMust"
                    v-if="indexChild===0">加工前/加工后</div>
                  <div class="from flex">
                    <el-input v-model="itemChild.before_color"
                      placeholder="加工前颜色"
                      disabled
                      style="margin-right:12px">
                    </el-input>
                    <el-input v-model="itemChild.after_color"
                      placeholder="加工后颜色">
                    </el-input>
                  </div>
                </div>
                <div class="eColumn"
                  v-if="item.type==='膨纱'">
                  <div class="label isMust"
                    v-if="indexChild===0">颜色/属性</div>
                  <div class="from flex">
                    <el-input v-model="itemChild.color"
                      placeholder="输入颜色"
                      style="margin-right:12px">
                    </el-input>
                    <el-select v-model="itemChild.attribute"
                      placeholder="属性">
                      <el-option label="筒纱"
                        value="筒纱"></el-option>
                      <el-option label="绞纱"
                        value="绞纱"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label isMust"
                    v-if="indexChild===0">加工数量</div>
                  <div class="from flex">
                    <el-input v-model="itemChild.weight"
                      placeholder="加工数量">
                      <template slot="append">kg</template>
                    </el-input>
                  </div>
                </div>
                <div class="opr blue"
                  v-if="indexChild===0"
                  @click="$addItem(item.child_data,{
                    name: '',
                    before_attribute: '',
                    after_attribute: '',
                    before_color: '白胚',
                    after_color: '',
                    color: '',
                    attribute: '',
                    weight: ''
                })">添加</div>
                <div class="opr red"
                  v-if="indexChild>0"
                  style="margin-top:0"
                  @click="$deleteItem(item.child_data,indexChild)">删除</div>
              </div>
              <div class="eRow">
                <div class="eColumn">
                  <div class="label isMust">下单日期</div>
                  <div class="from">
                    <el-date-picker v-model="item.order_time"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择下单日期">
                    </el-date-picker>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label isMust">交货日期</div>
                  <div class="from">
                    <el-date-picker v-model="item.delivery_time"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择交货日期">
                    </el-date-picker>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label">备注信息</div>
                  <div class="from">
                    <el-input v-model="item.desc"
                      placeholder="请输入备注"></el-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="btns">
              <div class="btn btnMain">新增加工单位</div>
              <div class="btn btnMain"
                style="margin-left:12px">复制上一组</div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="resetProcess">取消</div>
          <div class="opr blue"
            @click="saveProcess">确认加工</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Order } from '@/types/order'
import { OrderStoreInfo } from '@/types/store'
import { OrderYarn, YarnInfo, ProcessYarn } from '@/types/orderProcessYarn'
import { order, yarnOrder, store, yarnProcess } from '@/assets/js/api'
import { PartyB } from '@/types/common'
export default Vue.extend({
  data(): {
    order_info: Order
    update_order_info: OrderYarn
    store_info: OrderStoreInfo
    order_yarn_info: OrderYarn[]
    order_yarn_list: OrderYarn[]
    process_yarn_info: ProcessYarn[]
    [propName: string]: any
  } {
    return {
      checkAll: false,
      indeterminate: false,
      order_info: {
        order_code: '',
        order_time: '',
        delivery_time: '',
        client_id: '',
        total_price: '',
        total_weight: 0,
        desc: '',
        product_info: []
      },
      flags: {
        order_flag: false,
        store_flag: false,
        process_flag: false,
        order_update_flag: false
      },
      select_yarn_arr: [],
      order_yarn_info: [
        {
          order_id: this.$route.params.id,
          client_id: '',
          order_time: '',
          delivery_time: '',
          desc: '',
          child_data: []
        }
      ],
      order_yarn_list: [],
      update_order_info: {
        code: '',
        order_id: '',
        client_name: '',
        client_id: '',
        child_data: [],
        order_time: '',
        delivery_time: '',
        desc: ''
      },
      store_filter: {
        name: '',
        color: '',
        store_id: ''
      },
      store_list: [],
      store_step: 1,
      store_info: {
        order_id: '',
        store_total_id: '',
        total_weight: '',
        desc: '',
        product_name: '',
        color: '',
        attribute: '',
        color_code: '',
        vat_code: '',
        store_name: '',
        use_weight: '',
        reality_weight: '',
        child_data: []
      },
      store_yarn_list: [],
      process_yarn_info: [],
      process_yarn_list: [],
      process_select_yarn: []
    }
  },
  computed: {
    client_arr() {
      return this.$store.state.api.client.arr
    },
    supplier_arr_a() {
      return this.$store.state.api.supplier.arr.filter((item: PartyB) => item.client_type === '倒筒单位')
    },
    supplier_arr_b() {
      return this.$store.state.api.supplier.arr.filter((item: PartyB) => item.client_type === '染色单位')
    },
    supplier_arr_c() {
      return this.$store.state.api.supplier.arr.filter((item: PartyB) => item.client_type === '膨纱单位')
    },
    checkList(): any {
      const returnData: any = []
      this.order_info.product_info.forEach((item: any) => {
        console.log(item.check) // 这里打印一下item.check是因为computed计算属性不能监听item.check的变化，所以随便打印一下他就认为这个属性能触发更新
        if (item.child_data.filter((itemChild: any) => itemChild.check).length > 0) {
          returnData.push({
            product_name: item.product_name,
            product_id: item.product_id,
            child_data: item.child_data.filter((itemChild: any) => itemChild.check)
          })
        }
      })
      return returnData
    }
  },
  methods: {
    init() {
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
        console.log(res[3])
      })
    },
    checkAllPro(ev: boolean) {
      this.indeterminate = false
      this.order_info.product_info.forEach((item: any) => {
        item.check = ev
        item.indeterminate = false
        item.child_data.forEach((itemChild: any) => {
          itemChild.check = ev
        })
      })
      this.$forceUpdate()
    },
    checkAllSize(ev: boolean, self: any) {
      self.indeterminate = false
      self.child_data.forEach((itemChild: any) => {
        itemChild.check = ev
      })
      this.indeterminate =
        this.order_info.product_info.some((item: any) => item.check) &&
        this.order_info.product_info.filter((item: any) => item.check).length < this.order_info.product_info.length
      this.checkAll =
        this.order_info.product_info.filter((item: any) => item.check).length === this.order_info.product_info.length
      this.$forceUpdate()
    },
    checkSize(ev: boolean, father: any) {
      father.indeterminate =
        father.child_data.some((item: any) => item.check) &&
        father.child_data.filter((item: any) => item.check).length < father.child_data.length
      father.check = father.child_data.filter((item: any) => item.check).length === father.child_data.length
      this.indeterminate =
        this.order_info.product_info.some((item: any) => item.check) &&
        this.order_info.product_info.filter((item: any) => item.check).length < this.order_info.product_info.length
      this.checkAll =
        this.order_info.product_info.filter((item: any) => item.check).length === this.order_info.product_info.length
      this.$forceUpdate()
    },
    // 下拉框初始化
    getSelect() {
      this.select_yarn_arr = []
      if (this.checkList.length !== 0) {
        this.checkList.forEach((item: any) => {
          item.child_data.forEach((itemChild: any) => {
            itemChild.product_name = item.product_name
            this.select_yarn_arr.push(itemChild)
          })
        })
      } else {
        this.order_info.product_info.forEach((item: any) => {
          item.child_data.forEach((itemChild: any) => {
            itemChild.product_name = item.product_name
            this.select_yarn_arr.push(itemChild)
          })
        })
      }
    },
    // 获取订单下单数量
    getOrderNumber(id: number, father: YarnInfo) {
      const finded = this.select_yarn_arr.find((item: any) => item.id === id)
      father.order_number = finded.weight
      father.color = finded.color
      father.attribute = finded.attribute
      father.weight = finded.weight
    },
    openOrder(white: string) {
      this.getSelect()
      if (this.checkList.length !== 0) {
        const yarnInfo: YarnInfo[] = []
        this.checkList.forEach((item: any) => {
          item.child_data.forEach((itemChild: any) => {
            yarnInfo.push({
              order_number: itemChild.weight,
              order_info_id: itemChild.id,
              weight: itemChild.weight,
              color: white || itemChild.color,
              attribute: itemChild.attribute,
              price: ''
            })
          })
        })
        this.order_yarn_info = [
          {
            order_id: this.$route.params.id,
            client_id: '',
            order_time: this.$getDate(new Date()),
            delivery_time: '',
            desc: '',
            common_price: '',
            common_attr: '',
            child_data: yarnInfo
          }
        ]
      } else {
        this.order_yarn_info = [
          {
            order_id: this.$route.params.id,
            client_id: '',
            order_time: this.$getDate(new Date()),
            delivery_time: '',
            desc: '',
            common_price: '',
            common_attr: '',
            child_data: [
              {
                order_number: '',
                order_info_id: '',
                weight: '',
                color: white || '',
                attribute: '',
                price: ''
              }
            ]
          }
        ]
      }
      this.flags.order_flag = true
    },
    openStore() {
      console.log(this.checkList)
      if (this.checkList.length === 1) {
        this.store_filter.name = this.$clone(this.checkList[0].product_name)
        this.getStoreList()
        this.flags.store_flag = true
      } else {
        if (this.checkList.length === 0) {
          this.$message.error('请选择一种纱线进行调取')
        } else {
          this.$message.error('只能同时选择一种纱线进行库存调取操作')
        }
      }
    },
    getStoreList() {
      store
        .detailYarnList({
          store_id: this.store_filter.store_id,
          second_store_id: '',
          name: this.store_filter.name,
          color: this.store_filter.color,
          weight: 0
        })
        .then((res) => {
          this.store_list = this.$mergeData(res.data.data, {
            mainRule: ['name'],
            childrenName: 'child_data'
          })
        })
    },
    getStoreInfo(info: any, name: string) {
      this.store_info = this.$clone(info)
      this.store_info.product_name = name
      this.store_info.reality_weight = this.store_info.total_weight
      this.store_info.total_weight = 0
      this.store_info.child_data = this.checkList[0].child_data.map((item: YarnInfo) => {
        return {
          order_info_id: item.id,
          color: item.color,
          attribute: item.attribute,
          weight: '',
          order_weight: item.weight
        }
      })
      this.store_step = 2
    },
    resetStore() {
      this.store_step = 1
      this.flags.store_flag = false
    },
    // 计算总调取数量
    getTotalStore() {
      this.store_info.total_weight = this.store_info.child_data.reduce((total: number, current: any) => {
        return total + (Number(current.weight) || 0)
      }, 0)
    },
    saveStore() {
      console.log(this.store_info, this.checkList)
      const formData = {
        order_id: this.$route.params.id,
        store_total_id: this.store_info.id,
        total_weight: this.store_info.total_weight,
        desc: this.store_info.desc,
        child_data: this.store_info.child_data.map((item) => {
          return {
            order_info_id: item.order_info_id,
            weight: item.weight
          }
        })
      }
      console.log(formData)
      store.orderSave(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('调取成功')
          this.resetStore()
        }
      })
    },
    saveOrder() {
      yarnOrder.create({ data: this.order_yarn_info }).then((res) => {
        if (res.data.status) {
          this.$message.success('订购成功')
          this.resetOrder()
          this.flags.order_flag = false
        }
      })
    },
    deleteOrder(id: number) {
      this.$confirm('是否要删除该订购记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          yarnOrder
            .delete({
              id
            })
            .then((res) => {
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
    resetOrder() {
      this.order_yarn_info = [
        {
          order_id: this.$route.params.id,
          client_id: '',
          order_time: '',
          delivery_time: '',
          desc: '',
          child_data: []
        }
      ]
    },
    getUpdateInfo(info: OrderYarn) {
      this.update_order_info = info
      this.flags.order_update_flag = true
      this.order_info.product_info.forEach((item: any) => {
        item.child_data.forEach((itemChild: any) => {
          itemChild.product_name = item.product_name
          this.select_yarn_arr.push(itemChild)
        })
      })
    },
    updateOrder() {
      yarnOrder.update(this.update_order_info).then((res) => {
        if (res.data.status) {
          this.$message.success('修改成功')
          this.flags.order_update_flag = false
          this.init()
        }
      })
    },
    deleteStore(id: number) {
      this.$confirm('是否要删除该调取记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          store
            .orderDelete({
              id
            })
            .then((res) => {
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
    openProcess(process: string) {
      this.flags.process_flag = process
      if (this.checkList.length === 0) {
        this.process_yarn_info = [
          {
            order_id: this.$route.params.id,
            client_id: '',
            type: process,
            price: '',
            desc: '',
            order_time: this.$getDate(new Date()),
            delivery_time: '',
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
          }
        ]
        this.process_select_yarn = this.order_info.product_info.map((item) => {
          return {
            name: item.product_name
          }
        })
      } else {
        this.process_select_yarn = this.checkList.map((item: any) => {
          return {
            name: item.product_name,
            weight: item.child_data.reduce((total: number, current: { weight: number }) => {
              return total + Number(current.weight)
            }, 0)
          }
        })
        this.process_yarn_info = [
          {
            order_id: this.$route.params.id,
            client_id: '',
            type: process,
            price: '',
            desc: '',
            order_time: this.$getDate(new Date()),
            delivery_time: '',
            child_data: this.process_select_yarn.map((item: any) => {
              return {
                name: item.name,
                before_attribute: '',
                after_attribute: '',
                before_color: '白胚',
                after_color: '',
                color: '',
                attribute: '',
                weight: item.weight
              }
            })
          }
        ]
      }
    },
    resetProcess() {
      this.flags.process_flag = false
      this.process_yarn_info = []
    },
    saveProcess() {
      this.process_yarn_info.forEach((item) => {
        item.child_data.forEach((itemChild) => {
          itemChild.price = item.price
        })
      })
      console.log(this.process_yarn_info)
      yarnProcess
        .create({
          data: this.process_yarn_info
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.resetProcess()
          }
        })
    },
    deleteProcess(id: number) {
      this.$confirm('是否要删除该加工记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          yarnProcess
            .delete({
              id
            })
            .then((res) => {
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
    this.$checkCommonInfo([
      {
        checkWhich: 'api/client',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPartyBAsync'
      }
    ])
    this.init()
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/less/orderProcessYarn/detail.less';
</style>
<template>
  <div class="indexMain"
    id="yarnOrderDetail"
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
    <div class="module"
      v-if="store_yarn_list.length>0">
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
    <div class="module"
      v-if="order_yarn_list.length>0">
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
                        <div class="column min120">单价</div>
                      </div>
                    </div>
                    <div class="column min120">采购总价</div>
                    <div class="column min120">创建人</div>
                    <div class="column min120">额外费用</div>
                    <div class="column min120">扣款信息</div>
                    <div class="column min120">下单日期</div>
                    <div class="column min120">交货日期</div>
                    <div class="column min120">补充信息</div>
                    <div class="column min120">备注信息</div>
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
                        <div class="column min120">{{itemChild.weight}}</div>
                        <div class="column min120 blue">{{itemChild.reality_weight}}</div>
                        <div class="column min120">{{itemChild.price}}元</div>
                      </div>
                    </div>
                    <div class="column min120 green">{{item.total_price || 0}}元</div>
                    <div class="column min120">{{item.user_name}}</div>
                    <div class="column min120"
                      :style="{'cursor':item.additional_fee?'pointer':'auto'}"
                      :class="{'blue':item.additional_fee,'gray':!item.additional_fee}"
                      @click="lookExtraFee(item.additional_fee)">{{item.additional_fee?'查看费用':'无额外费用'}}</div>
                    <div class="column min120"
                      :style="{'cursor':item.is_deduct===1?'pointer':'auto'}"
                      :class="{'blue':item.is_deduct===1,'gray':item.is_deduct === 0}"
                      @click="lookDeduct(item.id,1)">{{item.is_deduct===1?'查看费用':'无扣款'}}</div>
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
                    <div class="column min120"
                      :class="{'blue':item.desc,'gray':!item.desc}">{{item.desc||'无'}}</div>
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
                    <span class="green opr"
                      @click="openDeduct(item.id,item.code,item.child_data,1)">扣款</span>
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
                    <span class="blue opr">打印</span>
                    <span class="green opr"
                      @click="openDeduct(item.id,item.code,item.child_data,2)">扣款</span>
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
          <span class="text">订购纱线</span>
          <i class="close_icon el-icon-close"
            @click="flags.order_flag = false"></i>
        </div>
        <div class="contentCtn">
          <div class="editCtn">
            <div class="editContainer"
              v-for="(item,index) in order_yarn_info"
              :key="index">
              <i class="el-icon-circle-close"
                @click="order_yarn_info.length>1?$deleteItem(order_yarn_info,index):$message.error('至少有一个采购单')"></i>
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
                  <div class="label">快捷填写属性</div>
                  <div class="from">
                    <el-select @change="commonInput($event,item,'attribute')"
                      placeholder="选择统一订购属性"
                      v-model="item.common_attr">
                      <el-option label="筒纱"
                        value="筒纱"></el-option>
                      <el-option label="绞纱"
                        value="绞纱"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label">快捷填写单价</div>
                  <div class="from">
                    <el-input @change="commonInput($event,item,'price')"
                      v-model="item.common_price"
                      placeholder="填写后会统一订购单价">
                      <template slot="append">元/kg</template>
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
                        <template slot="append">元/kg</template>
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
              <div class="eRow"
                v-for="(itemFee,indexFee) in item.additional_fee"
                :key="'fee' + indexFee">
                <div class="eColumn">
                  <div class="label"
                    v-if="indexFee===0">
                    <span class="text">额外费用名称</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input v-model="itemFee.name"
                        placeholder="请选择额外费用名称">
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label"
                    v-if="indexFee===0">
                    <span class="text">额外费用金额</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input v-model="itemFee.price"
                        placeholder="请输入额外费用金额">
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label"
                    v-if="indexFee===0">
                    <span class="text">额外费用备注</span>
                  </div>
                  <div class="elCtn">
                    <el-input v-model="itemFee.desc"
                      placeholder="请输入额外费用备注"></el-input>
                  </div>
                  <div class="opr blue"
                    v-if="indexFee===0"
                    @click="$addItem(item.additional_fee,{
                        name: '',
                        price: '',
                        desc:''
                      })">添加</div>
                  <div v-if="indexFee>0"
                    style="margin-top:0"
                    class="opr red"
                    @click="$deleteItem(item.additional_fee,indexFee)">删除</div>
                </div>
              </div>
              <div class="eRow">
                <div class="eColumn">
                  <div class="label">
                    <span class="text">图片补充说明</span>
                  </div>
                  <div class="elCtn">
                    <el-upload class="upload"
                      action="https://upload.qiniup.com/"
                      accept="image/jpeg,image/gif,image/png,image/bmp"
                      :before-upload="beforeAvatarUpload"
                      :multiple="false"
                      :data="postData"
                      :limit="1"
                      :on-success="(response,file,fileList)=>successFile(item,response, file,fileList)"
                      ref="uploada"
                      list-type="picture">
                      <div class="uploadBtn">
                        <i class="el-icon-upload"></i>
                        <span>上传文件</span>
                      </div>
                      <div slot="tip"
                        class="el-upload__tip">只能上传一张jpg/png图片文件，且不超过10M</div>
                    </el-upload>
                  </div>
                </div>
              </div>
            </div>
            <div class="btns">
              <div class="btn btnMain"
                @click="$addItem(order_yarn_info,{
                  order_id: $route.params.id,
                  client_id: '',
                  order_time: '',
                  delivery_time: '',
                  desc: '',
                  additional_fee:[{
                    name: '',
                    price: '',
                    desc:''
                  }],
                  child_data: [{
                    order_number: '',
                    order_info_id: '',
                    weight: '',
                    color: '',
                    attribute: '',
                    price: ''
                  }]
              })">新增采购单</div>
              <div class="btn btnMain"
                style="margin-left:12px"
                @click="$addItem(order_yarn_info,$clone(order_yarn_info[order_yarn_info.length-1]))">复制上一组</div>
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
              <div class="eRow"
                v-for="(itemFee,indexFee) in update_order_info.additional_fee"
                :key="'fee' + indexFee">
                <div class="eColumn">
                  <div class="label"
                    v-if="indexFee===0">
                    <span class="text">额外费用名称</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input v-model="itemFee.name"
                        placeholder="请选择额外费用名称">
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label"
                    v-if="indexFee===0">
                    <span class="text">额外费用金额</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input v-model="itemFee.price"
                        placeholder="请输入额外费用金额"></el-input>
                    </div>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label"
                    v-if="indexFee===0">
                    <span class="text">额外费用备注</span>
                  </div>
                  <div class="elCtn">
                    <el-input v-model="itemFee.desc"
                      placeholder="请输入额外费用备注"></el-input>
                  </div>
                  <div class="opr blue"
                    v-if="indexFee===0"
                    @click="$addItem(update_order_info.additional_fee,{
                        name: '',
                        price: '',
                        desc:''
                      })">添加</div>
                  <div v-if="indexFee>0"
                    class="opr red"
                    style="margin-top:0"
                    @click="$deleteItem(update_order_info.additional_fee,indexFee)">删除</div>
                </div>
              </div>
              <div class="eRow">
                <div class="eColumn">
                  <div class="label">
                    <span class="text">图片补充说明</span>
                  </div>
                  <div class="elCtn">
                    <el-upload class="upload"
                      action="https://upload.qiniup.com/"
                      accept="image/jpeg,image/gif,image/png,image/bmp"
                      :before-upload="beforeAvatarUpload"
                      :multiple="false"
                      :data="postData"
                      :limit="1"
                      :file-list="update_order_info.file_url?[{name:'说明文件',url:update_order_info.file_url}]:[]"
                      :on-success="(response,file,fileList)=>successFile(update_order_info,response, file,fileList)"
                      ref="uploada"
                      list-type="picture">
                      <div class="uploadBtn">
                        <i class="el-icon-upload"></i>
                        <span>上传文件</span>
                      </div>
                      <div slot="tip"
                        class="el-upload__tip">只能上传一张jpg/png图片文件，且不超过10M</div>
                    </el-upload>
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
                    placeholder="搜索纱线名称"
                    @change="getStoreList"></el-input>
                </div>
                <div class="elCtn">
                  <el-input v-model="store_filter.color"
                    @change="getStoreList"
                    placeholder="搜索颜色"></el-input>
                </div>
                <div class="elCtn">
                  <el-select v-model="store_filter.store_id"
                    @change="getStoreList"
                    placeholder="筛选仓库">
                    <el-option v-for="item in store_house"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="rightCtn"
                style="min-width:100px">
                <div class="btn btnGray fr"
                  @click="resetStoreFilter">重置</div>
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
                      <div class="tcolumn">批号</div>
                      <div class="tcolumn">色号</div>
                      <div class="tcolumn">缸号</div>
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
                      <div class="tcolumn">{{itemChild.batch_code}}</div>
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
                    <div class="column">批号</div>
                    <div class="column">色号</div>
                    <div class="column">缸号</div>
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
                    <div class="column">{{store_info.batch_code}}</div>
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
                      <div class="tcolumn">操作</div>
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
                          @input="getTotalStore">
                          <template slot="append">kg</template>
                        </el-input>
                      </div>
                      <div class="tcolumn">
                        <div class="opr red"
                          @click="deleteItem(index)">删除</div>
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
              <i class="el-icon-circle-close"
                @click="process_yarn_info.length>1?$deleteItem(process_yarn_info,index):$message.error('至少有一个加工单')"></i>
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
                      style="margin-right:12px"
                      @change="getAnother($event,itemChild,'before')">
                      <el-option label="筒纱"
                        value="筒纱"></el-option>
                      <el-option label="绞纱"
                        value="绞纱"></el-option>
                    </el-select>
                    <el-select v-model="itemChild.after_attribute"
                      placeholder="加工后属性"
                      @change="getAnother($event,itemChild,'after')">
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
              <div class="eRow"
                v-for="(itemFee,indexFee) in item.additional_fee"
                :key="'fee' + indexFee">
                <div class="eColumn">
                  <div class="label"
                    v-if="indexFee===0">
                    <span class="text">额外费用名称</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input v-model="itemFee.name"
                        placeholder="请选择额外费用名称">
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label"
                    v-if="indexFee===0">
                    <span class="text">额外费用金额</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input v-model="itemFee.price"
                        placeholder="请输入额外费用金额">
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="eColumn">
                  <div class="label"
                    v-if="indexFee===0">
                    <span class="text">额外费用备注</span>
                  </div>
                  <div class="elCtn">
                    <el-input v-model="itemFee.desc"
                      placeholder="请输入额外费用备注"></el-input>
                  </div>
                  <div class="opr blue"
                    v-if="indexFee===0"
                    @click="$addItem(item.additional_fee,{
                        name: '',
                        price: '',
                        desc:''
                      })">添加</div>
                  <div v-if="indexFee>0"
                    style="margin-top:0"
                    class="opr red"
                    @click="$deleteItem(item.additional_fee,indexFee)">删除</div>
                </div>
              </div>
              <div class="eRow">
                <div class="eColumn">
                  <div class="label">
                    <span class="text">图片补充说明</span>
                  </div>
                  <div class="elCtn">
                    <el-upload class="upload"
                      action="https://upload.qiniup.com/"
                      accept="image/jpeg,image/gif,image/png,image/bmp"
                      :before-upload="beforeAvatarUpload"
                      :multiple="false"
                      :data="postData"
                      :limit="1"
                      :on-success="(response,file,fileList)=>successFile(item,response, file,fileList)"
                      ref="uploada"
                      list-type="picture">
                      <div class="uploadBtn">
                        <i class="el-icon-upload"></i>
                        <span>上传文件</span>
                      </div>
                      <div slot="tip"
                        class="el-upload__tip">只能上传一张jpg/png图片文件，且不超过10M</div>
                    </el-upload>
                  </div>
                </div>
              </div>
            </div>
            <div class="btns">
              <div class="btn btnMain"
                @click="$addItem(process_yarn_info,{
                  order_id: $route.params.id,
                  client_id: '',
                  type: process_yarn_info[0].type,
                  price: '',
                  desc: '',
                  order_time: $getDate(new Date()),
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
              })">新增加工单</div>
              <div class="btn btnMain"
                style="margin-left:12px"
                @click="$addItem(process_yarn_info,$clone(process_yarn_info[process_yarn_info.length-1]))">复制上一组</div>
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
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="$router.push('/inAndOut/detail/' + $route.params.id)">出入库</div>
        </div>
      </div>
    </div>
    <!-- 扣款操作 -->
    <deduct :show.sync="deduct_show"
      :data="deduct_info"></deduct>
    <!-- 查看扣款详情 -->
    <deduct-detail :show.sync="deduct_detail_show"
      :pid="deduct_id"
      :deductType="deduct_type"></deduct-detail>
    <!-- 额外费用详情 -->
    <extra-fee :show.sync="extra_fee_show"
      :feeArr="feeArr"></extra-fee>
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
      loading: true,
      checkAll: false,
      indeterminate: false,
      extra_fee_show: false,
      order_info: {
        additional_fee: '',
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
      process_select_yarn: [],
      deduct_show: false,
      deduct_info: {
        yarn: [],
        pid: 1,
        pcode: '',
        type: 1
      },
      feeArr: [],
      deduct_detail: {
        code: '',
        deduct_type: 1,
        pid: '',
        total_price: '',
        deduct_content: '',
        deduct_file: '',
        desc: ''
      },
      deduct_id: '',
      deduct_type: 1,
      deduct_detail_show: false,
      postData: { key: '', token: '' }
    }
  },
  computed: {
    client_arr() {
      return this.$store.state.api.factory.arr.filter((item: PartyB) => (item.status as number) === 1)
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
    store_house() {
      return this.$store.state.api.storeHouse.arr
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
    },
    token() {
      return this.$store.state.status.token
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
        this.loading = false
      })
    },
    // 快捷填写信息
    commonInput(ev: string, obj: any, key: string) {
      obj.child_data.forEach((item: any) => {
        item[key] = ev
      })
    },
    // 倒筒快捷切换
    getAnother(ev: string, item: any, type: string) {
      if (type === 'before') {
        item.after_attribute = ev === '筒纱' ? '绞纱' : '筒纱'
      }
      if (type === 'after') {
        item.before_attribute = ev === '筒纱' ? '绞纱' : '筒纱'
      }
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
            additional_fee: [
              {
                name: '',
                price: '',
                desc: ''
              }
            ],
            file_url: '',
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
            file_url: '',
            additional_fee: [
              {
                name: '',
                price: '',
                desc: ''
              }
            ],
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
    resetStoreFilter() {
      this.store_filter = {
        name: '',
        color: '',
        store_id: ''
      }
      this.getStoreList()
    },
    // 计算总调取数量
    getTotalStore() {
      this.store_info.total_weight = this.store_info.child_data.reduce((total: number, current: any) => {
        return total + (Number(current.weight) || 0)
      }, 0)
    },
    saveStore() {
      if (
        this.store_info.child_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'weight',
              regNormal: 'isNum',
              errMsg: '请输入库存调取数量'
            }
          ])
        })
      ) {
        return
      }
      this.loading = true
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
      store.orderSave(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('调取成功')
          this.resetStore()
          this.loading = false
          this.init()
        }
      })
    },
    saveOrder() {
      if (
        this.order_yarn_info.some((item) => {
          if (
            this.$formCheck(item, [
              {
                key: 'client_id',
                errMsg: '请选择供货商'
              },
              {
                key: 'delivery_time',
                errMsg: '请选择交货日期'
              }
            ])
          ) {
            return true
          }
          return item.child_data.some((itemChild) => {
            return this.$formCheck(itemChild, [
              {
                key: 'order_info_id',
                errMsg: '请选择下单纱线'
              },
              {
                key: 'weight',
                errMsg: '请输入订购数量'
              },
              {
                key: 'price',
                errMsg: '请输入订购单价'
              },
              {
                key: 'color',
                errMsg: '请输入订购颜色'
              },
              {
                key: 'attribute',
                errMsg: '请选择订购属性'
              }
            ])
          })
        })
      ) {
        return
      }
      this.order_yarn_info.forEach((item) => {
        item.total_price =
          item.child_data.reduce((total, current: any) => {
            return total + current.weight * current.price
          }, 0) +
          (item.additional_fee as any[]).reduce((total, current) => {
            return total + Number(current.price)
          }, 0)
        // 额外费用未填写的情况下提交空字符串
        item.additional_fee =
          (item.additional_fee as any[]).filter((itemChild) => itemChild.name && itemChild.price).length > 0
            ? JSON.stringify(item.additional_fee)
            : ''
      })
      this.loading = true
      yarnOrder.create({ data: this.order_yarn_info, order_id: this.$route.params.id }).then((res) => {
        if (res.data.status) {
          this.$message.success('订购成功')
          this.resetOrder()
          this.flags.order_flag = false
          this.init()
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
      const selfInfo = JSON.parse(JSON.stringify(info))
      this.update_order_info = selfInfo
      this.update_order_info.additional_fee = selfInfo.additional_fee
        ? JSON.parse(selfInfo.additional_fee as string)
        : [
            {
              name: '',
              price: '',
              desc: ''
            }
          ]
      this.flags.order_update_flag = true
      this.order_info.product_info.forEach((item: any) => {
        item.child_data.forEach((itemChild: any) => {
          itemChild.product_name = item.product_name
          this.select_yarn_arr.push(itemChild)
        })
      })
    },
    updateOrder() {
      this.$formCheck(this.update_order_info, [
        {
          key: 'client_id',
          errMsg: '请选择供货商'
        },
        {
          key: 'delivery_time',
          errMsg: '请选择交货日期'
        }
      ])
      if (
        this.update_order_info.child_data.some((itemChild) => {
          return this.$formCheck(itemChild, [
            {
              key: 'order_info_id',
              errMsg: '请选择下单纱线'
            },
            {
              key: 'weight',
              errMsg: '请输入订购数量'
            },
            {
              key: 'price',
              errMsg: '请输入订购单价'
            },
            {
              key: 'color',
              errMsg: '请输入订购颜色'
            },
            {
              key: 'attribute',
              errMsg: '请选择订购属性'
            },
            {
              key: 'reality_weight',
              errMsg: '请输入实际订购数量'
            }
          ])
        })
      ) {
        return
      }

      this.update_order_info.total_price =
        this.update_order_info.child_data.reduce((total, current: any) => {
          return total + current.weight * current.price
        }, 0) +
        (this.update_order_info.additional_fee as any[]).reduce((total, current) => {
          return total + Number(current.price)
        }, 0)
      // 额外费用未填写的情况下提交空字符串
      this.update_order_info.additional_fee =
        (this.update_order_info.additional_fee as any[]).filter((itemChild) => itemChild.name && itemChild.price)
          .length > 0
          ? JSON.stringify(this.update_order_info.additional_fee)
          : ''
      this.loading = true
      yarnOrder.update(this.update_order_info).then((res) => {
        if (res.data.status) {
          this.$message.success('修改成功')
          this.flags.order_update_flag = false
          this.loading = false
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
            additional_fee: [
              {
                name: '',
                price: '',
                desc: ''
              }
            ],
            file_url: '',
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
        let childData: any[] = []
        if (process === '倒筒') {
          childData = this.process_select_yarn.map((item: any) => {
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
        } else {
          this.checkList.forEach((item: any) => {
            item.child_data.forEach((itemChild: any) => {
              childData.push({
                name: item.product_name,
                before_attribute: '',
                after_attribute: '',
                before_color: '白胚',
                after_color: process === '染色' ? itemChild.color : '',
                color: process === '膨纱' ? itemChild.color : '',
                attribute: process === '膨纱' ? itemChild.attribute : '',
                weight: itemChild.weight
              })
            })
          })
        }
        this.process_yarn_info = [
          {
            order_id: this.$route.params.id,
            client_id: '',
            type: process,
            price: '',
            desc: '',
            order_time: this.$getDate(new Date()),
            delivery_time: '',
            additional_fee: [
              {
                name: '',
                price: '',
                desc: ''
              }
            ],
            file_url: '',
            child_data: childData
          }
        ]
      }
    },
    resetProcess() {
      this.flags.process_flag = false
      this.process_yarn_info = []
    },
    saveProcess() {
      if (
        this.process_yarn_info.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'client_id',
              errMsg: '请选择加工单位'
            },
            {
              key: 'price',
              errMsg: '请输入加工单价'
            },
            {
              key: 'delivery_time',
              errMsg: '请选择交货日期'
            }
          ])
        })
      ) {
        return
      }
      this.loading = true
      this.process_yarn_info.forEach((item) => {
        item.child_data.forEach((itemChild) => {
          itemChild.price = item.price
        })
        item.total_price =
          item.child_data.reduce((total, current: any) => {
            return total + current.weight * current.price
          }, 0) +
          (item.additional_fee as any[]).reduce((total, current) => {
            return total + Number(current.price)
          }, 0)
        item.additional_fee =
          (item.additional_fee as any[]).filter((itemChild) => itemChild.name && itemChild.price).length > 0
            ? JSON.stringify(item.additional_fee)
            : ''
      })
      yarnProcess
        .create({
          order_id: this.$route.params.id,
          data: this.process_yarn_info
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.resetProcess()
            this.loading = false
            this.init()
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
          this.loading = true
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
    },
    // 删除调取纱线
    deleteItem(index: string) {
      if (this.store_info.child_data.length > 1) {
        this.$deleteItem(this.store_info.child_data, index)
        this.$forceUpdate()
      } else {
        this.$message.error('至少调用一个纱线')
      }
    },
    // 打开扣款窗口
    openDeduct(pid: number, pcode: string, yarnArr: any[], type: number) {
      this.deduct_info = {
        yarn: yarnArr.map((item) => {
          return {
            value: item.order_info_id,
            label: type === 1 ? item.name + '/' + item.color + '/' + item.attribute : item.name
          }
        }),
        pid,
        pcode,
        type
      }
      this.deduct_show = true
    },
    lookDeduct(id: number, type: number) {
      this.deduct_id = id
      this.deduct_type = type
      this.deduct_detail_show = true
    },
    // 查看额外费用
    lookExtraFee(info: string) {
      if (!info) {
        return
      }
      this.extra_fee_show = true
      this.feeArr = JSON.parse(info)
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
    successFile(item: any, response: any) {
      item.file_url = 'https://file.zwyknit.com/' + response.key
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/factory',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPartyBAsync'
      },
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
@import '~@/assets/less/orderProcessYarn/detail.less';
</style>
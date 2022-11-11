<template>
  <div class="popup inAndOut"
    v-show="show">
    <div class="main"
      v-loading="loading">
      <div class="titleCtn">
        <div class="text">{{inOrOut || '填写'}}信息</div>
        <i class="el-icon-close"
          @click="reset"></i>
      </div>
      <div class="contentCtn">
        <div class="createCtn">
          <div class="desc"
            v-if="selfType[0]==='无单据'&&selfType[1]===11">注意！销售出库会自动生成相关订单信息，以便更好地进行财务统计，如果不需要结算本次出库信息，请选择普通出库。</div>
          <div class="desc"
            v-if="selfType[0]==='无单据'&&selfType[1]===12">注意！订购入库会自动生成相关采购单信息，以便更好地进行财务统计，如果不需要结算本次入库信息，请选择普通入库。</div>
          <div class="desc"
            v-if="selfType[0]==='无单据'&&selfType[1]===13">注意！加工回库会自动生成相关加工单信息，以便更好地进行财务统计，如果不需要结算本次入库信息，请选择普通入库。</div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">操作类型</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="content">
                <div class="elCtn">
                  <el-cascader :disabled="noChange"
                    v-model="selfType"
                    :props="{ expandTrigger: 'hover' }"
                    :options="typeArr"
                    @change="clearData"
                    placeholder="请选择操作类型"></el-cascader>
                </div>
              </div>
            </div>
            <div class="colCtn flex3"
              v-if="selfType.length&&selfType[0]!=='无单据'">
              <div class="label">
                <span class="text">单号信息</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="content">
                <div class="elCtn">
                  <el-input disabled
                    v-show="noChange && noChangeDanJu"
                    v-model="relatedCode"
                    placeholder="单号信息"></el-input>
                  <el-select v-show="!noChange || !noChangeDanJu"
                    v-model="storeInfo.related_id"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入单号搜索"
                    :remote-method="searchRlatedId"
                    :loading="relatedLoading"
                    @change="initDetail">
                    <el-option v-for="item in relatedArr"
                      :key="item.id"
                      :label="item.code"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <template v-if="!bindFlag&&selfType&&(selfType[0]==='无单据'||(selfType[0]!=='无单据'&&storeInfo.related_id))">
            <div class="rowCtn">
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">仓库名称</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="content">
                  <div class="elCtn">
                    <el-cascader :disabled="!!storeId"
                      v-model="storeInfo.select_id"
                      :options="selfStoreArr"
                      :props="{value:'id',label:'name',children:'second_data'}"
                      placeholder="请选择仓库">
                    </el-cascader>
                  </div>
                </div>
              </div>
              <template v-if="selfType[0]==='无单据'&&selfType[1]!==10&&selfType[1]!==13">
                <div class="colCtn flex3">
                  <div class="label">
                    <span class="text">单位名称</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-cascader :disabled="!!clientId"
                        filterable
                        v-model="storeInfo.client_id"
                        :options="selfClientArr"
                        :props="{ expandTrigger: 'hover',value:'id',label:'name'}"
                        no-data-text="暂无加工信息">
                      </el-cascader>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else-if="selfType[1]===10">
                <div class="colCtn flex3">
                  <div class="label">
                    <span class="text">移库仓库</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-cascader v-model="storeInfo.move_select_id"
                        :options="allStoreArr"
                        :props="{value:'id',label:'name',children:'second_data'}"
                        placeholder="请选择需要移库的仓库">
                      </el-cascader>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="colCtn flex3">
                  <div class="label">
                    <span class="text">单位名称</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-select :disabled="!!clientId"
                        filterable
                        v-model="storeInfo.client_id"
                        no-data-text="暂无加工信息">
                        <el-option v-for="item in selfClientArr"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
              </template>
              <!-- 销售出库补全客户单号 -->
              <template v-if="selfType[0]==='无单据'&&selfType[1]===11">
                <div class="colCtn flex3">
                  <div class="label">
                    <span class="text">客户单号</span>
                    <span class="explanation">(选填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input placeholder="请输入客户单号"
                        v-model="storeInfo.order_code"></el-input>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="selfType[0]==='无单据'&&selfType[1]===13">
                <div class="colCtn flex3">
                  <div class="label">
                    <span class="text">加工类型</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-select placeholder="请选择加工类型"
                        v-model="storeInfo.type">
                        <el-option label="倒筒"
                          value="倒筒"></el-option>
                        <el-option label="膨纱"
                          value="膨纱"></el-option>
                        <el-option label="染色"
                          value="染色"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <!-- 销售出库补全订单信息 -->
            <template v-if="selfType[0]==='无单据'&& (selfType[1]===11||selfType[1]===12)">
              <div class="rowCtn"
                v-for="(item,index) in storeInfo.additional_fee"
                :key="index">
                <div class="colCtn flex3">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">额外费用名称</span>
                    <span class="explanation">(选填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input v-model="item.name"
                        placeholder="请输入额外费用名称">
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn flex3">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">额外费用金额</span>
                    <span class="explanation">(选填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input v-model="item.price"
                        placeholder="请输入额外费用金额">
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn flex3">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">额外费用备注</span>
                    <span class="explanation">(选填)</span>
                  </div>
                  <div class="elCtn">
                    <el-input v-model="item.desc"
                      placeholder="请输入额外费用备注"></el-input>
                  </div>
                  <div v-if="index===0"
                    class="editBtn blue"
                    @click="$addItem(storeInfo.additional_fee,{
                      name: '',
                      price: '',
                      desc:''
                    })">添加</div>
                  <div v-if="index>0"
                    class="editBtn red"
                    @click="$deleteItem(storeInfo.additional_fee,index)">删除</div>
                </div>
              </div>
            </template>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:1.5">纱线名称</div>
                  <div class="tcolumn"
                    v-if="storeInfo.type!=='染色'">纱线颜色</div>
                  <div class="tcolumn"
                    v-if="storeInfo.type!=='倒筒'">纱线属性</div>
                  <div class="tcolumn"
                    style="flex:1.5"
                    v-if="selfType&&selfType[0]==='无单据'&&(selfType[1]===13)&&storeInfo.type!=='膨纱'">加工前/加工后</div>
                  <div class="tcolumn"
                    v-if="selfType&&selfType[0]==='无单据'&&(selfType[1]===11)">数量属性</div>
                  <div class="tcolumn"
                    style="flex:2">批号/色号/缸号</div>
                  <div class="tcolumn">数量(kg)</div>
                  <div class="tcolumn"
                    v-if="selfType&&selfType[0]==='无单据'&&(selfType[1]===11||selfType[1]===12||selfType[1]===13)">单价(元)</div>
                  <div class="tcolumn">件数(件)</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in storeInfo.child_data"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:1.5">
                    <template v-if="selfType[0]==='采购单' ||selfType[0]==='调取单' || selfType[0]==='工艺单' || selfType[0]==='订单'">
                      <el-select class="el"
                        placeholder="纱线名称"
                        v-model="item.name"
                        @change="getColor($event,item)">
                        <el-option v-for="item in selfYarnArr"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>
                    </template>
                    <template v-else>
                      <el-cascader class="el"
                        v-model="item.name"
                        filterable
                        placeholder="纱线名称"
                        :show-all-levels="false"
                        :options="selfYarnArr"></el-cascader>
                    </template>
                  </div>
                  <div class="tcolumn"
                    v-if="storeInfo.type!=='染色'">
                    <template v-if="selfType[0]==='采购单' ||selfType[0]==='调取单' || selfType[0]==='工艺单' || selfType[0]==='订单'">
                      <el-select class="el"
                        no-data-text="请先选择纱线"
                        placeholder="颜色"
                        v-model="item.color">
                        <el-option v-for="itemChild in item.colorArr"
                          :key="itemChild.value"
                          :label="itemChild.label"
                          :value="itemChild.value"></el-option>
                      </el-select>
                    </template>
                    <template v-else>
                      <el-input class="el"
                        placeholder="颜色"
                        v-model="item.color"></el-input>
                    </template>
                  </div>
                  <div class="tcolumn"
                    v-if="storeInfo.type!=='倒筒'">
                    <el-select class="el"
                      v-model="item.attribute"
                      placeholder="属性">
                      <el-option label="胚绞"
                        value="胚绞"></el-option>
                      <el-option label="胚筒"
                        value="胚筒"></el-option>
                      <el-option label="色绞"
                        value="色绞"></el-option>
                      <el-option label="色筒"
                        value="色筒"></el-option>
                    </el-select>
                  </div>
                  <div class="tcolumn"
                    style="flex:1.5;flex-direction: row;align-items: center;"
                    v-if="selfType&&selfType[0]==='无单据'&&(selfType[1]===13)&&storeInfo.type!=='膨纱'">
                    <div class="el"
                      style="width:100%"
                      v-if="!storeInfo.type">
                      <el-input placeholder="请选择加工类型"
                        v-model="item.color"
                        disabled></el-input>
                    </div>
                    <div class="el"
                      v-if="storeInfo.type==='倒筒'"
                      style="margin-right:4px">
                      <el-select v-model="item.before_attribute"
                        placeholder="加工前">
                        <el-option label="胚绞"
                          value="胚绞"></el-option>
                        <el-option label="胚筒"
                          value="胚筒"></el-option>
                        <el-option label="色绞"
                          value="色绞"></el-option>
                        <el-option label="色筒"
                          value="色筒"></el-option>
                      </el-select>
                    </div>
                    <div class="el"
                      v-if="storeInfo.type==='倒筒'">
                      <el-select v-model="item.after_attribute"
                        placeholder="加工后">
                        <el-option label="胚绞"
                          value="胚绞"></el-option>
                        <el-option label="胚筒"
                          value="胚筒"></el-option>
                        <el-option label="色绞"
                          value="色绞"></el-option>
                        <el-option label="色筒"
                          value="色筒"></el-option>
                      </el-select>
                    </div>
                    <div class="el"
                      style="margin-right:4px"
                      v-if="storeInfo.type==='染色'">
                      <el-input v-model="item.before_color"
                        :placeholder="item.color"
                        disabled>
                      </el-input>
                    </div>
                    <div class="el"
                      v-if="storeInfo.type==='染色'">
                      <el-input v-model="item.after_color"
                        placeholder="加工后颜色">
                      </el-input>
                    </div>
                  </div>
                  <div class="tcolumn"
                    v-if="selfType&&selfType[0]==='无单据'&&(selfType[1]===11)">
                    <el-select class="el"
                      v-model="item.number_attribute"
                      placeholder="数量属性"
                      filterable>
                      <el-option label="足斤纱"
                        value="足斤纱"></el-option>
                      <el-option label="98纱"
                        value="98纱"></el-option>
                      <el-option label="97纱"
                        value="97纱"></el-option>
                      <el-option label="96纱"
                        value="96纱"></el-option>
                      <el-option label="95纱"
                        value="95纱"></el-option>
                    </el-select>
                  </div>
                  <div class="tcolumn"
                    style="flex:2;flex-direction: row;align-items: center;">
                    <el-input class="el"
                      v-model="item.batch_code"
                      placeholder="批号"
                      style="margin-right:4px"></el-input>
                    <el-input class="el"
                      v-model="item.color_code"
                      placeholder="色号"
                      style="margin-right:4px"></el-input>
                    <el-input class="el"
                      v-model="item.vat_code"
                      placeholder="缸号"
                      style="margin-right:4px"></el-input>
                  </div>
                  <div class="tcolumn">
                    <el-input class="el"
                      v-model="item.action_weight"
                      placeholder="数量"></el-input>
                  </div>
                  <div class="tcolumn"
                    v-if="selfType&&selfType[0]==='无单据'&&(selfType[1]===11||selfType[1]===12||selfType[1]===13)">
                    <el-input class="el"
                      v-model="item.price"
                      placeholder="单价"></el-input>
                  </div>
                  <div class="tcolumn"
                    style="flex-direction:row;align-items: center;">
                    <el-input class="el"
                      v-model="item.items"
                      placeholder="件数"></el-input>
                    <div class="opr red"
                      style="margin-left:8px"
                      @click="storeInfo.child_data.length>1?$deleteItem(storeInfo.child_data,index):$message.warning('至少有一项')">
                      <i class="el-icon-circle-close"
                        style="font-size:18px"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn flex3">
                <div class="btn btnMain"
                  @click="$addItem(storeInfo.child_data,{
                  name: '',
                  action_weight: '',
                  color: '',
                  attribute: '',
                  colorAttr: '',
                  batch_code: '',
                  color_code: '',
                  vat_code: '',
                  item: '',
                  number_attribute:'98纱',
                  price:'',
                  before_attribute: '',
                  after_attribute: '',
                  before_color: '白胚',
                  after_color: ''
                })">添加纱线</div>
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
                    <el-date-picker class="el"
                      style="width:100%"
                      v-model="storeInfo.complete_time"
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
                      v-model="storeInfo.desc"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="tips"
              v-if="!bindFlag">请绑定需要关联的单号信息！</div>
          </template>
        </div>
      </div>
      <div class="oprCtn">
        <div class="opr"
          @click="reset">取消</div>
        <div class="opr blue"
          @click="saveAll"
          v-if="!bindFlag">确定</div>
        <div class="opr orange"
          @click="bindCode"
          v-if="bindFlag">确认绑定</div>
      </div>
    </div>
  </div>
</template>
    
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { StoreCreate } from '@/types/store'
import { Order } from '@/types/order'
import { OrderYarn, ProcessYarn } from '@/types/orderProcessYarn'
import { stock, allList, yarnOrder, yarnProcess, store, craft, order } from '@/assets/js/api'
@Component
export default class InAndOut extends Vue {
  @Prop() show!: boolean
  @Prop() type?: number
  @Prop() initData?: Array<{
    second_store_id: number
    name: string
    color: string
    attribute: string
    store_info: Array<{
      color_code: string
      vat_code: string
      batch_code: string
      weight: number
    }>
  }>
  @Prop() orderId?: string
  @Prop() relatedId?: number | string
  @Prop() clientId?: number | string
  @Prop() firstStoreId?: string | number // 普通出入库的时候一级仓库id
  @Prop() storeId?: any[] // 一级二级仓库
  @Prop() relatedCode?: string
  @Prop() yarnName?: string
  @Prop() yarnColor?: string
  @Prop() yarnAttr?: string
  @Prop({ default: true }) noChange?: boolean // 用于标记是否可修改操作类型，一般订单里得操作都是固定的操作类型不可修改，仓库里的是可修改的
  @Prop() yarnArr?: any[]
  @Prop() outClientArr?: any[] // 订单自带的加工单位
  @Prop() bindFlag?: boolean
  @Prop() updateId?: string | number
  loading = false
  relatedLoading = false
  relatedArr = []
  storeInfo: StoreCreate = {
    type: '', // 工序，添加加工单的时候用
    order_code: '',
    related_id: '',
    client_id: [],
    select_id: [],
    store_id: '',
    second_store_id: '',
    move_select_id: [],
    move_store_id: '',
    move_second_store_id: '',
    action_type: '',
    order_id: '',
    child_data: [
      {
        name: '',
        action_weight: '',
        color: '',
        attribute: '',
        batch_code: '',
        color_code: '',
        vat_code: '',
        item: '',
        price: '',
        number_attribute: '98纱',
        before_attribute: '',
        after_attribute: '',
        before_color: '白胚',
        after_color: ''
      }
    ],
    additional_fee: [
      {
        name: '',
        price: '',
        desc: ''
      }
    ],
    desc: '',
    complete_time: this.$getDate(new Date())
  }
  initClientArr: any[] = []
  initYarnArr: any[] = []
  selfType: Array<number | string> = []
  typeArr: any[] = [
    {
      label: '无单据',
      value: '无单据',
      children: [
        {
          label: '普通入库',
          value: 1
        },
        {
          label: '普通出库',
          value: 2
        },
        {
          label: '移库',
          value: 10
        },
        {
          label: '销售出库',
          value: 11
        },
        {
          label: '订购入库',
          value: 12
        },
        {
          label: '加工回库',
          value: 13
        }
      ]
    },
    {
      label: '采购单',
      value: '采购单',
      children: [
        {
          label: '入库',
          value: 3
        }
      ]
    },
    {
      label: '调取单',
      value: '调取单',
      children: [
        {
          label: '出库',
          value: 4
        }
      ]
    },
    {
      label: '加工单',
      value: '加工单',
      children: [
        {
          label: '回库',
          value: 5
        },
        {
          label: '出库',
          value: 6
        }
      ]
    },
    {
      label: '工艺单',
      value: '工艺单',
      children: [
        {
          label: '入库',
          value: 8
        }
      ]
    },
    {
      label: '订单',
      value: '订单',
      children: [
        {
          label: '发货',
          value: 9
        }
      ]
    }
  ]
  // 单位
  get selfClientArr() {
    if (
      this.selfType &&
      (this.selfType[0] === '采购单' ||
        this.selfType[0] === '调取单' ||
        this.selfType[0] === '加工单' ||
        this.selfType[0] === '订单' ||
        this.selfType[0] === '工艺单')
    ) {
      return this.outClientArr || this.initClientArr
    } else if (this.selfType && this.selfType[0] === '无单据' && this.selfType[1] === 11) {
      return [
        {
          id: '客户单位',
          name: '客户单位',
          children: this.$store.state.api.client.arr.filter((item: any) => (item.status as number) === 1)
        }
      ]
    } else if (this.selfType && this.selfType[0] === '无单据' && this.selfType[1] === 12) {
      return [
        {
          id: '供货商单位',
          name: '供货商单位',
          children: this.$store.state.api.factory.arr.filter((item: any) => (item.status as number) === 1)
        }
      ]
    } else if (this.selfType && this.selfType[0] === '无单据' && this.selfType[1] === 13) {
      return this.$store.state.api.supplier.arr.filter(
        (item: any) =>
          item.client_type === '染色单位' || item.client_type === '膨纱单位' || item.client_type === '倒筒单位'
      )
    } else {
      return [
        {
          id: '加工单位',
          name: '加工单位',
          children: this.$store.state.api.supplier.arr.filter((item: any) => (item.status as number) === 1)
        },
        {
          id: '客户单位',
          name: '客户单位',
          children: this.$store.state.api.client.arr.filter((item: any) => (item.status as number) === 1)
        },
        {
          id: '供货商单位',
          name: '供货商单位',
          children: this.$store.state.api.factory.arr.filter((item: any) => (item.status as number) === 1)
        }
      ]
    }
  }
  // 纱线
  get selfYarnArr() {
    if (
      this.selfType[0] === '采购单' ||
      this.selfType[0] === '调取单' ||
      this.selfType[0] === '订单' ||
      this.selfType[0] === '工艺单'
    ) {
      return this.yarnArr || this.initYarnArr
    } else {
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
    }
  }
  // 仓库
  get selfStoreArr() {
    if (this.firstStoreId) {
      return this.$store.state.api.storeHouse.arr.filter(
        (item: any) => item.store_type === 1 && item.id === Number(this.firstStoreId)
      )
    } else {
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 1)
    }
  }
  // 移库仓库
  get allStoreArr() {
    return this.$store.state.api.storeHouse.arr.filter(
      (item: any) => item.store_type === 1 && item.id !== Number(this.firstStoreId)
    )
  }
  // 出入库类型
  get inOrOut(): string {
    console.log(this.selfType)
    if (
      this.selfType.length > 0 &&
      (this.selfType[1] === 1 || this.selfType[1] === 3 || this.selfType[1] === 5 || this.selfType[1] === 8)
    ) {
      return '入库'
    } else if (
      this.selfType.length > 0 &&
      (this.selfType[1] === 2 || this.selfType[1] === 4 || this.selfType[1] === 6 || this.selfType[1] === 9)
    ) {
      return '出库'
    } else if (this.selfType.length > 0 && this.selfType[1] === 10) {
      return '移库'
    } else {
      return '填写'
    }
  }
  reset() {
    this.clearData()
    this.$emit('update:show', false)
    this.$emit('close')
  }
  clearData(ev?: any) {
    if (!ev) {
      this.selfType = []
    }
    this.relatedArr = []
    if (this.initData && this.initData.length > 0) {
      this.storeInfo.related_id = ''
      this.storeInfo.client_id = []
      this.storeInfo.move_select_id = ''
      this.storeInfo.move_second_store_id = ''
      this.storeInfo.action_type = ''
    } else {
      this.storeInfo = {
        order_code: '',
        related_id: '',
        client_id: '',
        select_id: [],
        store_id: '',
        second_store_id: '',
        move_select_id: '',
        move_store_id: '',
        move_second_store_id: '',
        action_type: '',
        type: '',
        child_data: [
          {
            name: '',
            action_weight: '',
            color: '',
            attribute: '',
            batch_code: '',
            color_code: '',
            vat_code: '',
            item: '',
            price: '',
            number_attribute: '98纱',
            before_attribute: '',
            after_attribute: '',
            before_color: '白胚',
            after_color: ''
          }
        ],
        additional_fee: [
          {
            name: '',
            price: '',
            desc: ''
          }
        ],
        desc: '',
        complete_time: this.$getDate(new Date())
      }
    }
  }
  searchRlatedId(query: string) {
    if (query !== '') {
      this.relatedLoading = true
      const typeJson: any = {
        采购单: 2,
        加工单: 4,
        调取单: 3,
        工艺单: 5,
        订单: 1
      }
      allList
        .forSeachId({
          type: typeJson[(this.selfType as any[])[0]],
          keyword: query
        })
        .then((res: any) => {
          this.relatedLoading = false
          this.relatedArr = res.data.data
        })
    } else {
      this.relatedArr = []
    }
  }
  // 根据单据信息初始化列表
  initDetail(id: number) {
    this.loading = true
    if (this.selfType[0] === '采购单') {
      yarnOrder
        .detail({
          id
        })
        .then((res) => {
          const data = res.data.data
          this.storeInfo.order_id = data.order_id
          this.initClientArr = [
            {
              id: data.client_id,
              name: data.client_name
            }
          ]
          this.initYarnArr = this.$mergeData(data.child_data, {
            mainRule: 'name'
          })
          console.log(this.initYarnArr)
          this.loading = false
        })
    }
    // 调取单
    if (this.selfType[0] === '调取单') {
      store
        .orderDetail({
          id
        })
        .then((res) => {
          const data = res.data.data
          if (this.firstStoreId && Number(this.firstStoreId) !== data.store_id) {
            this.$message.error('该调取单来源与仓库不符，请到' + data.store_name + '处理该调取单')
            this.storeInfo.related_id = ''
            return
          }
          this.initClientArr = this.$store.state.api.supplier.arr
          this.storeInfo.select_id = [data.store_id, data.second_store_id]
          this.storeInfo.order_id = data.order_id
          this.initYarnArr = [
            {
              name: data.name,
              childrenMergeInfo: [
                {
                  color: data.color,
                  attribute: data.attribute
                }
              ]
            }
          ]
          this.storeInfo.child_data = [
            {
              name: data.name,
              action_weight: data.total_weight,
              color: data.color,
              attribute: data.attribute,
              batch_code: data.batch_code,
              color_code: data.color_code,
              vat_code: data.vat_code,
              item: data.item,
              colorArr: [
                {
                  color: data.color,
                  attribute: data.attribute
                }
              ]
            }
          ]
          this.loading = false
        })
    }
    // 加工单
    if (this.selfType[0] === '加工单') {
      yarnProcess
        .detail({
          id
        })
        .then((res) => {
          const data = res.data.data
          this.storeInfo.order_id = data.order_id
          this.storeInfo.client_id = data.client_id
          this.initClientArr = [
            {
              id: data.client_id,
              name: data.client_name
            }
          ]
          this.loading = false
          if (data.order_id) {
            this.loading = true
            order
              .detail({
                id: data.order_id
              })
              .then((res2) => {
                const orderData = res2.data.data
                this.initYarnArr = this.$mergeData(orderData.product_info, {
                  mainRule: 'product_name/name',
                  childrenRule: {
                    mainRule: ['color', 'attribute'],
                    otherRule: [{ name: 'weight', type: 'add' }]
                  }
                })
                this.initClientArr = [
                  {
                    id: orderData.client_id,
                    name: orderData.client_name
                  }
                ]
                if (!this.initData || this.initData.length === 0) {
                  this.storeInfo.child_data = []
                  this.initYarnArr.forEach((item) => {
                    item.childrenMergeInfo.forEach((itemChild: any) => {
                      this.storeInfo.child_data.push({
                        name: item.name,
                        action_weight: itemChild.weight,
                        color: itemChild.color,
                        attribute: itemChild.attribute,
                        batch_code: '',
                        color_code: '',
                        vat_code: '',
                        item: '',
                        colorArr: item.childrenMergeInfo.map((itemFuck: any) => {
                          return {
                            value: itemFuck.color,
                            label: itemFuck.color
                          }
                        })
                      })
                    })
                  })
                }
                this.loading = false
              })
          }
        })
    }
    // 工艺单
    if (this.selfType[0] === '工艺单') {
      craft
        .detail({
          id
        })
        .then((res) => {
          const data = res.data.data
          this.initYarnArr = [
            {
              name: data.yarn_name,
              childrenMergeInfo: [
                {
                  color: data.color,
                  attribute: data.attribute
                }
              ]
            }
          ]
          this.initClientArr = [
            {
              id: data.client_id,
              name: data.client_name
            }
          ]
          this.loading = false
        })
    }
    // 订单
    if (this.selfType[0] === '订单') {
      order
        .detail({
          id
        })
        .then((res) => {
          const data = res.data.data
          this.initYarnArr = this.$mergeData(data.product_info, {
            mainRule: 'product_name/name',
            childrenRule: {
              mainRule: ['color', 'attribute'],
              otherRule: [{ name: 'weight', type: 'add' }]
            }
          })
          this.initClientArr = [
            {
              id: data.client_id,
              name: data.client_name
            }
          ]
          this.storeInfo.client_id = data.client_id
          if (!this.initData || this.initData.length === 0) {
            this.storeInfo.child_data = []
            this.initYarnArr.forEach((item) => {
              item.childrenMergeInfo.forEach((itemChild: any) => {
                this.storeInfo.child_data.push({
                  name: item.name,
                  action_weight: itemChild.weight,
                  color: itemChild.color,
                  attribute: itemChild.attribute,
                  batch_code: '',
                  color_code: '',
                  vat_code: '',
                  item: '',
                  colorArr: item.childrenMergeInfo.map((itemFuck: any) => {
                    return {
                      value: itemFuck.color,
                      label: itemFuck.color
                    }
                  })
                })
              })
            })
          }
          this.loading = false
        })
    }
  }
  // 根据传过来的操作类型更改
  getType() {
    if (this.type === 1) {
      this.selfType = ['无单据', 1]
    } else if (this.type === 2) {
      this.selfType = ['无单据', 2]
    } else if (this.type === 3) {
      this.selfType = ['采购单', 3]
    } else if (this.type === 4) {
      this.selfType = ['调取单', 4]
    } else if (this.type === 5) {
      this.selfType = ['加工单', 5]
      this.initDetail(this.relatedId as number)
    } else if (this.type === 6) {
      this.selfType = ['加工单', 6]
      this.initDetail(this.relatedId as number)
    } else if (this.type === 9) {
      this.selfType = ['订单', 9]
    } else if (this.type === 10) {
      this.selfType = ['无单据', 10]
    } else if (this.type === 11) {
      this.selfType = ['无单据', 11]
    } else if (this.type === 12) {
      this.selfType = ['无单据', 12]
    }
  }
  // 根据选中的纱线初始化颜色属性下拉框
  getColor(yarnName: string, info?: any) {
    // 特殊连接符 IamConnector
    info.colorArr = (this.selfYarnArr as any[])
      .find((item: any) => {
        return item.name === yarnName
      })
      .childrenMergeInfo.map((item: any) => {
        return {
          value: item.color,
          label: item.color
        }
      })
    if (info) {
      info.color = ''
    }
  }
  saveAll() {
    if (
      this.$formCheck(this.storeInfo, [
        {
          key: 'select_id',
          errMsg: '请选择仓库'
        }
      ])
    ) {
      return
    }
    if ((this.storeInfo.action_type as any[][1]) === '移库') {
      if (!this.storeInfo.move_select_id) {
        this.$message.error('请选择移库仓库')
        return
      }
    } else {
      if (!this.storeInfo.client_id) {
        this.$message.error('请选择单位')
        return
      }
    }

    if (
      this.storeInfo.child_data.some((item) => {
        return this.$formCheck(item, [
          {
            key: 'name',
            errMsg: '请选择纱线名称'
          }
        ])
      })
    ) {
      return
    }
    if (this.selfType[1] === 11 || this.selfType[1] === 12) {
      if (
        this.storeInfo.child_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'action_weight',
              errMsg: '请输入数量'
            },
            {
              key: 'price',
              errMsg: '请输入单价，可填0'
            },
            {
              key: 'color',
              errMsg: '请输入纱线颜色'
            },
            {
              key: 'attribute',
              errMsg: '请选择纱线属性'
            }
          ])
        })
      ) {
        return
      }
    }
    if (this.selfType[1] === 13) {
      if (!this.storeInfo.type) {
        this.$message.error('请选择加工类型')
        return
      }
      if (
        this.storeInfo.child_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'action_weight',
              errMsg: '请输入数量'
            },
            {
              key: 'price',
              errMsg: '请输入单价，可填0'
            }
          ])
        })
      ) {
        return
      }
      if (
        this.storeInfo.type === '染色' &&
        this.storeInfo.child_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'attribute',
              errMsg: '请选择属性'
            },
            {
              key: 'after_color',
              errMsg: '请输入加工后颜色'
            }
          ])
        })
      ) {
        return
      }
      if (
        this.storeInfo.type === '倒筒' &&
        this.storeInfo.child_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'color',
              errMsg: '请输入颜色'
            },
            {
              key: 'before_attribute',
              errMsg: '请选择加工前属性'
            },
            {
              key: 'after_attribute',
              errMsg: '请选择加工后属性'
            }
          ])
        })
      ) {
        return
      }
      if (
        this.storeInfo.type === '膨纱' &&
        this.storeInfo.child_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'color',
              errMsg: '请输入颜色'
            },
            {
              key: 'attibute',
              errMsg: '请选择属性'
            }
          ])
        })
      ) {
        return
      }
    }
    // 销售出库前端类型是11，实际action_type是12，因为移库包含了10和11
    // 11销售出库 -- 需要创建订单 12订购入库 -- 需要创建采购单 13加工回库 -- 需要创建加工单
    if (this.selfType[1] === 11) {
      const totalFee = (this.storeInfo.additional_fee as any[]).reduce((total, current) => {
        return total + Number(current.price)
      }, 0)
      const totalPrice =
        this.storeInfo.child_data.reduce((total, current) => {
          return total + Number(current.action_weight) * Number(current.price)
        }, 0) + totalFee
      const totalWeight = this.storeInfo.child_data.reduce((total, current) => {
        return total + Number(current.action_weight)
      }, 0)
      this.storeInfo.child_data.forEach(
        (item) => (item.product_name = Array.isArray(item.name) ? item.name[1] : item.name)
      )
      const productInfo = this.$mergeData(this.storeInfo.child_data, {
        mainRule: 'product_name/name',
        childrenName: 'child_data'
      })
      // 删除订单不需要的字段
      productInfo.forEach((item: any) => {
        item.child_data.forEach((itemChild: any) => {
          itemChild.weight = itemChild.action_weight
          delete itemChild.action_weight
          delete itemChild.batch_code
          delete itemChild.color_code
          delete itemChild.vat_code
        })
      })
      const orderInfo: Order = {
        order_code: this.storeInfo.order_code as string,
        order_time: this.storeInfo.complete_time,
        delivery_time: this.storeInfo.complete_time,
        reduce_store_data: [
          {
            store_id: (this.storeInfo.select_id as any[])[0],
            second_store_id: (this.storeInfo.select_id as any[])[1],
            child_data: this.storeInfo.child_data.map((item: any) => {
              return {
                name: Array.isArray(item.name) ? item.name[1] : item.name,
                action_weight: item.action_weight,
                color: item.color,
                attribute: item.attribute,
                batch_code: item.batch_code || 'NOT_SET',
                color_code: item.color_code || 'NOT_SET',
                vat_code: item.vat_code || 'NOT_SET',
                item: item.item,
                desc: ''
              }
            })
          }
        ],
        client_id: Array.isArray(this.storeInfo.client_id) ? this.storeInfo.client_id[1] : this.storeInfo.client_id,
        total_price: totalPrice,
        total_weight: totalWeight,
        desc: this.storeInfo.desc,
        file_url: '',
        additional_fee:
          (this.storeInfo.additional_fee as any[]).filter((itemChild) => itemChild.name && itemChild.price).length > 0
            ? JSON.stringify(this.storeInfo.additional_fee)
            : '',
        total_additional_fee: totalFee,
        product_info: productInfo
      }
      order.create(orderInfo).then((res) => {
        if (res.data.status) {
          this.$message.success('操作成功')
          this.reset()
        }
      })
    } else if (this.selfType[1] === 12) {
      const totalFee = (this.storeInfo.additional_fee as any[]).reduce((total, current) => {
        return total + Number(current.price)
      }, 0)
      const totalPrice =
        this.storeInfo.child_data.reduce((total, current) => {
          return total + Number(current.action_weight) * Number(current.price)
        }, 0) + totalFee
      const yarnOrderInfo: OrderYarn = {
        order_id: '',
        client_id: Array.isArray(this.storeInfo.client_id) ? this.storeInfo.client_id[1] : this.storeInfo.client_id,
        total_price: totalPrice,
        total_additional_fee: totalFee,
        child_data: this.storeInfo.child_data.map((item: any) => {
          return {
            name: Array.isArray(item.name) ? item.name[1] : item.name,
            weight: item.action_weight,
            color: item.color,
            attribute: item.attribute,
            price: item.price
          }
        }),
        add_store_data: [
          {
            store_id: (this.storeInfo.select_id as any[])[0],
            second_store_id: (this.storeInfo.select_id as any[])[1],
            child_data: this.storeInfo.child_data.map((item: any) => {
              return {
                name: Array.isArray(item.name) ? item.name[1] : item.name,
                action_weight: item.action_weight,
                color: item.color,
                attribute: item.attribute,
                batch_code: item.batch_code || 'NOT_SET',
                color_code: item.color_code || 'NOT_SET',
                vat_code: item.vat_code || 'NOT_SET',
                item: item.item,
                desc: ''
              }
            })
          }
        ],
        order_time: this.storeInfo.complete_time,
        delivery_time: this.storeInfo.complete_time,
        file_url: '',
        additional_fee:
          (this.storeInfo.additional_fee as any[]).filter((itemChild) => itemChild.name && itemChild.price).length > 0
            ? JSON.stringify(this.storeInfo.additional_fee)
            : '',
        desc: this.storeInfo.desc
      }
      yarnOrder
        .create({
          data: [yarnOrderInfo]
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('操作成功')
            this.reset()
          }
        })
    } else if (this.selfType[1] === 13) {
      const totalFee = (this.storeInfo.additional_fee as any[]).reduce((total, current) => {
        return total + Number(current.price)
      }, 0)
      const totalPrice =
        this.storeInfo.child_data.reduce((total, current) => {
          return total + Number(current.action_weight) * Number(current.price)
        }, 0) + totalFee
      const processInfo: ProcessYarn = {
        order_id: '',
        client_id: Array.isArray(this.storeInfo.client_id) ? this.storeInfo.client_id[1] : this.storeInfo.client_id,
        type: this.storeInfo.type as string,
        price: '',
        desc: this.storeInfo.desc,
        order_time: this.storeInfo.complete_time,
        delivery_time: this.storeInfo.complete_time,
        total_price: totalPrice,
        file_url: '',
        total_additional_fee: totalFee,
        additional_fee:
          (this.storeInfo.additional_fee as any[]).filter((itemChild) => itemChild.name && itemChild.price).length > 0
            ? JSON.stringify(this.storeInfo.additional_fee)
            : '',
        child_data: this.storeInfo.child_data.map((item: any) => {
          return {
            name: Array.isArray(item.name) ? item.name[1] : item.name,
            weight: item.action_weight,
            color: item.color || '',
            attribute: item.attribute || '',
            before_attribute: item.before_attribute || '',
            after_attribute: item.after_attribute || '',
            before_color: '白胚',
            after_color: item.after_color || '',
            price: item.price
          }
        }),
        add_store_data: [
          {
            store_id: (this.storeInfo.select_id as any[])[0],
            second_store_id: (this.storeInfo.select_id as any[])[1],
            child_data: this.storeInfo.child_data.map((item: any) => {
              return {
                name: Array.isArray(item.name) ? item.name[1] : item.name,
                action_weight: item.action_weight,
                color: this.storeInfo.type === '染色' ? item.after_color : item.color,
                attribute: item.attribute,
                batch_code: item.batch_code || 'NOT_SET',
                color_code: item.color_code || 'NOT_SET',
                vat_code: item.vat_code || 'NOT_SET',
                item: item.item,
                desc: ''
              }
            })
          }
        ]
      }
      yarnProcess
        .create({
          order_id: '',
          data: [processInfo]
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('操作成功')
            this.reset()
          }
        })
    } else {
      const formData: StoreCreate = {
        order_id: this.selfType[1] === 9 ? this.storeInfo.related_id : this.orderId || this.storeInfo.order_id,
        related_id: this.storeInfo.related_id,
        action_type: this.selfType[1],
        complete_time: this.storeInfo.complete_time,
        desc: this.storeInfo.desc,
        store_id: (this.storeInfo.select_id as any[])[0],
        second_store_id: (this.storeInfo.select_id as any[])[1],
        move_store_id: this.selfType[1] === 10 ? (this.storeInfo.move_select_id as any[])[0] : '',
        move_second_store_id: this.selfType[1] === 10 ? (this.storeInfo.move_select_id as any[])[1] : '',
        client_id: Array.isArray(this.storeInfo.client_id) ? this.storeInfo.client_id[1] : this.storeInfo.client_id,
        child_data: this.storeInfo.child_data.map((item: any) => {
          return {
            name: Array.isArray(item.name) ? item.name[1] : item.name,
            action_weight: item.action_weight,
            color: item.color,
            attribute: item.attribute,
            batch_code: item.batch_code || 'NOT_SET',
            color_code: item.color_code || 'NOT_SET',
            vat_code: item.vat_code || 'NOT_SET',
            item: item.item,
            related_info_id: '',
            desc: ''
          }
        })
      }
      stock.create({ data: [formData] }).then((res) => {
        if (res.data.status) {
          this.$message.success('操作成功')
          this.reset()
        }
      })
    }
  }
  bindCode() {
    stock
      .update({
        action_type: this.selfType[1] as number,
        id: this.updateId as string,
        related_id: this.storeInfo.related_id as string
      })
      .then((res) => {
        if (res.data.status) {
          this.$message.success('操作成功')
          this.reset()
        }
      })
  }

  @Watch('show')
  init(val: boolean) {
    if (val) {
      this.$checkCommonInfo([
        {
          checkWhich: 'api/storeHouse',
          getInfoMethed: 'dispatch',
          getInfoApi: 'getStoreAsync'
        },
        {
          checkWhich: 'api/factory',
          getInfoMethed: 'dispatch',
          getInfoApi: 'getPartyBAsync'
        },
        {
          checkWhich: 'api/yarnType',
          getInfoMethed: 'dispatch',
          getInfoApi: 'getYarnTypeAsync'
        }
      ])
      this.getType()
      if (this.relatedId) {
        this.storeInfo.related_id = this.relatedId
        this.storeInfo.client_id = this.clientId
        this.storeInfo.select_id = this.storeId
        this.storeInfo.child_data[0].name = this.yarnName || ''
        this.storeInfo.child_data[0].color = this.yarnColor || ''
        this.storeInfo.child_data[0].attribute = this.yarnAttr || ''
        if (this.yarnName) {
          this.getColor(this.yarnName)
        }
        if (this.type === 9) {
          this.initDetail(this.relatedId as number)
        }
      }
      if (this.initData && this.initData.length > 0) {
        console.log(this.initData)
        this.storeInfo.child_data = []
        this.storeInfo.select_id = [Number(this.firstStoreId), this.initData[0].second_store_id]
        this.initData.forEach((item) => {
          item.store_info.forEach((itemChild) => {
            this.storeInfo.child_data.push({
              name: item.name,
              action_weight: itemChild.weight,
              color: item.color,
              attribute: item.attribute,
              colorArr: [
                {
                  value: item.color,
                  label: item.color
                }
              ],
              batch_code: itemChild.batch_code === 'NOT_SET' ? '' : itemChild.batch_code,
              color_code: itemChild.color_code === 'NOT_SET' ? '' : itemChild.color_code,
              vat_code: itemChild.vat_code === 'NOT_SET' ? '' : itemChild.vat_code,
              item: ''
            })
          })
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import './inAndOut.less';
</style>
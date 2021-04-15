<template>
  <div class="popup inAndOut"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <div class="text">{{inOrOut || '填写'}}信息</div>
        <i class="el-icon-close"
          @click="reset"></i>
      </div>
      <div class="contentCtn">
        <div class="createCtn">
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
                    v-show="noChange"
                    v-model="relatedCode"
                    placeholder="单号信息"></el-input>
                  <el-select v-show="!noChange"
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
          <template v-if="selfType&&(selfType[0]==='无单据'||(selfType[0]!=='无单据'&&storeInfo.related_id))">
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
              <template v-if="selfType[1]!==10">
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
              <template v-else>
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
            </div>
            <div class="rowCtnCtn"
              v-for="(item,index) in storeInfo.child_data"
              :key="index">
              <i class="el-icon-circle-close"
                @click="storeInfo.child_data.length>1?$deleteItem(storeInfo.child_data,index):$message.warning('至少有一项')"></i>
              <div class="rowCtn">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">毛条名称</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <template v-if="selfType[0]==='采购单' ||selfType[0]==='调取单' || selfType[0]==='工艺单' || selfType[0]==='订单'">
                        <el-select placeholder="请选择毛条名称"
                          v-model="item.name"
                          @change="getColorAttr($event,item)">
                          <el-option v-for="item in selfYarnArr"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                      <template v-else>
                        <el-cascader v-model="item.name"
                          filterable
                          placeholder="请选择毛条"
                          :options="selfYarnArr"></el-cascader>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input v-model="item.action_weight"
                        placeholder="数量"></el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">件数</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input v-model="item.items"
                        placeholder="件数"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rowCtn"
                v-if="selfType[1]===1 ||selfType[1]===3 || selfType[1]===5 || selfType[1]===8">
                <div class="colCtn flex3">
                  <div class="label">
                    <span class="text">入库批号</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input v-model="item.batch_code"
                        placeholder="请输入入库批号"></el-input>
                    </div>
                  </div>
                </div>
                <!-- <div class="colCtn">
                  <div class="label">
                    <span class="text">入库色号</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input v-model="item.color_code"
                        placeholder="请输入入库色号"></el-input>
                    </div>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">入库缸号</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-input v-model="item.vat_code"
                        placeholder="请输入入库缸号"></el-input>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn flex3">
                <div class="btn btnMain"
                  @click="$addItem(storeInfo.child_data,{
                  name: '',
                  action_weight: '',
                  colorAttr: '',
                  batch_code: '',
                  item: ''
                })">添加毛条</div>
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
            <div class="tips">请绑定需要关联的单号信息！</div>
          </template>
        </div>
      </div>
      <div class="oprCtn">
        <div class="opr"
          @click="reset">取消</div>
        <div class="opr blue"
          @click="saveAll">确定</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { StoreCreate } from '@/types/store'
import { stock, allList, yarnOrder, yarnProcess, store, craft, order } from '@/assets/js/api'
@Component
export default class InAndOutMat extends Vue {
  @Prop() show!: boolean
  @Prop() type!: number
  @Prop() orderId?: string
  @Prop() relatedId?: number | string
  @Prop() clientId?: number | string
  @Prop() firstStoreId?: string | number // 普通出入库的时候一级仓库id
  @Prop() storeId?: any[] // 一级二级仓库
  @Prop() relatedCode?: string
  @Prop() yarnName?: string
  @Prop() yarnType?: string // 包含颜色和属性
  @Prop({ default: true }) noChange?: boolean // 用于标记是否可修改操作类型，一般订单里得操作都是固定的操作类型不可修改，仓库里的是可修改的
  @Prop() yarnArr?: any[]
  @Prop() outClientArr?: any[] // 订单自带的加工单位
  inOrOut = ''
  relatedLoading = false
  relatedArr = []
  storeInfo: StoreCreate = {
    related_id: '',
    client_id: '',
    select_id: [],
    store_id: '',
    second_store_id: '',
    move_select_id: '',
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
        colorAttr: '',
        batch_code: '',
        item: ''
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
          label: '入库',
          value: 1
        },
        {
          label: '出库',
          value: 2
        },
        {
          label: '移库',
          value: 10
        }
      ]
    }
    // {
    //   label: '采购单',
    //   value: '采购单',
    //   children: [
    //     {
    //       label: '入库',
    //       value: 3
    //     }
    //   ]
    // }
  ]
  colorAttrArr = []
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
    } else {
      return this.$store.state.api.factory.arr
        .filter((item: any) => (item.status as number) === 1)
        .concat(this.$store.state.api.supplier.arr.filter((item: any) => (item.status as number) === 1))
    }
  }
  // 毛条
  get selfYarnArr() {
    if (
      this.selfType[0] === '采购单' ||
      this.selfType[0] === '调取单' ||
      this.selfType[0] === '订单' ||
      this.selfType[0] === '工艺单'
    ) {
      return this.yarnArr || this.initYarnArr
    } else {
      return this.$store.state.api.materialType.arr.map((item: any) => {
        return {
          value: item.name,
          label: item.name,
          children: item.child_data.map((itemChild: any) => {
            return {
              value: itemChild.name,
              label: itemChild.name
            }
          })
        }
      })
    }
  }
  // 所有仓库
  get selfStoreArr() {
    if (this.firstStoreId) {
      return this.$store.state.api.storeHouse.arr.filter(
        (item: any) => item.store_type === 2 && item.id === Number(this.firstStoreId)
      )
    } else {
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 2)
    }
  }
  // 移库仓库
  get allStoreArr() {
    return this.$store.state.api.storeHouse.arr.filter(
      (item: any) => item.store_type === 2 && item.id !== Number(this.firstStoreId)
    )
  }

  reset() {
    this.clearData()
    this.$emit('update:show', false)
    this.$emit('close')
  }
  clearData() {
    this.storeInfo = {
      related_id: '',
      client_id: '',
      select_id: [],
      store_id: '',
      second_store_id: '',
      move_select_id: '',
      move_store_id: '',
      move_second_store_id: '',
      action_type: '',
      child_data: [
        {
          name: '',
          action_weight: '',
          color: '',
          attribute: '',
          colorAttr: '',
          batch_code: '',
          color_code: '',
          vat_code: '',
          item: ''
        }
      ],
      desc: '',
      complete_time: this.$getDate(new Date())
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
    if (this.selfType[0] === '采购单') {
      yarnOrder
        .detail({
          id
        })
        .then((res) => {
          console.log(res.data.data)
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
          console.log(this.firstStoreId, data.store_id)
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
          this.initClientArr = [
            {
              id: data.client_id,
              name: data.client_name
            }
          ]
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
          console.log(data)
          this.initYarnArr = this.$mergeData(data.product_info, {
            mainRule: 'product_name/name'
          })
          this.initClientArr = [
            {
              id: data.client_id,
              name: data.client_name
            }
          ]
        })
    }
  }
  // 根据传过来的操作类型更改
  getType() {
    if (this.type === 1) {
      this.selfType = ['无单据', 1]
      this.inOrOut = '入库'
    } else if (this.type === 2) {
      this.selfType = ['无单据', 2]
      this.inOrOut = '出库'
    } else if (this.type === 3) {
      this.selfType = ['采购单', 3]
      this.inOrOut = '入库'
    } else if (this.type === 10) {
      this.selfType = ['无单据', 10]
      this.inOrOut = '移库'
    }
  }
  // 根据选中的毛条初始化颜色属性下拉框
  getColorAttr(yarnName: string, info?: any) {
    // 特殊连接符 IamConnector
    this.colorAttrArr = (this.selfYarnArr as any[])
      .find((item: any) => {
        return item.name === yarnName
      })
      .childrenMergeInfo.map((item: any) => {
        return {
          value: item.color + 'IamConnector' + item.attribute,
          label: item.color + '/' + item.attribute
        }
      })
    if (info) {
      info.colorAttr = ''
    }
  }
  saveAll() {
    const formData: StoreCreate = {
      order_id: this.orderId || this.storeInfo.order_id,
      related_id: this.storeInfo.related_id,
      action_type: this.selfType[1],
      complete_time: this.storeInfo.complete_time,
      desc: this.storeInfo.desc,
      store_id: (this.storeInfo.select_id as any[])[0],
      second_store_id: (this.storeInfo.select_id as any[])[1],
      move_store_id: this.selfType[1] === 10 ? (this.storeInfo.move_select_id as any[])[0] : '',
      move_second_store_id: this.selfType[1] === 10 ? (this.storeInfo.move_select_id as any[])[1] : '',
      client_id: this.storeInfo.client_id,
      child_data: this.storeInfo.child_data.map((item: any) => {
        return {
          name: Array.isArray(item.name) ? item.name[1] : item.name,
          action_weight: item.action_weight,
          color: item.color || item.colorAttr.split('IamConnector')[0],
          attribute: item.attribute || item.colorAttr.split('IamConnector')[1],
          batch_code: item.batch_code || 'NOT_SET',
          color_code: item.color_code || 'NOT_SET',
          vat_code: item.vat_code || 'NOT_SET',
          item: item.item,
          related_info_id: '',
          desc: ''
        }
      })
    }
    stock.materialCreate({ data: [formData] }).then((res) => {
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
          checkWhich: 'api/materialType',
          getInfoMethed: 'dispatch',
          getInfoApi: 'getMaterialTypeAsync'
        }
      ])
      this.getType()
      if (this.relatedId) {
        this.storeInfo.related_id = this.relatedId
        this.storeInfo.client_id = this.clientId
        this.storeInfo.select_id = this.storeId
        this.storeInfo.child_data[0].name = this.yarnName || ''
        this.storeInfo.child_data[0].colorAttr = this.yarnType || ''
        if (this.yarnName) {
          this.getColorAttr(this.yarnName)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import './inAndOut.less';
</style>
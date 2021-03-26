<template>
  <div class="indexMain"
    id="storeDetail"
    v-loading='loading.page'>
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">仓库名称：</span>
            <span class="text green">{{storeDetail.name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">仓库类型：</span>
            <span class="text">{{storeDetail.type|filterStoreType}}</span>
          </div>
          <div class="colCtn">
            <span class="label">仓库管理员：</span>
            <span class="text">{{storeDetail.manager_data.map(itemM=>itemM.name).join('、')}}</span>
          </div>
          <div class="colCtn">
            <span class="label">二级仓库名：</span>
            <span class="text">{{storeDetail.second_data.map(itemM=>itemM.name).join('、')}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">创建人：</span>
            <span class="text">{{storeDetail.user_name}}</span>
          </div>
          <div class="colCtn">
            <span class="label flex3">创建时间：</span>
            <span class="text">{{$getDate(storeDetail.create_time)}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{storeDetail.desc}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">库存信息</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-select v-model="storeListFilter.LV2_name"
                clearable
                @change="getStoreInfoList"
                placeholder="请选择二级仓库名称">
                <el-option v-for="item in storeDetail.second_data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-input v-model="storeListFilter.name"
                @change="getStoreInfoList"
                placeholder="请输入纱线名称"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="storeListFilter.color"
                @change="getStoreInfoList"
                placeholder="请输入纱线颜色"></el-input>
            </div>
            <div class="elCtn">
              <el-checkbox v-model="storeListFilter.isFilterZero"
                @change="getStoreInfoList">过滤库存为0的纱线</el-checkbox>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr"
              @click="resetFilter(1)">重置</div>
          </div>
        </div>
        <div class="tableCtn"
          style="margin:24px 0"
          v-loading='!loading.page && loading.info'>
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">二级仓库名称</div>
              <div class="tcolumn">毛条名称</div>
              <div class="tcolumn noPad flex5">
                <div class="trow">
                  <div class="tcolumn">实际库存(KG)</div>
                  <div class="tcolumn">可用库存(KG)</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in storeListCom.data"
              :key="item.id">
              <div class="tcolumn">{{item.second_store_name || '-'}}</div>
              <div class="tcolumn">{{item.name}}</div>
              <div class="tcolumn noPad flex5">
                <div class="trow"
                  v-for="(itemStore,indexStore) in item.store_info"
                  :key="indexStore">
                  <div class="tcolumn">{{itemStore.reality_weight && $formatNum(itemStore.reality_weight) || '-'}}</div>
                  <div class="tcolumn blue">{{itemStore.useable_weight && $formatNum(itemStore.useable_weight) || '-'}}</div>
                  <div class="tcolumn flexRow">
                    <span class="opr blue"
                      @click="handleStockBtn(item,itemStore,1)">入库</span>
                    <span class="opr orange"
                      @click="handleStockBtn(item,itemStore,2)">出库</span>
                    <span class="opr green"
                      @click="goLogEl(item)">日志</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow bgGray noBorder">
              <div class="tcolumn">合计</div>
              <div class="tcolumn"></div>
              <div class="tcolumn noPad flex5">
                <div class="trow">
                  <div class="tcolumn">{{$formatNum(storeListCom.reality_weight)}}</div>
                  <div class="tcolumn blue">{{$formatNum(storeListCom.useable_weight)}}</div>
                  <div class="tcolumn"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="editCtn"
          id="stockEditEl">
          <div class="editContainer"
            v-show="storeEditInfo.child_data.length>0">
            <div class="eRow">
              <div class="eColumn">
                <span class="label isMust">二级仓库</span>
                <div class="from">
                  <el-select v-model="storeEditInfo.second_store_id"
                    placeholder="请选择二级仓库"
                    clearable>
                    <el-option v-for="item in storeDetail.second_data"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="eColumn">
                <span class="label isMust">操作类型</span>
                <div class="from">
                  <el-select v-model="storeEditInfo.action_type"
                    placeholder="请选择操作类型">
                    <el-option v-for="item in commonInit.typeArr"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="eColumn">
                <span class="label isMust">出入库单位</span>
                <div class="from">
                  <el-select v-model="storeEditInfo.client_id"
                    placeholder="请选择出入库单位"
                    filterable>
                    <el-option v-for="item in client_list"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="eRowCtn"
              style="position:relative"
              v-for="(itemStore,indexStore) in storeEditInfo.child_data"
              :key="indexStore">
              <span class="el-icon-circle-close"
                @click="storeEditInfo.child_data.length===1?$message.error('至少有一种纱线'):$deleteItem(storeEditInfo.child_data,indexStore)"></span>
              <div class="eRow">
                <div class="eColumn">
                  <span class="label isMust">毛条名称</span>
                  <div class="from">
                    <el-cascader v-model="itemStore.name"
                      filterable
                      :props="{value:'label'}"
                      placeholder="请选择毛条"
                      :options="mat_type_list"></el-cascader>
                  </div>
                </div>
                <div class="eColumn">
                  <span class="label isMust">数量</span>
                  <div class="from">
                    <el-input v-model="itemStore.action_weight"
                      placeholder="请输入数量信息">
                      <template slot="append">kg</template>
                    </el-input>
                  </div>
                </div>
                <div class="eColumn">
                  <span class="label isMust">件数</span>
                  <div class="from">
                    <el-input v-model="itemStore.item"
                      placeholder="请输入件数">
                      <template slot="append">件</template>
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="eRow">
              <div class="eColumn">
                <span class="label isMust">操作日期</span>
                <div class="from">
                  <el-date-picker style="width:100%"
                    v-model="storeEditInfo.complete_time"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择操作日期">
                  </el-date-picker>
                </div>
              </div>
              <div class="eColumn">
                <span class="label isMust">备注信息</span>
                <div class="from">
                  <el-input v-model="storeEditInfo.desc"
                    placeholder="请输入备注信息"></el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="editBtnCtn"
            v-if="storeEditInfo.child_data.length > 0">
            <div class="editBtn btnGray"
              @click="resetData">取消</div>
            <div class="editBtn btnBluePurple"
              @click="$addItem(storeEditInfo.child_data,{
                name:'',
                item:'',
                action_weight:'',
                desc:''
              })">继续添加</div>
            <div class="editBtn btnGreen"
              @click="saveStoreEditInfo">确认提交</div>
          </div>
          <div class="editBtnCtn"
            v-if="storeEditInfo.child_data.length === 0">
            <div class="editBtn btnBluePurple"
              @click="$addItem(storeEditInfo.child_data,{
                name:'',
                item:'',
                action_weight:'',
                desc:''
              })">添加新库存</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      id="stockLogEl">
      <div class="titleCtn">
        <span class="title">出入库日志</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn"
          :class="{'showMore':showMore}">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div>
            <div class="elCtn">
              <el-select v-model="storeLogListFilter.LV2_name"
                clearable
                @change="getStoreLogList(1)"
                placeholder="请选择二级仓库名称">
                <el-option v-for="item in storeDetail.second_data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-input v-model="storeLogListFilter.name"
                @change="getStoreLogList(1)"
                placeholder="输入纱线名称"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="storeLogListFilter.color"
                @change="getStoreLogList(1)"
                placeholder="输入纱线颜色"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="storeLogListFilter.attr"
                clearable
                @change="getStoreLogList(1)"
                placeholder="选择纱线属性">
                <el-option v-for="item in commonInit.materialAttrArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-select v-model="storeLogListFilter.type"
                clearable
                @change="getStoreLogList(1)"
                placeholder="选择出库类型">
                <el-option v-for="item in commonInit.typeArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-input v-model="storeLogListFilter.code"
                @change="getStoreLogList(1)"
                placeholder="输入关联单号"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="storeLogListFilter.limit"
                clearable
                @change="getStoreLogList(1)"
                placeholder="每页展示条数（默认‘5’）">
                <el-option v-for="item in [
                  {
                    id:5,
                    name:'5条'
                  },
                  {
                    id:10,
                    name:'10条'
                  },
                  {
                    id:15,
                    name:'15条'
                  },
                  {
                    id:20,
                    name:'20条'
                  },
                  {
                    id:25,
                    name:'25条'
                  }
                ]"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-date-picker v-model="storeLogListFilter.time"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getStoreLogList(1)">
              </el-date-picker>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr"
              @click="resetFilter(2)">重置</div>
          </div>
        </div>
        <div style="padding:20px 0">
          <div class="tableCtn"
            v-loading='!loading.page && loading.log'>
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">单号</div>
                <div class="tcolumn">类型</div>
                <div class="tcolumn">仓库/单位名称</div>
                <div class="tcolumn noPad"
                  style="flex:2">
                  <div class="trow">
                    <div class="tcolumn">名称</div>
                    <div class="tcolumn">数量</div>
                  </div>
                </div>
                <div class="tcolumn">日期</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="item in  storeLogInfo.list"
                :key="item.id">
                <div class="tcolumn">{{item.code}}</div>
                <div class="tcolumn"
                  :class="{'blue':item.action_type===1||item.action_type===3||item.action_type===5,'green':item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7}">{{item.action_type|stockTypeFilter}}</div>
                <div class="tcolumn">{{item.action_type===1||item.action_type===3||item.action_type===5?item.second_store_name:item.client_name}}</div>
                <div class="tcolumn noPad"
                  style="flex:2">
                  <div class="trow"
                    v-for="(itemChilid,indexChild) in item.child_data"
                    :key="indexChild">
                    <div class="tcolumn">{{itemChilid.name}}</div>
                    <div class="tcolumn"
                      :class="{'blue':item.action_type===1||item.action_type===3||item.action_type===5,'green':item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7}">{{itemChilid.action_weight}}</div>
                  </div>
                </div>
                <div class="tcolumn">{{item.complete_time}}</div>
              </div>
              <div class="trow bgGray noBorder">
                <div class="tcolumn"
                  style="display:block;line-height:46px">合计出库：<span class="green">{{$formatNum(storeLogInfo.total_pop)}}</span>kg</div>
                <div class="tcolumn"></div>
                <div class="tcolumn"
                  style="display:block;line-height:46px">合计入库：<span class="blue">{{$formatNum(storeLogInfo.total_push)}}</span>kg</div>
                <div class="tcolumn"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            @current-change="getStoreLogList"
            :current-page.sync="storeLogListFilter.pages"
            :page-size="storeLogListFilter.limit"
            layout="prev, pager, next"
            :total="storeLogListFilter.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { StoreDetail } from '@/types/common'
import { store, stock, product, yarnColor } from '@/assets/js/api'
import { StoreCreate } from '@/types/store'
export default Vue.extend({
  data(): {
    storeDetail: StoreDetail
    storeList: Array<{
      [key: string]: any
    }>
    commonInit: {
      yarnList: []
      yarnColorList: Array<{ value: string; id: number }>
      typeArr: Array<{ id: number; name: string }>
      materialAttrArr: Array<{ id: number; name: string }>
      remarkList: Array<{ value: string }>
    }
    storeEditInfo: StoreCreate
    [propName: string]: any
  } {
    return {
      showMore: false,
      loading: {
        page: true,
        info: true,
        log: true
      },
      // 仓库数据
      storeDetail: {
        id: NaN,
        name: '',
        manager_data: [],
        second_data: [],
        type: 1,
        create_time: null,
        user_name: '',
        desc: ''
      },
      // 库存数据
      storeList: [],
      storeListFilter: {
        LV2_name: '',
        name: '',
        color: '',
        isFilterZero: true,
        page: 1,
        total: 1
      },
      storeEditInfo: {
        client_id: '',
        action_type: '',
        desc: '',
        complete_time: this.$getDate(new Date()),
        store_id: this.$route.params.id,
        second_store_id: '',
        child_data: []
      },
      // 日志数据
      storeLogInfo: {
        total_push: 0,
        total_pop: 0,
        list: []
      },
      storeLogListFilter: {
        LV2_name: '',
        name: '',
        color: '',
        attr: '',
        type: '',
        code: '',
        limit: 5,
        pages: 1,
        total: 1,
        time: ''
      },
      // 初始化公共数据
      commonInit: {
        yarnList: [],
        yarnColorList: [],
        typeArr: [
          {
            id: 1,
            name: '入库'
          },
          {
            id: 2,
            name: '出库'
          }
        ],
        materialAttrArr: [
          {
            id: 1,
            name: '绞纱'
          },
          {
            id: 2,
            name: '筒纱'
          }
        ],
        remarkList: []
      }
    }
  },

  methods: {
    init() {
      Promise.all([
        store.detail({
          id: Number(this.$route.params.id)
        })
      ]).then((res) => {
        this.loading.page = false
        this.storeDetail = res[0].data.data
      })
      this.getStoreInfoList()
      this.getStoreLogList()
    },
    getStoreInfoList() {
      this.loading.info = true
      store
        .detailMateiralList({
          store_id: this.$route.params.id,
          second_store_id: this.storeListFilter.LV2_name || null,
          name: this.storeListFilter.name || null,
          color: this.storeListFilter.color || null,
          weight: this.storeListFilter.isFilterZero ? 0 : null
        })
        .then((res) => {
          this.storeList = res.data.data
          this.loading.info = false
        })
    },
    // 1是库存信息2是日志
    resetFilter(type: 1 | 2) {
      if (type === 1) {
        this.storeListFilter = {
          LV2_name: '',
          name: '',
          color: '',
          isFilterZero: true,
          page: 1,
          total: 1
        }
        this.getStoreInfoList()
      } else if (type === 2) {
        this.storeLogListFilter = {
          LV2_name: '',
          name: '',
          color: '',
          attr: '',
          type: '',
          code: '',
          limit: 5,
          pages: 1,
          total: 1,
          time: ''
        }
        this.getStoreLogList()
      } else {
        this.$message.warning('未知重置错误')
      }
    },
    // 入库出库按钮事件
    handleStockBtn(item1: any, item2: any, type: 1 | 2) {
      if (this.storeEditInfo.action_type && this.storeEditInfo.action_type !== type) {
        this.$message.error('请选择相同操作类型进行出入库')
        return
      }
      if (this.storeEditInfo.second_store_id && this.storeEditInfo.second_store_id !== item1.second_store_id) {
        this.$message.error('请选择相同二级仓库进行出入库')
        return
      }
      const findName: any = this.commonInit.yarnList.find((itemF: any) =>
        itemF.children.find((itemFC: any) => itemFC.label === item1.name)
      )
      if (this.storeEditInfo.child_data.length > 0) {
        this.storeEditInfo.child_data.push({
          name: (findName && [findName.label, item1.name]) || '',
          color: item1.color,
          attribute: item1.attribute,
          color_code: item2.color_code,
          vat_code: item2.vat_code,
          action_weight: '',
          item: '',
          desc: ''
        })
      } else {
        this.storeEditInfo = {
          client_id: '',
          action_type: type,
          desc: '',
          complete_time: this.$getDate(new Date()),
          store_id: this.$route.params.id,
          second_store_id: item1.second_store_id,
          child_data: [
            {
              name: (findName && [findName.label, item1.name]) || '',
              color: item1.color,
              attribute: item1.attribute,
              color_code: item2.color_code,
              vat_code: item2.vat_code,
              action_weight: '',
              item: '',
              desc: ''
            }
          ]
        }
      }
    },
    querySearchColor(queryString: string, cb: (params: any) => void) {
      const returnData = queryString
        ? this.commonInit.yarnColorList.filter((itemF) => itemF.value.indexOf(queryString) !== -1)
        : this.commonInit.yarnColorList
      cb(returnData)
    },
    querySearchColorCode(queryString: string, cb: (params: any) => void) {
      const colorCodeList = this.$unique(
        this.storeList.map((itemM: any) => {
          return {
            value: itemM.color_code
          }
        }),
        'value'
      )
      const returnData = queryString
        ? colorCodeList.filter((itemF: { value: string }) => itemF.value && itemF.value.indexOf(queryString) !== -1)
        : colorCodeList
      cb(returnData)
    },
    querySearchVatCode(queryString: string, cb: (params: any) => void) {
      const vatCodeList = this.$unique(
        this.storeList.map((itemM: any) => {
          return {
            value: itemM.vat_code
          }
        }),
        'value'
      )
      const returnData = queryString
        ? vatCodeList.filter((itemF: { value: string }) => itemF.value && itemF.value.indexOf(queryString) !== -1)
        : vatCodeList
      cb(returnData)
    },
    querySearchRemark(queryString: string, cb: (params: any) => void) {
      const returnData = queryString
        ? this.commonInit.remarkList.filter((itemF) => itemF.value.indexOf(queryString) !== -1)
        : this.commonInit.remarkList
      cb(returnData)
    },
    resetData() {
      this.storeEditInfo = {
        client_id: '',
        action_type: '',
        desc: '',
        complete_time: this.$getDate(new Date()),
        store_id: this.$route.params.id,
        second_store_id: '',
        child_data: []
      }
    },
    saveStoreEditInfo() {
      if (
        this.$formCheck(this.storeEditInfo, [
          {
            key: 'second_store_id',
            errMsg: '请选择二级仓库'
          },
          {
            key: 'action_type',
            errMsg: '请选择出入库类型'
          }
        ])
      ) {
        return
      }
      if (
        this.storeEditInfo.child_data.some((item: any) => {
          return this.$formCheck(item, [
            {
              key: 'name',
              errMsg: '请选择毛条名称'
            },
            {
              key: 'action_weight',
              errMsg: '请填写数量',
              regNormal: 'isNum'
            }
          ])
        })
      ) {
        return
      }
      this.loading.page = true
      this.storeEditInfo.child_data.forEach((item) => {
        item.name = item.name[1]
      })
      stock.materialCreate({ data: [this.storeEditInfo] }).then((res) => {
        if (res.data.status !== false) {
          this.$message.success('添加成功')
          this.resetData()
          this.loading.page = false
          this.getStoreInfoList()
          this.getStoreLogList()
        }
      })
    },
    // 获取出入库日志
    getStoreLogList(pages: number = 1) {
      this.loading.log = true
      stock
        .materialList({
          store_id: this.$route.params.id,
          page: pages,
          limit: this.storeLogListFilter.limit || 5,
          store_second_id: this.storeLogListFilter.LV2_name || null,
          name: this.storeLogListFilter.LV2_name || null,
          color: this.storeLogListFilter.color || null,
          attribute: this.storeLogListFilter.attr || null,
          action_type: this.storeLogListFilter.type || null,
          start_time:
            this.storeLogListFilter.time && this.storeLogListFilter.time.length > 0
              ? this.storeLogListFilter.time[0]
              : '',
          end_time:
            this.storeLogListFilter.time && this.storeLogListFilter.time.length > 0
              ? this.storeLogListFilter.time[1]
              : ''
        })
        .then((res) => {
          console.log(res)
          this.storeLogInfo = {
            total_pop: res.data.data.others_data.total_pop || 0,
            total_push: res.data.data.others_data.total_push || 0,
            list: res.data.data.data.items
          }
          this.storeLogListFilter.total = res.data.data.data.total

          this.loading.log = false
          // 更新页码
          if (pages !== this.storeLogListFilter.pages) {
            this.storeLogListFilter.pages = pages
          }
        })
    },
    // 跳转日志
    goLogEl(item: { second_store_id: number; name: string; color: string; attr: string; [key: string]: any }) {
      this.storeLogListFilter.LV2_name = item.second_store_id
      this.storeLogListFilter.name = item.name
      this.storeLogListFilter.color = item.color
      this.storeLogListFilter.attr = item.attribute
      this.$goElView('stockLogEl')
      this.getStoreLogList()
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/client',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPartyBAsync'
      },
      {
        checkWhich: 'api/materialType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getMaterialTypeAsync'
      }
    ])
    this.init()
  },
  filters: {
    filterStoreType(item: number) {
      switch (item) {
        case 1:
          return '本厂仓库'
        case 2:
          return '染厂仓库'
        default:
          return 'unknown type'
      }
    },
    filterType(item: number) {
      switch (item) {
        case 1:
          return '入库'
        case 2:
          return '出库'
        default:
          return 'unknown type'
      }
    }
  },
  computed: {
    storeListCom(): {
      reality_weight: number
      useable_weight: number
      data: object[]
    } {
      return {
        reality_weight: this.storeList.map((itemM) => +itemM.total_weight).reduce((a, b) => a + b, 0),
        useable_weight: this.storeList.map((itemM) => +itemM.use_weight).reduce((a, b) => a + b, 0),
        data: this.$mergeData(this.storeList, {
          mainRule: ['second_store_id', 'name', 'color', 'attribute'],
          otherRule: [{ name: 'second_store_name' }],
          childrenName: 'store_info',
          childrenRule: {
            mainRule: ['color_code', 'vat_code'],
            otherRule: [
              { name: 'total_weight/reality_weight', type: 'add' },
              { name: 'use_weight/useable_weight', type: 'add' }
            ]
          }
        })
      }
    },
    mat_type_list() {
      return this.$store.state.api.materialType.arr.map((item: any) => {
        return {
          value: item.id,
          label: item.name,
          children: item.child_data.map((itemChild: any) => {
            return {
              value: itemChild.id,
              label: itemChild.name
            }
          })
        }
      })
    },
    client_list() {
      return this.$store.state.api.client.arr
        .concat(this.$store.state.api.supplier.arr)
        .concat(this.$store.state.api.factory.arr)
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/store/detail.less';
</style>
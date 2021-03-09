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
              <!-- <el-select v-model="storeListFilter.isFilterZero"
                @change="getStoreInfoList"
                placeholder="请选择是否过滤库存为0的纱线">
                <el-option v-for="item in [
                    {
                      id:1,
                      value:false,
                      label:'否'
                    },
                    {
                      id:2,
                      value:true,
                      label:'是'
                    }
                  ]"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr"
              @click="resetFilter(1)">重置</div>
          </div>
        </div>
        <div class="tableCtn"
          v-loading='!loading.page && loading.info'>
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">二级名称</div>
              <div class="tcolumn">纱线名称</div>
              <div class="tcolumn">纱线颜色</div>
              <div class="tcolumn">属性</div>
              <div class="tcolumn noPad flex5">
                <div class="trow">
                  <div class="tcolumn">纱线色号</div>
                  <div class="tcolumn">批/缸号</div>
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
              <div class="tcolumn">{{item.color}}</div>
              <div class="tcolumn">{{item.attribute}}</div>
              <div class="tcolumn noPad flex5">
                <div class="trow"
                  v-for="(itemStore,indexStore) in item.store_info"
                  :key="indexStore">
                  <div class="tcolumn">{{itemStore.color_code || '-'}}</div>
                  <div class="tcolumn">{{itemStore.vat_code || '-'}}</div>
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
              <div class="tcolumn"></div>
              <div class="tcolumn"></div>
              <div class="tcolumn noPad flex5">
                <div class="trow">
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
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
            v-for="(itemStore,indexStore) in storeEditInfo"
            :key="indexStore">
            <span class="el-icon-circle-close"
              @click="deleteItem({data:storeEditInfo,index:indexStore})"></span>
            <div class="eRow">
              <div class="eColumn">
                <span class="label isMust">二级仓库</span>
                <div class="from">
                  <el-select v-model="itemStore.LV2_name"
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
                <span class="label isMust">出入库类型</span>
                <div class="from">
                  <el-select v-model="itemStore.type"
                    placeholder="请选择出入库类型">
                    <el-option v-for="item in commonInit.typeArr"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="eRow">
              <div class="eColumn">
                <span class="label isMust">纱线名称</span>
                <div class="from">
                  <el-cascader v-model="itemStore.name"
                    filterable
                    :props="{
                        value:'label'
                      }"
                    placeholder="请选择出入库的纱线"
                    :options="commonInit.yarnList"></el-cascader>
                </div>
              </div>
              <div class="eColumn">
                <span class="label isMust">纱线颜色</span>
                <div class="from">
                  <el-autocomplete v-model="itemStore.color"
                    :fetch-suggestions="querySearchColor"
                    placeholder="请输入纱线颜色"></el-autocomplete>
                </div>
              </div>
              <div class="eColumn">
                <span class="label isMust">纱线属性</span>
                <div class="from">
                  <el-select v-model="itemStore.attr"
                    clearable
                    placeholder="请选择纱线属性">
                    <el-option v-for="item in commonInit.materialAttrArr"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="eRow">
              <div class="eColumn">
                <div class="eRow innerEl">
                  <div class="eColumn flexMode">
                    <span class="label">色号</span>
                    <div class="from">
                      <el-autocomplete v-model="itemStore.color_code"
                        :fetch-suggestions="querySearchColorCode"
                        placeholder="请输入纱线色号"></el-autocomplete>
                    </div>
                  </div>
                  <div class="eColumn flexMode">
                    <span class="label">批/缸号</span>
                    <div class="from">
                      <el-autocomplete v-model="itemStore.vat_code"
                        :fetch-suggestions="querySearchVatCode"
                        placeholder="请输入纱线批/缸号"></el-autocomplete>
                    </div>
                  </div>
                </div>
              </div>
              <div class="eColumn">
                <span class="label isMust">出入库数量</span>
                <div class="from">
                  <el-input v-model="itemStore.weight"
                    placeholder="请输入出入库数量">
                    <template slot="append">kg</template>
                  </el-input>
                </div>
              </div>
              <div class="eColumn">
                <span class="label isMust">出入库说明</span>
                <div class="from">
                  <el-autocomplete v-model="itemStore.remark"
                    :fetch-suggestions="querySearchRemark"
                    placeholder="请输入出入库说明"></el-autocomplete>
                </div>
              </div>
            </div>
          </div>
          <div class="editBtnCtn"
            v-if="storeEditInfo.length > 0">
            <div class="editBtn btnGray"
              @click="deleteItem({data:storeEditInfo,type:'cancel'})">取消</div>
            <div class="editBtn btnBluePurple"
              @click="addItem({data:storeEditInfo,type:'add'})">添加下一组</div>
            <div class="editBtn btnGreen"
              @click="saveStoreEditInfo">提交</div>
          </div>
          <div class="editBtnCtn"
            v-else>
            <div class="editBtn btnBluePurple"
              @click="addItem({data:storeEditInfo,type:'add'})">添加新库存</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">出入库日志</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn"
          :class="{'showMore':true}">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <!-- <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div> -->
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
                @change="getStoreLogList(1)"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择操作时间筛选">
              </el-date-picker>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr"
              @click="resetFilter(2)">重置</div>
          </div>
        </div>
        <div class="tableCtn noBorder"
          id="stockLogEl"
          v-loading='!loading.page && loading.log'>
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">仓库</div>
              <div class="tcolumn">纱线名称</div>
              <div class="tcolumn">纱线颜色</div>
              <div class="tcolumn">属性</div>
              <div class="tcolumn">纱线色号</div>
              <div class="tcolumn">批/缸号</div>
              <div class="tcolumn">关联单号</div>
              <div class="tcolumn">类型</div>
              <div class="tcolumn">出入库数量(KG)</div>
              <div class="tcolumn">出入库备注</div>
              <div class="tcolumn">操作时间</div>
              <div class="tcolumn">操作人</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in storeLogInfo.list"
              :key="item.id">
              <div class="tcolumn">{{item.store_name}}</div>
              <div class="tcolumn">{{item.name}}</div>
              <div class="tcolumn">{{item.color}}</div>
              <div class="tcolumn">{{item.attribute}}</div>
              <div class="tcolumn">{{item.color_code}}</div>
              <div class="tcolumn">{{item.vat_code}}</div>
              <div class="tcolumn">{{item.order_code || '/'}}</div>
              <div :class="`tcolumn ${item.action_type === 1 && 'green ' || ''}${item.action_type === 2 && 'orange' || ''}`">
                {{item.action_type|filterType}}
              </div>
              <div :class="`tcolumn ${item.action_type === 1 && 'green ' || ''}${item.action_type === 2 && 'orange' || ''}`">
                {{`${item.action_type === 1 && '+ ' || ''}${item.action_type === 2 && '-' || ''}`}}
                {{$formatNum(item.action_weight)}}
              </div>
              <div class="tcolumn">{{item.desc}}</div>
              <div class="tcolumn">{{$getDate(item.create_time)}}</div>
              <div class="tcolumn">{{item.user_name}}</div>
            </div>
          </div>
          <div class="tpage">
            <div class="leftInfo">
              <div class="item">
                <span class="label">合计入库：</span>
                <span class="blue">{{$formatNum(storeLogInfo.total_push)}}KG</span>
              </div>
              <div class="item">
                <span class="label">合计出库：</span>
                <span class="orange">{{$formatNum(storeLogInfo.total_pop)}}KG</span>
              </div>
            </div>
            <el-pagination background
              :current-page.sync="storeLogListFilter.pages"
              @current-change="getStoreLogList"
              :page-size="storeLogListFilter.limit || 5"
              layout="prev, pager, next"
              :total="storeLogListFilter.total">
            </el-pagination>
          </div>
        </div>
        <!-- <div class="pageCtn">
          <el-pagination background
            current-page.sync="1"
            @current-change="getStoreLogList"
            :page-size="storeLogListFilter.limit || 10"
            layout="prev, pager, next"
            :total="30">
          </el-pagination>
        </div> -->
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
    [propName: string]: any
  } {
    return {
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
      storeEditInfo: [],
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
        limit: '',
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
          id: Number(this.$route.params.storeId)
        }),
        product.list(),
        yarnColor.list()
      ]).then((res) => {
        console.log(res)
        this.loading.page = false
        this.storeDetail = res[0].data.data
        // *** 初始化公共数据 ***
        // 初始化纱线列表
        this.commonInit.yarnList = this.$mergeData(res[1].data.data.items, {
          mainRule: 'yarn_type/value',
          otherRule: [{ name: 'yarn_type_name/label' }],
          childrenName: 'children',
          childrenRule: {
            otherRule: [{ name: 'name/label' }, { name: 'id/value' }]
          }
        })
        // 初始化纱线颜色
        this.commonInit.yarnColorList = res[2].data.data.map((itemM: any) => ({ value: itemM.name, id: itemM.id }))
      })
      this.getStoreInfoList()
      this.getStoreLogList()
    },
    getStoreInfoList() {
      this.loading.info = true
      store
        .detailYarnList({
          store_id: this.$route.params.storeId,
          second_store_id: this.storeListFilter.LV2_name || null,
          name: this.storeListFilter.name || null,
          color: this.storeListFilter.color || null,
          weight: this.storeListFilter.isFilterZero ? 0 : null
        })
        .then((res) => {
          this.storeList = res.data.data
          this.loading.info = false
        })
      // stock
      //   .list({
      //     store_second_id:this.storeListFilter.LV2_name || null,
      //     name: this.storeListFilter.name || null,
      //     attribute:this.storeListFilter.attr||null,
      //     color:this.storeListFilter.color || null,
      //   })
      //   .then((res: any) => {
      //     if (res.data.staus !== false) {
      //       this.storeList = res.data.data.items
      //       this.total = res.data.data.total
      //       this.loading = false
      //       // 更新页码
      //       if (pages !== this.page) {
      //         this.page = pages
      //       }
      //     }
      //   })
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
          limit: '',
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
      this.$goElView('stockEditEl')
      const findName: any = this.commonInit.yarnList.find((itemF: any) =>
        itemF.children.find((itemFC: any) => itemFC.label === item1.name)
      )
      this.storeEditInfo.push({
        LV2_name: item1.second_store_id,
        type,
        name: (findName && [findName.label, item1.name]) || '',
        color: item1.color,
        attr: item1.attribute,
        color_code: item2.color_code,
        vat_code: item2.vat_code,
        weight: '',
        remark: ''
      })
    },
    addItem({ data, item, type = 'add' }: { data: object[]; type: 'add' | 'copy'; item: object }) {
      if (type === 'copy') {
        data.push(this.$clone(item))
        return
      }
      data.push({
        LV2_name: '',
        type: '',
        name: '',
        color: '',
        attr: '',
        color_code: '',
        vat_code: '',
        weight: '',
        remark: ''
      })
    },
    deleteItem({
      data,
      index,
      type = 'deleteIndex'
    }: {
      data: object[]
      index: number
      type: 'cancel' | 'deleteIndex'
    }) {
      if (type === 'cancel') {
        data.splice(0)
      } else if (type === 'deleteIndex') {
        data.splice(index, 1)
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
    saveStoreEditInfo() {
      const flagCollection = {
        LV2_name: true,
        type: true,
        name: true,
        color: true,
        attr: true,
        weight: true,
        remark: true
      }
      const data = this.storeEditInfo.map((itemM: any) => {
        if (!itemM.LV2_name) {
          flagCollection.LV2_name = false
        }
        if (!itemM.type) {
          flagCollection.type = false
        }
        if (!itemM.name[1]) {
          flagCollection.name = false
        }
        if (!itemM.color) {
          flagCollection.color = false
        }
        if (!itemM.attr) {
          flagCollection.attr = false
        }
        if (!itemM.weight) {
          flagCollection.weight = false
        }
        if (!itemM.remark) {
          flagCollection.remark = false
        }
        return {
          store_id: this.$route.params.storeId,
          second_store_id: itemM.LV2_name,
          name: itemM.name[1],
          action_type: itemM.type,
          action_weight: itemM.weight,
          color: itemM.color,
          attribute: itemM.attr,
          color_code: itemM.color_code || 'NOT_SET',
          vat_code: itemM.vat_code || 'NOT_SET',
          desc: itemM.remark
        }
      })
      if (!flagCollection.LV2_name) {
        this.$message.warning('检测到存在未选择的二级仓库名称')
        return
      }
      if (!flagCollection.type) {
        this.$message.warning('检测到存在未选择的出入库类型')
        return
      }
      if (!flagCollection.name) {
        this.$message.warning('检测到存在未选择的纱线名称')
        return
      }
      if (!flagCollection.color) {
        this.$message.warning('检测到存在未填写的纱线颜色')
        return
      }
      if (!flagCollection.attr) {
        this.$message.warning('检测到存在未选择的纱线属性')
        return
      }
      if (!flagCollection.weight) {
        this.$message.warning('检测到存在未填写的出入库数量')
        return
      }
      if (!flagCollection.remark) {
        this.$message.warning('检测到存在未填写的出入库说明')
        return
      }
      // stock.create({ data }).then((res) => {
      //   if (res.data.status !== false) {
      //     this.$message.success('添加成功')
      //     this.storeEditInfo = []
      //     this.getStoreInfoList()
      //     this.getStoreLogList()
      //   }
      // })
    },
    // 获取出入库日志
    getStoreLogList(pages: number = 1) {
      this.loading.log = true
      stock
        .list({
          store_id: this.$route.params.storeId,
          page: pages,
          limit: this.storeLogListFilter.limit || 5,
          store_second_id: this.storeLogListFilter.LV2_name || null,
          name: this.storeLogListFilter.LV2_name || null,
          color: this.storeLogListFilter.color || null,
          attribute: this.storeLogListFilter.attr || null,
          action_type: this.storeLogListFilter.type || null,
          start_time: this.storeLogListFilter.time || null,
          end_time: this.storeLogListFilter.time || null
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
      this.$goElView('stockLogEl')
      this.storeLogListFilter.LV2_name = item.second_store_id
      this.storeLogListFilter.name = item.name
      this.storeLogListFilter.color = item.color
      this.storeLogListFilter.attr = item.attribute
      this.getStoreLogList()
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route() {
      this.init()
    }
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
      // let computedData: Array<any> = this.$clone(this.storeList)
      // if (this.storeListFilter.LV2_name) {
      //   computedData = computedData.filter((itemF: any) => +itemF.store_second_id === +this.storeListFilter.LV2_name)
      // }
      // if (this.storeListFilter.name) {
      //   computedData = computedData.filter((itemF: any) => itemF.name.indexOf(this.storeListFilter.name) !== -1)
      // }
      // if (this.storeListFilter.color) {
      //   computedData = computedData.filter((itemF: any) => itemF.color.indexOf(this.storeListFilter.color) !== -1)
      // }
      // if (this.storeListFilter.isFilterZero) {
      //   computedData = computedData.filter((itemF: any) => itemF.total_weight > 0 || itemF.use_weight > 0)
      // }
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
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/store/detail.less';
</style>
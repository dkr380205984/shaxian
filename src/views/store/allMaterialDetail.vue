<template>
  <div class="indexMain"
    id="storeDetail"
    v-loading='loading.page'>
    <div class="module">
      <div class="titleCtn">
        <span class="title">库存信息</span>
        <!-- <span class="addBtn btn btnMain"
          @click="openStore">新增出入库</span> -->
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-cascader v-model="storeListFilter.LV2_name"
                :options="store_list"
                @change="getStoreInfoList"
                :props="{value:'id',label:'name',children:'second_data'}"
                placeholder="请选择仓库">
              </el-cascader>
            </div>
            <div class="elCtn">
              <el-input v-model="storeListFilter.name"
                @change="getStoreInfoList"
                placeholder="请输入毛条名称"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="storeListFilter.batch_code"
                @change="getStoreInfoList"
                placeholder="请输入入库批号"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="storeListFilter.attribute"
                @change="getStoreInfoList"
                placeholder="请输入毛条属性"></el-input>
            </div>
            <div class="elCtn">
              <el-checkbox v-model="storeListFilter.isFilterZero"
                @change="getStoreInfoList">过滤库存为0的毛条</el-checkbox>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr"
              @click="resetFilter(1)">重置</div>
          </div>
        </div>
        <div class="filterCtn" style="margin-top: 20px">
          <div class="leftCtn"></div>
          <div class="rightCtn">
            <div class="btnC">
              <div class="btn backHoverBlue" @click="goStore(3)">盘点移库</div>
              <div class="btn backHoverOrange" @click="goStore(2)">盘点出库</div>
              <div class="btn backHoverGreen" @click="goStore(1)">盘点入库</div>
              <div class="btn backHoverGreen" @click="showAddPO = true">采购并入库</div>
              <!-- <div class="btn backHoverBlue" @click="yarnFlag = true">合并纱线</div> -->
              <!-- <div class="btn backHoverOrange" @click="$router.push('/order/salesOrderCreate')">销售并出库</div> -->
              <!-- <div class="btn backHoverOrange" @click="create_flag = true">出库并加工</div> -->
            </div>
          </div>
        </div>
        <div class="checkCtn">
          <div class="label">已勾选单据：</div>
          <div class="elCtn check" v-for="(item, index) in selectList" :key="item.id">
            <el-input :value="item.name" disabled>
              <template slot="append">
                <i class="el-icon-close hoverRed" style="cursor: pointer" @click="selectList.splice(index, 1)"></i>
              </template>
            </el-input>
          </div>
        </div>
        <div class="tableCtn"
          style="margin:24px 0"
          v-loading='!loading.page && loading.info'>
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">仓库名称</div>
              <div class="tcolumn">毛条名称</div>
              <div class="tcolumn">毛条属性</div>
              <div class="tcolumn noPad flex5">
                <div class="trow">
                  <div class="tcolumn">批号</div>
                  <div class="tcolumn">实际库存(KG)</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in storeListCom.data"
              :key="item.id">
              <div class="tcolumn">{{item.store_name}}/{{item.second_store_name}}</div>
              <!-- <div class="tcolumn">{{item.name}}</div> -->
              <div
                class="tcolumn"
                style="cursor: pointer"
                @click="
                  item.checked = !item.checked
                  checkChange(item.checked, item)
                  $forceUpdate()
                "
              >
                <div>
                  <el-checkbox style="width: 15%" v-model="item.checked"></el-checkbox>
                  <span style="width: 85%">{{ item.name }}</span>
                </div>
              </div>
              <div class="tcolumn">{{item.attribute || '无'}}</div>
              <div class="tcolumn noPad flex5">
                <div class="trow"
                  v-for="(itemStore,indexStore) in item.store_info"
                  :key="indexStore">
                  <div class="tcolumn">{{itemStore.batch_code}}</div>
                  <div class="tcolumn">{{itemStore.reality_weight && $formatNum(itemStore.reality_weight) || '-'}}</div>
                  <div class="tcolumn flexRow">
                    <span class="opr green"
                      @click="goLogEl(item)">日志</span>
                    <span style="margin: 0 6px" class="opr green" @click="openStore(1, item, indexStore)">入库</span>
                    <span style="margin: 0 6px" class="opr red" @click="openStore(2, item, indexStore)">出库</span>
                    <span style="margin: 0 6px" class="opr blue" @click="openStore(3, item, indexStore)">移库</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow bgGray noBorder">
              <div class="tcolumn">合计</div>
              <div class="tcolumn"></div>
              <div class="tcolumn noPad flex5">
                <div class="trow">
                  <div class="tcolumn"></div>
                  <div class="tcolumn">{{$formatNum($toFixed(storeListCom.reality_weight))}}</div>
                  <div class="tcolumn"></div>
                </div>
              </div>
            </div>
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
        <div class="filterCtn showMore">
          <div class="leftCtn" style="padding:unset;max-width: unset;">
            <div class="label">筛选条件：</div>
            <!-- <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div> -->
            <div class="elCtn">
              <el-cascader v-model="storeLogListFilter.LV2_name"
                :options="store_list"
                @change="getStoreLogList(1)"
                :props="{value:'id',label:'name',children:'second_data'}"
                placeholder="请选择仓库">
              </el-cascader>
            </div>
            <div class="elCtn">
              <el-input v-model="storeLogListFilter.name"
                @change="getStoreLogList(1)"
                placeholder="请输入毛条名称"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="storeLogListFilter.attribute"
                @change="getStoreLogList(1)"
                placeholder="请输入毛条属性"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="storeLogListFilter.batch_code"
                @change="getStoreLogList(1)"
                placeholder="请输入入库批号"></el-input>
            </div>
            <div class="elCtn">
              <el-select
                v-model="storeLogListFilter.type"
                clearable
                @change="getStoreLogList(1)"
                placeholder="选择操作类型"
              >
                <el-option
                  v-for="item in commonInit.typeArr"
                  :key="item.id + item.name"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-input v-model="storeLogListFilter.code"
                @change="getStoreLogList(1)"
                placeholder="请输入单号"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="storeLogListFilter.limit"
                clearable
                @change="getStoreLogList(1)"
                placeholder="每页展示条数（默认10）">
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
          <div class="rightCtn" style="min-width:94px">
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
                <div class="tcolumn"
                  style="flex:2">出入库信息</div>
                <div class="tcolumn noPad"
                  style="flex:3">
                  <div class="trow">
                    <div class="tcolumn">毛条名称</div>
                    <div class="tcolumn">属性</div>
                    <div class="tcolumn">数量</div>
                    <div class="tcolumn">批号</div>
                  </div>
                </div>
                <div class="tcolumn">操作人</div>
                <div class="tcolumn">日期</div>
                <div class="tcolumn">操作</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="item in  storeLogInfo.list"
                :key="item.id">
                <div class="tcolumn">{{item.code}}</div>
                <div class="tcolumn"
                  :class="{'blue':item.action_type===1||item.action_type===3||item.action_type===5||item.action_type===8||item.action_type===11,'green':item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7||item.action_type===9||item.action_type===10}">{{item.action_type|stockTypeFilter}}</div>
                <div class="tcolumn"
                  style="flex:2">
                  <span v-if="item.action_type===1||item.action_type===3||item.action_type===5||item.action_type===8">
                    <span class="green">{{item.client_name ||'无来源'}}</span>
                    <i class="el-icon-s-unfold orange"
                      style="margin:0 5px;font-size:16px"></i>
                    <span class="blue">{{item.second_store_name}}</span>
                  </span>
                  <span v-if="item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7||item.action_type===9||item.action_type === 16">
                    <span class="blue">{{item.second_store_name}}</span>
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
                <div class="tcolumn noPad"
                  style="flex:3">
                  <div class="trow"
                    v-for="(itemChilid,indexChild) in item.child_data"
                    :key="indexChild">
                    <div class="tcolumn">{{itemChilid.name}}</div>
                    <div class="tcolumn">{{itemChilid.attribute || '无'}}</div>
                    <div class="tcolumn"
                      :class="{'blue':item.action_type===1||item.action_type===3||item.action_type===5,'green':item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7}">{{itemChilid.action_weight}}</div>
                    <div class="tcolumn">{{itemChilid.batch_code}}</div>
                  </div>
                </div>
                <div class="tcolumn">{{item.user_name}}</div>
                <div class="tcolumn">{{item.complete_time}}</div>
                <div class="tcolumn" style="flex-direction: row;align-items:center">
                  <span class="blue opr"
                    style="cursor: pointer"
                    @click="$openUrl(`/print/materialStore/${ (item.action_type===1||item.action_type===3||item.action_type===5) ?  1 : 2}/${item.id}${(item.order_id && ('?orderId=' + item.order_id)) || ''}`)">打印</span>
                  <span class="red opr" @click="deleteLog(item.id)">删除</span>
                </div>
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
    <!-- 仓库列表 -->
    <div class="popup" v-show="lookListFlag">
      <div class="main" style="width: 1200px">
        <div class="titleCtn">
          <span class="text">仓库列表</span>
          <div class="closeCtn" @click="lookListFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="listCtn">
          <div class="list" v-loading="storeLoading">
            <div class="headCtn">
              <div class="row title">
                <div class="column">仓库名称</div>
                <div class="column">当前库存总数量(Kg)</div>
                <div class="column">仓库管理员</div>
                <div class="column">仓库备注</div>
                <div class="column">操作</div>
              </div>
            </div>
            <div class="bodyCtn">
              <div class="row" v-for="item in storeInfoList" :key="item.id + 'sss' + item.name">
                <div class="column">{{ item.name }}</div>
                <div class="column">{{ item.total_weight || 0 }}Kg</div>
                <div class="column">{{ item.admins.map((itemM) => itemM.name).join(',') }}</div>
                <div class="column">{{ item.desc }}</div>
                <div class="column">
                  <div class="opr hoverBlue" @click="$router.push(`/store/materialDeatail/${item.id}`)">详情</div>
                  <div class="opr hoverRed" @click="deleteStore(item)">删除</div>
                  <div class="opr hoverOrange" @click="changeStore(item)">修改</div>
                </div>
              </div>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination
              background
              :page-size="5"
              layout="prev, pager, next"
              :total="storeTotal"
              :current-page.sync="storePage"
              @current-change="getStoreList"
            >
            </el-pagination>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn" style="margin-right: 20px" @click="lookListFlag = false">关闭</span>
        </div>
      </div>
    </div>
    <div class="popup" v-show="addFlag">
      <div class="main">
        <div class="titleCtn">
          <div class="text">{{ (createOrEditStoreObj.id && '修改') || '新增' }}仓库</div>
          <i class="close_icon el-icon-close" @click="addFlag = false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label isMust">仓库名称：</div>
            <div class="info">
              <el-input placeholder="请输入加仓库名称" v-model="createOrEditStoreObj.name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">仓库类型：</div>
            <div class="info">
              <el-select v-model="createOrEditStoreObj.type" placeholder="请选择仓库类型">
                <el-option
                  v-for="item in typeArr"
                  :key="item.id + 'storeType' + item.name"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">仓库管理员：</div>
            <div class="info">
              <el-select v-model="createOrEditStoreObj.admins" multiple placeholder="请选择仓库管理员">
                <el-option
                  v-for="item in user_list"
                  :key="item.id + 'storeAdmin' + item.name"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row" v-for="(itemLV2, indexLV2) in createOrEditStoreObj.LV2_info" :key="indexLV2 + 'indexLV2'">
            <div :class="`label ${indexLV2 === 0 ? 'isMust' : ''}`">{{ (indexLV2 === 0 && '二级仓库名：') || '' }}</div>
            <div class="info">
              <el-input placeholder="请输入二级仓库名称" v-model="itemLV2.name"></el-input>
              <span
                class="info_btn blue"
                v-if="indexLV2 === 0"
                @click="$addItem(createOrEditStoreObj.LV2_info, { name: '', id: null })"
                >添加</span
              >
              <span
                class="info_btn red"
                v-else
                @click="
                  itemLV2.id
                    ? deleteSecondStore(itemLV2.id, createOrEditStoreObj.LV2_info, indexLV2)
                    : $deleteItem(createOrEditStoreObj.LV2_info, indexLV2)
                "
                >删除</span
              >
            </div>
          </div>
          <div class="row">
            <div class="label">仓库备注：</div>
            <div class="info">
              <el-input
                placeholder="请输入仓库备注"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="createOrEditStoreObj.desc"
              ></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr" @click="addFlag = false">取消</div>
          <div class="opr blue" @click="saveStore">保存</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn" style="float: left">
          <div
            class="btn backHoverGreen"
            @click="
              getStoreList()
              lookListFlag = true
            "
          >
            仓库列表
          </div>
          <div class="btn backHoverBlue" @click="changeStore()">添加仓库</div>
        </div>
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnMain"
            @click="exportExcel(1)">导出库存日志</div>
          <div class="btn btnMain"
            @click="exportExcel(2)">导出库存数量</div>
        </div>
      </div>
    </div>
    <in-and-out-mat
      :noChange="true"
      :type="1"
      :firstStoreId="firstStoreId"
      :initData="initData"
      :show.sync="showIn"
      @close="init"
    ></in-and-out-mat>
    <in-and-out-mat
      :noChange="true"
      :type="2"
      :firstStoreId="firstStoreId"
      :initData="initData"
      :show.sync="showOut"
      @close="init"
    ></in-and-out-mat>
    <in-and-out-mat
      :noChange="true"
      :type="10"
      :firstStoreId="firstStoreId"
      :initData="initData"
      :show.sync="showMove"
      @close="init"
    ></in-and-out-mat>
    <in-and-out-mat :noChange="false"
      :firstStoreId="$route.params.id"
      :show.sync="show_store"></in-and-out-mat>
    <materialAddPO
      :show="showAddPO"
      @close="resetInfo"
      :info="order_yarn_info"
      @afterCreate="init"
    ></materialAddPO>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { StoreDetail, Store } from '@/types/common'
import { store, stock } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    storeDetail: StoreDetail
    storeList: Array<{
      [key: string]: any
    }>
    commonInit: {
      typeArr: Array<{ id: number; name: string }>
    }
    [propName: string]: any
  } {
    return {
      show_store: false,
      showMore: false,
      addFlag: false,
      lookListFlag: false,
      storeLoading: false,
      showAddPO: false,
      storeInfoList: [],
      selectList: [],
      storeTotal: 1,
      storePage: 1,
      firstStoreId: '',
      initData: [],
      showIn: false,
      showOut: false,
      showMove: false,
      loading: {
        page: false,
        info: true,
        log: true
      },
      order_yarn_info: {
        order_id: '',
        client_id: '',
        total_price: '',
        child_data: [
          {
            name: '',
            weight: '',
            attribute: '',
            price: ''
          }
        ],
        order_time: this.$getDate(new Date()),
        delivery_time: '',
        additional_fee: [
          {
            name: '',
            price: '',
            desc: ''
          }
        ],
        total_additional_fee: 0,
        file_url: '',
        desc: ''
      },
      createOrEditStoreObj: {
        store_type: 2,
        id: null,
        name: '',
        type: 1,
        admins: [],
        LV2_info: [{ name: '', id: null }],
        desc: ''
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
        attribute: '',
        batch_code: '',
        isFilterZero: true,
        page: 1,
        total: 1
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
        attribute: '',
        batch_code: '',
        attr: '',
        type: '',
        code: '',
        limit: 10,
        pages: 1,
        total: 1,
        time: ''
      },
      typeArr: [
        {
          id: 1,
          name: '本厂仓库'
        },
        {
          id: 2,
          name: '纺厂仓库'
        }
      ],
      // 初始化公共数据
      commonInit: {
        typeArr: [
          {
            id: 1,
            name: '仓库入库'
          },
          {
            id: 2,
            name: '仓库出库'
          },
          {
            id: 3,
            name: '采购入库'
          },
          {
            id: 4,
            name: '调取出库'
          },
          {
            id: 5,
            name: '加工回库'
          },
          {
            id: 6,
            name: '加工出库'
          },
          {
            id: 8,
            name: '工艺单入库'
          },
          {
            id: 9,
            name: '订单发货'
          },
          {
            id: 10,
            name: '移库出库'
          },
          {
            id: 11,
            name: '移库入库'
          },
          {
            id: 16,
            name: '加工调取'
          },
          {
            id: 17,
            name: '加工回库'
          }
        ],
      },
    }
  },

  methods: {
    init() {
      this.firstStoreId = ''
      this.selectList = []
      this.initData = []
      this.getStoreInfoList()
      this.getStoreLogList()
    },
    getStoreInfoList() {
      this.loading.info = true
      store
        .detailMateiralList({
          store_id: this.storeListFilter.LV2_name ? this.storeListFilter.LV2_name[0] : '',
          second_store_id: this.storeListFilter.LV2_name ? this.storeListFilter.LV2_name[1] : '',
          name: this.storeListFilter.name || null,
          color: this.storeListFilter.color || null,
          attribute: this.storeListFilter.attribute || null,
          batch_code: this.storeListFilter.batch_code || null,
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
          attribute: '',
          batch_code: '',
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
          attribute: '',
          batch_code: '',
          attr: '',
          type: '',
          code: '',
          limit: 10,
          pages: 1,
          total: 1,
          time: ''
        }
        this.getStoreLogList()
      } else {
        this.$message.warning('未知重置错误')
      }
    },
    resetInfo(){
      this.order_yarn_info = {
        order_id: '',
        client_id: '',
        total_price: '',
        child_data: [
          {
            name: '',
            weight: '',
            attribute: '',
            price: ''
          }
        ],
        order_time: this.$getDate(new Date()),
        delivery_time: '',
        additional_fee: [
          {
            name: '',
            price: '',
            desc: ''
          }
        ],
        total_additional_fee: 0,
        file_url: '',
        desc: ''
      }
      this.showAddPO = false
    },
    // 获取出入库日志
    getStoreLogList(pages: number = 1) {
      this.loading.log = true
      stock
        .materialList({
          page: pages,
          limit: this.storeLogListFilter.limit || 10,
          store_id: this.storeLogListFilter.LV2_name ? this.storeLogListFilter.LV2_name[0] : '',
          store_second_id: this.storeLogListFilter.LV2_name ? this.storeLogListFilter.LV2_name[1] : '',
          name: this.storeLogListFilter.name || null,
          attribute: this.storeLogListFilter.attribute || null,
          action_type: this.storeLogListFilter.type || null,
          code: this.storeLogListFilter.code || null,
          batch_code: this.storeLogListFilter.batch_code || null,
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
          // console.log(res)
          this.storeLogInfo = {
            total_pop: res.data.data.additional.total_pop || 0,
            total_push: res.data.data.additional.total_push || 0,
            list: res.data.data.items
          }
          this.storeLogListFilter.total = res.data.data.total

          this.loading.log = false
          // 更新页码
          if (pages !== this.storeLogListFilter.pages) {
            this.storeLogListFilter.pages = pages
          }
        })
    },
    deleteLog(id: number) {
      this.$confirm('是否删除该日志，这可能会导致相关库存变动?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          stock.materialDelete({ id }).then((res) => {
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
    checkChange(val: boolean, itemInfo: any) {
      if (val) {
        itemInfo.id =
          '' + itemInfo.store_id + itemInfo.second_store_id + itemInfo.name
        // console.log(itemInfo)
        const index = this.selectList.map((item: any) => item.id).indexOf(itemInfo.id)
        if (index === -1) {
          this.selectList.push(itemInfo)
        }
      } else {
        const index = this.selectList.map((item: any) => item.id).indexOf(itemInfo.id)
        if (index !== -1) {
          this.selectList.splice(index, 1)
        }
      }

      this.$forceUpdate()
    },
    goStore(type: number) {
      if (type === 1) {
        // 入库
        this.showIn = true
        return
      }
      const arr = this.$mergeData(this.selectList, {
        mainRule: ['store_id', 'second_store_id'],
        childrenName: 'store_info'
      })
      if (arr.length === 0) {
        this.$message.error('请先选择毛条，在进行出入库操作')
        return
      }
      if (arr.length > 1) {
        this.$message.error('不能同时选择两个二级仓库的纱线进行出入库，请重新选择')
        return
      }

      arr[0].store_info.forEach((item: any) => {
        item.store_id = arr[0].store_id
        item.second_store_id = arr[0].second_store_id
      })

      if (type === 2) {
        // 出库
        this.initData = arr[0].store_info
        this.showOut = true
        this.firstStoreId = arr[0].store_id
      } else if (type === 3) {
        // 移库
        this.initData = arr[0].store_info
        this.showMove = true
        this.firstStoreId = arr[0].store_id
      }
    },
    changeStore(item: Store) {
      this.addFlag = true
      this.createOrEditStoreObj = {
        store_type: 2,
        id: (item && item.id) || null,
        name: (item && item.name) || '',
        type: (item && item.type) || 1,
        admins: (item && item.admins.map((itemM: any) => itemM.user_id)) || [],
        LV2_info: (item && item.LV2_info) || [{ name: '', id: null }],
        desc: (item && item.desc) || ''
      }
    },
    deleteStore(item: Store) {
      this.$confirm('此操作将删除该仓库, 是否继续?（注：已有库存日志将无法删除）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store
          .delete({
            id: item.id
          })
          .then((res: any) => {
            if (res.data.status !== false) {
              this.$message({
                type: 'success',
                message: `删除成功!`
              })
              this.getStoreList()
            }
          })
      })
    },
    saveStore() {
      if (this.$submitLock()) {
        return
      }
      if (!this.createOrEditStoreObj.name) {
        this.$message.warning('请输入仓库名称')
        return
      }
      if (!this.createOrEditStoreObj.type) {
        this.$message.warning('请选择仓库类型')
        return
      }
      const LV2Name = this.createOrEditStoreObj.LV2_info.filter((itemF: any) => !itemF.name) // 筛选出名字为false
      if (LV2Name.length > 0) {
        this.$message.warning('请输入二级仓库名称')
        return
      }
      store
        .create({
          store_type: 2,
          id: this.createOrEditStoreObj.id || null,
          name: this.createOrEditStoreObj.name,
          type: this.createOrEditStoreObj.type,
          manager_data: this.createOrEditStoreObj.admins,
          second_data: this.createOrEditStoreObj.LV2_info,
          desc: this.createOrEditStoreObj.desc
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            this.$message.success(`${(this.createOrEditStoreObj.id && '修改') || '添加'}成功`)
            this.addFlag = false
            this.getStoreList()
          }
        })
    },
    getStoreList(){
      this.storeLoading = true
      store
        .list({
          limit: 5,
          page: this.storePage,
          store_type: 2,
          name: null,
          type: null
        })
        .then((res: any) => {
          if (res.data.staus !== false) {
            this.storeInfoList = res.data.data.items.map((itemM: any) => {
              return {
                id: itemM.id,
                name: itemM.name,
                type: itemM.type,
                admins: itemM.manager_data,
                LV2_info: itemM.second_data.map((itemS: any) => ({ id: itemS.id, name: itemS.name })),
                total_weight: itemM.store,
                desc: itemM.desc
              }
            })
            this.storeTotal = res.data.data.total
            this.storeLoading = false
          }
        })
    },
    // 跳转日志
    goLogEl(item: { second_store_id: number; name: string; attribute: string; attr: string; [key: string]: any }) {
      this.storeLogListFilter.LV2_name = [item.store_id, item.second_store_id]
      this.storeLogListFilter.name = item.name
      this.storeLogListFilter.attribute = item.attribute
      this.$goElView('stockLogEl')
      this.getStoreLogList()
    },
    openStore(type: number, item: any, index: number) {
      let obj = this.$clone(item)
      obj.store_info = [item.store_info[index]]
      this.initData = [obj]
      this.firstStoreId = item.store_id
      if (type === 1) {
        // 入库
        this.showIn = true
      } else if (type === 2) {
        // 出库
        this.showOut = true
      } else if (type === 3) {
        // 移库
        this.showMove = true
      }
      // this.show_store = true
    },
    exportExcel(type: number) {
      if (type === 1) {
        stock.materialExcelOfLog().then((res) => {
          // 创建a标签
          const link = document.createElement('a')
          // download属性
          link.setAttribute('download', '库存日志')
          // href链接
          link.setAttribute('href', res.data.data)
          // 自执行点击事件
          link.click()
          document.body.removeChild(link)
        })
      } else {
        stock.materialExcelOfAll().then((res) => {
          // 创建a标签
          const link = document.createElement('a')
          // download属性
          link.setAttribute('download', '库存数量')
          // href链接
          link.setAttribute('href', res.data.data)
          // 自执行点击事件
          link.click()
          document.body.removeChild(link)
        })
      }
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
      },
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      },
      {
        checkWhich: 'api/storeHouse',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getStoreAsync'
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
          return '纺厂仓库'
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
          mainRule: ['store_id', 'second_store_id', 'name', 'attribute'],
          otherRule: [{ name: 'second_store_name' }, { name: 'store_name' }],
          childrenName: 'store_info',
          childrenRule: {
            mainRule: ['batch_code'],
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
    user_list() {
      return this.$store.state.api.user.arr
    },
    client_list() {
      return this.$store.state.api.client.arr
        .concat(this.$store.state.api.supplier.arr)
        .concat(this.$store.state.api.factory.arr)
    },
    store_list() {
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 2)
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/store/detail.less';
</style>
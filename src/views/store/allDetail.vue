<template>
  <div class="indexMain"
    id="storeDetail"
    v-loading='loading.page'>
    <div class="module">
      <div class="titleCtn">
        <span class="title">库存信息</span>
        <el-tooltip placement="top"
          content="可勾选纱线进行快捷出入库">
          <!-- <span class="addBtn btn btnMain"
            @click="openStore">新增出入库</span> -->
        </el-tooltip>
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
            <div class="elCtn"
              style="width:120px">
              <el-cascader
                v-model="storeListFilter.name"
                filterable
                clearable
                :show-all-levels="false"
                placeholder="请选择纱线"
                :options="yarn_list"
                @change="getStoreInfoList"
              ></el-cascader>
            </div>
            <div class="elCtn"
              style="width:120px">
              <el-input v-model="storeListFilter.color"
                @change="getStoreInfoList"
                placeholder="纱线颜色"></el-input>
            </div>
            <div class="elCtn"
              style="width:120px">
              <el-input v-model="storeListFilter.batch_code"
                @change="getStoreInfoList"
                placeholder="批号"></el-input>
            </div>
            <div class="elCtn"
              style="width:120px">
              <el-input v-model="storeListFilter.color_code"
                @change="getStoreInfoList"
                placeholder="色号"></el-input>
            </div>
            <div class="elCtn"
              style="width:120px">
              <el-input v-model="storeListFilter.vat_code"
                @change="getStoreInfoList"
                placeholder="缸号"></el-input>
            </div>
            <div class="elCtn"
              style="width:20px">
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
              <div class="tcolumn">仓库名称</div>
              <div class="tcolumn">二级仓库名称</div>
              <div class="tcolumn">纱线名称</div>
              <div class="tcolumn">纱线颜色</div>
              <div class="tcolumn">属性</div>
              <div class="tcolumn noPad"
                style="flex:6">
                <div class="trow">
                  <div class="tcolumn">批号</div>
                  <div class="tcolumn">色号</div>
                  <div class="tcolumn">缸号</div>
                  <div class="tcolumn">实际库存(KG)</div>
                  <div class="tcolumn">可用库存(KG)</div>
                  <div class="tcolumn"
                    style="min-width:110px">操作</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in storeListCom.data"
              :key="item.store_name + item.second_store_name + item.name + item.second_store_name + item.color + item.attribute">
              <div class="tcolumn">{{item.store_name || '-'}}</div>
              <div class="tcolumn">{{item.second_store_name || '-'}}</div>
              <div class="tcolumn">{{item.name}}</div>
              <div class="tcolumn">{{item.color}}</div>
              <div class="tcolumn">{{item.attribute}}</div>
              <div class="tcolumn noPad"
                style="flex:6">
                <div class="trow"
                  v-for="itemStore in item.store_info"
                  :key="itemStore.id">
                  <div class="tcolumn">
                    {{itemStore.batch_code}}
                    <!-- <el-checkbox :key="new Date().getMilliseconds()"
                      v-model="itemStore.check">{{itemStore.batch_code}}</el-checkbox> -->
                  </div>
                  <div class="tcolumn">{{itemStore.color_code}}</div>
                  <div class="tcolumn">{{itemStore.vat_code}}</div>
                  <div class="tcolumn">{{itemStore.reality_weight && $formatNum(itemStore.reality_weight) || '-'}}</div>
                  <div class="tcolumn blue">{{itemStore.useable_weight && $formatNum(itemStore.useable_weight) || '-'}}</div>
                  <div class="tcolumn flexRow"
                    style="min-width:110px">
                    <span class="opr green"
                      @click="goLogEl(item,itemStore)">日志</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow bgGray noBorder">
              <div class="tcolumn">合计</div>
              <div class="tcolumn"></div>
              <div class="tcolumn"></div>
              <div class="tcolumn"></div>
              <div class="tcolumn"></div>
              <div class="tcolumn noPad"
                style="flex:6">
                <div class="trow">
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn">{{$formatNum($toFixed(storeListCom.reality_weight))}}</div>
                  <div class="tcolumn blue">{{$formatNum($toFixed(storeListCom.useable_weight))}}</div>
                  <div class="tcolumn"
                    style="min-width:110px"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination
            background
            @current-change="getStoreInfoList"
            :current-page.sync="storeListFilter.pages"
            :page-size="storeListFilter.limit"
            layout="prev, pager, next"
            :total="storeListFilter.total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module"
      id="stockLogEl"
      v-loading="loading.log">
      <div class="titleCtn">
        <span class="title">出入库日志</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn showMore">
          <div class="leftCtn" style="padding-right:unset;max-width:1210px">
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
              <el-cascader
                v-model="storeLogListFilter.name"
                filterable
                clearable
                :show-all-levels="false"
                placeholder="请选择纱线"
                :options="yarn_list"
                @change="getStoreLogList(1)"
              ></el-cascader>
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
            <div class="elCtn"
              style="width:120px">
              <el-input v-model="storeLogListFilter.batch_code"
                @change="getStoreLogList(1)"
                placeholder="批号"></el-input>
            </div>
            <div class="elCtn"
              style="width:120px">
              <el-input v-model="storeLogListFilter.color_code"
                @change="getStoreLogList(1)"
                placeholder="色号"></el-input>
            </div>
            <div class="elCtn"
              style="width:120px">
              <el-input v-model="storeLogListFilter.vat_code"
                @change="getStoreLogList(1)"
                placeholder="缸号"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="storeLogListFilter.type"
                clearable
                multiple
                @change="getStoreLogList(1)"
                placeholder="选择操作类型">
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
                placeholder="每页展示条数（默认‘10’）">
                <el-option v-for="item in commonInit.limitArr"
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
        <div class="listCtn">
          <div class="list">
            <div class="overflow" @mousewheel.prevent="listenWheel" ref="list">
              <div class="tableCtn">
                <div class="table">
                  <div class="headCtn">
                    <div class="row">
                      <div class="column min120">单号</div>
                      <div class="column"
                        style="min-width:80px">操作类型</div>
                      <div class="column"
                        style="min-width:200px">出入库信息</div>
                      <div class="column"
                        style="flex:10;flex-direction:column">
                        <div class="row">
                          <div class="column min120">纱线名称</div>
                          <div class="column min120">颜色</div>
                          <div class="column min120">属性</div>
                          <div class="column min120">数量</div>
                          <div class="column min120">批号</div>
                          <div class="column min120">色号</div>
                          <div class="column min120">缸号</div>
                        </div>
                      </div>
                      <div class="column min120">绑定单号</div>
                      <div class="column min120">备注信息</div>
                      <div class="column min120">日期</div>
                      <div class="column min120">操作人</div>
                      <div class="column min120">操作</div>
                    </div>
                  </div>
                  <div class="bodyCtn">
                    <div class="row"
                      v-for="item in storeLogInfo.list"
                      :key="item.id">
                      <div class="column min120">{{item.code}}</div>
                      <div class="column"
                        style="min-width:80px">{{item.action_type}}</div>
                      <div class="column"
                        style="min-width:200px">{{item.client_name}}</div>
                      <div class="column"
                        style="flex:10;flex-direction:column">
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
                      <div class="column min120"
                        :class="{'blue':item.related_info}"
                        :style="{'cursor':item.related_info?'pointer':''}"
                        @click="goFromStore(item.action_type,item.related_info)">
                        {{item.related_info?item.related_info.code:'无单号'}}
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
                      style="min-width:80px">操作类型</div>
                    <div class="column"
                      style="min-width:200px;max-width:200px">出入库信息</div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div class="row"
                    v-for="item in storeLogInfo.list"
                    :key="item.id">
                    <div class="column min120 blue"
                      :style="{'height':51*item.child_data.length - 1 + 'px'}">{{item.code}}</div>
                    <div class="column"
                      style="min-width:80px"
                      :style="{'height':51*item.child_data.length - 1 + 'px'}"
                      :class="{'blue':item.action_type===1||item.action_type===3||item.action_type===5||item.action_type===8||item.action_type===11||item.action_type===13||item.action_type===14||item.action_type===15,'green':item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7||item.action_type===9||item.action_type===10||item.action_type===12}">{{item.action_type|stockTypeFilter}}</div>
                    <div class="column"
                      style="min-width:200px;max-width:200px"
                      :style="{'height':51*item.child_data.length - 1 + 'px'}">
                      <span v-if="item.action_type===1||item.action_type===3||item.action_type===5||item.action_type===8||item.action_type===13||item.action_type===14||item.action_type===15">
                        <span class="green">{{item.client_name ||'无来源'}}</span>
                        <i class="el-icon-s-unfold orange"
                          style="margin:0 5px;font-size:16px"></i>
                        <span class="blue">{{item.store_name}}/{{item.second_store_name}}</span>
                      </span>
                      <span v-if="item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7||item.action_type===9||item.action_type===12">
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
                    v-for="item in storeLogInfo.list"
                    :key="item.id">
                    <div class="column min120"
                      :style="{'height':51*item.child_data.length - 1 + 'px'}">
                      <span class="blue opr"
                        @click="$openUrl(`/print/store/${item.action_type}/${item.id}?orderId=${$route.params.id}`)">打印</span>
                      <!-- <span class="opr"
                        :class="{'green':item.related_id,'orange':!item.related_id}"
                        @click="bindCode(item)">{{item.related_id?'已绑':'绑定'}}</span>
                      <span class="red opr"
                        @click="deleteLog(item.id)">删除</span> -->
                    </div>
                  </div>
                </div>
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
    <div class="popup"
      v-show="lookListFlag">
      <div class="main" style="width:1200px">
        <div class="titleCtn">
          <span class="text">仓库列表</span>
          <div class="closeCtn"
            @click="lookListFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="listCtn">
          <div class="list"
            v-loading="storeLoading">
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
              <div class="row"
                v-for="item in storeInfoList"
                :key="item.id">
                <div class="column">{{item.name}}</div>
                <div class="column">{{item.total_weight || 0}}Kg</div>
                <div class="column">{{item.admins.map(itemM=>itemM.name).join(',')}}</div>
                <div class="column">{{item.desc}}</div>
                <div class="column">
                  <div class="opr hoverBlue"
                    @click="$router.push(`/store/detail/${item.id}`)">详情</div>
                  <div class="opr hoverRed"
                    @click="deleteStore(item)">删除</div>
                  <div class="opr hoverOrange"
                    @click="changeStore(item)">修改</div>
                </div>
              </div>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="5"
              layout="prev, pager, next"
              :total="storeTotal"
              :current-page.sync="storePage"
              @current-change="getStoreList">
            </el-pagination>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn" style="margin-right:20px"
            @click="lookListFlag=false">关闭</span>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn" style="float:left">
          <div class="btn backHoverGreen"
            @click="getStoreList();lookListFlag=true">仓库列表</div>
          <div class="btn backHoverBlue"
            @click="changeStore()">添加仓库</div>
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
    <in-and-out :noChange="false"
      :updateId="updateId"
      :bindFlag="bindFlag"
      :firstStoreId="$route.params.id"
      :initData="store_info.init_data"
      :show.sync="store_info.show"
      @close="resetStoreInfo"></in-and-out>
    <div class="popup"
      v-show="addFlag">
      <div class="main">
        <div class="titleCtn">
          <div class="text">{{createOrEditStoreObj.id && '修改' || '新增'}}仓库</div>
          <i class="close_icon el-icon-close"
            @click="addFlag=false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label isMust">仓库名称：</div>
            <div class="info">
              <el-input placeholder="请输入加仓库名称"
                v-model="createOrEditStoreObj.name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">仓库类型：</div>
            <div class="info">
              <el-select v-model="createOrEditStoreObj.type"
                placeholder="请选择仓库类型">
                <el-option v-for="item in typeArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">仓库管理员：</div>
            <div class="info">
              <el-select v-model="createOrEditStoreObj.admins"
                multiple
                placeholder="请选择仓库管理员">
                <el-option v-for="item in user_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row"
            v-for="(itemLV2,indexLV2) in createOrEditStoreObj.LV2_info"
            :key="indexLV2">
            <div :class="`label ${indexLV2 === 0 ? 'isMust' : ''}`">{{indexLV2 === 0 && '二级仓库名：' || ''}}</div>
            <div class="info">
              <el-input placeholder="请输入二级仓库名称"
                v-model="itemLV2.name"></el-input>
              <span class="info_btn blue"
                v-if="indexLV2 === 0"
                @click="$addItem(createOrEditStoreObj.LV2_info,{ name: '', id: null })">添加</span>
              <span class="info_btn red"
                v-else
                @click="itemLV2.id?deleteSecondStore(itemLV2.id,createOrEditStoreObj.LV2_info,indexLV2):$deleteItem(createOrEditStoreObj.LV2_info,indexLV2)">删除</span>
            </div>
          </div>
          <div class="row">
            <div class="label">仓库备注：</div>
            <div class="info">
              <el-input placeholder="请输入仓库备注"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="createOrEditStoreObj.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="addFlag=false">取消</div>
          <div class="opr blue"
            @click="saveStore">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store, StoreDetail } from '@/types/common'
import { StoreCreate } from '@/types/store'
import { store, stock } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    storeDetail: StoreDetail
    storeList: Array<{
      [key: string]: any
    }>
    commonInit: {
      typeArr: Array<{ id: number; name: string }>
      remarkList: Array<{ value: string }>
      limitArr: Array<{ id: number; name: string }>
    }
    [propName: string]: any
  } {
    return {
      showMore: false,
      lookListFlag:false,
      addFlag:false,
      storeLoading:false,
      storeTotal:1,
      storePage:1,
      typeArr: [
        {
          id: 1,
          name: '本厂仓库'
        },
        {
          id: 2,
          name: '染厂仓库'
        }
      ],
      store_info: {
        show: false,
        init_data: []
      },
      storeInfoList:[],
      loading: {
        page: false,
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
        color: '白胚',
        isFilterZero: true,
        page: 1,
        limit: 20,
        total: 1,
        color_code: '',
        batch_code: '',
        vat_code: ''
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
        color: '白胚',
        attr: '',
        type: '',
        code: '',
        limit: 10,
        pages: 1,
        total: 1,
        time: ''
      },
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
          }
        ],
        remarkList: [],
        limitArr: [
          {
            id: 5,
            name: '5条'
          },
          {
            id: 10,
            name: '10条'
          },
          {
            id: 15,
            name: '15条'
          },
          {
            id: 20,
            name: '20条'
          },
          {
            id: 25,
            name: '25条'
          }
        ]
      },
      createOrEditStoreObj:{
        store_type: 1,
        id: null,
        name: '',
        type: 1,
        admins: [],
        LV2_info: [{ name: '', id: null }],
        desc: ''
      },
      storeListCom: {
        data: [],
        reality_weight: 0,
        useable_weight: 0
      },
      bindFlag: false,
      updateId: 0
    }
  },
  computed: {
    store_list() {
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 1)
    },
    user_list() {
      return this.$store.state.api.user.arr
    },
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
  },
  methods: {
    init() {
      this.getStoreInfoList()
      this.getStoreLogList()
    },
    changeStore(item: Store) {
      this.addFlag = true
      this.createOrEditStoreObj = {
        store_type: 1,
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
      const LV2Name = this.createOrEditStoreObj.LV2_info.filter((itemF:any) => !itemF.name) // 筛选出名字为false
      if (LV2Name.length > 0) {
        this.$message.warning('请输入二级仓库名称')
        return
      }
      store
        .create({
          store_type: 1,
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
    getStoreInfoList() {
      this.loading.info = true
      store
        .detailYarnList({
          store_id: this.storeListFilter.LV2_name ? this.storeListFilter.LV2_name[0] : '',
          second_store_id: this.storeListFilter.LV2_name ? this.storeListFilter.LV2_name[1] : '',
          name: this.storeListFilter.name ? this.storeListFilter.name[1] : '',
          page: this.storeListFilter.page || 1,
          limit: this.storeListFilter.limit || 20,
          color: this.storeListFilter.color || null,
          weight: this.storeListFilter.isFilterZero ? 0 : null,
          vat_code: this.storeListFilter.vat_code || null,
          color_code: this.storeListFilter.color_code || null,
          batch_code: this.storeListFilter.batch_code || null
        })
        .then((res) => {
          this.storeList = res.data.data.items
          this.storeListFilter.total = res.data.data.total
          this.storeListCom = {
            reality_weight: this.storeList.map((itemM) => +itemM.total_weight).reduce((a, b) => a + b, 0),
            useable_weight: this.storeList.map((itemM) => +itemM.use_weight).reduce((a, b) => a + b, 0),
            data: this.$mergeData(this.storeList, {
              mainRule: ['store_id', 'second_store_id', 'name', 'color', 'attribute'],
              otherRule: [{ name: 'second_store_name' }, { name: 'store_name' }],
              childrenName: 'store_info',
              childrenRule: {
                mainRule: ['color_code', 'vat_code', 'batch_code'],
                otherRule: [
                  { name: 'id' },
                  { name: 'total_weight/reality_weight', type: 'add' },
                  { name: 'use_weight/useable_weight', type: 'add' }
                ]
              }
            })
          }

          this.storeListCom.data.forEach((item:any) => {
            item.totalReality = item.store_info.reduce((a:any,b:any) => {
              return a + (b.reality_weight || 0)
            },0)
          });

          this.storeListCom.data.sort((a:any,b:any) => {
            return (b.totalReality - a.totalReality)
          })

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
          limit: 20,
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
    getStoreList(){
      this.storeLoading = true
      store
        .list({
          store_type: 1,
          limit: 5,
          page: this.storePage,
          name: null,
          type: null,
        })
        .then((res: any) => {
          if (res.data.status !== false) {
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
    // 获取出入库日志
    getStoreLogList(pages: number = 1) {
      this.loading.log = true
      stock
        .list({
          page: pages,
          limit: this.storeLogListFilter.limit || 10,
          store_id: this.storeLogListFilter.LV2_name ? this.storeLogListFilter.LV2_name[0] : '',
          store_second_id: this.storeLogListFilter.LV2_name ? this.storeLogListFilter.LV2_name[1] : '',
          name: this.storeLogListFilter.name ? this.storeLogListFilter.name[1] : "",
          color: this.storeLogListFilter.color || null,
          attribute: this.storeLogListFilter.attr || null,
          action_type: this.storeLogListFilter.type || [],
          vat_code: this.storeLogListFilter.vat_code || null,
          color_code: this.storeLogListFilter.color_code || null,
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
          this.$forceUpdate()
        })
    },
    // 跳转日志
    goLogEl(
      item: { second_store_id: number; name: string; color: string; attr: string; [key: string]: any },
      itemStore: { color_code: string; batch_code: string; vat_code: string }
    ) {
      this.storeLogListFilter.LV2_name = [item.store_id, item.second_store_id]
      this.storeLogListFilter.name = item.name
      this.storeLogListFilter.color = item.color
      this.storeLogListFilter.attr = item.attribute
      this.storeLogListFilter.vat_code = itemStore.vat_code
      this.storeLogListFilter.batch_code = itemStore.batch_code
      this.storeLogListFilter.color_code = itemStore.color_code
      this.$goElView('stockLogEl')
      this.getStoreLogList()
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
    resetStoreInfo() {
      this.store_info = {
        show: false,
        init_data: []
      }
      this.init()
    },
    exportExcel(type: number) {
      if (type === 1) {
        stock.excelOfLog().then((res) => {
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
        stock.excelOfAll().then((res) => {
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
    },
    // 新增出入库按钮删除，这个函数暂时没用了
    // openStore() {
    //   const selectData = this.$clone(this.storeListCom.data).filter((item: any) => {
    //     return item.store_info.filter((itemChild: any) => itemChild.check).length > 0
    //   })
    //   let secondStoreId: any
    //   let errFlag = false
    //   selectData.forEach((item: any) => {
    //     item.store_info = item.store_info.filter((itemChild: any) => itemChild.check)
    //     if (!secondStoreId) {
    //       secondStoreId = item.second_store_id
    //     } else {
    //       if (secondStoreId !== item.second_store_id) {
    //         errFlag = true
    //       }
    //     }
    //   })
    //   if (errFlag) {
    //     this.$message.error('不能同时选择两个二级仓库的原料进行出入库，请重新选择')
    //     return
    //   }
    //   this.store_info = {
    //     show: true,
    //     init_data: selectData
    //   }
    // },
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
    },
    goFromStore(type: number, stroeInfo: StoreCreate) {
      console.log(stroeInfo)
      if (type === 3) {
        this.$router.push('/directOrder/yarnDetail/' + stroeInfo.id)
      } else if (type === 4) {
        this.$message.warning('暂无详情页面')
      } else if (type === 5 || type === 6) {
        this.$router.push('/directProcess/yarnDetail/' + stroeInfo.id)
      } else if (type === 8) {
        this.$router.push('/material/craftDetail/' + stroeInfo.id)
      } else if (type === 9) {
        this.$router.push('/order/detail/' + stroeInfo.id)
      } else if (type === 10 || type === 11) {
        this.$message.warning('暂无详情页面')
      }
    },
    bindCode(storeInfo: StoreDetail) {
      if (storeInfo.related_id) {
        this.$message.warning('已绑定单据，不能重复绑定')
        return
      }
      this.bindFlag = true
      this.store_info.show = true
      this.updateId = storeInfo.id
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
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/store/detail.less';
</style>
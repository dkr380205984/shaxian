<template>
  <div class="indexMain" id="storeDetail" v-loading="loading.page">
    <div class="module">
      <div class="titleCtn">
        <span class="title">库存信息</span>
        <el-tooltip placement="top" content="可勾选纱线进行快捷出入库">
          <!-- <span class="addBtn btn btnMain"
            @click="openStore">新增出入库</span> -->
        </el-tooltip>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn" style="max-width: unset;padding-right: unset;">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-cascader
                v-model="storeListFilter.LV2_name"
                :options="store_list"
                @change="getStoreInfoList"
                :props="{ value: 'id', label: 'name', children: 'second_data' }"
                placeholder="请选择仓库"
              >
              </el-cascader>
            </div>
            <div class="elCtn" style="width: 120px">
              <el-select placeholder="所属客户" v-model="storeListFilter.store_client_id" @change="getStoreInfoList" filterable clearable>
                <el-option
                  v-for="item in clientArr"
                  :key="item.id"
                  :value="item.id"
                  :label="(item.code || item.id) + ' - ' + item.name"
                ></el-option>
              </el-select>
            </div>
            <div class="elCtn" style="width: 120px">
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
            <div class="elCtn" style="width: 120px">
              <el-input v-model="storeListFilter.color" @change="getStoreInfoList" placeholder="纱线颜色"></el-input>
            </div>
            <div class="elCtn" style="width: 120px">
              <el-input v-model="storeListFilter.batch_code" @change="getStoreInfoList" placeholder="批号"></el-input>
            </div>
            <div class="elCtn" style="width: 120px">
              <el-input v-model="storeListFilter.color_code" @change="getStoreInfoList" placeholder="色号"></el-input>
            </div>
            <div class="elCtn" style="width: 120px">
              <el-input v-model="storeListFilter.vat_code" @change="getStoreInfoList" placeholder="缸号"></el-input>
            </div>
            <div class="elCtn" style="width: 20px">
              <el-checkbox v-model="storeListFilter.isFilterZero" @change="getStoreInfoList"
                >过滤库存数量&lt;=0的库存</el-checkbox
              >
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr" @click="resetFilter(1)">重置</div>
          </div>
        </div>
        <div class="filterCtn" style="margin-top: 20px">
          <div class="leftCtn"></div>
          <div class="rightCtn">
            <div class="btnC">
              <div class="btn backHoverBlue" @click="goStore(3)">盘点移库</div>
              <div class="btn backHoverOrange" @click="goStore(2)">盘点出库</div>
              <div class="btn backHoverGreen" @click="goStore(1)">盘点入库</div>
              <div class="btn backHoverBlue" @click="yarnFlag = true">合并纱线</div>
              <div class="btn backHoverGreen" @click="showAddPO = true">采购并入库</div>
              <div class="btn backHoverOrange" @click="$router.push('/order/salesOrderCreate')">销售并出库</div>
              <div class="btn backHoverOrange" @click="create_flag = true">出库并加工</div>
            </div>
          </div>
        </div>
        <div class="checkCtn">
          <div class="label">已勾选单据：</div>
          <div class="elCtn check" v-for="(item, index) in selectList" :key="item.id">
            <el-input :value="item.name + '/' + item.color" disabled>
              <template slot="append">
                <i class="el-icon-close hoverRed" style="cursor: pointer" @click="selectList.splice(index, 1)"></i>
              </template>
            </el-input>
          </div>
        </div>
        <div class="tableCtn" style="margin: 24px 0" v-loading="!loading.page && loading.info">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">仓库名称</div>
              <div class="tcolumn">二级仓库名称</div>
              <div class="tcolumn">纱线名称</div>
              <div class="tcolumn">纱线颜色</div>
              <div class="tcolumn">属性</div>
              <div class="tcolumn">所属客户</div>
              <div class="tcolumn noPad" style="flex: 6">
                <div class="trow">
                  <div class="tcolumn">批号</div>
                  <div class="tcolumn">色号</div>
                  <div class="tcolumn">缸号</div>
                  <div class="tcolumn">实际库存(KG)</div>
                  <div class="tcolumn" style="flex: 2">操作</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div
              class="trow"
              v-for="item in storeListCom.data"
              :key="
                item.store_name +
                item.second_store_name +
                item.name +
                item.second_store_name +
                item.color +
                item.attribute
              "
            >
              <div class="tcolumn">{{ item.store_name || '-' }}</div>
              <div class="tcolumn">{{ item.second_store_name || '-' }}</div>
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
              <div class="tcolumn">{{ item.color }}</div>
              <div class="tcolumn">{{ item.attribute }}</div>
              <div class="tcolumn">{{ item.store_client_name || '无' }}</div>
              <div class="tcolumn noPad" style="flex: 6">
                <div class="trow" v-for="itemStore in item.store_info" :key="'store' + itemStore.id">
                  <div class="tcolumn">
                    {{ itemStore.batch_code }}
                    <!-- <el-checkbox :key="new Date().getMilliseconds()"
                      v-model="itemStore.check">{{itemStore.batch_code}}</el-checkbox> -->
                  </div>
                  <div class="tcolumn">{{ itemStore.color_code }}</div>
                  <div class="tcolumn">{{ itemStore.vat_code }}</div>
                  <div class="tcolumn">
                    {{ (itemStore.reality_weight && $formatNum(itemStore.reality_weight)) || '-' }}
                  </div>
                  <div class="tcolumn flexRow" style="flex: 2">
                    <span style="margin: 0 6px;" class="opr green" @click="goLogEl(item, itemStore)">日志</span>
                    <span style="margin: 0 6px;" class="opr green" @click="openStore(1, item)">入库</span>
                    <span style="margin: 0 6px;" class="opr red" @click="openStore(2, item)">出库</span>
                    <span style="margin: 0 6px;" class="opr blue" @click="openStore(3, item)">移库</span>
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
              <div class="tcolumn"></div>
              <div class="tcolumn noPad" style="flex: 6">
                <div class="trow">
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn">{{ $formatNum($toFixed(storeListCom.reality_weight)) }}</div>
                  <div class="tcolumn flexRow" style="flex:2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination
            background
            @current-change="getStoreInfoList"
            :current-page.sync="storeListFilter.page"
            :page-size="storeListFilter.limit"
            layout="prev, pager, next"
            :total="storeListFilter.total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module" id="stockLogEl" v-loading="loading.log">
      <div class="titleCtn">
        <span class="title">出入库日志</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn showMore">
          <div class="leftCtn" style="padding-right: unset; max-width: 1210px">
            <div class="label">筛选条件：</div>
            <!-- <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div> -->
            <div class="elCtn">
              <el-cascader
                v-model="storeLogListFilter.LV2_name"
                :options="store_list"
                @change="getStoreLogList(1)"
                :props="{ value: 'id', label: 'name', children: 'second_data' }"
                placeholder="请选择仓库"
              >
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
              <el-input
                v-model="storeLogListFilter.color"
                @change="getStoreLogList(1)"
                placeholder="输入纱线颜色"
              ></el-input>
            </div>
            <div class="elCtn">
              <el-select
                v-model="storeLogListFilter.attr"
                clearable
                @change="getStoreLogList(1)"
                placeholder="选择纱线属性"
              >
                <el-option label="绞纱" value="绞纱"></el-option>
                <el-option label="筒纱" value="筒纱"></el-option>
              </el-select>
            </div>
            <div class="elCtn" style="width: 120px">
              <el-input
                v-model="storeLogListFilter.batch_code"
                @change="getStoreLogList(1)"
                placeholder="批号"
              ></el-input>
            </div>
            <div class="elCtn" style="width: 120px">
              <el-input
                v-model="storeLogListFilter.color_code"
                @change="getStoreLogList(1)"
                placeholder="色号"
              ></el-input>
            </div>
            <div class="elCtn" style="width: 120px">
              <el-input
                v-model="storeLogListFilter.vat_code"
                @change="getStoreLogList(1)"
                placeholder="缸号"
              ></el-input>
            </div>
            <div class="elCtn">
              <el-select
                v-model="storeLogListFilter.type"
                clearable
                multiple
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
              <el-input
                v-model="storeLogListFilter.code"
                @change="getStoreLogList(1)"
                placeholder="输入关联单号"
              ></el-input>
            </div>
            <div class="elCtn" style="width: 120px">
              <el-select placeholder="所属客户" v-model="storeLogListFilter.store_client_id" @change="getStoreLogList(1)" filterable clearable>
                <el-option
                  v-for="item in clientArr"
                  :key="item.id"
                  :value="item.id"
                  :label="(item.code || item.id) + ' - ' + item.name"
                ></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-select
                v-model="storeLogListFilter.limit"
                clearable
                @change="getStoreLogList(1)"
                placeholder="每页展示条数（默认‘10’）"
              >
                <el-option
                  v-for="item in commonInit.limitArr"
                  :key="item.id + item.name"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-date-picker
                v-model="storeLogListFilter.time"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getStoreLogList(1)"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="rightCtn" style="min-width: 94px">
            <div class="btn btnGray fr" @click="resetFilter(2)">重置</div>
          </div>
        </div>
        <div class="listCtn">
          <div class="list fz14">
            <div class="overflow" @mousewheel.prevent="listenWheel" ref="list">
              <div class="tableCtn">
                <div class="table">
                  <div class="headCtn">
                    <div class="row">
                      <div class="column min120">单号</div>
                      <div class="column" style="min-width: 80px">操作类型</div>
                      <div class="column" style="min-width: 200px">出入库信息</div>
                      <div class="column" style="flex: 10; flex-direction: column">
                        <div class="row">
                          <div class="column min120">纱线名称</div>
                          <div class="column min120">颜色</div>
                          <div class="column min120">属性</div>
                          <div class="column min120">数量</div>
                          <div class="column min120">所属客户</div>
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
                    <div class="row" v-for="item in storeLogInfo.list" :key="item.id + item.code">
                      <div class="column min120">{{ item.code }}</div>
                      <div class="column" style="min-width: 80px;max-width:80px">{{ item.action_type }}</div>
                      <div class="column" style="min-width: 200px">{{ item.client_name || '无'}}</div>
                      <div class="column" style="flex: 10; flex-direction: column">
                        <div
                          class="row"
                          v-for="(itemChild, indexChild) in item.child_data"
                          :key="indexChild + itemChild.name"
                        >
                          <div class="column min120">{{ itemChild.name }}</div>
                          <div class="column min120">{{ itemChild.color }}</div>
                          <div class="column min120">{{ itemChild.attribute }}</div>
                          <div class="column min120 blue">{{ itemChild.action_weight }}</div>
                          <div class="column min120">{{ itemChild.store_client_name || '无'}}</div>
                          <div class="column min120">{{ itemChild.batch_code }}</div>
                          <div class="column min120">{{ itemChild.color_code }}</div>
                          <div class="column min120">{{ itemChild.vat_code }}</div>
                        </div>
                      </div>
                      <div
                        class="column min120"
                        :class="{ blue: item.related_info }"
                        :style="{ cursor: item.related_info ? 'pointer' : '' }"
                        @click="goFromStore(item.action_type, item.related_info)"
                      >
                        {{ item.related_info ? item.related_info.code : '无单号' }}
                      </div>
                      <div class="column min120">{{ item.desc || '无' }}</div>
                      <div class="column min120">{{ item.complete_time }}</div>
                      <div class="column min120">{{ item.user_name }}</div>
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
                    <div class="column" style="min-width: 80px">操作类型</div>
                    <div class="column" style="min-width: 200px; max-width: 200px">出入库信息</div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div class="row" v-for="item in storeLogInfo.list" :key="item.id + item.code">
                      <div class="column min120">{{ item.code }}</div>
                      <div
                        class="column"
                        style="min-width: 80px;max-width:80px"
                        :class="{
                          blue:
                            item.action_type === 1 ||
                            item.action_type === 3 ||
                            item.action_type === 5 ||
                            item.action_type === 8 ||
                            item.action_type === 11 ||
                            item.action_type === 13 ||
                            item.action_type === 14 ||
                            item.action_type === 15 || 
                            item.action_type === 17 , 
                          green:
                            item.action_type === 2 ||
                            item.action_type === 4 ||
                            item.action_type === 6 ||
                            item.action_type === 7 ||
                            item.action_type === 9 ||
                            item.action_type === 10 ||
                            item.action_type === 12 || 
                            item.action_type === 16 || 
                            item.action_type === 18
                        }"
                      >
                        {{ item.action_type | stockTypeFilter }}
                      </div>
                      <div class="column" style="min-width: 200px">{{ item.client_name || '无'}}</div>
                      <div class="column noPad" style="flex-direction: column;width:0;overflow:hidden">
                        <div
                          class="row"
                          v-for="(itemChild, indexChild) in item.child_data"
                          :key="indexChild + itemChild.name"
                        >
                          <div class="column min120">{{ itemChild.name }}</div>
                          <div class="column min120">{{ itemChild.color }}</div>
                          <div class="column min120">{{ itemChild.attribute }}</div>
                          <div class="column min120 blue">{{ itemChild.action_weight }}</div>
                          <div class="column min120">{{ itemChild.batch_code }}</div>
                          <div class="column min120">{{ itemChild.color_code }}</div>
                          <div class="column min120">{{ itemChild.vat_code }}</div>
                        </div>
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
                  <div class="row" v-for="item in storeLogInfo.list" :key="item.id + 'sss'">
                    <div class="column" style="width:0;overflow:hidden;flex-direction: column">
                      <div
                        class="row"
                        v-for="(itemChild, indexChild) in item.child_data"
                        :key="indexChild + itemChild.name"
                      >
                        <div class="column min120">{{ itemChild.name }}</div>
                        <div class="column min120">{{ itemChild.color }}</div>
                        <div class="column min120">{{ itemChild.attribute }}</div>
                        <div class="column min120 blue">{{ itemChild.action_weight }}</div>
                        <div class="column min120">{{ itemChild.batch_code }}</div>
                        <div class="column min120">{{ itemChild.color_code }}</div>
                        <div class="column min120">{{ itemChild.vat_code }}</div>
                      </div>
                    </div>
                    <div class="column min120" :style="{ height: 51 * item.child_data.length - 1 + 'px' }">
                      <span
                        class="blue opr"
                        @click="$openUrl(`/print/store/${item.action_type}/${item.id}?orderId=${$route.params.id}`)"
                        >打印</span
                      >
                      <!-- <span class="opr"
                        :class="{'green':item.related_id,'orange':!item.related_id}"
                        @click="bindCode(item)">{{item.related_id?'已绑':'绑定'}}</span> -->
                      <span class="red opr"
                        @click="deleteLog(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="display:flex">
            <span class="blue" style="font-weight:bold">合计入库：{{ storeLogInfo.total_pop }}kg</span>
            <span class="green" style="font-weight:bold;margin-left:20px">合计出库：{{ storeLogInfo.total_push }}kg</span>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination
            background
            @current-change="getStoreLogList"
            :current-page.sync="storeLogListFilter.pages"
            :page-size="storeLogListFilter.limit"
            layout="prev, pager, next"
            :total="storeLogListFilter.total"
          >
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
                  <div class="opr hoverBlue" @click="$router.push(`/store/detail/${item.id}`)">详情</div>
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
          <div class="btn btnGray" @click="$router.go(-1)">返回</div>
          <div class="btn btnMain" @click="exportExcel(1)">导出库存日志</div>
          <div class="btn btnMain" @click="exportExcel(2)">导出库存数量</div>
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
    <div class="popup" v-show="yarnFlag">
      <div class="main" style="width: 1200px">
        <div class="titleCtn">
          <span class="text">{{ mergeStep ? '勾选纱线' : '合并纱线' }}</span>
          <div class="closeCtn" @click="yarnFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="explainCtn" style="margin: 12px 0">
            搜索并勾选需要合并的纱线，合并后，会将这部分纱线的数量合并到一个纱线上。剩余纱线的数量将被清零。
          </div>
          <div v-if="mergeStep === 1" class="listCtn" style="padding: 32px 0">
            <div class="filterCtn">
              <div class="elCtn" style="width: 30%">
                <el-cascader
                  v-model="mergeFilter.store_arr"
                  :options="store_list"
                  clearable
                  @change="getMergeSearchList"
                  :props="{ value: 'id', label: 'name', children: 'second_data' }"
                  placeholder="请选择仓库"
                ></el-cascader>
              </div>
              <div class="elCtn" style="width: 30%">
                <el-cascader
                  v-model="mergeFilter.name"
                  filterable
                  clearable
                  :show-all-levels="false"
                  placeholder="请选择纱线"
                  :options="yarn_list"
                  @change="getMergeSearchList"
                ></el-cascader>
              </div>
              <div class="elCtn" style="width: 30%">
                <el-input v-model="mergeFilter.color" @change="getMergeSearchList" placeholder="纱线颜色"></el-input>
              </div>
              <div class="btn backHoverBlue" @click="getMergeSearchList">搜索</div>
            </div>
            <div class="list" v-loading="mergeLoading">
              <div class="headCtn">
                <div class="row title" style="min-height: 40px; margin: unset">
                  <div class="column">仓库名称</div>
                  <div class="column">纱线名称</div>
                  <div class="column">纱线颜色</div>
                  <div class="column">纱线属性</div>
                  <div class="column">所属客户</div>
                  <div class="column">批号/色号/缸号</div>
                  <div class="column">库存数量</div>
                  <div class="column" style="flex: 0.3">勾选</div>
                </div>
              </div>
              <div class="bodyCtn">
                <div
                  class="row"
                  style="min-height: 40px; margin: unset"
                  v-for="item in mergeList"
                  :key="item.id + 'mergeList'"
                >
                  <div class="column">{{ item.store_name }}<br />{{ item.second_store_name }}</div>
                  <div class="column" style="max-width: 175px; word-break: break-all">{{ item.name }}</div>
                  <div class="column" style="max-width: 175px; word-break: break-all">{{ item.color }}</div>
                  <div class="column" style="max-width: 175px; word-break: break-all">{{ item.attribute }}</div>
                  <div class="column" style="max-width: 175px; word-break: break-all">{{ item.store_client_name || '无' }}</div>
                  <div class="column" style="max-width: 175px; word-break: break-all">
                    {{ item.batch_code }}/{{ item.color_code }}/{{ item.vat_code }}
                  </div>
                  <div class="column" style="max-width: 175px; word-break: break-all">{{ item.total_weight }}kg</div>
                  <div class="column" style="flex: 0.3">
                    <el-checkbox v-model="item.check" @change="getMergeCheck($event, item)"></el-checkbox>
                  </div>
                </div>
              </div>
            </div>
            <div class="pageCtn">
              <el-pagination
                background
                :page-size="10"
                layout="prev, pager, next"
                :total="mergeTotal"
                :current-page.sync="mergePage"
                @current-change="getMergeSearchList"
              >
              </el-pagination>
            </div>
          </div>
          <div v-if="mergeStep === 2" class="listCtn" style="padding: 32px 0">
            <div class="list" v-loading="mergeLoading" style="min-height: 100px">
              <div class="headCtn">
                <div class="row title" style="min-height: 40px; margin: unset">
                  <div class="column">仓库名称</div>
                  <div class="column">待合并纱线</div>
                  <div class="column">待合并颜色</div>
                  <div class="column">待合并属性</div>
                  <div class="column">批号/色号/缸号</div>
                  <div class="column">待合并数量</div>
                  <div class="column">操作</div>
                </div>
              </div>
              <div class="bodyCtn">
                <div
                  class="row"
                  style="min-height: 40px; margin: unset"
                  v-for="(item, index) in mergeCheckList"
                  :key="item.id + 'mergeCheckList'"
                >
                  <div class="column" style="max-width: 160px; word-break: break-all">
                    {{ item.store_name }}<br />{{ item.second_store_name }}
                  </div>
                  <div class="column" style="max-width: 160px; word-break: break-all">{{ item.name }}</div>
                  <div class="column" style="max-width: 160px; word-break: break-all">{{ item.color }}</div>
                  <div class="column" style="max-width: 160px; word-break: break-all">{{ item.attribute }}</div>
                  <div class="column" style="max-width: 160px; word-break: break-all">
                    {{ item.batch_code }}/{{ item.color_code }}/{{ item.vat_code }}
                  </div>
                  <div class="column" style="max-width: 160px; word-break: break-all">{{ item.total_weight }}kg</div>
                  <div class="column" style="max-width: 160px; word-break: break-all">
                    <div class="oprCtn" style="border: unset">
                      <div
                        class="opr hoverRed"
                        style="border: unset"
                        @click="mergeCheckList.length > 2 ? deleteMerge(index) : $message.error('至少有两种纱线')"
                      >
                        删除
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="list">
              <div class="headCtn">
                <div class="row title">
                  <div class="column">合并仓库</div>
                  <div class="column">合并纱线</div>
                  <div class="column">合并颜色</div>
                  <div class="column">合并属性</div>
                  <div class="column">批号</div>
                  <div class="column">色号</div>
                  <div class="column">缸号</div>
                  <div class="column">合并数量</div>
                </div>
              </div>
              <div class="row">
                <div class="column" style="max-width: 140px; box-sizing: border-box">
                  <div class="elCtn">
                    <el-cascader
                      v-model="mergeData.store_arr"
                      :options="store_list"
                      clearable
                      :props="{ value: 'id', label: 'name', children: 'second_data' }"
                      placeholder="请选择仓库"
                    ></el-cascader>
                  </div>
                </div>
                <div class="column" style="max-width: 140px; box-sizing: border-box">
                  <div class="elCtn">
                    <el-select v-model="mergeData.name">
                      <el-option
                        v-for="item in mergeMatList"
                        :key="item.id"
                        :value="item.name"
                        :label="item.name"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="column" style="max-width: 140px; box-sizing: border-box">
                  <div class="elCtn">
                    <el-input v-model="mergeData.color" placeholder="纱线颜色"></el-input>
                  </div>
                </div>
                <div class="column" style="max-width: 140px; box-sizing: border-box">
                  <div class="elCtn">
                    <el-select v-model="mergeData.attribute" clearable placeholder="选择纱线属性">
                      <el-option label="绞纱" value="绞纱"></el-option>
                      <el-option label="筒纱" value="筒纱"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="column" style="max-width: 140px; box-sizing: border-box">
                  <div class="elCtn">
                    <el-input placeholder="批号" v-model="mergeData.batch_code"></el-input>
                  </div>
                </div>
                <div class="column" style="max-width: 140px; box-sizing: border-box">
                  <div class="elCtn">
                    <el-input placeholder="色号" v-model="mergeData.color_code"></el-input>
                  </div>
                </div>
                <div class="column" style="max-width: 140px; box-sizing: border-box">
                  <div class="elCtn">
                    <el-input placeholder="缸号" v-model="mergeData.vat_code"></el-input>
                  </div>
                </div>
                <div class="column" style="max-width: 140px; box-sizing: border-box">
                  <div class="elCtn">
                    <el-input placeholder="数量" v-model="mergeData.weight"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn" style="margin-right: 20px" @click="yarnFlag = false">取消</span>
          <span class="btn backHoverOrange" style="margin-right: 20px" @click="mergeStep = 1">上一步</span>
          <span
            class="btn backHoverBlue"
            style="margin-right: 20px"
            @click="mergeStep === 1 ? goMergeStep2() : saveMergeMat()"
            >{{ mergeStep === 1 ? '去合并' : '确认合并' }}</span
          >
        </div>
      </div>
    </div>
    <add-trans-process :update_flag='false' :create_flag='create_flag' :info='{}' @close='create_flag = false' @afterCreate='init()'></add-trans-process>
    <in-and-out
      :noChange="true"
      :updateId="updateId"
      :bindFlag="bindFlag"
      :type="1"
      :firstStoreId="firstStoreId"
      :initData="initData"
      :show.sync="showIn"
      @close="init"
    ></in-and-out>
    <in-and-out
      :noChange="true"
      :updateId="updateId"
      :bindFlag="bindFlag"
      :type="2"
      :firstStoreId="firstStoreId"
      :initData="initData"
      :show.sync="showOut"
      @close="init"
    ></in-and-out>
    <in-and-out
      :noChange="true"
      :updateId="updateId"
      :bindFlag="bindFlag"
      :type="10"
      :firstStoreId="firstStoreId"
      :initData="initData"
      :show.sync="showMove"
      @close="init"
    ></in-and-out>
    <shaxianAddPO
      :show="showAddPO"
      :update="false"
      @close="
        order_yarn_info = {
          order_id: '',
          client_id: '',
          total_price: '',
          child_data: [
            {
              name: '',
              weight: '',
              color: '白胚',
              attribute: '',
              price: ''
            }
          ],
          order_time: $getDate(new Date()),
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
        showAddPO = false
      "
      :info="order_yarn_info"
      @afterCreate="init"
    ></shaxianAddPO>
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
      lookListFlag: false,
      addFlag: false,
      showIn: false,
      showOut: false,
      showMove: false,
      showAddPO: false,
      yarnFlag: false,
      mergeLoading: false,
      create_flag: false,
      initData: [],
      selectList: [],
      firstStoreId: '',
      storeLoading: false,
      storeTotal: 1,
      storePage: 1,
      mergeList: [],
      mergeCheckList: [],
      mergeMatList: [],
      mergeTotal: 0,
      mergePage: 1,
      mergeData: {
        store_id: '',
        second_store_id: '',
        store_arr: [],
        material_id: '',
        from_store_total_id: [],
        material_color: '',
        attribute: '',
        color_code: '',
        batch_code: '',
        vat_code: '',
        number: ''
      },
      mergeFilter: {
        store_arr: [],
        store_id: '',
        secondary_id: '',
        name: '',
        color: '',
        attribute: ''
      },
      order_yarn_info: {
        order_id: '',
        client_id: '',
        total_price: '',
        child_data: [
          {
            name: '',
            weight: '',
            color: '白胚',
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
      storeInfoList: [],
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
        color: '',
        store_client_id: '',
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
        store_client_id: '',
        name: '',
        color: '',
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
      createOrEditStoreObj: {
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
      updateId: 0,
      mergeStep: 1
    }
  },
  computed: {
    store_list() {
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 1)
    },
    clientArr() {
      return this.$store.state.api.client.arr.filter((item: any) => item.status === 1 && item.type === 1)
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
    }
  },
  methods: {
    init() {
      this.initData = []
      this.firstStoreId = ''
      this.selectList = []
      this.getStoreInfoList()
      this.getStoreLogList()
      this.getMergeSearchList()
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
      const LV2Name = this.createOrEditStoreObj.LV2_info.filter((itemF: any) => !itemF.name) // 筛选出名字为false
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
          store_client_id: this.storeListFilter.store_client_id || null,
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
              mainRule: ['store_id', 'second_store_id', 'name', 'color', 'attribute', 'store_client_name'],
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

          this.storeListCom.data.forEach((item: any) => {
            item.totalReality = item.store_info.reduce((a: any, b: any) => {
              return a + (b.reality_weight || 0)
            }, 0)
          })

          this.storeListCom.data.sort((a: any, b: any) => {
            return b.totalReality - a.totalReality
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
          store_client_id: '',
          isFilterZero: true,
          page: 1,
          limit: 20,
          total: 1
        }
        this.getStoreInfoList()
      } else if (type === 2) {
        this.storeLogListFilter = {
          LV2_name: '',
          store_client_id: '',
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
    getStoreList() {
      this.storeLoading = true
      store
        .list({
          store_type: 1,
          limit: 5,
          page: this.storePage,
          name: null,
          type: null
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
          store_client_id: this.storeLogListFilter.store_client_id || null,
          store_second_id: this.storeLogListFilter.LV2_name ? this.storeLogListFilter.LV2_name[1] : '',
          name: this.storeLogListFilter.name ? this.storeLogListFilter.name[1] : '',
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
    saveMergeMat() {
      // console.log(this.mergeData)
      if (this.mergeData.store_arr.length === 0) {
        this.$message.error('请选择仓库')
        return
      }
      const formCheck = this.$formCheck(this.mergeData, [
        {
          key: 'name',
          errMsg: '请选择纱线'
        },
        {
          key: 'color',
          errMsg: '请选择颜色'
        },
        {
          key: 'attribute',
          errMsg: '请选择属性'
        },
        {
          key: 'weight',
          errMsg: '请输入合并数量'
        }
      ])
      if (!formCheck) {
        this.mergeData.vat_code = this.mergeData.vat_code || ''
        this.mergeData.color_code = this.mergeData.color_code || ''
        this.mergeData.batch_code = this.mergeData.batch_code || ''
        this.mergeData.store_id = this.mergeData.store_arr[0]
        this.mergeData.second_store_id = this.mergeData.store_arr[1]
        delete this.mergeData.id
        // console.log(this.mergeData)
        store.combineStore(this.mergeData).then((res) => {
          if (res.data.status) {
            this.$message.success('合并成功')
            this.mergeStep = 1
            this.yarnFlag = false
            this.init()
          }
        })
      }
    },
    getMergeCheck(ev: boolean, info: any) {
      if (ev) {
        this.mergeCheckList.push(info)
      } else {
        let checkNum = null
        this.mergeCheckList.forEach((item: any, index: number) => {
          if (item.id === info.id) {
            checkNum = index
          }
        })
        if (checkNum) {
          this.mergeCheckList.splice(checkNum, 1)
        }
      }
    },
    deleteMerge(index: number) {
      this.$deleteItem(this.mergeCheckList, index)
      this.getMergeMatList()
    },
    goMergeStep2() {
      if (this.mergeCheckList.length < 2) {
        this.$message.error('至少选择两个纱线进行合并')
        return
      }
      this.getMergeMatList()
      this.mergeStep = 2
    },
    getMergeMatList() {
      this.mergeCheckList.forEach((item: any) => {
        if (
          !this.mergeMatList.find((itemFind: any) => {
            return itemFind.material_id === item.material_id
          })
        ) {
          this.mergeMatList.push(item)
        }
      })
      this.mergeData.from_store_total_id = this.mergeCheckList.map((item: any) => item.id)
    },
    // 原料颜色搜索
    searchColor(str: string, cb: any) {
      // let results = str ? this.yarnColorList.filter(this.createFilter(str)) : this.yarnColorList.slice(0, 10)
      // // 调用 callback 返回建议列表的数据
      // cb(results)
    },
    // 搜索合并纱线
    getMergeSearchList() {
      this.mergeLoading = true
      store
        .detailYarnList({
          store_id: this.mergeFilter.store_arr ? this.mergeFilter.store_arr[0] : '',
          second_store_id: this.mergeFilter.store_arr ? this.mergeFilter.store_arr[1] : '',
          name: this.mergeFilter.name ? this.mergeFilter.name[1] : '',
          page: this.mergePage,
          limit: 10,
          color: this.mergeFilter.color || null,
          weight: 0,
          vat_code: '',
          color_code: '',
          batch_code: ''
        })
        .then((res) => {
          this.mergeList = res.data.data.items
          this.mergeTotal = res.data.data.total

          this.mergeLoading = false
        })
    },
    openStore(type: number, item: number) {
      if (type === 1) {
        // 入库
        this.initData = [item]
        this.showIn = true
        // @ts-ignore
        this.firstStoreId = item.store_id
      } else if (type === 2) {
        // 出库
        this.initData = [item]
        this.showOut = true
        // @ts-ignore
        this.firstStoreId = item.store_id
      } else if (type === 3) {
        // 移库
        this.initData = [item]
        this.showMove = true
        // @ts-ignore
        this.firstStoreId = item.store_id
      }
    },
    goStore(type: number) {
      if (type === 1) {
        // 入库
        // this.initData = arr[0].store_info
        this.showIn = true
        // this.firstStoreId = arr[0].store_id
        return
      }
      let arr = this.$mergeData(this.selectList, {
        mainRule: ['store_id', 'second_store_id'],
        childrenName: 'store_info'
      })
      if (arr.length === 0) {
        this.$message.error('请先选择纱线，在进行出入库操作')
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
    checkChange(val: boolean, itemInfo: any) {
      if (val) {
        itemInfo.id =
          '' + itemInfo.store_id + itemInfo.second_store_id + itemInfo.name + itemInfo.color + itemInfo.attribute
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
.fz14 {
  * {
    font-size: 14px !important;
  }
}
</style>
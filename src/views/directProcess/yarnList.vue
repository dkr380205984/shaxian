<template>
  <div id="yarnList" class="indexMain" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">加工单信息</span>
        <span
          class="addBtn btn btnMain"
          @click="
            resetProcess()
            create_flag = true
            step = 0
          "
          >添加加工单</span
        >
      </div>
      <div class="listCtn">
        <div class="filterCtn showMore">
          <div class="leftCtn" style="padding:unset;max-width:unset">
            <div class="label">筛选条件：</div>
            <!-- <div class="showMore" @click="showMore = !showMore">{{ !showMore ? '展示更多' : '收起筛选' }}</div> -->
            <div class="elCtn">
              <el-input v-model="code" placeholder="请输入加工单号搜索" @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="client_id" placeholder="选择加工单位" clearable @change="changeRouter(1)">
                <el-option v-for="item in client_arr" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-input v-model="name" placeholder="搜索纱线名称" @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="user_id" clearable placeholder="选择创建人">
                <el-option v-for="item in user_list" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-select v-model="page_size" placeholder="选择每页展示的条数" @change="changeRouter(1)">
                <el-option label="每页10条" :value="10"></el-option>
                <el-option label="每页20条" :value="20"></el-option>
                <el-option label="每页30条" :value="30"></el-option>
              </el-select>
            </div>
            <div class="elCtn middle" style="width: 350px">
              <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeRouter(1)"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="rightCtn" style="min-width:94px">
            <div class="btn btnGray fr" @click="reset">重置</div>
          </div>
        </div>
        <div class="list">
          <el-table :data="list" style="width: 100%" ref="table">
            <el-table-column fixed prop="code" label="加工单号" width="120"> </el-table-column>
            <el-table-column fixed prop="client_name" label="加工单位" width="140"> </el-table-column>
            <el-table-column prop="status" label="加工单状态" width="120">
              <template slot-scope="scope">
                <span
                  :class="{
                    orange: scope.row.status === 1,
                    blue: scope.row.status === 2,
                    green: scope.row.status === 3,
                    gray: scope.row.status === 4
                  }"
                  >{{ scope.row.status | orderStatusFilter }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="is_check" label="审核信息" width="120">
              <template slot-scope="scope">
                <span
                  :class="{
                    orange: !scope.row.is_check,
                    green: scope.row.is_check === 1,
                    red: scope.row.is_check === 2
                  }"
                  >{{ scope.row.is_check | orderCheckFilter }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="纱线名称" width="200">
              <template slot-scope="scope">
                <div class="sortContainer">
                  <div class="sort">
                    <i class="el-icon-caret-top hover" @click="changeIndex(scope.row, 'add')"></i>
                    <div class="number">{{ (scope.row.index || 0) + 1 }}/{{ scope.row.child_data.length }}</div>
                    <i class="el-icon-caret-bottom hover" @click="changeIndex(scope.row, 'delete')"></i>
                  </div>
                  <span>{{ scope.row.child_data[scope.row.index || 0].name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="total_price" label="加工详情" width="220">
              <template slot-scope="scope">
                <span class="green" style="margin-right: 12px">{{ scope.row.type }}</span>
                <span v-if="scope.row.type === '倒筒'">
                  {{ scope.row.child_data[scope.row.index || 0].before_attribute }}
                  <i class="el-icon-d-arrow-right"></i>
                  {{ scope.row.child_data[scope.row.index || 0].after_attribute }}
                </span>
                <span v-if="scope.row.type === '染色'">
                  {{ scope.row.child_data[scope.row.index || 0].before_color }}
                  <i class="el-icon-d-arrow-right"></i>
                  {{ scope.row.child_data[scope.row.index || 0].after_color }}
                </span>
                <span v-if="scope.row.type === '膨纱'">
                  {{ scope.row.child_data[scope.row.index || 0].color }}
                  /
                  {{ scope.row.child_data[scope.row.index || 0].attribute }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="total_price" label="加工数量(kg)" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.child_data[scope.row.index || 0].weight }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="total_weight" label="加工总数(kg)" width="120">
              <template slot-scope="scope">
                <span class="blue">{{ scope.row.total_weight }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="push_weight" label="入库总数(kg)" width="120">
              <template slot-scope="scope">
                <span class="green">{{ scope.row.push_weight }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="total_price" label="下单总价(元)" width="120"> </el-table-column>
            <el-table-column prop="delivery_time" label="交货日期" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.status !== 3" style="display: flex; flex-direction: column">
                  <span>{{ scope.row.delivery_time }}</span>
                  <span
                    :class="{
                      red: $diffByDate(scope.row.delivery_time) <= 0,
                      green: $diffByDate(scope.row.delivery_time) > 7,
                      orange: $diffByDate(scope.row.delivery_time) <= 7 && $diffByDate(scope.row.delivery_time) > 0
                    }"
                  >
                    {{
                      $diffByDate(scope.row.delivery_time) > 0
                        ? '交货还剩' + $diffByDate(scope.row.delivery_time) + '天'
                        : '延期发货' + Math.abs($diffByDate(scope.row.delivery_time)) + '天'
                    }}
                  </span>
                </div>
                <div v-if="scope.row.status === 3" style="display: flex; flex-direction: column">
                  <span>{{ scope.row.delivery_time }}</span>
                  <span class="green">已完成</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="order_time" label="下单日期" width="120"> </el-table-column>
            <el-table-column label="补充说明">
              <template slot-scope="scope">
                <div class="column">
                  <el-image
                    style="width: 50px; height: 50px; line-height: 50px; text-align: center; font-size: 22px"
                    :src="scope.row.file_url"
                    :preview-src-list="[scope.row.file_url]"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="user_name" label="操作人" width="120"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <span class="opr blue" @click="$router.push('/directProcess/yarnDetail/' + scope.row.id)">详情</span>
                <span class="opr orange" @click="openUpdate(scope.row)">修改</span>
                <span class="opr red" @click="openDelete(scope.row.id)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pageCtn">
          <el-pagination background :current-page.sync="page" :page-size="10" layout="prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="popup" v-show="update_flag || create_flag">
      <div class="main" style="width: 1110px">
        <div class="titleCtn">
          <span class="text">添加加工单</span>
          <i class="close_icon el-icon-close" @click="resetProcess"></i>
        </div>
        <div class="contentCtn" v-loading="loadingPro" style="padding: 0; max-height: 800px">
          <div class="createCtn">
            <el-steps v-if="!update_flag" :active="step" process-status="finish" finish-status="success">
              <el-step title="选择仓库"></el-step>
              <el-step title="填写调取数量"></el-step>
              <el-step title="填写加工单"></el-step>
            </el-steps>
            <template v-if="step === 0 || step === 1">
              <div class="listCtn" style="padding: unset; margin-top: 20px">
                <div class="explainCtn" style="margin: 12px 0">
                  <span style="font-weight: bold; font-size: 18px; color: red"
                    >第一步选择仓库，第二步填写调取数量，第三步填写加工单</span
                  >
                </div>
                <div class="filterCtn" style="padding-bottom: 30px">
                  <div class="leftCtn" style="padding-right: unset; max-width: unset">
                    <div class="elCtn">
                      <el-cascader
                        v-model="getYarnStoreObj.LV2_name"
                        :options="store_list"
                        @change="selectList = [];getYarnStoreList($event)"
                        :props="{ value: 'id', label: 'name', children: 'second_data' }"
                        placeholder="请选择仓库"
                      >
                      </el-cascader>
                    </div>
                    <div class="elCtn">
                      <el-cascader
                        v-model="getYarnStoreObj.name"
                        filterable
                        clearable
                        :show-all-levels="false"
                        placeholder="请选择纱线"
                        :options="yarn_list"
                        @change="getYarnStoreList"
                      ></el-cascader>
                    </div>
                    <div class="elCtn">
                      <el-input
                        v-model="getYarnStoreObj.color"
                        @change="getYarnStoreList"
                        placeholder="纱线颜色"
                      ></el-input>
                    </div>
                    <div class="elCtn" style="width: 10%">
                      <el-input
                        v-model="getYarnStoreObj.batch_code"
                        @change="getYarnStoreList"
                        placeholder="批号"
                      ></el-input>
                    </div>
                    <div class="elCtn" style="width: 10%">
                      <el-input
                        v-model="getYarnStoreObj.vat_code"
                        @change="getYarnStoreList"
                        placeholder="缸号"
                      ></el-input>
                    </div>
                    <div class="elCtn" style="width: 10%">
                      <el-input
                        v-model="getYarnStoreObj.color_code"
                        @change="getYarnStoreList"
                        placeholder="色号"
                      ></el-input>
                    </div>
                  </div>
                </div>
                <el-table
                  ref="table"
                  :data="storeList"
                  style="width: 100%"
                >
                  <el-table-column width="220" label="所在仓库">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px"
                        >{{ scope.row.store_name }} / {{ scope.row.second_store_name }}</span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="纱线名"> </el-table-column>
                  <el-table-column prop="attribute" label="纱线属性"> </el-table-column>
                  <el-table-column prop="color" label="颜色"> </el-table-column>
                  <el-table-column prop="batch_code" label="批号"> </el-table-column>
                  <el-table-column prop="vat_code" label="缸号"> </el-table-column>
                  <el-table-column prop="color_code" label="色号"> </el-table-column>
                  <el-table-column prop="use_weight" label="库存数量"> </el-table-column>
                  <el-table-column label="调取数量(必填)" width="120">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.weight" placeholder="调取数量" @change="changeInput($event, scope.row)"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pageCtn" style="margin-top: 20px">
                  <el-pagination
                    background
                    @current-change="getYarnStoreList"
                    :current-page.sync="getYarnStoreObj.storePage"
                    :page-size="10"
                    layout="prev, pager, next"
                    :total="getYarnStoreObj.storeTotal"
                  >
                  </el-pagination>
                </div>
              </div>
            </template>
            <template v-if="step === 2">
              <div v-for="(item, index) in process_info" :key="'process_info' + index">
                <div style="border: 1px solid #e9e9e9" v-if="index !== 0"></div>
                <div class="rowCtn">
                  <div class="colCtn">
                    <div class="label">
                      <span class="text">加工单位</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="content">
                      <div class="elCtn">
                        <el-select placeholder="请选择加工单位" :disabled="update_flag" v-model="item.client_id" @change="$forceUpdate()">
                          <el-option
                            v-for="itemClient in client_arr"
                            :key="itemClient.id"
                            :value="itemClient.id"
                            :label="itemClient.code +'-'+ itemClient.name"
                          ></el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <div class="colCtn">
                    <div class="label">
                      <span class="text">加工类型</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="content">
                      <div class="elCtn">
                        <el-select :disabled="update_flag" placeholder="请选择加工类型" v-model="item.type" @change="$forceUpdate()">
                          <el-option label="倒筒" value="倒筒"></el-option>
                          <el-option label="膨纱" value="膨纱"></el-option>
                          <el-option label="染色" value="染色"></el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <div class="colCtn">
                    <div class="label">
                      <span class="text">下单日期</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="elCtn">
                      <el-date-picker
                        @blur="$forceUpdate()"
                        :disabled='update_flag'
                        v-model="item.order_time"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择下单日期"
                      >
                      </el-date-picker>
                    </div>
                    <!-- <div
                      v-if="index === 0"
                      class="editBtn blue"
                      @click="
                        $addItem(process_info, {
                          transfer_id: '',
                          client_id: '',
                          type: '',
                          price: '',
                          desc: '',
                          order_time: $getDate(new Date()),
                          delivery_time: '',
                          total_price: '',
                          file_url: '',
                          total_additional_fee: 0,
                          additional_fee: [
                            {
                              name: '',
                              price: '',
                              desc: ''
                            }
                          ],
                          child_data: [
                            {
                              name: '',
                              transfer_info_id:'',
                              before_attribute: '',
                              after_attribute: '',
                              before_color: '白胚',
                              after_color: '',
                              color: '',
                              attribute: '',
                              weight: ''
                            }
                          ]
                        })
                      "
                    >
                      添加
                    </div> -->
                    <div class="editBtn red" v-if="!update_flag" @click="process_info.length === 1?$message.error('至少有一个加工单'):$deleteItem(process_info, index)">删除</div>
                  </div>
                </div>
                <div
                  class="rowCtn"
                  v-for="(itemChild, indexChild) in item.child_data"
                  :key="'yarn' + index + indexChild"
                >
                  <div class="colCtn">
                    <div class="label" v-if="indexChild === 0">
                      <span class="text">纱线名称</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="content">
                      <div class="elCtn">
                        <el-select v-if="!update_flag" v-model="itemChild.id" placeholder="请选择纱线" @change="getYarnWeight(index,indexChild)">
                          <el-option
                            v-for="itemName,indexName in child_data_info"
                            :key="itemName.name + 'indexName' + indexName"
                            :label="itemName.name"
                            :value="itemName.id">
                          </el-option>
                        </el-select>
                        <el-cascader
                          v-else
                          disabled
                          v-model="itemChild.name"
                          filterable
                          placeholder="请选择纱线"
                          :options="yarn_list"
                        ></el-cascader>
                      </div>
                    </div>
                  </div>
                  <div class="colCtn">
                    <div class="label" v-if="indexChild === 0">
                      <span class="text">{{
                        item.type ? (item.type === '膨纱' ? '颜色/属性' : '加工前/加工后') : '请选择加工类型'
                      }}</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content flexRow">
                      <div class="elCtn" style="width: 100%" v-if="!item.type">
                        <el-input placeholder="请选择加工类型" v-model="itemChild.color" disabled></el-input>
                      </div>
                      <div class="elCtn" v-if="item.type === '倒筒'">
                        <el-select v-model="itemChild.before_attribute" :disabled="update_flag" placeholder="加工前" style="margin-right: 12px" @change="$forceUpdate()">
                          <el-option label="胚纱"
                            value="胚纱"></el-option>
                          <el-option label="筒纱"
                            value="筒纱"></el-option>
                        </el-select>
                      </div>
                      <div class="elCtn" v-if="item.type === '倒筒'">
                        <el-select v-model="itemChild.after_attribute" placeholder="加工后" @change="$forceUpdate()">
                          <el-option label="胚纱"
                            value="胚纱"></el-option>
                          <el-option label="筒纱"
                            value="筒纱"></el-option>
                        </el-select>
                      </div>
                      <div class="elCtn" v-if="item.type === '膨纱'">
                        <el-input placeholder="颜色" :disabled="update_flag" v-model="itemChild.color" @input="$forceUpdate()"></el-input>
                      </div>
                      <div class="elCtn" v-if="item.type === '膨纱'">
                        <el-select placeholder="属性" :disabled="update_flag" v-model="itemChild.attribute" @change="$forceUpdate()">
                          <el-option label="胚纱"
                            value="胚纱"></el-option>
                          <el-option label="筒纱"
                            value="筒纱"></el-option>
                        </el-select>
                      </div>
                      <div class="elCtn" v-if="item.type === '染色'">
                        <el-input
                          @input="$forceUpdate()"
                          v-model="itemChild.before_color"
                          placeholder="加工前颜色"
                          disabled
                          style="margin-right: 12px"
                        >
                        </el-input>
                      </div>
                      <div class="elCtn" v-if="item.type === '染色'">
                        <el-input v-model="itemChild.after_color" placeholder="加工后颜色" @input="$forceUpdate()"> </el-input>
                      </div>
                    </div>
                  </div>
                  <div class="colCtn">
                    <div class="label" v-if="indexChild === 0">
                      <span class="text">单价/数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content flexRow">
                      <div class="elCtn">
                        <el-input placeholder="单价" type='number' v-model="itemChild.price" @input="$forceUpdate()"> </el-input>
                      </div>
                      <div class="elCtn">
                        <el-input placeholder="数量" type='number' disabled v-model="itemChild.weight"></el-input>
                      </div>
                    </div>
                    <div
                      v-if="indexChild === 0 && !update_flag"
                      class="editBtn blue"
                      @click="
                        $addItem(item.child_data, {
                          name: '',
                          transfer_info_id:'',
                          before_attribute: '',
                          after_attribute: '',
                          before_color: '白胚',
                          after_color: '',
                          color: '',
                          attribute: '',
                          weight: ''
                        })
                        $forceUpdate()
                      "
                    >
                      添加
                    </div>
                    <div v-if="indexChild > 0 && !update_flag" class="editBtn red" @click="$deleteItem(item.child_data, indexChild);$forceUpdate()">
                      删除
                    </div>
                  </div>
                </div>
                <div class="rowCtn" v-for="(itemAdd, indexAdd) in item.additional_fee" :key="'fee' + index + indexAdd">
                  <div class="colCtn">
                    <div class="label" v-if="indexAdd === 0">
                      <span class="text">额外费用名称</span>
                      <span class="explanation">(选填)</span>
                    </div>
                    <div class="content">
                      <div class="elCtn">
                        <el-input v-model="itemAdd.name" placeholder="请选择额外费用名称" @input="$forceUpdate()"> </el-input>
                      </div>
                    </div>
                  </div>
                  <div class="colCtn">
                    <div class="label" v-if="indexAdd === 0">
                      <span class="text">额外费用金额</span>
                      <span class="explanation">(选填)</span>
                    </div>
                    <div class="content">
                      <div class="elCtn">
                        <el-input v-model="itemAdd.price" placeholder="请输入额外费用金额" @input="$forceUpdate()">
                          <template slot="append">元</template>
                        </el-input>
                      </div>
                    </div>
                  </div>
                  <div class="colCtn">
                    <div class="label" v-if="indexAdd === 0">
                      <span class="text">额外费用备注</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="elCtn">
                      <el-input v-model="itemAdd.desc" placeholder="请输入额外费用备注" @input="$forceUpdate()"></el-input>
                    </div>
                    <div
                      v-if="indexAdd === 0"
                      class="editBtn blue"
                      @click="
                        $addItem(item.additional_fee, {
                          name: '',
                          price: '',
                          desc: ''
                        })
                      "
                    >
                      添加
                    </div>
                    <div v-if="indexAdd > 0" class="editBtn red" @click="$deleteItem(item.additional_fee, indexAdd)">
                      删除
                    </div>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn" style="max-width: 276.72px">
                    <div class="label">
                      <span class="text">交货日期</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="content">
                      <div class="elCtn">
                        <el-date-picker
                          @blur="$forceUpdate()"
                          v-model="item.delivery_time"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择交货日期"
                        >
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
                        <el-input v-model="item.desc" placeholder="请输入备注信息"></el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn">
                    <div class="label">
                      <span class="text">图片补充说明</span>
                      <span class="explanation">(选填)</span>
                    </div>
                    <el-upload
                      class="upload"
                      action="https://upload.qiniup.com/"
                      accept="image/jpeg,image/gif,image/png,image/bmp"
                      :before-upload="beforeAvatarUpload"
                      :multiple="false"
                      :data="postData"
                      :limit="1"
                      :file-list="item.file_url ? [{ name: '说明文件', url: item.file_url }] : []"
                      :on-success="function(response){return successFile(response, index)}"
                      ref="uploada"
                      list-type="picture"
                    >
                      <div class="uploadBtn">
                        <i class="el-icon-upload"></i>
                        <span>上传文件</span>
                      </div>
                      <div slot="tip" class="el-upload__tip">只能上传一张jpg/png图片文件，且不超过10M</div>
                    </el-upload>
                  </div>
                </div>
              </div>
            </template>
            <div class="btnCtn">
              <div class="btn backHoverBlue" v-if="!update_flag && step === 2" @click="$addItem(process_info, {
                  transfer_id: '',
                  client_id: '',
                  type: '',
                  price: '',
                  desc: '',
                  order_time: $getDate(new Date()),
                  delivery_time: '',
                  total_price: '',
                  file_url: '',
                  total_additional_fee: 0,
                  additional_fee: [
                    {
                      name: '',
                      price: '',
                      desc: ''
                    }
                  ],
                  child_data: [
                    {
                      name: '',
                      transfer_info_id:'',
                      before_attribute: '',
                      after_attribute: '',
                      before_color: '白胚',
                      after_color: '',
                      color: '',
                      attribute: '',
                      weight: ''
                    }
                  ]
                })">
                添加加工单
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr" style="padding-left: 8px" @click="resetProcess">取消</div>
          <div class="opr" :class="{ blue: create_flag, orange: update_flag }" @click="saveProcess">
            {{ create_flag ? '下一步' : '确认修改' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { yarnProcess, store, stock } from '@/assets/js/api'
import { ProcessYarn } from '@/types/orderProcessYarn'
export default Vue.extend({
  data(): {
    process_info: Array<ProcessYarn>
    [PropName: string]: any
  } {
    return {
      loading: true,
      create_flag: false,
      update_flag: false,
      loadingPro: false,
      select_store_id: '',
      second_select_store_id: '',
      step: 0,
      page: 1,
      total: 1,
      uploadIndex: '',
      page_size: 10,
      showMore: false,
      client_id: '',
      code: '',
      name: '',
      status: '',
      date: [],
      user_id: '',
      child_data_info: [],
      list: [],
      storeList: [],
      selectList: [],
      getYarnStoreObj: {
        store_id: '',
        second_store_id: '',
        name: '',
        LV2_name: '',
        color: '',
        batch_code: '',
        vat_code: '',
        color_code: '',
        storePage: 1,
        storeTotal: 1
      },
      process_info: [
        {
          transfer_id: '',
          client_id: '',
          type: '',
          price: '',
          desc: '',
          order_time: this.$getDate(new Date()),
          delivery_time: '',
          total_price: '',
          file_url: '',
          total_additional_fee: 0,
          additional_fee: [
            {
              name: '',
              price: '',
              desc: ''
            }
          ],
          child_data: [
            {
              name: '',
              transfer_info_id:'',
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
      ],
      postData: { key: '', token: '' }
    }
  },
  watch: {
    page(newVal) {
      this.changeRouter(newVal)
    },
    $route() {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  computed: {
    client_arr() {
      return this.$store.state.api.supplier.arr.filter(
        (item: any) =>
          item.client_type === '染色单位' || item.client_type === '膨纱单位' || item.client_type === '倒筒单位'
      )
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
    store_list() {
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 1)
    },
    token() {
      return this.$store.state.status.token
    }
  },
  methods: {
    changeRouter(page: string) {
      const pages = page || 1
      this.$router.push(
        '/directProcess/yarnList?page=' +
          pages +
          '&code=' +
          this.code +
          '&name=' +
          this.name +
          '&client_id=' +
          this.client_id +
          '&user_id=' +
          this.user_id +
          '&page_size=' +
          this.page_size +
          '&date=' +
          this.date
      )
    },
    reset() {
      this.$router.push('/directProcess/yarnList?page=1&code=&name=&client_id=&user_id=&page_size=10&date=')
    },
    getFilters() {
      const params = this.$route.query
      this.page = Number(params.page)
      this.page_size = Number(params.page_size)
      this.user_id = params.user_id ? Number(params.user_id) : ''
      this.client_id = params.client_id ? Number(params.client_id) : ''
      this.name = params.name
      this.code = params.code
      if (params.date !== 'null' && params.date !== '') {
        this.date = (params.date as string).split(',')
      } else {
        this.date = []
      }
    },
    getList() {
      this.loading = true
      yarnProcess
        .list({
          code: this.code,
          client_id: this.client_id,
          user_id: this.user_id,
          start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          end_time: this.date && this.date.length > 0 ? this.date[1] : '',
          page: this.page,
          limit: this.page_size
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
          this.list.forEach((item: any) => {
            item.total_weight = item.child_data.reduce((total: number, current: any) => {
              return total + +current.weight
            }, 0).toFixed(1)
          })
          this.loading = false
          this.$forceUpdate()
        })
    },
    // 下面两个函数是让el-table滚动的
    scrollFunction(obj: any, id: any) {
      obj = document.getElementById(id)
      if (obj.attachEvent) {
        obj.attachEvent('onmousewheel', this.mouseScroll(obj))
      } else if (obj.addEventListener) {
        obj.addEventListener('DOMMouseScroll', this.mouseScroll(obj), false)
      }
      obj.onmousewheel = obj.onmousewheel = this.mouseScroll(obj)
    },
    changeInput(ev: any, itemInfo: any) {
      if(!ev){
        let index = this.selectList.findIndex((item:any) => {
          return item.id === itemInfo.id
        })
        if(typeof index === 'number'){
          this.$deleteItem(this.selectList,index)
        }
      } else {
        if(!this.selectList.find((item:any) => {
          return item.id === itemInfo.id
        })){
          this.selectList.push(itemInfo)
        }
      }
      itemInfo.weight = ev
    },
    getYarnStoreList() {
      if(!this.getYarnStoreObj.LV2_name){
        return
      }
      this.step = 1
      this.loadingPro = true
      store
        .detailYarnList({
          store_id: this.getYarnStoreObj.LV2_name ? this.getYarnStoreObj.LV2_name[0] : '',
          second_store_id: this.getYarnStoreObj.LV2_name ? this.getYarnStoreObj.LV2_name[1] : '',
          name: this.getYarnStoreObj.name ? this.getYarnStoreObj.name[1] : '',
          page: this.getYarnStoreObj.storePage || 1,
          limit: this.getYarnStoreObj.limit || 10,
          color: this.getYarnStoreObj.color || null,
          weight: 0,
          vat_code: this.getYarnStoreObj.vat_code || null,
          color_code: this.getYarnStoreObj.color_code || null,
          batch_code: this.getYarnStoreObj.batch_code || null
        })
        .then((res) => {
          res.data.data.items.forEach((item:any) => {
            this.selectList.forEach((itemSel:any) => {
              if(item.id === itemSel.id){
                item.weight = itemSel.weight
              }
            });
          });
          this.storeList = res.data.data.items
          this.getYarnStoreObj.storeTotal = res.data.data.total
          this.loadingPro = false
        })
    },
    mouseScroll(obj: any) {
      return function () {
        let e = window.event || document.all ? window.event : arguments[0] ? arguments[0] : event
        let detail, moveForwardStep, moveBackStep
        let step = 0
        if (e.wheelDelta) {
          // google 下滑负数： -120
          detail = e.wheelDelta
          moveForwardStep = -1
          moveBackStep = 1
        } else if (e.detail) {
          // firefox 下滑正数：3
          // @ts-ignore
          detail = event.detail
          moveForwardStep = 1
          moveBackStep = -1
        }
        // @ts-ignore
        step = detail > 0 ? moveForwardStep * 100 : moveBackStep * 100
        // e.preventDefault()
        let left = obj.querySelector('table').clientWidth - obj.clientWidth
        //这里是为了向右滚动后再向下滚动，向左滚动后再向上滚动，如果不需要，只需要写e.preventDefault()
        //-------------------
        if (moveForwardStep === -1) {
          //google
          if (detail > 0) {
            //向上
            if (obj.scrollLeft > 0) {
              e.preventDefault()
            } else {
              return true
            }
          } else {
            if (obj.scrollLeft < left) {
              e.preventDefault()
            } else {
              return true
            }
          }
        } else {
          //firefox
          if (detail > 0) {
            //向下
            if (obj.scrollLeft < left) {
              e.preventDefault()
            } else {
              return true
            }
          } else {
            if (obj.scrollLeft > 0) {
              e.preventDefault()
            } else {
              return true
            }
          }
        }
        //--------------------
        obj.scrollLeft = obj.scrollLeft + step
      }
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
    successFile(response: any,index:number) {
      this.process_info[index].file_url = 'https://file.zwyknit.com/' + response.key
    },
    resetProcess() {
      this.create_flag = false
      this.update_flag = false
      this.getYarnStoreObj.LV2_name = ''
      this.storeList = []
      this.process_info = [
        {
          transfer_id: '',
          client_id: '',
          type: '',
          price: '',
          desc: '',
          order_time: this.$getDate(new Date()),
          delivery_time: '',
          total_price: '',
          file_url: '',
          total_additional_fee: 0,
          additional_fee: [
            {
              name: '',
              price: '',
              desc: ''
            }
          ],
          child_data: [
            {
              name: '',
              transfer_info_id:'',
              before_attribute: '',
              after_attribute: '',
              before_color: '白胚',
              after_color: '',
              color: '',
              attribute: '',
              weight: '',
              price: ''
            }
          ]
        }
      ]
    },
    // 选择仓库
    changeStoreData() {
      if (this.selectList.length === 0) {
        this.$message.error('请至少填写一个调取数量')
        return
      }

      let arr = this.$mergeData(this.selectList, {
        mainRule: ['store_id', 'second_store_id'],
        childrenName: 'child_data'
      })
      if (arr.length > 1) {
        this.$message.error('只能选择相同仓库和相同二级仓库的下的纱线进行加工操作')
        return
      }
      let params = {
        order_id: null,
        related_id: null,
        action_type: 16,
        complete_time: this.$getDate(new Date()),
        desc: null,
        store_id: arr[0].store_id,
        second_store_id: arr[0].second_store_id,
        move_store_id: null,
        move_second_store_id: null,
        client_id: null,
        child_data: arr[0].child_data.map((item: any) => {
          return {
            name: Array.isArray(item.name) ? item.name[1] : item.name,
            action_weight: item.weight || 0,
            color: item.color,
            attribute: item.attribute,
            batch_code: item.batch_code || '',
            color_code: item.color_code || '',
            vat_code: item.vat_code || '',
            item: null,
            related_info_id: '',
            desc: ''
          }
        })
      }
      stock
        // @ts-ignore
        .create({data:[params]})
        .then((res) => {
          this.getStockDetail(res.data.data[0])
        })
      this.step = 2
    },
    getYarnWeight(index:number,indexChild:number){
      let itemName = this.process_info[index].child_data[indexChild]
      let a = this.child_data_info.find((item:any) =>{
        // @ts-ignore
        return item.id === itemName.id
      })
      itemName.weight = a.action_weight
      itemName.transfer_info_id = a.id
      itemName.name = a.name
      this.$forceUpdate()
    },
    getStockDetail(id:number){
      stock.detail({id}).then(res => {
        let data = res.data.data
        console.log(data)
        this.process_info[0] = {
            transfer_id: data.id,
            client_id: '',
            type: '',
            price: '',
            desc: '',
            order_time: this.$getDate(new Date()),
            delivery_time: '',
            total_price: '',
            file_url: '',
            total_additional_fee: 0,
            additional_fee: [
              {
                name: '',
                price: '',
                desc: ''
              }
            ],
            child_data: res.data.data.child_data.map((item:any) => {
              return {
                name: item.name,
                transfer_info_id: item.id || '',
                id: item.id || '',
                before_attribute: '',
                after_attribute: '',
                before_color: '白胚',
                after_color: '',
                color: '',
                attribute: '',
                weight: item.action_weight,
              }
            }),
          }
          this.child_data_info = data.child_data
      })
    },
    saveProcess() {
      if (this.step === 0) {
        this.$message.error('请先选择仓库')
        return
      }
      if (this.step === 1) {
        this.changeStoreData()
        return
      }

      let err = false
      this.process_info.forEach((item) => {
        // if(!item.name)
        if (!item.client_id) {
          this.$message.error('请选择加工单位')
          err = true
          throw new Error('未选择必填项')
        }
        if (!item.delivery_time) {
          this.$message.error('请选择交货日期')
          err = true
          throw new Error('未选择必填项')
        }
        item.child_data.forEach((itemChild) => {
          if (!itemChild.name) {
            this.$message.error('请选择纱线名称')
            err = true
            throw new Error('未选择必填项')
          }

          if (!(itemChild.price || itemChild.price === 0)) {
            this.$message.error('请输入单价')
            err = true
            throw new Error('未选择必填项')
          }

          if (!(itemChild.weight || itemChild.weight === 0)) {
            this.$message.error('请输入数量')
            err = true
            throw new Error('未选择必填项')
          }
        })
      })

      if (err) return
      this.loading = true

      this.process_info.forEach((item) => {
        item.child_data.forEach((itemChild) => {
          itemChild.name = itemChild.name.constructor === Array ? itemChild.name[1] : itemChild.name
        })
        item.total_price =
          item.child_data.reduce((total, current: any) => {
            return total + current.weight * current.price
          }, 0) +
          (item.additional_fee as any[]).reduce((total, current) => {
            return total + Number(current.price || 0)
          }, 0)
        item.total_additional_fee = (item.additional_fee as any[]).reduce((total, current) => {
          return total + Number(current.price || 0)
        }, 0)
        item.additional_fee =
          (item.additional_fee as any[]).filter((itemChild) => itemChild.name && itemChild.price).length > 0
            ? JSON.stringify(item.additional_fee)
            : ''
      })
      yarnProcess
        .create({
          order_id: '',
          data: this.process_info
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.resetProcess()
            this.getList()
            this.loading = false
          }
        })
    },
    openDelete(id: number) {
      this.$confirm('是否删除该订购单', '提示', {
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
                this.getList()
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
    openUpdate(info: ProcessYarn) {
      const selfInfo = JSON.parse(JSON.stringify(info))
      this.update_flag = true
      this.step = 2
      selfInfo.additional_fee = selfInfo.additional_fee
        ? JSON.parse(info.additional_fee as string)
        : [
            {
              name: '',
              price: '',
              desc: ''
            }
          ]
      this.process_info = [selfInfo]
    }
  },
  mounted() {
    //@ts-ignore id为scoll已经被el-table使用，可以使el-table滚动
    let domObj = this.$refs.table.bodyWrapper
    domObj.id = 'scrollBar'
    this.scrollFunction(domObj, 'scrollBar')
    this.$checkCommonInfo([
      {
        checkWhich: 'api/client',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPartyBAsync'
      },
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
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
        checkWhich: 'status/token',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getTokenAsync'
      }
    ])
    this.getFilters()
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/directProcess/yarnList.less';
</style>

<style>
/* el-table 自定义滚动条的时候没有白线 */
.el-table__fixed-right::before,
.el-table__fixed::before {
  content: unset;
}
.el-date-editor.el-input{
  width:100%;
}
</style>
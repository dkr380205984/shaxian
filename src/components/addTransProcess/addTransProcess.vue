<template>
  <div id="addTransProcess" class="popup" v-show="update_flag || create_flag">
    <div class="main" style="width: 1300px">
      <div class="titleCtn">
        <span class="text">{{ update_flag ? '修改' : '添加' }}加工单</span>
        <i class="close_icon el-icon-close" @click="close"></i>
      </div>
      <div class="contentCtn" v-loading="loading" style="padding: 0; max-height: 800px">
        <div class="createCtn" style="max-height: 700px;overflow:scroll">
          <el-steps v-if="!update_flag" :active="step" process-status="finish" finish-status="success">
            <el-step title="选择仓库"></el-step>
            <el-step title="填写调取数量"></el-step>
            <el-step title="填写加工单"></el-step>
          </el-steps>
          <template v-if="step === 0 || step === 1">
            <div class="listCtn" style="padding: unset; margin-top: 20px">
              <div class="explainCtn" style="margin: 12px 0">
                <span style="font-weight: bold; font-size: 18px; color: red"
                  >第一步选择仓库{{
                    yarnList.length > 0 ? '和纱线名称' : ''
                  }}，第二步填写调取数量，第三步填写加工单</span
                >
              </div>
              <div class="filterCtn" style="padding-bottom: 30px;max-height:unset">
                <div class="leftCtn" style="padding-right: unset; max-width: unset">
                  <div class="elCtn">
                    <el-cascader
                      v-model="getYarnStoreObj.LV2_name"
                      :options="store_list"
                      @change="
                        selectList = []
                        getYarnStoreList($event)
                      "
                      :props="{ value: 'id', label: 'name', children: 'second_data' }"
                      placeholder="请选择仓库"
                    >
                    </el-cascader>
                  </div>
                  <div class="elCtn">
                    <el-select
                      v-if="yarnList.length > 0"
                      v-model="getYarnStoreObj.name"
                      filterable
                      @change="getYarnStoreList"
                      placeholder="请选择纱线"
                      :options="yarn_list"
                    >
                      <el-option
                        v-for="(itemYarn, indexYarn) in yarn_list"
                        :key="indexYarn + '请选择纱线'"
                        :label="itemYarn.label"
                        :value="itemYarn.value"
                      ></el-option>
                    </el-select>
                    <el-cascader
                      v-else
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
                  <div class="elCtn">
                    <el-select placeholder="所属客户" v-model="getYarnStoreObj.store_client_id" @change="getYarnStoreList" filterable clearable>
                      <el-option
                        v-for="item in clientArr"
                        :key="item.id"
                        :value="item.id"
                        :label="(item.code || item.id) + ' - ' + item.name"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="elCtn">
                    <!-- <el-tooltip class="item" effect="dark" content="" placement="top-start"> -->
                      <el-checkbox v-model="getYarnStoreObj.isFilterZero" @change="getYarnStoreList">过滤库存数量&lt;=0的库存</el-checkbox>
                    <!-- </el-tooltip> -->
                  </div>
                  <div class="elCtn">
                    <el-input
                      v-model="getYarnStoreObj.batch_code"
                      @change="getYarnStoreList"
                      placeholder="批号"
                    ></el-input>
                  </div>
                  <div class="elCtn">
                    <el-input
                      v-model="getYarnStoreObj.color_code"
                      @change="getYarnStoreList"
                      placeholder="色号"
                    ></el-input>
                  </div>
                  <div class="elCtn">
                    <el-input
                      v-model="getYarnStoreObj.vat_code"
                      @change="getYarnStoreList"
                      placeholder="缸号"
                    ></el-input>
                  </div>
                </div>
              </div>
              <el-table ref="table" :data="storeList" style="width: 100%">
                <el-table-column width="220" label="所在仓库">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px"
                      >{{ scope.row.store_name }} / {{ scope.row.second_store_name }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column width="220" prop="name" label="纱线名"> </el-table-column>
                <el-table-column prop="attribute" label="纱线属性"> </el-table-column>
                <el-table-column prop="color" label="颜色"> </el-table-column>
                <el-table-column prop="store_client_name" label="所属客户">
                  <template slot-scope="scope">
                    {{scope.row.store_client_name || '无'}}
                  </template>
                </el-table-column>
                <el-table-column prop="batch_code" label="批号"> </el-table-column>
                <el-table-column prop="vat_code" label="缸号"> </el-table-column>
                <el-table-column prop="color_code" label="色号"> </el-table-column>
                <el-table-column prop="total_weight" label="库存数量"> </el-table-column>
                <el-table-column label="调取数量(必填)" width="120">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.weight"
                      placeholder="调取数量"
                      @change="changeInput($event, scope.row)"
                    ></el-input>
                  </template>
                </el-table-column>
              </el-table>
              <div v-if="yarnInfoList.length > 0 && getYarnStoreObj.name">【{{getYarnStoreObj.name}}】预计调取加工数量：{{totalProcessWeight}}kg</div>
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
                    <span class="explanation">
                      (必选)
                      <el-tooltip class="item"
                        effect="dark"
                        content="设置成功后请点击此按钮刷新数据"
                        placement="top">
                        <i class="el-icon-refresh hoverGreen"
                          style="line-height:46px;font-size:18px;margin-left:8px;cursor:pointer"
                          @click="$checkCommonInfo([{
                            checkWhich: 'api/client',
                            getInfoMethed: 'dispatch',
                            getInfoApi: 'getPartyBAsync',
                            forceUpdate:true
                          }])"></i>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="添加客户" placement="top">
                        <i
                          class="el-icon-upload hoverOrange"
                          style="line-height: 38px; font-size: 18px; cursor: pointer; margin-left: 8px"
                          @click="$openUrl('/settings/factory')"
                        ></i>
                      </el-tooltip>
                    </span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-select
                        placeholder="请选择加工单位"
                        :disabled="update_flag"
                        v-model="item.client_id"
                        @change="$forceUpdate()"
                      >
                        <el-option
                          v-for="itemClient in client_arr"
                          :key="itemClient.id"
                          :value="itemClient.id"
                          :label="itemClient.code + '-' + itemClient.name"
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
                      <el-select
                        :disabled="update_flag"
                        placeholder="请选择加工类型"
                        v-model="item.type"
                        @change="changeType($event, item)"
                      >
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
                      :disabled="update_flag"
                      v-model="item.order_time"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择下单日期"
                    >
                    </el-date-picker>
                  </div>
                  <div
                    class="editBtn red"
                    v-if="!update_flag"
                    @click="
                      process_info.length === 1 ? $message.error('至少有一个加工单') : $deleteItem(process_info, index)
                    "
                  >
                    删除
                  </div>
                </div>
              </div>
              <div class="rowCtn" v-for="(itemChild, indexChild) in item.child_data" :key="'yarn' + index + indexChild">
                <div class="colCtn">
                  <div class="label" v-if="indexChild === 0">
                    <span class="text">纱线名称</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="content">
                    <div class="elCtn">
                      <el-select
                        v-if="!update_flag"
                        v-model="itemChild.id"
                        placeholder="请选择纱线"
                        @change="getYarnWeight(index, indexChild)"
                      >
                        <el-option
                          v-for="(itemName, indexName) in child_data_info"
                          :key="itemName.name + 'indexName' + indexName"
                          :label="itemName.name"
                          :value="itemName.id"
                        >
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
                  <div style="display:flex;align-items:center">
                    <div class="label" v-if="indexChild === 0">
                      <span class="text">{{
                      item.type ? (item.type === '膨纱' ? '颜色/属性' : '加工前/加工后') : '请选择加工类型'
                    }}</span>
                    <span class="explanation">(必填)</span>
                    </div>
                  </div>
                  <div class="content flexRow">
                    <div class="elCtn" style="width: 100%" v-if="!item.type">
                      <el-input placeholder="请选择加工类型" v-model="itemChild.color" disabled></el-input>
                    </div>
                    <div class="elCtn" v-if="item.type === '倒筒'">
                      <el-select
                        v-model="itemChild.before_attribute"
                        :disabled="update_flag"
                        placeholder="加工前"
                        style="margin-right: 12px"
                        @change="daoTong($event, 'before_attribute', itemChild)"
                      >
                        <el-option label="绞纱" value="绞纱"></el-option>
                        <el-option label="筒纱" value="筒纱"></el-option>
                      </el-select>
                    </div>
                    <div class="elCtn" v-if="item.type === '倒筒'">
                      <el-select
                        v-model="itemChild.after_attribute"
                        placeholder="加工后"
                        @change="daoTong($event, 'after_attribute', itemChild)"
                      >
                        <el-option label="绞纱" value="绞纱"></el-option>
                        <el-option label="筒纱" value="筒纱"></el-option>
                      </el-select>
                    </div>
                    <div class="elCtn" v-if="item.type === '膨纱'">
                      <el-input
                        placeholder="颜色"
                        :disabled="update_flag"
                        v-model="itemChild.color"
                        @input="$forceUpdate()"
                      ></el-input>
                    </div>
                    <div class="elCtn" v-if="item.type === '膨纱'">
                      <el-select
                        placeholder="属性"
                        :disabled="update_flag"
                        v-model="itemChild.attribute"
                        @change="$forceUpdate()"
                      >
                        <el-option label="绞纱" value="绞纱"></el-option>
                        <el-option label="筒纱" value="筒纱"></el-option>
                        <el-option label="膨纱" value="膨纱"></el-option>
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
                      <el-input v-model="itemChild.after_color" placeholder="加工后颜色" @input="$forceUpdate()">
                      </el-input>
                    </div>
                  </div>
                  <div v-if="itemChild.before_color && itemChild.before_color.indexOf('白') === -1 && item.type === '染色'" style="color:red;margin-top:5px">
                    该纱线不是白绞纱，可能无法进行染色
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label" v-if="indexChild === 0">
                    <span class="text">单价/数量</span>
                    <span class="explanation">(必填)</span>
                    <el-tooltip class="item" effect="dark" content="统一单价" placement="top">
                      <svg
                        class="iconFont copyIcon hoverBlue"
                        aria-hidden="true"
                        style="cursor:pointer"
                        @click="copyInfo('price')"
                      >
                        <use xlink:href="#icon-tongbushuju1"></use>
                      </svg>
                    </el-tooltip>
                  </div>
                  <div class="content flexRow">
                    <div class="elCtn">
                      <el-input placeholder="单价" type="number" v-model="itemChild.price" @input="$forceUpdate()">
                      </el-input>
                    </div>
                    <div class="elCtn">
                      <el-input placeholder="数量" type="number" @input="$forceUpdate()" v-model="itemChild.weight"></el-input>
                      <!-- <el-input placeholder="数量" type="number" :disabled='item.type !== "染色"' @input="$forceUpdate()" v-model="itemChild.weight"></el-input> -->
                    </div>
                  </div>
                  <div
                    v-if="indexChild === 0 && !update_flag"
                    class="editBtn blue"
                    @click="
                      $addItem(item.child_data, {
                        name: '',
                        transfer_info_id: '',
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
                  <div
                    v-if="indexChild > 0 && !update_flag"
                    class="editBtn red"
                    @click="
                      $deleteItem(item.child_data, indexChild)
                      $forceUpdate()
                    "
                  >
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
                      <el-input v-model="itemAdd.name" placeholder="请选择额外费用名称" @input="$forceUpdate()">
                      </el-input>
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
                    <el-input
                      v-model="itemAdd.desc"
                      placeholder="请输入额外费用备注"
                      @input="$forceUpdate()"
                    ></el-input>
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
                      $forceUpdate()
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
                      <el-input v-model="item.desc" @input="$forceUpdate()" placeholder="请输入备注信息"></el-input>
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
                    :on-success="function (response) {return successFile(response, index)}"
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
            <div
              class="btn backHoverBlue"
              v-if="!update_flag && step === 2"
              @click="addChildData"
            >
              添加加工单
            </div>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <div class="opr" style="padding-left: 8px" @click="close">取消</div>
        <div class="opr" :class="{ blue: create_flag, orange: update_flag }" @click="saveProcess">
          {{ create_flag ? (step === 2 ? '提交' : '下一步') : '确认修改' }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { stock, store, yarnProcess } from '@/assets/js/api'
export default Vue.extend({
  props: {
    orderId: {
      type: String,
      default: ''
    },
    yarnList: {
      type: Array,
      default:function(){
        return []
      }
    },
    update_flag: {
      type: Boolean,
      default: false
    },
    create_flag: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: {}
    },
    yarnInfoList:{
      type: Array,
      default:function(){
        return []
      }
    }
  },
  data(): any {
    return {
      loading: false,
      cvFlag: false,
      dialogVisible: false,
      dialogImageUrl: '',
      step: 0,
      totalProcessWeight: 0,
      total_number: 0,
      diaoquNumber: 0,
      processData:{},
      storeList: [],
      getYarnStoreObj: {
        store_id: '',
        second_store_id: '',
        store_client_id: '',
        name: '',
        LV2_name: '',
        color: '',
        batch_code: '',
        vat_code: '',
        color_code: '',
        isFilterZero:true,
        storePage: 1,
        storeTotal: 1
      },
      postData: { key: '', token: '' },
      store_info: {
        action_type: 3,
        select_id: '',
        client_name: '',
        client_id: '',
        complete_time: this.$getDate(new Date()),
        desc: '',
        related_id: '',
        child_data: [
          {
            action_weight: '',
            attribute: '',
            batch_code: '',
            color: '',
            color_code: '',
            desc: '',
            item: '',
            name: '',
            related_info_id: '',
            vat_code: ''
          }
        ]
      },
      child_data_info: [],
      process_info: [
        {
          transfer_id: '',
          client_id: '',
          type: '',
          price: '',
          desc: '',
          order_time: this.$getDate(new Date()),
          delivery_time: this.$getDate(new Date()),
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
              transfer_info_id: '',
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
    }
  },
  computed: {
    yarn_list() {
      if (this.yarnList.length > 0) {
        return this.yarnList
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
    },
    store_list() {
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 1)
    },
    client_arr() {
      return this.$store.state.api.supplier.arr.filter(
        (item: any) =>
          item.client_type === '染色单位' || item.client_type === '膨纱单位' || item.client_type === '倒筒单位'
      )
    },
    clientArr() {
      return this.$store.state.api.client.arr.filter((item: any) => item.status === 1 && item.type === 1)
    },
    token() {
      return this.$store.state.status.token
    }
  },
  methods: {
    close() {
      if(this.trans_id){
        stock
          .delete({
            id:this.trans_id
          }).then(res => {
            if(res.data.status){
              this.$message.success('已成功删除关联调取单')
            }
          })
      }
      this.$emit('close')
      this.resetProcess()
    },
    copyInfo(type: string) {
      this.process_info.forEach((item: any, index: number) => {
        item.child_data.forEach((itemChild: any, indexChild: number) => {
          itemChild[type] = item.child_data[0][type]
        })
      })
      this.$forceUpdate()
    },
    getYarnWeight(index: number, indexChild: number) {
      let itemName = this.process_info[index].child_data[indexChild]
      let a = this.child_data_info.find((item: any) => {
        // @ts-ignore
        return item.id === itemName.id
      })
      itemName.weight = a.action_weight
      itemName.transfer_info_id = a.id
      itemName.name = a.name
      this.$forceUpdate()
    },
    changeType(ev: any, item: any) {
      // console.log(ev,item)
      item.child_data.forEach((itemChild: any) => {
        if (ev === '倒筒') {
          itemChild.afterColor = itemChild.after_color?itemChild.after_color:itemChild.afterColor
          itemChild.before_attribute = itemChild.attributeName
          itemChild.after_attribute =
            itemChild.attributeName === '绞纱' ? '筒纱' : itemChild.attributeName === '筒纱' ? '绞纱' : ''
          itemChild.color = ''
          itemChild.attribute = ''
          itemChild.after_color = ''
          itemChild.before_color = ''
        } else if (ev === '膨纱') {
          itemChild.afterColor = itemChild.after_color?itemChild.after_color:itemChild.afterColor
          itemChild.color = '膨纱'
          itemChild.attribute = '膨纱'
          itemChild.after_attribute = ''
          itemChild.before_attribute = ''
          itemChild.after_color = ''
          itemChild.before_color = ''
        } else if(ev === '染色') {
          itemChild.color = ''
          itemChild.attribute = ''
          itemChild.after_attribute = ''
          itemChild.before_attribute = ''
          itemChild.before_color = itemChild.colorName || '白胚'
          itemChild.after_color = itemChild.after_color?itemChild.after_color:itemChild.afterColor
        }
      })
      this.$forceUpdate()
    },
    daoTong(ev: any, type: any, item: any) {
      if (type === 'before_attribute') {
        if (ev === '筒纱') {
          item.after_attribute = '绞纱'
        } else {
          item.after_attribute = '筒纱'
        }
      } else {
        if (ev === '筒纱') {
          item.before_attribute = '绞纱'
        } else {
          item.before_attribute = '筒纱'
        }
      }
      this.$forceUpdate()
    },
    getStockDetail(id: number) {
      this.trans_id = id
      stock.detail({ id }).then((res) => {
        let data = res.data.data
        this.processData = res.data.data
        this.diaoquNumber = data.child_data[0].action_weight
        this.process_info[0] = {
          transfer_id: data.id,
          client_id: '',
          type: '',
          price: '',
          desc: '',
          order_time: this.$getDate(new Date()),
          delivery_time: this.$getDate(new Date()),
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
          child_data: data.child_data.map((item: any) => {
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
              colorName: item.color || '',
              attributeName: item.attribute || '',
              weight: item.action_weight
            }
          })
        }
        if(this.yarnInfoList.length > 0){
          let a = this.yarnInfoList.find((item:any) => {
            return item.name === data.child_data[0].name
          })
          this.process_info[0].child_data = []
          a.child_data.forEach((item:any) => {
            this.process_info[0].child_data.push({
              name: a.name,
              transfer_info_id: data.child_data.find((item:any) => {
                return item.name === a.name
              })?.id || '',
              id: data.child_data[0].id || '',
              before_attribute: '',
              after_attribute: '',
              before_color: data.child_data[0].color,
              after_color: item.color,
              color: '',
              attribute: '',
              colorName: data.child_data[0].color || '',
              attributeName: data.child_data[0].attribute || '',
              weight: item.weight
            })
          });
        }
        this.child_data_info = data.child_data
      })
    },
    addChildData(){
      let data = this.processData
      this.process_info.push({
        transfer_id: data.id,
        client_id: '',
        type: '',
        price: '',
        desc: '',
        order_time: this.$getDate(new Date()),
        delivery_time: this.$getDate(new Date()),
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
        child_data: data.child_data.map((item: any) => {
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
            colorName: item.color || '',
            attributeName: item.attribute || '',
            weight: item.action_weight
          }
        })
      })
      if(this.yarnInfoList.length > 0){
        let a = this.yarnInfoList.find((item:any) => {
          return item.name === data.child_data[0].name
        })
        this.process_info[this.process_info.length - 1].child_data = []
        a.child_data.forEach((item:any) => {
          this.process_info[this.process_info.length - 1].child_data.push({
            name: a.name,
            transfer_info_id: item.id || '',
            id: data.child_data[0].id || '',
            before_attribute: '',
            after_attribute: '',
            before_color: data.child_data[0].color,
            after_color: item.color,
            color: '',
            attribute: '',
            colorName: data.child_data[0].color || '',
            attributeName: data.child_data[0].attribute || '',
            weight: item.weight
          })
        });
      }
    },
    getYarnStoreList() {
      if(this.yarnInfoList.length > 0 && this.getYarnStoreObj.name) {
        this.totalProcessWeight = this.yarnInfoList.find((item:any) => {
          return item.name === this.getYarnStoreObj.name  
        }).child_data.reduce((a:any,b:any) => {
          return a + (Number(b.weight) || 0)
        },0)
      }
      if (!this.getYarnStoreObj.LV2_name) {
        return
      } else if (this.yarnList.length > 0 && !this.getYarnStoreObj.name) {
        return
      }
      this.step = 1
      this.loading = true
      store
        .detailYarnList({
          store_id: this.getYarnStoreObj.LV2_name ? this.getYarnStoreObj.LV2_name[0] : '',
          second_store_id: this.getYarnStoreObj.LV2_name ? this.getYarnStoreObj.LV2_name[1] : '',
          name:
            this.yarnList.length > 0
              ? this.getYarnStoreObj.name
              : this.getYarnStoreObj.name
              ? this.getYarnStoreObj.name[1]
              : null,
          page: this.getYarnStoreObj.storePage || 1,
          limit: this.getYarnStoreObj.limit || 10,
          store_client_id: this.getYarnStoreObj.store_client_id || null,
          color: this.getYarnStoreObj.color || null,
          weight: this.getYarnStoreObj.isFilterZero ? 0 : null,
          vat_code: this.getYarnStoreObj.vat_code || null,
          color_code: this.getYarnStoreObj.color_code || null,
          batch_code: this.getYarnStoreObj.batch_code || null
        })
        .then((res) => {
          res.data.data.items.forEach((item: any) => {
            this.selectList.forEach((itemSel: any) => {
              if (item.id === itemSel.id) {
                item.weight = itemSel.weight
              }
            })
          })
          this.storeList = res.data.data.items
          this.getYarnStoreObj.storeTotal = res.data.data.total
          this.loading = false
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
      this.process_info.forEach((item: any) => {
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
        item.total_weight = item.child_data.reduce((a:any,b:any) => {
          return a + (Number(b.weight) || 0)
        },0)

        if(Number(this.diaoquNumber) !== Number(item.total_weight) && this.orderId){
          this.$message.error('【'+ item.type +'】工序加工单，加工总数不等于库存调取总数'+Number(this.diaoquNumber)+'，无法提交。')
          this.loading = false
          err = true
          throw new Error('【'+ item.type +'】工序加工单，加工总数不等于库存调取总数'+Number(this.diaoquNumber)+'，无法提交。')
        }
        item.child_data.forEach((itemChild: any) => {
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

      this.total_weight = this.process_info.reduce((a:any,b:any) => {
        return a + b.child_data.reduce((a1:any,b1:any) => {
          return a1 + (Number(b1.weight) || 0)
        },0)
      },0)

      this.process_info.forEach((item: any) => {
        item.child_data.forEach((itemChild: any) => {
          itemChild.name = itemChild.name.constructor === Array ? itemChild.name[1] : itemChild.name
        })
        
        item.total_price =
          item.child_data.reduce((total: any, current: any) => {
            return total + current.weight * current.price
          }, 0) +
          (item.additional_fee as any[]).reduce((total, current) => {
            return total + Number(current.price || 0)
          }, 0)
        item.total_additional_fee = (item.additional_fee as any[]).reduce((total, current) => {
          return total + Number(current.price || 0)
        }, 0)
        item.additional_fee = JSON.stringify(item.additional_fee)
      })
      yarnProcess
        .create({
          order_id: this.orderId || '',
          data: this.process_info
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success((this.update_flag ? '修改' : '添加') + '成功')
            this.resetProcess()
            this.$emit('afterCreate')
            this.$emit('close')
            this.loading = false
          }
        })
    },
    resetProcess() {
      this.step = 0
      this.trans_id = ''
      this.getYarnStoreObj.LV2_name = ''
      this.getYarnStoreObj.store_client_id = ''
      this.storeList = []
      this.process_info = [
        {
          transfer_id: '',
          client_id: '',
          type: '',
          price: '',
          desc: '',
          order_time: this.$getDate(new Date()),
          delivery_time: this.$getDate(new Date()),
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
              transfer_info_id: '',
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
    successFile(response: any, index: number) {
      this.process_info[index].file_url = 'https://file.zwyknit.com/' + response.key
    },
    changeInput(ev: any, itemInfo: any) {
      if (!ev) {
        let index = this.selectList.findIndex((item: any) => {
          return item.id === itemInfo.id
        })
        if (typeof index === 'number') {
          this.$deleteItem(this.selectList, index)
        }
      } else {
        if (
          !this.selectList.find((item: any) => {
            return item.id === itemInfo.id
          })
        ) {
          this.selectList.push(itemInfo)
        }
      }
      itemInfo.weight = ev
    },
    // 选择仓库
    changeStoreData() {
      if (this.selectList.length === 0) {
        this.$message.error('请至少填写一个调取数量')
        return
      }

      if(this.yarnInfoList.length > 0){
        let a = this.selectList.find((item:any) => {
          return item.color === '白胚'
        })

        if(this.selectList.length > 1 && a){
          this.$message.error('白胚纱只能填写一个调取数量')
          return
        }
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
        order_id: this.orderId || null,
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
            store_client_id: item.store_client_id,
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
        .create({ data: [params] })
        .then((res) => {
          this.getStockDetail(res.data.data[0])
        })
      this.step = 2
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
    }
  },
  watch: {
    update_flag(val) {
      if (val) {
        const selfInfo = JSON.parse(JSON.stringify(this.info)).process_info
        this.update_flag = true
        this.step = 2
        selfInfo.forEach((itemSelf: any) => {
          itemSelf.additional_fee = itemSelf.additional_fee
            ? JSON.parse(itemSelf.additional_fee as string)
            : [
                {
                  name: '',
                  price: '',
                  desc: ''
                }
              ]
        })
        this.process_info = selfInfo
      }
    }
  },
  mounted() {
    //@ts-ignore id为scoll已经被el-table使用，可以使el-table滚动
    let domObj = this.$refs.table.bodyWrapper
    domObj.id = 'scrollBar'
    this.scrollFunction(domObj, 'scrollBar')
    this.$checkCommonInfo([
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      },
      {
        checkWhich: 'api/client',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPartyBAsync'
      },
      {
        checkWhich: 'status/token',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getTokenAsync'
      },
      {
        checkWhich: 'api/storeHouse',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getStoreAsync'
      }
    ])
  }
})
</script>
<style lang="less" scoped>
@import './addTransProcess.less';
.rowCtn {
  background: unset !important;
}
</style>
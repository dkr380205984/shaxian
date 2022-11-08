<template>
  <div id="salesOrderCreate" class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{ update ? '修改' : '添加' }}销售订单</span>
      </div>
      <div class="createCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">客户单号</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input placeholder="请输入客户单号（选填）" v-model="order_info.order_code"></el-input>
              </div>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">下单客户</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-select placeholder="请选择下单客户" v-model="order_info.client_id" filterable>
                  <el-option
                    v-for="item in clientArr"
                    :key="item.id"
                    :value="item.id"
                    :label="(item.code || item.id) + ' - ' + item.name"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">下单日期</span>
              <span class="explanation">(必选，默认今日)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-date-picker
                  v-model="order_info.order_time"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择下单日期"
                >
                </el-date-picker>
              </div>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">交货日期</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-date-picker
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  v-model="order_info.delivery_time"
                  type="date"
                  placeholder="选择交货日期"
                >
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn" style="margin-right: unset">
            <div class="label">
              <span class="text">下单信息</span>
              <span class="explanation">(均为必填项)</span>
            </div>
            <div class="btn backHoverBlue" @click="showStore = true">从库存中销售</div>
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">库存纱线引用库存内容</div>
              <i class="el-icon-question" style="color: rgba(0, 0, 0, 65%); margin-left: 10px"></i>
            </el-tooltip>
            <div class="content autoHeight">
              <div class="tableCtn">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn" style="flex: 1.7">
                      <div style="display: flex; align-items: center">
                        纱线名称
                        <el-tooltip class="item" effect="dark" content="添加新纱线" placement="top">
                          <i
                            class="el-icon-upload hoverOrange fr"
                            style="line-height: 38px; font-size: 18px; cursor: pointer; margin-left: 8px"
                            @click="showAdd = true"
                          ></i>
                        </el-tooltip>
                      </div>
                    </div>
                    <div class="tcolumn">纱线颜色</div>
                    <div class="tcolumn">纱线属性</div>
                    <div class="tcolumn" style="position: relative; flex: 1.1">
                      数量属性
                      <el-tooltip class="item" effect="dark" content="统一属性" placement="top">
                        <svg
                          class="iconFont copyIcon hoverBlue"
                          aria-hidden="true"
                          @click="copyInfo('number_attribute')"
                        >
                          <use xlink:href="#icon-tongbushuju1"></use>
                        </svg>
                      </el-tooltip>
                    </div>
                    <div class="tcolumn" style="flex: 2.2">批号/缸号/色号</div>
                    <div class="tcolumn" style="position: relative">
                      销售单价
                      <el-tooltip class="item" effect="dark" content="统一价格" placement="top">
                        <svg class="iconFont copyIcon hoverBlue" aria-hidden="true" @click="copyInfo('price')">
                          <use xlink:href="#icon-tongbushuju1"></use>
                        </svg>
                      </el-tooltip>
                    </div>
                    <div class="tcolumn">销售仓库</div>
                    <div class="tcolumn">销售数量（kg）</div>
                    <div class="tcolumn">销售件数（件）</div>
                    <div class="tcolumn" style="flex: 0.8">颜色操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="noData" v-if="order_info.product_info.length === 0">请添加至少一种纱线</div>
                  <div class="trow" v-for="(itemPro, indexPro) in order_info.product_info" :key="indexPro">
                    <div class="tcolumn" style="flex: 1.7">
                      <div class="el">
                        <el-cascader
                          v-model="itemPro.name"
                          filterable
                          :disabled="itemPro.isCheck"
                          placeholder="请选择纱线"
                          :show-all-levels="false"
                          :options="yarn_list"
                          v-if="loadingData"
                          @change="getProColor($event, itemPro)"
                        ></el-cascader>
                      </div>
                    </div>
                    <div class="tcolumn">
                      <el-autocomplete
                        style="max-height: 32px"
                        v-model="itemPro.color"
                        :fetch-suggestions="
                          (query, cb) => {
                            querySearchColor(query, cb, itemPro.color_list)
                          }
                        "
                        placeholder="颜色属性"
                      ></el-autocomplete>
                    </div>
                    <div class="tcolumn">
                      <div class="el">
                        <el-autocomplete
                          v-model="itemPro.attribute"
                          :fetch-suggestions="querySearchAttr"
                          placeholder="纱线属性"
                        ></el-autocomplete>
                      </div>
                    </div>
                    <div class="tcolumn" style="flex: 1.1">
                      <div class="el">
                        <el-select v-model="itemPro.number_attribute" placeholder="数量属性" filterable>
                          <el-option label="足斤纱" value="足斤纱"></el-option>
                          <el-option label="98纱" value="98纱"></el-option>
                          <el-option label="97纱" value="97纱"></el-option>
                          <el-option label="96纱" value="96纱"></el-option>
                          <el-option label="95纱" value="95纱"></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="tcolumn" style="flex: 2.2; flex-direction: row; align-items: center">
                      <el-input
                        class="el"
                        v-model="itemPro.batch_code"
                        placeholder="批号"
                        style="margin-right: 4px"
                      ></el-input>
                      <el-input
                        class="el"
                        v-model="itemPro.vat_code"
                        placeholder="缸号"
                        style="margin-right: 4px"
                      ></el-input>
                      <el-input
                        class="el"
                        v-model="itemPro.color_code"
                        placeholder="色号"
                        style="margin-right: 4px"
                      ></el-input>
                    </div>
                    <div class="tcolumn">
                      <el-input class="el" v-model="itemPro.price" placeholder="销售单价" @input="cmpTotal"> </el-input>
                    </div>
                    <div class="tcolumn">
                      <el-input
                        class="el"
                        :value="(itemPro.store_name || '') + ' / ' + (itemPro.second_store_name || '')"
                        disabled
                        placeholder="仓库"
                        @input="cmpTotal"
                      >
                      </el-input>
                    </div>
                    <div class="tcolumn">
                      <el-input
                        class="el"
                        v-model="itemPro.weight"
                        :placeholder="itemPro.useable_weight || '数量'"
                        @input="cmpTotal"
                      >
                      </el-input>
                    </div>
                    <div class="tcolumn">
                      <el-input class="el" v-model="itemPro.item" placeholder="销售件数" @input="cmpTotal"> </el-input>
                    </div>
                    <div class="tcolumn flexRow" style="flex: 0.8">
                      <span class="opr red" style="margin-right: 12px" @click="deleteOnce(indexPro)">删除</span>
                      <span
                        class="opr blue"
                        @click="
                          $addItem(order_info.product_info, {
                            name: itemPro.name,
                            number_attribute: '',
                            weight: itemPro.weight,
                            item: '',
                            price: itemPro.price,
                            attribute: itemPro.attribute,
                            color: ''
                          })
                        "
                      >
                        复制
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn" style="display: flex">
            <div
              class="btn backHoverBlue"
              @click="
                $addItem(order_info.product_info, {
                  name: '',
                  number_attribute: '',
                  weight: '',
                  price: '',
                  attribute: '',
                  color: ''
                })
              "
            >
              添加纱线
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">销售总数</span>
              <span class="explanation">(自动计算)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input placeholder="完善数据后计算得到" disabled v-model="order_info.total_weight"></el-input>
              </div>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">销售总价</span>
              <span class="explanation">(自动计算)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input placeholder="完善数据后计算得到" disabled v-model="order_info.total_price"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn" v-for="(item, index) in order_info.additional_fee" :key="'fee' + index">
          <div class="colCtn">
            <div class="label" v-if="index === 0">
              <span class="text">额外费用名称</span>
              <span class="explanation">(选填)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input v-model="item.name" placeholder="请输入额外费用名称"> </el-input>
              </div>
            </div>
          </div>
          <div class="colCtn">
            <div class="label" v-if="index === 0">
              <span class="text">额外费用金额</span>
              <span class="explanation">(选填)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input v-model="item.price" placeholder="请输入额外费用金额" @input="cmpTotal">
                  <template slot="append">元</template>
                </el-input>
              </div>
            </div>
          </div>
          <div class="colCtn">
            <div class="label" v-if="index === 0">
              <span class="text">额外费用备注</span>
              <span class="explanation">(选填)</span>
            </div>
            <div class="elCtn">
              <el-input v-model="item.desc" placeholder="请输入额外费用备注"></el-input>
            </div>
            <div
              v-if="index === 0"
              class="editBtn blue"
              @click="
                $addItem(order_info.additional_fee, {
                  name: '',
                  price: '',
                  desc: ''
                })
              "
            >
              添加
            </div>
            <div v-if="index > 0" class="editBtn red" @click="$deleteItem(order_info.additional_fee, index)">删除</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">图片补充说明</span>
              <span class="explanation">(选填)</span>
            </div>
            <div class="label">
              <span class="text">
                <el-checkbox v-model="cvFlag" @change="changeCVOpration"
                  >{{ cvFlag ? '关闭复制粘贴图片上传功能' : '开启复制粘贴图片上传功能' }}
                </el-checkbox>
              </span>
            </div>
            <el-upload
              class="upload"
              action="https://upload.qiniup.com/"
              accept="image/jpeg,image/gif,image/png,image/bmp"
              :before-upload="beforeAvatarUpload"
              :multiple="false"
              :data="postData"
              :file-list="order_info.file_list"
              list-type="picture-card"
              :limit="1"
              :before-remove="beforeRemove"
              :on-success="successFile"
              :on-preview="handlePictureCardPreview"
              ref="uploada"
            >
              <div class="uploadBtn">
                <i class="el-icon-upload"></i>
                <span>上传文件</span>
              </div>
              <div slot="tip" class="el-upload__tip">只能上传一张jpg/png图片文件，且不超过10M</div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" append-to-body>
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn" style="z-index: 1">
            <div class="label">
              <span class="text">备注信息</span>
              <span class="explanation">(选填)</span>
            </div>
            <div class="content autoHeight">
              <div ref="editor"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <product-create
      :show="showAdd"
      @close="showAdd = false"
      @afterCreate="
        $checkCommonInfo([
          {
            checkWhich: 'api/yarnType',
            getInfoMethed: 'dispatch',
            getInfoApi: 'getYarnTypeAsync',
            forceUpdate: true
          }
        ])
      "
    ></product-create>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray" @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue" @click="saveOrder">提交</div>
        </div>
      </div>
    </div>
    <yarn-store-select :show="showStore" @close="showStore = false" @confirm="getYarnSelect"></yarn-store-select>
  </div>
</template>

<script lang="ts">
import E from 'wangeditor'
import Vue, { set } from 'vue'
import { product, order } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    editor: any
    [propName: string]: any
  } {
    return {
      select_loading: false,
      cvFlag: false,
      showAdd: false,
      dialogVisible: false,
      showStore: false,
      loadingData: true,
      update: true,
      copyLine: '',
      dialogImageUrl: '',
      notify: '',
      order_info: {
        id: this.$route.query.id || '',
        order_code: '',
        order_time: this.$getDate(new Date()),
        delivery_time: '',
        client_id: '',
        total_price: 0,
        total_weight: 0,
        desc: '',
        file_url: '',
        type: 2,
        additional_fee: [
          {
            name: '',
            price: '',
            desc: ''
          }
        ],
        total_additional_fee: 0,
        product_info: [
          {
            name: [],
            number_attribute: '',
            weight: '',
            price: '',
            attribute: '',
            color: ''
          }
        ]
      },
      editor: '',
      postData: { key: '', token: '' },
      attributeArr: [{ value: '胚绞' }, { value: '胚筒' }, { value: '色绞' }, { value: '色筒' }]
    }
  },
  computed: {
    clientArr() {
      return this.$store.state.api.client.arr.filter((item: any) => item.status === 1)
    },
    token() {
      return this.$store.state.status.token
    },
    yarn_list() {
      return [{ label: '默认', value: '', children: [] }].concat(
        this.$store.state.api.yarnType.arr.map((item: any) => {
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
      )
    }
  },
  methods: {
    cmpTotal() {
      this.order_info.total_additional_fee = (this.order_info.additional_fee as any[]).reduce((total, current) => {
        return total + Number(current.price)
      }, 0)
      this.order_info.total_price =
        this.order_info.product_info.reduce((total: any, current: any) => {
          return total + Number(current.weight || 0) * Number(current.price || 0)
        }, 0) +
        (this.order_info.additional_fee as any[]).reduce((total, current) => {
          return total + Number(current.price || 0)
        }, 0)
      this.order_info.total_weight = this.order_info.product_info.reduce((total: any, current: any) => {
        return total + Number(current.weight || 0)
      }, 0)
    },
    deleteOnce(indexFather: number) {
      this.order_info.product_info.splice(indexFather, 1)
    },
    querySearchColor(queryString: string, cb: (params: any) => void, list: any[]) {
      if (list) {
        const returnData = queryString ? list.filter((itemF: any) => itemF.value.indexOf(queryString) !== -1) : list
        cb(returnData)
      } else {
        cb([])
      }
    },
    getYarnSelect(selectList: any) {
      // @ts-ignore
      this.yarn_list[0].children = this.yarn_list[0].children.map((item: any) => {
        return item.value
      })
      selectList.forEach((item: any) => {
        // @ts-ignore
        this.yarn_list[0].children.push(item.name)
        item.name = ['', item.name]
        this.order_info.product_info.push(item)
      })
      // @ts-ignore 赋值到默认组里面
      this.yarn_list[0].children = [...new Set(this.yarn_list[0].children)].map((item: any) => {
        return {
          label: item,
          value: item
        }
      })
      this.loadingData = false
      setTimeout(() => {
        this.loadingData = true
      }, 10)
    },
    getProColor(ev: string[], proInfo: any) {
      product
        .detail({
          product_name: ev[1]
        })
        .then((res) => {
          proInfo.color_list = Array.from(
            new Set(res.data.data.child_data.map((itemChild: any) => itemChild.color))
          ).map((itemChild: any) => {
            return {
              value: itemChild
            }
          })
        })
    },
    querySearchAttr(queryString: string, cb: (params: any) => void) {
      const returnData = queryString
        ? this.attributeArr.filter((itemF: any) => itemF.value.indexOf(queryString) !== -1)
        : this.attributeArr
      cb(returnData)
    },
    deletePro(product_info: any, indexPro: number) {
      this.$confirm('此操作将删除该行纱线, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$deleteItem(product_info, indexPro)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    saveOrder() {
      if (
        this.$formCheck(this.order_info, [
          {
            key: 'client_id',
            errMsg: '请选择下单客户'
          },
          {
            key: 'delivery_time',
            errMsg: '请选择下单日期'
          }
        ])
      ) {
        return
      }
      if (
        this.order_info.product_info.some((item: any) => {
          if (!item.name || item.name.length === 0) {
            this.$message.error('请按照提示输入产品名称选择产品')
            return true
          }
          return this.$formCheck(item, [
            {
              key: 'name',
              errMsg: '请按照提示输入产品名称选择产品'
            },
            {
              key: 'color',
              errMsg: '请输入颜色'
            },
            {
              key: 'attribute',
              errMsg: '请选择纱线属性'
            },
            {
              key: 'price',
              errMsg: '请输入销售单价',
              regNormal: 'isNum'
            },
            {
              key: 'weight',
              errMsg: '请输入销售数量',
              regNormal: 'isNum'
            }
          ])
        })
      ) {
        return
      }

      let str = ''

      this.order_info.product_info.forEach((item: any) => {
        if (!item.isCheck) return
        if (item.weight > item.useable_weight) {
          str +=
            '\n' +
            item.store_name +
            ' / ' +
            item.second_store_name +
            '，' +
            item.name[1] +
            '纱线该仓库库存数量不足' +
            item.weight +
            '，是否继续销售出库，继续则库存数量变为负数'
        }
      })

      // 判断是否有超出
      if (str !== '') {
        this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.orderSave()
          })
          .catch(() => {})
      } else {
        this.orderSave()
      }
    },
    orderSave() {
      // 发送请求之前转换一下格式
      const formData = JSON.parse(JSON.stringify(this.order_info))
      formData.product_info.forEach((item: any) => (item.name = (item.name as any[])[1]))
      // 额外费用为空时提交空字符串方便后续使用
      formData.additional_fee =
        (formData.additional_fee as any[]).filter((itemChild) => itemChild.name && itemChild.price).length > 0
          ? JSON.stringify(formData.additional_fee)
          : ''
      formData.product_info_back_up = this.$clone(formData.product_info)
      formData.product_info = this.$mergeData(formData.product_info, {
        mainRule: 'name',
        childrenName: 'child_data'
      })
      formData.reduce_store_data = this.$mergeData(formData.product_info_back_up, {
        mainRule: ['store_id', 'second_store_id'],
        childrenName: 'child_data'
      })

      let index = formData.reduce_store_data.findIndex((item: any) => {
        return item.store_id === undefined && item.second_store_id === undefined
      })

      if (index !== -1) {
        this.$deleteItem(formData.reduce_store_data, index)
      }

      formData.reduce_store_data.forEach((item: any) => {
        item.child_data.forEach((itemChild: any) => {
          itemChild.action_weight = itemChild.weight
          itemChild.item = itemChild.item || ''
        })
      })
      if (!this.update) {
        formData.product_info.forEach((item: any) => {
          item.child_data.forEach((itemChild: any) => {
            itemChild.id = null
          })
        })
      }

      delete formData.product_info_back_up
      //   console.log(formData)
      //   return
      order.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success(this.update ? '修改成功' : '添加成功')
          if (this.update) {
            this.$router.push('/order/detail/' + this.order_info.id)
          } else {
            this.$confirm('继续添加新订单?', '提示', {
              confirmButtonText: '继续添加',
              cancelButtonText: '返回列表',
              type: 'warning'
            })
              .then(() => {
                this.order_info = {
                  order_code: '',
                  order_time: this.$getDate(new Date()),
                  delivery_time: '',
                  client_id: '',
                  type: 2,
                  total_price: 0,
                  total_weight: 0,
                  desc: '',
                  file_url: '',
                  additional_fee: [
                    {
                      name: '',
                      price: '',
                      desc: ''
                    }
                  ],
                  total_additional_fee: 0,
                  product_info: [
                    {
                      name: '',
                      number_attribute: '',
                      weight: '',
                      price: '',
                      attribute: '',
                      color: ''
                    }
                  ]
                }
              })
              .catch(() => {
                this.$router.push(
                  '/order/list?page=1&&order_code=&&product_name=&&client_id=&&user_id=&&page_size=10&&date='
                )
              })
          }
        } else {
          this.loading = false
        }
      })
    },
    copyInfo(type: string) {
      let price = ''
      let number_attribute = ''

      this.order_info.product_info.forEach((item: any, index: number) => {
        if (index === 0) {
          price = item.price
          number_attribute = item.number_attribute
        } else {
          if (type === 'number_attribute') {
            item.number_attribute = number_attribute
          } else if (type === 'price') {
            item.price = price
          }
        }
      })

      this.$forceUpdate()
    },
    // 打开复制粘贴图片功能
    changeCVOpration(flag: boolean) {
      if (this.notify) {
        this.notify.close()
        this.deletePasteImage()
      }
      if (flag) {
        this.notify = this.$notify({
          title: '警告！',
          message:
            '已开启复制粘贴图片上传功能，请勿在其余文字/数字输入框使用复制粘贴或使用ctrl+v键操作,操作完成后请关闭复制粘贴图片上传功能',
          type: 'warning',
          duration: 0,
          showClose: false
        })
        this.addPasteImage()
      }
      this.$forceUpdate()
    },
    dataURLtoFile(dataurl: string, filename: string) {
      var arr = dataurl.split(',')
      // @ts-ignore
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    // 复制粘贴图片
    pasteImage(event: any) {
      let _this = this
      // 只处理图片格式数据
      if (event.clipboardData || event.originalEvent) {
        let clipboardData = event.clipboardData || event.originalEvent.clipboardData
        if (clipboardData.items) {
          let blob
          for (let i = 0; i < clipboardData.items.length; i++) {
            if (clipboardData.items[i].type.indexOf('image') !== -1) {
              blob = clipboardData.items[i].getAsFile()
            }
          }
          let render = new FileReader()
          render.onload = function (evt: any) {
            //输出base64编码
            const base64 = evt.target.result
            // @ts-ignore
            // document.getElementById('cvImg' + _this.sampleInfo.cvImageLength).setAttribute('src', base64)
            var url = 'https://upload.qiniup.com/'
            var xhr = new XMLHttpRequest()
            let formData = new FormData()
            formData.append('token', _this.token)
            _this.loading = true
            // @ts-ignore
            let filename = Date.parse(new Date()) + '.jpg'
            formData.append('key', filename)
            formData.append('file', _this.dataURLtoFile(base64, filename))
            xhr.open('POST', url, true)
            xhr.send(formData)
            xhr.onreadystatechange = function () {
              _this.loading = false
              if (xhr.readyState === 4) {
                _this.$message.success('上传成功')
                // @ts-ignore
                // _this.sampleInfo.cv_list.push(
                //   // @ts-ignore
                //   'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key
                // )
                // @ts-ignore
                _this.order_info.file_url = 'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key
                _this.postData = {
                  key: JSON.parse(xhr.responseText).key,
                  url: 'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key
                }
                // @ts-ignore
                _this.order_info.file_list = [
                  {
                    name: JSON.parse(xhr.responseText).key,
                    key: JSON.parse(xhr.responseText).key,
                    url: 'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key
                  }
                ]
              }
            }
          }
          if (render.readAsDataURL && blob) {
            render.readAsDataURL(blob)
          }
        }
      }
    },
    addPasteImage() {
      document.addEventListener('paste', this.pasteImage)
    },
    deletePasteImage() {
      document.removeEventListener('paste', this.pasteImage)
    },
    handlePictureCardPreview(file: any) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeRemove(file: any, fileList: any) {
      // 上传超过10M自动删除
      if (file.size && !(file.size / 1024 / 1024 < 10)) {
        return
      }

      this.$confirm('即将删除图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //执行删除操作,找到相同的删除
          let fileIndex = fileList.findIndex((item: any, index: number) => {
            if (item.id) {
              return item.id === file.id
            } else if (item.response) {
              return item.response.key === file.response.key
            } else {
              return item.uid === file.uid
            }
          })

          this.$deleteItem(fileList, fileIndex)

          this.$message({
            type: 'success',
            message: '删除成功'
          })

          this.removeFile()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      return false
    },
    removeFile() {
      // @ts-ignore
      this.order_info.file_list = []
      this.order_info.file_url = ''
      this.postData = ''
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
    successFile(response: any) {
      this.order_info.file_url = 'https://file.zwyknit.com/' + response.key
    }
  },
  mounted() {
    this.editor = new E(this.$refs.editor as HTMLElement)
    this.editor.config.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      // 'image', // 插入图片
      // 'table', // 表格
      // 'video', // 插入视频
      // 'code', // 插入代码
      'undo', // 撤销
      'redo', // 重复
      'fullscreen' // 全屏
    ]
    this.editor.config.onchange = (html: HTMLElement) => {
      this.order_info.desc = html // 绑定当前逐渐地值
    }
    this.editor.create()
    this.$checkCommonInfo([
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
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      }
    ])
    if (this.$route.query.id) {
      this.update = true
      order
        .detail({
          id: this.$route.query.id + ''
        })
        .then((res) => {
          res.data.data.file_list = res.data.data.file_url ? [{ url: res.data.data.file_url }] : []
          this.order_info = res.data.data
          this.editor.txt.html(this.order_info.desc)
          this.order_info.product_info.forEach((item: any) => (item.name = item.product_name))
          this.order_info.additional_fee = this.order_info.additional_fee
            ? JSON.parse(this.order_info.additional_fee as string)
            : [
                {
                  name: '',
                  price: '',
                  desc: ''
                }
              ]
        })
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/order/salesOrderCreate.less';
</style>
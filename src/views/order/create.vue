<template>
  <div id="orderCreate"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">添加订单</span>
      </div>
      <div class="createCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">客户单号</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input placeholder="请输入客户单号"
                  v-model="order_info.order_code"></el-input>
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
                <el-select placeholder="请选择下单客户"
                  v-model="order_info.client_id"
                  filterable>
                  <el-option v-for="item in clientArr"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"></el-option>
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
                <el-date-picker v-model="order_info.order_time"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择下单日期">
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
                <el-date-picker style="width:100%"
                  value-format="yyyy-MM-dd"
                  v-model="order_info.delivery_time"
                  type="date"
                  placeholder="选择交货日期">
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">下单信息</span>
              <span class="explanation">(均为必填项)</span>
            </div>
            <div class="content autoHeight">
              <div class="tableCtn">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn">纱线名称</div>
                    <div class="tcolumn noPad"
                      style="flex:5.9">
                      <div class="trow">
                        <div class="tcolumn"
                          style="flex:1.2">纱线颜色</div>
                        <div class="tcolumn">纱线属性</div>
                        <div class="tcolumn">下单价格</div>
                        <div class="tcolumn">下单数量</div>
                        <div class="tcolumn">数量属性</div>
                        <div class="tcolumn"
                          style="flex:0.5">颜色操作</div>
                      </div>
                    </div>
                    <div class="tcolumn"
                      style="flex:0.5">纱线操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="noData"
                    v-if="order_info.product_info.length===0">请添加至少一种纱线</div>
                  <div class="trow"
                    v-for="(itemPro,indexPro) in order_info.product_info"
                    :key="indexPro">
                    <div class="tcolumn">
                      <div class="el">
                        <el-cascader v-model="itemPro.product_id"
                          filterable
                          placeholder="请选择纱线"
                          :options="yarn_list"
                          @change="getProColor($event,itemPro)"></el-cascader>
                      </div>
                    </div>
                    <div class="tcolumn noPad"
                      style="flex:5.9">
                      <div class="trow"
                        v-for="(itemChild,indexChild) in itemPro.child_data"
                        :key="indexChild">
                        <div class="tcolumn"
                          style="flex:1.2">
                          <el-autocomplete style="max-height:32px"
                            v-model="itemChild.color"
                            :fetch-suggestions="(query,cb)=>{querySearchColor(query,cb,itemPro.color_list)}"
                            placeholder="颜色属性">
                            <template slot="prepend">{{indexChild+1}}</template>
                          </el-autocomplete>
                        </div>
                        <div class="tcolumn">
                          <div class="el">
                            <el-select v-model="itemChild.attribute"
                              placeholder="请选择纱线属性">
                              <el-option label="筒纱"
                                value="筒纱"></el-option>
                              <el-option label="绞纱"
                                value="绞纱"></el-option>
                            </el-select>
                          </div>
                        </div>
                        <div class="tcolumn">
                          <el-input class="el"
                            v-model="itemChild.price"
                            placeholder="下单价格"
                            @input="cmpTotal">
                            <template slot="append">元</template>
                          </el-input>
                        </div>
                        <div class="tcolumn">
                          <el-input class="el"
                            v-model="itemChild.weight"
                            placeholder="数量"
                            @input="cmpTotal">
                            <template slot="append">kg</template>
                          </el-input>
                        </div>
                        <div class="tcolumn">
                          <div class="el">
                            <el-select v-model="itemChild.number_attribute"
                              placeholder="请选择数量属性"
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
                        </div>
                        <div class="tcolumn flexRow"
                          style="flex:0.5">
                          <span class="opr red"
                            style="margin-right:12px"
                            @click="deleteOnce(itemPro.child_data,indexChild,indexPro)">删除</span>
                          <span class="opr blue"
                            @click="$addItem(itemPro.child_data,{
                              number_attribute: '98纱',
                              weight: itemPro.child_data[0].weight,
                              price: itemPro.child_data[0].price,
                              attribute: itemPro.child_data[0].attribute,
                              color: ''})">
                            复制
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="tcolumn"
                      style="flex:0.5">
                      <span class="opr red"
                        style="margin-right:12px"
                        @click="$deleteItem(order_info.product_info,indexPro)">删除纱线</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="btn btnMain"
              @click="$addItem(order_info.product_info,{
                product_id: '',
                child_data: [
                  {
                    number_attribute: '98纱',
                    weight: '',
                    price: '',
                    attribute: '',
                    color: ''
                  }
                ]
              })">添加纱线</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">下单总数</span>
              <span class="explanation">(自动计算)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input placeholder="完善数据后计算得到"
                  disabled
                  v-model="order_info.total_weight"></el-input>
              </div>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">下单总价</span>
              <span class="explanation">(自动计算)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input placeholder="完善数据后计算得到"
                  disabled
                  v-model="order_info.total_price"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in order_info.additional_fee"
          :key="'fee' + index">
          <div class="colCtn">
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
          <div class="colCtn">
            <div class="label"
              v-if="index===0">
              <span class="text">额外费用金额</span>
              <span class="explanation">(选填)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input v-model="item.price"
                  placeholder="请输入额外费用金额"
                  @input="cmpTotal">
                  <template slot="append">元</template>
                </el-input>
              </div>
            </div>
          </div>
          <div class="colCtn">
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
              @click="$addItem(order_info.additional_fee,{
                  name: '',
                  price: '',
                  desc:''
                })">添加</div>
            <div v-if="index>0"
              class="editBtn red"
              @click="$deleteItem(order_info.additional_fee,index)">删除</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">图片补充说明</span>
              <span class="explanation">(选填)</span>
            </div>
            <el-upload class="upload"
              action="https://upload.qiniup.com/"
              accept="image/jpeg,image/gif,image/png,image/bmp"
              :before-upload="beforeAvatarUpload"
              :multiple="false"
              :data="postData"
              :limit="1"
              :on-success="successFile"
              ref="uploada"
              list-type="picture">
              <div class="uploadBtn">
                <i class="el-icon-upload"></i>
                <span>上传文件</span>
              </div>
              <div slot="tip"
                class="el-upload__tip">只能上传一张jpg/png图片文件，且不超过10M</div>
            </el-upload>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="z-index:1">
            <div class="label">
              <span class="text">备注信息</span>
            </div>
            <div class="content autoHeight">
              <div ref='editor'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="saveOrder">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import E from 'wangeditor'
import Vue from 'vue'
import { product, order } from '@/assets/js/api'
import { Order } from '@/types/order'
export default Vue.extend({
  data(): {
    editor: any
    order_info: Order
    [propName: string]: any
  } {
    return {
      select_loading: false,
      order_info: {
        order_code: '',
        order_time: this.$getDate(new Date()),
        delivery_time: '',
        client_id: '',
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
            product_id: [],
            child_data: [
              {
                number_attribute: '98纱',
                weight: '',
                price: '',
                attribute: '',
                color: ''
              }
            ]
          }
        ]
      },
      editor: '',
      postData: { key: '', token: '' }
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
      return this.$store.state.api.yarnType.arr.map((item: any) => {
        return {
          value: item.name,
          label: item.name,
          children: item.yarns.map((itemChild: any) => {
            return {
              value: itemChild.id,
              label: itemChild.name
            }
          })
        }
      })
    }
  },
  methods: {
    cmpTotal() {
      this.order_info.total_additional_fee = (this.order_info.additional_fee as any[]).reduce((total, current) => {
        return total + Number(current.price)
      }, 0)
      this.order_info.total_price =
        this.order_info.product_info.reduce((total, current) => {
          return (
            total +
            current.child_data.reduce((totalChild, currentChild) => {
              return totalChild + Number(currentChild.weight) * Number(currentChild.price)
            }, 0)
          )
        }, 0) +
        (this.order_info.additional_fee as any[]).reduce((total, current) => {
          return total + Number(current.price)
        }, 0)
      this.order_info.total_weight = this.order_info.product_info.reduce((total, current) => {
        return (
          total +
          current.child_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.weight)
          }, 0)
        )
      }, 0)
    },
    deleteOnce(father: any[], indexChild: number, indexFather: number) {
      if (father.length > 1) {
        father.splice(indexChild, 1)
      } else {
        this.order_info.product_info.splice(indexFather, 1)
      }
    },
    querySearchColor(queryString: string, cb: (params: any) => void, list: any[]) {
      if (list) {
        const returnData = queryString ? list.filter((itemF: any) => itemF.value.indexOf(queryString) !== -1) : list
        cb(returnData)
      } else {
        cb([])
      }
    },
    getProColor(ev: string[], proInfo: any) {
      product
        .detail({
          id: ev[1]
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
        this.order_info.product_info.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'product_id',
              errMsg: '请按照提示输入产品名称选择产品'
            }
          ])
        })
      ) {
        return
      }
      if (
        this.order_info.product_info.some((item) => {
          return item.child_data.some((itemChild) => {
            return this.$formCheck(itemChild, [
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
                errMsg: '请输入下单价格',
                regNormal: 'isNum'
              },
              {
                key: 'weight',
                errMsg: '请输入下单数量',
                regNormal: 'isNum'
              }
            ])
          })
        })
      ) {
        return
      }
      const formData = JSON.parse(JSON.stringify(this.order_info))
      formData.product_info.forEach((item: any) => (item.product_id = (item.product_id as any[])[1]))
      // 额外费用为空时提交空字符串方便后续使用
      formData.additional_fee =
        (formData.additional_fee as any[]).filter((itemChild) => itemChild.name && itemChild.price).length > 0
          ? JSON.stringify(formData.additional_fee)
          : ''
      order.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
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
                    product_id: '',
                    child_data: [
                      {
                        number_attribute: '98纱',
                        weight: '',
                        price: '',
                        attribute: '',
                        color: ''
                      }
                    ]
                  }
                ]
              }
            })
            .catch(() => {
              this.$router.push(
                '/order/list?page=1&&order_code=&&product_name=&&client_id=&&user_id=&&page_size=10&&date='
              )
            })
        } else {
          this.loading = false
        }
      })
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
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/order/create.less';
</style>
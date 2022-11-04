<template>
  <div class="shaxianAddPO popup" v-show="show">
    <div class="main" style="min-width: 1000px">
      <div class="titleCtn">
        <div class="text">{{ update ? '修改' : '添加' }}采购单</div>
        <div class="closeCtn" @click="close">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="createCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">供货商</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-select placeholder="请选择供货商" v-model="order_yarn_info.client_id">
                  <el-option v-for="item in client_arr" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">合计采购价格</span>
              <span class="explanation">(自动计算)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input v-model="order_yarn_info.total_price" disabled placeholder="自动计算合计价格"></el-input>
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
                v-model="order_yarn_info.order_time"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择下单日期"
              >
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="rowCtn" v-for="(item, index) in order_yarn_info.child_data" :key="'yarn' + index">
          <div class="colCtn">
            <div class="label" v-if="index === 0">
              <span class="text">纱线名称</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-cascader v-model="item.name" filterable placeholder="请选择纱线" :options="yarn_list"></el-cascader>
              </div>
            </div>
          </div>
          <div class="colCtn">
            <div class="label" v-if="index === 0">
              <span class="text">颜色/属性</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content flexRow">
              <div class="elCtn">
                <el-input placeholder="颜色" v-model="item.color"></el-input>
              </div>
              <div class="elCtn">
                <el-select placeholder="属性" v-model="item.attribute">
                  <el-option label="胚绞" value="胚绞"></el-option>
                  <el-option label="胚筒" value="胚筒"></el-option>
                  <el-option label="色绞" value="色绞"></el-option>
                  <el-option label="色筒" value="色筒"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="colCtn">
            <div class="label" v-if="index === 0">
              <span class="text">单价/数量</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content flexRow">
              <div class="elCtn">
                <el-input placeholder="单价" v-model="item.price" @input="cmpTotalPrice">
                  <template slot="append">元</template>
                </el-input>
              </div>
              <div class="elCtn">
                <el-input placeholder="数量" v-model="item.weight" @input="cmpTotalPrice">
                  <template slot="append">kg</template>
                </el-input>
              </div>
            </div>
            <div
              v-if="index === 0"
              class="editBtn blue"
              @click="
                $addItem(order_yarn_info.child_data, {
                  name: '',
                  weight: '',
                  color: '白胚',
                  attribute: '',
                  price: ''
                })
              "
            >
              添加
            </div>
            <div v-if="index > 0" class="editBtn red" @click="$deleteItem(order_yarn_info.child_data, index)">删除</div>
          </div>
        </div>
        <div class="rowCtn" v-for="(item, index) in order_yarn_info.additional_fee" :key="'fee' + index">
          <div class="colCtn">
            <div class="label" v-if="index === 0">
              <span class="text">额外费用名称</span>
              <span class="explanation">(选填)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input v-model="item.name" placeholder="请选择额外费用名称"> </el-input>
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
                <el-input v-model="item.price" placeholder="请输入额外费用金额" @input="cmpTotalPrice">
                  <template slot="append">元</template>
                </el-input>
              </div>
            </div>
          </div>
          <div class="colCtn">
            <div class="label" v-if="index === 0">
              <span class="text">额外费用备注</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="elCtn">
              <el-input v-model="item.desc" placeholder="请输入额外费用备注"></el-input>
            </div>
            <div
              v-if="index === 0"
              class="editBtn blue"
              @click="
                $addItem(order_yarn_info.additional_fee, {
                  name: '',
                  price: '',
                  desc: ''
                })
              "
            >
              添加
            </div>
            <div v-if="index > 0" class="editBtn red" @click="$deleteItem(order_yarn_info.additional_fee, index)">
              删除
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn" style="max-width: 224.67px">
            <div class="label">
              <span class="text">交货日期</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-date-picker
                  v-model="order_yarn_info.delivery_time"
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
                <el-input v-model="order_yarn_info.desc" placeholder="请输入备注信息"></el-input>
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
              :file-list="order_yarn_info.file_url ? [{ name: '说明文件', url: order_yarn_info.file_url }] : []"
              :on-success="successFile"
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
      <div class="oprCtn">
        <span class="btn borderBtn" @click="close">取消</span>
        <span
          class="btn"
          :class="{ backHoverBlue: !update, backHoverOrange: update }"
          style="margin: 0 20px"
          @click="saveOrder"
          >{{ update ? '确认修改' : '确认采购' }}</span
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { yarnOrder } from '@/assets/js/api'
export default Vue.extend({
  props: {
    id: {
      default: ''
    },
    show: {
      type: Boolean,
      required: true
    },
    info: {
      type: Object,
      default: false
    },
    update: {
      type: Boolean,
      default: false
    }
  },
  data(): any {
    return {
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
      postData: { key: '', token: '' }
    }
  },
  computed: {
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
    client_arr() {
      return this.$store.state.api.factory.arr
    },
    token() {
      return this.$store.state.status.token
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    cmpTotalPrice() {
      this.order_yarn_info.total_price =
        this.order_yarn_info.child_data.reduce((total: any, current: any) => {
          return total + Number(current.price) * Number(current.weight)
        }, 0) +
        (this.order_yarn_info.additional_fee as any[]).reduce((total, current) => {
          return total + Number(current.price)
        }, 0)
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
      this.order_yarn_info.file_url = 'https://file.zwyknit.com/' + response.key
    },
    saveOrder() {
      if (
        this.$formCheck(this.order_yarn_info, [
          {
            key: 'client_id',
            errMsg: '请选择供货商'
          },
          {
            key: 'delivery_time',
            errMsg: '请选择交货日期'
          }
        ])
      ) {
        return
      }
      if (
        this.order_yarn_info.child_data.some((item: any) => {
          return this.$formCheck(item, [
            {
              key: 'name',
              errMsg: '请选择纱线名称'
            },
            {
              key: 'color',
              errMsg: '请输入纱线颜色'
            },
            {
              key: 'attribute',
              errMsg: '请选择纱线属性'
            },
            {
              key: 'price',
              errMsg: '请输入单价'
            },
            {
              key: 'weight',
              errMsg: '请输入数量'
            }
          ])
        })
      ) {
        return
      }
      this.order_yarn_info.total_additional_fee = (this.order_yarn_info.additional_fee as any[]).reduce(
        (total, current) => {
          return total + Number(current.price)
        },
        0
      )
      this.order_yarn_info.child_data.forEach((item: any) => {
        if (typeof item.name !== 'string') {
          item.name = item.name[1]
        } 
        return
      })

      let params = this.$clone(this.order_yarn_info)
      params.additional_fee = JSON.stringify(params.additional_fee)
      yarnOrder
        .create({
          data: [params]
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success((this.update ? '修改' : '添加') + '成功')
            this.$emit('afterCreate')
            this.close()
          }
        })
    },
    // 凑数的函数，不这样写的话会类型报错
    a(a: number) {}
  },
  watch: {
    update: function (val) {
      if (val) {
        this.order_yarn_info = this.info
      } else {
        this.order_yarn_info = {
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
        }
      }
    }
  },
  mounted() {
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
      }
    ])
  }
})
</script>
<style lang="less" scoped>
@import './shaxianAddPO.less';
</style>
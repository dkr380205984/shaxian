<template>
  <div class="materialAddPO popup" v-show="show" v-loading="loading">
    <div class="main" style="min-width: 1200px">
      <div class="titleCtn">
        <div class="text">采购单{{ update? '修改': '添加' }}/入库</div>
        <div class="closeCtn" @click="close">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <template v-if="step === 1">
        <div class="createCtn" style="max-height: 700px; overflow: scroll">
          <div class="rowCtn">
            <div class="colCtn">
              <div class="label">
                <span class="text">供货商</span>
                <span class="explanation">
                  (必选)
                  <el-tooltip class="item" effect="dark" content="设置成功后请点击此按钮刷新数据" placement="top">
                    <i class="el-icon-refresh hoverGreen"
                      style="line-height: 46px; font-size: 18px; margin-left: 8px; cursor: pointer" @click="
                        $checkCommonInfo([
                          {
                            checkWhich: 'api/client',
                            getInfoMethed: 'dispatch',
                            getInfoApi: 'getPartyBAsync',
                            forceUpdate: true
                          }
                        ])
                      "></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="添加客户" placement="top">
                    <i class="el-icon-upload hoverOrange"
                      style="line-height: 38px; font-size: 18px; cursor: pointer; margin-left: 8px"
                      @click="$openUrl('/settings/supplier')"></i>
                  </el-tooltip>
                </span>
              </div>
              <div class="content">
                <div class="elCtn">
                  <el-select placeholder="请选择供货商" v-model="order_yarn_info.client_id" filterable>
                    <el-option v-for="item in client_arr" :key="item.id" :value="item.id"
                      :label="item.code + '-' + item.name"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">合计采购价格/结算方式</span>
                <span class="explanation">(自动计算/必填)</span>
              </div>
              <div class="content flexRow">
                <div class="elCtn">
                  <el-input v-model="order_yarn_info.total_price" disabled placeholder="自动算合计价格"></el-input>
                </div>
                <div class="elCtn">
                  <el-select v-model="order_yarn_info.settle_type" placeholder="请选择结算方式">
                    <el-option label="KP" value="KP">
                    </el-option>
                    <el-option label="BKP" value="BKP">
                    </el-option>
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
                <el-date-picker v-model="order_yarn_info.order_time" type="date" value-format="yyyy-MM-dd"
                  placeholder="选择下单日期">
                </el-date-picker>
              </div>
            </div>
          </div>
          <div class="rowCtn" v-for="(item, index) in order_yarn_info.child_data" :key="'yarn' + index">
            <div class="colCtn">
              <div class="label" v-if="index === 0">
                <span class="text">毛条名称</span>
                <span class="explanation">
                  (必选)
                  <el-tooltip class="item" effect="dark" content="添加成功后请点击此按钮刷新数据" placement="top">
                    <i class="el-icon-refresh hoverGreen"
                      style="line-height: 46px; font-size: 18px; margin-left: 8px; cursor: pointer" @click="$checkCommonInfo([{
                        checkWhich: 'api/materialType',
                        getInfoMethed: 'dispatch',
                        getInfoApi: 'getMaterialTypeAsync',
                        forceUpdate: true
                      }])"></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="添加毛条" placement="top">
                    <i class="el-icon-upload hoverOrange"
                      style="line-height: 38px; font-size: 18px; cursor: pointer; margin-left: 8px"
                      @click="create_flag_material = true"></i>
                  </el-tooltip>
                </span>
              </div>
              <div class="content">
                <div class="elCtn">
                  <el-select v-if="info.orderId" v-model="item.item" value-key="id" filterable
                    @change="changeProName(item, index)" placeholder="请选择毛条" :options="yarn_list">
                    <el-option v-for="(itemYarn, indexYarn) in yarn_list" :key="indexYarn.id" :label="itemYarn.label"
                      :value="itemYarn"></el-option>
                  </el-select>
                  <el-cascader v-else v-model="item.name" filterable placeholder="请选择毛条"
                    :options="yarn_list"></el-cascader>
                </div>
              </div>
            </div>
            <div class="colCtn">
              <div style="display: flex; align-items: center">
                <div class="label" v-if="index === 0">
                  <span class="text">属性</span>
                </div>
                <el-tooltip v-if="index === 0" style="cursor: pointer; margin-left: 10px" class="item" effect="dark"
                  content="统一属性" placement="top">
                  <svg class="iconFont copyIcon hoverBlue" aria-hidden="true" @click="copyInfo('attribute')">
                    <use xlink:href="#icon-tongbushuju1"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="content">
                <div class="elCtn">
                  <el-input placeholder="属性" v-model="item.attribute"></el-input>
                </div>
              </div>
            </div>
            <div class="colCtn">
              <div style="display: flex; align-items: center">
                <div class="label" v-if="index === 0">
                  <span class="text">单价/数量</span>
                  <span class="explanation">(必填)</span>
                </div>
                <el-tooltip v-if="index === 0" style="cursor: pointer; margin-left: 10px" class="item" effect="dark"
                  content="统一单价" placement="top">
                  <svg class="iconFont copyIcon hoverBlue" aria-hidden="true" @click="copyInfo('price')">
                    <use xlink:href="#icon-tongbushuju1"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="content flexRow noPadInput">
                <div class="elCtn">
                  <el-input placeholder="单价" type="number" v-model="item.price" @input="cmpTotalPrice">
                    <template slot="append">元</template>
                  </el-input>
                </div>
                <div class="elCtn">
                  <el-input placeholder="数量" type="number" v-model="item.weight" @input="cmpTotalPrice">
                    <template slot="append">kg</template>
                  </el-input>
                </div>
              </div>
              <div v-if="index === 0" class="editBtn blue" @click="
                $addItem(order_yarn_info.child_data, {
                  name: '',
                  weight: '',
                  attribute: '',
                  price: ''
                })
              ">
                添加
              </div>
              <div v-if="index > 0" class="editBtn red" @click="$deleteItem(order_yarn_info.child_data, index)">
                删除
              </div>
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
              <div v-if="index === 0" class="editBtn blue" @click="
                $addItem(order_yarn_info.additional_fee, {
                  name: '',
                  price: '',
                  desc: ''
                })
              ">
                添加
              </div>
              <div v-if="index > 0" class="editBtn red" @click="$deleteItem(order_yarn_info.additional_fee, index)">
                删除
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn">
              <div class="label">
                <span class="text">交货日期</span>
                <span class="explanation">(必选)</span>
              </div>
              <div class="content">
                <div class="elCtn">
                  <el-date-picker v-model="order_yarn_info.delivery_time" type="date" value-format="yyyy-MM-dd"
                    placeholder="选择交货日期">
                  </el-date-picker>
                </div>
              </div>
            </div>
            <div class="colCtn" style="flex: 2.3">
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
              <div class="label">
                <span class="text">
                  <el-checkbox v-model="cvFlag" @change="changeCVOpration">{{
                    cvFlag? '关闭复制粘贴图片上传功能': '开启复制粘贴图片上传功能'
                  }}
                  </el-checkbox>
                </span>
              </div>
              <el-upload class="upload" action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp" :before-upload="beforeAvatarUpload" :multiple="false"
                :data="postData"
                :file-list="order_yarn_info.file_url ? [{ name: '说明文件', url: order_yarn_info.file_url }] : []"
                list-type="picture-card" :limit="1" :before-remove="beforeRemove" :on-success="successFile"
                :on-preview="handlePictureCardPreview" ref="uploada">
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
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn" @click="close">取消</span>
          <span class="btn" style="margin-left: 20px" :class="{ backHoverBlue: !update, backHoverOrange: update }"
            @click="saveOrder(1)">{{ update? '确认修改': '确认采购' }}</span>
          <span v-if="!update" class="btn backHoverGreen" style="margin: 0 20px" @click="saveOrder(2)">确认并入库</span>
        </div>
      </template>
      <template v-if="step === 2">
        <div class="createCtn" style="max-height: 700px; overflow: scroll">
          <div class="rowCtn">
            <div class="colCtn">
              <div class="label">
                <span class="text">仓库名称</span>
                <span class="explanation">(必选)</span>
              </div>
              <div class="content">
                <div class="elCtn">
                  <el-cascader v-model="store_info.select_id" :options="store_list"
                    :props="{ value: 'id', label: 'name', children: 'second_data' }" placeholder="请选择入库仓库">
                  </el-cascader>
                </div>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">单位名称</span>
              </div>
              <div class="content">
                <el-select placeholder="请选择供货商" disabled v-model="store_info.client_id">
                  <el-option v-for="item in client_arr" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn" style="flex: 1.5">毛条名称</div>
                <div class="tcolumn">
                  <div style="display:flex;align-items:center">
                    毛条属性
                    <el-tooltip style="cursor: pointer; margin-left: 10px" class="item" effect="dark" content="统一属性"
                      placement="top">
                      <svg class="iconFont copyIcon hoverBlue" aria-hidden="true" @click="copyInputInfo('attribute')">
                        <use xlink:href="#icon-tongbushuju1"></use>
                      </svg>
                    </el-tooltip>
                  </div>
                </div>
                <div class="tcolumn">批号</div>
                <div class="tcolumn">数量(kg)</div>
                <div class="tcolumn">件数(件)</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow" v-for="(item, index) in store_info.child_data" :key="index">
                <div class="tcolumn" style="flex: 1.5">
                  <el-select class="el" placeholder="毛条名称" v-model="item.name" @change="getColor($event, item)">
                    <el-option v-for="item in selfYarnArr" :key="item.name" :label="item.name"
                      :value="item.name"></el-option>
                  </el-select>
                </div>
                <div class="tcolumn">
                  <!-- <el-select class="el" v-model="item.attribute" placeholder="属性">
                    <el-option label="绞纱" value="绞纱"></el-option>
                    <el-option label="筒纱" value="筒纱"></el-option>
                  </el-select> -->
                  <el-input class="el" v-model="item.attribute" placeholder="毛条属性" />
                </div>
                <div class="tcolumn" style="flex-direction: row; align-items: center">
                  <el-input class="el" v-model="item.batch_code" placeholder="批号" style="margin-right: 4px"></el-input>
                </div>
                <div class="tcolumn">
                  <el-input class="el" v-model="item.action_weight" placeholder="数量"></el-input>
                </div>
                <div class="tcolumn" style="flex-direction: row; align-items: center">
                  <el-input class="el" v-model="item.items" placeholder="件数"></el-input>
                  <div class="opr red" style="margin-left: 8px" @click="
                    store_info.child_data.length > 1
                      ? $deleteItem(store_info.child_data, index)
                      : $message.warning('至少有一项')
                  ">
                    <i class="el-icon-circle-close" style="font-size: 18px"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="btn btnMain" @click="
                $addItem(store_info.child_data, {
                  action_weight: '',
                  attribute: '',
                  batch_code: '',
                  desc: '',
                  item: '',
                  name: '',
                  related_info_id: '',
                })
              ">
                添加毛条
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn" style="max-width: 224.67px">
              <div class="label">
                <span class="text">操作时间</span>
                <span class="explanation">(必选)</span>
              </div>
              <div class="content">
                <div class="elCtn">
                  <el-date-picker v-model="store_info.complete_time" type="date" value-format="yyyy-MM-dd"
                    placeholder="选择操作时间">
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
                  <el-input v-model="store_info.desc" placeholder="请输入备注信息"></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn" @click="close">取消</span>
          <span class="btn backHoverGreen" style="margin: 0 20px" @click="inputStore">确认</span>
        </div>
      </template>
    </div>
    <add-material :show="create_flag_material" @close="create_flag_material = false"></add-material>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { yarnOrder, stock, material } from '@/assets/js/api'
export default Vue.extend({
  props: {
    orderId: {
      default: ''
    },
    show: {
      type: Boolean,
      required: true
    },
    info: {
      type: Object,
      default: {}
    },
    update: {
      type: Boolean,
      default: false
    },
    child_data: {
      type: Array,
      default() {
        return [
          {
            name: '',
            weight: '',
            attribute: '',
            price: ''
          }
        ]
      }
    }
  },
  data(): any {
    return {
      loading: false,
      cvFlag: false,
      dialogVisible: false,
      create_flag_material: false,
      dialogImageUrl: '',
      step: 1,
      postData: { key: '', token: '' },
      order_yarn_info: {
        order_id: '',
        settle_type: 'KP',
        client_id: '',
        total_price: '',
        child_data: this.child_data,
        order_time: this.$getDate(new Date()),
        // @ts-ignore
        delivery_time: this.$GetDateStr(5),
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
            desc: '',
            item: '',
            name: '',
            related_info_id: '',
          }
        ]
      }
    }
  },
  computed: {
    yarn_list() {
      if (this.info.orderId) {
        // console.log(this.info)
        return this.info.child_data.map((item: any) => {
          return {
            label: item.name,
            value: item.name,
            id: item.id
          }
        })
      } else {
        return this.$store.state.api.materialType.arr.map((item: any) => {
          return {
            value: item.name,
            label: item.name,
            children: item.child_data.map((itemChild: any) => {
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
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 2)
    },
    clientArr() {
      return this.$store.state.api.client.arr.filter((item: any) => (item.status as number) === 1)
    },
    client_arr() {
      return this.$store.state.api.factory.arr
    },
    token() {
      return this.$store.state.status.token
    }
  },
  methods: {
    copyInfo(type: string) {
      let info = ''
      this.order_yarn_info.child_data.forEach((item: any, index: number) => {
        if (index === 0) {
          info = item[type]
        } else {
          item[type] = info
        }
      })
    },
    copyInputInfo(type: string) {
      let info = ''
      this.store_info.child_data.forEach((item: any, index: number) => {
        if (index === 0) {
          info = item[type]
        } else {
          item[type] = info
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
      this.order_yarn_info.file_url = ''
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
          for (let item of clipboardData.items) {
            if (item.type.indexOf('image') !== -1) {
              blob = item.getAsFile()
            }
          }
          let render = new FileReader()
          render.onload = (evt: any) => {
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
            xhr.onreadystatechange = () => {
              _this.loading = false
              if (xhr.readyState === 4) {
                _this.$message.success('上传成功')
                // @ts-ignore
                // _this.sampleInfo.cv_list.push(
                //   // @ts-ignore
                //   'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key
                // )
                // @ts-ignore
                _this.order_yarn_info.file_url = 'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key
                _this.postData = {
                  key: JSON.parse(xhr.responseText).key,
                  url: 'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key
                }
                // @ts-ignore
                _this.order_yarn_info.file_list = [
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
    close() {
      this.$emit('close')
      if (this.notify) {
        this.notify.close()
        this.deletePasteImage()
      }
      this.reset()
    },
    reset() {
      this.cvFlag = false
      this.order_yarn_info = {
        order_id: '',
        settle_type: 'KP',
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
        delivery_time: this.$GetDateStr(5),
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
      this.step = 1
    },
    cmpTotalPrice() {
      this.order_yarn_info.total_price = (
        this.order_yarn_info.child_data.reduce((total: any, current: any) => {
          return total + Number(current.price) * Number(current.weight)
        }, 0) +
        (this.order_yarn_info.additional_fee as any[]).reduce((total, current) => {
          return total + Number(current.price)
        }, 0)
      ).toFixed(2)
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
    changeProName(item: any, index: number) {
      this.order_yarn_info.child_data[index].name = item.name
      this.order_yarn_info.child_data[index].order_info_id = item.id
    },
    saveOrder(step: number) {
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
          item.name = item.item ? item.item.label : item.name
          return this.$formCheck(item, [
            {
              key: 'name',
              errMsg: '请选择毛条名称'
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
      this.loading = true
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
      this.saveEditOrCreate(params, step)
    },
    saveEditOrCreate(params: any, step: number) {
      if (this.update) {
        material.orderEdit(params).then((res) => {
          if (res.data.status) {
            if (step === 1) {
              this.$message.success((this.update ? '修改' : '添加') + '成功')
              this.$emit('afterCreate')
              this.close()
            }
            if (step === 2) {
              this.store_info.client_id = this.order_yarn_info.client_id
              this.store_info.related_id = res.data.data

              this.selfYarnArr = this.$mergeData(this.order_yarn_info.child_data, {
                mainRule: 'name'
              })

              this.store_info.child_data = this.order_yarn_info.child_data.map((item: any) => {
                return {
                  action_weight: item.weight,
                  attribute: item.attribute,
                  name: item.name,
                  price: item.price,
                  batch_code: '',
                  item: '',
                  related_info_id: ''
                }
              })
              this.step = 2
            }
          }
          this.loading = false
        })
      } else {
        material
          .orderCreate({
            data: [params]
          })
          .then((res) => {
            if (res.data.status) {
              if (step === 1) {
                this.$message.success((this.update ? '修改' : '添加') + '成功')
                this.$emit('afterCreate')
                this.close()
              }
              if (step === 2) {
                this.store_info.client_id = this.order_yarn_info.client_id
                this.store_info.related_id = res.data.data[0]
                material
                  .orderDetail({
                    id: res.data.data[0]
                  })
                  .then((ress) => {
                    this.selfYarnArr = this.$mergeData(ress.data.data.child_data, {
                      mainRule: 'name'
                    })

                    this.store_info.child_data = ress.data.data.child_data.map((item: any) => {
                      return {
                        action_weight: item.weight,
                        attribute: item.attribute,
                        name: item.name,
                        price: item.price,
                        batch_code: '',
                        item: '',
                        related_info_id: item.id
                      }
                    })
                    this.step = 2
                  })
              }
            }
            this.loading = false
          })
      }
    },
    // 根据选中的毛条初始化颜色属性下拉框
    getColor(yarnName: string, info?: any) {
      // 特殊连接符 IamConnector
      info.colorArr = (this.selfYarnArr as any[])
        .find((item: any) => {
          return item.name === yarnName
        })
        .childrenMergeInfo.map((item: any) => {
          return {
            value: item.color,
            label: item.color
          }
        })
      if (info) {
        info.color = ''
      }
    },
    inputStore() {
      if (
        this.$formCheck(this.store_info, [
          {
            key: 'select_id',
            errMsg: '请选择仓库'
          }
        ])
      ) {
        return
      }

      if (
        this.store_info.child_data.some((item: any) => {
          return this.$formCheck(item, [
            {
              key: 'name',
              errMsg: '请选择毛条名称'
            },
          ])
        })
      ) {
        return
      }

      if (
        this.store_info.child_data.some((item: any) => {
          return this.$formCheck(item, [
            {
              key: 'action_weight',
              errMsg: '请输入数量'
            },
          ])
        })
      ) {
        return
      }

      this.loading = true
      this.store_info.store_id = this.store_info.select_id[0]
      this.store_info.second_store_id = this.store_info.select_id[1]
      this.store_info.order_id = this.orderId
      this.store_info.child_data.forEach((item: any) => {
        item.store_client_id = item.store_client_id || -1
        item.batch_code = item.batch_code || ''
        item.desc = item.desc || ''
      })

      this.stockCreate()
    },
    stockCreate() {
      stock.materialCreate({ data: [this.store_info] }).then((res) => {
        if (res.data.status) {
          this.$message.success('入库成功')
          this.$emit('afterCreate')
          this.close()
        }
        this.loading = false
      })
    },
    getOrderYarnInfo() {
      if (this.update) {
        this.order_yarn_info = this.info
      } else {
        this.order_yarn_info = {
          order_id: this.orderId || '',
          client_id: '',
          settle_type: 'KP',
          total_price: '',
          child_data:
            this.child_data.length > 0
              ? this.child_data
              : [
                {
                  name: '',
                  weight: '',
                  attribute: '',
                  price: ''
                }
              ],
          order_time: this.$getDate(new Date()),
          delivery_time: this.$GetDateStr(5),
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
      this.$forceUpdate()
    }
  },
  watch: {
    show(val) {
      this.getOrderYarnInfo()
    },
    update(val) {
      this.getOrderYarnInfo()
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/materialType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getMaterialTypeAsync'
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
@import './materialAddPO.less';
</style>
<style lang="less">
.noPadInput {
  .el-input__inner {
    padding-right: 5px;
  }
}

.el-date-editor.el-input {
  width: 100%;
}
</style>
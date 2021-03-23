<template>
  <div class="deductCtn popup"
    v-if="show">
    <div class="main">
      <div class="titleCtn">
        <span class="text">扣款信息</span>
        <i class="close_icon el-icon-close"
          @click="reset"></i>
      </div>
      <div class="contentCtn">
        <div class="row">
          <div class="label">{{typeFilter(data.type)}}单号：</div>
          <div class="info text"
            style="color:#1a95ff">{{data.pcode}}</div>
        </div>
        <div class="row"
          v-for="(item,index) in deductContent"
          :key="index">
          <div class="label"
            :style="{'visibility':index===0?'visible':'hidden'}">扣款项：</div>
          <div class="info infoFlex">
            <!-- 注意这里保存的是中文信息，不是id信息，仅用于前端展示 -->
            <el-select style="margin-right:8px"
              v-model="item.yarn"
              placeholder="请选择扣款项">
              <el-option v-for="item in data.yarn"
                :key="item.value"
                :value="item.label"
                :label="item.label"></el-option>
            </el-select>
            <el-input v-model="item.price"
              placeholder="扣款金额"
              @input="getTotalPrice">
              <template slot="append">元</template>
            </el-input>
            <div v-if="index===0"
              class="info_btn blue"
              @click="$addItem(deductContent,{
              yarn:'',
              price:''
            })">添加</div>
            <div v-if="index>0"
              class="info_btn red"
              @click="$deleteItem(deductContent,index)">删除</div>
          </div>
        </div>
        <div class="row">
          <div class="label must">总金额：</div>
          <div class="info text">
            <el-input v-model="price"
              placeholder="总金额">
              <template slot="append">元</template>
            </el-input>
          </div>
        </div>
        <div class="row">
          <div class="label">文件信息：</div>
          <div class="info">
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
        <div class="row">
          <div class="label">扣款原因：</div>
          <div class="info">
            <el-input v-model="desc"
              placeholder="请输入扣款原因"></el-input>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <div class="opr"
          @click="reset">取消</div>
        <div class="opr blue"
          @click="saveDeduct">确认扣款</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DeductInfo } from '@/types/common'
import { deduct } from '@/assets/js/api'
@Component
export default class Deduct extends Vue {
  file: string = ''
  postData = { key: '', token: this.token }
  desc: string = ''
  price: number | string = 0
  @Prop() show!: boolean
  deductContent: Array<{ yarn: string; price: string }> = [
    {
      yarn: '',
      price: ''
    }
  ]
  @Prop() data!: {
    yarn: Array<{ value: number; label: string }>
    pid: number
    pcode: string
    type: 1 | 2 | 3 | 4 | 5
  }

  get token() {
    return this.$store.state.status.token
  }
  beforeAvatarUpload(file: any) {
    const fileName = file.name.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
    const fileNameLength = file.name.length // 取到文件名长度
    const fileFormat = file.name.substring(fileName + 1, fileNameLength) // 截
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
  }

  successFile(response: any) {
    this.file = 'https://file.zwyknit.com/' + response.key
  }

  reset() {
    this.deductContent = [
      {
        yarn: '',
        price: ''
      }
    ]
    this.price = 0
    this.desc = ''
    this.$emit('update:show', false)
  }
  // filter不知道咋用，只能用methods凑合
  typeFilter(type: number) {
    const typeArr = ['', '采购', '加工', '订购', '加工', '订单']
    return typeArr[type]
  }
  getTotalPrice() {
    this.price = this.deductContent.reduce((total, current) => {
      return total + Number(current.price)
    }, 0)
  }
  saveDeduct() {
    this.$emit('beforeDeduce', {
      deduct_content: this.deductContent,
      total_price: this.price
    })
    const formData: DeductInfo = {
      deduct_content: JSON.stringify(this.deductContent),
      total_price: this.price,
      deduct_type: this.data.type,
      pid: this.data.pid,
      deduct_file: this.file,
      desc: this.desc
    }
    deduct.create(formData).then((res) => {
      if (res.data.status) {
        this.$message.success('添加扣款信息成功')
        this.$emit('afterDeduce')
        this.reset()
      }
    })
  }
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'status/token',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getTokenAsync'
      }
    ])
  }
}
</script>
<style lang="less" scoped>
@import './deduct.less';
</style>
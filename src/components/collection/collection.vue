<template>
  <div class="billCtn popup"
    v-if="show">
    <div class="main">
      <div class="titleCtn">
        <span class="text">收据信息</span>
        <i class="close_icon el-icon-close"
          @click="reset"></i>
      </div>
      <div class="contentCtn">
        <!-- 父级给关联单号 -->
        <div class="row"
          v-if="data.pcode">
          <div class="label">{{typeFilter(data.type)}}单号：</div>
          <div class="info text"
            style="color:#1a95ff">{{data.pcode}}</div>
        </div>
        <!-- 自选关联单号 -->
        <div class="row"
          v-if="!data.pcode">
          <div class="label">{{typeFilter(data.type)}}单号：</div>
          <div class="info">
            <el-select v-model="code"
              multiple
              filterable
              remote
              reserve-keyword
              :placeholder="'请输入'+typeFilter(data.type)+'单号搜索'"
              :remote-method="searchCode"
              :loading="searchLoading">
              <el-option v-for="item in searchList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="label isMust">收款方式：</div>
          <div class="info">
            <el-select v-model="type"
              placeholder="请选择收款方式">
              <el-option label="现金收款"
                value="现金收款"></el-option>
              <el-option label="银行转账"
                value="银行转账"></el-option>
              <el-option label="网银支付"
                value="网银支付"></el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="label isMust">收据金额：</div>
          <div class="info">
            <el-input placeholder="请输入收据金额"
              v-model="price"></el-input>
          </div>
        </div>
        <div class="row">
          <div class="label">开票日期：</div>
          <div class="info">
            <el-date-picker style="width:100%"
              v-model="date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择下单日期">
            </el-date-picker>
          </div>
        </div>
        <div class="row">
          <div class="label">收款凭证：</div>
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
          <div class="label">收款备注：</div>
          <div class="info">
            <el-input placeholder="请输入备注信息"
              v-model="desc"></el-input>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <div class="opr"
          @click="reset">取消</div>
        <div class="opr blue"
          @click="saveCollection">确认收款</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { index, collection } from '@/assets/js/api'
import { CollectionInfo } from '@/types/common'
@Component
export default class Deduct extends Vue {
  @Prop() collectType!: number
  @Prop() show!: boolean
  @Prop() data!: {
    client_id?: number // client_id用于标记是哪个客户的开票单据
    pid?: string // pid一般是关联单据号
    pcode?: string
    type: 1 | 2 | 3 | 4 | 5
  }
  type: string = ''
  date: string = this.$getDate(new Date()) // 日期
  code: string[] = [] // 无pcode时候自选code
  file: string = '' //
  postData = { key: '', token: this.token }
  desc: string = ''
  price: number | string = ''
  searchLoading: boolean = false
  searchList: any[] = []
  get token() {
    return this.$store.state.status.token
  }
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
  }

  successFile(response: any) {
    this.file = 'https://file.zwyknit.com/' + response.key
  }

  reset() {
    this.price = 0
    this.desc = ''
    this.$emit('update:show', false)
  }
  // filter不知道咋用，只能用methods凑合
  typeFilter(type: number) {
    const typeArr = ['', '采购', '加工', '订购', '加工', '订单']
    return typeArr[type]
  }
  saveCollection() {
    this.$emit('beforeCollection')
    const formData: CollectionInfo = {
      type: this.type,
      collect_price: this.price,
      client_id: this.data.client_id,
      collect_type: this.data.type,
      pid: this.data.pid ? [this.data.pid] : this.code,
      collect_date: this.date,
      file_url: this.file || null,
      collect_or_pay: this.collectType,
      desc: this.desc
    }
    collection.create(formData).then((res) => {
      if (res.data.status) {
        this.$message.success('添加收款信息成功')
        this.$emit('afterCollection')
        this.reset()
      }
    })
  }
  searchCode(query: string) {
    if (!query) {
      return
    }
    this.searchLoading = true
    index
      .searchAll({
        keyword: query,
        limit: 10,
        client_id: this.data.client_id || null
      })
      .then((res) => {
        const data = res.data.data
        // 3和4是毛条订购 加工 这个接口暂时不支持搜索，先把纱线的搞好
        if (this.data.type === 1) {
          this.searchList = data.purchase
        } else if (this.data.type === 2) {
          this.searchList = data.process
        } else if (this.data.type === 3) {
          this.searchList = []
        } else if (this.data.type === 4) {
          this.searchList = []
        } else if (this.data.type === 5) {
          this.searchList = data.order
        }
        this.searchList = this.searchList.map((item) => {
          return {
            value: item.id,
            label: item.code
          }
        })
        this.searchLoading = false
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
@import './collection.less';
</style>
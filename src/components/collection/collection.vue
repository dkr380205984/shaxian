<template>
  <div class="billCtn popup"
    v-if="show">
    <div class="main">
      <div class="titleCtn">
        <span class="text">{{collectType===1?'收款':'付款'}}信息</span>
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
          <div class="label isMust">{{collectType===1?'收款':'付款'}}方式：</div>
          <div class="info">
            <el-select v-model="type"
              :placeholder="'请选择'+collectType===1?'收款':'付款'+'方式'">
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
          <div class="label isMust">{{collectType===1?'收款':'付款'}}金额：</div>
          <div class="info">
            <el-input placeholder="请输入金额"
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
              placeholder="选择开票日期">
            </el-date-picker>
          </div>
        </div>
        <div class="row">
          <div class="label">{{collectType===1?'收款':'付款'}}凭证：</div>
          <div class="info">
            <el-checkbox v-model="cvFlag"
              @change="(ev)=>{return changeCVOpration(ev)}">{{cvFlag?'关闭复制粘贴图片上传功能':'开启复制粘贴图片上传功能'}}
            </el-checkbox>
            <el-upload class="upload"
              action="https://upload.qiniup.com/"
              accept="image/jpeg,image/gif,image/png,image/bmp"
              :before-upload="beforeAvatarUpload"
              :data="postData"
              :file-list="file_list"
              :before-remove="beforeRemove"
              :limit="1"
              :on-success="successFile"
              :on-preview="handlePictureCardPreview"
              ref="uploada"
              list-type="picture-card">
              <div class="uploadBtn">
                <i class="el-icon-upload"></i>
                <span>上传图片</span>
              </div>
              <div slot="tip"
                class="el-upload__tip">只能上传一张jpg/png图片文件，且不超过10M(请勿上传带特殊字符的图片)</div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" append-to-body>
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
        </div>
        <div class="row">
          <div class="label">{{collectType===1?'收款':'付款'}}备注：</div>
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
          @click="saveCollection">确认{{collectType===1?'收款':'付款'}}</div>
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
  notify: any = ''
  dialogImageUrl: string = ''
  dialogVisible: boolean = false
  loading: boolean = false
  cvFlag: boolean = false
  file_list: Array<any> = []
  image_data: Array<any> = []
  searchLoading: boolean = false
  searchList: any[] = []
  get token() {
    return this.$store.state.status.token
  }
  handlePictureCardPreview(file:any) {
    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
  }
  beforeRemove(file:any, fileList:any){
    // 上传超过10M自动删除
    if(file.size && !(file.size / 1024 / 1024 < 10)){
      return
    }

    this.$confirm('即将删除图片, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).then(() => {
        //执行删除操作,找到相同的删除
        let fileIndex = fileList.findIndex((item: any) => {
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

        this.removeFile(file)
      }).catch(() => {
        this.$message({
            type: 'info',
            message: '已取消删除'
        });          
      });
      return false;
  }
  removeFile(file: { response: { hash: string; key: string }; url: string }) {
    if (this.file_list!.find((item) => item.url === file.url)) {
      this.$deleteItem(
        this.file_list!,
        this.file_list!.map((item) => item.url).indexOf(file.url)
      )
      this.$deleteItem(
        this.image_data,
        this.image_data.indexOf(file.url)
      )
    } else {
      this.$deleteItem(
        this.image_data,
        this.image_data.indexOf('https://file.zwyknit.com/' + file.response.key)
      )
    }
  }
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
  }
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
          // document.getElementById('cvImg' + _this.productInfo.cvImageLength).setAttribute('src', base64)
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
              _this.file_list = [{name: JSON.parse(xhr.responseText).key, url: 'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key}]
              _this.image_data = ['https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key]
            }
          }
        }
        if (render.readAsDataURL && blob) {
          render.readAsDataURL(blob)
        }
      }
    }
  }
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
  }
  addPasteImage() {
    document.addEventListener('paste', this.pasteImage)
  }
  deletePasteImage() {
    document.removeEventListener('paste', this.pasteImage)
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
    this.price = ''
    this.desc = ''
    this.$emit('update:show', false)
    this.cvFlag = false
    this.file_list = []
    this.notify.close()
    this.deletePasteImage()
  }
  // filter不知道咋用，只能用methods凑合
  typeFilter(type: number) {
    const typeArr = ['', '采购', '加工', '订购', '加工', '订单']
    return typeArr[type]
  }
  saveCollection() {
    this.$emit('beforeCollection')
    const formData: CollectionInfo = {
      id: null,
      type: this.type,
      collect_price: this.price,
      client_id: this.data.client_id,
      collect_type: this.data.type,
      pid: this.data.pid ? [this.data.pid] : this.code,
      collect_date: this.date,
      file_url: this.image_data[0] || this.file || null,
      collect_or_pay: this.collectType,
      desc: this.desc
    }
    collection.create({data: [formData]}).then((res) => {
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
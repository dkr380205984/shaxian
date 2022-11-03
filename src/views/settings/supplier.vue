<template>
  <div class="indexMain" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">供货商列表</span>
        <span class="addBtn btn btnMain" @click="changeSupplier()">添加供货商</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name" @change="changeRouter(1)" placeholder="搜索供货商名称"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="status" clearable @change="changeRouter(1)" placeholder="筛选供货商状态">
                <el-option v-for="item in statusArr" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr" @click="resetFilter">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">供货商编码</div>
              <div class="column">供货商名称</div>
              <div class="column">供货商简称</div>
              <div class="column">主要负责人</div>
              <div class="column">联系电话</div>
              <div class="column">地址</div>
              <div class="column">联系人</div>
              <div class="column">联系人电话</div>
              <div class="column">当前状态</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row" v-for="item in supplierList" :key="item.id">
              <div class="column">{{ item.code || item.id }}</div>
              <div class="column">{{ item.name }}</div>
              <div class="column">{{ item.abbreviation }}</div>
              <div class="column">{{ item.user_name }}</div>
              <div class="column">{{ item.phone || '/' }}</div>
              <div class="column">{{ item.address || '/' }}</div>
              <div class="column">{{ item.contact || '/' }}</div>
              <div class="column">{{ item.contact_phone || '/' }}</div>
              <div :class="`column ${(item.status && 'green') || 'red'}`">
                {{ (item.status && '合作中') || '禁用中' }}
              </div>
              <div class="column">
                <span class="col_btn orange" @click="changeSupplier(item)">修改</span>
                <span class="col_btn green" v-if="!item.status" @click="disableSupplier(item)">启用</span>
                <span class="col_btn red" v-else @click="disableSupplier(item)">禁用</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination
            background
            :current-page.sync="page"
            @current-change="changeRouter"
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="popup" v-show="addFlag">
      <div class="main">
        <div class="titleCtn">
          <div class="text">{{ (supplierInfo.id && '修改') || '添加' }}供货商</div>
          <i class="el-icon-close" @click="addFlag = false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">供货商编码：</div>
            <div class="info">
              <el-input placeholder="请输入供货商编码" type="number" v-model="supplierInfo.code"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">供货商名称：</div>
            <div class="info">
              <el-input placeholder="请输入供货商名称" v-model="supplierInfo.name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">供货商简称：</div>
            <div class="info">
              <el-input placeholder="请输入供货商简称" v-model="supplierInfo.abbreviation"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">主要负责人：</div>
            <div class="info">
              <el-input placeholder="请输入主要负责人" v-model="supplierInfo.user_name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">供货商电话：</div>
            <div class="info">
              <el-input placeholder="请输入供货商电话" v-model="supplierInfo.phone"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">供货商地址：</div>
            <div class="info">
              <el-input placeholder="请输入供货商地址" v-model="supplierInfo.address"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">联系人：</div>
            <div class="info">
              <el-input placeholder="请输入联系人" v-model="supplierInfo.contact"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">联系人电话：</div>
            <div class="info">
              <el-input placeholder="请输入联系人电话" v-model="supplierInfo.contact_phone"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr" @click="addFlag = false">取消</div>
          <div class="opr blue" @click="saveSupplier">保存</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn" style="float: left">
          <div class="buttonList">
            <div class="btn backHoverBlue" @click="importExcelData('添加供货商')">
              <i class="el-icon-s-grid"></i>
              <span class="text">批量导入单据</span>
            </div>
          </div>
          <div class="buttonList">
            <div class="btn backHoverBlue" @click="downloadExcel('供货商添加模板')">
              <i class="el-icon-s-grid"></i>
              <span class="text">下载导入模板</span>
            </div>
          </div>
          <span class="btn hoverBlue">
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">
                第一步：下载导入模板。<br />
                第二步：填写模板信息。注意：编码为数字，请勿其它类型。<br />
                第三步：导入模板，完成导入
              </div>
              <span>导入教程</span>
            </el-tooltip>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { partyB } from '@/assets/js/api'
import { PartyB } from '@/types/common'
export default Vue.extend({
  data(): {
    supplierInfo: PartyB
    supplierList: PartyB[]
    [propName: string]: any
  } {
    return {
      loading: true,
      addFlag: false,
      supplierList: [],
      supplierInfo: {
        id: null,
        name: '',
        abbreviation: '',
        user_name: '',
        phone: '',
        address: '',
        contact: '',
        contact_phone: ''
      },
      page: 1,
      total: 1,
      name: '',
      status: '1',
      statusArr: [
        { id: '0', name: '禁用中' },
        { id: '1', name: '合作中' }
      ]
    }
  },
  methods: {
    changeRouter(pages: number = 1) {
      this.$router.replace(`/settings/supplier?pages=${pages}&name=${this.name || ''}&status=${this.status || ''}`)
    },
    init() {
      this.name = this.$route.query.name || ''
      this.status = this.$route.query.status || ''
      this.getList(Number(this.$route.query.pages) || 1)
    },
    getList(pages: number = 1) {
      this.loading = true
      partyB
        .list({
          type: 2,
          limit: 10,
          page: pages,
          name: this.name || null,
          status: this.status || ''
        })
        .then((res: any) => {
          if (res.data.staus !== false) {
            this.supplierList = res.data.data.items
            this.total = res.data.data.total
            this.loading = false
            // 更新页码
            if (pages !== this.page) {
              this.page = pages
            }
          }
        })
    },
    resetFilter() {
      this.name = ''
      this.status = '1'
      this.changeRouter()
    },
    saveSupplier() {
      if (this.$submitLock()) {
        return
      }
      if (!this.supplierInfo.name) {
        this.$message.warning('请输入客户名称')
        return
      }
      // if (!this.supplierInfo.user_name) {
      //   this.$message.warning('请输入主要负责人')
      //   return
      // }
      partyB
        .create({
          id: this.supplierInfo.id || null,
          name: this.supplierInfo.name,
          code: this.supplierInfo.code,
          abbreviation: this.supplierInfo.abbreviation,
          user_name: this.supplierInfo.user_name,
          phone: this.supplierInfo.phone,
          contact: this.supplierInfo.contact,
          contact_phone: this.supplierInfo.contact_phone,
          address: this.supplierInfo.address,
          type: 2 // 1客户2供应商3加工厂
        })
        .then((res) => {
          if (res.data.status !== false) {
            this.$message.success(`${(this.supplierInfo.id && '修改') || '添加'}成功`)
            this.addFlag = false
            this.getList()
          }
        })
    },
    changeSupplier(item: PartyB) {
      // console.log(item)
      this.addFlag = true
      this.supplierInfo = {
        id: (item && item.id) || null,
        name: (item && item.name) || '',
        // @ts-ignore
        code: (item && item.code) || (item && item.id) || '',
        abbreviation: (item && item.abbreviation) || '',
        user_name: (item && item.user_name) || '',
        phone: (item && item.phone) || '',
        contact: (item && item.contact) || '',
        contact_phone: (item && item.contact_phone) || '',
        address: (item && item.address) || ''
      }
    },
    downloadExcel(type: string) {
      if (type === '供货商添加模板') {
        this.$downloadExcel(
          [],
          [
            { title: '供货商编码（选填）', key: 'code' },
            { title: '供货商名称（必填）', key: 'name' },
            { title: '供货商简称（选填）', key: 'abbreviation' },
            { title: '主要负责人（选填）', key: 'user_name' },
            { title: '供货商电话（选填）', key: 'phone' },
            { title: '供货商地址（选填）', key: 'address' },
            { title: '联系人（选填）', key: 'contact' },
            { title: '联系人电话（选填）', key: 'contact_phone' }
          ],
          type
        )
      }
    },
    importExcelData(type: string) {
      const inputFile = document.createElement('input')
      inputFile.type = 'file'
      inputFile.accept = '.xlsx,.xls'
      inputFile.addEventListener('change', (e) => {
        this.getExcelData(e, this.saveImportData, type)
      })
      let click = document.createEvent('MouseEvents')
      click.initEvent('click', true, true)
      inputFile.dispatchEvent(click)
    },
    getExcelData(file: any, callBack: any, type: string) {
      const _this = this
      const XLSX = require('xlsx')
      const files = file.target.files
      const fileReader = new FileReader()
      fileReader.onload = function (e: any) {
        try {
          const data = e.target.result
          const bytes = new Uint8Array(data) // 无符号整型数组
          const len = bytes.byteLength
          const binarys = new Array(len) // 创建定长数组，存储文本
          for (let i = 0; i < len; i++) {
            binarys[i] = String.fromCharCode(bytes[i])
          }
          const workbook = XLSX.read(binarys.join(''), { type: 'binary' })
          if (!workbook) {
            return null
          }
          const r: any = {}
          workbook.SheetNames.forEach((name: string) => {
            // 遍历每张纸数据
            r[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name])
          })
          callBack && callBack(r, type)
        } catch (e) {
          _this.$message.error('文件类型不正确')
        }
      }
      fileReader.readAsArrayBuffer(files[0])
    },
    saveImportData(data: any, type: string) {
      let typeObj: any = {}
      if (type === '添加供货商') {
        typeObj = {
          code: ['供货商编码（选填）', ''],
          name: ['供货商名称（必填）'],
          abbreviation: ['供货商简称（选填）', ''],
          user_name: ['主要负责人（选填）', ''],
          phone: ['供货商电话（选填）', ''],
          address: ['供货商地址（选填）', ''],
          contact: ['联系人（选填）', ''],
          contact_phone: ['联系人电话（选填）', '']
        }
      }
      let submitData: Array<PartyB> = []
      for (const prop in data) {
        for (const key in data[prop]) {
          let obj: any = {}
          for (const indexType in typeObj) {
            if (typeObj[indexType][0]) {
              obj[indexType] = data[prop][key][typeObj[indexType][0]] || typeObj[indexType][1]
              if (obj[indexType] === undefined) {
                this.$message.error('解析失败，请使用标准模板或检测必填数据是否存在空的情况！！！')
                return
              }
            } else {
              obj[indexType] = typeObj[indexType][1]
            }
          }
          obj.id = null
          obj.type = 2
          obj.client_type = null
          submitData.push(obj)
        }
      }
      if (submitData.length === 0) {
        this.$message.warning('未读取到可用参数')
        return
      }
      if (type === '添加供货商') {
        partyB.beachCreate({ data: submitData }).then((res) => {
          if (res.data.status) {
            this.$message.success('导入成功')
            this.getList()
          }
        })
      }
    },
    disableSupplier(item: PartyB) {
      this.$confirm('此操作将禁用该供应商, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        partyB
          .check({
            id: item.id
          })
          .then((res) => {
            if (res.data.status !== false) {
              this.$message({
                type: 'success',
                message: `${(item.status && '禁用') || '启用'}成功!`
              })
              this.init()
            }
          })
      })
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route(newVal) {
      this.init()
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/settings/supplier.less';
</style>
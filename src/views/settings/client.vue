<template>
  <div class="indexMain" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">客户列表</span>
        <span class="addBtn btn btnMain" @click="changeClient()">添加客户</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name" @change="changeRouter(1)" placeholder="搜索客户名称"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="status" clearable @change="changeRouter(1)" placeholder="筛选客户状态">
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
              <div class="column">客户编码</div>
              <div class="column">客户名称</div>
              <div class="column">客户简称</div>
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
            <div class="row" v-for="item in clientList" :key="item.id">
              <div class="column">{{ item.code || item.id }}</div>
              <div class="column">{{ item.name }}</div>
              <div class="column">{{ item.abbreviation }}</div>
              <div class="column">{{ item.user_name }}</div>
              <div class="column">{{ item.phone || '/' }}</div>
              <div class="column">{{ item.address || '/' }}</div>
              <div class="column">{{ item.contact || '/' }}</div>
              <div class="column">{{ item.contact_phone || '/' }}</div>
              <div :class="`column ${(item.status === 1 && 'green') || 'red'}`">
                {{ (item.status === 1 && '合作中') || '禁用中' }}
              </div>
              <div class="column">
                <span class="col_btn orange" @click="changeClient(item)">修改</span>
                <span class="col_btn green" v-if="!(item.status === 1)" @click="disableClient(item)">启用</span>
                <span class="col_btn red" v-else @click="disableClient(item)">禁用</span>
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
          <div class="text">{{ (clientInfo.id && '修改') || '添加' }}客户</div>
          <i class="el-icon-close" @click="addFlag = false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">客户编码：</div>
            <div class="info">
              <el-input placeholder="请输入客户编码" v-model="clientInfo.code"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">客户名称：</div>
            <div class="info">
              <el-input placeholder="请输入客户名称" v-model="clientInfo.name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">客户简称：</div>
            <div class="info">
              <el-input placeholder="请输入客户简称" v-model="clientInfo.abbreviation"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">主要负责人：</div>
            <div class="info">
              <el-input placeholder="请输入主要负责人" v-model="clientInfo.user_name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">负责人电话：</div>
            <div class="info">
              <el-input placeholder="请输入负责人电话" v-model="clientInfo.phone"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">客户地址：</div>
            <div class="info">
              <el-input placeholder="请输入客户地址" v-model="clientInfo.address"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">联系人：</div>
            <div class="info">
              <el-input placeholder="请输入联系人" v-model="clientInfo.contact"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">联系人电话：</div>
            <div class="info">
              <el-input placeholder="请输入联系人电话" v-model="clientInfo.contact_phone"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr" @click="addFlag = false">取消</div>
          <div class="opr blue" @click="saveClient">保存</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn" style="float: left">
          <div class="buttonList">
            <div class="btn backHoverBlue" @click="importExcelData('添加客户')">
              <i class="el-icon-s-grid"></i>
              <span class="text">批量导入客户</span>
            </div>
          </div>
          <div class="buttonList">
            <div class="btn backHoverBlue" @click="downloadExcel('客户添加模板')">
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
    clientInfo: PartyB
    clientList: PartyB[]
    [propName: string]: any
  } {
    return {
      loading: true,
      addFlag: false,
      clientList: [],
      clientInfo: {
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
        {
          id: '2',
          name: '禁用中'
        },
        {
          id: '1',
          name: '合作中'
        }
      ]
    }
  },
  methods: {
    changeRouter(pages: number = 1) {
      this.$router.replace(`/settings/client?pages=${pages}&name=${this.name || ''}&status=${this.status || ''}`)
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
          type: 1,
          limit: 10,
          page: pages,
          name: this.name || null,
          status: this.status || null
        })
        .then((res: any) => {
          if (res.data.staus !== false) {
            this.clientList = res.data.data.items
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
    saveClient() {
      if (this.$submitLock()) {
        return
      }
      if (!this.clientInfo.name) {
        this.$message.warning('请输入客户名称')
        return
      }
      // if (!this.clientInfo.user_name) {
      //   this.$message.warning('请输入主要负责人')
      //   return
      // }
      // if (!this.clientInfo.phone) {
      //   this.$message.warning('请输入负责人电话')
      //   return
      // }
      partyB
        .create({
          id: this.clientInfo.id || null,
          name: this.clientInfo.name,
          code: this.clientInfo.code,
          abbreviation: this.clientInfo.abbreviation,
          user_name: this.clientInfo.user_name,
          phone: this.clientInfo.phone,
          contact: this.clientInfo.contact,
          contact_phone: this.clientInfo.contact_phone,
          address: this.clientInfo.address,
          type: 1 // 1客户2供应商3加工厂
        })
        .then((res) => {
          if (res.data.status !== false) {
            this.$message.success(`${(this.clientInfo.id && '修改') || '添加'}成功`)
            this.addFlag = false
            this.init()
          }
        })
    },
    changeClient(item: PartyB) {
      this.addFlag = true
      this.clientInfo = {
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
      if (type === '客户添加模板') {
        this.$downloadExcel(
          [],
          [
            { title: '客户编码（选填）', key: 'code' },
            { title: '客户名称（必填）', key: 'name' },
            { title: '客户简称（选填）', key: 'abbreviation' },
            { title: '主要负责人（选填）', key: 'user_name' },
            { title: '客户电话（选填）', key: 'phone' },
            { title: '客户地址（选填）', key: 'address' },
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
      fileReader.onload = (e: any) => {
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
          if (callBack) {
            callBack(r, type)
          }
        } catch (e) {
          _this.$message.error('文件类型不正确')
        }
      }
      fileReader.readAsArrayBuffer(files[0])
    },
    saveImportData(data: any, type: string) {
      let typeObj: any = {}
      if (type === '添加客户') {
        typeObj = {
          code: ['客户编码（选填）', ''],
          name: ['客户名称（必填）'],
          abbreviation: ['客户简称（选填）', ''],
          user_name: ['主要负责人（选填）', ''],
          phone: ['客户电话（选填）', ''],
          address: ['客户地址（选填）', ''],
          contact: ['联系人（选填）', ''],
          contact_phone: ['联系人电话（选填）', '']
        }
      }
      let submitData: PartyB[] = []
      for (const prop in data) {
         if (data.hasOwnProperty(prop)) {
           // 逻辑处理
           for (const key in data[prop]) {
            if (data[prop].hasOwnProperty(key)) {
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
              obj.type = 1
              obj.client_type = null
              submitData.push(obj)
            }
          }
        }
      }
      if (submitData.length === 0) {
        this.$message.warning('未读取到可用参数')
        return
      }
      if (type === '添加客户') {
        partyB.beachCreate({ data: submitData }).then((res) => {
          if (res.data.status) {
            this.$message.success('导入成功')
            this.getList()
          }
        })
      }
    },
    disableClient(item: PartyB) {
      this.$confirm('此操作将' + (item.status === 1 ? '禁用' : '启用') + '该客户, 是否继续?', '提示', {
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
              location.reload()
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
@import '~@/assets/less/settings/client.less';
</style>
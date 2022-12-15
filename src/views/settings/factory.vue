<template>
  <div class="indexMain" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">加工厂列表</span>
        <span class="addBtn btn btnMain" @click="changeFactory()">新增加工厂</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name" @change="changeRouter(1)" placeholder="搜索加工厂名称"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="type" clearable @change="changeRouter(1)" placeholder="筛选加工厂类型">
                <el-option v-for="item in typeArr" :key="item.id" :label="item.name" :value="item.name"> </el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-select v-model="status" clearable @change="changeRouter(1)" placeholder="筛选加工厂状态">
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
              <div class="column">加工厂编码</div>
              <div class="column">加工厂名称</div>
              <div class="column">工厂简称</div>
              <div class="column">加工类型</div>
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
            <div class="row" v-for="item in factoryList" :key="item.id">
              <div class="column">{{ item.code || item.id }}</div>
              <div class="column">{{ item.name }}</div>
              <div class="column">{{ item.abbreviation }}</div>
              <div class="column">{{ item.client_type }}</div>
              <div class="column">{{ item.user_name }}</div>
              <div class="column">{{ item.phone }}</div>
              <div class="column">{{ item.address || '/' }}</div>
              <div class="column">{{ item.contact || '/' }}</div>
              <div class="column">{{ item.contact_phone || '/' }}</div>
              <div :class="`column ${(item.status === 1 && 'green') || 'red'}`">
                {{ (item.status === 1 && '合作中') || '禁用中' }}
              </div>
              <div class="column">
                <span class="col_btn orange" @click="changeFactory(item)">修改</span>
                <span class="col_btn green" v-if="!(item.status === 1)" @click="disableFactory(item)">启用</span>
                <span class="col_btn red" v-else @click="disableFactory(item)">禁用</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination
            background
            :current-page.sync="page"
            @current-change="getList"
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
          <div class="text">{{ (factoryInfo.id && '修改') || '新增' }}加工厂</div>
          <i class="el-icon-close" @click="addFlag = false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">加工厂编码：</div>
            <div class="info">
              <el-input placeholder="请输入加工厂编码" type="number" v-model="factoryInfo.code"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">加工厂名称：</div>
            <div class="info">
              <el-input placeholder="请输入加工厂名称" v-model="factoryInfo.name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">加工厂简称：</div>
            <div class="info">
              <el-input placeholder="请输入加工厂简称" v-model="factoryInfo.abbreviation"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">加工厂类型：</div>
            <div class="info">
              <el-select v-model="factoryInfo.client_type" placeholder="请选择加工厂类型">
                <el-option v-for="item in typeArr" :key="item.id" :label="item.name" :value="item.name"> </el-option>
              </el-select>
              <!-- <el-input placeholder="请输入加工厂类型"
                v-model="factoryInfo.type"></el-input> -->
            </div>
          </div>
          <div class="row">
            <div class="label">主要负责人：</div>
            <div class="info">
              <el-input placeholder="请输入主要负责人" v-model="factoryInfo.user_name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">加工厂电话：</div>
            <div class="info">
              <el-input placeholder="请输入加工厂电话" v-model="factoryInfo.phone"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">加工厂地址：</div>
            <div class="info">
              <el-input placeholder="请输入加工厂地址" v-model="factoryInfo.address"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">联系人：</div>
            <div class="info">
              <el-input placeholder="请输入联系人" v-model="factoryInfo.contact"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">联系人电话：</div>
            <div class="info">
              <el-input placeholder="请输入联系人电话" v-model="factoryInfo.contact_phone"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr" @click="addFlag = false">取消</div>
          <div class="opr blue" @click="saveFactory">保存</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn" style="float: left">
          <div class="buttonList">
            <div class="btn backHoverBlue" @click="importExcelData('添加加工厂')">
              <i class="el-icon-s-grid"></i>
              <span class="text">批量导入加工厂</span>
            </div>
          </div>
          <div class="buttonList">
            <div class="btn backHoverBlue" @click="downloadExcel('加工厂添加模板')">
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
    factoryInfo: PartyB
    factoryList: PartyB[]
    [propName: string]: any
  } {
    return {
      loading: true,
      addFlag: false,
      factoryList: [],
      factoryInfo: {
        id: null,
        code: '',
        name: '',
        abbreviation: '',
        client_type: '',
        user_name: '',
        phone: '',
        address: '',
        contact: '',
        contact_phone: ''
      },
      page: 1,
      total: 1,
      name: '',
      type: '',
      typeArr: [
        {
          id: 1,
          name: '染色单位'
        },
        {
          id: 2,
          name: '倒筒单位'
        },
        {
          id: 3,
          name: '混纺单位'
        },
        {
          id: 4,
          name: '膨纱单位'
        }
      ],
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
      this.$router.replace(
        `/settings/factory?pages=${pages}&name=${this.name || ''}&status=${this.status || ''}&type=${this.type || ''}`
      )
    },
    init() {
      this.name = this.$route.query.name || ''
      this.status = this.$route.query.status || ''
      this.type = this.$route.query.type || ''
      this.getList(Number(this.$route.query.pages) || 1)
    },
    getList(pages: number = 1) {
      this.loading = true
      partyB
        .list({
          type: 3,
          limit: 10,
          page: pages,
          name: this.name || null,
          status: this.status || null,
          client_type: this.type || null
        })
        .then((res: any) => {
          if (res.data.staus !== false) {
            this.factoryList = res.data.data.items
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
      this.type = ''
      this.changeRouter()
    },
    saveFactory() {
      if (this.$submitLock()) {
        return
      }
      if (!this.factoryInfo.name) {
        this.$message.warning('请输入加工厂名称')
        return
      }
      // if (!this.factoryInfo.abbreviation) {
      //   this.$message.warning('请输入加工厂简称')
      //   return
      // }
      if (!this.factoryInfo.client_type) {
        this.$message.warning('请选择加工厂类型')
        return
      }
      // if (!this.factoryInfo.user_name) {
      //   this.$message.warning('请输入主要负责人')
      //   return
      // }
      partyB
        .create({
          id: this.factoryInfo.id || null,
          name: this.factoryInfo.name,
          code: this.factoryInfo.code,
          abbreviation: this.factoryInfo.abbreviation,
          client_type: this.factoryInfo.client_type,
          user_name: this.factoryInfo.user_name,
          phone: this.factoryInfo.phone,
          contact: this.factoryInfo.contact,
          contact_phone: this.factoryInfo.contact_phone,
          address: this.factoryInfo.address,
          type: 3 // 1客户2供应商3加工厂
        })
        .then((res) => {
          if (res.data.status !== false) {
            this.$message.success(`${(this.factoryInfo.id && '修改') || '添加'}成功`)
            this.addFlag = false
            this.init()
          }
        })
    },
    changeFactory(item: PartyB) {
      this.addFlag = true
      this.factoryInfo = {
        id: (item && item.id) || null,
        name: (item && item.name) || '',
        // @ts-ignore
        code: (item && item.code) || (item && item.id) || '',
        abbreviation: (item && item.abbreviation) || '',
        client_type: (item && item.client_type) || '',
        user_name: (item && item.user_name) || '',
        phone: (item && item.phone) || '',
        contact: (item && item.contact) || '',
        contact_phone: (item && item.contact_phone) || '',
        address: (item && item.address) || ''
      }
    },
    downloadExcel(type: string) {
      if (type === '加工厂添加模板') {
        this.$downloadExcel(
          [],
          [
            { title: '加工厂编码（选填）', key: 'code' },
            { title: '加工厂名称（必填）', key: 'name' },
            { title: '加工厂简称（选填）', key: 'abbreviation' },
            { title: '加工厂类型（必填，选择染色单位、倒筒单位、混纱单位、膨纱单位其中一个）', key: 'client_type' },
            { title: '主要负责人（选填）', key: 'user_name' },
            { title: '加工厂电话（选填）', key: 'phone' },
            { title: '加工厂地址（选填）', key: 'address' },
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
      if (type === '添加加工厂') {
        typeObj = {
          code: ['加工厂编码（选填）', ''],
          name: ['加工厂名称（必填）'],
          abbreviation: ['加工厂简称（选填）', ''],
          client_type: ['加工厂类型（必填，选择染色单位、倒筒单位、混纱单位、膨纱单位其中一个）'],
          user_name: ['主要负责人（选填）', ''],
          phone: ['加工厂电话（选填）', ''],
          address: ['加工厂地址（选填）', ''],
          contact: ['联系人（选填）', ''],
          contact_phone: ['联系人电话（选填）', '']
        }
      }
      let submitData: PartyB[] = []
      for (const prop in data) {
         if (data.hasOwnProperty(prop)) {
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
              obj.type = 3
              submitData.push(obj)
            }
          }
        }
      }
      if (submitData.length === 0) {
        this.$message.warning('未读取到可用参数')
        return
      }
      if (type === '添加加工厂') {
        partyB.beachCreate({ data: submitData }).then((res) => {
          if (res.data.status) {
            this.$message.success('导入成功')
            this.getList()
          }
        })
      }
    },
    disableFactory(item: PartyB) {
      this.$confirm('此操作将' + (item.status === 1 ? '禁用' : '启用') + '该加工厂, 是否继续?', '提示', {
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
                message: `${(item.status === 1 && '禁用') || '启用'}成功!`
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
    this.$checkCommonInfo([
      {
        checkWhich: 'api/client',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPartyBAsync'
      }
    ])
  },
  watch: {
    $route(newVal) {
      this.init()
    }
  },
  filters: {
    filterType(item: number | string) {
      switch (item) {
        case 1:
        case '1':
          return '染色单位'
        case 2:
        case '2':
          return '倒筒单位'
        case 3:
        case '3':
          return '混纺单位'
        case 4:
        case '4':
          return '膨纱单位'
      }
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/settings/factory.less';
</style>
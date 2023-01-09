<template>
  <div id="materialList" class="indexMain" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">毛条列表</span>
        <span class="addBtn btn btnMain" @click="create_flag = true">添加毛条</span>
        <span class="addBtn btn backHoverGreen" @click="downloadExcel('毛条添加模板')">下载导入模板</span>
        <span class="addBtn btn backHoverOrange" @click="importExcelData('添加毛条')">批量导入单据</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name" placeholder="输入毛条名称" @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select placeholder="请选择毛条类型" v-model="type" clearable @change="changeRouter(1)">
                <el-option v-for="item in type_list" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-select v-model="page_size" placeholder="选择每页展示的条数" @change="changeRouter(1)">
                <el-option label="每页10条" :value="10"></el-option>
                <el-option label="每页20条" :value="20"></el-option>
                <el-option label="每页30条" :value="30"></el-option>
              </el-select>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr" @click="reset">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">类型</div>
              <div class="column">名称</div>
              <div class="column">参考价格(元)</div>
              <div class="column">库存(kg)</div>
              <div class="column">创建人</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row" v-for="item in list" :key="item.id">
              <div class="column">{{ item.rel_type|maotiaoTypeFilter }}</div>
              <div class="column">{{ item.name }}</div>
              <div class="column">{{ item.price }}元</div>
              <div class="column">{{ item.store || 0 }}kg</div>
              <div class="column">{{ item.user.name || '无' }}</div>
              <div class="column">
                <div class="opr blue" @click="$router.push('/material/detail/' + item.id)">详情</div>
                <div class="opr orange" @click="updateMat(item)">修改</div>
                <div class="opr red" @click="deleteMat(item.id)">删除</div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination
            background
            :current-page.sync="page"
            :page-size="page_size"
            layout="prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <add-material :show="create_flag || update_flag" @close="update_flag = false;create_flag = false" :id="material_info.id" @afterCreate="getList" :update="update_flag"></add-material>
    <!-- <div class="popup" v-show="create_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">添加毛条</span>
          <i class="close_icon el-icon-close" @click="resetMat"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label isMust">毛条类型：</div>
            <div class="info">
              <el-select placeholder="请选择毛条类型" v-model="material_info.type_id">
                <el-option v-for="item in type_list" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">毛条名称：</div>
            <div class="info">
              <el-input v-model="material_info.name" placeholder="请输入毛条名称"> </el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">毛条单价：</div>
            <div class="info">
              <el-input v-model="material_info.price" placeholder="请输入毛条单价">
                <template slot="append">元/kg</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr" @click="resetMat">取消</div>
          <div class="opr" :class="{ blue: !material_info.id, orange: material_info.id }" @click="saveMaterial">
            {{ material_info.id ? '修改' : '添加' }}
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MaterialInfo } from '@/types/material'
import { material } from '@/assets/js/api'
import addMaterial from '@/components/addMaterial/addMaterial.vue'
export default Vue.extend({
  components: { addMaterial },
  data(): {
    list: MaterialInfo[]
    material_info: MaterialInfo
    [propName: string]: any
  } {
    return {
      loading: false,
      page: 1,
      page_size: 10,
      total: 1,
      name: '',
      type: '',
      create_flag: false,
      update_flag: false,
      material_info: {
        id: '',
        type_id: '',
        name: '',
        price: '',
        desc: ''
      },
      list: []
    }
  },
  computed: {
    type_list() {
      return this.$store.state.api.materialType.arr
    }
  },
  watch: {
    page(newVal) {
      this.changeRouter(newVal)
    },
    $route() {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    getList() {
      this.loading = true
      this.$checkCommonInfo([
      {
        checkWhich: 'api/materialType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getMaterialTypeAsync',
        forceUpdate: true
      }
    ])
      material
        .list({
          type_id: this.type,
          name: this.name,
          page: this.page,
          limit: this.page_size
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
          this.loading = false
        })
    },
    changeRouter(page: string) {
      const pages = page || 1
      this.$router.push(
        '/material/list?page=' + pages + '&type=' + this.type + '&name=' + this.name + '&page_size=' + this.page_size
      )
    },
    getFilters() {
      const params = this.$route.query
      this.page = Number(params.page)
      this.page_size = Number(params.page_size)
      this.name = params.name
      this.type = Number(params.type) || ''
    },
    reset() {
      this.$router.push('/material/list?page=1&type=&name=&page_size=10')
    },
    resetMat() {
      this.material_info = {
        id: '',
        type_id: '',
        name: '',
        price: '',
        desc: ''
      }
      this.create_flag = false
    },
    updateMat(info: MaterialInfo) {
      this.material_info = info
      this.update_flag = true
    },
    deleteMat(id: string) {
      this.$confirm('是否要删除该毛条?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          material.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    downloadExcel(type: string) {
      if (type === '毛条添加模板') {
        this.$downloadExcel(
          [],
          [
            { title: '毛条类型（必填，多个类型用逗号隔开）', key: 'type_name' },
            { title: '毛条名称（必填）', key: 'name' },
            { title: '毛条价格（选填，元/kg）', key: 'price' },
            { title: '单价备注（选填）', key: 'desc' }
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
      if (type === '添加毛条') {
        typeObj = {
          type_name: ['毛条类型（必填，多个类型用逗号隔开）'],
          name: ['毛条名称（必填）'],
          price: ['毛条价格（选填，元/kg）', '0'],
          desc: ['单价备注（选填）', '']
        }
      }
      let submitData = []
      for (const prop in data) {
         if (data.hasOwnProperty(prop)) {
          for (const key in data[prop]) {
            if (data[prop].hasOwnProperty(key)) {
              let obj: any = {}
              for (const indexType in typeObj) {
                if (typeObj.hasOwnProperty(indexType)) {
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
              }
              submitData.push(obj)
            }
          }
        }
      }
      if (submitData.length === 0) {
        this.$message.warning('未读取到可用参数')
        return
      }
      if (type === '添加毛条') {
        submitData.forEach((item: any) => {
          item.id = null
          item.type_id = []
          
          let type_arr = item.type_name.replaceAll('，', ',').split(',')
          type_arr.forEach((itemType: any) => {
            let id: any = this.type_list.find((itemTypeDetail: any) => {
              return itemType === itemTypeDetail.name
            })
            if (id) {
              item.type_id.push(id.id)
            }
          })
          delete item.type_name
          
          item.type_id = [...new Set(item.type_id)]
        })
        
        material.create({ data: submitData }).then((res) => {
          if (res.data.status) {
            this.$message.success('导入成功')
            this.getList()
          }
        })
      }
    },
  },
  created() {
    this.getFilters()
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/material/list.less';
</style>
<template>
  <div class="indexMain" v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">客户财务列表</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name" @change="changeRouter(1)" placeholder="搜索客户名称"></el-input>
            </div>
            <div class="elCtn" style="width:350px;">
              <el-date-picker v-model="date" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期" @change="changeRouter(1)"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr" @click="resetFilter">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">客户名称</div>
              <div class="column">下单数量
                <sort v-model="total_weight" @beforeChange="getSort($event, 'total_weight')"></sort>
              </div>
              <div class="column">下单金额
                <sort v-model="total_price" @beforeChange="getSort($event, 'total_price')"></sort>
              </div>
              <div class="column">发货数量
                <sort v-model="real_total_weight" @beforeChange="getSort($event, 'real_total_weight')"></sort>
              </div>
              <div class="column">发货金额
                <sort v-model="real_total_price" @beforeChange="getSort($event, 'real_total_price')"></sort>
              </div>
              <div class="column">开票总额
                <sort v-model="collection_total_price" @beforeChange="getSort($event, 'collection_total_price')"></sort>
              </div>
              <div class="column">收款总额
                <sort v-model="invoice_total_price" @beforeChange="getSort($event, 'invoice_total_price')"></sort>
              </div>
              <div class="column">对方扣款
                <sort v-model="deduct_total_price" @beforeChange="getSort($event, 'deduct_total_price')"></sort>
              </div>
              <div class="column">对方欠款
                <sort v-model="invoice_wait" @beforeChange="getSort($event, 'invoice_wait')"></sort>
              </div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row" v-for="item in clientList" :key="item.id">
              <div class="column">{{ item.client_name }}</div>
              <div class="column">{{ $toFixed(item.total_weight / 1000, 2, true) }}吨</div>
              <div class="column">{{ $toFixed(item.total_price / 10000, 2, true) }}万元</div>
              <div class="column">{{ $toFixed(item.real_total_weight / 1000, 2, true) }}吨</div>
              <div class="column">{{ $toFixed(item.real_total_price / 10000, 2, true) }}万元</div>
              <div class="column">{{ $toFixed((item.collection_total_price / 10000 || 0), 2, true) }}万元</div>
              <div class="column">{{ $toFixed((item.invoice_total_price || 0) / 10000, 2, true) }}万元</div>
              <div class="column">{{ $toFixed((item.deduct_total_price || 0) / 10000, 2, true) }}万元</div>
              <div class="column">{{ $toFixed(((item.invoice_wait) || 0) / 10000, 2, true) }}万元</div>
              <div class="column">
                <span class="col_btn blue" @click="$router.push('/finance/clientDetail/' + item.client_id)">详情</span>
              </div>
            </div>
            <div class="row">
              <div class="column green">合计</div>
              <div class="column green">{{ $toFixed(total_sts.total_weight / 1000, 2, true) }}吨</div>
              <div class="column green">{{ $toFixed(total_sts.total_price / 10000, 2, true) }}万元</div>
              <div class="column green">{{ $toFixed(total_sts.real_total_weight / 1000, 2, true) }}吨</div>
              <div class="column green">{{ $toFixed((total_sts.real_total_price / 10000), 2, true) }}万元</div>
              <div class="column green">{{ $toFixed((total_sts.collection_total_price / 10000), 2, true) }}万元</div>
              <div class="column green">{{ $toFixed((total_sts.invoice_total_price / 10000), 2, true) }}万元</div>
              <div class="column green">{{ $toFixed((total_sts.deduct_total_price / 10000), 2, true) }}万元</div>
              <div class="column green">{{ $toFixed(((total_sts.invoice_wait) || 0) / 10000, 2, true) }}万元</div>
              <div class="column green"></div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background :current-page.sync="page" @current-change="changePage" :page-size="10"
            layout="prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
      <!-- <div class="bottomFixBar">
        <div class="main">
          <div class="btnCtn"
            style="float:left">
            <div class="buttonList">
              <div class="btn backHoverBlue">
                <i class="el-icon-s-grid"></i>
                <span class="text">批量导入单据</span>
              </div>
              <div class="otherInfoCtn">
                <div class="otherInfo">
                  <div class="btn backHoverOrange"
                    @click="importExcelData('开票单据')">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">开票单据</span>
                  </div>
                  <div class="btn backHoverRed"
                    @click="importExcelData('对方扣款单据')">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">扣款单据</span>
                  </div>
                  <div class="btn backHoverBlue"
                    @click="importExcelData('收款单据','元')">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">收款单据</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="buttonList">
              <div class="btn backHoverBlue">
                <i class="el-icon-s-grid"></i>
                <span class="text">下载导入模板</span>
              </div>
              <div class="otherInfoCtn">
                <div class="otherInfo">
                  <div class="btn backHoverOrange"
                    @click="downloadExcel('开票单据模板')">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">开票单据</span>
                  </div>
                  <div class="btn backHoverBlue"
                    @click="downloadExcel('收款单据模板')">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">收款单据</span>
                  </div>
                  <div class="btn backHoverRed"
                    @click="downloadExcel('扣款单据模板')">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">扣款单据</span>
                  </div>
                </div>
              </div>
            </div>
            <span class="btn hoverBlue">
              <el-tooltip class="item"
                effect="dark"
                placement="top">
                <div slot="content">
                  第一步：下载导入模板。<br />
                  第二步：填写模板信息。注意：请填写客户或单位简称，且填写的简称必须与系统添加的简称保持一致；金额字段必须为数字；日期字段的格式必须为yyyy-mm-dd（2022-01-01）；订单号必须为系统订单编号；关联单据编号必须为系统关联编号；否则会出现无法导入或者导入错误的情况。<br />
                  第三步：导入模板，完成导入
                </div>
                <span>导入教程</span>
              </el-tooltip>
            </span>
          </div>
          <div class="btnCtn">
            <div class="borderBtn" @click="$router.go(-1)">返回</div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { finance } from '@/assets/js/api'
import { PartyB } from '@/types/common'
export default Vue.extend({
  data(): {
    clientList: PartyB[]
    [propName: string]: any
  } {
    return {
      loading: true,
      addFlag: false,
      clientList: [],
      page: 1,
      total: 1,
      name: '',
      date: [],
      allList: [],
      total_price: '',
      total_weight: '',
      real_total_weight: '',
      real_total_price: '',
      deduct_total_price: '',
      invoice_total_price: '',
      collection_total_price: '',
      invoice_wait: '',
      total_sts: {
        total_weight: 0,
        total_price: 0,
        real_total_weight: 0,
        real_total_price: 0,
        collection_total_price: 0,
        invoice_total_price: 0,
        deduct_total_price: 0,
        invoice_wait: 0,
      },
      sort_type: 'desc',
      sort_cloum: 'real_total_price',
      statusArr: [
        {
          id: '0',
          name: '禁用中'
        },
        {
          id: '1',
          name: '合作中'
        }
      ],
      order_weight: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '今年',
            onClick(picker: any) {
              const year = new Date().getFullYear()
              const start = year + '-01-01'
              const end = year + '-12-31'
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '去年',
            onClick(picker: any) {
              const year = new Date().getFullYear() - 1
              const start = year + '-01-01'
              const end = year + '-12-31'
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  methods: {
    changeRouter(pages: number = 1) {
      this.$router.replace(
        `/finance/clientList?pages=${pages}&name=${this.name || ''}&sort_type=${this.sort_type || ''}&sort_cloum=${this.sort_cloum || ''
        }&date=${this.date || ''}`
      )
    },
    // downloadExcel(type: string) {
    //   if (type === '开票单据模板') {
    //     this.$downloadExcel(
    //       [],
    //       [
    //         { title: '客户/单位名称(必填，系统简称)', key: 'client_zh' },
    //         { title: '关联单号(选填)', key: 'doc_code' },
    //         { title: '发票代码(选填)', key: 'invoice_number' },
    //         { title: '发票号码(选填)', key: 'invoice_code' },
    //         { title: '发票类型(默认专票)', key: 'type' },
    //         { title: '税率(必填)', key: 'tax_rate' },
    //         { title: '开票金额(税价合计，必填)', key: 'price' },
    //         { title: '备注信息(选填)', key: 'desc' }
    //       ],
    //       type
    //     )
    //   } else if (type === '扣款单据模板') {
    //     this.$downloadExcel(
    //       [],
    //       [
    //         { title: '扣款单位(必填，简称)', key: 'client_zh' },
    //         { title: '关联单号(选填)', key: 'doc_code' },
    //         { title: '扣款金额(必填)', key: 'price' },
    //         { title: '扣款原因(选填)', key: 'reason' }
    //       ],
    //       type
    //     )
    //   } else if (type === '收款单据模板') {
    //     this.$downloadExcel(
    //       [],
    //       [
    //         { title: '收款单位(必填，简称)', key: 'client_zh' },
    //         { title: '关联单号(选填)', key: 'doc_code' },
    //         { title: '收款金额(必填)', key: 'price' },
    //         { title: '备注信息(选填)', key: 'desc' },
    //         { title: '收款日期(必填)', key: 'complete_time' }
    //       ],
    //       type
    //     )
    //   }
    // },
    // importExcelData(type: string, settle_unit?: string) {
    //   this.settle_excel_unit = settle_unit
    //   const inputFile = document.createElement('input')
    //   inputFile.type = 'file'
    //   inputFile.accept = '.xlsx,.xls'
    //   inputFile.addEventListener('change', (e) => {
    //     this.getExcelData(e, this.saveImportData, type)
    //   })
    //   let click = document.createEvent('MouseEvents')
    //   click.initEvent('click', true, true)
    //   inputFile.dispatchEvent(click)
    // },
    // getExcelData(file: any, callBack: any, type: string) {
    //   const _this = this
    //   const XLSX = require('xlsx')
    //   const files = file.target.files
    //   const fileReader = new FileReader()
    //   fileReader.onload = function (e: any) {
    //     try {
    //       const data = e.target.result
    //       const bytes = new Uint8Array(data) // 无符号整型数组
    //       const len = bytes.byteLength
    //       const binarys = new Array(len) // 创建定长数组，存储文本
    //       for (let i = 0; i < len; i++) {
    //         binarys[i] = String.fromCharCode(bytes[i])
    //       }
    //       const workbook = XLSX.read(binarys.join(''), { type: 'binary' })
    //       if (!workbook) {
    //         return null
    //       }
    //       const r: any = {}
    //       workbook.SheetNames.forEach((name: string) => {
    //         // 遍历每张纸数据
    //         r[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name])
    //       })
    //       callBack && callBack(r, type)
    //     } catch (e) {
    //       _this.$message.error('文件类型不正确')
    //     }
    //   }
    //   fileReader.readAsArrayBuffer(files[0])
    // },
    // saveImportData(data: any, type: string) {
    //   let typeObj: any = {}
    //   if (type === '开票单据') {
    //     typeObj = {
    //       doc_code: ['关联单号(选填)', ''],
    //       client_zh: ['客户/单位名称(必填，系统简称)'],
    //       invoice_number: ['发票代码(选填)',''],
    //       invoice_code: ['发票号码(选填)',''],
    //       type: ['发票类型(默认专票)','专票'],
    //       tax_rate: ['税率(必填)'],
    //       price: ['开票金额(税价合计，必填)'],
    //       desc: ['备注信息(选填)', ''],
    //     }
    //   } else if (type === '收款单据') {
    //     typeObj = {
    //       doc_code: ['关联单号(选填)', ''],
    //       client_zh: ['收款单位(必填)'],
    //       price: ['收款金额(必填)'],
    //       desc: ['备注信息(选填)', ''],
    //       complete_time: ['收款日期(必填)']
    //     }
    //   } else if (type === '对方扣款单据') {
    //     typeObj = {
    //       doc_code: ['关联单号(选填)', ''],
    //       client_zh: ['扣款单位(必填)'],
    //       price: ['扣款金额(必填)'],
    //       reason: ['扣款原因(选填)', ''],
    //       file_url: [false, null]
    //     }
    //   }
    //   let submitData = []
    //   for (const prop in data) {
    //     for (const key in data[prop]) {
    //       let obj: any = {}
    //       for (const indexType in typeObj) {
    //         if (typeObj[indexType][0]) {
    //           obj[indexType] = data[prop][key][typeObj[indexType][0]] || typeObj[indexType][1]
    //           if (obj[indexType] === undefined) {
    //             this.$message.error('解析失败，请使用标准模板或检测必填数据是否存在空的情况！！！')
    //             return
    //           }
    //         } else {
    //           obj[indexType] = typeObj[indexType][1]
    //         }
    //       }
    //       submitData.push(obj)
    //     }
    //   }
    //   if (submitData.length === 0) {
    //     this.$message.warning('未读取到可用参数')
    //     return
    //   }
    //   if (type === '开票单据') {
    //     invoice
    //       .create({
    //         id: '',
    //         doc_type: '',
    //         client_id: '',
    //         invoice_type: 1,
    //         data: submitData
    //       })
    //       .then((res) => {
    //         if (res.data.status) {
    //           this.$message.success('导入成功')
    //           this.getList()
    //         }
    //       })
    //   } else if (type === '收款单据') {
    //     // excel日期格式转前端日期格式
    //     submitData.forEach((item) => {
    //       const time: any = new Date((item.complete_time - 1) * 24 * 3600000 + 1)
    //       time.setYear(time.getFullYear() - 70)
    //       const year = time.getFullYear()
    //       const month = time.getMonth() + 1
    //       const date = time.getDate() - 1
    //       item.complete_time = year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
    //     })
    //     collection
    //       .create({
    //         id: '',
    //         doc_type: '',
    //         client_id: '',
    //         settle_unit: this.settle_excel_unit,
    //         data: submitData
    //       })
    //       .then((res) => {
    //         if (res.data.status) {
    //           this.$message.success('导入成功')
    //           this.getList()
    //         }
    //       })
    //   } else if (type === '对方扣款单据') {
    //     deduct
    //       .create({
    //         id: '',
    //         doc_type: '',
    //         client_id: '',
    //         deduct_type: 2,
    //         data: submitData
    //       })
    //       .then((res) => {
    //         if (res.data.status) {
    //           this.$message.success('导入成功')
    //           this.getList()
    //         }
    //       })
    //   }
    // },
    init() {
      this.name = this.$route.query.name || ''
      this.sort_cloum = this.$route.query.sort_cloum || ''
      this.sort_type = this.$route.query.sort_type || ''
      if (this.sort_cloum) {
        this[this.sort_cloum] = this.sort_type === 'asc' ? 1 : this.sort_type === 'desc' ? 2 : 0
      }
      if (this.$route.query.date !== 'null' && this.$route.query.date !== '') {
        this.date = (this.$route.query.date as string).split(',')
      } else {
        const year = new Date().getFullYear()
        const start = year + '-01-01'
        const end = year + '-12-31'
        this.date = [start, end]
      }
      this.getList(Number(this.$route.query.pages) || 1)
    },
    changePage(page: any) {
      this.clientList = this.$clone(this.allList).splice((page - 1) * 10, 10)
    },
    getList(pages: number = 1) {
      this.loading = true
      finance
        .clientList({
          type: 1,
          limit: 10,
          page: pages,
          name: this.name || null,
          start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          end_time: this.date && this.date.length > 0 ? this.date[1] : '',
          sort_cloum: this.sort_cloum,
          sort_type: this.sort_type,
          status: null
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            res.data.data.forEach((item: any) => {
              item.invoice_wait = item.real_total_price - item.invoice_total_price
            })

            this.allList = res.data.data
            this.getSort(2,'real_total_price')
            this.total = res.data.data.length
            this.clientList = this.$clone(this.allList).splice(0, 10)

            this.total_sts = {
              total_weight: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.total_weight) || 0)
              }, 0),
              total_price: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.total_price) || 0)
              }, 0),
              real_total_weight: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.real_total_weight) || 0)
              }, 0),
              real_total_price: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.real_total_price) || 0)
              }, 0),
              collection_total_price: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.collection_total_price) || 0)
              }, 0),
              invoice_total_price: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.invoice_total_price) || 0)
              }, 0),
              deduct_total_price: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.deduct_total_price) || 0)
              }, 0),
              invoice_wait: this.allList.reduce((a: any, b: any) => {
                return a + (Number(b.invoice_wait) || 0)
              }, 0),
            }

            this.loading = false
            // 更新页码
            if (pages !== this.page) {
              this.page = pages
            }
          }
        })
    },
    getSort(ev: number, type: string) {
      const filterArr = ['', 'asc', 'desc']
      this.sort_cloum = type
      this.sort_type = filterArr[ev]
      this.total_price = ''
      this.total_weight = ''
      this.real_total_weight = ''
      this.real_total_price = ''
      this.deduct_total_price = ''
      this.invoice_total_price = ''
      this.invoice_wait = ''
      this.collection_total_price = ''
      this[type] = ev
      if (this.sort_type === 'asc') {
        this.allList.sort((a: any, b: any) => {
          return a[this.sort_cloum] - b[this.sort_cloum]
        })
      } else if (this.sort_type === 'desc') {
        this.allList.sort((a: any, b: any) => {
          return b[this.sort_cloum] - a[this.sort_cloum]
        })
      }
      this.changePage(this.page)
    },
    resetFilter() {
      this.total_price = ''
      this.total_weight = ''
      this.real_total_weight = ''
      this.real_total_price = ''
      this.deduct_sum_total_price = ''
      this.invoice_total_price = ''
      this.collection_total_price = ''
      this.invoice_wait = ''
      this.sort_type = 'desc'
      this.sort_cloum = 'real_total_price'
      this.name = ''
      this.changeRouter()
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
@import '~@/assets/less/finance/clientList.less';
</style>
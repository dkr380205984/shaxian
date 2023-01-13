<template>
  <div id="yarnList" class="indexMain" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">毛条采购单列表</span>
        <span class="addBtn btn btnMain" @click="showAddPO = true">添加采购单</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn showMore">
          <div class="leftCtn" style="padding: unset; max-width: unset">
            <div class="label">筛选条件：</div>
            <!-- <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div> -->
            <div class="elCtn">
              <el-input v-model="code" placeholder="请输入采购单号搜索" @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="client_id" placeholder="选择采购单位" clearable @change="changeRouter(1)">
                <el-option v-for="item in client_arr" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-input v-model="name" placeholder="搜索毛条名称" @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="user_id" clearable placeholder="选择创建人">
                <el-option v-for="item in user_list" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-select v-model="page_size" placeholder="选择每页展示的条数" @change="changeRouter(1)">
                <el-option label="每页10条" :value="10"></el-option>
                <el-option label="每页20条" :value="20"></el-option>
                <el-option label="每页30条" :value="30"></el-option>
              </el-select>
            </div>
            <div class="elCtn middle" style="width: 350px">
              <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeRouter(1)"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="rightCtn" style="min-width: 94px">
            <div class="btn btnGray fr" @click="reset">重置</div>
          </div>
        </div>
        <div class="filterCtn" style="min-height: 33px; justify-content: unset; margin-bottom: 18px">
          <div class="btn backHoverOrange" @click="showSetting = true" style="margin-left: 0">列表设置</div>
          <div
            class="btn backHoverGreen"
            style="margin-left: 20px"
            @click="
              getFilters()
              getList()
            "
          >
            刷新列表
          </div>
        </div>
        <zh-list
          :list="list"
          :check="true"
          :checkedCount="checkedCount"
          :listKey="listKey"
          :loading="loading"
          :oprList="oprList"
        ></zh-list>
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
    <materialAddPO
      :show="showAddPO"
      :update="update_flag"
      @close="resetInfo"
      :info="order_yarn_info"
      @afterCreate="afterCreate"
    ></materialAddPO>
    <!-- 列表设置 -->
    <zh-list-setting
      @close="showSetting = false"
      @afterSave="getListSetting"
      :show="showSetting"
      :id="listSettingId"
      :type="3"
      :data.sync="listKey"
      :originalData="originalSetting"
    ></zh-list-setting>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { material, listSetting } from '@/assets/js/api'
import { OrderMaterialInfo } from '@/types/material'
export default Vue.extend({
  data(): {
    order_yarn_info: OrderMaterialInfo
    [propName: string]: any
  } {
    return {
      loading: true,
      page: 1,
      total: 1,
      page_size: 10,
      showMore: false,
      showSetting: false,
      listSettingId: null,
      listKey: [],
      checkedCount: [],
      originalSetting: [
        {
          key: 'code',
          name: '采购单号',
          ifShow: true,
          ifLock: true,
          index: 0
        },
        {
          key: 'client_name',
          name: '采购单位',
          ifShow: true,
          ifLock: true,
          index: 1
        },
        {
          key: 'status',
          name: '采购单状态',
          filterArr: ['未知', '已创建', '进行中', '已完成', '已取消'],
          classArr: ['', 'orange', 'blue', 'green', 'gray'],
          ifShow: true,
          ifLock: false,
          index: 2,
          isStatus: true
        },
        {
          key: 'is_check',
          name: '审核信息',
          filterArr: ['待审核', '已通过', '已驳回'],
          classArr: ['orange', 'green', 'red'],
          ifShow: true,
          ifLock: false,
          index: 3,
          isStatus: true
        },
        {
          key: 'name',
          name: '毛条名称',
          ifShow: true,
          ifLock: false,
          index: 4,
          from: 'child_data',
          mark: true
        },
        {
          key: 'attribute',
          name: '属性',
          ifShow: true,
          ifLock: false,
          index: 5,
          from: 'child_data'
        },
        {
          key: 'weight',
          name: '采购数量(kg)',
          ifShow: true,
          ifLock: false,
          index: 6,
          from: 'child_data',
          numberToString: true
        },
        {
          key: 'total_weight',
          name: '采购总数(kg)',
          ifShow: true,
          ifLock: false,
          index: 7,
          numberToString: true
        },
        {
          key: 'push_weight',
          name: '入库总数(kg)',
          ifShow: true,
          ifLock: false,
          index: 8,
          numberToString: true
        },
        {
          key: 'total_price',
          name: '下单总价（元）',
          ifShow: true,
          ifLock: false,
          index: 9,
          numberToString: true
        },
        {
          key: 'delivery_time',
          name: '交货日期',
          ifShow: true,
          ifLock: false,
          index: 10
        },
        {
          key: 'order_time',
          name: '下单日期',
          ifShow: true,
          ifLock: false,
          index: 11
        },
        {
          key: 'image_data',
          name: '补充说明',
          ifShow: true,
          ifLock: false,
          ifImage: true,
          index: 12
        },
        {
          key: 'user_name',
          name: '操作人',
          ifShow: true,
          ifLock: false,
          index: 13
        }
      ],
      oprList: [
        {
          name: '详情',
          class: 'hoverBlue',
          fn: (item: any) => {
            this.$router.push('/directOrder/materialDetail/' + item.id)
          }
        },
        {
          name: '修改',
          class: 'hoverOrange',
          fn: (item: any) => {
            // @ts-ignore
            this.openUpdate(item)
          }
        },
        {
          name: '删除',
          class: 'hoverRed',
          fn: (item: any) => {
            // @ts-ignore
            this.openDelete(item.id)
          }
        }
      ],
      client_id: '',
      code: '',
      name: '',
      status: '',
      date: [],
      user_id: '',
      create_flag: false,
      update_flag: false,
      showAddPO: false,
      select_loading: false,
      order_yarn_info: {
        client_id: '',
        total_price: '',
        child_data: [
          {
            name: [],
            weight: '',
            price: '',
            batch_code: ''
          }
        ],
        file_url: '',
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
        desc: ''
      },
      list: [],
      product_arr: [],
      postData: { key: '', token: '' }
    }
  },
  computed: {
    client_arr() {
      return this.$store.state.api.factory.arr
    },
    user_list() {
      return this.$store.state.api.user.arr
    },
    token() {
      return this.$store.state.status.token
    },
    material_arr() {
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
  watch: {
    page(newVal) {
      this.changeRouter(newVal)
    },
    checkedCount(newVal) {
      if (newVal.length > 0) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
    $route() {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    changeRouter(page: string) {
      const pages = page || 1
      this.$router.push(
        '/directOrder/materialList?page=' +
          pages +
          '&code=' +
          this.code +
          '&name=' +
          this.name +
          '&client_id=' +
          this.client_id +
          '&user_id=' +
          this.user_id +
          '&page_size=' +
          this.page_size +
          '&date=' +
          this.date
      )
    },
    getListSetting() {
      this.listKey = []
      listSetting
        .detail({
          type: 3
        })
        .then((res) => {
          this.listSettingId = res.data.data ? res.data.data.id : null
          this.listKey = res.data.data
            ? JSON.parse(res.data.data.content).length > 0
              ? JSON.parse(res.data.data.content)
              : this.$clone(this.originalSetting)
            : this.$clone(this.originalSetting)
        })
    },
    reset() {
      this.$router.push('/directOrder/materialList?page=1&code=&name=&client_id=&user_id=&page_size=10&date=')
    },
    getFilters() {
      const params = this.$route.query
      this.page = Number(params.page)
      this.page_size = Number(params.page_size)
      this.user_id = params.user_id ? Number(params.user_id) : ''
      this.client_id = params.client_id ? Number(params.client_id) : ''
      this.name = params.name
      this.code = params.code
      if (params.date !== 'null' && params.date !== '') {
        this.date = (params.date as string).split(',')
      } else {
        this.date = []
      }
    },
    cmpTotalPrice() {
      this.order_yarn_info.total_price =
        this.order_yarn_info.child_data.reduce((total, current) => {
          return total + Number(current.price) * Number(current.weight)
        }, 0) +
        (this.order_yarn_info.additional_fee as any[]).reduce((total, current) => {
          return total + Number(current.price)
        }, 0)
    },
    searchPro(query: string) {
      if (query !== '') {
        material
          .list({
            limit: 5,
            page: 1,
            name: query
          })
          .then((res) => {
            this.product_arr = res.data.data.items
          })
      } else {
        this.product_arr = []
      }
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
        this.order_yarn_info.child_data.some((item) => {
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
      this.order_yarn_info.additional_fee = JSON.stringify(this.order_yarn_info.additional_fee)
      this.order_yarn_info.child_data.forEach((item) => (item.name = (item.name as unknown as any[])[1]))
      material
        .orderCreate({
          data: [this.order_yarn_info]
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.resetInfo()
            this.getList()
          }
        })
    },
    afterCreate() {
      this.getList()
      this.resetInfo()
    },
    openUpdate(info: OrderMaterialInfo) {
      const selfInfo = JSON.parse(JSON.stringify(info))
      this.showAddPO = true
      this.update_flag = true
      selfInfo.additional_fee = selfInfo.additional_fee
        ? JSON.parse(info.additional_fee as string)
        : [
            {
              name: '',
              price: '',
              desc: ''
            }
          ]
      this.order_yarn_info = selfInfo
    },
    resetInfo() {
      this.update_flag = false
      this.create_flag = false
      this.showAddPO = false
      this.order_yarn_info = {
        client_id: '',
        total_price: '',
        child_data: [
          {
            name: '',
            weight: '',
            price: '',
            batch_code: ''
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
        desc: ''
      }
    },
    changeIndex(father: any, type: string) {
      if (!father.index) {
        father.index = 0
      }
      if (type === 'add') {
        if (father.index < father.child_data.length - 1) {
          father.index++
        } else {
          father.index = 0
        }
      }
      if (type === 'delete') {
        if (father.index === 0) {
          father.index = father.child_data.length - 1
        } else {
          father.index--
        }
      }
      this.$forceUpdate()
    },
    getList() {
      this.loading = true
      material
        .orderList({
          code: this.code,
          client_id: this.client_id,
          user_id: this.user_id,
          start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          end_time: this.date && this.date.length > 0 ? this.date[1] : '',
          page: this.page,
          limit: this.page_size
        })
        .then((res) => {
          res.data.data.items.forEach((item: any) => {
            item.image_data = item.file_url ? [item.file_url] : []
          })
          this.list = res.data.data.items
          this.list.forEach((item: any) => {
            item.total_weight = item.child_data.reduce((total: number, current: any) => {
              return total + current.weight
            }, 0)
          })
          this.total = res.data.data.total
          this.loading = false
        })
    },
    openDelete(id: number) {
      this.$confirm('是否删除该订购单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          material
            .orderDelete({
              id
            })
            .then((res) => {
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
      console.log(this.order_yarn_info)
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/client',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPartyBAsync'
      },
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      },
      {
        checkWhich: 'status/token',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getTokenAsync'
      },
      {
        checkWhich: 'api/materialType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getMaterialTypeAsync'
      }
    ])
    this.getListSetting()
    this.getFilters()
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/directOrder/yarnList.less';
</style>
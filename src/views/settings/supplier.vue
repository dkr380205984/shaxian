<template>
  <div class="indexMain"
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">供货商列表</span>
        <span class="addBtn btn btnMain"
          @click="changeSupplier()">添加供货商</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name"
                @change="changeRouter(1)"
                placeholder="搜索供货商名称"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="status"
                @change="changeRouter(1)"
                placeholder="筛选供货商状态">
                <el-option v-for="item in statusArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr"
              @click="resetFilter">重置</div>
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
            <div class="row"
              v-for="item in supplierList"
              :key="item.id">
              <div class="column">{{item.id}}</div>
              <div class="column">{{item.name}}</div>
              <div class="column">{{item.abbreviation}}</div>
              <div class="column">{{item.user_name}}</div>
              <div class="column">{{item.phone || '/'}}</div>
              <div class="column">{{item.address || '/'}}</div>
              <div class="column">{{item.contact || '/'}}</div>
              <div class="column">{{item.contact_phone || '/'}}</div>
              <div :class="`column ${item.status && 'green' || 'red'}`">{{item.status && '合作中' || '禁用中'}}</div>
              <div class="column">
                <span class="col_btn orange"
                  @click="changeSupplier(item)">修改</span>
                <span class="col_btn green"
                  v-if="!item.status"
                  @click="disableSupplier(item)">启用</span>
                <span class="col_btn red"
                  v-else
                  @click="disableSupplier(item)">禁用</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :current-page.sync="page"
            @current-change='changeRouter'
            :page-size="10"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="addFlag">
      <div class="main">
        <div class="titleCtn">
          <div class="text">{{supplierInfo.id && '修改' || '添加'}}供货商</div>
          <i class="el-icon-close"
            @click="addFlag=false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label isMust">供货商名称：</div>
            <div class="info">
              <el-input placeholder="请输入供货商名称"
                v-model="supplierInfo.name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">供货商简称：</div>
            <div class="info">
              <el-input placeholder="请输入供货商简称"
                v-model="supplierInfo.abbreviation"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">主要负责人：</div>
            <div class="info">
              <el-input placeholder="请输入主要负责人"
                v-model="supplierInfo.user_name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">供货商电话：</div>
            <div class="info">
              <el-input placeholder="请输入供货商电话"
                v-model="supplierInfo.phone"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">供货商地址：</div>
            <div class="info">
              <el-input placeholder="请输入供货商地址"
                v-model="supplierInfo.address"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">联系人：</div>
            <div class="info">
              <el-input placeholder="请输入联系人"
                v-model="supplierInfo.contact"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">联系人电话：</div>
            <div class="info">
              <el-input placeholder="请输入联系人电话"
                v-model="supplierInfo.contact_phone"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="addFlag=false">取消</div>
          <div class="opr blue"
            @click="saveSupplier">保存</div>
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
      status: 1,
      statusArr: [
        { id: 0, name: '禁用中' },
        { id: 1, name: '合作中' }
      ]
    }
  },
  methods: {
    changeRouter(pages: number = 1) {
      this.$router.replace(`/settings/supplier?pages=${pages}&name=${this.name || ''}&status=${this.status || 1}`)
    },
    init() {
      this.name = this.$route.query.name || ''
      this.status = this.$route.query.status || 1
      this.getList(Number(this.$route.query.pages) || 1)
    },
    getList(pages: number = 1) {
      this.loading = true
      partyB
        .list({
          type: 2,
          limit: 10,
          page: pages,
          name: this.name || null
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
      this.status = 1
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
      if (!this.supplierInfo.user_name) {
        this.$message.warning('请输入主要负责人')
        return
      }
      partyB
        .create({
          id: this.supplierInfo.id || null,
          name: this.supplierInfo.name,
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
            this.changeRouter()
          }
        })
    },
    changeSupplier(item: PartyB) {
      this.addFlag = true
      this.clientInfo = {
        id: (item && item.id) || null,
        name: (item && item.name) || '',
        abbreviation: (item && item.abbreviation) || '',
        user_name: (item && item.user_name) || '',
        phone: (item && item.phone) || '',
        contact: (item && item.contact) || '',
        contact_phone: (item && item.contact_phone) || '',
        address: (item && item.address) || ''
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
              this.changeRouter()
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
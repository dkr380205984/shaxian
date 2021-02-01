<template>
  <div class="indexMain"
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">客户列表</span>
        <span class="addBtn btn btnMain"
          @click="changeClient()">添加客户</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name"
                @change="getList(1)"
                placeholder="搜索客户名称"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="status"
                @change="getList(1)"
                placeholder="筛选客户状态">
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
            <div class="row"
              v-for="item in clientList"
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
                  @click="changeClient(item)">修改</span>
                <span class="col_btn green"
                  v-if="!item.status"
                  @click="disableClient(item)">启用</span>
                <span class="col_btn red"
                  v-else
                  @click="disableClient(item)">禁用</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :current-page.sync="page"
            @current-change="getList"
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
          <div class="text">{{clientInfo.id && '修改' || '添加'}}客户</div>
          <i class="el-icon-close"
            @click="addFlag=false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label isMust">客户名称：</div>
            <div class="info">
              <el-input placeholder="请输入客户名称"
                v-model="clientInfo.name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">客户简称：</div>
            <div class="info">
              <el-input placeholder="请输入客户简称"
                v-model="clientInfo.abbreviation"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">主要负责人：</div>
            <div class="info">
              <el-input placeholder="请输入主要负责人"
                v-model="clientInfo.user_name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">负责人电话：</div>
            <div class="info">
              <el-input placeholder="请输入负责人电话"
                v-model="clientInfo.phone"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">客户地址：</div>
            <div class="info">
              <el-input placeholder="请输入客户地址"
                v-model="clientInfo.address"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">联系人：</div>
            <div class="info">
              <el-input placeholder="请输入联系人"
                v-model="clientInfo.contact"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">联系人电话：</div>
            <div class="info">
              <el-input placeholder="请输入联系人电话"
                v-model="clientInfo.contact_phone"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="addFlag=false">取消</div>
          <div class="opr blue"
            @click="saveClient">保存</div>
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
      status: '',
      statusArr: []
    }
  },
  methods: {
    init() {
      this.getList()
    },
    getList(pages: number = 1) {
      this.loading = true
      partyB
        .list({
          type: 1,
          limit: 10,
          page: pages,
          name: this.name || null
        })
        .then((res: any) => {
          if (res.data.staus !== false) {
            this.clientList = res.data.data.items
            this.total = res.data.data.total
            this.loading = false
            // 更新页码
            pages !== this.page && (this.page = pages)
          }
        })
    },
    resetFilter() {
      this.name = ''
      this.status = ''
      this.getList()
    },
    saveClient() {
      if (this.$submitLock()) return
      if (!this.clientInfo.name) {
        this.$message.warning('请输入客户名称')
        return
      }
      if (!this.clientInfo.user_name) {
        this.$message.warning('请输入主要负责人')
        return
      }
      if (!this.clientInfo.phone) {
        this.$message.warning('请输入负责人电话')
        return
      }
      partyB
        .create({
          id: this.clientInfo.id || null,
          name: this.clientInfo.name,
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
            this.getList()
            this.addFlag = false
          }
        })
    },
    changeClient(item: PartyB) {
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
    disableClient(item: PartyB) {
      this.$confirm('此操作将禁用该客户, 是否继续?', '提示', {
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
              this.getList()
            }
          })
      })
    }
  },
  mounted() {
    this.init()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/settings/client.less';
</style>
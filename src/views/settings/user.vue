<template>
  <div class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">用户列表</span>
        <span class="addBtn btn btnMain"
          @click="addFlag=true">添加用户</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name"
                @change="changeRouter(1)"
                placeholder="搜索用户名称"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="phone"
                @change="changeRouter(1)"
                placeholder="搜索用户手机号"></el-input>
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
              <div class="column">姓名</div>
              <div class="column">登陆账号</div>
              <div class="column">手机号码</div>
              <div class="column">岗位名称</div>
              <div class="column">管理权限</div>
              <!-- <div class="column">模块权限</div> -->
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row"
              v-for="item in userList"
              :key="item.id">
              <div class="column">{{item.name}}</div>
              <div class="column">{{item.user_name}}</div>
              <div class="column">{{item.phone}}</div>
              <div class="column">{{item.station}}</div>
              <div class="column">{{item.is_admin === 1 ? '超级管理员' : '普通用户'}}</div>
              <!-- <div class="column">{{item.module_info}}</div> -->
              <div class="column">
                <span class="col_btn orange"
                  @click="changeUser(item)">修改</span>
                <span class="col_btn green"
                  v-if="!item.status"
                  @click="disableUser(item)">启用</span>
                <span class="col_btn red"
                  v-else
                  @click="disableUser(item)">禁用</span>
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
          <div class="text">新增用户</div>
          <i class="el-icon-close"
            @click="addFlag=false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label isMust">姓名：</div>
            <div class="info">
              <el-input placeholder="请输入姓名"
                v-model="userInfo.name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">登陆账号：</div>
            <div class="info">
              <el-input placeholder="请输入登陆账号"
                :disabled="!!userInfo.id"
                v-model="userInfo.user_name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">手机号：</div>
            <div class="info">
              <el-input placeholder="请输入手机号"
                v-model="userInfo.phone"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">岗位名称：</div>
            <div class="info">
              <el-input placeholder="请输入岗位名称"
                v-model="userInfo.station"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">管理权限：</div>
            <div class="info">
              <el-select v-model="userInfo.is_admin"
                placeholder="请选择管理权限">
                <el-option :value="1"
                  label="超级管理员"></el-option>
                <el-option :value="2"
                  label="普通用户"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">可用模块：</div>
            <div class="info">
              <div style="margin-top:4px">
                <el-tree :data="moduleList"
                  show-checkbox
                  ref="moduleTree"
                  node-key='id'
                  @check-change="getModule">
                </el-tree>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="addFlag=false">取消</div>
          <div class="opr blue"
            @click="saveUser">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { user } from '@/assets/js/api'
import { User } from '@/types/common'
export default Vue.extend({
  data(): {
    userInfo: User
    userList: User[]
    [propName: string]: any
  } {
    return {
      loading: true,
      addFlag: false,
      userList: [],
      userInfo: {
        id: null,
        name: '',
        user_name: '',
        phone: '',
        station: '',
        is_admin: 1,
        module_info: ''
      },
      moduleList: [
        {
          id: '1-0',
          label: '产品管理',
          children: [
            {
              id: '1-1',
              label: '修改产品'
            },
            {
              id: '1-2',
              label: '添加产品'
            },
            {
              id: '1-3',
              label: '删除产品'
            },
            {
              id: '1-4',
              label: '产品详情'
            }
          ]
        },
        {
          id: '2-0',
          label: '订单管理',
          children: [
            {
              id: '2-1',
              label: '修改订单'
            },
            {
              id: '2-2',
              label: '添加订单'
            },
            {
              id: '2-3',
              label: '删除订单'
            },
            {
              id: '2-4',
              label: '订单详情'
            }
          ]
        }
      ],
      page: 1,
      total: 1,
      name: '',
      phone: ''
    }
  },
  methods: {
    changeRouter(pages: number = 1) {
      this.$router.replace(`/settings/user?pages=${pages}&name=${this.name || ''}&phone=${this.phone || ''}`)
    },
    init() {
      this.name = this.$route.query.name || ''
      this.phone = this.$route.query.phone || ''
      this.getList(Number(this.$route.query.pages) || 1)
    },
    getList(pages: number = 1) {
      user
        .list({
          limit: 10,
          page: pages,
          name: this.name || null,
          phone: this.phone || null
        })
        .then((res: any) => {
          if (res.data.staus !== false) {
            this.userList = res.data.data.items
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
      this.phone = ''
      this.changeRouter()
    },
    saveUser() {
      if (this.$submitLock()) {
        return
      }
      if (!this.userInfo.name) {
        this.$message.warning('请输入用户姓名')
        return
      }
      if (!this.userInfo.user_name) {
        this.$message.warning('请输入登录账号')
        return
      }
      if (!this.userInfo.phone) {
        this.$message.warning('请输入用户手机号')
        return
      }
      if (!this.userInfo.is_admin) {
        this.$message.warning('请选择账号管理权限类型')
        return
      }
      user
        .create({
          id: this.userInfo.id || null,
          name: this.userInfo.name,
          user_name: this.userInfo.id ? this.userInfo.user_name : this.userInfo.user_name || this.userInfo.phone,
          phone: this.userInfo.phone,
          station: this.userInfo.station,
          is_admin: this.userInfo.is_admin,
          module_info: this.userInfo.module_info
        })
        .then((res) => {
          if (res.data.status !== false) {
            this.$message.success(`${(this.userInfo.id && '修改') || '添加'}成功`)
            this.addFlag = false
            this.changeRouter()
          }
        })
    },
    changeUser(item: User) {
      this.addFlag = true
      this.userInfo = {
        id: (item && item.id) || null,
        name: (item && item.name) || '',
        user_name: (item && item.user_name) || '',
        phone: (item && item.phone) || '',
        station: (item && item.station) || '',
        is_admin: (item && item.is_admin) || 2,
        module_info: (item && item.module_info && JSON.parse(item.module_info)) || []
      }
      const moduleTree = this.$refs.moduleTree as any
      moduleTree.setCheckedKeys(this.userInfo.module_info)
    },
    disableUser(item: User) {
      this.$confirm('此操作将禁用该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        user
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
    },
    getModule() {
      this.userInfo.module_info = JSON.stringify((this.$refs.moduleTree as any).getCheckedKeys())
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
@import '~@/assets/less/settings/user.less';
</style>
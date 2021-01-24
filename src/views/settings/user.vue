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
                placeholder="搜索用户名称"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="phone"
                placeholder="搜索用户手机号"></el-input>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr">重置</div>
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
              <div class="column">模块权限</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row">
              <div class="column">姓名</div>
              <div class="column">登陆账号</div>
              <div class="column">手机号码</div>
              <div class="column">岗位名称</div>
              <div class="column">管理权限</div>
              <div class="column">模块权限</div>
              <div class="column">操作</div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :current-page.sync="page"
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
            <div class="label isMust">姓名：</div>
            <div class="info">
              <el-input placeholder="请输入花型名称"
                v-model="userInfo.name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">登陆账号：</div>
            <div class="info">
              <el-input placeholder="请输入登陆账号"
                v-model="userInfo.username"></el-input>
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
                v-model="userInfo.post"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">管理权限：</div>
            <div class="info">
              <el-select v-model="userInfo.status"
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
import { User } from '@/types/common'
export default Vue.extend({
  data(): {
    userInfo: User
    userList: User[]
    [propName: string]: any
  } {
    return {
      addFlag: false,
      userList: [],
      userInfo: {
        name: '',
        username: '',
        phone: '',
        post: '',
        status: 1,
        modules: ''
      },
      moduleList: [
        {
          label: '产品管理',
          children: [
            {
              label: '修改产品'
            },
            {
              label: '添加产品'
            },
            {
              label: '删除产品'
            },
            {
              label: '产品详情'
            }
          ]
        },
        {
          label: '订单管理',
          children: [
            {
              label: '修改产品'
            },
            {
              label: '添加产品'
            },
            {
              label: '删除产品'
            },
            {
              label: '产品详情'
            }
          ]
        }
      ],
      page: 1,
      total: 100,
      name: '',
      phone: ''
    }
  },
  methods: {
    saveUser() {
      console.log(this.userInfo)
    },
    getModule(data: any) {
      console.log(data)
      this.userInfo.modules = JSON.stringify(data)
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/settings/user.less';
</style>
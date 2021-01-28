<template>
  <div class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">客户列表</span>
        <span class="addBtn btn btnMain"
          @click="addFlag=true">添加客户</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name"
                placeholder="搜索客户名称"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="status"
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
              v-for="item in 2"
              :key="item">
              <div class="column">{{item}}</div>
              <div class="column">客户名称</div>
              <div class="column">客户简称</div>
              <div class="column">主要负责人</div>
              <div class="column">联系电话</div>
              <div class="column">地址</div>
              <div class="column">联系人</div>
              <div class="column">联系人电话</div>
              <div class="column">当前状态</div>
              <div class="column">
                <span class="col_btn orange"
                  @click="changeClient(item)">修改</span>
                <span class="col_btn green"
                  v-if="item===1"
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
          <div class="text">新增客户</div>
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
            <div class="label isMust">客户简称：</div>
            <div class="info">
              <el-input placeholder="请输入客户简称"
                v-model="clientInfo.abbreviation"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">主要负责人：</div>
            <div class="info">
              <el-input placeholder="请输入主要负责人"
                v-model="clientInfo.principal"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">客户电话：</div>
            <div class="info">
              <el-input placeholder="请输入客户电话"
                v-model="clientInfo.telephone"></el-input>
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
                v-model="clientInfo.contacts"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">联系人电话：</div>
            <div class="info">
              <el-input placeholder="请输入联系人电话"
                v-model="clientInfo.contacts_tel"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="addFlag=false">取消</div>
          <div class="opr blue"
            @click="saveclient">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Client } from '@/types/common'
export default Vue.extend({
  data(): {
    clientInfo: Client
    clientList: Client[]
    [propName: string]: any
  } {
    return {
      addFlag: false,
      clientList: [],
      clientInfo: {
        code: '',
        name: '',
        abbreviation: '',
        principal: '',
        telephone: '',
        address: '',
        contacts: '',
        contact_tel: '',
        status: false
      },
      page: 1,
      total: 100,
      name: '',
      status: '',
      statusArr: []
    }
  },
  methods: {
    init() {
      // this.$message.success('初始化页面成功')
    },
    resetFilter() {
      this.name = ''
      this.status = ''
      this.type = ''
      this.$message.success('重置成功')
    },
    saveclient() {
      console.log(this.userInfo)
    },
    changeClient(item: Client) {
      console.log(item)
      this.$message.success('修改成功')
      this.init()
    },
    disableClient(item: Client) {
      console.log(item)
      this.$message.success(`${item.status ? '启用' : '禁用'}成功`)
      this.init()
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
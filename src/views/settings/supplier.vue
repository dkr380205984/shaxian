<template>
  <div class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">供货商列表</span>
        <span class="addBtn btn btnMain"
          @click="addFlag=true">添加供货商</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name"
                placeholder="搜索供货商名称"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="status"
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
              v-for="item in 2"
              :key="item">
              <div class="column">{{item}}</div>
              <div class="column">供货商名称</div>
              <div class="column">供货商简称</div>
              <div class="column">主要负责人</div>
              <div class="column">联系电话</div>
              <div class="column">地址</div>
              <div class="column">联系人</div>
              <div class="column">联系人电话</div>
              <div class="column">当前状态</div>
              <div class="column">
                <span class="col_btn orange"
                  @click="changeSupplier(item)">修改</span>
                <span class="col_btn green"
                  v-if="item===1"
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
          <div class="text">新增供货商</div>
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
            <div class="label isMust">供货商简称：</div>
            <div class="info">
              <el-input placeholder="请输入供货商简称"
                v-model="supplierInfo.abbreviation"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">主要负责人：</div>
            <div class="info">
              <el-input placeholder="请输入主要负责人"
                v-model="supplierInfo.principal"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">供货商电话：</div>
            <div class="info">
              <el-input placeholder="请输入供货商电话"
                v-model="supplierInfo.telephone"></el-input>
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
                v-model="supplierInfo.contacts"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">联系人电话：</div>
            <div class="info">
              <el-input placeholder="请输入联系人电话"
                v-model="supplierInfo.contacts_tel"></el-input>
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
import { Supplier } from '@/types/common'
export default Vue.extend({
  data(): {
    supplierInfo: Supplier
    supplierList: Supplier[]
    [propName: string]: any
  } {
    return {
      addFlag: false,
      supplierList: [],
      supplierInfo: {
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
    saveSupplier() {
      console.log(this.userInfo)
    },
    changeSupplier(item: Supplier) {
      console.log(item)
      this.$message.success('修改成功')
      this.init()
    },
    disableSupplier(item: Supplier) {
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
@import '~@/assets/less/settings/supplier.less';
</style>
<template>
  <div class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">纱线列表</span>
        <span class="addBtn btn btnMain"
          @click="addFlag=true">添加纱线</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name"
                placeholder="搜索纱线名称"></el-input>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">纱线名称</div>
              <div class="column">添加人</div>
              <div class="column">添加日期</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row"
              v-for="item in 1"
              :key="item">
              <div class="column">纱线名称</div>
              <div class="column">添加人</div>
              <div class="column">添加日期</div>
              <div class="column">
                <span class="col_btn orange"
                  @click="changeYarn(item)">修改</span>
                <span class="col_btn red"
                  @click="deleteYarn(item)">删除</span>
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
          <div class="text">新增纱线</div>
          <i class="el-icon-close"
            @click="addFlag=false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label isMust">名称：</div>
            <div class="info">
              <el-input placeholder="请输入纱线名称"
                v-model="yarnInfo.name"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="addFlag=false">取消</div>
          <div class="opr blue"
            @click="saveYarn">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Yarn } from '@/types/common'
export default Vue.extend({
  data(): {
    yarnInfo: Yarn
    yarnList: Yarn[]
    [propName: string]: any
  } {
    return {
      addFlag: false,
      yarnList: [],
      yarnInfo: {
        name: '',
        username: '',
        phone: '',
        post: '',
        status: 1,
        modules: ''
      },
      page: 1,
      total: 100,
      name: ''
    }
  },
  methods: {
    init() {
      this.$message.success('初始化页面成功')
    },
    saveYarn() {
      console.log(this.userInfo)
    },
    changeYarn(item: Yarn) {
      console.log(item)
      this.$message.success('修改成功')
      this.init()
    },
    deleteYarn(item: Yarn) {
      console.log(item)
      this.$message.success('删除成功')
      this.init()
    }
  },
  mounted() {
    this.init()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/settings/yarn.less';
</style>
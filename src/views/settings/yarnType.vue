<template>
  <div class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">纱线类型列表</span>
        <span class="addBtn btn btnMain"
          @click="addFlag=true">添加纱线类型</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name"
                placeholder="搜索纱线类型名称"></el-input>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">纱线类型名称</div>
              <div class="column">添加人</div>
              <div class="column">添加日期</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row"
              v-for="item in yarnTypeList"
              :key="item.id">
              <div class="column">{{item.name}}</div>
              <div class="column">{{item.user_name || '/'}}</div>
              <div class="column">{{item.created_at && $getDate(item.created_at) || '/'}}</div>
              <div class="column">
                <span class="col_btn orange"
                  @click="changeYarnType(item)">修改</span>
                <span class="col_btn red"
                  @click="deleteYarnType(item)">删除</span>
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
          <div class="text">{{yarnTypeInfo.id ? '修改':'新增'}}纱线类型</div>
          <i class="el-icon-close"
            @click="addFlag=false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label isMust">名称：</div>
            <div class="info">
              <el-input placeholder="请输入纱线类型名称"
                v-model="yarnTypeInfo.name"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="addFlag=false">取消</div>
          <div class="opr blue"
            @click="saveYarnType">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { yarnType } from '@/assets/js/api'
import { YarnType } from '@/types/common'
export default Vue.extend({
  data(): {
    yarnTypeInfo: YarnType
    yarnTypeList: YarnType[]
    [propName: string]: any
  } {
    return {
      addFlag: false,
      yarnTypeList: [],
      yarnTypeInfo: {
        id: null,
        name: ''
      },
      page: 1,
      total: 1,
      name: ''
    }
  },
  methods: {
    init() {
      this.getList()
    },
    getList(pages: number = 1) {
      this.loading = true
      yarnType
        .list({
          page: pages,
          limit: 5
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            this.yarnTypeList = res.data.data
            this.total = (res.data.meta && res.data.meta.total) || 1
            this.loading = false
          }
        })
    },
    saveYarnType() {
      if (!this.yarnTypeInfo.name) {
        this.$message.warning('请输入纱线类型名称')
        return
      }
      yarnType
        .create({
          id: this.yarnTypeInfo.id || null,
          name: this.yarnTypeInfo.name
        })
        .then((res) => {
          if (res.data.status !== false) {
            this.$message.success(`${(this.yarnTypeInfo.id && '修改') || '添加'}成功`)
            this.getList()
          }
        })
    },
    changeYarnType(item: YarnType) {
      this.yarnTypeInfo = {
        id: item.id || null,
        name: item.name
      }
      this.addFlag = true
    },
    deleteYarnType(item: YarnType) {
      this.$confirm('此操作将永久删除该纱线类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        yarnType
          .delete({
            id: item.id
          })
          .then((res) => {
            if (res.data.status !== false) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList(1)
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
@import '~@/assets/less/settings/yarn.less';
</style>
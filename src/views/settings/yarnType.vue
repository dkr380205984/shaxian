<template>
  <div class="indexMain"
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">纱线类型列表</span>
        <span class="addBtn btn btnMain"
          @click="changeYarnType()">添加纱线类型</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name"
                @change="changeRouter(1)"
                placeholder="搜索纱线类型名称"></el-input>
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
      loading: true,
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
    changeRouter(pages: number = 1) {
      this.$router.replace(`/settings/yarnType?pages=${pages}&name=${this.name || ''}`)
    },
    init() {
      this.name = this.$route.query.name || ''
      this.getList(Number(this.$route.query.pages) || 1)
    },
    resetFilter() {
      this.name = ''
      this.changeRouter()
    },
    getList(pages: number = 1) {
      this.loading = true
      yarnType
        .list({
          name: this.name || null,
          page: pages,
          limit: 10
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            this.yarnTypeList = res.data.data.items
            this.total = res.data.data.total
            this.loading = false
            // 更新页码
            if (pages !== this.page) {
              this.page = pages
            }
          }
        })
    },
    saveYarnType() {
      if (this.$submitLock()) {
        return
      }
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
            this.addFlag = false
            this.changeRouter()
          }
        })
    },
    changeYarnType(item: YarnType) {
      this.addFlag = true
      this.yarnTypeInfo = {
        id: (item && item.id) || null,
        name: (item && item.name) || ''
      }
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
@import '~@/assets/less/settings/yarn.less';
</style>
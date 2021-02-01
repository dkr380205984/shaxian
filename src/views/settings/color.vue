<template>
  <div class="indexMain"
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">颜色列表</span>
        <span class="addBtn btn btnMain"
          @click="changeColor()">添加颜色</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name"
                placeholder="搜索颜色名称"
                @change="changeRouter(1)"></el-input>
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
              <div class="column">颜色名称</div>
              <div class="column">添加人</div>
              <div class="column">添加日期</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row"
              v-for="item in colorList"
              :key="item.id">
              <div class="column">{{item.name}}</div>
              <div class="column">{{item.create_user || '/'}}</div>
              <div class="column">{{item.created_at ? $getDate(item.created_at) : '/'}}</div>
              <div class="column">
                <span class="col_btn orange"
                  @click="changeColor(item)">修改</span>
                <span class="col_btn red"
                  @click="deleteColor(item)">删除</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :current-page.sync="page"
            :page-size="10"
            @current-change="changeRouter"
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
          <div class="text">{{colorInfo.id ? '修改' : '新增'}}颜色</div>
          <i class="el-icon-close"
            @click="addFlag=false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label isMust">名称：</div>
            <div class="info">
              <el-input placeholder="请输入颜色名称"
                v-model="colorInfo.name"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="addFlag=false">取消</div>
          <div class="opr blue"
            @click="saveColor">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { yarnColor } from '@/assets/js/api'
import { Color } from '@/types/common'
export default Vue.extend({
  data(): {
    colorInfo: Color
    colorList: Color[]
    [propName: string]: any
  } {
    return {
      loading: true,
      addFlag: false,
      colorList: [],
      colorInfo: {
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
      this.$router.replace(`/settings/color?pages=${pages}&name=${this.name || ''}`)
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
      yarnColor
        .list({
          name: this.name || '',
          page: pages,
          limit: 10
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            this.colorList = res.data.data.items
            this.total = res.data.data.total
            this.loading = false
            // 更新页码
            if (pages !== this.page) {
              this.page = pages
            }
          }
        })
    },
    saveColor() {
      if (this.$submitLock()) {
        return
      }
      if (!this.colorInfo.name) {
        this.$message.warning('请输入颜色名称')
        return
      }
      yarnColor
        .create({
          id: this.colorInfo.id,
          name: this.colorInfo.name
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            this.addFlag = false
            this.$message.success(`${(this.colorInfo.id && '修改') || '添加'}成功`)
            this.changeRouter(1)
          }
        })
    },
    changeColor(item: Color) {
      this.addFlag = true
      this.colorInfo = {
        id: (item && item.id) || null,
        name: (item && item.name) || ''
      }
    },
    deleteColor(item: Color) {
      this.$confirm('此操作将永久删除该颜色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        yarnColor
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
@import '~@/assets/less/settings/color.less';
</style>
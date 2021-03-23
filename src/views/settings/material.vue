<template>
  <div class="indexMain"
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">毛条类型列表</span>
        <span class="addBtn btn btnMain"
          @click="changeMaterial()">添加毛条类型</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name"
                placeholder="搜索毛条类型名称"
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
              <div class="column">毛条类型名称</div>
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
                  @click="changeMaterial(item)">修改</span>
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
          <div class="text">{{materialInfo.id ? '修改' : '新增'}}毛条类型</div>
          <i class="el-icon-close"
            @click="addFlag=false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label isMust">名称：</div>
            <div class="info">
              <el-input placeholder="请输入毛条类型名称"
                v-model="materialInfo.name"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="addFlag=false">取消</div>
          <div class="opr blue"
            @click="saveMaterial">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { material } from '@/assets/js/api'
import { MaterialType } from '@/types/common'
export default Vue.extend({
  data(): {
    materialInfo: MaterialType
    materialList: MaterialType[]
    [propName: string]: any
  } {
    return {
      loading: true,
      addFlag: false,
      materialList: [],
      materialInfo: {
        id: '',
        name: ''
      },
      page: 1,
      total: 1,
      name: ''
    }
  },
  methods: {
    changeRouter(pages: number = 1) {
      this.$router.replace(`/settings/material?pages=${pages}&name=${this.name || ''}`)
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
      material
        .typeList({
          name: this.name || '',
          page: pages,
          limit: 10
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            this.colorList = res.data.data.data
            this.total = res.data.data.total
            this.loading = false
            // 更新页码
            if (pages !== this.page) {
              this.page = pages
            }
          }
        })
    },
    saveMaterial() {
      if (this.$submitLock()) {
        return
      }
      if (!this.materialInfo.name) {
        this.$message.warning('请输入毛条类型名称')
        return
      }
      material
        .typeCreate({
          id: this.materialInfo.id,
          name: this.materialInfo.name
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            this.addFlag = false
            this.$message.success(`${(this.materialInfo.id && '修改') || '添加'}成功`)
            this.changeRouter(1)
          }
        })
    },
    changeMaterial(item: MaterialType) {
      this.addFlag = true
      this.materialInfo = {
        id: (item && item.id) || '',
        name: (item && item.name) || ''
      }
    },
    deleteColor(item: MaterialType) {
      this.$confirm('此操作将永久删除该毛条类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        material
          .typeDelete({
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
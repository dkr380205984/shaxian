<template>
  <div id="materialList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">毛条列表</span>
        <span class="addBtn btn btnMain"
          @click="create_flag = true">添加毛条</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name"
                placeholder="输入毛条名称"
                @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select placeholder="请选择毛条类型"
                v-model="type"
                clearable
                @change="changeRouter(1)">
                <el-option v-for="item in type_list"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-select v-model="page_size"
                placeholder="选择每页展示的条数"
                @change="changeRouter(1)">
                <el-option label="每页10条"
                  :value="10"></el-option>
                <el-option label="每页20条"
                  :value="20"></el-option>
                <el-option label="每页30条"
                  :value="30"></el-option>
              </el-select>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr"
              @click="reset">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">类型</div>
              <div class="column">名称</div>
              <div class="column">参考价格(元)</div>
              <div class="column">库存(kg)</div>
              <div class="column">创建人</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row"
              v-for="item in list"
              :key="item.id">
              <div class="column">{{item.type_name}}</div>
              <div class="column">{{item.name}}</div>
              <div class="column">{{item.price}}元</div>
              <div class="column">{{item.store||0}}kg</div>
              <div class="column">{{item.user_name||'无'}}</div>
              <div class="column">
                <div class="opr orange"
                  @click="updateMat(item)">修改</div>
                <div class="opr red"
                  @click="deleteMat(item.id)">删除</div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :current-page.sync="page"
            :page-size="page_size"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="create_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">添加毛条</span>
          <i class="close_icon el-icon-close"
            @click="resetMat"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label isMust">毛条类型：</div>
            <div class="info">
              <el-select placeholder="请选择毛条类型"
                v-model="material_info.type_id">
                <el-option v-for="item in type_list"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">毛条名称：</div>
            <div class="info">
              <el-input v-model="material_info.name"
                placeholder="请输入毛条名称">
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">毛条单价：</div>
            <div class="info">
              <el-input v-model="material_info.price"
                placeholder="请输入毛条单价">
                <template slot="append">元/kg</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="resetMat">取消</div>
          <div class="opr"
            :class="{'blue':!material_info.id,'orange':material_info.id}"
            @click="saveMaterial">{{material_info.id?'修改':'添加'}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MaterialInfo } from '@/types/material'
import { material } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    list: MaterialInfo[]
    material_info: MaterialInfo
    [propName: string]: any
  } {
    return {
      loading: true,
      page: 1,
      page_size: 10,
      total: 1,
      name: '',
      type: '',
      create_flag: false,
      material_info: {
        id: '',
        type_id: '',
        name: '',
        price: '',
        desc: ''
      },
      list: []
    }
  },
  computed: {
    type_list() {
      return this.$store.state.api.materialType.arr
    }
  },
  watch: {
    page(newVal) {
      this.changeRouter(newVal)
    },
    $route() {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    getList() {
      this.loading = true
      material
        .list({
          type_id: this.type,
          name: this.name,
          page: this.page,
          limit: this.page_size
        })
        .then((res) => {
          this.list = res.data.data.items
          this.loading = false
        })
    },
    changeRouter(page: string) {
      const pages = page || 1
      this.$router.push(
        '/material/list/page=' + pages + '&&type=' + this.type + '&&name=' + this.name + '&&page_size=' + this.page_size
      )
    },
    getFilters() {
      const params = this.$getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.page_size = Number(params.page_size)
      this.name = params.name
      this.type = Number(params.type) || ''
    },
    reset() {
      this.$router.push('/material/list/page=1&&type=&&name=&&page_size=10')
    },
    resetMat() {
      this.material_info = {
        id: '',
        type_id: '',
        name: '',
        price: '',
        desc: ''
      }
      this.create_flag = false
    },
    updateMat(info: MaterialInfo) {
      this.material_info = info
      this.create_flag = true
    },
    saveMaterial() {
      if (
        this.$formCheck(this.material_info, [
          {
            key: 'type_id',
            errMsg: '请选择类型'
          },
          {
            key: 'name',
            errMsg: '请输入名称'
          }
        ])
      ) {
        return
      }
      material.create(this.material_info).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.resetMat()
          this.getList()
        }
      })
    },
    deleteMat(id: string) {
      this.$confirm('是否要删除该毛条?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          material.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/materialType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getMaterialTypeAsync'
      }
    ])
    this.getFilters()
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/material/list.less';
</style>
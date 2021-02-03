<template>
  <div id="productList"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">纱线列表</span>
        <span class="addBtn btn btnMain"
          @click="$router.push('/product/create')">添加纱线</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn"
          :class="{'showMore':showMore}">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div>
            <div class="elCtn">
              <el-select v-model="yarn_type"
                @change="changeRouter(1)"
                placeholder="选择纱线类型">
                <el-option v-for="item in typeArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-input v-model="name"
                placeholder="输入纱线名称"
                @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="color"
                placeholder="输入纱线颜色"
                @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="attribute"
                placeholder="输入纱线属性"
                @change="changeRouter(1)"></el-input>
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
              <div class="column">颜色</div>
              <div class="column">属性</div>
              <div class="column">参考价格(元)
                <el-tooltip class="item"
                  effect="dark"
                  content="Top Center 提示文字"
                  placement="top">
                  <i class="el-icon-question elicon"></i>
                </el-tooltip>
              </div>
              <div class="column">库存(kg)
                <sort v-model="sort_store"></sort>
              </div>
              <div class="column">创建人</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row"
              v-for="item in list"
              :key="item.id">
              <div class="column">{{item.yarn_type_name}}</div>
              <div class="column">{{item.name}}</div>
              <div class="column">{{item.child_data|fiterColor}}</div>
              <div class="column">{{item.child_data|fiterAttr}}</div>
              <div class="column">{{item.child_data|fiterPrice}}</div>
              <div class="column">{{item.store||0}}</div>
              <div class="column">{{item.user_name}}</div>
              <div class="column">
                <div class="opr blue"
                  @click="$router.push('/product/detail/'+item.id)">详情</div>
                <div class="opr orange"
                  @click="$router.push('/product/update/' + item.id)">修改</div>
                <div class="opr red"
                  @click="deletePro(item.id)">删除</div>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { product } from '@/assets/js/api'
import { ProductDetail } from '@/types/product'
import { YarnType } from '@/types/common'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      page: 1,
      total: 1,
      page_size: 10,
      showMore: false,
      list: [],
      name: '',
      color: '',
      attribute: '',
      yarn_type: '',
      sort_store: 0
    }
  },
  computed: {
    typeArr(): YarnType[] {
      return this.$store.state.api.yarnType.arr
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
  filters: {
    fiterColor(arr: ProductDetail[]) {
      return Array.from(new Set(arr.map((item) => item.color))).join(',')
    },
    fiterAttr(arr: ProductDetail[]) {
      return Array.from(new Set(arr.map((item) => item.attribute))).join(',')
    },
    fiterPrice(arr: ProductDetail[]) {
      const priceArr = arr.map((item) => Number(item.price))
      return Math.min.apply(null, priceArr) + '~' + Math.max.apply(null, priceArr) + '元'
    }
  },
  methods: {
    deletePro(id: number) {
      this.$confirm('是否要删除该纱线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          product
            .delete({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    reset() {
      this.$router.push('/product/list/page=1&&page_size=10&&name=&&color=&&attribute=&&yarn_type=')
    },
    changeRouter(page: string) {
      this.$router.push(
        '/product/list/page=' +
          (page || 1) +
          '&&page_size=' +
          this.page_size +
          '&&name=' +
          this.name +
          '&&color=' +
          this.color +
          '&&attribute=' +
          this.attribute +
          '&&yarn_type=' +
          this.yarn_type
      )
    },
    getFilters() {
      const params = this.$getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.page_size = Number(params.page_size)
      this.name = params.name
      this.color = params.name
      this.attribute = params.attribute
      this.yarn_type = params.yarn_type ? Number(params.yarn_type) : ''
    },
    getList() {
      product
        .list({
          limit: this.page_size,
          page: this.page,
          yarn_type: this.yarn_type,
          name: this.name,
          color: this.color,
          attribute: this.attribute
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
          }
        })
    }
  },
  created() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      }
    ])
    this.getFilters()
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/css/list.less';
</style>
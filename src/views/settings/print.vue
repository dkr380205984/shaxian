<template>
  <div class="indexMain"
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">打印单列表</span>
        <!-- <span class="addBtn btn btnMain"
          @click="changeColor()">添加颜色</span> -->
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name"
                placeholder="搜索打印页面名称"
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
              <div class="column">打印页面</div>
              <div class="column">页面标题</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row"
              v-for="item in printListCom"
              :key="item.id">
              <div class="column">{{item.name}}</div>
              <div class="column">{{item.title || '/'}}</div>
              <div class="column">
                <span class="col_btn orange"
                  @click="changePrint(item)">修改</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :current-page.sync="page"
            :page-size="limit"
            layout="prev, pager, next"
            :total="printList.length">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="addFlag">
      <div class="main"
        style="width:800px">
        <div class="titleCtn">
          <div class="text">打印修改-{{printInfo.name}}</div>
          <i class="el-icon-close"
            @click="addFlag=false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label isMust">标题名称：</div>
            <div class="info">
              <el-input placeholder="请输入标题名称"
                v-model="printInfo.title"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info"
              ref="wangeditor">
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="addFlag=false">取消</div>
          <div class="opr blue"
            @click="savePrint">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { print } from '@/assets/js/api'
import { Print } from '@/types/common'
import E from 'wangeditor'
export default Vue.extend({
  data(): {
    printInfo: Print
    printList: Print[]
    [propName: string]: any
  } {
    return {
      loading: true,
      addFlag: false,
      name: '',
      printList: [],
      printInfo: {
        id: null,
        type: '',
        name: '',
        title: '',
        desc: ''
      },
      page: 1,
      limit: 10,
      printRefEditor: null
    }
  },
  methods: {
    changeRouter(pages: number = 1) {
      this.$router.replace(`/settings/print?pages=${pages}&name=${this.name}`)
    },
    init() {
      this.page = +this.$route.query.pages || 1
      this.name = this.$route.query.name
      this.getList()
      this.$forceUpdate()
    },
    resetFilter() {
      this.name = ''
      this.changeRouter()
    },
    getList() {
      this.loading = true
      const { printList } = require('@/assets/js/settingCommon')
      printList().then((res: any) => {
        this.printList = res
        this.loading = false
      })
    },
    savePrint() {
      if (this.$submitLock()) {
        return
      }
      if (!this.printInfo.title) {
        this.$message.warning('请输入打印标题')
        return
      }
      print
        .create({
          id: this.printInfo.id || null,
          type: this.printInfo.type,
          title: this.printInfo.title,
          desc: this.printInfo.desc || ''
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            this.printInfo = {
              id: null,
              title: '',
              name: '',
              type: '',
              desc: ''
            }
            this.addFlag = false
            this.$message.success(`修改成功`)
            this.init()
          }
        })
    },
    changePrint(item: Print) {
      this.printInfo = {
        ...item
      }
      if (!this.printRefEditor) {
        const WangEditor = this.$refs.wangeditor
        this.printRefEditor = new E(WangEditor as any)
        this.printRefEditor.config.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'list', // 列表
          'justify', // 对齐方式
          'fullscreen' // 全屏
        ]
        this.printRefEditor.config.onchange = (html: any) => {
          this.printInfo.desc = html // 绑定当前逐渐地值
        }
        this.printRefEditor.create()
      }
      this.printRefEditor.txt.html(item.desc)
      this.addFlag = true
    }
    // deletePrint(item: Print) {
    //   this.$confirm('此操作将永久删除该颜色, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     print
    //       .delete({
    //         id: item.id
    //       })
    //       .then((res) => {
    //         if (res.data.status !== false) {
    //           this.$message({
    //             type: 'success',
    //             message: '删除成功!'
    //           })
    //           this.init()
    //         }
    //       })
    //   })
    // }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route(newVal) {
      this.init()
    }
  },
  computed: {
    printListCom(): Print[] {
      return this.printList
        .filter((itemF) => (this.name ? itemF.name.indexOf(this.name) !== -1 : true))
        .slice((this.page - 1) * this.limit, this.page * this.limit)
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/settings/color.less';
</style>
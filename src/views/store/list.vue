<template>
  <div class="indexMain"
    id="storeList"
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">仓库列表</span>
        <span class="addBtn btn btnMain"
          @click="changeStore()">新增仓库</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="name"
                @change="changeRouter(1)"
                placeholder="搜索仓库名称"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="type"
                @change="changeRouter(1)"
                placeholder="筛选仓库类型">
                <el-option v-for="item in typeArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-select v-model="limit"
                @change="changeRouter(1)"
                placeholder="选择加载条数">
                <el-option v-for="item in limitArr"
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
              <div class="column flex03">
                <el-checkbox v-model="checkedAll"
                  @change="checkedAllChange"></el-checkbox>
              </div>
              <div class="column">仓库名称</div>
              <div class="column">当前库存总数量(KG)</div>
              <div class="column">仓库管理员</div>
              <div class="column">仓库备注</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row"
              v-for="item in storeList"
              :key="item.id">
              <div class="column flex03">
                <el-checkbox v-model="item.checked"></el-checkbox>
              </div>
              <div class="column">{{item.name}}</div>
              <div class="column">{{item.total_weight || 0}}kg</div>
              <div class="column">{{item.admins.join('')}}</div>
              <div class="column">{{item.desc}}</div>
              <div class="column">
                <span class="col_btn orange"
                  @click="changeStore(item)">修改</span>
                <span class="col_btn blue"
                  @click="$router.push(`/store/detail/${item.id}`)">详情</span>
                <span class="col_btn red"
                  @click="deleteStore(item)">删除</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :current-page.sync="page"
            @current-change="changeRouter"
            :page-size="limit"
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
          <div class="text">{{storeInfo.id && '修改' || '新增'}}仓库</div>
          <i class="el-icon-close"
            @click="addFlag=false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label isMust">仓库名称：</div>
            <div class="info">
              <el-input placeholder="请输入加仓库名称"
                v-model="storeInfo.name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">仓库类型：</div>
            <div class="info">
              <el-select v-model="storeInfo.type"
                placeholder="请选择仓库类型">
                <el-option v-for="item in typeArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">仓库管理员：</div>
            <div class="info">
              <el-select v-model="storeInfo.admins"
                multiple
                placeholder="请选择仓库管理员">
                <el-option v-for="item in adminArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row"
            v-for="(itemLV2,indexLV2) in storeInfo.LV2_info"
            :key="indexLV2">
            <div class="label isMust">{{indexLV2 === 0 && '二级仓库名：' || ''}}</div>
            <div class="info">
              <el-input placeholder="请输入二级仓库名称"
                v-model="itemLV2.name"></el-input>
              <span class="info_btn blue"
                v-if="indexLV2 === 0"
                @click="addItem(storeInfo.LV2_info)">添加</span>
              <span class="info_btn red"
                v-else
                @click="deleteItem(storeInfo.LV2_info,indexLV2)">删除</span>
            </div>
          </div>
          <div class="row">
            <div class="label">仓库备注：</div>
            <div class="info">
              <el-input placeholder="请输入仓库备注"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="storeInfo.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="addFlag=false">取消</div>
          <div class="opr blue"
            @click="saveStore">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { store } from '@/assets/js/api'
import { Store } from '@/types/common'
export default Vue.extend({
  data(): {
    storeInfo: Store
    storeList: Store[]
    [propName: string]: any
  } {
    return {
      loading: false,
      addFlag: false,
      storeList: [
        {
          id: 1,
          name: 'test_store',
          total_weight: 333,
          type: 1,
          admins: [],
          LV2_info: [{ name: 'test_store_2' }],
          desc: '666666'
        }
      ],
      storeInfo: {
        id: null,
        name: '',
        type: 1,
        admins: [],
        LV2_info: [{ name: '' }],
        desc: ''
      },
      page: 1,
      total: 1,
      checkedAll: true,
      name: '',
      type: '',
      typeArr: [
        {
          id: 1,
          name: '本厂仓库'
        },
        {
          id: 2,
          name: '染厂仓库'
        }
      ],
      limit: 10,
      limitArr: [
        {
          id: 10,
          name: '10条'
        },
        {
          id: 20,
          name: '20条'
        },
        {
          id: 30,
          name: '30条'
        }
      ],
      adminArr: []
    }
  },
  methods: {
    changeRouter(pages: number = 1) {
      this.$router.replace(
        `/store/list?pages=${pages}&name=${this.name || ''}&limit=${this.limit || 10}&type=${this.type || ''}`
      )
    },
    init() {
      this.name = this.$route.query.name || ''
      this.limit = Number(this.$route.query.limit) || 10
      this.type = this.$route.query.type || ''
      this.getList(Number(this.$route.query.pages) || 1)
    },
    getList(pages: number = 1) {
      // this.loading = true
      // store
      //   .list({
      //     limit: this.limit,
      //     page: pages,
      //     name: this.name || null
      //   })
      //   .then((res: any) => {
      //     if (res.data.staus !== false) {
      //       this.storeList = res.data.data.items
      //       this.total = res.data.data.total
      //       this.loading = false
      //       // 更新页码
      //       if (pages !== this.page) {
      //         this.page = pages
      //       }
      //     }
      //   })
    },
    resetFilter() {
      this.name = ''
      this.limit = 10
      this.type = ''
      this.changeRouter()
    },
    saveStore() {
      if (this.$submitLock()) {
        return
      }
      if (!this.storeInfo.name) {
        this.$message.warning('请输入仓库名称')
        return
      }
      if (this.storeInfo.LV2_info.filter((itemF: { name: string }) => itemF.name).length > 0) {
        this.$message.warning('请输入二级仓库名称')
        return
      }
      if (!this.storeInfo.type) {
        this.$message.warning('请选择仓库类型')
        return
      }
      return
      store
        .create({
          id: this.storeInfo.id || null,
          name: this.storeInfo.name,
          type: this.storeInfo.type,
          admins: this.storeInfo.admins,
          LV2_info: this.storeInfo.LV2_info,
          desc: this.storeInfo.desc
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            this.$message.success(`${(this.storeInfo.id && '修改') || '添加'}成功`)
            this.addFlag = false
            this.changeRouter()
          }
        })
    },
    changeStore(item: Store) {
      this.addFlag = true
      this.storeInfo = {
        id: (item && item.id) || null,
        name: (item && item.name) || '',
        type: (item && item.type) || 1,
        admins: (item && item.admins) || [],
        LV2_info: (item && item.LV2_info) || [{ name: '' }],
        desc: (item && item.desc) || ''
      }
    },
    deleteStore(item: Store) {
      this.$confirm('此操作将删除该仓库, 是否继续?（注：已有库存日志将无法删除）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store
          .delete({
            id: item.id
          })
          .then((res: any) => {
            if (res.data.status !== false) {
              this.$message({
                type: 'success',
                message: `删除成功!`
              })
              this.changeRouter()
            }
          })
      })
    },
    checkedAllChange(flag: boolean) {
      this.storeList.forEach((itemF) => {
        itemF.checked = flag
      })
    },
    addItem(data: object[]) {
      data.push({ name: '' })
    },
    deleteItem(data: object[], index: number) {
      data.splice(index, 1)
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route() {
      this.init()
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/store/list.less';
</style>
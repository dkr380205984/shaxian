<template>
  <div class="indexMain"
    id="storeList"
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">纱线仓库列表</span>
        <span class="addBtn btn btnMain"
          @click="changeStore()">新增仓库</span>
        <span class="addBtn btn btnMain"
          @click="$router.push('/store/allDetail')">查看所有库存</span>
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
                clearable
                @change="changeRouter(1)"
                placeholder="筛选仓库类型">
                <el-option v-for="item in typeArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
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
              @click="reset">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
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
              <div class="column">{{item.name}}</div>
              <div class="column">{{item.total_weight || 0}}kg</div>
              <div class="column">{{item.admins.map(itemM=>itemM.name).join(',')}}</div>
              <div class="column">{{item.desc}}</div>
              <div class="column">
                <span class="opr orange"
                  @click="changeStore(item)">修改</span>
                <span class="opr blue"
                  @click="$router.push(`/store/detail/${item.id}`)">详情</span>
                <span class="opr red"
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
          <i class="close_icon el-icon-close"
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
                  :value="item.id">
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
                <el-option v-for="item in user_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row"
            v-for="(itemLV2,indexLV2) in storeInfo.LV2_info"
            :key="indexLV2">
            <div :class="`label ${indexLV2 === 0 ? 'isMust' : ''}`">{{indexLV2 === 0 && '二级仓库名：' || ''}}</div>
            <div class="info">
              <el-input placeholder="请输入二级仓库名称"
                v-model="itemLV2.name"></el-input>
              <span class="info_btn blue"
                v-if="indexLV2 === 0"
                @click="$addItem(storeInfo.LV2_info,{ name: '', id: null })">添加</span>
              <span class="info_btn red"
                v-else
                @click="itemLV2.id?deleteSecondStore(itemLV2.id,storeInfo.LV2_info,indexLV2):$deleteItem(storeInfo.LV2_info,indexLV2)">删除</span>
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
import { store, user } from '@/assets/js/api'
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
      storeList: [],
      storeInfo: {
        store_type: 1,
        id: null,
        name: '',
        type: 1,
        admins: [],
        LV2_info: [{ name: '', id: null }],
        desc: ''
      },
      page: 1,
      total: 1,
      checkedAll: false,
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
  computed: {
    user_list() {
      return this.$store.state.api.user.arr
    }
  },
  methods: {
    changeRouter(page: number) {
      const pages = page || 1
      this.$router.push(
        '/store/list?page=' + pages + '&type=' + this.type + '&name=' + this.name + '&page_size=' + this.page_size
      )
    },
    getList() {
      this.loading = true
      store
        .list({
          store_type: 1,
          limit: this.limit,
          page: this.page,
          name: this.name || null,
          type: this.type || null
        })
        .then((res: any) => {
          if (res.data.staus !== false) {
            this.storeList = res.data.data.items.map((itemM: any) => {
              return {
                id: itemM.id,
                name: itemM.name,
                type: itemM.type,
                admins: itemM.manager_data,
                LV2_info: itemM.second_data.map((itemS: any) => ({ id: itemS.id, name: itemS.name })),
                total_weight: itemM.store,
                desc: itemM.desc
              }
            })
            this.total = res.data.data.total
            this.loading = false
          }
        })
    },
    getFilters() {
      const params = this.$route.query
      this.page = Number(params.page)
      this.page_size = Number(params.page_size)
      this.name = params.name
      this.type = Number(params.type) || ''
    },
    reset() {
      this.$router.push('/store/list?page=&type=&name=&page_size=')
    },
    saveStore() {
      if (this.$submitLock()) {
        return
      }
      if (!this.storeInfo.name) {
        this.$message.warning('请输入仓库名称')
        return
      }
      if (!this.storeInfo.type) {
        this.$message.warning('请选择仓库类型')
        return
      }
      const LV2Name = this.storeInfo.LV2_info.filter((itemF) => !itemF.name) // 筛选出名字为false
      if (LV2Name.length > 0) {
        this.$message.warning('请输入二级仓库名称')
        return
      }
      store
        .create({
          store_type: 1,
          id: this.storeInfo.id || null,
          name: this.storeInfo.name,
          type: this.storeInfo.type,
          manager_data: this.storeInfo.admins,
          second_data: this.storeInfo.LV2_info,
          desc: this.storeInfo.desc
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            this.$message.success(`${(this.storeInfo.id && '修改') || '添加'}成功`)
            this.addFlag = false
            this.getList()
          }
        })
    },
    changeStore(item: Store) {
      this.addFlag = true
      this.storeInfo = {
        store_type: 1,
        id: (item && item.id) || null,
        name: (item && item.name) || '',
        type: (item && item.type) || 1,
        admins: (item && item.admins.map((itemM: any) => itemM.user_id)) || [],
        LV2_info: (item && item.LV2_info) || [{ name: '', id: null }],
        desc: (item && item.desc) || ''
      }
    },
    deleteSecondStore(id: number, father: any[], index: number) {
      this.$confirm('此操作将删除该二级仓库, 是否继续?（注：已有库存日志将无法删除）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store
          .deleteSecond({
            id
          })
          .then((res: any) => {
            if (res.data.status !== false) {
              this.$message({
                type: 'success',
                message: `删除成功!`
              })
              this.$deleteItem(father, index)
              this.getList()
            }
          })
      })
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
              this.getList()
            }
          })
      })
    },
    checkedAllChange(flag: boolean) {
      this.storeList.forEach((itemF) => {
        itemF.checked = flag
      })
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      }
    ])
    this.getFilters()
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/store/list.less';
</style>
<template>
  <div class="indexMain"
    id="storeDetail"
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">仓库名称：</span>
            <span class="text green">信合纱线厂</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">仓库类型：</span>
            <span class="text">本厂仓库</span>
          </div>
          <div class="colCtn">
            <span class="label">仓库管理员：</span>
            <span class="text">张三，李四</span>
          </div>
          <div class="colCtn">
            <span class="label">二级仓库名：</span>
            <span class="text">A区、B区、C区、D区</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">创建人：</span>
            <span class="text">test_ye</span>
          </div>
          <div class="colCtn">
            <span class="label flex3">创建时间：</span>
            <span class="text">{{$getDate()}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">仓库类型：</span>
            <span class="text">本厂仓库</span>
          </div>
        </div>
        <!-- <div class="pageCtn">
          <el-pagination background
            :current-page.sync="page"
            @current-change="changeRouter"
            :page-size="limit"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
        </div> -->
      </div>
    </div>
    <!-- <div class="popup"
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
    </div> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { store } from '@/assets/js/api'
import { Store } from '@/types/common'
export default Vue.extend({
  data(): {
    storeInfo: Store
    [propName: string]: any
  } {
    return {
      loading: false,
      storeInfoFilter: {
        LV2_name: '',
        name: '',
        color: '',
        page: 1,
        total: 1
      },
      storeInfo: {
        id: null,
        name: '',
        type: 1,
        admins: [],
        LV2_info: [{ name: '' }],
        desc: ''
      }
    }
  },
  methods: {
    init() {
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
    // 1是库存信息2是日志
    resetFilter(type: 1 | 2) {
      if (type === 1) {
        console.log('can not empty')
      } else if (type === 2) {
        console.log('can not empty')
      } else {
        this.$message.warning('未知重置错误')
      }
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
    checkedAllChange(flag: boolean) {
      // this.storeList.forEach((itemF) => {
      //   itemF.checked = flag
      // })
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
@import '~@/assets/less/store/detail.less';
</style>
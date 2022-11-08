<template>
  <div class="yarnStoreSelect popup" v-show="show">
    <div class="main" style="min-width: 1100px">
      <div class="titleCtn">
        <div class="text">库存纱线</div>
        <div class="closeCtn" @click="close">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn" style="padding: unset">
            <div class="elCtn">
              <el-cascader
                v-model="filterObj.LV2_name"
                :options="store_list"
                @change="getList"
                :props="{ value: 'id', label: 'name', children: 'second_data' }"
                placeholder="请选择仓库"
              >
              </el-cascader>
            </div>
            <div class="elCtn" style="width: 120px">
              <el-cascader
                v-model="filterObj.name"
                filterable
                placeholder="纱线名称"
                :show-all-levels="false"
                clearable
                :options="yarn_list"
                @change="getList"
              ></el-cascader>
              <!-- <el-input v-model="filterObj.name" @change="getList" placeholder="纱线名称"></el-input> -->
            </div>
            <div class="elCtn" style="width: 120px">
              <el-input v-model="filterObj.color" @change="getList" placeholder="纱线颜色"></el-input>
            </div>
            <div class="elCtn" style="width: 120px">
              <el-input v-model="filterObj.batch_code" @change="getList" placeholder="批号"></el-input>
            </div>
            <div class="elCtn" style="width: 120px">
              <el-input v-model="filterObj.vat_code" @change="getList" placeholder="缸号"></el-input>
            </div>
            <div class="elCtn" style="width: 120px">
              <el-input v-model="filterObj.color_code" @change="getList" placeholder="色号"></el-input>
            </div>
            <div class="elCtn" style="width: 20px">
              <el-checkbox v-model="filterObj.isFilterZero" @change="getList">过滤库存为0的纱线</el-checkbox>
            </div>
          </div>
        </div>
        <div class="list" style="max-height: 60vh; overflow: scroll;margin:unset;">
          <div class="checkCtn">
            <div class="label">已勾选单据：</div>
            <div class="elCtn check" v-for="(item, index) in selectList" :key="item.id">
              <el-input :value="item.id + '-' + item.store_name " disabled>
                <template slot="append">
                  <i class="el-icon-close hoverRed" style="cursor: pointer" @click="selectList.splice(index, 1)"></i>
                </template>
              </el-input>
            </div>
          </div>
          <div class="tableCtn" style="margin: 24px 0" v-loading="loading">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">仓库名称</div>
                <div class="tcolumn">纱线名称</div>
                <div class="tcolumn">纱线颜色</div>
                <div class="tcolumn">纱线属性</div>
                <div class="tcolumn noPad" style="flex: 6">
                  <div class="trow">
                    <div class="tcolumn">批号</div>
                    <div class="tcolumn">缸号</div>
                    <div class="tcolumn">色号</div>
                    <div class="tcolumn">实际库存(KG)</div>
                    <div class="tcolumn">可用库存(KG)</div>
                    <div class="tcolumn" style="flex: 0.4">
                      序号
                    </div>
                    <div class="tcolumn" style="flex: 0.2">
                      <el-checkbox
                        v-model="allCheck"
                        :indeterminate="isIndeterminate"
                        @change="handleCheckAllChange"
                      ></el-checkbox>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <div
                class="trow"
                v-for="(item, index) in storeListCom.data"
                :key="
                  item.store_name +
                  item.second_store_name +
                  item.name +
                  item.second_store_name +
                  item.color +
                  item.attribute +
                  index
                "
              >
                <div class="tcolumn">{{ item.store_name || '-' }} / {{ item.second_store_name || '-' }}</div>
                <div class="tcolumn">{{ item.name }}</div>
                <div class="tcolumn">{{ item.color }}</div>
                <div class="tcolumn">{{ item.attribute }}</div>
                <div class="tcolumn noPad" style="flex: 6">
                  <div class="trow" v-for="itemStore in item.store_info" :key="itemStore.id">
                    <div class="tcolumn">{{ itemStore.batch_code }}</div>
                    <div class="tcolumn">{{ itemStore.vat_code }}</div>
                    <div class="tcolumn">{{ itemStore.color_code }}</div>
                    <div class="tcolumn">
                      {{ (itemStore.reality_weight && $formatNum(itemStore.reality_weight)) || '-' }}
                    </div>
                    <div class="tcolumn blue">
                      {{ (itemStore.useable_weight && $formatNum(itemStore.useable_weight)) || '-' }}
                    </div>
                    <div class="tcolumn" style="flex:0.4">
                      {{itemStore.id}}
                    </div>
                    <div class="tcolumn flexRow" style="flex: 0.2">
                      <el-checkbox
                        v-model="itemStore.isCheck"
                        @change="checkChange($event, item, itemStore)"
                      ></el-checkbox>
                    </div>
                  </div>
                </div>
              </div>
              <div class="trow bgGray noBorder">
                <div class="tcolumn">合计</div>
                <div class="tcolumn"></div>
                <div class="tcolumn"></div>
                <div class="tcolumn"></div>
                <div class="tcolumn noPad" style="flex: 6">
                  <div class="trow">
                    <div class="tcolumn"></div>
                    <div class="tcolumn"></div>
                    <div class="tcolumn"></div>
                    <div class="tcolumn">{{ $formatNum($toFixed(storeListCom.reality_weight)) }}</div>
                    <div class="tcolumn blue">{{ $formatNum($toFixed(storeListCom.useable_weight)) }}</div>
                    <div class="tcolumn" style="flex: 0.4"></div>
                    <div class="tcolumn" style="flex: 0.2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <div class="pageCtn" style="margin-right: 20px">
          <el-pagination
            background
            @current-change="getList"
            :current-page.sync="filterObj.page"
            :page-size="10"
            layout="prev, pager, next"
            :total="filterObj.total"
          >
          </el-pagination>
        </div>
        <span class="btn borderBtn" @click="close">取消</span>
        <span class="btn backHoverBlue" style="margin: 0 20px" @click="confirm">提交</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { store } from '@/assets/js/api'
export default Vue.extend({
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data(): any {
    return {
      list: [],
      filterObj: {
        LV2_name: '',
        name: '',
        color: '',
        batch_code: '',
        color_code: '',
        vat_code: '',
        isFilterZero: true,
        page: 1,
        total: 1,
      },
      isIndeterminate: false,
      allCheck: false,
      selectList: [],
      loading: false,
      storeListCom: {}
    }
  },
  computed: {
    store_list() {
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 1)
    },
    yarn_list() {
      return this.$store.state.api.yarnType.arr.map((item: any) => {
        return {
          value: item.name,
          label: item.name,
          children: item.yarns.map((itemChild: any) => {
            return {
              value: itemChild.name,
              label: itemChild.name
            }
          })
        }
      })
    }
  },
  methods: {
    getList() {
      this.loading = true
      store
        .detailYarnList({
          store_id: this.filterObj.LV2_name ? this.filterObj.LV2_name[0] : '',
          second_store_id: this.filterObj.LV2_name ? this.filterObj.LV2_name[1] : '',
          name: this.filterObj.name[1] || null,
          color: this.filterObj.color || null,
          weight: this.filterObj.isFilterZero ? 0 : null,
          vat_code: this.filterObj.vat_code || null,
          color_code: this.filterObj.color_code || null,
          batch_code: this.filterObj.batch_code || null,
          page: this.filterObj.page || 1,
          limit: 10
        })
        .then((res) => {
          this.list = res.data.data.items
          this.storeListCom = {
            reality_weight: this.list.map((itemM: any) => +itemM.total_weight).reduce((a: any, b: any) => a + b, 0),
            useable_weight: this.list.map((itemM: any) => +itemM.use_weight).reduce((a: any, b: any) => a + b, 0),
            data: this.$mergeData(this.list, {
              mainRule: ['store_id', 'second_store_id', 'name', 'color', 'attribute'],
              otherRule: [{ name: 'second_store_name' }, { name: 'store_name' }],
              childrenName: 'store_info',
              childrenRule: {
                mainRule: ['color_code', 'vat_code', 'batch_code'],
                otherRule: [
                  { name: 'id' },
                  { name: 'total_weight/reality_weight', type: 'add' },
                  { name: 'use_weight/useable_weight', type: 'add' }
                ]
              }
            })
          }
          this.filterObj.total = res.data.data.total
          // this.selectList = []
          this.allCheck = false
          this.isIndeterminate = false
          this.loading = false
        })
    },
    handleCheckAllChange(val: any) {
      if (this.isIndeterminate || this.allCheck) {
        this.storeListCom.data.forEach((item: any) => {
          item.store_info.forEach((itemStore: any) => {
            itemStore.isCheck = true
            const index = this.selectList.map((item: any) => item.id).indexOf(itemStore.id)
            if (index === -1) {
              let obj = this.$clone(itemStore)
              obj.attribute = item.attribute
              obj.color = item.color
              obj.name = item.name
              obj.second_store_id = item.second_store_id
              obj.second_store_name = item.second_store_name
              obj.store_id = item.store_id
              obj.store_name = item.store_name

              this.selectList.push(obj)
            }
          })
        })
      } else {
        this.storeListCom.data.forEach((item: any) => {
          item.store_info.forEach((itemStore: any) => {
            itemStore.isCheck = false
            const index = this.selectList.map((item: any) => item.id).indexOf(itemStore.id)
            if (index !== -1) {
              this.selectList.splice(index, 1)
            }
          })
        })
      }

      this.isIndeterminate = false
    },
    checkChange(val: boolean, itemInfo: any, info: any) {
      if (val) {
        const index = this.selectList.map((item: any) => item.id).indexOf(info.id)
        if (index === -1) {
          let obj = this.$clone(info)
          obj.attribute = itemInfo.attribute
          obj.color = itemInfo.color
          obj.name = itemInfo.name
          obj.second_store_id = itemInfo.second_store_id
          obj.second_store_name = itemInfo.second_store_name
          obj.store_id = itemInfo.store_id
          obj.store_name = itemInfo.store_name

          this.selectList.push(obj)
        }
      } else {
        const index = this.selectList.map((item: any) => item.id).indexOf(info.id)
        if (index !== -1) {
          this.selectList.splice(index, 1)
        }
        this.allCheck = false
      }
      if (this.selectList.length === 0) {
        this.isIndeterminate = false
      } else if (this.selectList.length === this.list.length) {
        this.isIndeterminate = false
        this.allCheck = true
      } else {
        this.isIndeterminate = true
      }
      this.$forceUpdate()
      // this.allCheck = this.checkedCount.length === this.list.length;
    },
    close() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('confirm', this.selectList)
      this.close()
    },
    reset() {
      this.filterObj = {
        LV2_name: '',
        name: '',
        color: '',
        batch_code: '',
        color_code: '',
        vat_code: '',
        isFilterZero: true
      }
      // this.selectList = []
      // this.allCheck = false
      // this.isIndeterminate = false
      // this.storeListCom = {}
    },
    // 凑数的函数，不这样写的话会类型报错
    a(a: number) {}
  },
  watch: {
    show: function (val) {
      if (val) {
        this.reset()
        this.getList()
      }
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/client',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPartyBAsync'
      },
      {
        checkWhich: 'api/storeHouse',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getStoreAsync'
      },
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      }
    ])
  }
})
</script>
<style lang="less" scoped>
@import './yarnStoreSelect.less';
</style>
<template>
  <div class="indexMain"
    id="storeDetail"
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">仓库详情</span>
      </div>
      <div class="detailCtn">
        <div class="title">
          <span class="isTag">基本信息</span>
        </div>
        <div class="rowCtn">
          <div class="itemCtn">
            <span class="label">仓库名称：</span>
            <span class="text green">信合纱线厂</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="itemCtn">
            <span class="label">仓库类型：</span>
            <span class="text">本厂仓库</span>
          </div>
          <div class="itemCtn">
            <span class="label">仓库管理员：</span>
            <span class="text">张三，李四</span>
          </div>
          <div class="itemCtn">
            <span class="label">二级仓库名：</span>
            <span class="text">A区、B区、C区、D区</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="itemCtn">
            <span class="label">创建人：</span>
            <span class="text">test_ye</span>
          </div>
          <div class="itemCtn">
            <span class="label">创建时间：</span>
            <span class="text">{{$getDate()}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="itemCtn onLine">
            <span class="label">仓库类型：</span>
            <span class="text">本厂仓库</span>
          </div>
        </div>
        <div class="title">
          <span class="isTag">库存信息</span>
        </div>
        <div class="tableCtn">
          <div class="tfilter">
            <div class="leftCtn">
              <div class="label">筛选条件：</div>
              <div class="elCtn">
                <el-select v-model="storeListFilter.LV2_name"
                  @change="getStoreInfoList"
                  placeholder="请选择二级仓库名称进行筛选">
                  <el-option v-for="item in []"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <div class="elCtn">
                <el-input v-model="storeListFilter.name"
                  @change="getStoreInfoList"
                  placeholder="请输入纱线名称进行筛选"></el-input>
              </div>
              <div class="elCtn">
                <el-input v-model="storeListFilter.color"
                  @change="getStoreInfoList"
                  placeholder="请输入纱线颜色进行筛选"></el-input>
              </div>
              <div class="elCtn">
                <el-select v-model="storeListFilter.LV2_name"
                  @change="getStoreInfoList"
                  placeholder="请选择是否过滤库存为0的纱线">
                  <el-option v-for="item in []"
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
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">二级名称</div>
              <div class="tcolumn">纱线名称</div>
              <div class="tcolumn">纱线颜色</div>
              <div class="tcolumn">属性</div>
              <div class="tcolumn noPad flex5">
                <div class="trow">
                  <div class="tcolumn">纱线色号</div>
                  <div class="tcolumn">批/缸号</div>
                  <div class="tcolumn">实际库存(KG)</div>
                  <div class="tcolumn">可用库存(KG)</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in storeList"
              :key="item.id">
              <div class="tcolumn">{{item.LV2_name || '-'}}</div>
              <div class="tcolumn">{{item.material_name}}</div>
              <div class="tcolumn">{{item.material_color}}</div>
              <div class="tcolumn">{{item.material_attr}}</div>
              <div class="tcolumn noPad flex5">
                <div class="trow"
                  v-for="(itemStore,indexStore) in item.store_info"
                  :key="indexStore">
                  <div class="tcolumn">{{itemStore.color_code || '-'}}</div>
                  <div class="tcolumn">{{itemStore.vat_code || '-'}}</div>
                  <div class="tcolumn">{{itemStore.reality_weight || '-'}}</div>
                  <div class="tcolumn blue">{{itemStore.useable_weight || '-'}}</div>
                  <div class="tcolumn flexRow">
                    <span class="opr blue">入库</span>
                    <span class="opr orange">出库</span>
                    <span class="opr green">日志</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow bgGray noBorder">
              <div class="tcolumn">合计</div>
              <div class="tcolumn"></div>
              <div class="tcolumn"></div>
              <div class="tcolumn"></div>
              <div class="tcolumn noPad flex5">
                <div class="trow">
                  <div class="tcolumn"></div>
                  <div class="tcolumn"></div>
                  <div class="tcolumn">15124</div>
                  <div class="tcolumn blue">15730</div>
                  <div class="tcolumn"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="editCtn">
            <div class="editContainer"
              v-for="(itemStore,indexStore) in storeEditInfo"
              :key="indexStore">
              <span class="el-icon-circle-close"
                @click="deleteItem({data:storeEditInfo,index:indexStore})"></span>
              <div class="eRow">
                <div class="eColumn">
                  <span class="label isMust">二级仓库</span>
                  <div class="from">
                    <el-select v-model="itemStore.LV2_name"
                      placeholder="请选择二级仓库"
                      clearable>
                      <el-option v-for="item in typeArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="eColumn">
                  <span class="label isMust">出入库类型</span>
                  <div class="from">
                    <el-select v-model="itemStore.type"
                      placeholder="请选择出入库类型">
                      <el-option v-for="item in typeArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="eRow">
                <div class="eColumn">
                  <span class="label isMust">纱线名称</span>
                  <div class="from">
                    <el-select v-model="itemStore.name"
                      placeholder="请选择出入库纱线">
                      <el-option v-for="item in []"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="eColumn">
                  <span class="label isMust">纱线颜色</span>
                  <div class="from">
                    <el-autocomplete v-model="itemStore.color"
                      :fetch-suggestions="querySearchColor"
                      placeholder="请输入纱线颜色"></el-autocomplete>
                  </div>
                </div>
                <div class="eColumn">
                  <span class="label isMust">纱线属性</span>
                  <div class="from">
                    <el-select v-model="itemStore.attr"
                      clearable
                      placeholder="请选择纱线属性">
                      <el-option v-for="item in materialAttrArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="eRow">
                <div class="eColumn">
                  <div class="eRow innerEl">
                    <div class="eColumn flexMode">
                      <span class="label">色号</span>
                      <div class="from">
                        <el-autocomplete v-model="itemStore.color_code"
                          :fetch-suggestions="querySearchColorCode"
                          placeholder="请输入纱线色号"></el-autocomplete>
                      </div>
                    </div>
                    <div class="eColumn flexMode">
                      <span class="label">批/缸号</span>
                      <div class="from">
                        <el-autocomplete v-model="itemStore.vat_code"
                          :fetch-suggestions="querySearchVatCode"
                          placeholder="请输入纱线批/缸号"></el-autocomplete>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="eColumn">
                  <span class="label isMust">出入库数量</span>
                  <div class="from">
                    <el-input v-model="itemStore.weight"
                      placeholder="请输入出入库数量"></el-input>
                  </div>
                </div>
                <div class="eColumn">
                  <span class="label isMust">出入库说明</span>
                  <div class="from">
                    <el-autocomplete v-model="itemStore.remark"
                      :fetch-suggestions="querySearchRemark"
                      placeholder="请输入出入库说明"></el-autocomplete>
                  </div>
                </div>
              </div>
            </div>
            <div class="editBtnCtn"
              v-if="storeEditInfo.length > 0">
              <div class="editBtn btnGray"
                @click="deleteItem({data:storeEditInfo,type:'cancel'})">取消</div>
              <div class="editBtn btnBlue"
                @click="addItem({data:storeEditInfo,type:'add'})">添加下一组</div>
              <div class="editBtn btnGreen"
                @click="saveStoreEditInfo">提交</div>
            </div>
            <div class="editBtnCtn"
              v-else>
              <div class="editBtn btnBlue"
                @click="addItem({data:storeEditInfo,type:'add'})">添加库存</div>
            </div>
          </div>
          <!-- <div class="tpage">
            <el-pagination background
              current-page.sync="1"
              @current-change="changeRouter"
              :page-size="10"
              layout="prev, pager, next"
              :total="30">
            </el-pagination>
          </div> -->
        </div>
        <div class="title">
          <span class="isTag">出入库日志</span>
        </div>
        <div class="tableCtn noBorder">
          <div class="tfilter showMore">
            <div class="leftCtn">
              <div class="label">筛选条件：</div>
              <div class="elCtn">
                <el-select v-model="storeLogListFilter.LV2_name"
                  @change="getStoreLogList"
                  placeholder="请选择二级仓库名称进行筛选">
                  <el-option v-for="item in []"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <div class="elCtn">
                <el-input v-model="storeLogListFilter.name"
                  @change="getStoreLogList"
                  placeholder="请输入纱线名称进行筛选"></el-input>
              </div>
              <div class="elCtn">
                <el-input v-model="storeLogListFilter.color"
                  @change="getStoreLogList"
                  placeholder="请输入纱线颜色进行筛选"></el-input>
              </div>
              <div class="elCtn">
                <el-select v-model="storeLogListFilter.attr"
                  @change="getStoreLogList"
                  placeholder="请选择纱线属性进行筛选">
                  <el-option v-for="item in []"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <div class="elCtn">
                <el-select v-model="storeLogListFilter.type"
                  @change="getStoreLogList"
                  placeholder="请选择出库类型进行筛选">
                  <el-option v-for="item in []"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <div class="elCtn">
                <el-input v-model="storeLogListFilter.code"
                  @change="getStoreLogList"
                  placeholder="请输入关联单号进行筛选"></el-input>
              </div>
              <div class="elCtn">
                <el-select v-model="storeLogListFilter.limit"
                  @change="getStoreLogList"
                  placeholder="每页展示条数">
                  <el-option v-for="item in []"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <div class="elCtn">
                <el-date-picker v-model="storeLogListFilter.date"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择操作时间筛选">
                </el-date-picker>
              </div>
            </div>
            <div class="rightCtn">
              <div class="btn btnGray fr"
                @click="resetFilter">重置</div>
            </div>
          </div>
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">仓库</div>
              <div class="tcolumn">纱线名称</div>
              <div class="tcolumn">纱线颜色</div>
              <div class="tcolumn">属性</div>
              <div class="tcolumn">纱线色号</div>
              <div class="tcolumn">批/缸号</div>
              <div class="tcolumn">关联单号</div>
              <div class="tcolumn">类型</div>
              <div class="tcolumn">出入库数量(KG)</div>
              <div class="tcolumn">出入库备注</div>
              <div class="tcolumn">操作时间</div>
              <div class="tcolumn">操作人</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in storeList"
              :key="item.id">
              <div class="tcolumn">仓库</div>
              <div class="tcolumn">纱线名称</div>
              <div class="tcolumn">纱线颜色</div>
              <div class="tcolumn">属性</div>
              <div class="tcolumn">纱线色号</div>
              <div class="tcolumn">批/缸号</div>
              <div class="tcolumn">关联单号</div>
              <div class="tcolumn">类型</div>
              <div class="tcolumn">出入库数量(KG)</div>
              <div class="tcolumn">出入库备注</div>
              <div class="tcolumn">操作时间</div>
              <div class="tcolumn">操作人</div>
            </div>
          </div>
          <div class="tpage">
            <div class="leftInfo">
              <div class="item">
                <span class="label">合计入库：</span>
                <span class="blue">15130KG</span>
              </div>
              <div class="item">
                <span class="label">合计出库：</span>
                <span class="orange">15130KG</span>
              </div>
            </div>
            <el-pagination background
              current-page.sync="1"
              @current-change="getStoreLogList"
              :page-size="storeLogListFilter.limit || 10"
              layout="prev, pager, next"
              :total="30">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: false,
      // 库存数据
      storeList: [
        {
          LV2_name: 'A',
          material_name: '26S/2晴纶',
          material_color: '白胚',
          material_attr: '绞纱',
          store_info: [
            {
              color_code: null,
              vat_code: null,
              reality_weight: 6500,
              useable_weight: 6000
            },
            {
              color_code: '123',
              vat_code: '456',
              reality_weight: 6500,
              useable_weight: 6000
            },
            {
              color_code: '789',
              vat_code: '111',
              reality_weight: 6500,
              useable_weight: 6000
            }
          ]
        },
        {
          LV2_name: 'B',
          material_name: '26S/2晴纶',
          material_color: '白胚',
          material_attr: '筒纱',
          store_info: [
            {
              color_code: null,
              vat_code: null,
              reality_weight: 6500,
              useable_weight: 6000
            }
          ]
        }
      ],
      storeListFilter: {
        LV2_name: '',
        name: '',
        color: '',

        page: 1,
        total: 1
      },
      storeEditInfo: [
        {
          LV2_name: '',
          type: '',
          name: '',
          color: '',
          attr: '',
          color_code: '',
          vat_code: '',
          weight: '',
          remark: ''
        }
      ],
      typeArr: [
        {
          id: 1,
          name: '入库'
        },
        {
          id: 2,
          name: '出库'
        }
      ],
      materialAttrArr: [
        {
          id: 1,
          name: '绞纱'
        },
        {
          id: 2,
          name: '筒纱'
        }
      ],
      // 日志数据
      storeLogList: [{}, {}],
      storeLogListFilter: {
        LV2_name: '',
        name: '',
        color: '',
        attr: '',
        type: '',
        code: '',
        limit: 10,
        time: ''
      }
    }
  },
  methods: {
    init() {
      this.getStoreInfoList(Number(this.$route.query.pages) || 1)
    },
    getStoreInfoList(pages: number = 1) {
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
    resetFilter(type: 1 | 2 /**1是库存信息2是日志 */) {
      if (type === 1) {
      } else if (type === 2) {
      } else {
        this.$message.warning('未知重置错误')
      }
    },
    addItem({ data, item, type = 'add' }: { data: Object[]; type: 'add' | 'copy'; item: Object }) {
      if (type === 'copy') {
        data.push(this.$clone(item))
        return
      }
      data.push({
        LV2_name: '',
        type: '',
        name: '',
        color: '',
        attr: '',
        color_code: '',
        vat_code: '',
        weight: '',
        remark: ''
      })
    },
    deleteItem({
      data,
      index,
      type = 'deleteIndex'
    }: {
      data: object[]
      index: number
      type: 'cancel' | 'deleteIndex'
    }) {
      if (type === 'cancel') {
        data.splice(0)
      } else if (type === 'deleteIndex') {
        data.splice(index, 1)
      }
    },
    saveStoreEditInfo() {},
    getStoreLogList(pages: number = 1) {},
    querySearchColor(queryString: string, cb: () => void) {},
    querySearchColorCode(queryString: string, cb: () => void) {},
    querySearchVatCode(queryString: string, cb: () => void) {},
    querySearchRemark(queryString: string, cb: () => void) {}
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
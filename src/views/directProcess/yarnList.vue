<template>
  <div id="yarnList" class="indexMain" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">加工单信息</span>
        <span
          class="addBtn btn btnMain"
          @click="
            resetProcess()
            create_flag = true
          "
          >添加加工单</span
        >
      </div>
      <div class="listCtn">
        <div class="filterCtn showMore">
          <div class="leftCtn" style="padding: unset; max-width: unset">
            <div class="label">筛选条件：</div>
            <!-- <div class="showMore" @click="showMore = !showMore">{{ !showMore ? '展示更多' : '收起筛选' }}</div> -->
            <div class="elCtn">
              <el-input v-model="code" placeholder="请输入加工单号搜索" @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="client_id" placeholder="选择加工单位" clearable @change="changeRouter(1)">
                <el-option
                  v-for="item in client_arr"
                  :key="item.id + '加工单位'"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-input v-model="name" placeholder="搜索纱线名称" @change="changeRouter(1)"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="user_id" clearable placeholder="选择创建人">
                <el-option
                  v-for="item in user_list"
                  :key="item.id + '创建人'"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-select v-model="page_size" placeholder="选择每页展示的条数" @change="changeRouter(1)">
                <el-option label="每页10条" :value="10"></el-option>
                <el-option label="每页20条" :value="20"></el-option>
                <el-option label="每页30条" :value="30"></el-option>
              </el-select>
            </div>
            <div class="elCtn middle" style="width: 350px">
              <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeRouter(1)"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="rightCtn" style="min-width: 94px">
            <div class="btn btnGray fr" @click="reset">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="list">
            <div class="overflow" @mousewheel.prevent="listenWheel" ref="list">
              <div class="tableCtn">
                <div class="table">
                  <div class="headCtn">
                    <div class="row">
                      <div class="column min120">调取单号</div>
                      <div class="column noPad" style="flex: 10; flex-direction: column">
                        <div class="row">
                          <div class="column min120">加工单号</div>
                          <div class="column min120">加工单位</div>
                          <div class="column min120">加工单状态</div>
                          <div class="column min120">审核信息</div>
                          <div class="column min120">纱线名称</div>
                          <div class="column" style="max-width: 150px; min-width: 150px">加工详情</div>
                          <div class="column min120">加工数量(kg)</div>
                          <div class="column min120">加工总数(kg)</div>
                          <div class="column min120">下单总价(kg)</div>
                          <div class="column min120">交货日期</div>
                          <div class="column min120">下单日期</div>
                          <div class="column min120">补充说明</div>
                          <div class="column min120">操作人</div>
                        </div>
                      </div>
                      <div class="column" style="min-width: 162px; box-sizing: border-box">操作</div>
                    </div>
                  </div>
                  <div class="bodyCtn">
                    <div
                      class="row"
                      v-for="item in list"
                      :key="item.id + item.code + '调取单层级'"
                      :style="{ height: 51 * item.process_info.length - 1 + 'px' }"
                    >
                      <div class="column min120">{{ item.code }}</div>
                      <div class="column noPad" style="flex: 10; flex-direction: column">
                        <div
                          class="row"
                          v-for="(itemPro, indexPro) in item.process_info"
                          :key="'加工单层级' + indexPro + itemPro.name"
                        >
                          <div class="column min120">{{ itemPro.code }}</div>
                          <div class="column min120">{{ itemPro.client_name }}</div>
                          <div class="column min120">
                            <span
                              :class="{
                                orange: itemPro.status === 1,
                                blue: itemPro.status === 2,
                                green: itemPro.status === 3,
                                gray: itemPro.status === 4
                              }"
                            >
                              {{ itemPro.status | orderStatusFilter }}
                            </span>
                          </div>
                          <div class="column min120">
                            <span
                              :class="{
                                orange: !itemPro.is_check,
                                green: itemPro.is_check === 1,
                                red: itemPro.is_check === 2
                              }"
                              >{{ itemPro.is_check | orderCheckFilter }}</span
                            >
                          </div>
                          <div class="column min120">
                            <div class="sortContainer">
                              <div class="sort">
                                <i class="el-icon-caret-top hover" @click="changeIndex(itemPro, 'add')"></i>
                                <div class="number">{{ (itemPro.index || 0) + 1 }}/{{ itemPro.child_data.length }}</div>
                                <i class="el-icon-caret-bottom hover" @click="changeIndex(itemPro, 'delete')"></i>
                              </div>
                              <span>{{ itemPro.child_data[itemPro.index || 0].name }}</span>
                            </div>
                          </div>
                          <div class="column" style="max-width: 150px; min-width: 150px">
                            <span class="green" style="margin-right: 12px">{{ itemPro.type }}</span>
                            <span v-if="itemPro.type === '倒筒'">
                              {{ itemPro.child_data[itemPro.index || 0].before_attribute }}
                              <i class="el-icon-d-arrow-right"></i>
                              {{ itemPro.child_data[itemPro.index || 0].after_attribute }}
                            </span>
                            <span v-if="itemPro.type === '染色'">
                              {{ itemPro.child_data[itemPro.index || 0].before_color }}
                              <i class="el-icon-d-arrow-right"></i>
                              {{ itemPro.child_data[itemPro.index || 0].after_color }}
                            </span>
                            <span v-if="itemPro.type === '膨纱'">
                              {{ itemPro.child_data[itemPro.index || 0].color }}
                              /
                              {{ itemPro.child_data[itemPro.index || 0].attribute }}
                            </span>
                          </div>
                          <div class="column min120">
                            <span>{{ itemPro.child_data[itemPro.index || 0].weight }}</span>
                          </div>
                          <div class="column min120">
                            <span class="blue">{{ itemPro.total_weight }}</span>
                          </div>
                          <div class="column min120 blue">{{ itemPro.total_price }}</div>
                          <div class="column min120">
                            <div v-if="itemPro.status !== 3" style="display: flex; flex-direction: column">
                              <span>{{ itemPro.delivery_time }}</span>
                              <span
                                :class="{
                                  red: $diffByDate(itemPro.delivery_time) <= 0,
                                  green: $diffByDate(itemPro.delivery_time) > 7,
                                  orange:
                                    $diffByDate(itemPro.delivery_time) <= 7 && $diffByDate(itemPro.delivery_time) > 0
                                }"
                              >
                                {{
                                  $diffByDate(itemPro.delivery_time) > 0
                                    ? '交货还剩' + $diffByDate(itemPro.delivery_time) + '天'
                                    : '延期发货' + Math.abs($diffByDate(itemPro.delivery_time)) + '天'
                                }}
                              </span>
                            </div>
                            <div v-if="itemPro.status === 3" style="display: flex; flex-direction: column">
                              <span>{{ itemPro.delivery_time }}</span>
                              <span class="green">已完成</span>
                            </div>
                          </div>
                          <div class="column min120">{{ itemPro.order_time }}</div>
                          <div class="column min120">
                            <el-image
                              style="width: 50px; height: 50px; line-height: 50px; text-align: center; font-size: 22px"
                              :src="itemPro.file_url"
                              :preview-src-list="[itemPro.file_url]"
                            >
                              <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                              </div>
                            </el-image>
                          </div>
                          <div class="column min120">{{ item.user_name }}</div>
                        </div>
                      </div>
                      <div class="column" style="min-width: 162px; box-sizing: border-box"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="coverTable">
              <div class="floatL">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">调取单号</div>
                    <div class="column noPad">
                      <div class="row">
                        <div class="column min120">加工单号</div>
                        <div class="column min120">加工单位</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div
                    class="row"
                    v-for="item in list"
                    :key="item.id + 'listInfo'"
                    :style="{ height: 51 * item.process_info.length - 1 + 'px' }"
                  >
                    <div class="column min120 blue">
                      {{ item.code }}
                    </div>
                    <div class="column noPad" style="flex: 10; flex-direction: column">
                      <div
                        class="row"
                        v-for="(itemPro, indexPro) in item.process_info"
                        :key="'固定列调取单' + indexPro + itemPro.name"
                      >
                        <div class="column min120">{{ itemPro.code }}</div>
                        <div class="column min120">{{ itemPro.client_name }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="floatR">
                <div class="headCtn">
                  <div class="row">
                    <div class="column">操作</div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div
                    class="row"
                    v-for="item in list"
                    :key="item.id + 'sss'"
                    :style="{ height: 51 * item.process_info.length - 1 + 'px' }"
                  >
                    <div class="column">
                      <span class="opr blue" @click="$router.push('/directProcess/yarnDetailNew/' + item.id)"
                        >详情</span
                      >
                      <span class="opr orange" @click="openUpdate(item)">修改</span>
                      <span class="opr red" @click="openDelete(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background :current-page.sync="page" :page-size="10" layout="prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <add-trans-process
      :update_flag="update_flag"
      :create_flag="create_flag"
      :info="info"
      @close="resetProcess()"
      @afterCreate="getList()"
    ></add-trans-process>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { stock } from '@/assets/js/api'
import { ProcessYarn } from '@/types/orderProcessYarn'
export default Vue.extend({
  data(): {
    [PropName: string]: any
  } {
    return {
      loading: true,
      create_flag: false,
      update_flag: false,
      loadingPro: false,
      select_store_id: '',
      second_select_store_id: '',
      page: 1,
      total: 1,
      info: {},
      uploadIndex: '',
      page_size: 10,
      showMore: false,
      client_id: '',
      code: '',
      name: '',
      status: '',
      date: [],
      user_id: '',
      list: [],
      storeList: [],
      selectList: [],
      getYarnStoreObj: {
        store_id: '',
        second_store_id: '',
        name: '',
        LV2_name: '',
        color: '',
        batch_code: '',
        vat_code: '',
        color_code: '',
        storePage: 1,
        storeTotal: 1
      },
      postData: { key: '', token: '' }
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
    client_arr() {
      return this.$store.state.api.supplier.arr.filter(
        (item: any) =>
          item.client_type === '染色单位' || item.client_type === '膨纱单位' || item.client_type === '倒筒单位'
      )
    },
    user_list() {
      return this.$store.state.api.user.arr
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
    },
    store_list() {
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 1)
    },
    token() {
      return this.$store.state.status.token
    }
  },
  methods: {
    changeRouter(page: string) {
      const pages = page || 1
      this.$router.push(
        '/directProcess/yarnList?page=' +
          pages +
          '&code=' +
          this.code +
          '&name=' +
          this.name +
          '&client_id=' +
          this.client_id +
          '&user_id=' +
          this.user_id +
          '&page_size=' +
          this.page_size +
          '&date=' +
          this.date
      )
    },
    reset() {
      this.$router.push('/directProcess/yarnList?page=1&code=&name=&client_id=&user_id=&page_size=10&date=')
    },
    changeIndex(father: any, type: string) {
      if (!father.index) {
        father.index = 0
      }
      if (type === 'add') {
        if (father.index < father.child_data.length - 1) {
          father.index++
        } else {
          father.index = 0
        }
      }
      if (type === 'delete') {
        if (father.index === 0) {
          father.index = father.child_data.length - 1
        } else {
          father.index--
        }
      }
      this.$forceUpdate()
    },
    getFilters() {
      const params = this.$route.query
      this.page = Number(params.page)
      this.page_size = Number(params.page_size)
      this.user_id = params.user_id ? Number(params.user_id) : ''
      this.client_id = params.client_id ? Number(params.client_id) : ''
      this.name = params.name
      this.code = params.code
      if (params.date !== 'null' && params.date !== '') {
        this.date = (params.date as string).split(',')
      } else {
        this.date = []
      }
    },
    getList() {
      this.loading = true
      stock
        .list({
          process_code: this.code,
          process_client_id: this.client_id,
          process_user_id: this.user_id,
          process_name: this.name,
          process_start_time: this.date && this.date.length > 0 ? this.date[0] : '',
          process_end_time: this.date && this.date.length > 0 ? this.date[1] : '',
          page: this.page,
          limit: this.page_size,
          action_type: [16]
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
          this.list.forEach((item: any) => {
            item.process_info.forEach((itemPro: any) => {
              itemPro.total_weight = itemPro.child_data
                .reduce((total: number, current: any) => {
                  return total + +current.weight
                }, 0)
                .toFixed(1)
            })
          })
          this.loading = false
          this.$forceUpdate()
        })
    },

    beforeAvatarUpload(file: any) {
      const fileName = file.name.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
      const fileNameLength = file.name.length // 取到文件名长度
      const fileFormat = file.name.substring(fileName + 1, fileNameLength) // 截
      this.postData.token = this.token
      this.postData.key = Date.parse(new Date() + '') + '.' + fileFormat
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!')
        return false
      }
    },
    resetProcess() {
      this.create_flag = false
      this.update_flag = false
    },
    // 监听一下鼠标滚轮
    listenWheel(ev: any) {
      const detail = ev.wheelDelta || ev.detail
      // 定义滚动方向，其实也可以在赋值的时候写
      const moveForwardStep = 1
      const moveBackStep = -1
      // 定义滚动距离
      let step = 0
      // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
      if (detail < 0) {
        step = moveForwardStep * 50
      } else {
        step = moveBackStep * 50
      }
      // @ts-ignore 对需要滚动的元素进行滚动操作
      this.$refs.list.scrollLeft += step
    },
    openDelete(id: number) {
      this.$confirm('是否删除该调取单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          stock
            .delete({
              id
            })
            .then((res) => {
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
    },
    openUpdate(info: ProcessYarn) {
      this.update_flag = true
      this.info = info
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
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      },
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      },
      {
        checkWhich: 'api/storeHouse',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getStoreAsync'
      },
      {
        checkWhich: 'status/token',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getTokenAsync'
      }
    ])
    this.getFilters()
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/directProcess/yarnList.less';
</style>

<style>
/* el-table 自定义滚动条的时候没有白线 */
.el-table__fixed-right::before,
.el-table__fixed::before {
  content: unset;
}
.el-date-editor.el-input {
  width: 100%;
}
</style>
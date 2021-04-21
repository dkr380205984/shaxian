<template>
  <div id="priceCreate"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">添加报价单</span>
      </div>
      <div class="createCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">报价单名称</span>
              <span class="explanation">(选填)</span>
            </div>
            <div class="content">
              <el-input v-model="price_name"
                placeholder="请输入报价单名称" />
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">客户名称</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-select v-model="client_name"
                filterable
                placeholder="请选择报价客户"
                @change="searchClientCode('')">
                <el-option v-for="item in clientArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">关联客户单号</span>
              <span class="explanation">(选填)</span>
            </div>
            <div class="content">
              <el-select v-model="order_code"
                :disabled='!client_name'
                filterable
                clearable
                remote
                :remote-method="searchClientCode"
                placeholder="请选择关联客户单号"
                :loading="order_loading">
                <el-option v-for="item in orderArr"
                  :key="item.id"
                  :label="item.code"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="rowCtn yarnBlock"
          v-for="(itemYarn,indexYarn) in editInfo"
          :key="indexYarn">
          <span class="num">{{indexYarn + 1}}</span>
          <span class="el-icon-close"
            @click="deleteItem(editInfo,indexYarn)"></span>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">纱线名称</span>
                <span class="explanation">(必选)</span>
              </div>
              <div class="content">
                <el-cascader v-model="itemYarn.yarn_name"
                  placeholder="请选择纱线名称"
                  :options="yarnArr"
                  @change="selectYarnEvent(itemYarn,$event)"></el-cascader>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="content"
                style="display:flex">
                <div class="colCtn"
                  style="margin-right:24px">
                  <div class="label">
                    <span class="text">颜色属性</span>
                    <span class="explanation">(选填)</span>
                  </div>
                  <div class="content">
                    <el-autocomplete v-model="itemYarn.color"
                      :fetch-suggestions="querySearchYarnColor(itemYarn)"
                      placeholder="请选择颜色属性"></el-autocomplete>
                    <!-- <el-select v-model="itemYarn.color"
                      placeholder="请选择颜色属性">
                      <el-option v-for="item in itemYarn.colorArr"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                      </el-option>
                    </el-select> -->
                  </div>
                </div>
                <div class="colCtn"
                  style="margin:0">
                  <div class="label">
                    <span class="text">外形属性</span>
                    <span class="explanation">(选填)</span>
                  </div>
                  <div class="content">
                    <el-select v-model="itemYarn.attr"
                      placeholder="请选择外形属性">
                      <el-option v-for="item in attrArr"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">纱线成本价</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="content">
                <div class="elCtn">
                  <el-input v-model="itemYarn.cost_price"
                    @input="computedPrice(itemYarn)"
                    placeholder="请输入纱线成本价">
                    <template slot="append">元/千克</template>
                  </el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">客户起订量</span>
                <span class="explanation">(选填)</span>
              </div>
              <div class="content">
                <el-input v-model="itemYarn.set_number"
                  placeholder="请输入数量">
                  <template slot="append">千克</template>
                </el-input>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">质量要求</span>
                <span class="explanation">(选填)</span>
              </div>
              <div class="content">
                <el-input v-model="itemYarn.ask_for_quality"
                  placeholder="请输入质量要求" />
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">其它要求</span>
                <span class="explanation">(选填)</span>
              </div>
              <div class="content">
                <el-input v-model="itemYarn.ask_for_other"
                  placeholder="请输入其它要求" />
              </div>
            </div>
          </div>
          <template v-for="(itemProcess,indexProcess) in itemYarn.process">
            <div class="rowCtn"
              style="margin:0 0 8px 0"
              :key="`process_${indexProcess}`">
              <div class="colCtn flex3">
                <div class="label"
                  v-if="indexProcess === 0">
                  <span class="text">纱线加工</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="content">
                  <el-select v-model="itemProcess.name"
                    clearable
                    placeholder="请选择加工项目">
                    <el-option v-for="item in processArr"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label"
                  v-if="indexProcess === 0">
                  <span class="text">额外说明</span>
                  <span class="explanation">(选填)</span>
                </div>
                <div class="content">
                  <el-input v-model="itemProcess.desc"
                    placeholder="请输入额外说明" />
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label"
                  v-if="indexProcess === 0">
                  <span class="text">加工单价</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="content">
                  <div class="handleBtn add"
                    v-if="indexProcess === 0"
                    @click="addItem(itemYarn.process)">添加</div>
                  <div class="handleBtn delete"
                    @click="deleteItem(itemYarn.process,indexProcess)"
                    v-else>删除</div>
                  <el-input v-model="itemProcess.price"
                    @input="computedPrice(itemYarn)"
                    placeholder="请输入加工单价">
                    <template slot="append">元/千克</template>
                  </el-input>
                </div>
              </div>
            </div>
          </template>
          <template v-for="(itemOther,indexOther) in itemYarn.other">
            <div class="rowCtn"
              style="margin:0 0 8px 0"
              :key="`other_${indexOther}`">
              <div class="colCtn flex3">
                <div class="label"
                  v-if="indexOther === 0">
                  <span class="text">其它费用</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="content">
                  <el-input v-model="itemOther.name"
                    placeholder="请输入费用名称">
                  </el-input>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label"
                  v-if="indexOther === 0">
                  <span class="text">额外说明</span>
                  <span class="explanation">(选填)</span>
                </div>
                <div class="content">
                  <el-input v-model="itemOther.desc"
                    placeholder="请输入额外说明" />
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label"
                  v-if="indexOther === 0">
                  <span class="text">费用单价</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="content">
                  <div class="handleBtn add"
                    v-if="indexOther === 0"
                    @click="addItem(itemYarn.other)">添加</div>
                  <div class="handleBtn delete"
                    @click="deleteItem(itemYarn.other,indexOther)"
                    v-else>删除</div>
                  <el-input v-model="itemOther.price"
                    @input="computedPrice(itemYarn)"
                    placeholder="请输入加工单价">
                    <template slot="append">元/千克</template>
                  </el-input>
                </div>
              </div>
            </div>
          </template>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">基本利润比例</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="content">
                <el-input v-model="itemYarn.profits.rate"
                  @input="computedPrice(itemYarn)"
                  placeholder="请输入比例">
                  <template slot="append">%</template>
                </el-input>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">基本利润价格</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="content">
                <el-input v-model="itemYarn.profits.price"
                  disabled
                  placeholder="0">
                  <template slot="append">元/千克 </template>
                </el-input>
              </div>
            </div>
            <div class="colCtn flex3"></div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">基本税费比例</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="content">
                <el-input v-model="itemYarn.tax.rate"
                  @input="computedPrice(itemYarn)"
                  placeholder="请输入比例">
                  <template slot="append">%</template>
                </el-input>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">基本税费价格</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="content">
                <el-input v-model="itemYarn.tax.price"
                  disabled
                  placeholder="0">
                  <template slot="append">元/千克 </template>
                </el-input>
              </div>
            </div>
            <div class="colCtn flex3"></div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">合计单价</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="content">
                <el-input v-model="itemYarn.total_price"
                  disabled
                  placeholder="0">
                  <template slot="append">元/千克</template>
                </el-input>
              </div>
            </div>
            <div class="colCtn flex3"></div>
            <div class="colCtn flex3"></div>
          </div>
        </div>
        <div class="btn btnBlue"
          @click="addItem(editInfo,'editInfo')">添加下一组</div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="label">
              <span class="text">其它备注</span>
              <span class="explanation">(选填)</span>
            </div>
            <div class="content">
              <el-input v-model="remark"
                placeholder="其它备注信息"></el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="label">
              <span class="text">价格预览</span>
            </div>
            <div class="content autoHeight">
              <div class="tableCtn">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn center flex03">种类序号</div>
                    <div class="tcolumn center flex2">纱线名称</div>
                    <div class="tcolumn center">纱线颜色</div>
                    <div class="tcolumn center">外形属性</div>
                    <div class="tcolumn center">最终价格</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in editInfoCom"
                    :key="index">
                    <div class="tcolumn center flex03">{{index+1}}</div>
                    <div class="tcolumn center flex2">{{item.yarn_name || '/'}}</div>
                    <div class="tcolumn center">{{item.color || '/'}}</div>
                    <div class="tcolumn center">{{item.attr || '/'}}</div>
                    <div class="tcolumn center">{{item.total_price || 0}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="saveAll">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {} from '@/types/material'
import { processArr } from '@/assets/js/settingCommon'
import { partyB, yarnType, product, price, order } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      order_loading: false,
      price_name: '',
      client_name: '',
      clientArr: [],
      order_code: '',
      orderArr: [],
      editInfo: [
        {
          yarn_name: '',
          colorArr: [],
          color: '',
          attr: '',
          cost_price: '',
          set_number: '',
          ask_for_quality: '',
          ask_for_other: '',
          process: [
            {
              name: '',
              desc: '',
              price: ''
            }
          ],
          other: [
            {
              name: '',
              desc: '',
              price: ''
            }
          ],
          profits: { rate: '', price: '' },
          tax: { rate: '', price: '' },
          total_price: ''
        }
      ],
      yarnArr: [],
      processArr,
      attrArr: [{ name: '绞纱' }, { name: '筒纱' }],
      remark: ''
    }
  },
  methods: {
    querySearchYarnColor(event: any) {
      return (queryString: string, cb: (data: []) => void) => {
        cb(
          queryString ? event.colorArr.filter((itemF: any) => itemF.label.indexOf(queryString) !== -1) : event.colorArr
        )
      }
    },
    searchClientCode(event: string) {
      if (!this.client_name) {
        this.order_code = ''
        this.orderArr = []
        return
      }
      this.order_loading = true
      order
        .list({
          code: event,
          client_id: this.client_name,
          page: 1,
          limit: 50
        })
        .then((res: any) => {
          if (res.data.statsu !== false) {
            this.orderArr = res.data.data.items
            this.order_loading = false
          }
        })
    },
    saveAll() {
      if (this.$submitLock()) {
        return
      }
      if (!this.client_name) {
        this.$message.warning('请选择报价客户')
        return
      }
      let msgStr = null
      const data = this.editInfo.map((itemM: any) => {
        if (!itemM.tax.rate && itemM.tax.rate !== 0) {
          msgStr = '请填写基本税费比例'
        }
        if (!itemM.profits.rate && itemM.profits.rate !== 0) {
          msgStr = '请填写基本利润比例'
        }
        if (itemM.other.find((itemF: any) => itemF.name && !itemF.price)) {
          msgStr = '检测到其它费用已填但未填写费用单价'
        }
        if (itemM.process.find((itemF: any) => itemF.name && !itemF.price)) {
          msgStr = '检测到纱线加工已选但未填写加工单价'
        }
        if (!itemM.cost_price) {
          msgStr = '请填写纱线成本价'
        }
        if ((Array.isArray(itemM.yarn_name) && !itemM.yarn_name[1]) || !itemM.yarn_name) {
          msgStr = '请选择报价纱线'
        }
        return {
          yarn_id: (Array.isArray(itemM.yarn_name) && itemM.yarn_name[1]) || itemM.yarn_name,
          color: itemM.color,
          attribute: itemM.attr,
          cost_price: itemM.cost_price,
          weight: itemM.set_number,
          mass_demand: itemM.ask_for_quality,
          other_demand: itemM.ask_for_other,
          yarn_process_info: JSON.stringify(itemM.process),
          other_fee: JSON.stringify(itemM.other),
          profit: itemM.profits.price,
          profit_proportion: itemM.profits.rate,
          tax: itemM.tax.price,
          tax_proportion: itemM.tax.rate,
          total_price: itemM.total_price
        }
      })
      if (msgStr) {
        this.$message.warning(msgStr)
        return
      }
      price
        .create({
          id: null,
          title: this.price_name || null,
          client_id: this.client_name,
          order_id: this.order_code || null,
          child_data: data,
          desc: this.remark
        })
        .then((res) => {
          if (res.data.status !== false) {
            this.$message.success('添加成功')
            this.$router.replace(`/price/detail/${res.data.data}`)
          }
        })
    },
    computedPrice(item: any) {
      const totalPrice = [
        item.cost_price,
        ...item.process.map((itemM: any) => itemM.price),
        ...item.other.map((itemM: any) => itemM.price)
      ].reduce((total, current) => +total + +current, 0)
      item.total_price = this.$toFixed(totalPrice / (1 - ((+item.profits.rate || 0) + (+item.tax.rate || 0)) / 100))
      item.profits.price = this.$toFixed((item.total_price * (+item.profits.rate || 0)) / 100)
      item.tax.price = this.$toFixed((item.total_price * (+item.tax.rate || 0)) / 100)
    },
    selectYarnEvent(item: any, event: [number, number]) {
      product
        .detail({
          id: event[1]
        })
        .then((res) => {
          item.colorArr = Array.from(new Set(res.data.data.child_data.map((itemChild: any) => itemChild.color))).map(
            (itemChild: any) => {
              return {
                value: itemChild,
                label: itemChild
              }
            }
          )
        })
    },
    addItem(data: any[], type: 'cost' | 'editInfo' = 'cost') {
      if (type === 'editInfo') {
        data.push({
          yarn_name: '',
          colorArr: [],
          color: '',
          attr: '',
          cost_price: '',
          set_number: '',
          ask_for_quality: '',
          ask_for_other: '',
          process: [
            {
              name: '',
              desc: '',
              price: ''
            }
          ],
          other: [
            {
              name: '',
              desc: '',
              price: ''
            }
          ],
          profits: { rate: '', price: '' },
          tax: { rate: '', price: '' },
          total_price: ''
        })
        return
      }
      data.push({ name: '', desc: '', price: '' })
    },
    deleteItem(data: Array<{ name: string; desc: string; price: string }>, index: number) {
      if (data.length === 1) {
        this.$message.warning('最少保留一项可提交数据')
        return
      }
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          data.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
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
    Promise.all([
      partyB.list({
        type: 1
      }),
      yarnType.list()
    ]).then((res) => {
      this.clientArr = res[0].data.data
      this.yarnArr = res[1].data.data.map((itemM: any) => {
        return {
          value: itemM.id,
          label: itemM.name,
          children: itemM.yarns.map((itemY: any) => {
            return {
              value: itemY.id,
              label: itemY.name
            }
          })
        }
      })
    })
  },
  computed: {
    editInfoCom(): any[] {
      return this.editInfo.map((itemM: any) => {
        const findedFirst = this.yarnArr.find((itemF: any) => itemF.value === itemM.yarn_name[0])
        const findedLast = findedFirst
          ? findedFirst.children.find((itemF: any) => itemF.value === itemM.yarn_name[1])
          : null
        return {
          yarn_name: (findedLast && findedLast.label) || '',
          color: itemM.color,
          attr: itemM.attr,
          total_price: itemM.total_price
        }
      })
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/price/create.less';
</style>
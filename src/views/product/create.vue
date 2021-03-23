<template>
  <div id="productCreate"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">添加纱线</span>
      </div>
      <div class="createCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">纱线类型</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-select v-model="input_form.type"
                  placeholder="请选择纱线类型">
                  <el-option v-for="item in typeArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3"
            v-if="name_flag === 'normal'">
            <div class="label">
              <span class="text">纱线名称</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input v-model="input_form.normal_name"
                  placeholder="请输入"></el-input>
              </div>
              <div class="editBtn addBtn"
                @click="name_flag='complex'">批量添加</div>
            </div>
          </div>
          <div class="colCtn"
            v-if="name_flag==='complex'">
            <div class="label">
              <span class="text">纱线名称</span>
              <span class="explanation">(批量填写)</span>
            </div>
            <div class="content">
              <div class="complexCtn">
                <el-input class="el"
                  v-model="input_form.zs_times"
                  placeholder="支数间隔值"></el-input>
                <el-input class="el"
                  v-model="input_form.zs_min"
                  placeholder="支数最小值"></el-input>
                <span class="icon">-</span>
                <el-input class="el"
                  v-model="input_form.zs_max"
                  placeholder="支数最大值"></el-input>
                <el-select class="el"
                  v-model="input_form.zs_unit"
                  placeholder="支数单位">
                  <el-option label="支"
                    value="支"></el-option>
                  <el-option label="cm"
                    value="cm"></el-option>
                  <el-option label="公分"
                    value="公分"></el-option>
                  <el-option label="S"
                    value="S"></el-option>
                </el-select>
                <span class="icon">/</span>
                <el-input class="el"
                  v-model="input_form.gs_times"
                  placeholder="股数间隔值"></el-input>
                <el-input class="el"
                  v-model="input_form.gs_min"
                  placeholder="股数最小值"></el-input>
                <span class="icon">-</span>
                <el-input class="el"
                  v-model="input_form.gs_max"
                  placeholder="股数最大值"></el-input>
                <el-input class="el big"
                  v-model="input_form.complex_name"
                  placeholder="纱线名称"></el-input>
              </div>
              <div class="editBtn addBtn"
                @click="name_flag='normal'">单个添加</div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">纱线颜色</span>
              <span class="explanation">(不填则默认为白胚)</span>
            </div>
            <div class="content"
              style="margin-bottom:12px"
              v-for="(item,index) in input_form.colorArr"
              :key="index">
              <div class="elCtn">
                <el-input placeholder="请输入纱线颜色"
                  v-model="item.name"></el-input>
              </div>
              <div class="editBtn addBtn"
                @click="$addItem(input_form.colorArr,{name:''})"
                v-if="index===0">添加颜色</div>
              <div class="editBtn deleteBtn"
                @click="$deleteItem(input_form.colorArr,index)"
                v-if="index>0">删除颜色</div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">纱线属性</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content"
              style="margin-bottom:12px"
              v-for="(item,index) in input_form.attributeArr"
              :key="index">
              <div class="elCtn">
                <el-select v-model="item.name"
                  placeholder="请选择纱线属性">
                  <el-option label="筒纱"
                    value="筒纱"></el-option>
                  <el-option label="绞纱"
                    value="绞纱"></el-option>
                </el-select>
              </div>
              <div class="editBtn addBtn"
                @click="$addItem(input_form.attributeArr,{name:''})"
                v-if="index===0">添加属性</div>
              <div class="editBtn deleteBtn"
                @click="$deleteItem(input_form.attributeArr,index)"
                v-if="index>0">删除属性</div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">纱线名称预览:</span>
              <span class="blue"
                style="cursor:pointer;margin-left:12px"
                @click="renderData">{{submit_form.length===0?'点击加载名称':'重新加载'}}</span>
            </div>
            <div class="content autoHeight">
              <div class="tableCtn">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn">纱线名称</div>
                    <div class="tcolumn noPad"
                      style="flex:5">
                      <div class="trow">
                        <div class="tcolumn">纱线颜色</div>
                        <div class="tcolumn">纱线属性</div>
                        <div class="tcolumn">纱线价格</div>
                        <div class="tcolumn">备注信息</div>
                        <div class="tcolumn">操作</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="noData"
                    v-show="submit_form.length===0">暂无预览</div>
                  <div class="trow"
                    v-for="(item,index) in submit_form"
                    :key="index">
                    <div class="tcolumn">
                      <el-input class="el"
                        v-model="item.name"
                        placeholder="名称">
                      </el-input>
                    </div>
                    <div class="tcolumn noPad"
                      style="flex:5">
                      <div class="trow"
                        v-for="(itemChild,indexChild) in item.child_data"
                        :key="indexChild">
                        <div class="tcolumn">
                          <el-input class="el"
                            v-model="itemChild.color"
                            placeholder="颜色">
                          </el-input>
                        </div>
                        <div class="tcolumn">
                          <el-input class="el"
                            v-model="itemChild.attribute"
                            placeholder="属性">
                          </el-input>
                        </div>
                        <div class="tcolumn">
                          <el-input class="el"
                            v-model="itemChild.price"
                            placeholder="单价">
                            <template slot="append">元</template>
                          </el-input>
                        </div>
                        <div class="tcolumn">
                          <el-input class="el"
                            v-model="itemChild.desc"
                            placeholder="备注"></el-input>
                        </div>
                        <div class="tcolumn flexRow">
                          <span class="opr red"
                            style="margin-right:12px"
                            @click="deleteOnce(item.child_data,indexChild,index)">删除</span>
                          <span class="opr blue"
                            @click="$addItem(item.child_data,{color: '',
                              attribute: '',
                              price: '',
                              desc: ''})">添加</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="btn btnMain"
              @click="$addItem(submit_form, { yarn_type: input_form.type, name: '', child_data: [{color: '',
            attribute: '',
            price: '',
            desc: ''}] })">添加纱线</div>
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
            @click="savePro">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Product, ProductDetail } from '@/types/product'
import { product } from '@/assets/js/api'
import { YarnType } from '@/types/common'
export default Vue.extend({
  data(): {
    submit_form: Product[]
    [propName: string]: any
  } {
    return {
      input_form: {
        type: '',
        normal_name: '',
        zs_times: '', // 支数间隔
        zs_min: '',
        zs_max: '',
        zs_unit: '支',
        gs_times: '',
        gs_min: '',
        gs_max: '',
        complex_name: '',
        colorArr: [
          {
            name: ''
          }
        ],
        attributeArr: [
          {
            name: ''
          }
        ]
      },
      submit_form: [],
      name_flag: 'normal'
    }
  },
  computed: {
    typeArr(): YarnType[] {
      return this.$store.state.api.yarnType.arr
    }
  },
  methods: {
    renderData() {
      let msg = ''
      this.input_form.attributeArr.forEach((item: { name: string }) => {
        if (!item.name) {
          msg = '请选择纱线属性'
        }
      })
      if (this.name_flag === 'normal') {
        msg = this.input_form.normal_name ? '' : '请输入纱线名称'
      } else {
        msg = this.input_form.complex_name ? '' : '请输入纱线名称'
      }
      if (msg) {
        this.$message.error(msg)
        return
      }
      if (this.submit_form.length > 0) {
        this.$confirm('是否要重新加载，这可能会导致已经填写的数据丢失?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.render()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      } else {
        this.render()
      }
    },
    render() {
      this.submit_form = []
      const proDetail: ProductDetail[] = []
      this.input_form.colorArr.forEach((itemColor: { name: string }) => {
        this.input_form.attributeArr.forEach((itemAtr: { name: string }) => {
          proDetail.push({
            color: itemColor.name || '白胚',
            attribute: itemAtr.name,
            price: '',
            desc: ''
          })
        })
      })
      if (this.name_flag === 'normal') {
        this.submit_form = [
          { yarn_type: this.input_form.type, name: this.input_form.normal_name, child_data: this.$clone(proDetail) }
        ]
      } else {
        const zsArr: any[] = []
        const gsArr: any[] = []
        if (Number(this.input_form.zs_min) && Number(this.input_form.zs_max)) {
          for (
            let i = Number(this.input_form.zs_min);
            i <= Number(this.input_form.zs_max);
            i += Number(this.input_form.zs_times) || 1
          ) {
            zsArr.push(i + this.input_form.zs_unit)
          }
        }
        if (Number(this.input_form.gs_min) && Number(this.input_form.gs_max)) {
          for (
            let i = Number(this.input_form.gs_min);
            i <= Number(this.input_form.gs_max);
            i += Number(this.input_form.gs_tiems) || 1
          ) {
            if (Number(i) !== 1) {
              gsArr.push(i)
            }
          }
        }
        if (zsArr.length > 0 && gsArr.length > 0) {
          zsArr.forEach((itemZs) => {
            gsArr.forEach((itemGs) => {
              this.submit_form.push({
                yarn_type: this.input_form.type,
                name: itemZs + '/' + itemGs + this.input_form.complex_name,
                child_data: this.$clone(proDetail)
              })
            })
          })
        } else if (zsArr.length > 0 && gsArr.length === 0) {
          zsArr.forEach((itemZs) => {
            this.submit_form.push({
              yarn_type: this.input_form.type,
              name: itemZs + this.input_form.complex_name,
              child_data: this.$clone(proDetail)
            })
          })
        } else if (zsArr.length === 0 && gsArr.length > 0) {
          gsArr.forEach((itemGs) => {
            this.submit_form.push({
              yarn_type: this.input_form.type,
              name: itemGs + this.input_form.complex_name,
              child_data: this.$clone(proDetail)
            })
          })
        } else {
          this.submit_form = [
            { yarn_type: this.input_form.type, name: this.input_form.complex_name, child_data: this.$clone(proDetail) }
          ]
        }
      }
      this.$forceUpdate()
    },
    deleteOnce(father: ProductDetail[], indexChild: number, indexFather: number) {
      if (father.length > 1) {
        father.splice(indexChild, 1)
      } else {
        this.submit_form.splice(indexFather, 1)
      }
    },
    checkForm(): string {
      let msg = ''
      this.submit_form.forEach((item) => {
        if (!item.name) {
          msg = '请输入纱线名称'
        }
        item.child_data.forEach((itemChild) => {
          if (!itemChild.price && !Number(itemChild.price)) {
            msg = '请输入单价信息，可以填0'
          }
          if (!itemChild.color) {
            msg = '请输入纱线颜色，可填白胚'
          }
          if (!itemChild.attribute) {
            msg = '请输入纱线属性'
          }
        })
      })
      if (!this.input_form.type) {
        msg = '请选择纱线类型'
      }
      if (this.submit_form.length === 0) {
        msg = '请点击加载名称生成表格'
      }
      return msg
    },
    savePro() {
      if (this.checkForm()) {
        this.$message.error(this.checkForm())
        return
      }
      product.create({ data: this.submit_form }).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
        }
      })
    }
  },
  mounted() {
    this.$checkCommonInfo([
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
@import '~@/assets/less/product/create.less';
</style>
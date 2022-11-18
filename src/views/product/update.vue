<template>
  <div id="productCreate"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">修改纱线</span>
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
                  multiple
                  placeholder="请选择纱线类型"
                  :disabled="!edit_type_flag">
                  <el-option v-for="item in typeArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </div>
              <div class="editBtn orange"
                @click="editPro('type')">{{edit_type_flag?'确认修改':'修改类型'}}</div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">纱线名称</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input :disabled="!edit_name_flag"
                  v-model="input_form.normal_name"
                  placeholder="请输入"></el-input>
              </div>
              <div class="editBtn orange"
                @click="editPro('name')">{{edit_name_flag?'确认修改':'修改名称'}}</div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">纱线信息:</span>
              <span class="blue"
                style="cursor:pointer;margin-left:12px"
                @click="$addItem(submit_form,{ 
                  id: '',
                  color: '',
                  attribute: '',
                  price:'',
                  desc: '',
                  edit:true,
                })">新增纱线</span>
            </div>
            <div class="content autoHeight">
              <div class="tableCtn">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn">纱线颜色</div>
                    <div class="tcolumn">纱线属性</div>
                    <div class="tcolumn">纱线价格</div>
                    <div class="tcolumn">备注信息</div>
                    <div class="tcolumn">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in submit_form"
                    :key="index">
                    <div class="tcolumn">
                      <el-input class="el"
                        :disabled="!item.edit"
                        v-model="item.color"
                        placeholder="纱线颜色">
                      </el-input>
                    </div>
                    <div class="tcolumn">
                      <el-input class="el"
                        :disabled="!item.edit"
                        v-model="item.attribute"
                        placeholder="纱线属性">
                      </el-input>
                    </div>
                    <div class="tcolumn">
                      <el-input class="el"
                        :disabled="!item.edit"
                        v-model="item.price"
                        placeholder="单价">
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                    <div class="tcolumn">
                      <el-input class="el"
                        :disabled="!item.edit"
                        v-model="item.desc"
                        placeholder="备注"></el-input>
                    </div>
                    <div class="tcolumn"
                      style="flex-direction:row;align-items:center;justify-content:start">
                      <span class="opr"
                        style="margin-right:12px"
                        @click="editChild(item)"
                        :class="{'orange':!item.edit,'green':item.edit}">{{item.edit?'完成':'编辑'}}</span>
                      <span class="opr red"
                        @click="deleteChild(item.id,index)">删除</span>
                    </div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProductDetail } from '@/types/product'
import { product } from '@/assets/js/api'
import { YarnType } from '@/types/common'
export default Vue.extend({
  data(): {
    submit_form: ProductDetail[]
    [propName: string]: any
  } {
    return {
      loading: true,
      input_form: {
        type: '',
        normal_name: ''
      },
      submit_form: [],
      edit_type_flag: false,
      edit_name_flag: false
    }
  },
  computed: {
    typeArr(): YarnType[] {
      return this.$store.state.api.yarnType.arr
    }
  },
  methods: {
    editPro(which: string) {
      if (which === 'type') {
        if (this.edit_type_flag) {
          this.savePro()
        } else {
          this.edit_type_flag = true
        }
      } else {
        if (this.edit_name_flag) {
          this.savePro()
        } else {
          this.edit_name_flag = true
        }
      }
    },
    savePro() {
      this.loading = true
      product
        .editPro({
          id: this.$route.params.id,
          name: this.input_form.normal_name,
          yarn_type: this.input_form.type
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('修改成功')
            this.edit_name_flag = false
            this.edit_type_flag = false
            this.loading = false
          }
        })
    },
    editChild(detail: ProductDetail) {
      if (detail.edit) {
        if (detail.color && detail.attribute) {
          let arr = this.$mergeData(this.submit_form,{
            mainRule:['color','attribute','price','desc']
          })
          if(this.submit_form.length !== arr.length) {
            this.$message.error('请勿提交所有信息全部相同的纱线')
            return
          }
          this.loading = true
          product
            .editProChild({
              id: detail.id,
              color: detail.color,
              attribute: detail.attribute,
              price: detail.price || 0,
              desc: detail.desc,
              pid: this.$route.params.id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('修改成功')
              }
              detail.id = res.data.data
              detail.edit = false
              this.loading = false
              this.$forceUpdate()
            })
        } else {
          this.$message.error('请完善纱线颜色信息')
        }
      } else {
        detail.edit = true
        this.$forceUpdate()
      }
    },
    deleteChild(id: number, index: number) {
      if (id) {
        product.deleteChild({ id }).then((res) => {
          if (res.data.status) {
            this.$message.success('删除成功')
            this.$deleteItem(this.submit_form, index)
          }
        })
      } else {
        this.$deleteItem(this.submit_form, index)
      }
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
    product
      .detail({
        id: this.$route.params.id
      })
      .then((res) => {
        const data = res.data.data
        this.input_form.type = data.yarn_type.map((item: any) => item.type_id)
        this.input_form.normal_name = data.name
        this.submit_form = data.child_data
        this.loading = false
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/product/create.less';
</style>
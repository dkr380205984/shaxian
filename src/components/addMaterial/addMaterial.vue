<template>
  <div class="addMaterial popup" v-show="show">
    <div class="main" style="min-width: 1000px">
      <div class="titleCtn">
        <span class="text">{{ update ? '修改' : '添加' }}毛条</span>
        <div class="closeCtn" @click="close">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="contentCtn">
        <div class="row">
          <div class="label isMust">毛条类型：</div>
          <div class="info">
            <el-select placeholder="请选择毛条类型" v-model="material_info.type_id">
              <el-option v-for="item in type_list" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="label isMust">毛条名称：</div>
          <div class="info">
            <el-input v-model="material_info.name" placeholder="请输入毛条名称"> </el-input>
          </div>
        </div>
        <div class="row">
          <div class="label">毛条单价：</div>
          <div class="info">
            <el-input v-model="material_info.price" placeholder="请输入毛条单价">
              <template slot="append">元/kg</template>
            </el-input>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <div class="opr" @click="close">取消</div>
        <div class="opr" :class="{ blue: !update, orange: update }" @click="saveMaterial">
          {{ update ? '修改' : '添加' }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { MaterialInfo } from '@/types/material'
import { material } from '@/assets/js/api'
import { YarnType, Color } from '@/types/common'
export default Vue.extend({
  props: {
    id: {
      default: ''
    },
    show: {
      type: Boolean,
      required: true
    },
    update: {
      type: Boolean,
      default: false
    }
  },
  data(): {
    material_info: MaterialInfo
    [propName: string]: any
  } {
    return {
      material_info: {
        id: '',
        type_id: '',
        name: '',
        price: '',
        desc: ''
      },
      input_form: {
        type: [],
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
            name: '白胚'
          }
        ],
        attributeArr: [
          {
            name: ''
          }
        ]
      },
      yarnTypeInfo: { name: '' },
      typeFlag: false,
      submit_form: [],
      name_flag: 'normal',
      attributeArr: [{ value: '绞纱' }, { value: '筒纱' }]
    }
  },
  computed: {
    type_list() {
      return this.$store.state.api.materialType.arr
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    saveMaterial() {
      if (
        this.$formCheck(this.material_info, [
          {
            key: 'type_id',
            errMsg: '请选择类型'
          },
          {
            key: 'name',
            errMsg: '请输入名称'
          }
        ])
      ) {
        return
      }
      material.create({ data: [this.material_info] }).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.resetMat()
          this.getList()
        }
      })
    },
    render() {
      this.submit_form = []
      this.input_form.colorArr.forEach((itemColor: { name: string }) => {})
      if (this.name_flag === 'normal') {
        this.submit_form = []
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
                name: itemZs + '/' + itemGs + this.input_form.complex_name
              })
            })
          })
        } else if (zsArr.length > 0 && gsArr.length === 0) {
          zsArr.forEach((itemZs) => {
            this.submit_form.push({
              yarn_type: this.input_form.type,
              name: itemZs + this.input_form.complex_name
            })
          })
        } else if (zsArr.length === 0 && gsArr.length > 0) {
          gsArr.forEach((itemGs) => {
            this.submit_form.push({
              yarn_type: this.input_form.type,
              name: itemGs + this.input_form.complex_name
            })
          })
        } else {
          this.submit_form = []
        }
      }
      this.$forceUpdate()
    },

    querySearchAttr(queryString: string, cb: (params: any) => void) {
      const returnData = queryString
        ? this.attributeArr.filter((itemF: any) => itemF.value.indexOf(queryString) !== -1)
        : this.attributeArr
      cb(returnData)
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/materialType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getMaterialTypeAsync'
      }
    ])
  }
})
</script>
<style lang="less" scoped>
@import './addMaterial.less';
</style>
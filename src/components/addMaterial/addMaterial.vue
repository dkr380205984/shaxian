<template>
  <div class="addMaterial popup" v-show="show">
    <div class="main" style="min-width: 1000px" v-loading="loading">
      <div class="titleCtn">
        <span class="text">
          {{ update? '修改': '添加' }}毛条
          <el-checkbox v-if="!update" v-model="continueAdd">开启持续添加</el-checkbox>
        </span>
        <div class="closeCtn" @click="close">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="contentCtn">
        <div class="row">
          <div class="label isMust">毛条类型：</div>
          <div class="info tagCtn" v-if="type_list.length > 0">
            <span class="yarnNameTag" :class="{ active: item.check, unactive: !item.check }"
              v-for="(item, index) in type_list" :key="item.value" @click="
  item.check = !item.check
                $forceUpdate()
              ">
              <span class="name">{{ item.name }}</span>
              <span class="el-icon-close icon" @click.stop="deleteType(item, index)"></span>
            </span>
            <span class="elCtn" v-show="typeFlag">
              <el-input placeholder="输入新增类型" v-model="materialYarnInfo.name"></el-input>
            </span>
            <span class="yarnNameTag" :class="typeFlag ? 'active' : 'addBtn'"
              @click="typeFlag ? saveType() : (typeFlag = true)">{{ typeFlag? '保存类型': '新增类型' }}
              <i :class="typeFlag ? 'el-icon-document-checked' : 'el-icon-plus'"></i>
            </span>
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
        <div class="row">
          <div class="label">单价备注：</div>
          <div class="info">
            <el-input v-model="material_info.desc" placeholder="请输入单价备注">
            </el-input>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <div class="opr" @click="close">取消</div>
        <div class="opr" :class="{ blue: !update, orange: update }" @click="saveMaterial">
          {{ update? '修改': '添加' }}
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
      materialYarnInfo: {},
      loading: false,
      continueAdd: false,
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
    getDetail() {
      this.loading = true
      material.detail({ id: this.id }).then((res) => {
        res.data.data.rel_type.forEach((item: any) => {
          item.name
          this.type_list.forEach((itemFind: any) => {
            if (itemFind.name === item.name) {
              itemFind.check = true
            }
          })
        });
        this.material_info = res.data.data
        this.loading = false
      })
    },
    saveType() {
      if (this.$submitLock()) {
        return
      }
      if (!this.materialYarnInfo.name) {
        this.$message.warning('请输入毛条类型名称')
        return
      }
      material
        .typeCreate({
          id: null,
          name: this.materialYarnInfo.name
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            this.$message.success('添加成功')
            this.typeFlag = false
            this.type_list.push({
              id: res.data.data?.id,
              name: this.materialYarnInfo.name,
              child_data: [],
              check: true
            })
          }
        })
    },
    deleteType(item: any, index: number) {
      this.$confirm('此操作将永久删除该毛条类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        material
          .typeDelete({
            id: item.id
          })
          .then((res) => {
            if (res.data.status !== false) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$deleteItem(this.type_list, index)
            }
          })
      })
    },
    close() {
      this.$emit('afterCreate')
      this.$emit('close')
    },
    saveMaterial() {
      if (
        this.$formCheck(this.material_info, [
          {
            key: 'name',
            errMsg: '请输入名称'
          }
        ])
      ) {
        return
      }

      let isCheck = this.type_list.find((item: any) => item.check)
      if (!isCheck) {
        this.$message.error('请选择毛条类型')
        return
      }

      let arr: any = []
      this.type_list.forEach((item: any) => {
        if (item.check) {
          arr.push(item.id)
        }
      })

      this.material_info.type_id = this.$clone(arr)

      material.create({ data: [this.material_info] }).then((res) => {
        if (res.data.status) {
          if (this.continueAdd) {
            this.$message.success((this.update ? '修改' : '添加') + '成功')
            this.reset()
          } else {
            this.$message.success((this.update ? '修改' : '添加') + '成功')
            this.close()
            // location.reload()
          }
        }
      })
    },
    reset() {
      this.material_info = {
        id: '',
        type_id: '',
        name: '',
        price: '',
        desc: ''
      }
    },
    querySearchAttr(queryString: string, cb: (params: any) => void) {
      const returnData = queryString
        ? this.attributeArr.filter((itemF: any) => itemF.value.indexOf(queryString) !== -1)
        : this.attributeArr
      cb(returnData)
    }
  },
  watch: {
    update(val) {
      this.reset()
      if (val && this.id) {
        this.getDetail()
      }
    },
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/materialType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getMaterialTypeAsync',
      }
    ])
  }
})
</script>
<style lang="less" scoped>
@import './addMaterial.less';
</style>
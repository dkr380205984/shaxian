<template>
  <div class="zhListSetting popup" v-show="show">
    <div class="main">
      <div class="titleCtn">
        <div class="text">列表设置</div>
        <div class="closeCtn" @click="close">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="contentCtn">
        <div class="explainCtn">
          注：特殊元素以及图片信息只能排序，不可移除，也不能锁定在左侧！重置以及恢复系统设置均需要<span class="blue"
            >保存显示方案</span
          >才能生效！
        </div>
        <div class="listCtn">
          <div class="clearfix" style="margin-bottom: 20px">
            <div class="btn backHoverOrange fr" style="margin-left: 16px" @click="resetAll">恢复系统设置</div>
            <div class="btn backHoverGreen fr" style="margin-left: 16px" @click="resetNow">重置本次操作</div>
          </div>
          <div class="list">
            <div class="row title">
              <div class="column">字段名称</div>
              <div class="column">是否显示</div>
              <div class="column">是否锁定在左侧</div>
              <div class="column">排序操作</div>
            </div>
            <div class="row" v-for="item in selfData" :key="item.index" :class="{ lock: item.ifLock }">
              <div class="column">{{ item.name }}</div>
              <div class="column">
                <el-checkbox v-model="item.ifShow" :disabled="item.ifImage || !!item.from">{{
                  item.ifShow ? '显示' : '不显示'
                }}</el-checkbox>
              </div>
              <div class="column">
                <el-checkbox
                  v-model="item.ifLock"
                  @change="changeIndex(item.index, 3)"
                  :disabled="item.ifImage || !!item.from"
                  >{{ item.ifLock ? '锁定' : '不锁定' }}</el-checkbox
                >
              </div>
              <div class="column">
                <div
                  class="opr"
                  :class="item.index === 0 ? 'disable' : 'hoverBlue'"
                  @click="changeIndex(item.index, 1)"
                >
                  上移
                </div>
                <div
                  class="opr"
                  :class="item.index === selfData.length - 1 ? 'disable' : 'hoverBlue'"
                  @click="changeIndex(item.index, 2)"
                >
                  下移
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <div class="btn borderBtn" @click="close">取消</div>
        <div class="btn backHoverBlue" @click="saveSetting">保存显示方案</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ListSetting } from '@/types/common'
import { listSetting } from '@/assets/js/api'
export default Vue.extend({
  props: {
    id: {
      type: [Number, Object]
    },
    show: {
      type: Boolean,
      required: true
    },
    // 1:订单 2.纱线采购
    type: {
      type: Number,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    originalData: {
      type: Array,
      required: true
    }
  },
  data(): {
    selfData: ListSetting[]
  } {
    return {
      selfData: []
    }
  },
  watch: {
    // 由于列表数据是异步的，所以我们监听父组件传过来的值
    data(newVal) {
      this.selfData = this.$clone(newVal) as ListSetting[]
    }
  },
  methods: {
    close() {
      this.$emit('close', this.selfData)
    },
    // 1上移 2下移 3锁定在左侧
    // 注意：锁定在左侧操作需要重排index
    changeIndex(index: number, type: 1 | 2 | 3) {
      if (type === 3) {
        // 锁定和解锁分开处理
        if (this.selfData[index].ifLock) {
          const lockLength = this.selfData.filter((item) => item.ifLock).length
          this.selfData.forEach((item) => {
            item.index = item.index > lockLength - 2 && item.index < index ? item.index + 1 : item.index
          })
          this.selfData[index].index = lockLength - 1
          this.selfData.sort((a, b) => {
            return a.index - b.index
          })
        } else {
          const lockLength = this.selfData.filter((item) => item.ifLock).length
          this.selfData.forEach((item) => {
            item.index = item.index <= lockLength && item.index > index ? item.index - 1 : item.index
          })
          this.selfData[index].index = lockLength
          this.selfData.sort((a, b) => {
            return a.index - b.index
          })
        }
      } else if (type === 2) {
        const lockLength = this.selfData.filter((item) => item.ifLock).length
        if (index === lockLength - 1) {
          this.$message.warning('锁定栏不能下移到非锁定栏')
        } else if (index === this.selfData.length - 1) {
          this.$message.warning('已经是最后一栏')
        } else {
          this.selfData[index + 1].index = index
          this.selfData[index].index = index + 1
          this.selfData.sort((a, b) => {
            return a.index - b.index
          })
        }
      } else if (type === 1) {
        const lockLength = this.selfData.filter((item) => item.ifLock).length
        if (index === lockLength) {
          this.$message.warning('非锁定栏不能上移到锁定栏')
        } else if (index === 0) {
          this.$message.warning('已经是第一栏')
        } else {
          this.selfData[index - 1].index = index
          this.selfData[index].index = index - 1
          this.selfData.sort((a, b) => {
            return a.index - b.index
          })
        }
      } else {
        this.$message.error('程序出错，请联系系统管理员')
      }
    },
    // 恢复初始设置
    resetAll() {
      this.$confirm('是否将列表恢复成系统初始设置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.selfData = this.$clone(this.originalData) as ListSetting[]
          this.$message({
            type: 'success',
            message: '已重置!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 恢复本次操作
    resetNow() {
      this.$confirm('是否重置本次所有操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.selfData = this.$clone(this.data) as ListSetting[]
          this.$message({
            type: 'success',
            message: '已重置!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    saveSetting() {
      this.$emit('beforeSave', this.selfData)
      listSetting
        .create({
          id: this.id,
          type: this.type,
          content: JSON.stringify(this.selfData)
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('保存设置成功')
            this.$emit('afterSave', this.selfData)
            this.close()
          }
        })
    }
  }
})
</script>

<style lang="less" scoped>
@import './zhListSetting.less';
</style>

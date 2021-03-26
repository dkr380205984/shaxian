<template>
  <div class="popup"
    v-if="show">
    <div class="main">
      <div class="titleCtn">
        <div class="text">审核信息</div>
        <i class="el-icon-close"
          @click="reset"></i>
      </div>
      <div class="contentCtn">
        <div class="row">
          <div class="label">审核意见：</div>
          <div class="info"
            style="line-height:32px">
            <el-radio v-model="ifPass"
              :label="true">通过</el-radio>
            <el-radio v-model="ifPass"
              :label="false">驳回</el-radio>
          </div>
        </div>
        <div class="row">
          <div class="label">驳回理由：</div>
          <div class="info"
            style="padding-top:8px">
            <el-input type="textarea"
              placeholder="请输入备注信息（不超过30个字）"
              v-model="checkReason"
              :disabled="ifPass"
              maxlength="30"
              show-word-limit>
            </el-input>
          </div>
        </div>
        <div class="row"
          v-if="checkList">
          <div class="label">常见选项：</div>
          <div class="info"
            style="padding-top:8px">
            <el-checkbox-group v-model="commonReason">
              <el-checkbox v-for="item in checkList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
                :disabled="ifPass"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <div class="opr"
          @click="reset">取消</div>
        <div class="opr blue"
          @click="saveCheck">确定</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { CheckInfo } from '@/types/common'
import { check } from '@/assets/js/api'
@Component
export default class Check extends Vue {
  @Prop() show!: boolean
  @Prop() pid!: number | string
  @Prop() checkType!: 1 | 2 | 3 | 4 | 5 | 6 | 7
  @Prop() checkList?: Array<{ value: string; label: string }>
  ifPass: boolean = true
  checkReason: string = ''
  commonReason: string[] = []
  reset() {
    this.$emit('update:show', false)
  }
  saveCheck() {
    const formData: CheckInfo = {
      pid: this.pid,
      is_check: this.ifPass ? 1 : 2,
      check_type: this.checkType,
      check_desc: this.commonReason.join(','),
      desc: this.checkReason
    }
    check.create(formData).then((res) => {
      if (res.data.status) {
        this.$message.success('审核成功')
        this.reset()
        this.$emit('afterCheck', formData)
      }
    })
  }
}
</script>

<style lang="less" scoped>
@import './check.less';
</style>
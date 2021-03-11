<template>
  <div :class='`document_input_container ${rowModle && "rowModle" || ""}`'
    @click.stop="handleClickEvent">
    <span class="document_input_label"
      v-if="!noLabel">{{label}}</span>
    <textarea class="document_input_self"
      :placeholder="placeholder"
      :readonly='readonly'
      v-model="innerValue"
      :rows='rows'
      @input="inputEvent"
      ref="input" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
@Component
export default class DocumentInput extends Vue {
  public innerValue: string = ''
  @Prop({ default: '' }) value?: string
  @Prop({ default: '' }) label?: string
  @Prop({ default: '' }) placeholder?: string
  @Prop({ default: 1 }) rows?: number
  @Prop({ default: 'text' }) type?: 'text' | 'number' | 'float' | 'int' | 'telephone' | 'mobile'
  @Prop({ default: false }) rowModle?: boolean
  @Prop({ default: false }) noLabel?: boolean
  @Prop({ default: false }) readonly?: boolean
  @Watch('value')
  onValueChanged(val: string) {
    this.innerValue = val
  }
  public handleClickEvent() {
    const focusInput: any = this.$refs.input
    focusInput.focus()
  }
  public inputEvent() {
    if (!this.typeRegExp.test(this.innerValue)) {
      this.innerValue = this.value || ''
      return
    }
    this.$emit('input', this.innerValue)
  }
  get typeRegExp() {
    // 此处为type类型对应的正则表达式
    switch (this.type) {
      case 'text':
        return /\S?\s?/
      case 'int': // 整数
        return /^[\-\+]?[1-9]+[0-9]*$/
      case 'number': // 所有数值
        return /^[\-\+]?\d*\.?\d*$/
      case 'float': // 浮点数
        return /^[\-\+]?\d*\.\d*$/
      case 'telephone': // 手机号
        return /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
      case 'mobile': // 移动手机号
        return /^1[3456789]\d{9}$/
      default:
        return /\S?\s?/
    }
  }
}
// export default {
//   props: {
//     label: String,
//     value: {
//       type: [String, Number]
//     },
//     placeholder: { type: String, default: '' },
//     rows: { type: Number, default: 1 },
//     type: { type: String, default: 'text' }
//   },
//   data() {
//     return {
//       innerValue: ''
//     }
//   },
//   watch: {
//     value(newVal) {
//       this.innerValue = newVal
//     }
//   },
//   methods: {
//     inputEvent(event) {
//       // console.log(this.innerValue.match(this.typeRegExp))
//       // console.log(this.typeRegExp.test(this.innerValue))
//       // return
//       this.$emit('input', this.innerValue)
//     }
//   },
//   computed: {
//     typeRegExp() {
//       switch (this.type) {
//         case 'text':
//           return null
//         case 'int':
//           return /0{1,1}|^[1-9][0-9]*$/g
//         case 'number':
//           return /^0(\.[0-9]+$)?|^[1-9][0-9]*$|^[1-9][0-9]*\.[0-9]+$/
//         default:
//           return null
//       }
//     }
//   }
// }
</script>

<style scoped lang='less'>
@import './index.less';
</style>
 
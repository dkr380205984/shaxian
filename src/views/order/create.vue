<template>
  <div id="orderCreate"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">添加订单</span>
      </div>
      <div class="createCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">客户单号</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input placeholder="请输入客户单号"
                  v-model="value"></el-input>
              </div>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">下单客户</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-select placeholder="请选择下单客户"
                  v-model="value"></el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">下单日期</span>
              <span class="explanation">(必选，默认今日)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-date-picker v-model="value"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">交货日期</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-date-picker style="width:100%"
                  v-model="value"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">下单信息</span>
              <span class="explanation">(均为必填项)</span>
            </div>
            <div class="content autoHeight">
              <div class="tableCtn">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn">纱线名称</div>
                    <div class="tcolumn noPad"
                      style="flex:6">
                      <div class="trow">
                        <div class="tcolumn">纱线颜色</div>
                        <div class="tcolumn">纱线属性</div>
                        <div class="tcolumn">下单价格</div>
                        <div class="tcolumn">下单数量</div>
                        <div class="tcolumn">数量属性</div>
                        <div class="tcolumn">颜色操作</div>
                      </div>
                    </div>
                    <div class="tcolumn">纱线操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="noData">请添加至少一种纱线</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="btn btnMain">添加纱线</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">下单总数</span>
              <span class="explanation">(自动计算)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input placeholder="完善数据后计算得到"
                  v-model="value"></el-input>
              </div>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">下单总价</span>
              <span class="explanation">(自动计算)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-select placeholder="完善数据后计算得到"
                  v-model="value"></el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">备注信息</span>
            </div>
            <div class="content autoHeight">
              <div ref='editor'></div>
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
          <div class="btn btnBlue">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Editor from 'wangeditor'
import E from 'wangeditor'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    editor: any
    [propName: string]: any
  } {
    return {
      value: '',
      editor: ''
    }
  },
  mounted() {
    this.editor = new E(this.$refs.editor as HTMLElement)
    this.editor.config.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      // 'image', // 插入图片
      // 'table', // 表格
      // 'video', // 插入视频
      // 'code', // 插入代码
      'undo', // 撤销
      'redo', // 重复
      'fullscreen' // 全屏
    ]
    this.editor.config.onchange = (html: HTMLElement) => {
      this.content = html // 绑定当前逐渐地值
    }
    this.editor.create()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/order/create.less';
</style>
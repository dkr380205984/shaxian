<template>
  <div class="document GDEF">
    <!-- 出口货物报关单 ==>  goods declaration for exportation -->
    <div class="tableCtn crossWise">
      <div class="headerCtn">
        <div class="top">
          <div class="title">中华人民共和国海关出口货物报关单</div>
        </div>
        <div class="bottom">
          <div class="bottom_item">
            <document-input :rowModle="true"
              label="预录入编号：" />
          </div>
          <div class="bottom_item">
            <document-input :rowModle="true"
              label="海关编号：" />
          </div>
          <div class="bottom_item right"
            style="width:180px">
            <document-input :rowModle="true"
              label="页码/页数：" />
          </div>
        </div>
      </div>
      <div class="bodyCtn">
        <div class="rowCtn">
          <div class="rowItem">
            <document-input label="境内发货人"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input label="出镜关别"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input label="出口日期"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input label="申报日期"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input label="备案号"
              :rows="2"></document-input>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem">
            <document-input label="境外收货人"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input label="运输方式"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input label="运输工具名称及航次号"
              :rows="2"></document-input>
          </div>
          <div class="rowItem"
            style="flex:2;border-right:2px solid transparent">
            <document-input label="提运单号"
              :rows="2"></document-input>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem">
            <document-input label="生成销售单位"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input label="监管方式"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input label="免征性质"
              :rows="2"></document-input>
          </div>
          <div class="rowItem"
            style="flex:2;border-right:2px solid transparent">
            <document-input label="许可证"
              :rows="2"></document-input>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem">
            <document-input label="合同协议号"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input label="贸易国（地区）"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input label="运抵国（地区）"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input label="指运港"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input label="离境口岸"
              :rows="2"></document-input>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem">
            <document-input label="包装种类"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <div class="rowCtn noBorder">
              <div class="rowItem">
                <document-input label="件数"
                  :rows="2"></document-input>

              </div>
              <div class="rowItem">
                <document-input label="毛重（千克）"
                  :rows="2"></document-input>
              </div>
            </div>
          </div>
          <div class="rowItem">
            <div class="rowCtn noBorder">
              <div class="rowItem">
                <document-input label="净重（千克）"
                  :rows="2"></document-input>

              </div>
              <div class="rowItem">
                <document-input label="成交方式"
                  :rows="2"></document-input>
              </div>
            </div>
          </div>
          <div class="rowItem"
            style="flex:2;border-right:2px solid transparent">
            <div class="rowCtn noBorder">
              <div class="rowItem">
                <document-input label="运费"
                  :rows="2"></document-input>
              </div>
              <div class="rowItem">
                <document-input label="保费"
                  :rows="2"></document-input>
              </div>
              <div class="rowItem">
                <document-input label="杂费"
                  :rows="2"></document-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem">
            <document-input label="随附单证及编号"
              :rowModle='true' />
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem">
            <document-input label="标记喷码及备注"
              :rowModle='true' />
          </div>
        </div>
        <div class="rowCtn"
          style="font-size:18px">
          <div class="rowItem center">项目</div>
          <div class="rowItem center flex2">商品编号</div>
          <div class="rowItem center flex4">商品名称及规格型号</div>
          <div class="rowItem center flex18">数量</div>
          <div class="rowItem center">单位</div>
          <div class="rowItem center">单价</div>
          <div class="rowItem center flex18">总价</div>
          <div class="rowItem center">币制</div>
          <div class="rowItem center flex3">原产国（地区）</div>
          <div class="rowItem center flex3">最终目的国（地区）</div>
          <div class="rowItem center flex18">境内货源地</div>
          <div class="rowItem center flex18">征免</div>
        </div>
        <div class="rowCtn"
          style="font-size:18px"
          v-for="item in 5"
          :key="item">
          <div class="rowItem center"></div>
          <div class="rowItem center flex2"></div>
          <div class="rowItem center flex4"></div>
          <div class="rowItem center flex18"></div>
          <div class="rowItem center"></div>
          <div class="rowItem center"></div>
          <div class="rowItem center flex18"></div>
          <div class="rowItem center"></div>
          <div class="rowItem center flex3"></div>
          <div class="rowItem center flex3"></div>
          <div class="rowItem center flex18"></div>
          <div class="rowItem center flex18"></div>
        </div>
        <div class="rowCtn">
          <div class="rowItem noBorder flex3">
            <document-input :rowModle="true"
              label="特殊关系确认：" />
          </div>
          <div class="rowItem noBorder flex3">
            <document-input :rowModle="true"
              label="价格影响确认：" />
          </div>
          <div class="rowItem noBorder flex4">
            <document-input :rowModle="true"
              label="支付特许权使用费确认：" />
          </div>
          <div class="rowItem noBorder flex2">
            <document-input :rowModle="true"
              :readonly='true'
              label="自报自缴：" />
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem col"
            style="flex:16.6">
            <div class="rowCtn noBorder">
              <div class="rowItem noBorder">
                <document-input label="报关人员"
                  rows='2.5'></document-input>
              </div>
              <div class="rowItem noBorder">
                <document-input label="报关人员证号"
                  rows='2.5'></document-input>
              </div>
              <div class="rowItem noBorder right">
                <document-input label="电话"
                  rows='2.5'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem noBorder">
                <document-input label="申报单位"
                  rows='2.5'></document-input>
              </div>
              <div class="rowItem noBorder">
                <document-input label="申报单位（签章）"
                  rows='2.5'></document-input>
              </div>
              <div class="rowItem noBorder right"
                style="font-size:14px;align-items:flex-end;">
                兹申明对以上内容承担如实申报、依法纳税责任
              </div>
            </div>
          </div>
          <div class="rowItem"
            style="flex:6.55">
            <document-input label="海关批注及签章"></document-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import documentInput from '@/components/documentInput/index.vue'
export default Vue.extend({
  data(): {
    testInputValue: string
  } {
    return {
      testInputValue: ''
    }
  },
  methods: {
    inputEvent(value: string | number) {
      console.log(`out:${value}`)
    }
  },
  components: {
    documentInput
  }
})
</script>

<style scoped lang='less'>
@import '~@/assets/less/documents/GDFE.less';
</style>
 
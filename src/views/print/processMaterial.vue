<template>
  <div id='processMaterial'
    class='printHtml'>
    <div class="printTable">
      <div class="print_head">
        <div class="left titleCenter">
          <span class="title">{{companyName}}</span>
          <span class="title">委托纱线加工合同与加工工艺单</span>
          <span>单号：{{detail.code}}</span>
        </div>
        <div class="left"></div>
        <!-- <div class="right">
          <span class="qrCode_box">
            <img :src="qrCodeUrl || require('@/assets/image/noPic.jpg')"
              alt="">
          </span>
        </div> -->
      </div>
      <ul class="print_body"
        style="border:none">
        <li class="line_item">
          <div class="first_title">一、原料供应及生产数量</div>
          <div class="content">
            按一下原料配比生产
            <span class="bold">{{detail.weight}}吨</span>
            颜色一定要与
            <span class="bold">{{detail.date}}</span>
            日你公司所发相同，投料后搓一绞对色。
          </div>
          <div class="content">{{detail.desc}}</div>
        </li>
        <li class="line_item">
          <div class="first_title">二、原料配比及要求：混条比例准确、混条均匀</div>
          <div class="content flexModle">
            <div class="fromCtn"
              v-for="(itemMa,indexMa) in detail.material_info"
              :key="indexMa">
              <div class="itemCtn w50">{{itemMa.material_name}}</div>
              <div class="itemCtn w20">{{`${itemMa.proportion1}%~${itemMa.proportion2}%`}}</div>
              <div class="itemCtn w30 center">{{(itemMa.weight && `${itemMa.weight}KG`) || ''}}</div>
            </div>
          </div>
        </li>
        <li class="line_item">
          <div class="first_title">三、质量要求</div>
          <div class="content">{{detail.mass_demand || '暂无'}}</div>
        </li>
        <li class="line_item">
          <div class="first_title">四、生产工艺</div>
          <div class="content flexModle">
            <div class="fromCtn col I2_5">
              <div class="fromColCtn">
                <div class="itemCtn w30 center">实纺支数</div>
                <div class="itemCtn w70">{{(detail.shifangzhishu && `${detail.shifangzhishu}支`) || '' }}</div>
              </div>
              <div class="fromColCtn">
                <div class="itemCtn w30 center">双纱捻度</div>
                <div class="itemCtn w50">{{(detail.shuangshaniandu && `${detail.shuangshaniandu}个/m`) || '' }}</div>
                <div class="itemCtn w20 center">{{detail.shuangsha_deviation_desc}}</div>
              </div>
            </div>
            <div class="fromCtn col I2_5">
              <div class="fromColCtn">
                <div class="itemCtn w30 center">单纱捻度</div>
                <div class="itemCtn w50">{{(detail.danshaniandu && `${detail.danshaniandu}个/m`) || '' }}</div>
                <div class="itemCtn w20 center">{{detail.dansha_deviation_desc}}</div>
              </div>
              <div class="fromColCtn">
                <div class="itemCtn w30 center">框长</div>
                <div class="itemCtn w50">{{(detail.kuangchang && `${detail.kuangchang}个/m`) || '暂无'}}</div>
                <div class="itemCtn w20 center">{{detail.kuangchang_desc}}</div>
              </div>
            </div>
          </div>
        </li>
        <li class="line_item">
          <div class="first_title">五、摇绞与打包：</div>
          <div class="content">
            每绞
            <span class="bold">{{detail.meijiao}}克</span>
            ；三道八字结。10绞为一把，10把为一捆，4捆为一件。
          </div>
          <div class="content">
            每件确保400绞和净重
            <span class="bold">{{detail.yaojiao_net_weight}}克</span>
            ；毛重在
            <span class="bold">{{detail.yaojiao_gross_weight}}克</span>
            以上，机包六道标准件。
          </div>
        </li>
        <li class="line_item">
          <div class="first_title">六、筒纱与打包：</div>
          <div class="content">
            用新编织袋包装，每包15个筒子，袋口扎紧扎牢，纱要留尾巴。每包净重
            <span class="bold">{{detail.tongsha_net_weight}}KG</span>
            ；毛重在
            <span class="bold">{{detail.yaojiao_net_weight}}KG</span>
            以上。
          </div>
        </li>
        <li class="line_item">
          <div class="first_title">七、包装书写：</div>
          <div class="content">送货单上的书写必须与包装上的书写一致。</div>
          <div class="content"><span class="bold">{{detail.pack_desc}}</span></div>
        </li>
        <li class="line_item">
          <div class="first_title">八、制成率与加工费</div>
          <div class="content flexModle">
            <div class="fromCtn">
              <div class="itemCtn w30 center">制成率</div>
              <div class="itemCtn w50">{{(detail.complete_rate && `${detail.complete_rate}%`) || '暂无'}}</div>
              <div class="itemCtn w20">{{detail.complete_rate_desc}}</div>
            </div>
            <div class="fromCtn">
              <div class="itemCtn w30 center">加工费净重含税</div>
              <div class="itemCtn w50">{{(detail.process_fee && `${detail.process_fee}%`) || '暂无'}}</div>
              <div class="itemCtn w20">{{detail.process_fee_desc}}</div>
            </div>
          </div>
        </li>
        <li class="line_item">
          <div class="first_title">九、交货期限</div>
          <div class="content">
            <span class="bold">{{detail.delivery_time}}</span>
            {{detail.delivery_desc}}
          </div>
        </li>
        <li class="line_item">
          <div class="first_title">十、违约责任</div>
          <div class="content">承揽加工方如逾期交货和委托方逾期支付货款，违约方应按月息1%利率向守约方支付滞纳金，并承担合同金额5%违约金。如发生纠纷，双方尽量协商
            解决，协商不成，按（合同法）规定，向本合同签订所在地人民法院诉讼处理。</div>
        </li>
        <li class="line_item">
          <div class="first_title">十一、质量负责条件</div>
          <div class="content">委托方收到货物后发现质量问题应向承揽方提出，造成损失应由承揽方负责赔偿。</div>
        </li>
        <li class="line_item">
          <div class="first_title">十二、特别注意</div>
          <div class="content">
            <span class="bold">{{detail.special_desc}}</span>
          </div>
        </li>
        <li class="line_item"
          style="margin-top:36px">
          <div class="left">
            <div class="content"
              style="margin-bottom:36px">委托加工方：</div>
            <div class="content">法定代表人：</div>
            <div class="content">委托代理人：</div>
            <div class="content">开户银行：</div>
            <div class="content">账号：</div>
            <div class="content">电话：</div>
            <div class="content">地址：</div>
            <div class="content"
              style="margin-top:24px">签订地点：</div>
          </div>
          <div class="right">
            <div class="content"
              style="margin-bottom:36px">承揽加工方：</div>
            <div class="content">法定代表人：</div>
            <div class="content">委托代理人：</div>
            <div class="content">开户银行：</div>
            <div class="content">账号：</div>
            <div class="content">电话：</div>
            <div class="content">地址：</div>
            <div class="content"
              style="margin-top:24px">签约时间：</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang='ts'>
import { craft } from '@/assets/js/api'
import { printList } from '@/assets/js/settingCommon'
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      companyName: '',
      qrCodeUrl: '',
      detail: {}
    }
  },
  methods: {},
  created() {
    Promise.all([
      craft.detail({
        id: this.$route.params.documentId
      }),
      printList(undefined, 6)
    ]).then((res) => {
      this.detail = res[0].data.data
      this.companyName = (res[1] as any).title
    })
  },
  mounted() {
    const QRCode = require('qrcode')
    QRCode.toDataURL(
      window.location.origin + '/material/craftDetail/' + this.$route.params.documentId,
      { errorCorrectionLevel: 'H' },
      (err: any, url: string) => {
        if (!err) {
          this.qrCodeUrl = url
        }
      }
    )
  }
})
</script>

<style scoped lang='less'>
@import '~@/assets/less/print/processMaterial.less';
</style>
 
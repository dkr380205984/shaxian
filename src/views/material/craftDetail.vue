<template>
  <div id="craftDetail"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">工艺单详情</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">工艺单号：</span>
            <span class="text">{{craft_info.code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">加工单位：</span>
            <span class="text">{{craft_info.client_name}}</span>
          </div>
          <div class="colCtn">
            <span class="label">合计费用：</span>
            <span class="text">{{craft_info.client_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">下单日期：</span>
            <span class="text">{{craft_info.order_time}}</span>
          </div>
          <div class="colCtn">
            <span class="label">交货日期：</span>
            <span class="text">{{craft_info.delivery_time}}</span>
          </div>
          <div class="colCtn">
            <span class="label">创建人：</span>
            <span class="text">{{craft_info.user_name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">纱线入库信息</span>
        <span class="addBtn btn btnMain"
          @click="yarn_in_flag = true">点击入库</span>
      </div>
      <div class="tableCtn"
        style="margin:20px 32px 0 32px">
        <div class="thead">
          <div class="trow">
            <div class="tcolumn">纺纱名称</div>
            <div class="tcolumn">颜色/属性</div>
            <div class="tcolumn">计划数量</div>
            <div class="tcolumn">已入库数量</div>
            <div class="tcolumn">待入库数量</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow">
            <div class="tcolumn">{{craft_info.yarn_name}}</div>
            <div class="tcolumn">{{craft_info.color}}/{{craft_info.attribute}}</div>
            <div class="tcolumn blue">{{craft_info.weight}}</div>
            <div class="tcolumn green">已入库数量</div>
            <div class="tcolumn orange">待入库数量</div>
          </div>
        </div>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column min120">入库单号</div>
              <div class="column min120">入库日期</div>
              <div class="column min120">入库数量</div>
              <div class="column min120">色号</div>
              <div class="column min120">批/缸号</div>
              <div class="column min120">备注信息</div>
              <div class="column min120">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row">
              <div class="column min120">入库单号</div>
              <div class="column min120">入库日期</div>
              <div class="column min120">入库数量</div>
              <div class="column min120">色号</div>
              <div class="column min120">批/缸号</div>
              <div class="column min120">备注信息</div>
              <div class="column min120">操作</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">毛条出库信息</span>
        <span class="addBtn btn btnMain">点击出库</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">工艺信息</span>
      </div>
      <div class="createCtn">
        <div class="rowCtn blockCtn">
          <div class="titleLine">一、原料供应及生产数量</div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="inputLine">
            <span class="text">按以下原料配比生产</span>
            <span class="blue">{{craft_info.weight}}吨</span>
            <span class="text">，颜色一定要与</span>
            <span class="blue">{{craft_info.date}}</span>
            <span class="text">日你公司所发相同，投料后搓一绞对色。</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="inputLine">
            <span class="text">{{craft_info.desc}}</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">二、原料配比及要求：混条比例准确、混条均匀</div>
        </div>
        <div class="rowCtn overflow">
          <div class="inputLine"
            v-for="(item,index) in craft_info.material_info"
            :key="index">
            <span class="text">毛条名称：</span>
            <span class="blue">{{item.material_name}}</span>
            <span class="text">比例：</span>
            <span class="text">{{item.proportion1}}%~{{item.proportion2}}%</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">三、质量要求</div>
        </div>
        <div class="rowCtn">
          <div class="inputLine">
            <span class="text">{{craft_info.mass_demand||'暂无'}}</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">四、生产工艺</div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex2">
            <div class="inputLine">
              <span class="text">实纺支数：</span>
              <span class="blue">{{craft_info.shifangzhishu||'暂无'}}支</span>
            </div>
          </div>
          <div class="colCtn flex2">
            <div class="inputLine">
              <span class="text">单纱捻度：</span>
              <span class="blue">{{craft_info.danshaniandu||'暂无'}}个/m</span>
              <span class="text">{{craft_info.dansha_deviation_desc}}</span>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex2">
            <div class="inputLine">
              <span class="text">双纱捻度：</span>
              <span class="blue">{{craft_info.shuangshaniandu||'暂无'}}个/m</span>
              <span class="text">{{craft_info.shuangsha_deviation_desc}}</span>
            </div>
          </div>
          <div class="colCtn flex2">
            <div class="inputLine">
              <span class="text">框 长：</span>
              <span class="blue">{{craft_info.kuangchang||'暂无'}}个/m</span>
              <span class="text">{{craft_info.kuangchang_desc}}</span>
            </div>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">五、摇绞与打包</div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="inputLine">
            <span class="text">每绞</span>
            <span class="blue">{{craft_info.meijiao}}克</span>
            <span class="text">；三道八字结。10绞为一把，10把为一捆，4捆为一件。</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="inputLine">
            <span class="text">每件确保400绞和净重</span>
            <span class="blue">{{craft_info.yaojiao_net_weight}}克</span>
            <span class="text">；毛重在</span>
            <span class="blue">{{craft_info.yaojiao_gross_weight}}克</span>
            <span class="text">以上，机包六道标准件。</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">六、筒纱与打包</div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="inputLine">
            <span class="text">用新编织袋包装，每包15个筒子，袋口扎紧扎牢，纱要留尾巴。每包净重</span>
            <span class="blue">{{craft_info.tongsha_net_weight}}kg</span>
            <span class="text">；毛重在</span>
            <span class="blue">{{craft_info.tongsha_gross_weight}}kg</span>
            <span class="text">以上。</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">七、包装书写：</div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">送货单上的书写必须与包装上的书写一致。</span>
            </div>
            <div class="content">
              <div class="inputLine">
                <span class="text">{{craft_info.pack_desc}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">八、制成率与加工费</div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex2">
            <div class="inputLine">
              <span class="text">制成率：</span>
              <span class="blue">{{craft_info.complete_rate||'暂无'}}%</span>
              <span class="text">{{craft_info.complete_rate_desc}}</span>
            </div>
          </div>
          <div class="colCtn flex2">
            <div class="inputLine">
              <span class="text">加工费净重含税：</span>
              <span class="blue">{{craft_info.process_fee||'暂无'}}%</span>
              <span class="text">{{craft_info.process_fee_desc}}</span>
            </div>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">九、交货期限</div>
        </div>
        <div class="rowCtn">
          <div class="inputLine">
            <span class="blue">{{craft_info.delivery_time}}</span>
            <span class="text">{{craft_info.delivery_desc}}</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">十、违约责任</div>
        </div>
        <div class="rowCtn">
          <div class="inputLine">
            <span class="text">承揽加工方如逾期交货和委托方逾期支付货款，违约方应按月息1%利率向守约方支付滞纳金，并承担合同金额5%违约金。如发生纠纷，双方尽量协商 解决，协商不成，按（合同法）规定，向本合同签订所在地人民法院诉讼处理。</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">十一、质量负责条件</div>
        </div>
        <div class="rowCtn">
          <div class="inputLine">
            <span class="text">委托方收到货物后发现质量问题应向承揽方提出，造成损失应由承揽方负责赔偿。</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">十二、特别注意</div>
        </div>
        <div class="rowCtn">
          <div class="inputLine">
            <span class="blue">{{craft_info.special_desc}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="yarn_in_flag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">纱线入库</span>
          <i class="close_icon el-icon-close"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">纱线名称：</div>
            <div class="info">
              <el-input disabled
                placeholder="请选择纱线"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">加工色号：</div>
            <div class="info">
              <el-input placeholder="请输入加工色号"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">批/缸号：</div>
            <div class="info">
              <el-input placeholder="请输入批/缸号"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">入库件数：</div>
            <div class="info">
              <el-input placeholder="请输入入库件数">
                <template slot="append">件</template>
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">入库数量：</div>
            <div class="info">
              <el-input placeholder="请输入入库数量">
                <template slot="append">kg</template>
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">入库仓库：</div>
            <div class="info">
              <el-select placeholder="请选择入库仓库"></el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">入库时间：</div>
            <div class="info">
              <el-date-picker style="width:100%"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择入库时间">
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <el-input placeholder="请输入备注信息">
              </el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr blue">确认</div>
          <div class="opr">取消</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="$openUrl(`/print/processMaterial/${$route.params.id}`)">打印</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { craft } from '@/assets/js/api'
import { CraftInfo } from '@/types/material'
export default Vue.extend({
  data(): {
    craft_info: CraftInfo
    [propName: string]: any
  } {
    return {
      yarn_in_flag: false,
      craft_info: {
        code: '',
        is_draft: 1,
        client_id: '',
        order_time: '',
        yarn_id: '',
        color: '',
        attribute: '',
        weight: '',
        date: '', // 原料供应日期
        desc: '', // 原料供应说明
        mass_demand: '', // 质量要求
        shifangzhishu: '', // 实纺支数
        danshaniandu: '', // 单绞捻度
        dansha_deviation_desc: '', // 单绞捻度备注
        shuangshaniandu: '', // 双绞捻度
        shuangsha_deviation_desc: '', // 双绞捻度备注
        kuangchang: '', // 框长
        kuangchang_desc: '', // 框长备注
        meijiao: '', // 每绞克重
        yaojiao_net_weight: '', // 摇纱净重
        yaojiao_gross_weight: '', // 摇纱毛重
        tongsha_net_weight: '', // 筒纱净重
        tongsha_gross_weight: '', // 筒纱毛重
        pack_desc: '', // 包装备注
        complete_rate: '', // 支撑率
        complete_rate_desc: '', // 支撑率备注
        process_fee: '', // 加工费
        process_fee_desc: '', // 加工费备注
        delivery_time: '', // 交货时间
        delivery_desc: '', // 交货备注
        special_desc: '', // 特别备注
        material_info: [
          {
            material_type_id: '',
            material_id: [],
            proportion1: '',
            proportion2: ''
          }
        ]
      }
    }
  },
  mounted() {
    craft
      .detail({
        id: this.$route.params.id
      })
      .then((res) => {
        this.craft_info = res.data.data
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/material/craftDetail.less';
</style>
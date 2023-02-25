<template>
  <div id="craftDetail" class="indexMain" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">工艺单详情</span>
      </div>
      <div class="detailCtn">
        <div class="checkCtn">
          <el-tooltip class="item" effect="dark" content="点击查看审核日志" placement="bottom">
            <img @click="checkReason" :src="craft_info.is_check | checkFilter" />
          </el-tooltip>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">工艺单号：</span>
            <span class="text">{{ craft_info.code }}</span>
          </div>
          <div class="colCtn">
            <span class="label">加工单位：</span>
            <span class="text">{{ craft_info.client_name }}</span>
          </div>
          <div class="colCtn">
            <span class="label">合计费用：</span>
            <span class="text">{{ craft_info.client_name }}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">下单日期：</span>
            <span class="text">{{ craft_info.order_time }}</span>
          </div>
          <div class="colCtn">
            <span class="label">交货日期：</span>
            <span class="text">{{ craft_info.delivery_time }}</span>
          </div>
          <div class="colCtn">
            <span class="label">创建人：</span>
            <span class="text">{{ craft_info.user_name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">毛条库存调取</span>
      </div>
      <div class="tableCtn" style="margin:20px 32px 0 32px">
        <div class="thead">
          <div class="trow">
            <div class="tcolumn">毛条名称</div>
            <div class="tcolumn">计划数量</div>
            <div class="tcolumn">已出库数量</div>
            <div class="tcolumn">操作</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow" v-for="(item, index) in craft_info.material_info" :key="index">
            <div class="tcolumn">{{ item.material_name }}</div>
            <div class="tcolumn blue">
              {{ item.proportion1 * craft_info.weight * 10 }}~{{ item.proportion2 * craft_info.weight * 10 }}kg</div>
            <div class="tcolumn green">{{ item.push_weight }}kg</div>
            <div class="tcolumn">
              <div class="opr orange" @click="openMaterialOut(item)">调取出库</div>
            </div>
          </div>
        </div>
      </div>
      <div class="listCtn">
        <div class="list" v-show="store_material_list.length > 0">
          <div class="headCtn">
            <div class="row">
              <div class="column min120">出库单号</div>
              <div class="column min120">出库日期</div>
              <div class="column min120">毛条名称</div>
              <div class="column min120">出库数量</div>
              <div class="column min120">出库件数</div>
              <div class="column min120">备注信息</div>
              <div class="column min120">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row" v-for="item in store_material_list" :key="item.id">
              <div class="column min120">{{ item.code }}</div>
              <div class="column min120">{{ item.complete_time }}</div>
              <div class="column min120">{{ item.child_data[0].name }}</div>
              <div class="column min120">{{ item.child_data[0].action_weight }}kg</div>
              <div class="column min120">{{ item.child_data[0].item }}件</div>
              <div class="column min120">{{ item.desc }}</div>
              <div class="column min120">
                <span class="opr red">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">纱线入库信息</span>
      </div>
      <div class="tableCtn" style="margin:20px 32px 0 32px">
        <div class="thead">
          <div class="trow">
            <div class="tcolumn">纺纱名称</div>
            <div class="tcolumn">颜色/属性</div>
            <div class="tcolumn">计划数量</div>
            <div class="tcolumn">已入库数量</div>
            <div class="tcolumn">操作</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow">
            <div class="tcolumn">{{ craft_info.yarn_name }}</div>
            <div class="tcolumn">{{ craft_info.color }}/{{ craft_info.attribute }}</div>
            <div class="tcolumn blue">{{ craft_info.weight * 1000 }}kg</div>
            <div class="tcolumn green">{{ craft_info.push_weight }}kg</div>
            <div class="tcolumn">
              <div class="opr orange" @click="yarn_in_flag = true">纺纱入库</div>
            </div>
          </div>
        </div>
      </div>
      <div class="listCtn">
        <div class="list" v-show="store_yarn_list.length > 0">
          <div class="headCtn">
            <div class="row">
              <div class="column min120">入库单号</div>
              <div class="column min120">入库日期</div>
              <div class="column min120">入库数量</div>
              <div class="column min120">入库件数</div>
              <div class="column min120">批号</div>
              <div class="column min120">色号</div>
              <div class="column min120">缸号</div>
              <div class="column min120">备注信息</div>
              <div class="column min120">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row" v-for="item in store_yarn_list" :key="item.id">
              <div class="column min120">{{ item.code }}</div>
              <div class="column min120">{{ item.complete_time }}</div>
              <div class="column min120">{{ item.child_data[0].action_weight }}kg</div>
              <div class="column min120">{{ item.child_data[0].item }}件</div>
              <div class="column min120">{{ item.child_data[0].batch_code }}</div>
              <div class="column min120">{{ item.child_data[0].color_code }}</div>
              <div class="column min120">{{ item.child_data[0].vat_code }}</div>
              <div class="column min120">{{ item.desc || '无' }}</div>
              <div class="column min120">
                <span class="opr red">删除</span>
              </div>
            </div>
          </div>
        </div>
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
            <span class="blue">{{ craft_info.weight }}吨</span>
            <span class="text">，颜色一定要与</span>
            <span class="blue">{{ craft_info.date }}</span>
            <span class="text">日你公司所发相同，投料后搓一绞对色。</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="inputLine">
            <span class="text">{{ craft_info.desc }}</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">二、原料配比及要求：混条比例准确、混条均匀</div>
        </div>
        <div class="rowCtn overflow">
          <div class="inputLine" v-for="(item, index) in craft_info.material_info" :key="index">
            <span class="text">毛条名称：</span>
            <span class="blue">{{ item.material_name }}</span>
            <span class="text">比例：</span>
            <span class="text">{{ item.proportion1 }}%~{{ item.proportion2 }}%</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">三、质量要求</div>
        </div>
        <div class="rowCtn">
          <div class="inputLine">
            <span class="text">{{ craft_info.mass_demand || '暂无' }}</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">四、生产工艺</div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex2">
            <div class="inputLine">
              <span class="text">实纺支数：</span>
              <span class="blue">{{ craft_info.shifangzhishu || '暂无' }}支</span>
            </div>
          </div>
          <div class="colCtn flex2">
            <div class="inputLine">
              <span class="text">单纱捻度：</span>
              <span class="blue">{{ craft_info.danshaniandu || '暂无' }}个/m</span>
              <span class="text">{{ craft_info.dansha_deviation_desc }}</span>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex2">
            <div class="inputLine">
              <span class="text">双纱捻度：</span>
              <span class="blue">{{ craft_info.shuangshaniandu || '暂无' }}个/m</span>
              <span class="text">{{ craft_info.shuangsha_deviation_desc }}</span>
            </div>
          </div>
          <div class="colCtn flex2">
            <div class="inputLine">
              <span class="text">框 长：</span>
              <span class="blue">{{ craft_info.kuangchang || '暂无' }}个/m</span>
              <span class="text">{{ craft_info.kuangchang_desc }}</span>
            </div>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">五、摇绞与打包</div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="inputLine">
            <span class="text">每绞</span>
            <span class="blue">{{ craft_info.meijiao }}克</span>
            <span class="text">；三道八字结。10绞为一把，10把为一捆，4捆为一件。</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="inputLine">
            <span class="text">每件确保400绞和净重</span>
            <span class="blue">{{ craft_info.yaojiao_net_weight }}克</span>
            <span class="text">；毛重在</span>
            <span class="blue">{{ craft_info.yaojiao_gross_weight }}克</span>
            <span class="text">以上，机包六道标准件。</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">六、筒纱与打包</div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="inputLine">
            <span class="text">用新编织袋包装，每包15个筒子，袋口扎紧扎牢，纱要留尾巴。每包净重</span>
            <span class="blue">{{ craft_info.tongsha_net_weight }}kg</span>
            <span class="text">；毛重在</span>
            <span class="blue">{{ craft_info.tongsha_gross_weight }}kg</span>
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
                <span class="text">{{ craft_info.pack_desc }}</span>
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
              <span class="blue">{{ craft_info.complete_rate || '暂无' }}%</span>
              <span class="text">{{ craft_info.complete_rate_desc }}</span>
            </div>
          </div>
          <div class="colCtn flex2">
            <div class="inputLine">
              <span class="text">加工费净重含税：</span>
              <span class="blue">{{ craft_info.process_fee || '暂无' }}%</span>
              <span class="text">{{ craft_info.process_fee_desc }}</span>
            </div>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">九、交货期限</div>
        </div>
        <div class="rowCtn">
          <div class="inputLine">
            <span class="blue">{{ craft_info.delivery_time }}</span>
            <span class="text">{{ craft_info.delivery_desc }}</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">十、违约责任</div>
        </div>
        <div class="rowCtn">
          <div class="inputLine">
            <span class="text">承揽加工方如逾期交货和委托方逾期支付货款，违约方应按月息1%利率向守约方支付滞纳金，并承担合同金额5%违约金。如发生纠纷，双方尽量协商
              解决，协商不成，按（合同法）规定，向本合同签订所在地人民法院诉讼处理。</span>
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
            <span class="blue">{{ craft_info.special_desc }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="popup" v-show="yarn_in_flag">
      <div class="main" style="width: 1000px">
        <div class="titleCtn">
          <span class="text">纱线入库</span>
          <i class="close_icon el-icon-close" @click="yarn_in_flag = false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">纱线名称：</div>
            <div class="info">
              <el-input disabled placeholder="请选择纱线" v-model="store_yarn_info.child_data[0].name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">纱线颜色：</div>
            <div class="info">
              <el-input disabled placeholder="请选择纱线" v-model="store_yarn_info.child_data[0].color"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">批号/色号：</div>
            <div class="info">
              <el-input placeholder="请输入批号" v-model="store_yarn_info.child_data[0].batch_code"></el-input>

            </div>
            <div class="info" style="margin-left: 8px">
              <el-input placeholder="请输入色号" v-model="store_yarn_info.child_data[0].color_code"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust" style="width: 8em">入库数量/件数：</div>
            <div class="info">
              <el-input placeholder="请输入入库数量" v-model="store_yarn_info.child_data[0].action_weight">
                <template slot="append">kg</template>
              </el-input>
            </div>
            <div class="info" style="margin-left: 8px">
              <el-input placeholder="请输入入库件数" v-model="store_yarn_info.child_data[0].item">
                <template slot="append">件</template>
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">入库仓库：</div>
            <div class="info">
              <el-cascader v-model="store_yarn_info.select_id" :options="store_list"
                :props="{ value: 'id', label: 'name', children: 'second_data' }" placeholder="请选择入库仓库">
              </el-cascader>
            </div>
          </div>
          <div class="row">
            <div class="label">入库时间：</div>
            <div class="info">
              <el-date-picker style="width:100%" type="date" value-format="yyyy-MM-dd" placeholder="选择入库时间"
                v-model="store_yarn_info.complete_time">
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <el-input placeholder="请输入备注信息" v-model="store_yarn_info.desc">
              </el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr" @click="yarn_in_flag = false">取消</div>
          <div class="opr blue" @click="saveYarnIn">确认</div>
        </div>
      </div>
    </div>
    <div class="popup" v-show="material_out_flag">
      <div class="main"  style="width: 1000px">
        <div class="titleCtn">
          <span class="text">毛条出库</span>
          <i class="close_icon el-icon-close" @click="material_out_flag = false"></i>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">毛条名称：</div>
            <div class="info">
              <el-input disabled placeholder="请选择毛条" v-model="store_material_info.child_data[0].name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">毛条属性：</div>
            <div class="info">
              <el-input disabled placeholder="请选择毛条属性" v-model="store_material_info.child_data[0].attribute"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">毛条批号：</div>
            <div class="info">
              <el-input disabled placeholder="请填写毛条批号" v-model="store_material_info.child_data[0].batch_code"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">出库数量：</div>
            <div class="info">
              <el-input placeholder="请输入出库数量" v-model="store_material_info.child_data[0].action_weight">
                <template slot="append">kg</template>
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">出库件数：</div>
            <div class="info">
              <el-input placeholder="请输入出库件数" v-model="store_material_info.child_data[0].item">
                <template slot="append">件</template>
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">来源仓库：</div>
            <div class="info">
              <el-cascader v-model="store_material_info.select_id" :options="materail_store_list"
                :props="{ value: 'id', label: 'name', children: 'second_data' }" placeholder="请选择来源仓库">
              </el-cascader>
            </div>
          </div>
          <div class="row">
            <div class="label">出库时间：</div>
            <div class="info">
              <el-date-picker style="width:100%" type="date" value-format="yyyy-MM-dd" placeholder="选择出库时间"
                v-model="store_material_info.complete_time">
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <el-input placeholder="请输入备注信息" v-model="store_material_info.desc">
              </el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr blue" @click="saveMaterialOut">确认</div>
          <div class="opr" @click="material_out_flag = false">取消</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray" @click="$router.go(-1)">返回</div>
          <div class="btnCtn">
            <div class="buttonList" style="margin-left: 12px" v-if="order_info.status !== 4">
              <div class="showButton">
                <i class="el-icon-s-grid"></i>
                <span class="text">工艺单操作</span>
              </div>
              <div class="otherInfoCtn">
                <div class="otherInfo">
                  <div class="button btnOrange" @click="$openUrl(`/print/processMaterial/${$route.params.id}`)">
                    <i class="el-icon-printer"></i>
                    <span class="text">单据打印</span>
                  </div>
                  <div class="button btnOrange" v-if="craft_info.status === 1" @click="$openUrl(`/print/processMaterial/${$route.params.id}`)">
                    <i class="el-icon-edit"></i>
                    <span class="text">单据修改</span>
                  </div>
                  <div class="button btnGreen" @click="openCheck">
                    <i class="iconfont">&#xe638;</i>
                    <span class="text">单据审核</span>
                  </div>
                  <div class="button btnBlue" @click="confirm" v-if="craft_info.status !== 3">
                    <i class="iconfont">&#xe636;</i>
                    <span class="text">确认完成</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <check :show.sync="check_flag" :pid="$route.params.id" @afterCheck="init" :checkType="4" :checkList="[{
      value: '费用问题',
      label: '费用问题'
    }, {
      value: '质量问题',
      label: '质量问题'
    }, {
      value: '产品问题',
      label: '产品问题'
    }, {
      value: '交期问题',
      label: '交期问题'
    }, {
      value: '数量问题',
      label: '数量问题'
    }]"></check>
    <check-detail :show.sync="check_detail_flag" :checkType="4" :pid="$route.params.id"></check-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { craft, stock, check } from '@/assets/js/api'
import { CraftInfo } from '@/types/material'
import { StoreCreate } from '@/types/store'
export default Vue.extend({
  data(): {
    craft_info: CraftInfo
    store_material_info: StoreCreate
    store_yarn_info: StoreCreate
    [propName: string]: any
  } {
    return {
      loading: true,
      yarn_in_flag: false,
      material_out_flag: false,
      check_detail_flag: false,
      check_flag: false,
      order_info: {},
      store_yarn_info: {
        id: '',
        client_id: '',
        related_id: this.$route.params.id,
        select_id: [],
        action_type: 9,
        store_id: '',
        second_store_id: '',
        complete_time: this.$getDate(new Date()),
        desc: '',
        child_data: [
          {
            name: '',
            action_weight: '',
            color: '',
            attribute: '',
            batch_code: '',
            color_code: '',
            vat_code: '',
            item: '',
            desc: ''
          }
        ]
      },
      store_material_info: {
        id: '',
        client_id: '',
        related_id: this.$route.params.id,
        select_id: [],
        action_type: 6,
        store_id: '',
        second_store_id: '',
        complete_time: this.$getDate(new Date()),
        desc: '',
        child_data: [
          {
            name: '',
            action_weight: '',
            item: '',
            desc: ''
          }
        ]
      },
      store_yarn_list: [],
      store_material_list: [],
      craft_info: {
        push_weight: '',
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
  computed: {
    store_list() {
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 1)
    },
    materail_store_list() {
      return this.$store.state.api.storeHouse.arr.filter((item: any) => item.store_type === 2)
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        craft.detail({
          id: this.$route.params.id
        }),
        stock.list({
          related_id: this.$route.params.id,
          action_type: [9]
        }),
        stock.materialList({
          related_id: this.$route.params.id,
          action_type: 6
        })
      ]).then((res) => {
        this.craft_info = res[0].data.data
        this.store_yarn_info = {
          id: '',
          client_id: this.craft_info.client_id,
          related_id: this.$route.params.id,
          select_id: [],
          action_type: 9,
          store_id: '',
          second_store_id: '',
          complete_time: this.$getDate(new Date()),
          desc: '',
          child_data: [
            {
              name: this.craft_info.yarn_name as string,
              action_weight: '',
              color: this.craft_info.color,
              attribute: this.craft_info.attribute,
              batch_code: '',
              color_code: '',
              vat_code: '',
              item: '',
              desc: ''
            }
          ]
        }
        this.store_yarn_list = res[1].data.data.items
        this.craft_info.push_weight = this.store_yarn_list.reduce((total: number, current: any) => {
          return total + Number(current.child_data[0].action_weight)
        }, 0)
        this.store_material_list = res[2].data.data.items
        this.craft_info.material_info.forEach((item: any) => {
          item.push_weight = this.store_material_list
            .filter((itemChild: any) => itemChild.child_data[0].name === item.material_name)
            .reduce((total: number, current: any) => {
              return total + Number(current.child_data[0].action_weight)
            }, 0)
        })

        this.loading = false
      })
    },
    saveYarnIn() {
      if (!this.store_yarn_info.select_id) {
        this.$message.error('请选择入库仓库')
        return
      }
      if (!this.store_yarn_info.child_data[0].action_weight) {
        this.$message.error('请输入入库数量')
        return
      }
      this.store_yarn_info.child_data[0].color_code = this.store_yarn_info.child_data[0].color_code
        ? this.store_yarn_info.child_data[0].color_code
        : ''
      this.store_yarn_info.child_data[0].batch_code = this.store_yarn_info.child_data[0].batch_code
        ? this.store_yarn_info.child_data[0].batch_code
        : ''
      this.store_yarn_info.child_data[0].vat_code = this.store_yarn_info.child_data[0].vat_code
        ? this.store_yarn_info.child_data[0].vat_code
        : ''
      this.store_yarn_info.store_id = (this.store_yarn_info.select_id as number[])[0]
      this.store_yarn_info.second_store_id = (this.store_yarn_info.select_id as number[])[1]
      stock.create({ data: [this.store_yarn_info] }).then((res) => {
        if (res.data.status) {
          this.$message.success('入库成功')
          this.yarn_in_flag = false
          this.init()
        }
      })
    },
    saveMaterialOut() {
      if (!this.store_material_info.select_id) {
        this.$message.error('请选择来源仓库')
        return
      }
      if (!this.store_material_info.child_data[0].action_weight) {
        this.$message.error('请输入出库数量')
        return
      }
      this.store_material_info.store_id = (this.store_material_info.select_id as number[])[0]
      this.store_material_info.second_store_id = (this.store_material_info.select_id as number[])[1]
      stock.materialCreate({ data: [this.store_material_info] }).then((res) => {
        if (res.data.status) {
          this.$message.success('出库成功')
          this.material_out_flag = false
          this.init()
        }
      })
    },
    openMaterialOut(info: any) {
      this.store_material_info.child_data[0].name = info.material_name
      this.material_out_flag = true
    },
    openCheck() {
      this.check_flag = true
    },
    checkReason() {
      if (this.order_info.is_check === 0 || !this.order_info.is_check) {
        this.$message.warning('暂无审核信息')
        return
      }
      this.check_detail_flag = true
    },
    confirm() {
      this.$confirm('是否确认工艺单完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          check
            .confirm({
              pid: this.$route.params.id,
              complete_type: 4
            })
            .then((res) => {
              if (res.data.status) {
                this.init()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/storeHouse',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getStoreAsync'
      }
    ])
    this.init()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/material/craftDetail.less';
</style>
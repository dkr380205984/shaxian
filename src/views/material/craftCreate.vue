<template>
  <div id="craftCreate"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">添加工艺单</span>
      </div>
      <div class="createCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">纺纱加工单位</span>
              <span class="explanation">(必选)
                <el-tooltip class="item" effect="dark" content="设置成功后请点击此按钮刷新数据" placement="top">
                  <i
                    class="el-icon-refresh hoverGreen"
                    style="line-height: 46px; font-size: 18px; margin-left: 8px; cursor: pointer"
                    @click="
                      $checkCommonInfo([
                        {
                          checkWhich: 'api/client',
                          getInfoMethed: 'dispatch',
                          getInfoApi: 'getPartyBAsync',
                          forceUpdate: true
                        }
                      ])
                    "
                  ></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="添加客户" placement="top">
                  <i
                    class="el-icon-upload hoverOrange"
                    style="line-height: 38px; font-size: 18px; cursor: pointer; margin-left: 8px"
                    @click="$openUrl('/settings/factory')"
                  ></i>
                </el-tooltip>
              </span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-select v-model="craft_info.client_id"
                  placeholder="请选择加工单位">
                  <el-option v-for="item in supplier_list"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">下单日期</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-date-picker style="width:100%"
                  v-model="craft_info.order_time"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择下单日期">
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">纺纱名称</span>
              <span class="explanation">
                (必选)
                <el-tooltip class="item" effect="dark" content="添加新纱线" placement="top">
                  <i
                    class="el-icon-upload hoverOrange"
                    style="line-height: 38px; font-size: 18px; cursor: pointer; margin-left: 8px"
                    @click="showAdd = true"
                  ></i>
                </el-tooltip>
              </span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-cascader v-model="craft_info.yarn_id"
                  filterable
                  placeholder="请选择纱线"
                  :options="yarn_list"
                  @change="getProColor($event)"></el-cascader>
              </div>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">纺纱颜色</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-autocomplete style="max-height:32px"
                  v-model="craft_info.color"
                  :fetch-suggestions="querySearchColor"
                  placeholder="纺纱颜色">
                </el-autocomplete>
              </div>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">纱线属性</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-select v-model="craft_info.attribute"
                  placeholder="请选择纱线属性">
                  <el-option label="绞纱"
                    value="绞纱"></el-option>
                  <el-option label="筒纱"
                    value="筒纱"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">一、原料供应及生产数量</div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="inputLine">
            <span class="text">按以下原料配比生产</span>
            <div class="elCtn">
              <el-input v-model="craft_info.weight"
                placeholder="输入吨数">
                <template slot="append">吨</template>
              </el-input>
            </div>
            <span class="text">，颜色一定要与</span>
            <div class="elCtn">
              <el-date-picker style="width:100%"
                v-model="craft_info.date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <span class="text">日你公司所发相同，投料后搓一绞对色。</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="content">
              <div class="elCtn">
                <el-input v-model="craft_info.desc"
                  placeholder="原料供应其他说明">
                </el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">二、原料配比及要求：混条比例准确、混条均匀</div>
        </div>
        <div class="rowCtn overflow">
          <div class="colCtn flex2"
            v-for="(item,index) in craft_info.material_info"
            :key="index">
            <div class="elCtn">
              <el-cascader class="el1"
                v-model="item.material_id"
                placeholder="输入毛条名称搜索"
                :options="mat_type_list"
                filterable></el-cascader>
              <el-input class="el2"
                placeholder="比例1"
                v-model="item.proportion1">
                <template slot="append">%</template>
              </el-input>
              <el-input class="el2"
                placeholder="比例2"
                v-model="item.proportion2">
                <template slot="append">%</template>
              </el-input>
            </div>
            <div class="explanation">
              <!-- <span class="text">库存数量：
                <span>待选则毛条</span>
              </span>
              <span class="text">预计使用：
                <span>待选则毛条</span>
              </span> -->
            </div>
            <div v-if="index===0"
              class="editBtn blue"
              @click="$addItem(craft_info.material_info,{
              material_id:[],
              proportion1:'',
              proportion2:''
            })">添加</div>
            <div v-if="index>0"
              class="editBtn red"
              @click="$deleteItem(craft_info.material_info,index)">删除</div>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">三、质量要求</div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">质量要求</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input v-model="craft_info.mass_demand"
                  placeholder="干燥（绝不加湿）、条干均匀、无毛粒、毛片等。可以用于单跟进线的针织品生产。">
                </el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">四、生产工艺</div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex2">
            <div class="label">
              <span class="text">实纺支数</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input v-model="craft_info.shifangzhishu"
                  placeholder="请选择实纺支数">
                  <template slot="append">支</template>
                </el-input>
              </div>
            </div>
          </div>
          <div class="colCtn flex2">
            <div class="label">
              <span class="text">单纱捻度</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content flexRow">
              <div class="elCtn"
                style="width:400px">
                <el-input v-model="craft_info.danshaniandu"
                  placeholder="请选择实纺支数">
                  <template slot="append">个/m</template>
                </el-input>
              </div>
              <div class="elCtn">
                <el-input v-model="craft_info.dansha_deviation_desc"
                  placeholder="请输入偏差备注">
                </el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex2">
            <div class="label">
              <span class="text">双纱捻度</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content flexRow">
              <div class="elCtn"
                style="width:400px">
                <el-input v-model="craft_info.shuangshaniandu"
                  placeholder="请选择双纱捻度">
                  <template slot="append">个/m</template>
                </el-input>
              </div>
              <div class="elCtn">
                <el-input v-model="craft_info.shuangsha_deviation_desc"
                  placeholder="请输入偏差备注">
                </el-input>
              </div>
            </div>
          </div>
          <div class="colCtn flex2">
            <div class="label">
              <span class="text">框 长</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content flexRow">
              <div class="elCtn"
                style="width:400px">
                <el-input v-model="craft_info.kuangchang"
                  placeholder="请选择双纱捻度">
                  <template slot="append">m</template>
                </el-input>
              </div>
              <div class="elCtn">
                <el-input v-model="craft_info.kuangchang_desc"
                  placeholder="请输入偏差备注">
                </el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">五、摇绞与打包</div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="inputLine">
            <span class="text">每绞</span>
            <div class="elCtn">
              <el-input v-model="craft_info.meijiao"
                placeholder="输入克数"
                @input="cmpYaojiaoNetWeight">
                <template slot="append">克</template>
              </el-input>
            </div>
            <span class="text">；三道八字结。10绞为一把，10把为一捆，4捆为一件。</span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="inputLine">
            <span class="text">每件确保400绞和净重</span>
            <div class="elCtn">
              <el-input v-model="craft_info.yaojiao_net_weight"
                placeholder="输入净重">
                <template slot="append">kg</template>
              </el-input>
            </div>
            <span class="text">；毛重在</span>
            <div class="elCtn">
              <el-input v-model="craft_info.yaojiao_gross_weight"
                placeholder="输入毛重"
                @input="cmpSunhao">
                <template slot="append">kg</template>
              </el-input>
            </div>
            <span class="text">以上，机包六道标准件。<span v-if="yaojiao_sunhao"
                class="orange">（损耗为{{yaojiao_sunhao.toFixed(2)}}%）</span></span>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">六、筒纱与打包</div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="inputLine">
            <span class="text">用新编织袋包装，每包15个筒子，袋口扎紧扎牢，纱要留尾巴。每包净重</span>
            <div class="elCtn">
              <el-input v-model="craft_info.tongsha_net_weight"
                placeholder="输入净重">
                <template slot="append">kg</template>
              </el-input>
            </div>
            <span class="text">；毛重在</span>
            <div class="elCtn">
              <el-input v-model="craft_info.tongsha_gross_weight"
                placeholder="输入毛重">
                <template slot="append">kg</template>
              </el-input>
            </div>
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
              <div class="elCtn">
                <el-input v-model="craft_info.pack_desc"
                  placeholder="请输入书写内容">
                </el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">八、制成率与加工费</div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex2">
            <div class="label">
              <span class="text">制成率</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content flexRow">
              <div class="elCtn"
                style="width:400px">
                <el-input v-model="craft_info.complete_rate"
                  placeholder="请输入制成率">
                  <template slot="append">个/m</template>
                </el-input>
              </div>
              <div class="elCtn">
                <el-input v-model="craft_info.complete_rate_desc"
                  placeholder="请输入制成率备注">
                </el-input>
              </div>
            </div>
          </div>
          <div class="colCtn flex2">
            <div class="label">
              <span class="text">加工费净重含税</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="content flexRow">
                <div class="elCtn"
                  style="width:400px">
                  <el-input v-model="craft_info.process_fee"
                    placeholder="请输入加工费净重含税">
                    <template slot="append">元/吨</template>
                  </el-input>
                </div>
                <div class="elCtn">
                  <el-input v-model="craft_info.process_fee_desc"
                    placeholder="请输入费用备注">
                  </el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">九、交货期限</div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex2">
            <div class="label">
              <span class="text">交货期限</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-date-picker style="width:100%"
                  v-model="craft_info.delivery_time"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择交货期限">
                </el-date-picker>
              </div>
            </div>
          </div>
          <div class="colCtn flex2">
            <div class="label">
              <span class="text">期限备注</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input v-model="craft_info.delivery_desc"
                  placeholder="请输入期限备注">
                </el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn blockCtn">
          <div class="titleLine">十、特别注意</div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="content">
              <div class="elCtn">
                <el-input v-model="craft_info.special_desc"
                  placeholder="请输入特别注意内容">
                </el-input>
              </div>
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
          <div class="btn btnBlue"
            @click="saveCraft">提交</div>
        </div>
      </div>
    </div>
    <product-create
      :show="showAdd"
      @close="showAdd = false"
      @afterCreate="
        $checkCommonInfo([
          {
            checkWhich: 'api/yarnType',
            getInfoMethed: 'dispatch',
            getInfoApi: 'getYarnTypeAsync',
            forceUpdate: true
          }
        ])
      "
    ></product-create>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CraftInfo } from '@/types/material'
import { craft, product } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    craft_info: CraftInfo
    [propName: string]: any
  } {
    return {
      select_loading: false,
      showAdd: false,
      yarn_arr: [],
      color_list: [],
      yaojiao_sunhao: 0,
      craft_info: {
        is_draft: 1,
        client_id: '',
        order_time: this.$getDate(new Date()),
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
    yarn_list() {
      return this.$store.state.api.yarnType.arr.map((item: any) => {
        return {
          value: item.id,
          label: item.name,
          children: item.yarns.map((itemChild: any) => {
            return {
              value: itemChild.id,
              label: itemChild.name
            }
          })
        }
      })
    },
    supplier_list() {
      return this.$store.state.api.supplier.arr.filter((item: any) => item.client_type === '混纺单位')
    },
    mat_type_list() {
      return this.$store.state.api.materialType.arr.map((item: any) => {
        return {
          value: item.id,
          label: item.name,
          children: item.child_data.map((itemChild: any) => {
            return {
              value: itemChild.id,
              label: itemChild.name
            }
          })
        }
      })
    }
  },
  methods: {
    saveCraft() {
      if (
        this.$formCheck(this.craft_info, [
          {
            key: 'client_id',
            errMsg: '请选择加工单位'
          },
          {
            key: 'yarn_id',
            errMsg: '请选择纱线名称'
          },
          {
            key: 'color',
            errMsg: '请输入纺纱颜色'
          },
          {
            key: 'attribute',
            errMsg: '请选择纺纱属性'
          },
          {
            key: 'weight',
            errMsg: '请输入吨数'
          }
        ])
      ) {
        return
      }
      this.craft_info.yarn_id = (this.craft_info.yarn_id as string[])[1]
      this.craft_info.material_info.forEach((item) => {
        item.material_type_id = item.material_id[0]
        item.material_id = item.material_id[1]
      })
      craft.create(this.craft_info).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.$router.push(
            '/material/craftList?page=1&&code=&&name=&&client_id=&&user_id=&&status=&&page_size=10&&date='
          )
        }
      })
    },
    cmpYaojiaoNetWeight(val: string) {
      this.craft_info.yaojiao_net_weight = (Number(val) * 0.4).toFixed(2)
    },
    cmpSunhao() {
      this.yaojiao_sunhao =
        ((Number(this.craft_info.yaojiao_gross_weight) - Number(this.craft_info.yaojiao_net_weight)) /
          Number(this.craft_info.yaojiao_net_weight)) *
        100
    },
    querySearchColor(queryString: string, cb: (params: any) => void) {
      if (this.color_list.length > 0) {
        const returnData = queryString
          ? this.color_list.filter((itemF: any) => itemF.value.indexOf(queryString) !== -1)
          : this.color_list
        cb(returnData)
      } else {
        cb([])
      }
    },
    getProColor(ev: string[]) {
      product
        .detail({
          id: ev[1]
        })
        .then((res) => {
          this.color_list = Array.from(new Set(res.data.data.child_data.map((itemChild: any) => itemChild.color))).map(
            (itemChild: any) => {
              return {
                value: itemChild
              }
            }
          )
        })
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/supplier',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPartyBAsync'
      },
      {
        checkWhich: 'api/materialType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getMaterialTypeAsync'
      },
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/material/craftCreate.less';
</style>
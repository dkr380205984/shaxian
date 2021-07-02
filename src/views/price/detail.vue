<template>
  <div id="priceDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="checkCtn">
          <el-tooltip class="item"
            effect="dark"
            content="点击查看审核日志"
            placement="bottom">
            <img @click="checkReason"
              :src="checkStatusCom" />
          </el-tooltip>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">报价单名称：</span>
            <span class="text">{{priceDetail.title || ''}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">客户名称：</span>
            <span class="text">{{priceDetail.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">关联客户单号：</span>
            <span class="text">{{priceDetail.order_code}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">创建人：</span>
            <span class="text">{{priceDetail.user_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">创建日期：</span>
            <span class="text">{{$getDate(priceDetail.create_time)}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">其它备注：</span>
            <span class="text">{{priceDetail.desc || '暂无'}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">报价信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn"
          v-for="(item,index) in priceDetail.child_data"
          :key="index">
          <div class="tableCtn"
            style="width:100%">
            <div class="thead"
              style="height:auto">
              <div class="trow">
                <div class="tcolumn">{{`种类${index + 1}： 起订量：${item.weight||0}kg； 质量要求：${item.mass_demand || '无'}； 其他要求：${item.other_demand || '无'}。`}}</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow">
                <div class="tcolumn center flex03">分类</div>
                <div class="tcolumn flex3 noPad">
                  <div class="trow">
                    <div class="tcolumn center">名称</div>
                    <div class="tcolumn center">说明</div>
                    <div class="tcolumn center">价格</div>
                  </div>
                </div>
              </div>
              <div class="trow"
                v-for="(itemInfo,indexInfo) in item.info"
                :key="indexInfo">
                <div class="tcolumn center flex03">{{itemInfo.type}}</div>
                <div class="tcolumn flex3 noPad">
                  <div :class="`trow ${itemChild.index%2 === 0 && 'bgGray'}`"
                    v-for="(itemChild,indexChild) in itemInfo.child_data"
                    :key="indexChild">
                    <div class="tcolumn center">{{itemChild.name}}</div>
                    <div class="tcolumn center">{{itemChild.desc}}</div>
                    <div class="tcolumn center unit"
                      unit='元/千克'>{{itemChild.price}}</div>
                  </div>
                </div>
              </div>
              <div class="trow noBorder">
                <div class="tcolumn center flex03"></div>
                <div class="tcolumn flex3 noPad">
                  <div class="trow">
                    <div class="tcolumn center"></div>
                    <div class="tcolumn center"></div>
                    <div class="tcolumn center unit"
                      unit='元/千克'>
                      <span style="font-size:22px;font-weight:bolder">{{item.total_price}}</span>
                    </div>
                  </div>
                </div>
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
          <div class="buttonList"
            style="margin-left:12px">
            <div class="showButton">
              <i class="el-icon-s-grid"></i>
              <span class="text">报价单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="button btnOrange"
                  @click="$router.push(`/price/update/${$route.params.id}`)">
                  <i class="iconfont">&#xe63a;</i>
                  <span class="text">修改</span>
                </div>
                <div class="button btnGreen"
                  @click="check_flag = true">
                  <i class="iconfont">&#xe638;</i>
                  <span class="text">审核</span>
                </div>
                <div class="button btnRed"
                  @click="deletePrice">
                  <i class="iconfont">&#xe639;</i>
                  <span class="text">删除</span>
                </div>
                <div class="button btnBlue"
                  @click="$message.warning('待开发，敬请期待！！！')">打印</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <check :show.sync="check_flag"
      :pid="$route.params.id"
      @afterCheck="init"
      :checkType="8"
      :checkList="checkPassDesc"></check>
    <check-detail :show.sync="check_detail_flag"
      :checkType="8"
      :pid="$route.params.id"></check-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { price } from '@/assets/js/api'
import {} from '@/types/material'
import {} from '@/types/store'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      priceDetail: {
        is_check: 1
      },
      check_flag: false,
      check_detail_flag: false,
      checkPassDesc: [
        {
          value: '成本价过高',
          label: '成本价过高'
        },
        {
          value: '成本价过低',
          label: '成本价过低'
        },
        {
          value: '加工价过高',
          label: '加工价过高'
        },
        {
          value: '加工价过低',
          label: '加工价过低'
        },
        {
          value: '起订量过低',
          label: '起订量过低'
        },
        {
          value: '利润过低',
          label: '利润过低'
        },
        {
          value: '利润过高',
          label: '利润过高'
        }
      ]
    }
  },
  methods: {
    checkReason() {
      if (this.priceDetail.is_check === 0 || !this.priceDetail.is_check) {
        this.$message.warning('暂无审核信息')
        return
      }
      this.check_detail_flag = true
    },
    init() {
      this.loading = true
      price
        .detail({
          id: this.$route.params.id
        })
        .then((res: any) => {
          if (res.data.status !== false) {
            this.priceDetail = res.data.data
            this.priceDetail.child_data.forEach((itemF: any) => {
              const arr = [
                {
                  type: '纱线',
                  name: itemF.yarn_name,
                  desc: `${itemF.color}/${itemF.attribute}`,
                  price: itemF.cost_price
                },
                ...((itemF.yarn_process_info &&
                  JSON.parse(itemF.yarn_process_info).map((itemM: any) => {
                    return { type: '纱线加工', ...itemM }
                  })) || [{ type: '纱线加工', name: '', desc: '', price: '' }]),

                ...((itemF.other_fee &&
                  JSON.parse(itemF.other_fee).map((itemM: any) => {
                    return { type: '其它费用', ...itemM }
                  })) || [{ type: '其它费用', name: '', desc: '', price: '' }]),

                {
                  type: '利润税费',
                  name: '基本利润',
                  desc: `${itemF.profit_proportion || 0}%`,
                  price: itemF.profit
                },
                {
                  type: '利润税费',
                  name: '基本税费',
                  desc: `${itemF.tax_proportion || 0}%`,
                  price: itemF.tax
                }
              ]
              itemF.info = this.$mergeData(
                arr.map((itemM, indexM) => ({ index: indexM, ...itemM })),
                { mainRule: 'type', childrenName: 'child_data' }
              )
            })
            this.loading = false
          }
        })
    },
    deletePrice() {
      this.$confirm('是否删除该报价单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          price.delete({ id: this.$route.params.id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$router.push('/price/list?page=1&code=&name=&client=&status=&user=&date=&limit=')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    checkStatusCom() {
      switch (this.priceDetail.is_check) {
        case 1:
          return require('@/assets/image/common/pass.png')
        case 2:
          return require('@/assets/image/common/return.png')
        default:
          return require('@/assets/image/common/waiting.png')
      }
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/price/detail.less';
</style>
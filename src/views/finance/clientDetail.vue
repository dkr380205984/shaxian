<template>
  <div class="indexMain"
    id="clientDetail">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">客户名称：</span>
            <span class="text blue">哈哈哈</span>
          </div>
          <div class="colCtn">
            <span class="label">客户简称：</span>
            <span class="text">哈哈哈</span>
          </div>
          <div class="colCtn">
            <span class="label">负责人：</span>
            <span class="text">哈哈哈</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">电话：</span>
            <span class="text">哈哈哈</span>
          </div>
          <div class="colCtn">
            <span class="label">联系人：</span>
            <span class="text">哈哈哈</span>
          </div>
          <div class="colCtn">
            <span class="label">手机号：</span>
            <span class="text">哈哈哈</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">公司地址：</span>
            <span class="text">哈哈哈</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">统计数据</span>
      </div>
      <div class="tableCtn"
        style="padding:20px 32px 0 32px;margin:0">
        <div class="thead">
          <div class="trow">
            <div class="tcolumn">总下单数量</div>
            <div class="tcolumn">总下单金额</div>
            <div class="tcolumn">发货数量</div>
            <div class="tcolumn">待发货数量</div>
            <div class="tcolumn">总发货金额</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow">
            <div class="tcolumn">总下单数量</div>
            <div class="tcolumn">总下单金额</div>
            <div class="tcolumn">发货数量</div>
            <div class="tcolumn">待发货数量</div>
            <div class="tcolumn">总发货金额</div>
          </div>
        </div>
      </div>
      <div class="tableCtn"
        style="padding:20px 32px 20px 32px;margin:0">
        <div class="thead">
          <div class="trow">
            <div class="tcolumn">客户扣款</div>
            <div class="tcolumn">我方开票</div>
            <div class="tcolumn">我方待开票</div>
            <div class="tcolumn">客户已付款</div>
            <div class="tcolumn">客户欠款</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow">
            <div class="tcolumn red">客户扣款</div>
            <div class="tcolumn">我方开票</div>
            <div class="tcolumn">我方待开票</div>
            <div class="tcolumn">客户已付款</div>
            <div class="tcolumn red">客户欠款</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">下单信息</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="value"
                placeholder="输入筛选条件"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="value"
                placeholder="输入筛选条件"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="value"
                placeholder="输入筛选条件"></el-input>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">订单号</div>
              <div class="column">订单状态</div>
              <div class="column">下单数量</div>
              <div class="column">发货数量</div>
              <div class="column">下单金额</div>
              <div class="column">扣款金额</div>
              <div class="column">结算金额</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row">
              <div class="column">订单号</div>
              <div class="column">订单状态</div>
              <div class="column">下单数量</div>
              <div class="column">发货数量</div>
              <div class="column">下单金额</div>
              <div class="column">扣款金额</div>
              <div class="column">结算金额</div>
              <div class="column">
                <div class="oprCtn">
                  <div class="opr blue">详情</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :current-page.sync="page"
            :page-size="10"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">开票单据</span>
        <span class="addBtn btn btnMain"
          @click="show_bill=true">新增开票</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="elCtn">
              <el-input v-model="value"
                placeholder="输入筛选条件"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="value"
                placeholder="输入筛选条件"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="value"
                placeholder="输入筛选条件"></el-input>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">开票单号</div>
              <div class="column">发票号码</div>
              <div class="column">开票金额</div>
              <div class="column">备注</div>
              <div class="column">日期</div>
              <div class="column">发票图片</div>
              <div class="column">关联单号</div>
              <div class="column">审核状态</div>
              <div class="column">创建人</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row">
              <div class="column">开票单号</div>
              <div class="column">发票号码</div>
              <div class="column">开票金额</div>
              <div class="column">备注</div>
              <div class="column">日期</div>
              <div class="column">发票图片</div>
              <div class="column">关联单号</div>
              <div class="column">审核状态</div>
              <div class="column">创建人</div>
              <div class="column">
                <div class="oprCtn">
                  <div class="opr blue">详情</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :current-page.sync="page"
            :page-size="10"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">收款单据</span>
        <span class="addBtn btn btnMain"
          @click="show_collection=true">新增收款</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">扣款单据</span>
        <span class="addBtn btn btnMain"
          @click="show_deduct=true">新增扣款</span>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
    <bill :data="{type:5,client_id:$route.params.id}"
      :show.sync="show_bill"></bill>
    <deduct :data="{type:5,client_id:$route.params.id}"
      :show.sync="show_deduct"></deduct>
    <collection :data="{type:5,client_id:$route.params.id}"
      :show.sync="show_collection"></collection>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      value: '',
      total: 1,
      page: 1,
      show_bill: false,
      show_deduct: false,
      show_collection: false
    }
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/less/finance/clientDetail.less';
</style>
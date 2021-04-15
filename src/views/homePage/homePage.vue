<template>
  <div id="homePage"
    class="indexMain">
    <div class="firstLine">
      <div class="main">
        <div class="leftCtn">
          <div class="img">
            {{username.charAt(username.length-1)}}
          </div>
          <div class="content">
            <div class="line1">{{nowTime}}，{{username}}</div>
            <div class="line2">
              <span class="span">{{station}}</span>
              <span class="span">{{group||'暂无分组'}}</span>
            </div>
          </div>
        </div>
        <div class="rightCtn">
          <div class="box">
            <span class="label">今日发货</span>
            <span class="number">{{dispatchCount.day}}</span>
          </div>
          <div class="box">
            <span class="label">本周发货</span>
            <span class="number">{{dispatchCount.week}}</span>
          </div>
          <div class="box">
            <span class="label">本月发货</span>
            <span class="number">{{dispatchCount.month}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      style="margin-top:32px">
      <div class="titleCtn">
        <span class="title">全局搜索</span>
      </div>
      <div class="contentCtn searchContent">
        <div class="searchCtn">
          <el-input class="input"
            placeholder="请输入毛条名称、纱线名称、客户单号、采购单号、调取单号、加工单号、出入库单号按回车搜索"
            v-model="searchValue"
            @keydown.native.enter="searchInfo">
            <i slot="suffix"
              class="el-input__icon el-icon-search"></i>
            <el-select v-model="searchType"
              slot="prepend"
              class="select"
              placeholder="请选择"
              @change="resetAll">
              <el-option label="纱线名称"
                value="1"></el-option>
              <el-option label="毛条名称"
                value="2"></el-option>
              <el-option label="订单号"
                value="3"></el-option>
              <el-option label="采购单号"
                value="4"></el-option>
              <el-option label="调取单号"
                value="5"></el-option>
              <el-option label="加工单号"
                value="6"></el-option>
              <el-option label="出入库单号"
                value="7"></el-option>
            </el-select>
          </el-input>
          <div class="btn btnBlue"
            @click="searchInfo">搜索</div>
        </div>
        <!-- <div class="seachHistory">
          <div class="container">
            <span class="label">近期搜索记录</span>
            <span class="normal">aaaaaaaaaaa</span>
            <span class="normal"
              v-for="(item,index) in history"
              :key="index"
              @click="searchHistory(item)">{{item}}</span>
          </div>
          <div class="btn noBorder"
            @click="resetHistory">清空历史</div>
        </div> -->
        <div class="searchBox"
          v-show="showSearch"
          v-loading="searchLoading">
          <i class="el-icon-circle-close icons"
            @click="showSearch = false"></i>
          <div class="block"
            v-show="searchType==='1'">
            <div class="titled">纱线信息</div>
            <div class="info"
              style="margin:20px 0">
              <span class="text title">纱线名称</span>
              <span class="text title">类型</span>
              <span class="text title">库存</span>
              <span class="text title">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.yarn"
              :key="item.id">
              <span class="text"
                v-html="item.name"
                @click="window.open('/product/detail/' + item.id)"></span>
              <span class="text">{{item.yarn_type | yarnTypeFilter}}</span>
              <span class="text">{{item.store}}kg</span>
              <span class="text">{{item.user_name}}</span>
            </div>
            <div v-if="searchList.yarn.length===0"
              class="noMsg">暂无相关纱线</div>
          </div>
          <div class="block"
            v-show="searchType==='2'">
            <div class="titled">毛条信息</div>
            <div class="info"
              style="margin:20px 0">
              <span class="text title">纱线名称</span>
              <span class="text title">类型</span>
              <span class="text title">单价</span>
            </div>
            <div class="info"
              v-for="item in searchList.material"
              :key="item.id">
              <span class="text"
                v-html="item.name"></span>
              <span class="text">{{item.type_name}}</span>
              <span class="text">{{item.price}}元</span>
            </div>
            <div v-if="searchList.material.length===0"
              class="noMsg">暂无相关毛条</div>
          </div>
          <div class="block"
            v-show="searchType==='3'">
            <div class="titled">相关订单</div>
            <div class="info"
              style="margin:20px 0">
              <span class="text title">订单号</span>
              <span class="text title">下单公司</span>
              <span class="text title">订单状态</span>
              <span class="text title">审核状态</span>
              <span class="text title">创建人</span>
              <span class="text title">发货日期</span>
            </div>
            <div class="info"
              v-for="item in searchList.order"
              :key="item.id">
              <span class="text"
                v-html="item.code"
                @click="window.open('/order/detail/' + item.id)"></span>
              <span class="text">{{item.client_name}}</span>
              <span class="text"
                :class="{'orange':item.status===1,'blue':item.status===2,'green':item.status===3}">{{item.status | orderStatusFilter}}</span>
              <span class="text"
                :class="{'orange':item.is_check===0,'green':item.is_check===1,'red':item.is_check===2}">{{item.is_check | orderCheckFilter}}</span>
              <span class="text">{{item.user_name}}</span>
              <span class="text">{{item.delivery_time}}</span>
            </div>
            <div v-if="searchList.order.length===0"
              class="noMsg">暂无相关订单</div>
          </div>
          <div class="block"
            v-show="searchType==='4'">
            <div class="titled">相关采购单</div>
            <div class="info"
              style="margin:20px 0">
              <span class="text title">采购单号</span>
              <span class="text title">下单公司</span>
              <span class="text title">采购单状态</span>
              <span class="text title">审核状态</span>
              <span class="text title">创建人</span>
              <span class="text title">发货日期</span>
            </div>
            <div class="info"
              v-for="item in searchList.orderYarn"
              :key="item.id">
              <span class="text"
                v-html="item.code"
                @click="window.open('/directOrder/yarnDetail/' + item.id)"></span>
              <span class="text">{{item.client_name}}</span>
              <span class="text"
                :class="{'orange':item.status===1,'blue':item.status===2,'green':item.status===3}">{{item.status | orderStatusFilter}}</span>
              <span class="text"
                :class="{'orange':item.is_check===0,'green':item.is_check===1,'red':item.is_check===2}">{{item.is_check | orderCheckFilter}}</span>
              <span class="text">{{item.user_name}}</span>
              <span class="text">{{item.delivery_time}}</span>
            </div>
            <div v-if="searchList.orderYarn.length===0"
              class="noMsg">暂无相关采购单</div>
          </div>
          <div class="block"
            v-show="searchType==='5'">
            <div class="titled">相关调取单</div>
            <div class="info"
              style="margin:20px 0">
              <span class="text title">调取单号</span>
              <span class="text title">来源仓库</span>
              <span class="text title">调取单状态</span>
              <span class="text title">审核状态</span>
              <span class="text title">调取纱线</span>
              <span class="text title">调取数量</span>
            </div>
            <div class="info"
              v-for="item in searchList.transferYarn"
              :key="item.id">
              <span class="text"
                v-html="item.code"></span>
              <span class="text">{{item.store_name}}/{{item.second_store_name}}</span>
              <span class="text"
                :class="{'orange':item.status===1,'blue':item.status===2,'green':item.status===3}">{{item.status | orderStatusFilter}}</span>
              <span class="text"
                :class="{'orange':item.is_check===0,'green':item.is_check===1,'red':item.is_check===2}">{{item.is_check | orderCheckFilter}}</span>
              <span class="text">{{item.name}}</span>
              <span class="text">{{item.total_weight}}kg</span>
            </div>
            <div v-if="searchList.transferYarn.length===0"
              class="noMsg">暂无相关调取单</div>
          </div>
          <div class="block"
            v-show="searchType==='6'">
            <div class="titled">相关加工单</div>
            <div class="info"
              style="margin:20px 0">
              <span class="text title">加工单号</span>
              <span class="text title">下单公司</span>
              <span class="text title">加工单状态</span>
              <span class="text title">审核状态</span>
              <span class="text title">创建人</span>
              <span class="text title">发货日期</span>
            </div>
            <div class="info"
              v-for="item in searchList.processYarn"
              :key="item.id">
              <span class="text"
                v-html="item.code"
                @click="window.open('/directProcess/yarnDetail/' + item.id)"></span>
              <span class="text">{{item.client_name}}/{{item.type}}</span>
              <span class="text"
                :class="{'orange':item.status===1,'blue':item.status===2,'green':item.status===3}">{{item.status | orderStatusFilter}}</span>
              <span class="text"
                :class="{'orange':item.is_check===0,'green':item.is_check===1,'red':item.is_check===2}">{{item.is_check | orderCheckFilter}}</span>
              <span class="text">{{item.user_name}}</span>
              <span class="text">{{item.delivery_time}}</span>
            </div>
            <div v-if="searchList.processYarn.length===0"
              class="noMsg">暂无相关加工单</div>
          </div>
          <div class="block"
            v-show="searchType==='7'">
            <div class="titled">相关出入库单</div>
            <div class="info"
              style="margin:20px 0">
              <span class="text title">出入库单号</span>
              <span class="text title">操作类型</span>
              <span class="text title">出入库信息</span>
              <span class="text title">创建人</span>
              <span class="text title">创建日期</span>
            </div>
            <div class="info"
              v-for="item in searchList.storeYarn"
              :key="item.id">
              <span class="text"
                v-html="item.code"></span>
              <span class="text"
                :class="{'blue':item.action_type===1||item.action_type===3||item.action_type===5||item.action_type===8||item.action_type===10,'green':item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7||item.action_type===9||item.action_type===11}">{{item.action_type|stockTypeFilter}}</span>
              <span class="text"
                v-if="item.action_type===1||item.action_type===3||item.action_type===5||item.action_type===8">
                <span class="green">{{item.client_name ||'无来源'}}</span>
                <i class="el-icon-s-unfold orange"
                  style="margin:0 5px;font-size:16px"></i>
                <span class="blue">{{item.store_name}}/{{item.second_store_name}}</span>
              </span>
              <span class="text"
                v-if="item.action_type===2||item.action_type===4||item.action_type===6||item.action_type===7||item.action_type===9">
                <span class="blue">{{item.store_name}}/{{item.second_store_name}}</span>
                <i class="el-icon-s-unfold orange"
                  style="margin:0 5px;font-size:16px"></i>
                <span class="green">{{item.client_name}}</span>
              </span>
              <span class="text"
                v-if="item.action_type===10 || item.action_type===11">
                <span class="green">{{item.store_name}}/{{item.second_store_name}}</span>
                <i class="el-icon-s-unfold orange"
                  style="margin:0 5px;font-size:16px"></i>
                <span class="blue">{{item.move_store_name}}/{{item.move_second_store_name}}</span>
              </span>
              <span class="text">{{item.user_name}}</span>
              <span class="text">{{item.complete_time}}</span>
            </div>
            <div v-if="searchList.storeYarn.length===0"
              class="noMsg">暂无相关出入库单</div>
          </div>
        </div>
      </div>
    </div>
    <div class="fastEditCtn">
      <div class="first_line">
        <div class="fastEdit_item"
          v-for="(item,index) in userCheckedOpr"
          :key="index"
          @click="easyOprFlag ? false : $router.push(item.url)">
          <i class="iconfont"
            v-html="item.icon"></i>
          <span class="name">{{item.opr}}</span>
          <span class="editBtn delete el-icon-minus red"
            v-if="easyOprFlag"
            @click.stop="item.isChecked = false"></span>
        </div>
        <div class="edit_item"
          @click="easyOprFlag ? saveOpr() : easyOprFlag = true">
          <i class="iconfont">&#xe607;</i>
          <span class="name blue">{{easyOprFlag ? '完成编辑' : '自定义编辑'}}</span>
        </div>
      </div>
      <div class="edit_line_box"
        :class="easyOprFlag ? false : 'hiddle'"
        :style="'height:' + userCanCheckedOpr.length * 132 + 'px'">
        <div class="edit_line"
          v-for="(item,index) in userCanCheckedOpr"
          :key="index">
          <div class="fastEdit_item"
            v-for="(itemN,indexN) in item"
            :key="indexN">
            <i class="iconfont"
              v-html="itemN.icon"></i>
            <span class="name">{{itemN.opr}}</span>
            <span class="editBtn add el-icon-plus green"
              v-if="easyOprFlag"
              @click.stop="addFastList(itemN)"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="moduleCtn">
      <div class="module">
        <div class="titleCtn">
          <span class="title">版本更新公告</span>
        </div>
        <div class="msgCtn">
          <div class="msg">
            <div class="left">版本更新公告版本更新公告</div>
            <div class="right">2011-11-22</div>
          </div>
          <div class="msg">
            <div class="left">版本更新公告版本更新公告</div>
            <div class="right">2011-11-22</div>
          </div>
          <div class="msg">
            <div class="left">版本更新公告版本更新公告</div>
            <div class="right">2011-11-22</div>
          </div>
          <div class="msg">
            <div class="left">版本更新公告版本更新公告</div>
            <div class="right">2011-11-22</div>
          </div>
          <div class="msg">
            <div class="left">版本更新公告版本更新公告</div>
            <div class="right">2011-11-22</div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="titleCtn">
          <span class="title">使用教学</span>
        </div>
        <div class="msgCtn">
          <div class="msg">
            <div class="left">使用教学使用教学使用教学使用教学</div>
            <div class="right">2011-11-22</div>
          </div>
          <div class="msg">
            <div class="left">使用教学使用教学使用教学使用教学</div>
            <div class="right">2011-11-22</div>
          </div>
          <div class="msg">
            <div class="left">使用教学使用教学使用教学使用教学</div>
            <div class="right">2011-11-22</div>
          </div>
          <div class="msg">
            <div class="left">使用教学使用教学使用教学使用教学</div>
            <div class="right">2011-11-22</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { index } from '@/assets/js/api'
export default Vue.extend({
  data() {
    return {
      username: window.sessionStorage.getItem('user_name'),
      station: window.sessionStorage.getItem('has_check') === '1' ? '系统管理员' : '普通用户',
      group: window.sessionStorage.getItem('group_name'),
      dispatchCount: {
        day: 123,
        week: 456,
        month: 789
      },
      searchValue: '',
      searchType: '',
      showSearch: false,
      searchLoading: false,
      searchList: {
        yarn: [],
        material: [],
        order: [],
        orderYarn: [],
        transferYarn: [],
        processYarn: [],
        storeYarn: []
      },
      easyOprFlag: false,
      easyOpr: [
        {
          isChecked: true,
          opr: '添加纱线',
          icon: '&#xe626;',
          url: '/product/create'
        },
        {
          isChecked: false,
          opr: '纱线列表',
          icon: '&#xe617;',
          url: '/product/list?page=1&page_size=10&name=&color=&attribute=&yarn_type='
        },
        {
          isChecked: false,
          opr: '添加毛条',
          icon: '&#xe622;',
          url: '/material/create'
        },
        {
          isChecked: false,
          opr: '毛条列表',
          icon: '&#xe620;',
          url: '/material/list?page=1&type=&name=&page_size=10'
        },
        {
          isChecked: false,
          opr: '添加订单',
          icon: '&#xe621;',
          url: '/order/create'
        },
        {
          isChecked: false,
          opr: '订单列表',
          icon: '&#xe61b;',
          url: '/order/list?page=1&order_code=&product_name=&client_id=&user_id=&page_size=10&date='
        },
        {
          isChecked: false,
          opr: '纱线采购列表',
          icon: '&#xe616;',
          url: '/directOrder/yarnList?page=1&code=&name=&client_id=&user_id=&page_size=10&date='
        },
        {
          isChecked: false,
          opr: '纱线加工列表',
          icon: '&#xe61a;',
          url: '/directProcess/yarnList?page=1&code=&name=&client_id=&user_id=&page_size=10&date='
        },
        {
          isChecked: false,
          opr: '添加工艺单',
          icon: '&#xe625;',
          url: '/material/craftCreate'
        },
        {
          isChecked: false,
          opr: '工艺单列表',
          icon: '&#xe61f;',
          url: '/material/craftList?page=1&code=&name=&client_id=&user_id=&status=&page_size=10&date='
        },
        {
          isChecked: false,
          opr: '毛条采购列表',
          icon: '&#xe61e;',
          url: '/directOrder/materialList?page=1&code=&name=&client_id=&user_id=&page_size=10&date='
        },
        {
          isChecked: false,
          opr: '纱线库存',
          icon: '&#xe61c;',
          url: '/store/list?page=&type=&name=&page_size='
        },
        {
          isChecked: false,
          opr: '毛条库存',
          icon: '&#xe618;',
          url: '/store/materialList?page=&type=&name=&page_size='
        }
      ],
      userEasyOpr: window.localStorage.getItem('userEasyOpr')
        ? JSON.parse(window.localStorage.getItem('userEasyOpr') as string)
        : []
    }
  },
  computed: {
    nowTime() {
      const hour = new Date().getHours()
      if (hour <= 9) {
        return '早安'
      } else if (hour > 9 && hour <= 11) {
        return '上午好'
      } else if (hour > 11 && hour <= 13) {
        return '中午好'
      } else if (hour > 13 && hour <= 17) {
        return '下午好'
      } else {
        return '晚上好'
      }
    },
    // 用户可选的操作
    userCanCheckedOpr(): any[] {
      return this.newSplice(
        this.easyOpr.filter((itemF) => !itemF.isChecked),
        7
      )
    },
    // 用户已选的操作
    userCheckedOpr(): any[] {
      return this.easyOpr.filter((itemF) => itemF.isChecked)
    }
  },
  methods: {
    resetAll() {
      this.searchList = {
        yarn: [],
        material: [],
        order: [],
        orderYarn: [],
        transferYarn: [],
        processYarn: [],
        storeYarn: []
      }
      this.showSearch = false
      this.searchLoading = false
    },
    searchHistory() {
      // ..
    },
    resetHistory() {
      // ...
    },
    searchInfo() {
      if (!this.searchType) {
        this.$message.warning('请选择搜索类型')
        return
      }
      this.searchLoading = true
      index
        .searchAll({
          keyword: this.searchValue,
          limit: 10,
          type: this.searchType
        })
        .then((res) => {
          console.log(res)
          if (res.data.data.length === 0) {
            this.$message.warning('暂无搜索信息，请重新搜索')
            return
          }
          if (this.searchType === '1') {
            this.searchList.yarn = res.data.data
          } else if (this.searchType === '2') {
            this.searchList.material = res.data.data
          } else if (this.searchType === '3') {
            this.searchList.order = res.data.data
          } else if (this.searchType === '4') {
            this.searchList.orderYarn = res.data.data
          } else if (this.searchType === '5') {
            this.searchList.transferYarn = res.data.data
          } else if (this.searchType === '6') {
            this.searchList.processYarn = res.data.data
          } else if (this.searchType === '7') {
            this.searchList.storeYarn = res.data.data
          }
          this.showSearch = true
          this.searchLoading = false
        })
    },
    newSplice(data: any[], num: number, arr?: any[]) {
      if (data.length === 0 || !data) {
        return []
      }
      if (!arr) {
        arr = []
      }
      arr.push(data.splice(0, num))
      if (data.length > 0) {
        this.newSplice(data, num, arr)
      }
      return arr
    },
    addFastList(item: any) {
      if (this.userCheckedOpr.length >= 6) {
        this.$message.warning('最多可添加6个快捷操作入口')
      } else {
        item.isChecked = true
      }
    },
    deleteOpr(num: number) {
      this.userEasyOpr.splice(num, 1)
    },
    saveOpr() {
      window.localStorage.setItem('userEasyOpr', JSON.stringify(this.userCheckedOpr.map((itemM) => itemM.opr)))
      this.$message.success('编辑成功')
      this.easyOprFlag = false
    }
  },
  mounted() {
    const userEasyOpr = window.localStorage.getItem('userEasyOpr')
      ? JSON.parse(window.localStorage.getItem('userEasyOpr') as string)
      : []
    userEasyOpr.forEach((item: any) => {
      const flag = this.easyOpr.find((itemF) => itemF.opr === item)
      if (flag) {
        flag.isChecked = true
      }
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/homePage/homePage.less';
</style>
<style lang="less">
.select {
  .el-input__inner {
    border-color: transparent !important;
    &:focus {
      border-color: transparent !important;
    }
  }
}
</style>
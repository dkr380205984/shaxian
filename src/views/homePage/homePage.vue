<template>
  <div id="homePage" class="indexMain">
    <div class="firstLine">
      <div class="main">
        <div class="leftCtn">
          <div class="img">
            {{ username.charAt(username.length - 1) }}
          </div>
          <div class="content">
            <div class="line1">{{ nowTimeGood }}，{{ username }}</div>
            <div class="line2">
              <span class="span">{{ station }}</span>
            </div>
          </div>
        </div>
        <div class="rightCtn">
          <div class="line2" style="text-align: right">当前时间</div>
          <div class="line2 blue" style="text-align: right; margin-top: 5px">{{ $getDate(new Date()) }}</div>
          <div class="line2 blue" style="text-align: right; margin-top: 5px">
            {{ $formatDate(rightNowTime, '星期W ' + nowTime + 'hh:mm:ss') }}
          </div>
          <!-- <div class="box">
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
          </div> -->
        </div>
      </div>
    </div>
    <div class="module" style="margin-top: 32px">
      <div class="titleCtn">
        <span class="title">全局搜索</span>
      </div>
      <div class="contentCtn searchContent">
        <div class="searchCtn">
          <el-input
            class="input"
            placeholder="请输入生产订单号、销售订单号、采购单号、调取单号、加工单号、采购入库单号、调取回库单号、入库单号、出库单号、报价单号、工艺单号按回车搜索"
            v-model="searchValue"
            @keydown.native.enter="searchInfo"
          >
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
            <el-select v-model="searchType" slot="prepend" class="select" placeholder="请选择" @change="resetAll">
              <el-option label="所有" value="0"></el-option>
              <el-option label="生产订单号" value="1"></el-option>
              <el-option label="销售订单号" value="2"></el-option>
              <el-option label="采购单号" value="3"></el-option>
              <el-option label="调取单号" value="4"></el-option>
              <el-option label="加工单号" value="5"></el-option>
              <el-option label="采购入库单号" value="6"></el-option>
              <el-option label="调取回库单号" value="7"></el-option>
              <el-option label="入库单号" value="8"></el-option>
              <el-option label="出库单号" value="9"></el-option>
              <el-option label="报价单号" value="10"></el-option>
              <el-option label="工艺单号" value="11"></el-option>
            </el-select>
          </el-input>
          <div class="btn btnBlue" @click="searchInfo">搜索</div>
        </div>
        <div class="seachHistory">
          <div class="container">
            <span class="label gray">近期搜索记录</span>
            <!-- <span class="normal gray">aaaaaaaaaaa</span> -->
            <span class="normal gray" v-for="(item, index) in history" :key="index" @click="searchHistory(item)">{{
              item
            }}</span>
          </div>
          <div class="btn noBorder" @click="resetHistory">清空记录</div>
        </div>
        <div class="searchBox" v-show="showSearch" v-loading="searchLoading">
          <i class="el-icon-circle-close icons" @click="showSearch = false"></i>
          <!-- 生产订单 -->
          <div class="block" v-show="searchType === '1' || searchType === '0'">
            <div class="titled">相关生产订单</div>
            <div class="info" style="margin: 20px 0">
              <span class="text title">编号</span>
              <span class="text title">下单客户</span>
              <span class="text title">创建时间</span>
              <span class="text title">创建人</span>
              <span class="text title">下单总数</span>
            </div>
            <div class="info" v-for="item in searchList[1]" :key="item.id">
              <span class="text" @click="$openUrl('/order/detail/' + item.id)">{{ item.order }}</span>
              <span class="text">{{ item.client }}</span>
              <span class="text">{{ $getDate(item.created_at) }}</span>
              <span class="text">{{ item.user }}</span>
              <span class="text">{{ item.total_number }}</span>
            </div>
            <div v-if="searchList[1].length === 0" class="noMsg">暂无生产订单</div>
          </div>
          <!-- 销售订单 -->
          <div class="block" v-show="searchType === '2' || searchType === '0'">
            <div class="titled">相关销售订单</div>
            <div class="info" style="margin: 20px 0">
              <span class="text title">编号</span>
              <span class="text title">下单客户</span>
              <span class="text title">创建时间</span>
              <span class="text title">创建人</span>
              <span class="text title">下单总数</span>
            </div>
            <div class="info" v-for="item in searchList[2]" :key="item.id">
              <span class="text" @click="$openUrl('/order/detail/' + item.id)">{{ item.order }}</span>
              <span class="text">{{ item.client }}</span>
              <span class="text">{{ $getDate(item.created_at) }}</span>
              <span class="text">{{ item.user }}</span>
              <span class="text">{{ item.total_number }}</span>
            </div>
            <div v-if="searchList[2].length === 0" class="noMsg">暂无相关销售订单</div>
          </div>
          <!-- 采购单 -->
          <div class="block" v-show="searchType === '3' || searchType === '0'">
            <div class="titled">相关采购单</div>
            <div class="info" style="margin: 20px 0">
              <span class="text title">编号</span>
              <span class="text title">采购单位</span>
              <span class="text title">创建时间</span>
              <span class="text title">创建人</span>
              <span class="text title">采购总数</span>
            </div>
            <div class="info" v-for="item in searchList[3]" :key="item.id">
              <span class="text" @click="$openUrl('/directOrder/yarnDetail/' + item.id)">{{ item.code }}</span>
              <span class="text">{{ item.client }}</span>
              <span class="text">{{ $getDate(item.created_at) }}</span>
              <span class="text">{{ item.user }}</span>
              <span class="text">{{ item.total_number }}</span>
            </div>
            <div v-if="searchList[3].length === 0" class="noMsg">暂无相关采购单</div>
          </div>
          <!-- 调取单 -->
          <div class="block" v-show="searchType === '4' || searchType === '0'">
            <div class="titled">相关调取单</div>
            <div class="info" style="margin: 20px 0">
              <span class="text title">编号</span>
              <span class="text title">创建时间</span>
              <span class="text title">创建人</span>
              <span class="text title">加工总数</span>
            </div>
            <div class="info" v-for="item in searchList[4]" :key="item.id">
              <span class="text" @click="window.open('/directProcess/yarnDetailNew/' + item.id)">{{ item.code }}</span>
              <span class="text">{{ $getDate(item.created_at) }}</span>
              <span class="text">{{ item.user }}</span>
              <span class="text">{{ item.total_number }}</span>
            </div>
            <div v-if="searchList[4].length === 0" class="noMsg">暂无相关调取单</div>
          </div>
          <!-- 加工单 -->
          <div class="block" v-show="searchType === '5' || searchType === '0'">
            <div class="titled">相关加工单</div>
            <div class="info" style="margin: 20px 0">
              <span class="text title">编号</span>
              <span class="text title">加工厂</span>
              <span class="text title">创建日期</span>
              <span class="text title">创建人</span>
              <span class="text title">加工总数</span>
            </div>
            <div class="info" v-for="item in searchList[5]" :key="item.id">
              <span class="text" @click="window.open('/directProcess/yarnDetailNew/' + item.transfer_id)">{{
                item.code
              }}</span>
              <span class="text">{{ item.client }}</span>
              <span class="text">{{ $getDate(item.created_at) }}</span>
              <span class="text">{{ item.user }}</span>
              <span class="text">{{ item.total_number }}</span>
            </div>
            <div v-if="searchList[5].length === 0" class="noMsg">暂无相关加工单</div>
          </div>
          <!-- 采购入库 -->
          <div class="block" v-show="searchType === '6' || searchType === '0'">
            <div class="titled">相关采购入库单</div>
            <div class="info" style="margin: 20px 0">
              <span class="text title">编号</span>
              <span class="text title">创建日期</span>
              <span class="text title">创建人</span>
              <span class="text title">入库总数</span>
            </div>
            <div class="info" v-for="item in searchList[6]" :key="item.id">
              <span class="text" @click="$openUrl('/directOrder/yarnDetail/' + item.related_id)">{{ item.code }}</span>
              <span class="text">{{ $getDate(item.created_at) }}</span>
              <span class="text">{{ item.user_name }}</span>
              <span class="text">{{ item.total_number }}</span>
            </div>
            <div v-if="searchList[6].length === 0" class="noMsg">暂无采购入库单</div>
          </div>
          <!-- 调取回库 -->
          <div class="block" v-show="searchType === '7' || searchType === '0'">
            <div class="titled">相关调取回库单</div>
            <div class="info" style="margin: 20px 0">
              <span class="text title">编号</span>
              <span class="text title">创建日期</span>
              <span class="text title">创建人</span>
              <span class="text title">入库总数</span>
            </div>
            <div class="info" v-for="item in searchList[7]" :key="item.id">
              <span class="text" @click="window.open('/directProcess/yarnDetailNew/' + item.related_id)">{{
                item.code
              }}</span>
              <span class="text">{{ $getDate(item.created_at) }}</span>
              <span class="text">
                {{ item.user }}
              </span>
              <span class="text">{{ item.total_number }}</span>
            </div>
            <div v-if="searchList[7].length === 0" class="noMsg">暂无相关调取回库单</div>
          </div>
          <!-- 入库单 -->
          <div class="block" v-show="searchType === '8' || searchType === '0'">
            <div class="titled">相关入库单</div>
            <div class="info" style="margin: 20px 0">
              <span class="text title">编号</span>
              <span class="text title">创建日期</span>
              <span class="text title">创建人</span>
              <span class="text title">入库总数</span>
            </div>
            <div class="info" v-for="item in searchList[8]" :key="item.id">
              <span class="text" @click="$openUrl('/store/allDetail?store_log_code=' + item.code)">{{
                item.code
              }}</span>
              <span class="text">{{ $getDate(item.created_at) }}</span>
              <span class="text">
                {{ item.user }}
              </span>
              <span class="text">{{ item.total_number }}</span>
            </div>
            <div v-if="searchList[8].length === 0" class="noMsg">暂无相关入库单</div>
          </div>
          <!-- 出库单 -->
          <div class="block" v-show="searchType === '9' || searchType === '0'">
            <div class="titled">相关出库单</div>
            <div class="info" style="margin: 20px 0">
              <span class="text title">编号</span>
              <span class="text title">创建日期</span>
              <span class="text title">创建人</span>
              <span class="text title">出库总数</span>
            </div>
            <div class="info" v-for="item in searchList[9]" :key="item.id">
              <span class="text" @click="$openUrl('/store/allDetail?store_log_code=' + item.code)">{{
                item.code
              }}</span>
              <span class="text">{{ $getDate(item.created_at) }}</span>
              <span class="text">
                {{ item.user }}
              </span>
              <span class="text">{{ item.total_number }}</span>
            </div>
            <div v-if="searchList[9].length === 0" class="noMsg">暂无相关出库单</div>
          </div>
          <!-- 报价单 -->
          <div class="block" v-show="searchType === '10' || searchType === '0'">
            <div class="titled">相关报价单</div>
            <div class="info" style="margin: 20px 0">
              <span class="text title">编号</span>
              <span class="text title">报价标题</span>
              <span class="text title">报价客户</span>
              <span class="text title">创建日期</span>
              <span class="text title">创建人</span>
            </div>
            <div class="info" v-for="item in searchList[10]" :key="item.id">
              <span class="text" @click="window.open('/price/detail/' + item.id)">{{ item.order }}</span>
              <span class="text">{{ item.title }}</span>
              <span class="text">{{ item.client }}</span>
              <span class="text">{{ $getDate(item.created_at) }}</span>
              <span class="text">{{ item.user }}</span>
            </div>
            <div v-if="searchList[10].length === 0" class="noMsg">暂无相关报价单</div>
          </div>
          <!-- 工艺单 -->
          <div class="block" v-show="searchType === '11' || searchType === '0'">
            <div class="titled">相关工艺单</div>
            <div class="info" style="margin: 20px 0">
              <span class="text title">编号</span>
              <span class="text title">加工厂</span>
              <span class="text title">纱线名称</span>
              <span class="text title">创建日期</span>
              <span class="text title">创建人</span>
            </div>
            <div class="info" v-for="item in searchList[11]" :key="item.id">
              <span class="text" @click="window.open('/material/craftDetail/' + item.id)">{{ item.code }}</span>
              <span class="text">{{ item.client }}</span>
              <span class="text">{{ item.yarn.name }}</span>
              <span class="text">{{ $getDate(item.created_at) }}</span>
              <span class="text">{{ item.user }}</span>
            </div>
            <div v-if="searchList[11].length === 0" class="noMsg">暂无相关工艺单</div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="fastEditCtn">
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
    </div> -->
    <!-- <div class="moduleCtn">
      <div class="module">
        <div class="titleCtn">
          <span class="title">版本更新公告</span>
        </div>
        <ul class="client_update_list"
          :class="{'havePrompt':loading_scroll || clientUpdateList.length === 0 || disabledScroll}"
          v-infinite-scroll="getList"
          :infinite-scroll-disabled="disabledScroll">
          <li v-for="(item,index) in clientUpdateList"
            class="client_update_item"
            :key="index"
            @click="showUpdateMessage = item">
            <span class="info">{{item.title}}</span>
            <span class="date">发布于 {{$getTime(item.create_time)}}</span>
          </li>
          <p class="prompt"
            v-if="loading_scroll">加载中...</p>
          <p class="prompt"
            v-else-if="clientUpdateList.length === 0">暂无更新公告</p>
          <p class="prompt"
            v-else-if="disabledScroll">暂无更多</p>
        </ul>
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
    </div> -->
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
      rightNowTime: new Date(),
      nowTime:
        new Date().getHours() <= 9
          ? '早上'
          : new Date().getHours() <= 11
          ? '上午'
          : new Date().getHours() <= 13
          ? '中午'
          : new Date().getHours() <= 17
          ? '下午'
          : '晚上',
      searchValue: '',
      searchType: '0',
      showSearch: false,
      searchLoading: false,
      searchList: [[], [], [], [], [], [], [], [], [], [], []],
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
        : [],
      clientUpdateList: [],
      history: window.localStorage.getItem('searchHistory')
        ? JSON.parse(window.localStorage.getItem('searchHistory') as string)
        : [],
      page: 1, // 现在更新公共没有分页所以没必要
      total: 1,
      disabledScroll: false,
      loading_scroll: false,
      showUpdateMessage: null
    }
  },
  computed: {
    nowTimeGood() {
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
    getList() {
      if (this.loading_scroll) {
        return
      }
      this.loading_scroll = true
      index
        .notifyList({
          limit: 20,
          page: this.page,
          status: null,
          tag: '版本更新公告'
        })
        .then((res) => {
          this.loading_scroll = false
          if (res.data.status !== false) {
            this.clientUpdateList = res.data.data
            this.page += 1
            if (this.page > Math.ceil(this.total / 20)) {
              this.disabledScroll = true
            }
          }
        })
    },
    resetAll() {
      this.searchList = []
      this.showSearch = false
      this.searchLoading = false
    },
    searchHistory() {
      // ..
    },
    resetHistory() {
      this.history = []
      window.localStorage.setItem('searchHistory', JSON.stringify([]))
    },
    searchInfo() {
      if (!this.searchValue) {
        return
      }

      index
        .searchAll({
          keyword: this.searchValue,
          type: Number(this.searchType)
        })
        .then((res) => {
          if (res.data.status) {
            let data = res.data.data
            data[0] = [{ info: [] }]
            // 以后如果有添加新的，记的这里+1
            data.length = 12

            data = Array.from(data)
            data.forEach((item: any) => {
              item.forEach((itemChild: any) => {
                // 处理没有info的数据
                if (!itemChild.info) {
                  itemChild.info = []
                }

                itemChild.total_number = itemChild.info.reduce((a: any, b: any) => {
                  return a + Number(b?.action_weight || b?.weight || 0)
                }, 0)
              })
            })
            this.searchList = data
            this.searchLoading = true
            if (!this.history.find((item: string) => item === this.searchValue)) {
              if (this.history.length < 10) {
                this.history.unshift(this.searchValue)
              } else {
                this.history.unshift(this.searchValue)
                this.history.pop()
              }
              window.localStorage.setItem('searchHistory', JSON.stringify(this.history))
            }
            this.showSearch = true
            this.searchLoading = false
          }
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
    }
    // saveOpr() {
    //   window.localStorage.setItem('userEasyOpr', JSON.stringify(this.userCheckedOpr.map((itemM) => itemM.opr)))
    //   this.$message.success('编辑成功')
    //   this.easyOprFlag = false
    // }
  },
  mounted() {
    const userEasyOpr = window.localStorage.getItem('userEasyOpr')
      ? JSON.parse(window.localStorage.getItem('userEasyOpr') as string)
      : []
    setInterval(() => {
      this.rightNowTime = new Date()
      const hour = this.rightNowTime.getHours()
      if (hour <= 9) {
        this.nowTime = '早上'
      } else if (hour > 9 && hour <= 11) {
        this.nowTime = '上午'
      } else if (hour > 11 && hour <= 13) {
        this.nowTime = '中午'
      } else if (hour > 13 && hour <= 17) {
        this.nowTime = '下午'
      } else {
        this.nowTime = '晚上'
      }
    }, 1000)
    userEasyOpr.forEach((item: any) => {
      const flag = this.easyOpr.find((itemF) => itemF.opr === item)
      if (flag) {
        flag.isChecked = true
      }
    })
    this.getList()
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
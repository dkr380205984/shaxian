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
    <div class="module" style="margin-top: 32px">
      <div class="titleCtn">
        <span class="title">销售额</span>
        <div class="fr elCtn">
          <el-date-picker
            v-model="saleObj.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="getSaleClient"
          >
          </el-date-picker>
        </div>
        <div class="fr" style="margin-right: 20px">
          <el-select v-model="saleObj.id" placeholder="客户名称筛选" clearable filterable @change="getSaleClient">
            <el-option
              v-for="item in client_list"
              :key="item.id"
              :value="item.id"
              :label="(item.code || item.id) + ' - ' + item.name"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div style="display: flex">
        <div style="padding: 20px 32px; flex: 2.7">
          <div style="display: flex; padding-bottom: 20px">
            <div style="width: 33%">
              <div style="color: rgba(0, 0, 0, 0.45); font-weight: bold">总销售额</div>
              <div style="font-size: 30px; margin-top: 10px">{{saleInfo.total_price}}万元</div>
            </div>
            <div style="width: 33%">
              <div style="color: rgba(0, 0, 0, 0.45); font-weight: bold">总销售数量</div>
              <div style="font-size: 30px; margin-top: 10px">{{saleInfo.total_weight}}吨</div>
            </div>
            <div style="width: 33%"></div>
          </div>
          <div style="height:340px">
            <zh-charts :option="option1"></zh-charts>
          </div>
        </div>
        <div style="padding: 20px 32px; flex: 1.3; border-left: 1px solid #d9d9d9">
          <div class="title" style="font-weight: bold;padding-bottom:10px">客户销售金额排名</div>
          <div style="max-height: 410px; overflow: scroll; padding: 0 10px">
            <div
              style="margin-top: 10px; display: flex; align-items: center;"
              v-for="(item, index) in saleInfo.client_data"
              :key="index + '客户销售金额排名'"
            >
              <div style="width: 10%; color: white">
                <div class="bgBlue">{{ index + 1 }}</div>
              </div>
              <div style="width: 65%">{{item.client_name}}</div>
              <div style="width: 25%">{{item.price}} 万元</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module" style="margin-top: 32px">
      <div class="titleCtn">
        <span class="title">销售纱线种类</span>
        <div class="fr elCtn">
          <el-date-picker
            v-model="yarnTypeObj.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="getYarnTypeInfo"
          >
          </el-date-picker>
        </div>
        <div class="fr elCtn" style="margin-right: 20px">
          <el-cascader
            v-model="yarnTypeObj.name"
            filterable
            clearable
            :show-all-levels="false"
            placeholder="请选择纱线"
            :options="yarn_list"
            @change="getYarnTypeInfo"
          ></el-cascader>
        </div>
        <div class="fr elCtn" style="margin-right: 20px">
          <el-select v-model="yarnTypeObj.sortWay" @change="getYarnTypeInfo">
            <el-option label="按数量排序" :value="1"> </el-option>
            <el-option label="按金额排序" :value="2"> </el-option>
          </el-select>
        </div>
      </div>
      <div style="display: flex">
        <div style="padding: 20px 32px; flex: 2.7">
          <div style="display: flex; padding-bottom: 20px">
            <div style="width: 33%">
              <div style="color: rgba(0, 0, 0, 0.45); font-weight: bold">总销售额</div>
              <div style="font-size: 30px; margin-top: 10px">{{yarnTypeInfo.total_price}}万元</div>
            </div>
            <div style="width: 33%">
              <div style="color: rgba(0, 0, 0, 0.45); font-weight: bold">总销售数量</div>
              <div style="font-size: 30px; margin-top: 10px">{{yarnTypeInfo.total_number}}吨</div>
            </div>
            <div style="width: 33%"></div>
          </div>
          <div style="height:340px">
            <zh-charts :option="option2"></zh-charts>
          </div>
        </div>
        <div style="padding: 20px 32px; flex: 1.3; border-left: 1px solid #d9d9d9">
          <div class="title" style="font-weight: bold;padding-bottom:10px">客户销售金额排名</div>
          <div style="max-height: 410px; overflow: scroll; padding: 0 10px">
            <div
              style="margin-top: 10px; display: flex; align-items: center;"
              v-for="(item, index) in yarnTypeInfo.material_data"
              :key="index + '客户销售金额排名'"
            >
              <div style="width: 10%; color: white">
                <div class="bgBlue">{{ index + 1 }}</div>
              </div>
              <div style="width: 65%">{{item.name}}</div>
              <div style="width: 25%">{{item.price}} 万元</div>
            </div>
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
import { index, dateStatic } from '@/assets/js/api'
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
      searchList: [[], [], [], [], [], [], [], [], [], [], [], []],
      saleObj: {
        id: '',
        date: [new Date().getFullYear() + '-01-01',this.$getDate(new Date())]
      },
      saleInfo:{
        client_data:[],
        total_price:0,
        total_weight:0
      },
      option1: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
          formatter : (params: any) => {
            var htmlStr = '<div>'
            htmlStr += params[0].name + '<br/>' //x轴的名称
            params.forEach((param: any, index: number) => {
              var color = param.color //图例颜色

              //为了保证和原来的效果一样，这里自己实现了一个点的效果
              htmlStr +=
                '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                color +
                ';"></span>'

              //添加一个汉字，这里你可以格式你的数字或者自定义文本内容
              htmlStr +=
                param.seriesName +
                '：' +
                '<span style="color:' +
                color +
                ';margin-right:10px">' +
                param.value +
                '</span>' +
                (index === 1 ? '万元' : '吨')

              htmlStr += '</div>'
            })

            return htmlStr
          }
        },
        legend: {
          data: ['销售数量','销售金额']
        },
        xAxis: [
          {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '销售数量',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 吨'
            }
          },
          {
            type: 'value',
            name: '销售金额',
            min: 0,
            max: 500,
            interval: 100,
            axisLabel: {
              formatter: '{value} 万元'
            }
          }
        ],
        series: [
          {
            type: 'bar',
            name: '销售数量',
            data: []
          },
          {
            type: 'line',
            name: '销售金额',
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      yarnTypeObj:{
        date: [new Date().getFullYear() + '-01-01',this.$getDate(new Date())],
        name: ['',''],
        sortWay: 1
      },
      yarnTypeInfo:{
        total_price: '',
        total_number: '',
        material_data: []
      },
      option2: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
          formatter : (params: any) => {
            var htmlStr = '<div>'
            htmlStr += params[0].name + '<br/>' //x轴的名称
            params.forEach((param: any, index: number) => {
              var color = param.color //图例颜色

              //为了保证和原来的效果一样，这里自己实现了一个点的效果
              htmlStr +=
                '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                color +
                ';"></span>'

              //添加一个汉字，这里你可以格式你的数字或者自定义文本内容
              htmlStr +=
                param.seriesName +
                '：' +
                '<span style="color:' +
                color +
                ';margin-right:10px">' +
                param.value +
                '</span>' +
                (index === 1 ? '万元' : '吨')

              htmlStr += '</div>'
            })

            return htmlStr
          }
        },
        dataZoom: [
          {
            start: 0, //默认为0
            end: 100 - 1500 / 31, //默认为100
            type: 'slider',
            maxValueSpan: 10, //窗口的大小，显示数据的条数的
            show: true,
            handleSize: 0, //滑动条的 左右2个滑动条的大小
            height: '7%', //组件高度
            left: 65,
            right: 85,
            bottom: '-10',
            borderColor: 'rgba(43,48,67,.8)',
            fillerColor: '#33384b',
            zoomLock: true,
            brushSelect: false,
            backgroundColor: 'rgba(43,48,67,.8)', //两边未选中的滑动条区域的颜色
            showDataShadow: false, //是否显示数据阴影 默认auto
            showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
            realtime: true, //是否实时更新
            xAxisIndex: [0] //控制的 x轴
          }
        ],
        legend: {
          data: ['销售数量','销售金额']
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              formatter: function (params:any) {
                let newParamsName = '';
                const paramsNameNumber = params.length; // 文字总长度
                const provideNumber = 6; //一行显示几个字
                const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                if (paramsNameNumber > provideNumber) {
                  for (let p = 0; p < rowNumber; p++) {
                    const start = p * provideNumber;
                    const end = start + provideNumber;
                    const tempStr = p === rowNumber - 1 ? params.substring(start, paramsNameNumber) : params.substring(start, end) + '\n';
                    newParamsName += tempStr;
                  }
                } else {
                  newParamsName = params;
                }
                return newParamsName;
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '销售数量',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 吨',
            }
          },
          {
            type: 'value',
            name: '销售金额',
            min: 0,
            max: 500,
            interval: 100,
            axisLabel: {
              formatter: '{value} 万元',
            }
          }
        ],
        series: [
          {
            type: 'bar',
            name: '销售数量',
            data: []
          },
          {
            type: 'line',
            name: '销售金额',
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近半年',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一年',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            }
          }
        ]
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
    client_list() {
      return this.$store.state.api.client.arr
    },
    yarn_list() {
      return this.$store.state.api.yarnType.arr.map((item: any) => {
        return {
          value: item.name,
          label: item.name,
          children: item.yarns.map((itemChild: any) => {
            return {
              value: itemChild.name,
              label: itemChild.name
            }
          })
        }
      })
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
      this.getSaleClient()
      this.getYarnTypeInfo()
    },
    getSaleClient() {
      if(!this.saleObj.date) {
        this.saleObj.date = [new Date().getFullYear() + '-01-01',this.$getDate(new Date())]
      }
      dateStatic
        .clientSellCharts({
          client_id: this.saleObj.id,
          start_time: this.saleObj.date[0],
          end_time: this.saleObj.date[1]
        })
        .then((res) => {
          let charts_data = res.data.data.charts_data
          let client_data = res.data.data.client_data
          this.saleInfo.client_data = client_data.sort((a:any,b:any) => {
            return b.price - a.price
          }).map((item:any) => {
            item.price = (item.price / 10000).toFixed(2)
            return item
          })
          this.saleInfo.total_price = client_data.reduce((a:any,b:any) => {
            return a + Number(b.price)
          },0).toFixed(2)
          this.saleInfo.total_weight = charts_data.reduce((a:any,b:any) => {
            return a + Number((b.weight / 1000).toFixed(2))
          },0).toFixed(2)
          this.option1.series[0].data = []
          this.option1.series[1].data = []
          let maxPrice: any,
            minPrice: any,
            maxWeight: any,
            minWeight: any = 0

          if (charts_data.length !== 0) {
            //  销售金额
            maxPrice = Object.values(charts_data).reduce((num1: any, num2: any) => {
              return +num1.price > +num2.price ? num1 : num2
            })
            minPrice = Object.values(charts_data).reduce((num1: any, num2: any) => {
              return +num1.price < +num2.price ? num1 : num2
            })

            // 销售数量
            maxWeight = Object.values(charts_data).reduce((num1: any, num2: any) => {
              return +num1.weight > +num2.weight ? num1 : num2
            })
            minWeight = Object.values(charts_data).reduce((num1: any, num2: any) => {
              return +num1.weight < +num2.weight ? num1 : num2
            })

            // 拿到销售金额的最大值和最小值
            maxPrice = +maxPrice.price
            minPrice = +minPrice.price

            // 拿到销售数量的最大值和最小值
            maxWeight = +maxWeight.weight
            minWeight = +minWeight.weight
          }

          // 销售数量 图表更新
          this.option1.yAxis[0].max = Math.ceil(Math.ceil(maxWeight / 1000 / 5)) * 5 || 10
          this.option1.yAxis[0].min = minWeight && minWeight < 0 ? Math.ceil(minWeight / 1000) : 0
          this.option1.yAxis[0].interval = Math.ceil(maxWeight / 1000 / 5) || 10

          // 销售金额 图表更新
          this.option1.yAxis[1].max = Math.ceil(Math.ceil(maxPrice / 10000 / 5)) * 5 || 10
          this.option1.yAxis[1].min = minPrice && minPrice < 0 ? Math.ceil(minPrice / 10000) : 0
          this.option1.yAxis[1].interval = Math.ceil(maxPrice / 10000 / 5) || 10

          this.option1.series[0].data = charts_data.map((item: any) => {
            return (item.weight / 1000).toFixed(2)
          })
          this.option1.series[1].data = charts_data.map((item: any) => {
            return (item.price / 10000).toFixed(2)
          })
        })
    },
    getYarnTypeInfo() {
      if(!this.yarnTypeObj.date) {
        this.yarnTypeObj.date = [new Date().getFullYear() + '-01-01',this.$getDate(new Date())]
      }

      dateStatic
        .materialSellCharts({
          product_name: this.yarnTypeObj.name[1],
          start_time: this.yarnTypeObj.date[0],
          end_time: this.yarnTypeObj.date[1]
        })
        .then((res) => {
          let charts_data = res.data.data.charts_data.sort((a:any,b:any) => {
            if (this.yarnTypeObj.sortWay === 1) {
              return b.number - a.number
            } else if (this.yarnTypeObj.sortWay === 2) {
              return b.price - a.price
            }
          })
          let material_data = res.data.data.material_data
          this.yarnTypeInfo.material_data = material_data.sort((a:any,b:any) => {
            return b.price - a.price
          }).map((item:any) => {
            item.price = (item.price / 10000).toFixed(2)
            return item
          })
          this.yarnTypeInfo.total_price = material_data.reduce((a:any,b:any) => {
            return a + Number(b.price)
          },0).toFixed(2)
          this.yarnTypeInfo.total_number = charts_data.reduce((a:any,b:any) => {
            return a + Number((b.number / 1000).toFixed(2))
          },0).toFixed(2)
          this.option2.series[0].data = []
          this.option2.series[1].data = []
          let maxPrice: any,
            minPrice: any,
            maxWeight: any,
            minWeight: any = 0

          if (charts_data.length !== 0) {
            //  销售金额
            maxPrice = Object.values(charts_data).reduce((num1: any, num2: any) => {
              return +num1.price > +num2.price ? num1 : num2
            })
            minPrice = Object.values(charts_data).reduce((num1: any, num2: any) => {
              return +num1.price < +num2.price ? num1 : num2
            })

            // 销售数量
            maxWeight = Object.values(charts_data).reduce((num1: any, num2: any) => {
              return +num1.number > +num2.number ? num1 : num2
            })
            minWeight = Object.values(charts_data).reduce((num1: any, num2: any) => {
              return +num1.number < +num2.number ? num1 : num2
            })

            // 拿到销售金额的最大值和最小值
            maxPrice = +maxPrice.price
            minPrice = +minPrice.price

            // 拿到销售数量的最大值和最小值
            maxWeight = +maxWeight.number
            minWeight = +minWeight.number
          }

          // 销售数量 图表更新
          this.option2.yAxis[0].max = Math.ceil(Math.ceil(maxWeight / 1000 / 5)) * 5 || 10
          this.option2.yAxis[0].min = minWeight && minWeight < 0 ? Math.ceil(minWeight / 1000) : 0
          this.option2.yAxis[0].interval = Math.ceil(maxWeight / 1000 / 5) || 10

          // 销售金额 图表更新
          this.option2.yAxis[1].max = Math.ceil(Math.ceil(maxPrice / 10000 / 5)) * 5 || 10
          this.option2.yAxis[1].min = minPrice && minPrice < 0 ? Math.ceil(minPrice / 10000) : 0
          this.option2.yAxis[1].interval = Math.ceil(maxPrice / 10000 / 5) || 10

          this.option2.xAxis[0].data = charts_data.map((item: any) => {
            return item.name
          })
          this.option2.series[0].data = charts_data.map((item: any) => {
            return (item.number / 1000).toFixed(2)
          })
          this.option2.series[1].data = charts_data.map((item: any) => {
            return (item.price / 10000).toFixed(2)
          })
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
    this.$checkCommonInfo([
      {
        checkWhich: 'api/client',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPartyBAsync'
      },
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      }
    ])
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
.bgBlue {
  background-color: #1a95ff;
  text-align: center;
  padding: 5px;
  border-radius: 1.5em;
  line-height: 1.5em;
  width: 1.5em;
  height: 1.5em;
}
</style>
<template>
  <div id="index">
    <div class="header">
      <div class="navCtn">
        <div class="leftCtn">
          <div class="companyCtn">
            <div class="logo">
              <!-- <img src="https://i0.hdslb.com/bfs/face/member/noface.jpg@140w_140h_1c.webp" /> -->
            </div>
            <div class="name"
              @click="$router.push('/homePage/homePage')">随便啥公司</div>
          </div>
          <el-menu class="el-menu-demo"
            mode="horizontal"
            @select="goRouter"
            background-color="#637AA7"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="/product/list/page=1&&page_size=10&&name=&&color=&&attribute=&&yarn_type=">纱线管理</el-menu-item>
            <el-submenu index='2'>
              <template slot="title">订单管理</template>
              <el-menu-item index="/order/list/1">订单列表</el-menu-item>
              <el-menu-item index="/orderProcessYarn/list/1">订购加工</el-menu-item>
            </el-submenu>
            <el-menu-item index="/store/list">库存管理</el-menu-item>
            <el-menu-item index="4">财务管理</el-menu-item>
            <el-submenu index='5'>
              <template slot="title">系统设置</template>
              <el-menu-item index="/settings/user">用户管理</el-menu-item>
              <el-menu-item index="/settings/yarnType">纱线类型管理</el-menu-item>
              <el-menu-item index="/settings/factory">加工厂管理</el-menu-item>
              <el-menu-item index="/settings/supplier">供货商管理</el-menu-item>
              <el-menu-item index="/settings/client">客户管理</el-menu-item>
              <el-menu-item index="/settings/color">颜色管理</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
        <div class="rightCtn">
        </div>
      </div>
    </div>
    <div class="breadCtn">
      <div class="bread">
        <span class="breadText"
          v-for="(item,index) in breadUrl"
          :key="index"
          @click="index<breadUrl.length-1?$router.push(item.url):$message.warning('已经在当前页')">{{item.name}}</span>
      </div>
    </div>
    <div class="body">
      <div class="main">
        <!-- keep-alive是Vue提供的一个抽象组件，用来对组件进行缓存  -->
        <router-view />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {}
  },
  computed: {
    breadUrl() {
      return this.$store.state.status.breadUrl
    }
  },
  methods: {
    goRouter(url: string) {
      this.$router.push(url)
    }
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/less/index.less';
</style>

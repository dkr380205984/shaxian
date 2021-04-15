<template>
  <div id="index">
    <div class="header">
      <div class="navCtn">
        <div class="leftCtn">
          <div class="companyCtn">
            <div class="logo">
              <img src="https://i.52112.com/icon/jpg/256/20210201/109356/4368449.jpg" />
            </div>
            <div class="name"
              @click="$router.push('/homePage/homePage')">{{window.sessionStorage.getItem('full_name')}}</div>
          </div>
          <el-menu class="el-menu-demo"
            mode="horizontal"
            @select="goRouter"
            background-color="#637AA7"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu index='0'>
              <template slot="title">产品管理</template>
              <el-menu-item index="/product/list?page=1&page_size=10&name=&color=&attribute=&yarn_type=">
                <i class="iconfont iconTitle">&#xe617;</i>纱线列表
              </el-menu-item>
              <el-menu-item index="/material/list?page=1&type=&name=&page_size=10">
                <i class="iconfont iconTitle">&#xe620;</i>毛条列表
              </el-menu-item>
            </el-submenu>
            <el-submenu index='2'>
              <template slot="title">订单管理</template>
              <el-menu-item index="/order/list?page=1&order_code=&product_name=&client_id=&user_id=&page_size=10&date=">
                <i class="iconfont iconTitle">&#xe61b;</i>订单列表
              </el-menu-item>
              <el-menu-item index="/directOrder/yarnList?page=1&code=&name=&client_id=&user_id=&page_size=10&date=">
                <i class="iconfont iconTitle">&#xe616;</i>纱线采购列表
              </el-menu-item>
              <el-menu-item index="/directProcess/yarnList?page=1&code=&name=&client_id=&user_id=&page_size=10&date=">
                <i class="iconfont iconTitle">&#xe61a;</i>纱线加工列表
              </el-menu-item>
              <el-menu-item index="/directOrder/materialList?page=1&code=&name=&client_id=&user_id=&page_size=10&date=">
                <i class="iconfont iconTitle">&#xe61e;</i>毛条采购列表
              </el-menu-item>
              <el-menu-item index="/material/craftList?page=1&code=&name=&client_id=&user_id=&status=&page_size=10&date=">
                <i class="iconfont iconTitle">&#xe61f;</i>工艺单列表
              </el-menu-item>
            </el-submenu>
            <el-submenu index='3'>
              <template slot="title">库存管理</template>
              <el-menu-item index="/store/list?page=&type=&name=&page_size=">
                <i class="iconfont iconTitle">&#xe61c;</i>纱线库存
              </el-menu-item>
              <el-menu-item index="/store/materialList?page=&type=&name=&page_size=">
                <i class="iconfont iconTitle">&#xe618;</i>毛条库存
              </el-menu-item>
            </el-submenu>
            <!-- <el-menu-item index="4">财务管理</el-menu-item> -->
            <el-submenu index='5'>
              <template slot="title">系统设置</template>
              <el-menu-item index="/settings/user"><i class="iconfont iconTitle">&#xe615;</i>用户管理</el-menu-item>
              <el-menu-item index="/settings/yarnType"><i class="iconfont iconTitle">&#xe615;</i>纱线类型管理</el-menu-item>
              <el-menu-item index="/settings/factory"><i class="iconfont iconTitle">&#xe615;</i>加工厂管理</el-menu-item>
              <el-menu-item index="/settings/supplier"><i class="iconfont iconTitle">&#xe615;</i>供货商管理</el-menu-item>
              <el-menu-item index="/settings/client"><i class="iconfont iconTitle">&#xe615;</i>客户管理</el-menu-item>
              <el-menu-item index="/settings/color"><i class="iconfont iconTitle">&#xe615;</i>颜色管理</el-menu-item>
              <el-menu-item index="/settings/print"><i class="iconfont iconTitle">&#xe615;</i>打印设置</el-menu-item>
              <el-menu-item index="/settings/material"><i class="iconfont iconTitle">&#xe615;</i>毛条类型管理</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
        <div class="rightCtn">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-user-solid"></i>
              个人中心<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="changePasPopupFlag = true">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="$router.push('/login')">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
    <div class="popup"
      v-if="changePasPopupFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">修改密码</span>
          <span class="el-icon-close"
            @click="changePasPopupFlag = false"></span>
        </div>
        <div class="contentCtn">
          <div class="row">
            <span class="label">新密码：</span>
            <span class="info">
              <el-input placeholder="请输入新密码"
                v-model="firstPasd"></el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">确认密码：</span>
            <span class="info">
              <el-input placeholder="请再次输入新密码"
                v-model="lastPasd"></el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">验证码：</span>
            <span class="info">
              <el-input placeholder="请输入验证码"
                v-model="verificationCode">
                <template slot="append">
                  <div :class="{'canHandle':!resetTime,'notHandle':resetTime}"
                    @click="sendVerificationCode">{{resetTime ? `${resetTime}s后重试` : '发送验证码'}}</div>
                </template>
              </el-input>
            </span>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="changePasPopupFlag = false">取消</div>
          <div class="opr orange"
            @click="changePasd">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { changeUserPasd } from '@/assets/js/api'
export default Vue.extend({
  data() {
    return {
      changePasPopupFlag: false,
      verificationCode: '',
      lastTime: 0,
      resetTime: 0,
      sendIntervalTime: 60, // 方便后期修改间隔时间
      firstPasd: '',
      lastPasd: ''
    }
  },
  computed: {
    breadUrl() {
      return this.$store.state.status.breadUrl
    }
  },
  methods: {
    goRouter(url: string) {
      this.$router.push(url)
    },
    // 发送验证码
    sendVerificationCode() {
      const outTime = (new Date().getTime() - this.lastTime) / 1000
      if (!this.lastTime || outTime > this.sendIntervalTime) {
        changeUserPasd.sendVerificationCode().then((res) => {
          if (res.data.status !== false) {
            this.$message.success(`我们已向您的手机号发送一条6位长度验证码，请注意查收`)
            this.lastTime = new Date().getTime() // 记录点击时间
            this.sendInterval()
          }
        })
      } else {
        this.$message.warning(`${this.resetTime}s后在重试`)
      }
    },
    // 重试倒计时
    sendInterval() {
      const outTime = (new Date().getTime() - this.lastTime) / 1000
      this.resetTime = Math.ceil(this.sendIntervalTime - outTime)
      if (outTime <= this.sendIntervalTime) {
        window.requestAnimationFrame(() => {
          this.sendInterval()
        })
      }
    },
    changePasd() {
      if (!/^[0-9]{4}$/.test(this.verificationCode)) {
        this.$message.error('请输入正确的4位数字验证码')
        return
      }
      if (!this.firstPasd || !this.lastPasd) {
        this.$message.error('请输入新密码')
        return
      }
      if (this.firstPasd !== this.lastPasd) {
        this.$message.warning('请确认输入的密码一致')
      } else {
        changeUserPasd
          .updated({
            sms_code: this.verificationCode,
            new_pass: this.firstPasd
          })
          .then((res) => {
            if (res.data.status !== false) {
              this.$message.success('修改密码成功，请重新登录')
              this.$router.push('/login')
            }
          })
      }
    }
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/less/index.less';
</style>

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
            <el-submenu v-for="item in module_arr"
              :key="item.id"
              :index="item.id">
              <template slot="title">{{item.label}}</template>
              <el-menu-item v-for="itemChild in item.children"
                :key="itemChild.id"
                :index="itemChild.url">
                <i class="iconfont iconTitle"
                  v-html="itemChild.icon"></i>{{itemChild.label}}
              </el-menu-item>
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
import { moduleList } from '@/assets/js/settingCommon'
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
    },
    module_arr() {
      const userModule = JSON.parse(window.sessionStorage.getItem('module_info') as string)
      const selfModule = this.$clone(moduleList)
      return selfModule
        .map((item) => {
          item.children = item.children.filter((itemChild) => {
            return userModule.indexOf(itemChild.id) !== -1
          })
          return item
        })
        .filter((item) => {
          return item.children.length > 0
        })
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

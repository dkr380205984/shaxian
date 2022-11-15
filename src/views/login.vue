<template>
  <div id="login">
    <div class="leftCtn">
      <div class="title">
        织为云 <br />
        纱线管理系统
      </div>
      <div class="input_container account">
        <div class="icon">
          <span class="iconfont account"></span>
        </div>
        <el-input class="input_item"
          v-model="telephone"
          placeholder="请输入帐号"></el-input>
      </div>
      <div class="input_container password">
        <div class="icon">
          <span class="iconfont password"></span>
        </div>
        <el-input type='password'
          class="input_item"
          v-model="password"
          placeholder="请输入密码"></el-input>
      </div>
      <div class="rememberOrForgetCtn">
        <div class="remember_psd">
          <el-checkbox v-model="remPsd">记住密码</el-checkbox>
        </div>
        <div class="forget_psd"
          @click="$message.warning('请联系管理员重置密码')">忘记密码？</div>
      </div>
      <div class="login"
        @click="goLogin">登录</div>
      <!-- <div class="buy_account">没有账号？<span class="buy_link">去购买</span></div> -->
      <div class="bottomInfo">
        <div class="line">©zwyknit.com版权所有 数据应用服务：浙ICP备 <a target="_blank"
            href="http://www.miit.gov.cn/">19041626号</a></div>
      </div>
    </div>
    <div class="rightCtn">
      <img :src="require('@/assets/image/login/login_1.jpg')"
        style="width:100%"
        alt="">
    </div>
  </div>
</template>

<script lang="ts">
import { login } from '@/assets/js/api'
import { Vue } from 'vue-property-decorator'
export default Vue.extend({
  data(): {
    telephone: string | null
    password: string | null
    remPsd: boolean
    imageArr: string[]
  } {
    return {
      telephone: window.localStorage.getItem('zhUserName'),
      password: window.localStorage.getItem('zhPassWord'),
      remPsd: !!Number(window.localStorage.getItem('remPsd')),
      imageArr: [
        require('@/assets/image/login/login_1.jpg'),
        require('@/assets/image/login/login_1.jpg'),
        require('@/assets/image/login/login_1.jpg')
      ]
    }
  },
  methods: {
    goLogin() {
      login({
        user_name: this.telephone,
        password: this.password
      }).then((res) => {
        if (res.data.status !== false) {
          window.localStorage.setItem('zhUserName', this.telephone as string)
          window.localStorage.setItem('remPsd', this.remPsd ? '1' : '0')
          if (this.remPsd) {
            window.localStorage.setItem('zhPassWord', this.password as string)
          } else {
            window.localStorage.removeItem('zhPassWord')
          }
          // window.sessionStorage.setItem('token_type', res.data.data.token_type)
          // window.sessionStorage.setItem('token', res.data.data.access_token)
          const { authInfo } = require('@/assets/js/api')
          authInfo().then((res2: any) => {
            if (res2.data.status !== false) {
              window.sessionStorage.setItem('logo', res2.data.data.logo)
              window.sessionStorage.setItem('alias', res2.data.data.alias)
              window.sessionStorage.setItem('phone', res2.data.data.phone || '')
              window.sessionStorage.setItem('address', res2.data.data.address || '')
              window.sessionStorage.setItem('full_name', res2.data.data.company_name)
              window.sessionStorage.setItem('user_name', res2.data.data.name)
              window.sessionStorage.setItem('module_info', res2.data.data.module_info)
              this.$router.push('/homePage/homePage')
            }
          })
        }
      })
    },
    // 注册
    goRegister() {
      this.$message.warning({
        message: '注册功能暂不开放'
      })
    },
    // 监听按enter键调用登录函数
    keyDownEnter(e: KeyboardEvent) {
      if (e.keyCode === 13) {
        this.goLogin()
      }
    }
  },
  created() {
    // window.addEventListener('keydown', this.keyDownEnter)
  }
})
</script>

<style lang='less'>
@import '~@/assets/less/login.less';
#login {
  .el-input__inner {
    padding-left: 36px;
    color: rgba(0, 0, 0, 0.65);
    background: transparent;
    border: none;
    font-size: 18px;
  }
  .el-carousel__container {
    height: 100%;
  }
  .el-carousel__indicator {
    .el-carousel__button {
      background: rgba(0, 0, 0, 0.65);
    }
    &.is-active {
      .el-carousel__button {
        background: #1a95ff;
        width: 40px;
      }
    }
  }
  .el-carousel__indicators--horizontal {
    bottom: 40px;
    right: 54px;
    left: auto;
  }
}
</style>
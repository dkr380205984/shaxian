<template>
  <div id="clientInfo"
    class="indexMain">
    <div class="module"
      style="padding-bottom:24px">
      <div class="titleCtn">
        <span class="title hasBorder">公司信息设置</span>
      </div>
      <div class="row">
        <div class="label">企业LOGO：</div>
        <div class="imgCtn">
          <el-upload class="avatar-uploader"
            drag
            action="https://upload.qiniup.com/"
            :show-file-list="false"
            :on-success="successFile"
            :before-upload="beforeAvatarUpload"
            :data="postData"
            :file-list="companyInfo.file_logo"
            ref="uploada_logo">
            <img v-if="companyInfo.logoUrl"
              :src="companyInfo.logoUrl"
              class="logo-img">
            <i v-else
              class="el-icon-plus logo-icon"></i>
          </el-upload>
          <div class="prompt">点击或拖拽图片至上传框,只能上传jpg/png文件，且不超过6MB</div>
        </div>
      </div>
      <div class="row">
        <div class="label">公司名称：</div>
        <div class="content">
          <el-input placeholder="请输入公司名称"
            class="input-item"
            v-model="companyInfo.client_name"
            disabled
            clearable>
          </el-input>
        </div>
      </div>
      <div class="row">
        <div class="label">公司简称：</div>
        <div class="content">
          <el-input placeholder="请输入公司简称"
            class="input-item"
            v-model="companyInfo.alias"
            clearable>
          </el-input>
        </div>
      </div>
      <!-- <div class="row">
        <span class="label">公司简介:</span>
        <div class="content">
          <el-input class="input-item"
            style="width:600px;"
            type="textarea"
            placeholder="公司简介在200字以内..."
            v-model="companyInfo.client_about"
            :rows="7">
          </el-input>
        </div>
      </div>
      <div class="row">
        <span class="label">公司图片：</span>
        <div class="content clientImg">
          <el-upload action="https://upload.qiniup.com/"
            drag
            :before-upload="beforeUpload"
            :data="postData"
            :file-list="companyInfo.file_image"
            list-type="picture-card"
            ref="uploada_image">
            <i slot="default"
              class="el-icon-plus"
              style="font-size:30px;"></i>
          </el-upload>
          <div class="prompt">点击或拖拽至上传框,只能上传jpg/png文件，且不超过6MB</div>
        </div>
      </div> -->
      <div class="row">
        <span class="label">公司手机:</span>
        <div class="content">
          <el-input placeholder="请输入公司手机"
            class="input-item"
            v-model="companyInfo.phone">
          </el-input>
        </div>
      </div> <!--
      <div class="row">
        <span class="label">公司邮箱：</span>
        <div class="content">
          <el-input placeholder="请输入公司邮箱"
            class="input-item"
            v-model="companyInfo.client_email">
          </el-input>
        </div>
      </div> -->
      <div class="row">
        <span class="label">公司地址：</span>
        <div class="content">
          <el-input placeholder="请输入公司地址"
            class="input-item"
            v-model="companyInfo.address">
          </el-input>
        </div>
      </div>
      <div class="row">
        <span class="label">结算方式：</span>
        <div class="content">
          <el-input placeholder="请输入结算方式"
            class="input-item"
            v-model="companyInfo.settle_type">
          </el-input>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="saveInfo">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { clientInfoSetting } from '@/assets/js/api'
export default Vue.extend({
  data() {
    return {
      postData: { key: '', token: '' },
      companyInfo: {
        alias: window.sessionStorage.getItem('alias') || '',
        logoUrl: window.sessionStorage.getItem('logo') || '',
        client_name: window.sessionStorage.getItem('full_name'),
        client_about: '',
        phone: window.sessionStorage.getItem('phone') || '',
        client_email: '',
        address: window.sessionStorage.getItem('address') || '',
        settle_type: window.sessionStorage.getItem('settle_type') || '',
        file_logo: [],
        file_image: []
      }
    }
  },
  computed: {
    token() {
      return this.$store.state.status.token
    }
  },
  methods: {
    saveInfo() {
      if (!this.companyInfo.logoUrl) {
        this.$message.error('请上传公司LOGO')
        return
      }
      clientInfoSetting({
        logo: this.companyInfo.logoUrl,
        alias: this.companyInfo.alias,
        phone: this.companyInfo.phone,
        address: this.companyInfo.address
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('设置成功,重新登陆后设置生效')
        }
      })
    },
    beforeAvatarUpload(file: any) {
      const fileName = file.name.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
      const fileNameLength = file.name.length // 取到文件名长度
      const fileFormat = file.name.substring(fileName + 1, fileNameLength) // 截
      this.postData.token = this.token
      this.postData.key = Date.parse(new Date() + '') + '.' + fileFormat
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!')
        return false
      }
    },
    successFile(response: any) {
      this.companyInfo.logoUrl = 'https://file.zwyknit.com/' + response.key
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'status/token',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getTokenAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/settings/clientInfo.less';
</style>
<style lang="less">
#clientInfo {
  .imgCtn {
    .el-upload-dragger {
      width: 100px !important;
      height: 100px !important;
      img {
        width: 100px !important;
        height: 100px !important;
      }
    }
    .el-upload {
      line-height: 100px;
      font-size: 20px;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .clientImg {
    width: 600px;
    height: auto;
    .el-upload-list {
      width: 100% !important;
    }
    .el-upload-dragger {
      width: 100% !important;
      height: 100% !important;
      border: none;
    }
  }
}
</style>
<template>
  <div class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">正常列表</span>
        <span class="addBtn btn btnMain">添加用户</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn"
          :class="{'showMore':showMore}">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div>
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
            <div class="btn btnBlue fr">放俩</div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row">
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
            </div>
            <div class="row">
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
            </div>
            <div class="row">
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
            </div>
            <div class="row">
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
            </div>
            <div class="row">
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
            </div>
            <div class="row">
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
            </div>
            <div class="row">
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
            </div>
            <div class="row">
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
            </div>
            <div class="row">
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
            </div>
            <div class="row">
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
              <div class="column min120">客户编码</div>
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
        <span class="title hasBorder">模拟可滚动的列表，还不如直接用elment-ui的</span>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="overflow">
            <div class="tableCtn">
              <div class="table">
                <div class="headCtn">
                  <div class="row">
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                  </div>
                </div>
                <div class="bodyCtn">
                  <div class="row">
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                    <div class="column min120">客户编码</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="coverTable">
            <div class="floatL">
              <div class="row">
                <div class="column min120">左遮罩</div>
              </div>
              <div class="row">
                <div class="column min120">客户编码</div>
              </div>
            </div>
            <div class="floatR">
              <div class="row">
                <div class="column min120">右遮罩</div>
              </div>
              <div class="row">
                <div class="column min120">客户编码</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      page: 1,
      total: 100,
      showMore: false,
      value: ''
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/css/list.less';
</style>
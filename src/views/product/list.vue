<template>
  <div id="productList"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">纱线列表</span>
        <span class="addBtn btn btnMain"
          @click="$router.push('/product/create')">添加纱线</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn"
          :class="{'showMore':showMore}">
          <div class="leftCtn">
            <div class="label">筛选条件：</div>
            <div class="showMore"
              @click="showMore=!showMore">{{!showMore?'展示更多':'收起筛选'}}</div>
            <div class="elCtn">
              <el-select v-model="value"
                placeholder="选择纱线类型"></el-select>
            </div>
            <div class="elCtn">
              <el-input v-model="value"
                placeholder="输入纱线名称"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="value"
                placeholder="输入纱线颜色"></el-input>
            </div>
            <div class="elCtn">
              <el-input v-model="value"
                placeholder="输入纱线属性"></el-input>
            </div>
            <div class="elCtn">
              <el-select v-model="page_size"
                placeholder="选择每页展示的条数">
                <el-option label="10"
                  :value="10"></el-option>
                <el-option label="20"
                  :value="20"></el-option>
                <el-option label="30"
                  :value="30"></el-option>
              </el-select>
            </div>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray fr">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="headCtn">
            <div class="row">
              <div class="column">类型</div>
              <div class="column">名称</div>
              <div class="column">颜色</div>
              <div class="column">属性</div>
              <div class="column">参考价格(元)
                <el-tooltip class="item"
                  effect="dark"
                  content="Top Center 提示文字"
                  placement="top">
                  <i class="el-icon-question elicon"></i>
                </el-tooltip>
              </div>
              <div class="column">库存(kg)
                <sort v-model="sort_store"></sort>
              </div>
              <div class="column">创建人</div>
              <div class="column">操作</div>
            </div>
          </div>
          <div class="bodyCtn">
            <div class="row">
              <div class="column">类型</div>
              <div class="column">名称</div>
              <div class="column">颜色</div>
              <div class="column">属性</div>
              <div class="column">参考价格(元)</div>
              <div class="column">库存(kg)</div>
              <div class="column">创建人</div>
              <div class="column">
                <div class="opr blue">详情</div>
                <div class="opr orange">修改</div>
                <div class="opr red">删除</div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :current-page.sync="page"
            :page-size="page_size"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
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
      page_size: 10,
      showMore: false,
      value: '',
      sort_store: 0
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/css/list.less';
</style>
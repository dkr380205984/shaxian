<template>
  <div id="productCreate"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">添加纱线</span>
      </div>
      <div class="createCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">纱线类型</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-select v-model="value"
                  placeholder="请选择纱线类型"></el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3"
            v-if="name_flag === 'easy'">
            <div class="label">
              <span class="text">纱线名称</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input v-model="value"
                  placeholder="请输入"></el-input>
              </div>
            </div>
          </div>
          <div class="colCtn"
            v-if="name_flag==='complex'">
            <div class="label">
              <span class="text">纱线名称</span>
              <span class="explanation">(批量填写)</span>
            </div>
            <div class="content">
              <div class="complexCtn">
                <el-input class="el"
                  v-model="value"
                  placeholder="支数间隔值"></el-input>
                <el-input class="el"
                  v-model="value"
                  placeholder="支数最小值"></el-input>
                <span class="icon">-</span>
                <el-input class="el"
                  v-model="value"
                  placeholder="支数最大值"></el-input>
                <el-select class="el"
                  v-model="value"
                  placeholder="支数单位">
                  <el-option label="支"
                    value="支"></el-option>
                  <el-option label="cm"
                    value="cm"></el-option>
                  <el-option label="公分"
                    value="公分"></el-option>
                  <el-option label="S"
                    value="S"></el-option>
                </el-select>
                <span class="icon">/</span>
                <el-input class="el"
                  v-model="value"
                  placeholder="股数间隔值"></el-input>
                <el-input class="el"
                  v-model="value"
                  placeholder="股数最小值"></el-input>
                <span class="icon">-</span>
                <el-input class="el"
                  v-model="value"
                  placeholder="股数最大值"></el-input>
                <el-input class="el big"
                  v-model="value"
                  placeholder="纱线名称"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">纱线颜色</span>
              <span class="explanation">(不填则默认为白胚)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-input placeholder="请输入纱线颜色"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">纱线属性</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="content">
              <div class="elCtn">
                <el-select v-model="value"
                  placeholder="请选择纱线属性"></el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">纱线名称预览:</span>
              <span class="blue"
                style="cursor:pointer;margin-left:12px">点击加载名称</span>
            </div>
            <div class="content autoHeight">
              <div class="tableCtn">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn">纱线名称</div>
                    <div class="tcolumn noPad"
                      style="flex:5">
                      <div class="trow">
                        <div class="tcolumn">纱线颜色</div>
                        <div class="tcolumn">纱线属性</div>
                        <div class="tcolumn">纱线价格</div>
                        <div class="tcolumn">备注信息</div>
                        <div class="tcolumn">操作</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="noData"
                    v-show="false">暂无预览</div>
                  <div class="trow">
                    <div class="tcolumn">纱线名称</div>
                    <div class="tcolumn noPad"
                      style="flex:5">
                      <div class="trow">
                        <div class="tcolumn">纱线颜色</div>
                        <div class="tcolumn">纱线属性</div>
                        <div class="tcolumn">纱线价格</div>
                        <div class="tcolumn">备注信息</div>
                        <div class="tcolumn">操作</div>
                      </div>
                      <div class="trow">
                        <div class="tcolumn">纱线颜色</div>
                        <div class="tcolumn">纱线属性</div>
                        <div class="tcolumn">纱线价格</div>
                        <div class="tcolumn">备注信息</div>
                        <div class="tcolumn">操作</div>
                      </div>
                    </div>
                  </div>
                  <div class="trow">
                    <div class="tcolumn">纱线名称</div>
                    <div class="tcolumn noPad"
                      style="flex:5">
                      <div class="trow">
                        <div class="tcolumn">纱线颜色</div>
                        <div class="tcolumn">纱线属性</div>
                        <div class="tcolumn">纱线价格</div>
                        <div class="tcolumn">备注信息</div>
                        <div class="tcolumn">操作</div>
                      </div>
                      <div class="trow">
                        <div class="tcolumn">纱线颜色</div>
                        <div class="tcolumn">纱线属性</div>
                        <div class="tcolumn">纱线价格</div>
                        <div class="tcolumn">备注信息</div>
                        <div class="tcolumn">操作</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue">提交</div>
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
      name_flag: 'complex',
      value: ''
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/less/product/create.less';
</style>
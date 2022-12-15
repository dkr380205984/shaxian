<template>
  <div class="zhList fixedTableCtn" v-loading="loading">
    <div class="original" @mousewheel.prevent="listenWheel" :ref="listId">
      <div class="row title">
        <div class="column check" v-if="check">
          <span>全选</span>
        </div>
        <div
          class="column"
          v-for="itemKey in listKey"
          :key="itemKey.index + Math.random(1)"
          v-show="itemKey.ifShow"
          :class="{
            orderProcess: itemKey.specialForOrderPrcess === 'order',
            sampleOrderProcess: itemKey.specialForOrderPrcess === 'sampleOrder'
          }"
        >
          {{ itemKey.name }}
        </div>
        <div class="column w130">操作</div>
      </div>
      <div class="row" v-for="(item, index) in list" :key="index + Math.random(1)">
        <div class="column check" v-if="check"></div>
        <div
          class="column"
          v-for="itemKey in listKey"
          :key="itemKey.index + Math.random(1)"
          v-show="itemKey.ifShow"
          :class="{
            orderProcess: itemKey.specialForOrderPrcess === 'order',
            sampleOrderProcess: itemKey.specialForOrderPrcess === 'sampleOrder'
          }"
        >
          <!-- 普通元素 -->
          <template v-if="!itemKey.from && !itemKey.ifImage && !itemKey.specialForOrderPrcess">
            <!-- 订单状态专用 -->
            <template v-if="itemKey.isStatus">
              <span
                :class="itemKey.class || (itemKey.classArr ? itemKey.classArr[item[itemKey.key]] : '')"
                class="text"
              >
                {{ itemKey.filterArr ? itemKey.filterArr[item[itemKey.key]] : item[itemKey.key] }}
                {{ item[itemKey.key] && item[itemKey.key].count ? '(' + item[itemKey.key].count + '张)' : '' }}
              </span>
            </template>
            <!-- 订单进度专用 -->
            <template v-else-if="itemKey.isProgress">
              <span :class="itemKey.class || (item[itemKey.key].progress < 100 ? 'orange' : 'green')" class="text">
                {{ item[itemKey.key].progress || itemKey.errVal }}%</span
              >
            </template>
            <!-- 数字转带逗号字符串专用 -->
            <template v-else-if="itemKey.numberToString">
              <span :class="itemKey.class" class="text">
                {{
                  $toFixed(item[itemKey.key], 3, true) ||
                  $toFixed(item[itemKey.otherkey], 3, true) ||
                  itemKey.errVal ||
                  '未填写'
                }}{{ itemKey.unitKey ? item[itemKey.unitKey] : itemKey.unit }}</span
              >
            </template>
            <template v-else>
              <!-- 草稿标记 -->
              <span
                class="circle"
                v-if="itemKey.ifCaogao"
                :class="item[itemKey.ifCaogao] === 1 ? 'backOrange' : 'backBlue'"
                >{{ item[itemKey.ifCaogao] === 1 ? itemKey.caogaoArr[0] : itemKey.caogaoArr[1] }}</span
              >
              <span
                :class="itemKey.class || (itemKey.classArr ? itemKey.classArr[item[itemKey.key]] : '')"
                class="text"
              >
                {{
                  itemKey.filterArr
                    ? itemKey.filterArr[item[itemKey.key]]
                    : item[itemKey.key] || item[itemKey.otherkey] || itemKey.errVal || '未填写'
                }}{{ itemKey.unitKey ? item[itemKey.unitKey] : itemKey.unit }}
              </span>
            </template>
          </template>
          <!-- 普通图片元素 -->
          <template v-if="!itemKey.from && itemKey.ifImage">
            <div class="imageCtn">
              <el-image
                :src="
                  item[itemKey.key].length > 0
                    ? item[itemKey.key][0] + '?imageView2/1/w/100/100'
                    : require('@/assets/image/common/noPic.png')
                "
                :preview-src-list="item[itemKey.key]"
              >
              </el-image>
            </div>
          </template>
          <!-- 类似订单里包含多个产品信息的元素 -->
          <template v-if="itemKey.from && !itemKey.ifImage && itemKey.mark">
            <div class="sortCtn">
              <i class="el-icon-caret-top" @click="changeIndex(1, item[itemKey.from].length, item)"></i>
              <span class="number">{{ (item.whichIndex || 0) + 1 + '/' + item[itemKey.from].length }}</span>
              <i class="el-icon-caret-bottom" @click="changeIndex(2, item[itemKey.from].length, item)"></i>
            </div>
            {{
              item[itemKey.from].length > 0
                ? item[itemKey.from][item.whichIndex || 0][itemKey.key] ||
                  item[itemKey.from][item.whichIndex || 0][itemKey.otherkey] ||
                  itemKey.errVal ||
                  '未填写'
                : '未填写'
            }}
          </template>
          <template v-if="itemKey.from && itemKey.ifImage">
            <div class="imageCtn">
              <el-image
                :src="
                  item[itemKey.from][item.whichIndex || 0][itemKey.key].length > 0
                    ? item[itemKey.from][item.whichIndex || 0][itemKey.key][0] + '?imageView2/1/w/100/100'
                    : require('@/assets/image/common/noPic.png')
                "
                :preview-src-list="item[itemKey.from][item.whichIndex || 0][itemKey.key]"
              >
              </el-image>
            </div>
          </template>
          <template v-if="itemKey.from && !itemKey.ifImage && !itemKey.mark">
            {{
              item[itemKey.from].length > 0
                ? item[itemKey.from][item.whichIndex || 0][itemKey.key] ||
                  item[itemKey.from][item.whichIndex || 0][itemKey.otherkey] ||
                  itemKey.errVal ||
                  '未填写'
                : '未填写'
            }}
          </template>
          <!-- 特殊元素，给订单流程搞得特殊值 -->
          <template v-if="itemKey.specialForOrderPrcess === 'order'">
            <div class="processCtn">
              <div
                class="process"
                :class="{
                  green: item.has_quote.status === 1,
                  gray: item.has_quote.status === 2,
                  orange: item.has_quote.status === 3
                }"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="
                    '报价单' +
                    (item.has_quote.status !== 2 ? '已添加(更新日期:' + item.has_quote.update_time + ')' : '未添加')
                  "
                  placement="top"
                >
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-baojiadan1"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div
                class="process"
                :class="{
                  green: item.has_material_plan.status === 1,
                  gray: item.has_material_plan.status === 2,
                  orange: item.has_material_plan.status === 3
                }"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="
                    '原料计划' +
                    (item.has_material_plan.status !== 2
                      ? (item.has_material_plan.status === 1 ? '已添加(更新日期:' : '部分添加(更新日期:') +
                        item.has_material_plan.update_time +
                        ')'
                      : '未添加')
                  "
                  placement="top"
                >
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-yuanliaojihua1"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div
                class="process"
                :class="{ green: item.has_material_order.status === 1, gray: item.has_material_order.status === 2 }"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="
                    '原料采购' +
                    (item.has_material_order.status === 1
                      ? '已添加(更新日期:' + item.has_material_order.update_time + ')'
                      : '未添加')
                  "
                  placement="top"
                >
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-yuanliaocaigou1"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div
                class="process"
                :class="{
                  green: item.push_progress.progress === 100 || item.push_progress.progress > 100,
                  orange: item.push_progress.progress > 0 && item.push_progress.progress < 100,
                  gray: !item.push_progress.progress
                }"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="
                    '原料入库进度' +
                    (item.push_progress.progress || 0) +
                    '%(更新日期:' +
                    (item.push_progress.update_time || '无') +
                    ')'
                  "
                  placement="top"
                >
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-yuanliaoruku1"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div
                class="process"
                :class="{
                  green: item.pop_progress.progress === 100 || item.pop_progress.progress > 100,
                  orange: item.pop_progress.progress > 0 && item.pop_progress.progress < 100,
                  gray: !item.pop_progress.progress
                }"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="
                    '原料出库进度' +
                    (item.pop_progress.progress || 0) +
                    '%(更新日期:' +
                    (item.pop_progress.update_time || '无') +
                    ')'
                  "
                  placement="top"
                >
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-yuanliaochuku1"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div
                class="process"
                :class="{ green: item.has_weave_plan.status === 1, gray: item.has_weave_plan.status === 2 }"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="
                    '生产计划' +
                    (item.has_weave_plan.status === 1
                      ? '已添加(更新日期:' + item.has_weave_plan.update_time + ')'
                      : '未添加')
                  "
                  placement="top"
                >
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-shengchanjihua3"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div
                class="process"
                :class="{
                  green: item.inspection_push_progress.progress === 100 || item.inspection_push_progress.progress > 100,
                  orange: item.inspection_push_progress.progress > 0 && item.inspection_push_progress.progress < 100,
                  gray: !item.inspection_push_progress.progress
                }"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="
                    '生产检验进度' +
                    (item.inspection_push_progress.progress || 0) +
                    '%(更新日期:' +
                    (item.inspection_push_progress.update_time || '无') +
                    ')'
                  "
                  placement="top"
                >
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-jianyanchuku"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div
                class="process"
                :class="{ green: item.has_pack_order.status === 1, gray: item.has_pack_order.status === 2 }"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="
                    '包装订购' +
                    (item.has_pack_order.status === 1
                      ? '已添加(更新日期:' + item.has_pack_order.update_time + ')'
                      : '未添加')
                  "
                  placement="top"
                >
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-baozhuangcaigou1"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div
                class="process"
                :class="{
                  green: item.transport_progress >= 100,
                  gray: item.transport_progress === 0,
                  orange: item.transport_progress > 0 && item.transport_progress < 100
                }"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="'装箱进度' + (item.transport_progress || '0') + '%'"
                  placement="top"
                >
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-zhuangxiangchuku1"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div
                class="process"
                :class="{ green: item.has_invoice.status === 1, gray: item.has_invoice.status === 2 }"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="
                    '开票金额' +
                    (item.has_invoice.status === 1 ? '已添加(更新日期:' + item.has_invoice.update_time + ')' : '未添加')
                  "
                  placement="top"
                >
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-caiwukaipiao1"></use>
                  </svg>
                </el-tooltip>
              </div>
            </div>
          </template>
          <template v-if="itemKey.specialForOrderPrcess === 'sampleOrder'">
            <div class="processCtn">
              <div class="processCtn">
                <div
                  class="process"
                  :class="{
                    green: item.has_quote.status === 1,
                    gray: item.has_quote.status === 2,
                    orange: item.has_quote.status === 3
                  }"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      '报价单' +
                      (item.has_quote.status !== 2 ? '已添加(更新日期:' + item.has_quote.update_time + ')' : '未添加')
                    "
                    placement="top"
                  >
                    <svg class="iconFont" aria-hidden="true">
                      <use xlink:href="#icon-baojiadan1"></use>
                    </svg>
                  </el-tooltip>
                </div>
                <div
                  class="process"
                  :class="{
                    green: item.has_material_plan.status === 1,
                    gray: item.has_material_plan.status === 2,
                    orange: item.has_material_plan.status === 3
                  }"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      '原料计划' +
                      (item.has_material_plan.status !== 2
                        ? (item.has_material_plan.status === 1 ? '已添加(更新日期:' : '部分添加(更新日期:') +
                          item.has_material_plan.update_time +
                          ')'
                        : '未添加')
                    "
                    placement="top"
                  >
                    <svg class="iconFont" aria-hidden="true">
                      <use xlink:href="#icon-yuanliaojihua1"></use>
                    </svg>
                  </el-tooltip>
                </div>
                <div
                  class="process"
                  :class="{ green: item.has_material_order.status === 1, gray: item.has_material_order.status === 2 }"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      '原料采购' +
                      (item.has_material_order.status === 1
                        ? '已添加(更新日期:' + item.has_material_order.update_time + ')'
                        : '未添加')
                    "
                    placement="top"
                  >
                    <svg class="iconFont" aria-hidden="true">
                      <use xlink:href="#icon-yuanliaocaigou1"></use>
                    </svg>
                  </el-tooltip>
                </div>
                <div
                  class="process"
                  :class="{
                    green: item.push_progress.progress === 100 || item.push_progress.progress > 100,
                    orange: item.push_progress.progress > 0 && item.push_progress.progress < 100,
                    gray: !item.push_progress.progress
                  }"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      '原料入库进度' +
                      (item.push_progress.progress || 0) +
                      '%(更新日期:' +
                      (item.push_progress.update_time || '无') +
                      ')'
                    "
                    placement="top"
                  >
                    <svg class="iconFont" aria-hidden="true">
                      <use xlink:href="#icon-yuanliaoruku1"></use>
                    </svg>
                  </el-tooltip>
                </div>
                <div
                  class="process"
                  :class="{
                    green: item.pop_progress.progress === 100 || item.pop_progress.progress > 100,
                    orange: item.pop_progress.progress > 0 && item.pop_progress.progress < 100,
                    gray: !item.pop_progress.progress
                  }"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      '原料出库进度' +
                      (item.pop_progress.progress || 0) +
                      '%(更新日期:' +
                      (item.pop_progress.update_time || '无') +
                      ')'
                    "
                    placement="top"
                  >
                    <svg class="iconFont" aria-hidden="true">
                      <use xlink:href="#icon-yuanliaochuku1"></use>
                    </svg>
                  </el-tooltip>
                </div>
                <div
                  class="process"
                  :class="{ green: item.has_weave_plan.status === 1, gray: item.has_weave_plan.status === 2 }"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      '生产计划' +
                      (item.has_weave_plan.status === 1
                        ? '已添加(更新日期:' + item.has_weave_plan.update_time + ')'
                        : '未添加')
                    "
                    placement="top"
                  >
                    <svg class="iconFont" aria-hidden="true">
                      <use xlink:href="#icon-shengchanjihua3"></use>
                    </svg>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </template>
          <!-- 单证流程 -->
          <template v-if="itemKey.specialForOrderPrcess === 'document'">
            <div class="processCtn">
              <div
                class="circle"
                :class="{ green: item.status_commercial_invoice === 1, gray: item.status_commercial_invoice === 2 }"
              >
                <el-tooltip class="item" effect="dark" content="形式发票" placement="top">
                  <span class="text">形</span>
                </el-tooltip>
              </div>
              <div
                class="circle"
                :class="{ green: item.status_packing_list === 1, gray: item.status_packing_list === 2 }"
              >
                <el-tooltip class="item" effect="dark" content="装箱单" placement="top">
                  <span class="text">箱</span>
                </el-tooltip>
              </div>
              <div
                class="circle"
                :class="{
                  green: item.status_entrustiong_transport === 1,
                  gray: item.status_entrustiong_transport === 2
                }"
              >
                <el-tooltip class="item" effect="dark" content="货运委托书" placement="top">
                  <span class="text">货</span>
                </el-tooltip>
              </div>
              <div
                class="circle"
                :class="{ green: item.status_export_declaration === 1, gray: item.status_export_declaration === 2 }"
              >
                <el-tooltip class="item" effect="dark" content="出口货物报关单" placement="top">
                  <span class="text">出</span>
                </el-tooltip>
              </div>
              <div
                class="circle"
                :class="{ green: item.status_declare_elements === 1, gray: item.status_declare_elements === 2 }"
              >
                <el-tooltip class="item" effect="dark" content="申报要素" placement="top">
                  <span class="text">申</span>
                </el-tooltip>
              </div>
            </div>
          </template>
        </div>
        <div class="column w130">
          <!-- 给操作栏留的占位符 -->
        </div>
      </div>
    </div>
    <div class="cover">
      <div class="fixedLeft">
        <div class="row title">
          <div class="column check" v-if="check">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="allCheck"
              @change="handleCheckAllChange"
            ></el-checkbox>
          </div>
          <div
            class="column"
            v-for="itemKey in listKey"
            :key="itemKey.index + Math.random(1)"
            v-show="itemKey.ifShow && itemKey.ifLock"
          >
            {{ itemKey.name }}
          </div>
        </div>
        <div class="row" v-for="(item, index) in list" :key="index + Math.random(1)">
          <div class="column check" v-if="check">
            <el-checkbox v-model="item.isCheck" @change="checkChange($event, item)"></el-checkbox>
          </div>
          <div
            class="column"
            v-for="itemKey in listKey"
            :key="itemKey.index + Math.random(1)"
            v-show="itemKey.ifShow && itemKey.ifLock"
          >
            <!-- 普通元素 -->
            <template v-if="!itemKey.from && !item.ifImage">
              <!-- 订单状态专用 -->
              <template v-if="itemKey.isStatus">
                <span
                  :class="itemKey.class || (itemKey.classArr ? itemKey.classArr[item[itemKey.key]] : '')"
                  class="text"
                >
                  {{ itemKey.filterArr ? itemKey.filterArr[item[itemKey.key]] : item[itemKey.key] }}</span
                >
              </template>
              <!-- 订单进度专用 -->
              <template v-else-if="itemKey.isProgress">
                <span :class="itemKey.class || (item[itemKey.key].progress < 100 ? 'orange' : 'green')" class="text">
                  {{ item[itemKey.key].progress || itemKey.errVal }}%</span
                >
              </template>
              <!-- 数字转带逗号字符串专用 -->
              <template v-else-if="itemKey.numberToString">
                <span :class="itemKey.class" class="text">
                  {{
                    $toFixed(item[itemKey.key], 3, true) ||
                    $toFixed(item[itemKey.otherkey], 3, true) ||
                    itemKey.errVal ||
                    '未填写'
                  }}{{ itemKey.unitKey ? item[itemKey.unitKey] : itemKey.unit }}</span
                >
              </template>
              <template v-else>
                <!-- 草稿标记 -->
                <span
                  class="circle"
                  v-if="itemKey.ifCaogao"
                  :class="item[itemKey.ifCaogao] === 1 ? 'backOrange' : 'backBlue'"
                  >{{ item[itemKey.ifCaogao] === 1 ? itemKey.caogaoArr[0] : itemKey.caogaoArr[1] }}</span
                >
                <span
                  :class="itemKey.class || (itemKey.classArr ? itemKey.classArr[item[itemKey.key]] : '')"
                  class="text"
                >
                  {{
                    itemKey.filterArr
                      ? itemKey.filterArr[item[itemKey.key]]
                      : item[itemKey.key] || item[itemKey.otherkey] || itemKey.errVal || '未填写'
                  }}{{ itemKey.unitKey ? item[itemKey.unitKey] : itemKey.unit }}
                  <!-- 订单紧急专用标记 -->
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="加急"
                    placement="top"
                    v-if="itemKey.is_urgent && item.is_urgent === 1"
                  >
                    <i class="el-icon-warning red"></i>
                  </el-tooltip>
                </span>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="cover">
      <div class="fixedRight">
        <div class="row title">
          <div class="column w130">操作</div>
        </div>
        <div class="row" v-for="(item, index) in list" :key="index + Math.random(1)">
          <div class="column w130">
            <div
              class="opr"
              :class="typeof itemOpr.class === 'function' ? itemOpr.class(item) : itemOpr.class"
              v-for="(itemOpr, indexOpr) in oprList"
              :key="indexOpr + Math.random(1)"
              @click="itemOpr.fn(item)"
            >
              {{ typeof itemOpr.name === 'function' ? itemOpr.name(item) : itemOpr.name }}
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
  props: {
    listId: {
      type: String,
      required: false,
      default: 'zhList'
    },
    check: {
      type: Boolean,
      required: false
    },
    // 列表数据
    list: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: false
    },
    // 需要渲染的key值
    listKey: {
      type: Array,
      required: true
    },
    checkedCount: {
      type: Array,
      required: false
    },
    // 操作列
    oprList: {
      type: Array,
      required: false
    }
  },
  data(): {
    isIndeterminate: boolean
    allCheck: boolean
  } {
    return {
      isIndeterminate: false,
      allCheck: false
    }
  },
  methods: {
    // 监听一下鼠标滚轮
    listenWheel(ev: any) {
      const detail = ev.wheelDelta || ev.detail
      // 定义滚动方向，其实也可以在赋值的时候写
      const moveForwardStep = 1
      const moveBackStep = -1
      // 定义滚动距离
      let step = 0
      // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
      if (detail < 0) {
        step = moveForwardStep * 50
      } else {
        step = moveBackStep * 50
      }
      // @ts-ignore 对需要滚动的元素进行滚动操作
      this.$refs[this.listId].scrollLeft += step
    },
    changeIndex(type: 1 | 2, length: number, item: any) {
      if (length === 1) {
        return
      }
      item.whichIndex = item.whichIndex || 0
      if (type === 1) {
        if (item.whichIndex < length - 1) {
          item.whichIndex++
        } else {
          item.whichIndex = 0
        }
      } else {
        if (item.whichIndex === 0) {
          item.whichIndex = length - 1
        } else {
          item.whichIndex--
        }
      }
      this.$forceUpdate()
    },
    handleCheckAllChange(val: any) {
      if (this.isIndeterminate || this.allCheck) {
        this.list.forEach((item: any) => {
          item.isCheck = true
          const index = this.checkedCount.map((items: any) => items.id).indexOf(item.id)
          if (index === -1) {
            this.checkedCount.push(item)
          }
        })
      } else {
        this.list.forEach((item: any) => {
          item.isCheck = false
          const index = this.checkedCount.map((items: any) => items.id).indexOf(item.id)
          if (index !== -1) {
            this.checkedCount.splice(index, 1)
          }
        })
      }

      this.isIndeterminate = false
    },
    checkChange(val: boolean, info: any) {
      if (val) {
        const index = this.checkedCount.map((item: any) => item.id).indexOf(info.id)
        if (index === -1) {
          this.checkedCount.push(info)
        }
      } else {
        const index = this.checkedCount.map((item: any) => item.id).indexOf(info.id)
        if (index !== -1) {
          this.checkedCount.splice(index, 1)
        }
        this.allCheck = false
      }
      if (this.checkedCount.length === 0) {
        this.isIndeterminate = false
      } else if (this.checkedCount.length === this.list.length) {
        this.isIndeterminate = false
        this.allCheck = true
      } else {
        this.isIndeterminate = true
      }
      this.$forceUpdate()
      // this.allCheck = this.checkedCount.length === this.list.length;
    }
  },
  watch: {
    list(val) {
      this.allCheck = false
    }
  }
})
</script>

<style lang="less" scoped>
@import './zhList.less';
</style>
<style lang="less">
.imageCtn {
  .el-image__inner {
    width: auto !important;
  }
}
</style>
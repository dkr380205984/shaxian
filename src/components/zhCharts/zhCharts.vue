<template>
  <div class="charts" @click="clickEcharts"></div>
</template>

<script lang="ts">
import Vue from 'vue'
let echarts = require('echarts')
export default Vue.extend({
  props: {
    option: {
      required: true,
      type: Object
    }
  },
  data(): {
    [propName: string]: any
  } {
    return {}
  },
  watch: {
    option: {
      handler(option) {
        this.chart.setOption(this.option, true)
        this.chart.off('click')
        this.clickEcharts()
      },
      deep: true
    }
  },
  computed: {
    token(): string {
      return this.$store.state.status.token
    }
  },
  methods: {
    initCharts() {
      this.chart = echarts.init(this.$el)
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption(this.option, true)
    },
    clickEcharts() {
      this.chart.on('click', (params: any) => {
        this.$emit('chartsData', params)
      })
    }
  },
  mounted() {
    this.option.color
      ? this.option.color = this.option.color
      : (this.option.color = ['#229CFB', '#1FB48C', '#8E44AD', '#696969', '#28AE60', '#F39C25', '#D3541A', '#21BC9C'])
    this.initCharts()
    this.clickEcharts()
  }
})
</script>

<style lang="less" scoped>
@import './zhCharts.less';
</style>

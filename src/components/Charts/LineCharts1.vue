<template>
  <!-- 准备报表盒子 -->
  <div ref="box" style="height:400px;background-color:#fff;margin-top:30px;padding:20px"></div>
</template>

<script>
// 引入echarts
import echarts from "echarts";
export default {
  // 接受外部数据
  props: {
    options: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  methods: {
    //   画线图
    drawLineCharts(options) {
      // 初始化报表
      let myChart = echarts.init(this.$refs.box);
      //   写配置

      // 写配置
      let option = {
        // 标题
        title: {
          text: options.title // 1. 传入的动态数据
        },
        // 工具提示
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        // 图例
        legend: {
          data: options.lengend // 2. 传入的动态数据
        },

        // 网格
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },

        // 工具盒子
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },

        // x轴
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: options.xAxisData // 3. 外部传入的动态数据
        },

        // y轴
        yAxis: {
          type: "value"
        },

        // 核心数据
        // 4. 外部传入的 动态的数据
        series: options.series
      };
      // 使用配置 生成报表
      myChart.setOption(option);
    }
  },
  mounted() {
    this.drawLineCharts(this.options);
  },
  watch: {
    // 观察传入的数据 options的变化 如果变化 就会触发 hander函数
    options: {
      handler(newVal, oldVal) {
        this.drawLineCharts(newVal); // 如果数据变化了 重新使用新数据绘制报表
      },
      deep: true // 深度监听
    }
  }
};
</script>

<style lang="less" scoped>
</style>
<template>
  <div class="home">
    <!-- 上面部分 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in CardArr" :key="item.title">
        <!-- 使用封装的组件 -->
        <Car :CarData="item" />
      </el-col>
    </el-row>

    <!-- 统计表 -->
    <div class="bottom" ref="dataEcharts">
      <div></div>
    </div>
  </div>
</template>

<script>
import Car from "@/components/Car/Car.vue";
// 引入ajax
import { getTotalData } from "@/api/order";

export default {
  components: {
    Car
  },
  data() {
    return {
      value1: "",
      CardArr: [
        {
          imgUrl: require("@/assets/imgs/dingdan1.png"),
          title: "总订单",
          num: ""
        },
        {
          imgUrl: require("@/assets/imgs/qian1.png"),
          title: "总销售额",
          num: ""
        },
        {
          imgUrl: require("@/assets/imgs/dingdan2.png"),
          title: "今日订单数",
          num: " "
        },
        {
          imgUrl: require("@/assets/imgs/qian2.png"),
          title: "今日销售额",
          num: ""
        }
      ],
      Xdata: []
    };
  },
  methods: {
    getCardData() {
      let myChart = this.$echarts.init(this.$refs.dataEcharts);
      let option = {
        // 标题
        title: {
          text: "数据统计"
        },
        // 工具提示
        tooltip: {
          trigger: "axis"
        },
        // 图例
        legend: {
          data: ["订单", "销售额"]
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

        // x轴的数据
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xData
        },
        // y轴的数据
        yAxis: {
          type: "value"
        },

        // 核心数据
        series: [
          {
            name: "订单",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "销售额",
            type: "line",
            stack: "总量",
            data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      };

      myChart.setOption(option);
    }
  },
  async mounted() {
    // 发送ajax
    let {
      xData,
      orderData,
      amountData,
      totalOrder,
      totalAmount,
      todayOrder,
      totayAmount
    } = await getTotalData();
    // 调用echards函数
    // this.getCardData();

    // 渲染到卡片
    let arr = [totalOrder, totalAmount, todayOrder, totayAmount];
    arr.forEach((v, i) => (this.CardArr[i].num = v));

    // console.log(xData, orderData, amountData);
    this.xData = xData;
    // 动态数据
    // let option = {};

    // 调用方法 绘制报表
    this.getCardData();
  }
};
</script>

<style lang="less" scoped>
.home {
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  .bottom {
    // flex: 1;
    background-color: white;
    margin-top: 20px;
    height: 460px;
    width: 98%;
  }
}
</style>
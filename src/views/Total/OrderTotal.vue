<template>
  <div class="total">
    <div class="block">
      <span class="demonstration">时间范围</span>
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button type="primary" class="btn" size="small" @click="search">查询</el-button>
    </div>

    <!-- 下面部分 -->
    <!-- 使用自己封装的报表组件 -->
    <LineCharts :options="options" />
  </div>
</template>

<script>
import { getOrderTotalData } from "@/api/order";
import LineCharts from "@/components/Charts/LineCharts1.vue";
import moment from "moment";
export default {
  components: {
    LineCharts
  },
  data() {
    return {
      value1: "",
      date: [], //时间范围
      options: {
        title: "订单统计",
        legend: ["订单金额"],
        xAxisData: [],
        series: []
      }
    };
  },
  methods: {
    // 获取数据
    async getData() {
      let { data } = await getOrderTotalData({
        date: this.date == null ? JSON.stringify([]) : JSON.stringify(this.date)
      });

      //渲染数据
      this.options.xAxisData = data.map(v =>
        moment(v.orderTime).format("YYYY-MM-DD HH:mm:ss")
      );
      this.options.series = [
        {
          name: "订单金额",
          type: "bar",
          data: data.map(v => v.orderAmount)
        }
      ];
    },
    search() {
      this.getData();
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="less" scoped>
.total {
  .block {
    margin: 20px 0;
    .demonstration {
      margin-right: 10px;
    }
    .btn {
      width: 80px;
      margin-left: 10px;
      height: 40px;
    }
  }
  .buttom {
    background-color: #ffffff;
    height: 500px;
    width: 100%;
  }
}
</style>
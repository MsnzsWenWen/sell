<template>
  <div class="oderList">
    <!-- 上面表单 -->

    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
      style="margin-bottom: 20px;"
    >
      <!-- 订单号 -->
      <el-form-item label="订单号">
        <el-input v-model="formInline.orderNo " placeholder="订单号"></el-input>
      </el-form-item>
      <!-- 收货人 -->
      <el-form-item label="收货人">
        <el-input v-model="formInline.consignee" placeholder="收货人"></el-input>
      </el-form-item>
      <!-- 手机号 -->
      <el-form-item label="手机号">
        <el-input v-model="formInline.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <!-- 订单状态 -->
      <el-form-item label="订单状态">
        <el-select v-model="formInline.orderState" placeholder="订单状态">
          <el-option value="派送中">派送中</el-option>
          <el-option value="已完成">已完成</el-option>
          <el-option value="已受理">已受理</el-option>
        </el-select>
      </el-form-item>

      <!-- 时间选择 -->
      <div class="block">
        <span class="demonstration" style="margin-right: 10px;">选择时间</span>
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="formInline.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 90%">
      <el-table-column fixed prop="orderNo" label="订单号" width="150"></el-table-column>
      <el-table-column prop="orderTime" label="下单时间" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
      <el-table-column prop="consignee" label="收货人" width="120"></el-table-column>
      <el-table-column prop="deliverAddress" label="配送地址" width="300"></el-table-column>
      <el-table-column prop="deliveryTime" label="送达时间" width="300"></el-table-column>
      <el-table-column prop="remarks" label="用户备注" width="120"></el-table-column>
      <el-table-column prop="orderAmount" label="订单金额" width="120"></el-table-column>
      <el-table-column prop="orderState" label="订单状态" width="120"></el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="changeOrder(scope.row.id) ">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 模态框 -->
    <el-dialog title="订单详情" :visible.sync="dialogVisible" width="500px">
      <!-- 编辑表单 -->
      <el-form :model="table" style="width: 300px;" size="small" label-width="100px" disabled>
        <!-- 订单号 -->
        <el-form-item label="订单号">
          <el-input v-model="table.orderNo"></el-input>
        </el-form-item>
        <!-- 下单时间 -->
        <el-form-item label="下单时间">
          <el-input v-model="table.orderTime"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号">
          <el-input v-model="table.phone"></el-input>
        </el-form-item>
        <!-- 收货人 -->
        <el-form-item label="收货人">
          <el-input v-model="table.consignee"></el-input>
        </el-form-item>
        <!-- 配送地址 -->
        <el-form-item label="配送地址">
          <el-input v-model="table.deliverAddress"></el-input>
        </el-form-item>
        <!-- 送达时间 -->
        <el-form-item label="送达时间">
          <el-input v-model="table.deliveryTime"></el-input>
        </el-form-item>
        <!-- 用户备注 -->
        <el-form-item label="用户备注">
          <el-input v-model="table.remarks"></el-input>
        </el-form-item>
        <!-- 订单金额 -->
        <el-form-item label="订单金额">
          <el-input v-model="table.orderAmount"></el-input>
        </el-form-item>
        <!-- 订单状态 -->
        <el-form-item label="订单状态">
          <el-input v-model="table.orderState"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">退出</el-button>
      </span>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 30px;"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { getOrderList, selectList, getOrderDeta, editOrder } from "@/api/order";
import local from "@/utils/local";
import moment from "moment";
export default {
  data() {
    return {
      // 搜索表单
      formInline: {
        date: [],
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: ""
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      dialogVisible: false,
      tableData: [],
      currentPage: 5,
      pageSize: 4,
      total: 28,
      table: {}
    };
  },
  methods: {
    // 重置
    reset() {
      this.formInline = {};
      this.getData();
    },
    // 获取数据
    async getData() {
      let { total, data } = await getOrderList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,

        // 查询参数

        orderNo: this.formInline.orderNo,
        consignee: this.formInline.consignee,
        phone: this.formInline.phone,
        orderState: this.formInline.orderState,
        date:
          this.formInline.date == null
            ? JSON.stringify([])
            : JSON.stringify(this.formInline.date)
      });
      // 时间处理
      data.forEach(v => {
        v.orderTime = moment(v.orderTime).format("YYYY-MM-DD HH:mm:ss");
        v.deliveryTime = moment(v.deliveryTime).format("YYYY-MM-DD HH:mm:ss");
      });
      // 渲染赋值
      this.total = total;
      this.tableData = data;
    },

    // 查询
    onSubmit() {
      this.currentPage = 1;
      this.getData();
    },
    // 查看/信息回填
    handleClick(row) {
      this.dialogVisible = true;
      this.table = row;
    },

    handleCurrentChange(page) {
      this.currentPage = page;
      this.getData();
    },
    //编辑
    changeOrder(v) {
      this.$router.push({
        name: "orderEdit",
        params: {
          id: v
        }
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="less" scoped>
.oderList {
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  margin-top: 20px;
  padding-top: 20px;
  padding-left: 20px;
  box-sizing: border-box;
}
</style>
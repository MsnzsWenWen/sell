<template>
  <div>
    <Pane>
      <!-- 头部 -->
      <span slot="title">订单添加</span>
      <div slot="content">
        <el-form ref="form" :model="form" style="width:300px" label-width="80px" size="mini">
          <el-form-item label="订单号">
            <el-input v-model="form.orderNo"></el-input>
          </el-form-item>
          <el-form-item label="下单时间">
            <el-date-picker v-model="form.orderTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>

          <el-form-item label="电话">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>

          <el-form-item label="收货人">
            <el-input v-model="form.consignee"></el-input>
          </el-form-item>

          <el-form-item label="送货地址">
            <el-input v-model="form.deliverAddress"></el-input>
          </el-form-item>

          <el-form-item label="送达时间">
            <el-date-picker v-model="form.deliveryTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>

          <el-form-item label="备注">
            <el-input v-model="form.remarks"></el-input>
          </el-form-item>

          <el-form-item label="订单金额">
            <el-input v-model="form.orderAmount"></el-input>
          </el-form-item>

          <el-form-item label="订单状态">
            <el-input v-model="form.orderState"></el-input>
          </el-form-item>
          <el-form-item label>
            <el-button @click="doEdit" type="primary">确认修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </Pane>
  </div>
</template>

<script>
import Pane from "@/components/Pane/Pane.vue";
import local from "@/utils/local";
import { getOrderDeta, editOrder } from "@/api/order";
export default {
  components: {
    Pane
  },
  data() {
    return {
      form: {
        id: "",
        orderNo: "",
        orderTime: "",
        phone: "",
        consignee: "",
        deliverAddress: "",
        deliveryTime: "",
        remarks: "",
        orderAmount: "",
        orderState: ""
      }
    };
  },
  methods: {
    async fecthData() {
      let id = local.get("id");
      let { data } = await getOrderDeta({ id: id });
      this.form = data;
    },
    //确认修改
    doEdit() {
      this.$confirm("你确定要修改吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { code } = await editOrder(this.form);
          if (code === 0) {
            this.$router.push("/order/order-list");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    local.set("id", this.$route.params.id);
    this.fecthData();
  }
};
</script>

<style lang="less" scoped>
</style>
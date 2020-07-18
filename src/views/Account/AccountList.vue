<template>
  <div>
    <Pane>
      <!-- 头部 -->
      <span slot="title">账号列表</span>
      <!-- 内容 -->
      <div slot="content">
        <!-- 表格 -->
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSectionChange"
          ref="accTable"
        >
          <!-- 选中 -->
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- 账号 -->
          <el-table-column prop="account" label="账号" width="180"></el-table-column>
          <!-- 用户组 -->
          <el-table-column prop="userGroup" label="用户组" width="180"></el-table-column>
          <!-- 创建时间 -->
          <el-table-column prop="ctime" label="创建时间" width="180"></el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit( scope.row)" type="primary">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          style="margin-top: 20px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[3, 5, 7, 9]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
        <!-- 批量删除和取消全选 -->
        <div style="margin-top: 20px;">
          <el-button type="danger" size="small" @click="batchDal">批量删除</el-button>
          <el-button type="primary" size="small" @click="cancelSelect">取消选择</el-button>
        </div>
        <!-- 模态框 -->
        <el-dialog title="编辑账号" :visible.sync="dialogVisible" width="360px">
          <!-- 编辑表单 -->
          <el-form :model="editForm" style="width: 275px;" size="small" label-width="60px">
            <el-form-item label="账号">
              <el-input v-model="editForm.account"></el-input>
            </el-form-item>

            <el-form-item label="用户组">
              <el-select v-model="editForm.userGroup">
                <el-option value="超级管理员">超级管理员</el-option>
                <el-option value="普通管理员">普通管理员</el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="saveEdit">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </Pane>
  </div>
</template>

<script>
import Pane from "@/components/Pane/Pane.vue";

// 引入ajax函数
import {
  getAccountList,
  delAccount,
  AlldelAccount,
  saveEditAccount
} from "@/api/account";
// 引入时间处理格式
import moment from "moment";

export default {
  components: {
    Pane
  },
  data() {
    return {
      tableData: [],
      // 分页
      currentPage: 1,
      pageSize: 3, // 每页条数
      total: 0, // 总条数
      dialogVisible: false, // 编辑模态框是否显示

      editForm: { account: "", userGroup: "" } // 修改账号表单
    };
  },
  methods: {
    // 封装一个方法获取数据
    async getData() {
      // 发送ajax获取列表数据
      let { total, data } = await getAccountList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });
      // 处理时间

      data.forEach(v => {
        v.ctime = moment(v.ctime).format("YYYY-MM-DD HH:mm:ss");
      });
      // 边界判断
      if (!data.length && this.currentPage !== 1) {
        this.currentPage -= 1;
        this.getData();
      }

      // 赋值渲染
      this.total = total;
      this.tableData = data;
    },

    // 删除
    handleDelete(id) {
      this.$confirm("你确定要删除吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { code } = await delAccount({ id });
          if (code === 0) {
            this.getData();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            $message: "已取消删除"
          });
        });
    },
    // 当选项发生改变时
    handleSectionChange(rows) {
      this.ids = rows.map(v => v.id);
    },
    // 批量删除
    batchDal() {
      // 判断
      if (!this.ids) {
        this.$message.error("请选择之后再操作哦");
        return;
      }

      this.$confirm("确定要删除吗？", {
        confirmButtonText: "确定",
        confirmButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送批量删除的请求
          let { code } = await AlldelAccount({
            ids: JSON.stringify(this.ids)
          });
          if (code === 0) {
            this.getData();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 取消删除
    cancelSelect() {
      this.$refs.accTable.clearSelection();
    },

    handleEdit() {},

    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    // 点击编辑信息回填
    // 编辑回填
    handleEdit(row) {
      this.dialogVisible = true; // 显示编辑模态框
      this.editForm = { ...row }; // 回填
    },

    // 编辑
    async saveEdit() {
      let { code } = await saveEditAccount({
        id: this.editForm.id,
        account: this.editForm.account,
        userGroup: this.editForm.userGroup
      });

      if (code === 0) {
        this.getData(); // 刷新
        this.dialogVisible = false; // 关闭模态框
      }
    }
  },
  created() {
    this.getData(); // 进入页面调用一次获取数据的方法
  }
  // 取消
};
</script>

<style lang="less" scoped>
</style>
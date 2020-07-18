<template>
  <div>
    <Pane>
      <!-- 头部 -->
      <span slot="title" class="title">
        <span>商品分类</span>
        <!-- 添加分类 -->
        <el-button type="primary" @click="dialogFormVisible = true" size="small">添加分类</el-button>

        <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="分类名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off"></el-input>
              <!-- 开关/是否启动 -->
            </el-form-item>
            <el-form-item label="是否启用" :label-width="formLabelWidth">
              <el-switch v-model="values" active-color="#13ce66" inactive-color="#ccc"></el-switch>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="yesAdd">确 定</el-button>
          </div>
        </el-dialog>
      </span>

      <div slot="content">
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%">
          <!-- 序号 -->
          <el-table-column type="index" width="100" label="序号"></el-table-column>
          <!-- 分类名称 -->
          <el-table-column label="分类名称">
            <template slot-scope="scope">
              <!-- 文字 不可编辑 -->
              <span v-if="!scope.row.isEdit">{{ scope.row.cateName }}</span>

              <!-- 输入框 可以编辑 -->
              <el-input v-else size="mini" v-model="scope.row.cateName" />
            </template>
          </el-table-column>

          <!-- 是否启用 -->
          <el-table-column label="是否启用">
            <template slot-scope="scope">
              <el-switch
                :disabled="scope.row.isEdit ? false : true"
                v-model="scope.row.state"
                active-color="#13ce66"
              ></el-switch>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column>
            <template slot-scope="scope">
              <el-button
                @click="handleEdit(scope.row)"
                size="small"
                :type="scope.row.isEdit ? 'success' : 'primary'"
              >{{ scope.row.isEdit ? '完成' : '编辑' }}</el-button>
              <el-button size="small" type="danger" @click="delCate(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

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
    </Pane>
  </div>
</template>

<script>
import Pane from "@/components/Pane/Pane.vue";
// 引入ajax
import { addGoods, getGoods, editCate, delGoods } from "@/api/goods";

export default {
  components: {
    Pane
  },
  data() {
    return {
      tableData: [], // 表格数据
      currentPage: 1, // 当前页码
      pageSize: 5, // 每页条数
      total: 28, // 总条数
      dialogTableVisible: false,
      dialogFormVisible: false,
      values: true,

      form: {
        name: ""
      },

      formLabelWidth: "120px"
    };
  },
  methods: {
    // 编辑
    async handleEdit(row) {
      row.isEdit = !row.isEdit;
      if (!row.isEdit) {
        // 发送修改请求
        let { code } = await editCate({
          id: row.id,
          cateName: row.cateName,
          state: row.state
        });

        if (code == 0) {
          this.fetchData(); // 刷新
        }
      }
    },
    // 获取数据
    async fetchData() {
      let { total, data } = await getGoods({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });
      // 处理数据
      data.forEach(v => {
        v.state = v.state == 1 ? true : false;
        v.isEdit = false; // 每一条数据 添加一个是否可以编辑的状态
      });
      // 边界判断
      if (!data.length && this.currentPage !== 1) {
        this.currentPage -= 1;
        this.fetchData();
      }

      // 渲染赋值
      this.total = total;
      this.tableData = data;
    },
    // 当页码改变调用一次
    handleCurrentChange(page) {
      this.currentPage = page;
      this.fetchData();
    },
    // 添加分类
    async yesAdd() {
      let { code } = await addGoods({
        cateName: this.form.name,
        state: this.values
      });

      if (code == 0) {
        this.dialogFormVisible = false;
        this.form.name = "";
        this.fetchData(); // 刷新
      }
    },
    // 删除
    delCate(id) {
      this.$confirm("你确定要删除吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { code } = await delGoods({ id });
          if (code === 0) {
            this.fetchData();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            $message: "已取消删除"
          });
        });
    }
  },

  created() {
    this.fetchData();
  }
};
</script>

<style lang="less" scoped>
.title {
  display: flex;
  justify-content: space-between;
}
</style>
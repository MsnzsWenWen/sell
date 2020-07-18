<template>
  <div>
    <Pane>
      <!-- 头部 -->
      <div slot="title">
        <!-- <span>商品列表</span> -->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="商品名称">
            <el-input v-model="formInline.name" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="formInline.category" placeholder="商品分类">
              <el-option
                v-for="cate in categories"
                :key="cate.cateName"
                :value="cate.cateName"
              >{{cate.cateName}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="rsert">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div slot="content">
        <el-table :data="tableData" style="width: 100%">
          <!-- 第一列：可以收缩和展开 -->
          <!-- 商品名称 -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <!-- 这里是展开的内容 -->
              <el-form label-position="left" inline class="demo-table-expand">
                <!-- 商品ID -->
                <el-form-item label="商品ID">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <!-- 商品名称 -->
                <el-form-item label="商品名称">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <!-- 所属分类 -->
                <el-form-item label="所属分类">
                  <span>{{ props.row.category }}</span>
                </el-form-item>
                <!-- 商品价格-->
                <el-form-item label="商品价格">
                  <span>{{ props.row.price }}</span>
                </el-form-item>

                <!-- 商品图片 -->
                <el-form-item label="商品图片">
                  <span>{{ props.row.imgUrl }}</span>
                </el-form-item>

                <!-- 创建时间 -->
                <el-form-item label="创建时间">
                  <span>{{ props.row.ctime }}</span>
                </el-form-item>

                <!-- 商品评价 -->
                <el-form-item label="商品评价">
                  <span>{{ props.row.rating }}</span>
                </el-form-item>

                <!-- 商品销量 -->
                <el-form-item label="商品销量">
                  <span>{{ props.row.sellCount }}</span>
                </el-form-item>

                <!-- 商品描述 -->
                <el-form-item label="商品描述">
                  <span>{{ props.row.goodsDesc }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <!-- 所属分类 -->
          <el-table-column label="所属分类" prop="category"></el-table-column>

          <!-- 商品价格 -->
          <el-table-column label="商品价格" prop="price"></el-table-column>

          <!-- 商品图片 -->
          <el-table-column label="商品图片">
            <template slot-scope="scope">
              <img width="50" height="50" :src="imgBaseUrl + scope.row.imgUrl" alt />
            </template>
          </el-table-column>

          <!-- 商品描述 -->
          <el-table-column label="商品描述" prop="goodsDesc"></el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作" prop="desc">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="addGoods(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          style="margin-top: 30px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 3, 5, 10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
        <!-- 模态框 -->
        <el-dialog title="编辑商品" :visible.sync="dialogVisible" width="500px">
          <!-- 编辑表单 -->
          <el-form :model="form" style="width: 300px;" size="small" label-width="100px">
            <!-- 商品名称 -->
            <el-form-item label="商品名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <!-- 商品分类 -->
            <el-form-item label="商品分类">
              <el-select v-model="form.category" placeholder="请选择商品分类">
                <el-option
                  v-for="cate in categories"
                  :key="cate.cateName"
                  :value="cate.cateName"
                >{{cate.cateName}}</el-option>
              </el-select>
            </el-form-item>
            <!-- 商品价格 -->
            <el-form-item label="商品价格">
              <el-input-number v-model="form.price" :min="1" :max="100000" label="描述文字"></el-input-number>
            </el-form-item>
            <!-- 商品图片 -->
            <el-form-item label="商品图片">
              <!-- 商品图片上传组件 -->
              <el-upload
                action="http://119.23.216.240:8866/goods/goods_img_upload"
                :before-upload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess"
                :show-file-list="false"
                class="avatar-uploader"
              >
                <img v-if="form.imgUrl" :src="imgBaseUrl + form.imgUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

            <el-form-item label="商品描述" size="medium">
              <el-input type="textarea" v-model="form.goodsDesc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">修改</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </Pane>
  </div>
</template>

<script>
import Pane from "@/components/Pane/Pane.vue";

import {
  getGoodsList,
  addGoodsList,
  getCateNames,
  editGoods
} from "@/api/goods";
import moment from "moment";

export default {
  components: {
    Pane
  },
  data() {
    return {
      tableData: [], //表格
      currentPage: 1, // 当前页
      pageSize: 5, // 每页条数
      total: 0, // 总条数
      dialogVisible: false, // 编辑模态框是否显示
      imgBaseUrl: "http://119.23.216.240:8866/upload/imgs/goods_img/",

      form: {
        name: "",
        category: "",
        price: "",
        imgUrl: "",
        goodsDesc: ""
      },
      formInline: {
        user: "",
        category: ""
      },
      categories: [] // 分类名称
    };
  },
  methods: {
    // 重置
    rsert() {
      this.formInline = {};
      this.fetchData();
    },
    // 上传之前的限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png"; // 限制类型
      const isLt2M = file.size / 1024 / 1024 < 2; // 限制大小

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess(res) {
      let { code, msg, imgUrl } = res;
      if (code === 0) {
        this.$message({ type: "success", message: msg });
        this.form.imgUrl = imgUrl;
      }
    },

    async fetchData() {
      let { total, data } = await getGoodsList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,

        name: this.formInline.name,
        category: this.formInline.category
      });

      // 边界判断
      if (!data.length && this.currentPage !== 1) {
        this.currentPage -= 1;
        this.fetchData();
      }
      // 处理时间
      data.forEach(v => {
        v.ctime = moment(v.ctime).format("YYYY-MM-DD HH:mm:ss");
      });
      // 渲染赋值
      this.total = total;
      this.tableData = data;
    },
    // 当前页改变
    handleCurrentChange(page) {
      this.currentPage = page;
      this.fetchData();
    },

    // 每页条数改变
    handleSizeChange(size) {
      this.pageSize = size;
      this.fetchData();
    },
    // 删除
    addGoods(id) {
      this.$confirm("你确定要删除吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { code } = await addGoodsList({ id });
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
    },

    // 编辑 回填
    handleEdit(row) {
      this.dialogVisible = true;
      // 显示编辑模态框
      this.form = { ...row };
    },
    // 修改
    async onSubmit() {
      // alert(1);
      let { code } = await editGoods(this.form);
      if (code === 0) {
        this.dialogVisible = false;
        this.fetchData();
      }
    },
    // 查询
    onSubmit() {
      this.fetchData();
    }
  },
  async created() {
    let { categories } = await getCateNames();
    this.categories = categories; // 赋值渲染
    this.fetchData();
  }
};
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
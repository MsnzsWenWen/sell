<template>
  <div>
    <Pane>
      <!-- 头部 -->
      <span slot="title">商品添加</span>
      <div slot="content" class="box">
        <el-form ref="form" :model="form" label-width="80px">
          <!-- 商品名称 -->
          <el-form-item label="商品名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <!-- 商品分类 -->
          <el-form-item label="商品分类">
            <el-select v-model="form.category" placeholder="请选择活动区域">
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

          <el-form-item label="商品描述">
            <el-input type="textarea" v-model="form.goodsDesc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">添加商品</el-button>
          </el-form-item>
        </el-form>
      </div>
    </Pane>
  </div>
</template>

<script>
import Pane from "@/components/Pane/Pane.vue";
import { getCateNames, goodsAdd } from "@/api/goods";

export default {
  components: {
    Pane
  },
  data() {
    return {
      form: {
        name: "",
        category: "",
        price: "",
        imgUrl: "",
        goodsDesc: ""
      },
      categories: [], // 分类名称

      imgBaseUrl: "http://119.23.216.240:8866/upload/imgs/goods_img/" // 图片所在服务的文件夹的位置【目录】
    };
  },
  methods: {
    // 上传图片

    handleAvatarSuccess(res) {
      let { code, msg, imgUrl } = res;
      if (code === 0) {
        this.$message({ type: "success", message: msg });
        this.form.imgUrl = imgUrl;
      }
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

    // 添加商品

    async onSubmit() {
      // alert(11);
      let { code } = await goodsAdd(this.form);
      if (code === 0) {
        this.$router.push("/goods/goods-list");
      }
    }
  },
  async created() {
    let { categories } = await getCateNames();
    this.categories = categories; // 赋值渲染
  }
};
</script>

<style lang="less" scoped>
.box {
  width: 400px;
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
}
</style>
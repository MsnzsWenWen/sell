<template>
  <div>
    <Pane>
      <!-- 头部 -->
      <span slot="title">个人中心</span>
      <div slot="content" class="box">
        <el-form ref="form" :model="form" label-width="80px" :disabled="!isEdit">
          <!-- 店铺名称 -->
          <el-form-item label="店铺名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <!-- 店铺公告 -->
          <el-form-item label="店铺公告">
            <el-input type="textarea" v-model="form.bulletin"></el-input>
          </el-form-item>

          <!-- 店铺头像 -->
          <el-form-item label="店铺头像">
            <el-upload
              class="avatar-uploader"
              action="http://119.23.216.240:8866/shop/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.avatar" :src="form.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <!-- 店铺图片 -->
          <el-form-item label="店铺图片">
            <el-upload
              :file-list="form.pics"
              action="http://119.23.216.240:8866/shop/upload"
              list-type="picture-card"
              :on-success="handleImgSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>

          <!-- 配送费 -->
          <el-form-item label="配送费">
            <el-input v-model="form.deliveryPrice"></el-input>
          </el-form-item>
          <!-- 配送时间 -->
          <el-form-item label="配送时间">
            <el-input v-model="form.deliveryTime"></el-input>
          </el-form-item>
          <!--配送描述 -->
          <el-form-item label="配送描述">
            <el-input v-model="form.description"></el-input>
          </el-form-item>

          <!-- 店铺评分 -->
          <el-form-item label="店铺评分">
            <el-input v-model="form.score"></el-input>
          </el-form-item>

          <!-- 销量 -->
          <el-form-item label="销量">
            <el-input v-model="form.sellCount"></el-input>
          </el-form-item>
          <!-- 活动 /多选框 -->
          <el-form-item label="活动性质">
            <el-checkbox-group v-model="form.supports">
              <el-checkbox label="单人精彩套餐" name="type"></el-checkbox>
              <el-checkbox label="特价饮品8折抢购" name="type"></el-checkbox>
              <el-checkbox label="VC无限橙果汁全场8折" name="type"></el-checkbox>
              <el-checkbox label="单人特色套餐" name="type"></el-checkbox>
              <el-checkbox label="多人精彩套餐" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 营业时间 -->
          <el-form-item label="营业时间">
            <el-time-picker
              value-format="YYYY-MM-dd HH:mm:ss"
              v-model="form.date"
              is-range
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            ></el-time-picker>
          </el-form-item>
        </el-form>
        <!-- 保存 -->
        <el-button
          @click="handleEdit"
          :type="isEdit ? 'success' : 'primary'"
          size="mini"
        >{{ isEdit ? '保存' : '编辑' }}</el-button>
      </div>
    </Pane>
  </div>
</template>

<script>
import Pane from "@/components/Pane/Pane.vue";
import { shopInfrom, editShop } from "@/api/shop";
// 引入moment处理时间格式
import moment from "moment";

export default {
  components: {
    Pane
  },
  data() {
    return {
      form: {
        name: "",
        bulletin: "",
        avatar: "",
        pics: [],

        deliveryPrice: "",
        deliveryTime: "",
        description: "",
        score: "",
        sellCount: "",
        supports: [],
        date: []
      },
      isEdit: false, // 是否可以编辑

      baseImgUrl: "http://119.23.216.240:8866/upload/shop/",
      dialogVisible: false,
      dialogImageUrl: ""
    };
  },
  methods: {
    // 删除图片
    handleRemove(file) {
      // 找到要删除的数据，从数组中删除这一张图片
      this.form.pics.forEach((v, i) => {
        if (v.uid === file.uid) {
          this.form.pics.splice(i, 1);
        }
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url; // 把图片路径 赋值给模态框中的img的src
      this.dialogVisible = true; // 把模态框显示出来
    },
    // 店铺头像上传
    handleAvatarSuccess(res) {
      let { code, msg, imgUrl } = res;
      if (code === 0) {
        this.$message({ type: "success", message: msg });
        this.form.avatar = this.baseImgUrl + imgUrl;
      }
    },
    // 上传之前限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 上传店铺图片成功
    handleImgSuccess(res) {
      this.form.pics.push({
        url: this.baseImgUrl + res.imgUrl
      });
    },
    // 编辑
    async handleEdit() {
      this.isEdit = !this.isEdit; // 取反
      if (!this.isEdit) {
        // 参数处理
        let arr = this.form.pics.map(v => v.url.substr(this.baseImgUrl.length));

        // 发送修改ajax
        let params = {
          id: this.form.id,
          name: this.form.name,
          bulletin: this.form.bulletin,
          avatar: this.form.avatar.substr(this.baseImgUrl.length),
          deliveryPrice: this.form.deliveryPrice,
          deliveryTime: this.form.deliveryTime,
          description: this.form.description,
          score: this.form.score,
          sellCount: this.form.sellCount,

          supports: JSON.stringify(this.form.supports),
          date: JSON.stringify(this.form.date),
          pics: JSON.stringify(arr)
        };
        await editShop(params);
      }
    },
    // 数据渲染
    async fetchData() {
      let { data } = await shopInfrom();
      // console.log(data.date);

      data.avatar = this.baseImgUrl + data.avatar;

      data.pics = data.pics.map(v => ({
        url: this.baseImgUrl + v
      }));

      // 赋值
      this.form = data;
    }
  },
  created() {
    this.fetchData();
  }
};
</script>

<style lang="less" scoped>
.box {
  width: 400px;
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
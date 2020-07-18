<template>
  <div>
    <Pane>
      <!-- 头部 -->
      <span slot="title">个人中心</span>
      <div slot="content">
        <div>
          <span>管理员ID:&emsp;&emsp;</span>
          <span>{{user.id}}</span>
          <el-divider></el-divider>
          <span>账号:&emsp;&emsp;</span>
          <span>{{user.account}}</span>
          <el-divider></el-divider>
          <span>用户组:&emsp;&emsp;</span>
          <span>{{user.userGroup}}</span>
          <el-divider></el-divider>
          <span>创建时间:&emsp;&emsp;</span>
          <span>{{user.ctime | filterCtime}}</span>
          <el-divider></el-divider>
          <span>管理员头像:&emsp;&emsp;</span>
          <!-- 头像上传组件 -->
          <el-upload
            action="http://119.23.216.240:8866/users/avatar_upload"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :show-file-list="false"
            class="avatar-uploader"
          >
            <img v-if="imgUrl" :src="imgBaseUrl + imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <el-button
            @click="handleEditAvatar"
            style="margin-top: 20px;"
            size="small"
            type="primary"
          >修改头像</el-button>
        </div>
      </div>
    </Pane>
  </div>
</template>

<script>
import Pane from "@/components/Pane/Pane.vue";
import { getAccount, modifyImg, editAvatar } from "@/api/account";
import moment from "moment";

// 引入本地local工具函数
import local from "@/utils/local";

export default {
  components: {
    Pane
  },
  data() {
    return {
      // 用户数据对象
      user: {},
      imgUrl: "", // 图片名字
      imgBaseUrl: "http://119.23.216.240:8866/upload/imgs/acc_img/" // 图片所在服务的文件夹的位置【目录】
    };
  },
  methods: {
    // 上传头像

    handleAvatarSuccess(res) {
      let { code, msg, imgUrl } = res;
      if (code === 0) {
        this.$message({ type: "success", message: msg });
        this.imgUrl = imgUrl;
      }
    },
    // 上传之前限制
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
    async handleEditAvatar() {
      let { code } = await editAvatar({ imgUrl: this.imgUrl });
      // 判断
      if (code === 0) {
        this.$bus.$emit("update_avatar");
      }
    }
  },
  created() {
    // 直接在本地存储获取数据
    this.user = local.get("user");
  },
  filters: {
    // 格式化时间
    filterCtime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang="less" scoped>
.block {
  margin-top: 20px;
}
/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-top: 10px;
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
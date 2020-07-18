<template>
  <div class="content">
    <el-row>
      <!-- 右边 -->
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-breadcrumb separator=">" class="list">
            <el-breadcrumb-item v-for="v in breadArr" :key="v.title" :to="{path:v.path}">{{v.title}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-col>
      <!-- 右边 -->
      <el-col class="right-box" :span="12">
        <!-- 右侧 -->
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            欢迎你,{{account}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="personal">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 头像 -->
        <el-avatar size="medium" :src="imgUrl"></el-avatar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入本地local工具函数
import local from "@/utils/local";
// 引入ajax
import { getAccount } from "@/api/account";
export default {
  data() {
    return {
      breadArr: [], //定义一个面包屑数组
      // 头像
      imgUrl: "",
      account: ""
    };
  },
  methods: {
    // 开始计算面包屑数组
    calcBread() {
      let arr = [{ title: "首页", path: "/home" }]; //首页
      this.$route.matched.forEach(v => {
        // 判断如果有meta且meta中有title证明配置了路由
        if (v.meta && v.meta.title) {
          arr.push({
            title: v.meta.title,
            path: v.path
          });
        }
      });
      this.breadArr = arr;
    },
    // 退出登录
    handleCommand(cmd) {
      if (cmd == "personal") {
        this.$router.push("/account/personal");
      } else {
        this.$message({ message: "欢迎下次再来", type: "success" });
        local.clear(); // 清除本地
        this.$router.push("/login"); // 跳转到登录
      }
    },

    // 获取数据
    async fetchData() {
      let res = await getAccount();
      // 赋值渲染头像和账号
      this.imgUrl = res.imgUrl;
      this.account = res.account;
      // 将当前用户数据存入本地
      local.set("user", res);
    }
  },
  created() {
    this.calcBread(); //进入页面时调用和刷新页面时调用
    this.fetchData();
    // 接受个人中心的通知
    this.$bus.$on("updata_avatar", () => {
      this.fetchData();
    });
  },
  watch: {
    "$route.path"() {
      this.calcBread(); //观察地址栏，切换导航时地址栏会发生变化
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  // border: 1px solid #000;
  flex: 0 0 40px;
  background-color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
  .el-row {
    height: 100%;

    .el-col {
      height: 100%;
      display: flex;
      align-items: center;
    }
    /deep/.list {
      line-height: 40px;
    }

    .right-box {
      display: flex;
      justify-content: flex-end;
      .el-avatar {
        margin-left: 10px;
      }
    }
  }
}
</style>
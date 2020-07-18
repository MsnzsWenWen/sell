<template>
  <div class="login">
    <!-- <p>我是登录界面</p> -->

    <div class="box">
      <h3>系统登录</h3>

      <el-form
        :model="LoginForm"
        status-icon
        :rules="rules"
        ref="LoginForm"
        label-width="60px"
        class="demo-LoginForm"
        size="mini"
      >
        <!-- 登录 -->
        <el-form-item label="账号" prop="account" class="font" style="color:#fff">
          <el-input
            type="text"
            v-model="LoginForm.account"
            autocomplete="off"
            prefix-icon="iconfont icon-denglu"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->

        <el-form-item label="密码" prop="password" class="font">
          <el-input
            @click.native="changeType"
            :type="isopen?'text': 'password'"
            :suffix-icon="isopen?'iconfont  icon-yanjing1':'iconfont icon-yanjing'"
            v-model="LoginForm.password"
            prefix-icon="iconfont icon-mima"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('LoginForm')" class="button">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入ajax
import { checkLogin } from "@/api/account";
import { createRoutes } from "@/router/index";
// 引入本地存储工具函数
import local from "@/utils/local";
export default {
  data() {
    return {
      // 睁眼闭眼
      isopen: false,
      // 账号
      LoginForm: {
        account: "",
        password: ""
      },
      rules: {
        account: { required: true, message: "请输入密码", trigger: "blur" },

        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.LoginForm.validate(async valid => {
        if (valid) {
          let { code, role, token } = await checkLogin(this.LoginForm);
          // 判断
          if (code === 0) {
            local.set("t_k", token);
            this.$router.push("/");
            local.set("role", role); // 把用户权限存入本地
            createRoutes(); // 创建动态路由
          }
        } else {
          alert("登录失败");
          return false;
        }
      });
    },

    changeType(e) {
      // 给input绑定的事件 要使用委托 如果点击的是眼睛
      if (e.target.className.includes("icon-yanjing")) {
        // console.log(e.target);

        this.isopen = !this.isopen; // 切换输入框类型
      }
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  // background-color: #2d3a4b;
  background: url("../assets/imgs/banner2.jpg") no-repeat;

  // display: flex;
  background-size: cover;
  .box {
    position: absolute;
    width: 340px;
    height: 200px;
    // border: 1px solid #000;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
    // position: relative;

    h3 {
      font-size: 18px;
      color: #000;
      margin-bottom: 10px;
      position: absolute;
      top: -40px;
      right: 116px;
    }

    .button {
      width: 281px;
      background-color: rgba(255, 251, 240, 0.3);
      color: #000;
      border: none;
    }
    /deep/.el-input--mini .el-input__inner {
      border: none;
      background-color: rgba(255, 251, 240, 0.3);
      // border: 1px solid #ffffff;
      color: #000;
    }
  }
}
/deep/.el-form-item__label {
  color: #000;
}
</style>
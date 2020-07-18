<template>
  <div>
    <Pane>
      <!-- 头部 -->
      <span slot="title">添加账号</span>
      <div slot="content">
        <!-- 表单 -->
        <el-form
          ref="userFrom"
          :model="userFrom"
          label-width="80px"
          style="width: 315px; "
          :rules="rules"
          status-icon
        >
          <!-- 账号 -->
          <el-form-item label="账号" prop="account">
            <el-input v-model="userFrom.account"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input v-model="userFrom.password"></el-input>
          </el-form-item>
          <!-- 用户组 -->
          <el-form-item label="用户组" prop="userGroup">
            <el-select v-model="userFrom.userGroup" placeholder="请选择用户组">
              <el-option label="普通会员" value="普通会员"></el-option>
              <el-option label="超级会员" value="超级会员"></el-option>
            </el-select>
          </el-form-item>

          <!-- 添加重置 -->
          <el-form-item>
            <el-button type="primary" size="small" @click="submitForm">确认修改</el-button>
            <el-button size="small" @click="resetForm('userFrom')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </Pane>
  </div>
</template>

<script>
import { ACC_USR, ACC_PWD } from "@/utils/regular.js";
import Pane from "@/components/Pane/Pane.vue";
// 引入ajax
import { addAccount } from "@/api/account";

export default {
  components: {
    Pane
  },
  data() {
    // 表单自定义验证
    const validateName = (rule, val, callback) => {
      if (!val) {
        callback(new Error("请输入用户名"));
      } else if (!ACC_USR.test(val)) {
        callback(new Error("3到11位（字母，数字，下划线，减号）"));
      } else {
        callback();
      }
    };
    const validatePwd = (rule, val, callback) => {
      if (!val) {
        callback(new Error("请输入密码"));
      } else if (!ACC_PWD.test(val)) {
        callback(new Error("6到14位（字母，数字，下划线，减号）"));
      } else {
        callback();
      }
    };
    return {
      userFrom: {
        account: "",
        password: "",
        userGroup: ""
      },
      rules: {
        account: { required: true, validator: validateName, trigger: "blur" },
        password: { required: true, validator: validatePwd, trigger: "blur" },
        userGroup: {
          required: true,
          message: "请选择用户类型",
          trigger: "change"
        }
      }
    };
  },

  methods: {
    submitForm() {
      this.$refs.userFrom.validate(async valid => {
        if (valid) {
          let { code } = await addAccount(this.userFrom);
          if (code === 0) {
            this.$router.push("/account/account-list");
          } else {
            console.log("不能提交");
            return false;
          }
        }
      });
    },
    resetForm(e) {
      this.$refs[e].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
</style>
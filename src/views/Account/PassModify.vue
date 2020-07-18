<template>
  <div>
    <Pane>
      <!-- 头部 -->
      <span slot="title">修改密码</span>
      <div slot="content">
        <!-- 表单 -->
        <el-form
          ref="passFrom"
          :model="passFrom"
          label-width="80px"
          style="width: 315px; "
          :rules="rules"
          status-icon
        >
          <!-- 账号 -->
          <el-form-item label="原密码  " prop="oldPwd">
            <el-input v-model="passFrom.oldPwd"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="passFrom.newPwd"></el-input>
          </el-form-item>
          <!-- 用户组 -->
          <el-form-item label="确认密码" prop="confirmPwd">
            <el-input v-model="passFrom.confirmPwd"></el-input>
          </el-form-item>
          <!-- 添加重置 -->
          <el-form-item>
            <el-button type="primary" size="small" @click="submitForm">确认修改</el-button>
            <el-button size="small" @click="resetForm('passFrom')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </Pane>
  </div>
</template>

<script>
import Pane from "@/components/Pane/Pane.vue";
import { ACC_USR, ACC_PWD } from "@/utils/regular.js";
import { checkOldPwd, editPwd } from "@/api/account";
import local from "@/utils/local";

export default {
  components: {
    Pane
  },
  data() {
    const agreementPwd = (rule, val, callback) => {
      if (!val) {
        callback(new Error("请再次输入密码"));
      } else if (val !== this.passFrom.newPwd) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    const newPwd = (rule, val, callbacks) => {
      if (!val) {
        callbacks(new Error("请输入新密码"));
      } else if (!ACC_PWD.test(val)) {
        callbacks(new Error('"6到14位（字母，数字，下划线，减号）"'));
      } else {
        callbacks();
      }
    };
    // 旧密码验证
    const oldPwd = async (rule, val, callback) => {
      if (!val) {
        callback(new Error("请输入旧密码"));
      } else {
        let { code, msg } = await checkOldPwd({ oldPwd: val });
        if (code == "11") {
          callback(new Error(msg));
        } else {
          callback();
        }
      }
    };
    return {
      passFrom: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: ""
      },
      rules: {
        oldPwd: {
          required: true,
          validator: oldPwd,
          trigger: "blur"
        },
        newPwd: { required: true, validator: newPwd, trigger: "blur" },

        confirmPwd: {
          required: true,
          validator: agreementPwd,
          trigger: "blur"
        }
      }
    };
  },

  methods: {
    submitForm() {
      this.$refs.passFrom.validate(async valid => {
        if (valid) {
          // console.log("可以修改");
          let { code, msg } = await editPwd({ newPwd: this.passFrom.newPwd });
          if (code === 0) {
            local.clear(); // 清除本地存储
            this.$router.push("/login"); // 跳转到登录
          } else {
            console.log("不可以修改");
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
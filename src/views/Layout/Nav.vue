<template>
  <div class="nav">
    <div class="logo-container">
      <img width="30" height="30" alt src="../../assets/imgs/waimai.png" />
      外卖商家后台
    </div>

    <el-menu
      router
      background-color="#001529"
      text-color="#fff"
      :default-active="curActive"
      unique-opened
    >
      <template v-for="menu in menus">
        <!-- 没有儿子 -->
        <el-menu-item
          v-if="menu.children && menu.children.length === 1 || menu.path =='/order'"
          :key="menu.path"
          :index="menu.children && menu.children.length && menu.children[0].path !== '' ? menu.children[0].path : menu.path"
        >
          <i class="iconfont" :class="menu.meta.icon"></i>
          <span slot="title">{{ menu.meta.title }}</span>
        </el-menu-item>

        <!-- 有儿子 -->
        <el-submenu v-else :index="menu.path" :key="menu.path">
          <template slot="title">
            <i class="iconfont" :class="menu.meta.icon"></i>
            <span>{{ menu.meta.title }}</span>
          </template>

          <el-menu-item
            v-for="item in menu.children"
            :key="item.path"
            :index="item.path"
          >{{ item.meta.title }}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import local from "@/utils/local";

export default {
  data() {
    return {
      menus: []
    };
  },

  created() {
    // 获取当前菜单
    this.menus = local.get("menus");
    console.log(this.menus);
  },

  computed: {
    // 当前激活
    curActive() {
      if (this.$route.path === "/order/order-edit") return "/order/order-list";
      return this.$route.path;
    }
  }
};
</script>

<style lang="less" scoped>
.nav {
  flex: 0 0 200px;
  background-color: #001529;
  .logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    height: 40px;
    img {
      margin-right: 10px;
    }
  }
  .el-menu {
    border-right: 0px;
    .el-menu-item {
      .iconfont {
        color: #fff;
        margin-right: 5px;
      }
    }
    .el-submenu {
      .el-submenu__title {
        .iconfont {
          color: #fff;
          margin-right: 5px;
        }
      }
      .el-menu {
        .el-menu-item {
          background-color: #000c17 !important;
        }
        .el-menu-item:hover {
          background-color: rgba(48, 65, 86, 0.2) !important;
        }
      }
    }
  }
}
</style>
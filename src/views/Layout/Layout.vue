<template>
  <div class="layout">
    <!-- <h1>这是首页</h1> -->
    <!-- <router-view></router-view> -->
    <!-- 左侧导航 -->
    <Nav />

    <!-- 右侧内容 -->
    <Main />
  </div>
</template>

<script>
import Nav from "@/views/Layout/Nav.vue";
import Main from "@/views/Layout/Main/Main.vue";

export default {
  components: {
    Nav,
    Main
  }
};
</script>

<style lang="less" scoped>
.layout {
  display: flex;

  width: 100%;
  height: 100%;
}
</style>
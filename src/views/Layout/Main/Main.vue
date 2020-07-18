<template>
  <div class="main">
    <div class="header">
      <Header />
    </div>

    <div class="contents">
      <!-- 内容 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Header from "./Header.vue";

export default {
  components: {
    Header
  }
};
</script>

<style lang="less" scoped>
.main {
  flex: 1;
  height: 100%;
  overflow-y: scroll;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;

  .contents {
    // border: 1px solid #000;
    height: 100%;
    margin-left: 20px;
    flex: 1;
  }
}
</style>
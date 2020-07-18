<template>
  <div>
    <Pane>
      <!-- 头部 -->
      <span slot="title">个人中心</span>
      <div slot="content">
        <h1>表格</h1>
      </div>
    </Pane>
  </div>
</template>

<script>
import Pane from "@/components/Pane/Pane.vue";

export default {
  components: {
    Pane
  }
};
</script>

<style lang="less" scoped>
</style>
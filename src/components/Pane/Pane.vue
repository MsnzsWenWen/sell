<template>
  <div class="pane">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 头部 -->
        <slot name="title" />
      </div>

      <!-- 内容 -->
      <slot name="content" />
    </el-card>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.pane {
  margin-top: 20px;
}
</style>
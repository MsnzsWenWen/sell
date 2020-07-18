<template>
  <div>
    <h1>页面飞走了 404</h1>
    <p @click="$router.go(-1)">返回上一页</p>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
</style>
<template>
  <div class="car">
    <div>
      <p class="imgs">
        <img :src="CarData.imgUrl" alt />
      </p>
      <div class="content">
        <h5 class="title">{{CarData.title}}</h5>
        <p class="num">{{CarData.num}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    CarData: {
      type: Object,
      default: () => ({}),
      required: true
    }
  }
};
</script>

<style lang="less" scoped>
.car {
  //   flex: 0 0 100px;
  // background-color: white;
  display: flex;
  //   justify-content: space-between;
  height: 100px;
  //   box-shadow: 0px 0px 5px #ccc;
  div {
    width: 300px;
    // border: 1px solid #000;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #ffffff;
    border-radius: 5px;

    .imgs {
      flex: 0 0 120px;
      text-align: center;
    }
    .content {
      display: flex;
      flex-direction: column;
      flex: 1;
      .title {
        color: #cccccc;
        font-weight: 550;
        font-size: 18px;
        line-height: 1.5;
      }
      .num {
        color: #333;
        font-weight: 550;
        line-height: 1.7;
      }
    }
  }
}
</style>
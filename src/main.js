import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "@/assets/fonts/iconfont.css";
import "@/assets/css/reset.css";
// 引入 echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
// 引入element-ui
import ElementUI from 'element-ui'; // 组件
import 'element-ui/lib/theme-chalk/index.css'; // 样式
Vue.use(ElementUI);
Vue.config.productionTip = false
// 中介
Vue.prototype.$bus = new Vue();

Vue.config.productionTip = false;




new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

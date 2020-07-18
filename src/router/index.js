import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Layout from '../views/Layout/Layout.vue'
// 引入本地存储
import local from "@/utils/local";
// 解决重复跳转到自己警告让人难受的问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};



Vue.use(VueRouter)

const routes = [
  {
    path: '/login',

    component: Login
  },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: () => import("@/views/Home.vue")
      }
    ]
  },

]

//动态路由
const asyncRoutes = [
  // 登录
  {
    path: "/login",
    component: Login,
    visible: false,
  },

  // 后端大布局
  // 首页
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    visible: true,
    meta: { title: "后台首页", icon: "icon-shouye1-copy" },
    children: [
      {
        path: "/home",
        component: () => import("@/views/Home.vue"), // 路由懒加载写法
      },
    ],
  },

  // 订单管理
  {
    path: "/order",
    component: Layout,
    redirect: "/order/order-list",
    visible: true,
    meta: {
      title: "订单管理",
      icon: " icon-icon-",
      role: ["super"],
    },
    children: [
      {
        path: "/order/order-list",
        component: () => import("@/views/Order/OrderList.vue"),
        meta: { title: "订单列表" },
      },
      {
        path: "/order/order-edit",
        name: "orderEdit",
        component: () => import("@/views/Order/OrderEdit.vue"),
        meta: { title: "订单编辑" },
      },
    ],
  },
  // 商品管理
  {
    path: "/goods",
    component: Layout,
    redirect: "/goods/goods-list",
    visible: true,
    meta: {
      title: "商品管理",
      icon: "icon-jichuguanli",
      role: ["super", "normal"],
    },
    children: [
      {
        path: "/goods/goods-list",
        component: () => import("@/views/Goods/GoodsList.vue"),
        meta: { title: "商品列表" },
      },
      {
        path: "/goods/goods-add",
        component: () => import("@/views/Goods/GoodsAdd.vue"),
        meta: { title: "商品添加", role: ["super"] },
      },
      {
        path: "/goods/goods-cate",
        component: () => import("@/views/Goods/GoodsCate.vue"),
        meta: { title: "商品分类" },
      },
    ],
  },
  // 店铺管理
  {
    path: "/shop",
    component: Layout,
    visible: true,
    meta: { title: "店铺管理", icon: "icon-dianpu" },
    children: [
      {
        path: "",
        component: () => import("@/views/Shop.vue"),
      },
    ],
  },
  // 账号管理
  {
    path: "/account",
    component: Layout,
    redirect: "/account/account-list",
    visible: true,
    meta: {
      title: "账号管理",
      icon: "icon-denglu",
      role: ["super", "normal"],
    },
    children: [
      {
        path: "/account/account-add",
        component: () => import("@/views/Account/AccountAdd.vue"),
        meta: { title: "账号添加", role: ["super"] },
      },
      {
        path: "/account/account-list",
        component: () => import("@/views/Account/AccountList.vue"),
        meta: { title: "账号列表", role: ["super"] },
      },
      {
        path: "/account/pass-modify",
        component: () => import("@/views/Account/PassModify.vue"),
        meta: { title: "密码修改" },
      },
      {
        path: "/account/personal",
        component: () => import("@/views/Account/Personal.vue"),
        meta: { title: "个人中心" },
      },
    ],
  },
  // 销售统计
  {
    path: "/total",
    component: Layout,
    redirect: "/total/goods-total",
    visible: true,
    meta: { title: "销售统计", icon: "icon-tongji", role: ["super"] },
    children: [
      {
        path: "/total/goods-total",
        component: () => import("@/views/Total/GoodsTotal.vue"),
        meta: { title: "商品统计" },
      },
      {
        path: "/total/order-total",
        component: () => import("@/views/Total/OrderTotal.vue"),
        meta: { title: "订单统计" },
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/Error404.vue"),
    visible: false,
  },
  {
    path: "*",
    redirect: "/404",
    visible: false,
  },
];


const router = new VueRouter({
  routes
})
// 路由保护
router.beforeEach((to, from, next) => {
  // 判断账号是否登录
  let isLogin = local.get("t_k") ? true : false;

  if (isLogin) {
    next(); // 如果登录过 直接放行
  } else {
    // 如果去的是登录
    if (to.path === "/login") {
      next(); // 放行
    } else {
      next({ path: "/login" }); // 否则 去的就是别的页面 重置到登录
    }
  }
})


/**
 * @description: 判断当前路由对象 有权限还是没有
 * @param: router 当前路由对象
 * @param: role 当前用户角色
 * @returns: true 有权限 false 没有权限
 */
function hasPermission(router, role) {
  // 如果路由中有meta 且 meta中有role 证明是配置了权限 需要做权限的
  if (router.meta && router.meta.role) {
    return router.meta.role.includes(role);
  } else {
    // 否则就是没有配 [没有配置的 默认都是有权限]
    return true;
  }
}

/**
 * @description: 计算出当前角色有权限访问的路由
 * @param: asyncRoutes 当前所有动态路由
 * @param: role  当前用户角色
 * @returns:  数组 当前可以访问的路由数组
 */
function calcRoutes(asyncRoutes, role) {
  let accessRoutes = asyncRoutes.filter((router) => {
    if (hasPermission(router, role)) {
      if (router.children && router.children.length) {
        router.children = calcRoutes(router.children, role); // 递归过滤
      }
      return true;
    } else {
      return false;
    }
  });
  return accessRoutes;
}

/*
  判断在不在左侧显示
  参数1：当前路由对象
  参数2: 当前角色
*/
function isVisible(router, role) {
  if (router.visible) {
    return true;
  } else {
    return false;
  }
}

/**
 * 计算菜单
 * 参数1： 当前有权限访问的路由
 * 参数2： 当前角色
 */
function calcMenus(accessRoutes, role) {
  let arr = accessRoutes.filter((router) => {
    if (isVisible(router, role)) {
      return true;
    } else {
      return false;
    }
  });
  return arr;
}

/*
  根据当前角色，动态创建出可以当前角色可以访问的路由
*/
export function createRoutes() {

  let role = local.get("role");
  console.log(role);
  // 计算出有权限访问的路由
  let accessRoutes = calcRoutes(asyncRoutes, role);

  // 动态添加路由 【把算出来的权限路由 动态挂载】
  router.addRoutes(accessRoutes);

  // 计算动态的菜单
  let menus = calcMenus(accessRoutes, role);

  // 存入本地
  local.set("menus", menus);
}
createRoutes();

export default router;

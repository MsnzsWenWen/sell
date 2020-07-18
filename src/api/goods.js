
// 引入工具函数
import req from "@/utils/request"


//修改分类
export function editCate(params) {
    return req.post("/goods/editcate", params);
}



// 1.获取订单
export function getGoods(params) {
    return req.get("/goods/catelist", params);
}
// 查询所有分类名称
export function getCateNames(params) {
    return req.get("/goods/categories", params);
}
// 添加商品
export function goodsAdd(params) {
    return req.post("/goods/add", params);
}


// 添加分类
export function addGoods(params) {
    return req.post("/goods/addcate", params);
}
// 获取商品列表

export function getGoodsList(params) {
    return req.get("/goods/list", params);
}

// 删除商品

export function addGoodsList(params) {
    return req.get("/goods/del", params);
}

// 删除分类

export function delGoods(params) {
    return req.get("/goods/delcate", params);
}

// 修改商品
export function editGoods(params) {
    return req.post("/goods/edit", params);
}


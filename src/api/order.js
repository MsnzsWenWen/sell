
// 引入工具函数
import req from "@/utils/request"


//获取订单列表

export function getOrderList(params) {
    return req.get("/order/list", params);
}

// 查询

export function selectList(params) {
    return req.get("/order/search", params);
}
// 获取订单详情
export function getOrderDeta(params) {
    return req.get("/order/detail", params);
}
// 修改订单
export function editOrder(params) {
    return req.post("/order/edit", params);
}

// 首页报表
export function getTotalData(params) {
    return req.get("/order/totaldata", params);
}

// 订单报表
export function getOrderTotalData(params) {
    return req.get("/order/ordertotal", params);
}
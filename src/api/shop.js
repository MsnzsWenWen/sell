// 引入工具函数
import req from "@/utils/request"


//获取订单列表

export function shopInfrom(params) {
    return req.get("/shop/info", params);
}


export function editShop(params) {
    return req.post("/shop/edit", params);
}

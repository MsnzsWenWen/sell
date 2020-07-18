// 账户管理模块所有请求

// 引入工具函数
import req from "@/utils/request"


// 1.获取账号列表
export function getAccountList(params) {
    return req.get("/users/list", params);
}
// 2.登录
export function checkLogin(params) {
    return req.post("/users/checkLogin", params);
}
// 3.删除
export function delAccount(params) {
    return req.get("/users/del", params);
}
// 4.批量删除
export function AlldelAccount(params) {
    return req.get("/users/batchdel", params);
}

// 5.信息编辑

export function saveEditAccount(params) {
    return req.post("/users/edit", params);
}

// 6.添加账号
export function addAccount(params) {
    return req.post("/users/add", params);
}

// 7.旧密码验证
export function checkOldPwd(params) {
    return req.get("/users/checkoldpwd", params);
}

// 8.修改密码
export function editPwd(params) {
    return req.post("/users/editpwd", params);
}


// 9.获取账号
export function getAccount(params) {
    return req.get("users/info", params);
}

// 10.头像上传
export function modifyImg(params) {
    return req.post("/users/avatar_upload", params);
}


// 10.修改头像
export function editAvatar(params) {
    return req.get("/users/avataredit", params);
}
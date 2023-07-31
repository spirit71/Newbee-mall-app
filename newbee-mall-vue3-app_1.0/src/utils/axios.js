/**
 * 严肃声明：
 * 开源版本请务必保留此注释头信息，若删除我方将保留所有法律责任追究！
 * 本系统已申请软件著作权，受国家版权局知识产权以及国家计算机软件著作权保护！
 * 可正常分享和学习源码，不得用于违法犯罪活动，违者必究！
 * Copyright (c) 2020 陈尼克 all rights reserved.
 * 版权所有，侵权必究！
 */
import axios from "axios";
import { showToast, showFailToast } from "vant";
import { setLocal } from "@/common/js/utils";
import router from "../router";

console.log("import.meta.env", import.meta.env);

// axios.defaults.baseURL =
//   import.meta.env.MODE == "development"
//     ? "//1.13.173.161:9092/api/v1"
//     : "//1.13.173.161:9092/api/v1";
// axios.defaults.baseURL =
//   import.meta.env.MODE == "development"
//     ? "//1.13.173.161:9092/api/v1"
//     : "//backend-api-01.newbee.ltd/api/v1";
//
// 默认baseURL,根据当前运行环境不同，会将请求的URL前缀设置为不同的值。
axios.defaults.baseURL =
  import.meta.env.MODE == "development"
    ? "//localhost:8087/api/v1"
    : "//localhost:8087/api/v1";
    // 表示在跨域请求时，允许携带cookies。
axios.defaults.withCredentials = true;
// 设置请求头，X-Requested-With表示请求的类型，这里设置为XMLHttpRequest。
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
// 通过localStorage获取token的值，如果没有获取到则设置为空字符串。
axios.defaults.headers["token"] = localStorage.getItem("token") || "";
// 默认post请求，使用application/json的格式
axios.defaults.headers.post["Content-Type"] = "application/json";
// axios的响应拦截器。拦截器会在响应返回到应用之前执行，允许我们对响应进行一些处理。
// 如果响应数据的类型不是对象，则会显示一个错误提示。
axios.interceptors.response.use((res) => {
  if (typeof res.data !== "object") {
    showFailToast("服务端异常！");
    return Promise.reject(res);
  }
  if (res.data.resultCode != 200) {
    if (res.data.message) showFailToast(res.data.message);
    // 416 未登录
    if (res.data.resultCode == 416) {
      // 路由跳转到登录页面
      router.push({ path: "/login" });
    }
    // 如果响应数据中包含token值，并且当前URL为登录页面，
    // 则将获取到的token值保存到localStorage中，并更新请求头中的token值。
    if (res.data.data && window.location.hash == "#/login") {
      setLocal("token", res.data.data);
      axios.defaults.headers["token"] = res.data.data;
    }
    return Promise.reject(res.data);
  }

  return res.data;
});

export default axios;

import axios from "axios";
import config from "@/config";
import { Toast } from "antd-mobile";

const statusTips: any = {
  400: "请求错误",
  401: "未授权,请登录",
  403: "拒绝访问",
  404: "请求地址出错",
  408: "请求超时",
  500: "服务器内部错误",
  501: "服务未实现",
  502: "网关错误",
  503: "服务不可用",
  504: "网关超时",
};

const request = axios.create({
  baseURL: config.apiPrefix,
  timeout: 60000,
});

// 请求拦截，增加token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("userid");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["X-Custom-Header"] = userid;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response) => {
    const { data } = response;
    const newToken = response.headers["new-token"];
    if (newToken) {
      localStorage.setItem("token", newToken);
    }
    if (response.status === 200 && data.code === 0) {
      if (data.message && response.config.headers.isHideMessage !== "true") {
        Toast.show({
          content: data.message,
          position: "top",
        });
      }
      return data.data;
    } else {
      return Promise.reject(data.message || "error");
    }
  },
  (error) => {
    const status = error.response.status;
    if (status && statusTips[status]) {
      if (status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        Toast.show({
          position: "top",
          content: error.response.data.message || statusTips[status],
        });
      }
    }
    return Promise.reject(error);
  },
);

export default request;

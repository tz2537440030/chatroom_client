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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    if (response.status === 200 && data.code === 0) {
      if (data.message) {
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
        window.location.href = "/login";
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

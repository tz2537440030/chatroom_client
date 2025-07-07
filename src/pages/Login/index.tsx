import useRequest from "@/hooks/useRequest";
import { login } from "@/services/global";
import { useState } from "react";
import AuthInput from "@/components/AuthInput";
import config from "@/config";
import { Button } from "antd-mobile";
import AuthLayout from "@/pages/Layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { hashPassword } from "@/utils/utils";

interface LoginParams {
  username: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [loginParams, setLoginParams] = useState<LoginParams>({
    username: "",
    password: "",
  });

  const { loading, run } = useRequest<LoginParams, any>(login, {
    manual: true,
    onSuccess: (res) => {
      localStorage.setItem("token", res.token);
    },
  });

  const handleLogin = async () => {
    run({
      username: loginParams.username,
      password: await hashPassword(loginParams.password),
    });
  };

  const handleLoginParamsChange = (key: any, v: any) => {
    setLoginParams({
      ...loginParams,
      [key]: v,
    });
  };

  const handleLinkRegister = () => {
    navigate("/register");
  };

  const returnLoginContent = () => {
    return (
      <>
        <AuthInput
          placeholder="请输入账号"
          value={loginParams.username}
          onChange={(v) => {
            handleLoginParamsChange("username", v);
          }}
          className="mb-4"
        />
        <AuthInput
          placeholder="请输入密码"
          value={loginParams.password}
          type="password"
          onChange={(v) => {
            handleLoginParamsChange("password", v);
          }}
          className="mb-8"
        />
        <Button
          color="primary"
          size="large"
          fill="solid"
          className="mb-4 rounded-xl"
          onClick={handleLogin}
          loading={loading}
        >
          登录
        </Button>
        <Button
          color="default"
          size="large"
          fill="solid"
          className="rounded-xl"
          onClick={handleLinkRegister}
        >
          注册
        </Button>
      </>
    );
  };

  return (
    <>
      <AuthLayout title={config.appName} children={returnLoginContent()} />
    </>
  );
};

export default Login;

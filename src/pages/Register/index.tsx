import useRequest from "@/hooks/useRequest";
import { register } from "@/services/global";
import { useState } from "react";
import AuthInput from "@/components/AuthInput";
import { Button } from "antd-mobile";
import AuthLayout from "@/pages/Layouts/AuthLayout";
import { useNavigate } from "react-router-dom";

interface RegisterFormParams {
  username: string;
  password: string;
  nickname: string;
}

interface RegisterParams extends RegisterFormParams {
  passwordConfirm: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [registerParams, setRegisterParams] = useState<RegisterParams>({
    username: "",
    password: "",
    nickname: "",
    passwordConfirm: "",
  });

  const { data, loading, error, run } = useRequest<RegisterFormParams, any>(
    register,
    {
      manual: true,
      onSuccess: () => {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      },
    },
  );

  const handleRegister = () => {
    run({
      username: registerParams.username,
      password: registerParams.password,
      nickname: registerParams.nickname,
    });
  };

  const handleRegisterParamsChange = (key: any, v: any) => {
    setRegisterParams({
      ...registerParams,
      [key]: v,
    });
  };

  const handleLinkLogin = () => {
    navigate("/");
  };

  const returnRegisterContent = () => {
    return (
      <>
        <AuthInput
          placeholder="请输入账号"
          value={registerParams.username}
          onChange={(v) => {
            handleRegisterParamsChange("username", v);
          }}
          className="mb-4"
        />
        <AuthInput
          placeholder="请输入昵称"
          value={registerParams.nickname}
          onChange={(v) => {
            handleRegisterParamsChange("nickname", v);
          }}
          className="mb-4"
        />
        <AuthInput
          placeholder="请输入密码"
          value={registerParams.password}
          type="password"
          onChange={(v) => {
            handleRegisterParamsChange("password", v);
          }}
          className="mb-4"
        />
        <AuthInput
          placeholder="请再次输入密码"
          value={registerParams.passwordConfirm}
          type="password"
          onChange={(v) => {
            handleRegisterParamsChange("passwordConfirm", v);
          }}
          className="mb-8"
        />
        <Button
          color="primary"
          size="large"
          fill="solid"
          className="mb-4 rounded-xl"
          onClick={handleRegister}
          loading={loading}
        >
          确认
        </Button>
        <Button
          color="default"
          size="large"
          fill="solid"
          className="rounded-xl"
          onClick={handleLinkLogin}
        >
          取消
        </Button>
      </>
    );
  };

  return (
    <>
      <AuthLayout title="注册" children={returnRegisterContent()} />
    </>
  );
};

export default Register;

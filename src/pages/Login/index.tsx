import useRequest from "@/hooks/useRequest";
import { login } from "@/services/global";
import { useState } from "react";
import { Button, Form, Input } from "antd-mobile";

interface LoginParams {
  username: string;
  password: string;
}

const Login = () => {
  const [loginParams, setLoginParams] = useState<LoginParams>({
    username: "",
    password: "",
  });
  const { data, loading, error, run } = useRequest<LoginParams, any>(login, {
    manual: true,
    onSuccess: () => {
      console.log(data, loading, error);
    },
  });

  const handleLogin = () => {
    run(loginParams);
  };

  const handleLoginParamsChange = (key: any, e: any) => {
    setLoginParams({
      ...loginParams,
      [key]: e.target.value,
    });
  };

  return (
    <>
      <div className="pr-4">
        <Form layout="horizontal" mode="card">
          <Form.Header>卡片模式及分组</Form.Header>
          <Form.Item label="手机号" className="bg-gray">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="短信验证码">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Header />
          <Form.Item label="姓名">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="邮箱地址">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="所在城市">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Header />
        </Form>
        <Form layout="horizontal" mode="card">
          <Form.Header>带辅助操作</Form.Header>
          <Form.Item label="短信验证码" extra={<a>发送验证码</a>}>
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Login;

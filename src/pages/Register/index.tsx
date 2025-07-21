import useRequest from "@/hooks/useRequest";
import { register, sendVerifyCode } from "@/services/global";
import AuthInput from "@/components/AuthInput";
import { Button, Form, Toast } from "antd-mobile";
import AuthLayout from "@/pages/Layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { hashPassword } from "@/utils/utils";

interface RegisterFormParams {
  username: string;
  password: string;
  nickname: string;
  code: string;
  passwordConfirm?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const username = Form.useWatch("username", form);
  const code = Form.useWatch("code", form);
  const [timer, setTimer] = useState(0);

  // 注册
  const { loading, run } = useRequest<RegisterFormParams, any>(register, {
    onSuccess: () => {
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
  });

  // 发送验证码
  const { run: runCode } = useRequest<{ username: string }, any>(
    sendVerifyCode,
    {
      onSuccess: () => {
        setTimer(60);
      },
    },
  );

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }
  }, [timer]);

  const handleRegister = async () => {
    try {
      const values = await form.validateFields();
      if (values.password !== values.passwordConfirm) {
        Toast.show({
          content: "两次密码不一致",
          position: "top",
        });
        return;
      }
      run({
        username: values.username,
        password: await hashPassword(values.password),
        nickname: values.nickname,
        code: values.code,
      });
    } catch (error: any) {
      Toast.show({
        content: error.errorFields[0].errors[0],
        position: "top",
      });
    }
  };

  const handleSendCode = () => {
    runCode({
      username,
    });
  };

  const handleLinkLogin = () => {
    navigate("/");
  };

  const returnRegisterContent = () => {
    return (
      <>
        <Form
          className={styles.registerForm}
          form={form}
          hasFeedback={false}
          footer={
            <>
              <Button
                color="primary"
                size="large"
                fill="solid"
                className="mb-4 w-full rounded-xl"
                onClick={handleRegister}
                loading={loading}
                disabled={!code}
              >
                确认
              </Button>
              <Button
                color="default"
                size="large"
                fill="solid"
                className="w-full rounded-xl"
                onClick={handleLinkLogin}
              >
                取消
              </Button>
            </>
          }
        >
          <Form.Item
            name="username"
            className="mb-4"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入正确的邮箱格式" },
            ]}
          >
            <AuthInput placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="nickname"
            className="mb-4"
            rules={[
              { required: true, message: "请输入昵称" },
              { type: "string", min: 1, max: 8, message: "请输入1-8位昵称" },
            ]}
          >
            <AuthInput placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item
            name="password"
            className="mb-4"
            rules={[
              { required: true, message: "请输入密码" },
              { type: "string", min: 6, max: 16, message: "请输入6-16位密码" },
            ]}
          >
            <AuthInput placeholder="请输入密码" type="password" />
          </Form.Item>
          <Form.Item
            name="passwordConfirm"
            className="mb-4"
            rules={[
              { required: true, message: "请输入密码" },
              { type: "string", min: 6, max: 16, message: "请输入6-16位密码" },
            ]}
          >
            <AuthInput placeholder="请再次输入密码" type="password" />
          </Form.Item>
          <div className="mb-8 flex justify-between gap-2">
            <Form.Item
              name="code"
              className="grow"
              rules={[{ required: true, message: "请输入验证码" }]}
            >
              <AuthInput placeholder="请输入邮箱验证码" />
            </Form.Item>
            <Button
              onClick={handleSendCode}
              disabled={!username || timer !== 0}
              className="grow rounded-xl border border-gray-100 bg-card text-sm text-gray-900"
            >
              {timer !== 0 ? `${timer}s` : "发送验证码"}
            </Button>
          </div>
        </Form>
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

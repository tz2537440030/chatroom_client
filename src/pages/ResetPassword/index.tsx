import useRequest from "@/hooks/useRequest";
import { sendVerifyCode } from "@/services/global";
import { selectCurrentUser } from "@/store/authSlice";
import { Button, Form, Input } from "antd-mobile";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { changePassword } from "@/services/global";
import { useNavigate } from "react-router-dom";
import { hashPassword } from "@/utils/utils";

const RetPassword = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [timer, setTimer] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [form] = Form.useForm();
  const { run: runCode } = useRequest<{ username: string }, any>(
    sendVerifyCode,
    {
      onSuccess: () => {
        setTimer(60);
      },
    },
  );

  const { loading, run } = useRequest<any, any>(changePassword, {
    onSuccess: () => {
      setBtnDisabled(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
  });

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }
  }, [timer]);

  const handleSubmit = async () => {
    const formFields = form.getFieldsValue();
    run({ ...formFields, password: await hashPassword(formFields.password) });
  };

  return (
    <Form
      layout="horizontal"
      initialValues={{ username: user.username }}
      form={form}
      onFinish={handleSubmit}
      footer={
        <Button
          block
          type="submit"
          color="primary"
          size="large"
          loading={loading}
          disabled={btnDisabled}
        >
          提交
        </Button>
      }
    >
      <Form.Item name="username" label="用户名">
        <Input disabled placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        label="短信验证码"
        name="code"
        rules={[{ required: true, message: "请输入验证码" }]}
        extra={
          <a
            className="text-primary"
            onClick={() => runCode({ username: user.username })}
          >
            {timer !== 0 ? `${timer}s` : "发送验证码"}
          </a>
        }
      >
        <Input placeholder="请输入" type="number" />
      </Form.Item>
      <Form.Item
        name="password"
        label="新密码"
        rules={[
          { required: true, message: "请输入密码" },
          { type: "string", min: 6, max: 16, message: "请输入6-16位密码" },
        ]}
      >
        <Input placeholder="请输入新密码" type="password" />
      </Form.Item>
    </Form>
  );
};

export default RetPassword;

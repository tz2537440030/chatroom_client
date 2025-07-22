import useRequest from "@/hooks/useRequest";
import { changePassword } from "@/services/global";
import { Form } from "antd-mobile";
import AuthLayout from "@/pages/Layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { hashPassword } from "@/utils/utils";
import RegisterFormOrResetPasswordForm from "@/components/RegisterFormOrResetPasswordForm";

const ResetPasswordFromLogin = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // 修改密码
  const { loading, run } = useRequest<any, any>(changePassword, {
    onSuccess: () => {
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
  });

  const handleResetPassword = async (values: any) => {
    run({
      username: values.username,
      password: await hashPassword(values.password),
      code: values.code,
    });
  };

  const returnResetPasswordContent = () => {
    return (
      <RegisterFormOrResetPasswordForm
        form={form}
        onSubmit={handleResetPassword}
        loading={loading}
        isFromReset={true}
      />
    );
  };

  return (
    <>
      <AuthLayout title="忘记密码" children={returnResetPasswordContent()} />
    </>
  );
};

export default ResetPasswordFromLogin;

import { Input, type InputProps } from "antd-mobile";
import "./index.css";

const AuthInput = ({ ...inputProps }: InputProps) => {
  return (
    <Input
      {...inputProps}
      className={`auth-login-input ${inputProps.className}`}
    />
  );
};

export default AuthInput;

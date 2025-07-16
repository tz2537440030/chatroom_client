import { Input, type InputProps } from "antd-mobile";
import styles from "./index.module.css";

const AuthInput = ({ ...inputProps }: InputProps) => {
  return (
    <Input
      {...inputProps}
      className={`${styles["auth-login-input"]} ${inputProps.className}`}
    />
  );
};

export default AuthInput;

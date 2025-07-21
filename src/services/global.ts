import request from "@/utils/request";
export const register = ({
  username,
  password,
  nickname,
  code,
}: {
  username: string;
  password: string;
  nickname: string;
  code: string;
}) => {
  return request.post("/auth/register", {
    username,
    password,
    nickname,
    code,
  });
};

export const login = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  return request.post("/auth/login", {
    username,
    password,
  });
};

export const logout = () => {
  return request.post("/auth/logout");
};

export const sendVerifyCode = ({ username }: { username: string }) => {
  return request.post("/auth/send-verify-code", {
    username,
  });
};

export const verifyCode = ({
  username,
  code,
}: {
  username: string;
  code: string;
}) => {
  return request.post("/auth/verify-code", {
    username,
    code,
  });
};

export const changeUserInfo = (userInfo: any) => {
  return request.post("/auth/changeUserInfo", userInfo);
};

export const uploadFile = (file: any) => {
  return request.post("/upload/upload", file);
};

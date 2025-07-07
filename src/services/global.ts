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

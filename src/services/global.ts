import request from "@/utils/request";
export const register = ({
  username,
  password,
  nickname,
}: {
  username: string;
  password: string;
  nickname: string;
}) => {
  return request.post("/auth/register", {
    username,
    password,
    nickname,
  });
};

export const login = ({
  username,
  password,
}: {
  username: string;
  password: string;
  nickname: string;
}) => {
  return request.post("/auth/login", {
    username,
    password,
  });
};

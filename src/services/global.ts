import request from "@/utils/request";
export const login = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  return request.post("/login", {
    username,
    password,
  });
};

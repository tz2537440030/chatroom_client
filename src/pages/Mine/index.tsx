import { selectCurrentUser } from "@/store/authSlice";
import { Avatar, List } from "antd-mobile";
import { useSelector } from "react-redux";
import { PictureOutline, UploadOutline } from "antd-mobile-icons";
import { persistor } from "@/store";
import { useNavigate } from "react-router-dom";

const Mine = () => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const mineList = [
    {
      name: "朋友圈",
      icon: <PictureOutline />,
      onClick: () => {},
    },
    {
      name: "退出登录",
      icon: <UploadOutline />,
      onClick: () => {
        persistor.purge();
        localStorage.removeItem("token");
        localStorage.removeItem("userid");
        navigate("/");
      },
    },
  ];

  return (
    <>
      <List header="个人信息" className="mb-4">
        <List.Item
          key={currentUser.username}
          prefix={<Avatar src="" />}
          description={currentUser.username}
        >
          {currentUser.nickname}
        </List.Item>
      </List>
      <List>
        {mineList.map((item) => (
          <List.Item key={item.name} prefix={item.icon} onClick={item.onClick}>
            {item.name}
          </List.Item>
        ))}
      </List>
    </>
  );
};

export default Mine;

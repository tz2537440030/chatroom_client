import { NavBar, TabBar } from "antd-mobile";
import {
  MessageOutline,
  UserOutline,
  UserContactOutline,
} from "antd-mobile-icons";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import useRequest from "@/hooks/useRequest";
import { getFriendList } from "@/services/contact";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentChatUser } from "@/store/chatSlice";
import { setFriendList } from "@/store/userSlice";

const HomeLayout = (props: { isBlank?: boolean }) => {
  const { isBlank } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentChatUser = useSelector(selectCurrentChatUser);
  const [title, setTitle] = useState("消息");
  const { pathname } = location;
  const tabs = [
    {
      key: "/layout",
      title: "消息",
      icon: <MessageOutline />,
      badge: "99+",
    },
    {
      key: "/layout/contact",
      title: "联系人",
      icon: <UserContactOutline />,
    },
    {
      key: "/layout/mine",
      title: "我的",
      icon: <UserOutline />,
    },
  ];

  const { run: runGetRequestList } = useRequest(getFriendList, {
    onSuccess: (res) => {
      dispatch(setFriendList({ friendList: res }));
    },
  });

  const setRouteActive = (value: string) => {
    setTitle(tabs.find((item) => item.key === value)?.title || "");
    navigate(value);
  };

  const handleBack = () => {
    isBlank ? navigate(-1) : null;
  };

  useEffect(() => {
    runGetRequestList();
  }, []);

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <NavBar
        className={styles["layout-header"]}
        onBack={handleBack}
        back={isBlank ? "" : null}
      >
        {currentChatUser?.nickname || title}
      </NavBar>
      <div
        className={styles["layout-main"]}
        style={{ marginBottom: isBlank ? "0" : "4rem" }}
      >
        <Outlet />
      </div>
      {!isBlank && (
        <TabBar
          className={styles["layout-tabbar"]}
          activeKey={pathname}
          onChange={(value) => setRouteActive(value)}
        >
          {tabs.map((item) => (
            <TabBar.Item
              className="flex flex-col items-center p-2"
              key={item.key}
              icon={item.icon}
              title={item.title}
              badge={item.badge}
            />
          ))}
        </TabBar>
      )}
    </div>
  );
};

export default HomeLayout;

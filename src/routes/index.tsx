import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import HomeLayout from "@/pages/Layouts/HomeLayout";
import MessageList from "@/pages/MessageList";
import Contact from "@/pages/Contact";
import Mine from "@/pages/Mine";
import NewFriend from "@/pages/NewFriend";
import Chat from "@/pages/Chat";
import UserInfo from "@/pages/UserInfo";
import ResetPassword from "@/pages/ResetPassword";
import ResetPasswordFromLogin from "@/pages/ResetPassword/ResetPasswordFromLogin";
import Moment from "@/pages/Moment";
import { CameraOutline } from "antd-mobile-icons";
import { Button } from "antd-mobile";
import Post from "@/pages/Moment/post";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordFromLogin />,
  },
  {
    path: "/layout",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <MessageList />,
        handle: {
          title: "消息",
        },
      },
      {
        path: "contact",
        element: <Contact />,
        handle: {
          title: "联系人",
        },
      },
      {
        path: "mine",
        element: <Mine />,
        handle: {
          title: "我的",
        },
      },
    ],
  },
  {
    path: "/layout-blank",
    element: <HomeLayout isBlank />,
    children: [
      {
        path: "new-friend",
        element: <NewFriend />,
        handle: {
          title: "新的朋友",
        },
      },
      {
        path: "chat",
        element: <Chat />,
        handle: {
          title: "聊天",
        },
      },
      {
        path: "user-info",
        element: <UserInfo />,
        handle: {
          title: "个人信息",
        },
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
        handle: {
          title: "重置密码",
        },
      },
      {
        path: "moment",
        element: <Moment />,
        handle: {
          title: "朋友圈",
          right: (onClick: () => void) => (
            <CameraOutline fontSize={24} onClick={onClick} />
          ),
        },
      },
      {
        path: "post-moment",
        element: <Post />,
        handle: {
          title: "发布",
          right: (onClick: () => void) => (
            <Button color="success" size="small" onClick={onClick}>
              发布
            </Button>
          ),
        },
      },
    ],
  },
]);

export default router;

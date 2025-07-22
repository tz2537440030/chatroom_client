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
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "mine",
        element: <Mine />,
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
      },
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "user-info",
        element: <UserInfo />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);

export default router;

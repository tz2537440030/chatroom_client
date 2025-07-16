import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import HomeLayout from "@/pages/Layouts/HomeLayout";
import MessageList from "@/pages/MessageList";
import Contact from "@/pages/Contact";
import Mine from "@/pages/Mine";
import NewFriend from "@/pages/NewFriend";
import Chat from "@/pages/Chat";

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
    ],
  },
]);

export default router;

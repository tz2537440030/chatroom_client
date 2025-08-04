import { Badge, NavBar, TabBar } from "antd-mobile";
import {
  MessageOutline,
  UserOutline,
  UserContactOutline,
} from "antd-mobile-icons";
import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { forwardRef, useEffect, useRef } from "react";
import useRequest from "@/hooks/useRequest";
import { getFriendList, getFriendRequestList } from "@/services/contact";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCurrentConversationUnreadCount,
  selectCurrentChatConversationId,
  selectCurrentChatUser,
  selectTotalUnreadMessageCount,
  setConversation,
} from "@/store/chatSlice";
import {
  selectFriendRequestList,
  setFriendList,
  setFriendRequestList,
} from "@/store/userSlice";
import { initWebSocket, onMessage } from "@/services/websocket";
import { NEW_FRIEND_REQUEST, UPDATE_CONVERSATION_LIST } from "@/const";
import { changeMessageStatus } from "@/services/chat";
import { selectCurrentUser } from "@/store/authSlice";

const OutletWrapper = forwardRef((_props, ref) => {
  return <Outlet context={{ ref }} />;
});

const HomeLayout = (props: { isBlank?: boolean }) => {
  const { isBlank } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const matches = useMatches(); // 所有匹配的路由
  const current: any = matches[matches.length - 1];
  const title = current?.handle?.title;
  const right =
    typeof current?.handle?.right === "function"
      ? current.handle?.right(() => {
          outletRef.current?.handleRightClick?.();
        })
      : null;
  const outletRef = useRef<any>(null);
  const currentChatUser = useSelector(selectCurrentChatUser);
  const currentConversationId = useSelector(selectCurrentChatConversationId);
  const totalUnreadMessageCount = useSelector(selectTotalUnreadMessageCount);
  const friendRequestList = useSelector(selectFriendRequestList);
  const user = useSelector(selectCurrentUser);

  const { pathname } = location;

  const tabs = [
    {
      key: "/layout",
      title: "消息",
      icon: <MessageOutline />,
      badge: totalUnreadMessageCount ? totalUnreadMessageCount : null,
    },
    {
      key: "/layout/contact",
      title: "联系人",
      icon: <UserContactOutline />,
      badge: friendRequestList
        ?.filter((item: any) => !item.isSender)
        .some((item: any) => !item.isRead)
        ? Badge.dot
        : null,
    },
    {
      key: "/layout/mine",
      title: "我的",
      icon: <UserOutline />,
    },
  ];

  const { run: runGetFriendList } = useRequest(getFriendList, {
    onSuccess: (res) => {
      dispatch(setFriendList({ friendList: res }));
    },
  });

  const { run: runGetRequestList } = useRequest<{ senderId: string }, any>(
    getFriendRequestList,
    {
      onSuccess: (res) => {
        dispatch(setFriendRequestList({ friendRequestList: res }));
      },
    },
  );

  const { run: runChangeMessageStatus } = useRequest(changeMessageStatus, {
    onSuccess: () => {
      dispatch(clearCurrentConversationUnreadCount());
    },
  });

  const setRouteActive = (value: string) => {
    navigate(value);
  };

  const handleBack = () => {
    const pathname = location.pathname;
    if (pathname === "/layout-blank/chat") {
      runChangeMessageStatus({ conversationId: currentConversationId });
    }
    isBlank ? navigate(-1) : null;
  };

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    initWebSocket(token);
    runGetFriendList();
    runGetRequestList({ senderId: user.id });

    onMessage(UPDATE_CONVERSATION_LIST, (data: any) => {
      dispatch(setConversation({ lastMessage: data.message }));
    });
    onMessage(NEW_FRIEND_REQUEST, (data: any) => {
      runGetFriendList();
      runGetRequestList({ senderId: data.senderId });
    });
  }, []);

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <NavBar
        className={styles["layout-header"]}
        onBack={handleBack}
        back={isBlank ? "" : null}
        right={right || null}
      >
        {currentChatUser?.nickname || title}
      </NavBar>
      <div
        className={styles["layout-main"]}
        style={{ marginBottom: isBlank ? "0" : "4rem" }}
      >
        <OutletWrapper ref={outletRef} />
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

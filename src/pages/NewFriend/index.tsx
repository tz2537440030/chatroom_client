import useRequest from "@/hooks/useRequest";
import {
  addNewFriend,
  changeFriendRequestRead,
  changeFriendRequestStatus,
  getFriendList,
  getFriendRequestList,
  getUserByUsernameOrNickname,
} from "@/services/contact";
import { Badge, ErrorBlock, List } from "antd-mobile";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import {
  selectFriendRequestList,
  setFriendList,
  setFriendRequestList,
  setFriendRequestRead,
} from "@/store/userSlice";
import SearchOrSendInput from "@/components/SearchOrSendInput";
import { sendMessage } from "@/services/websocket";

const NewFriend = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);
  const requestList = useSelector(selectFriendRequestList);
  const currentOptRequest = useRef<any>(null);
  const requestStatus: any = {
    pending: "等待同意",
    accepted: "已同意",
    rejected: "已拒绝",
  };

  // 搜索用户
  const { data: userList, run } = useRequest<{ text: string }, any>(
    getUserByUsernameOrNickname,
    {},
  );

  const { run: runChangeFriendRequestRead } = useRequest<any, any>(
    changeFriendRequestRead,
    {
      onSuccess: (_res, params) => {
        dispatch(setFriendRequestRead({ id: params.id }));
      },
    },
  );

  // 添加好友
  const { run: runAddNewFriend } = useRequest<
    { senderId: string; receiverId: string },
    any
  >(addNewFriend, {
    onSuccess: (_res, params: any) => {
      sendMessage({
        type: "friend_request",
        senderId: auth.user.id,
        receiverId: params.receiverId,
      });
      runGetRequestList({ senderId: auth.user.id });
    },
  });

  // 获取好友请求列表
  const { run: runGetRequestList } = useRequest<{ senderId: string }, any>(
    getFriendRequestList,
    {
      onSuccess: (res) => {
        dispatch(setFriendRequestList({ friendRequestList: res }));
      },
    },
  );

  const { run: runChangeFriendRequestStatus } = useRequest<
    { id: string; status: string },
    any
  >(changeFriendRequestStatus, {
    onSuccess: () => {
      runGetRequestList({ senderId: auth.user.id });
      sendMessage({
        type: "friend_request",
        senderId: auth.user.id,
        receiverId: currentOptRequest.current.senderId,
      });
      getFriendList().then((res) => {
        dispatch(setFriendList({ friendList: res }));
      });
    },
  });

  useEffect(() => {
    runGetRequestList({ senderId: auth.user.id });
  }, []);

  const returnRequestStatus = (item: any) => {
    return item.isSender ? (
      "对方" + requestStatus[item.status]
    ) : item.status === "pending" ? (
      <>
        <a
          className="mr-2 text-primary"
          onClick={() => handleFriendRequestOptions(item, "accepted")}
        >
          同意
        </a>
        <a
          className="text-danger"
          onClick={() => handleFriendRequestOptions(item, "rejected")}
        >
          拒绝
        </a>
      </>
    ) : (
      "您" + requestStatus[item.status]
    );
  };

  const handleFriendRequestOptions = (
    item: any,
    option: "accepted" | "rejected",
  ) => {
    currentOptRequest.current = item;
    runChangeFriendRequestStatus({
      id: item.id,
      status: option,
    });
  };

  const handleReadFriendRequest = async (id: number) => {
    runChangeFriendRequestRead({ id, isRead: true });
  };

  return (
    <>
      <SearchOrSendInput
        placeholder="请搜索昵称或邮箱"
        onSearch={(v) => {
          run({ text: v });
        }}
      />
      {userList && (
        <List header="搜索结果" className="mt-5">
          {userList?.map((item: any) => {
            return (
              <List.Item
                key={item.id}
                description={item?.username}
                extra={
                  <a
                    onClick={() => {
                      runAddNewFriend({
                        senderId: auth.user.id,
                        receiverId: item.id,
                      });
                    }}
                    className="text-primary"
                  >
                    加好友
                  </a>
                }
              >
                {item?.nickname}
              </List.Item>
            );
          })}
        </List>
      )}

      <List header="好友请求" className={styles["friend-request"] + " mt-5"}>
        {requestList?.length === 0 ? (
          <ErrorBlock
            status="empty"
            className="flex-center bg-gray flex flex-col border-0 bg-gray-100"
          />
        ) : (
          requestList?.map((item: any) => {
            return (
              <List.Item
                key={item.id}
                extra={returnRequestStatus(item)}
                description={item.requestInfo?.username}
                onClick={() => handleReadFriendRequest(item.id)}
              >
                <Badge
                  content={!item.isRead && !item.isSender ? Badge.dot : null}
                >
                  {item.requestInfo?.nickname}
                </Badge>
              </List.Item>
            );
          })
        )}
      </List>
    </>
  );
};
export default NewFriend;

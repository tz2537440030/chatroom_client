import { Badge, Dialog, IndexBar, List, SwipeAction } from "antd-mobile";
import { UserAddOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import { selectFriendList, selectFriendRequestList } from "@/store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { groupFriendList } from "@/utils/utils";
import { useEnterChat } from "@/hooks/useEnterChat";
import useRequest from "@/hooks/useRequest";
import { deleteFriend } from "@/services/contact";
import { deleteFriend as deleteFriendAction } from "@/store/userSlice";
import { useRef } from "react";

const Contact = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const friendList = useSelector(selectFriendList);
  const friendRequestList = useSelector(selectFriendRequestList);

  const groupedFriends = groupFriendList(friendList);
  const { handleChat } = useEnterChat();
  const currentSwipeFriendId = useRef(null);

  const { run } = useRequest<any, any>(deleteFriend, {
    onSuccess: () => {
      dispatch(deleteFriendAction({ id: currentSwipeFriendId.current }));
    },
  });

  const handleNewFriend = () => {
    navigate("/layout-blank/new-friend");
  };

  const rightActions: any = [
    {
      key: "favorite",
      text: "特别关心",
      color: "warning",
    },
    {
      key: "delete",
      text: "删除好友",
      color: "danger",
    },
    ,
  ];

  const handleSwipe = async (action: any, friend: any) => {
    currentSwipeFriendId.current = friend.id;
    if (action.key === "delete") {
      await Dialog.confirm({
        content: "确定要删除吗？",
        onConfirm: () => {
          run({ friendId: friend.id });
        },
      });
    }
  };

  return (
    <>
      <List>
        <List.Item prefix={<UserAddOutline />} onClick={handleNewFriend}>
          <Badge
            content={
              friendRequestList?.some((item: any) => !item.isRead)
                ? Badge.dot
                : null
            }
          >
            新的朋友
          </Badge>
        </List.Item>
      </List>
      <IndexBar>
        {Object.entries(groupedFriends).map(([initial, groupFriends]) => (
          <IndexBar.Panel index={initial} title={initial} key={initial}>
            <List>
              {groupFriends.map((friend) => (
                <SwipeAction
                  key={friend.id}
                  rightActions={rightActions}
                  onAction={(action) => handleSwipe(action, friend)}
                >
                  <List.Item onClick={() => handleChat(friend)}>
                    {friend.nickname}
                    <span className="text-gray-400">（{friend.username}）</span>
                  </List.Item>
                </SwipeAction>
              ))}
            </List>
          </IndexBar.Panel>
        ))}
      </IndexBar>
    </>
  );
};
export default Contact;

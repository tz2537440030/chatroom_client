import { IndexBar, List } from "antd-mobile";
import { UserAddOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import { selectFriendList } from "@/store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChatMessage, setCurrentChatUser } from "@/store/chatSlice";
import { groupFriendList } from "@/utils/utils";
import { createConversation } from "@/services/chat";

const Contact = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const friendList = useSelector(selectFriendList);
  const groupedFriends = groupFriendList(friendList);

  const handleNewFriend = () => {
    navigate("/layout-blank/new-friend");
  };

  const handleChat = async (friend: any) => {
    dispatch(setCurrentChatUser({ currentChatUser: friend }));
    const res: any = await createConversation({ senderId: friend.id });
    if (!res) return;
    dispatch(setCurrentChatMessage({ currentChatMessage: res.messages }));
    navigate("/layout-blank/chat?conversationId=" + res.id);
  };

  return (
    <>
      <List>
        <List.Item prefix={<UserAddOutline />} onClick={handleNewFriend}>
          新的朋友
        </List.Item>
      </List>
      <List header="群聊">
        <List.Item>群聊1</List.Item>
        <List.Item>群聊2</List.Item>
        <List.Item>群聊3</List.Item>
      </List>
      <IndexBar>
        {Object.entries(groupedFriends).map(([initial, groupFriends]) => (
          <IndexBar.Panel index={initial} title={initial} key={initial}>
            <List>
              {groupFriends.map((friend) => (
                <List.Item key={friend.id} onClick={() => handleChat(friend)}>
                  {friend.nickname}
                  <span className="text-gray-400">（{friend.username}）</span>
                </List.Item>
              ))}
            </List>
          </IndexBar.Panel>
        ))}
      </IndexBar>
    </>
  );
};
export default Contact;

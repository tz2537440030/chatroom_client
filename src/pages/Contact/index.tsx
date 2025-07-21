import { IndexBar, List } from "antd-mobile";
import { UserAddOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import { selectFriendList } from "@/store/userSlice";
import { useSelector } from "react-redux";
import { groupFriendList } from "@/utils/utils";
import { useEnterChat } from "@/hooks/useEnterChat";

const Contact = () => {
  const navigate = useNavigate();
  const friendList = useSelector(selectFriendList);
  const groupedFriends = groupFriendList(friendList);
  const { handleChat } = useEnterChat();

  const handleNewFriend = () => {
    navigate("/layout-blank/new-friend");
  };

  return (
    <>
      <List>
        <List.Item prefix={<UserAddOutline />} onClick={handleNewFriend}>
          新的朋友
        </List.Item>
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

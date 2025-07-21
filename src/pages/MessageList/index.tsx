import SearchOrSendInput from "@/components/SearchOrSendInput";
import useRequest from "@/hooks/useRequest";
import { getConversationList } from "@/services/chat";
import { formatChatDatetime } from "@/utils/utils";
import { Avatar, Badge, List } from "antd-mobile";
import { useEffect } from "react";
import styles from "./index.module.css";
import { useEnterChat } from "@/hooks/useEnterChat";
import { useDispatch, useSelector } from "react-redux";
import { selectConversationList, setConversationList } from "@/store/chatSlice";

const MessageList = () => {
  const { handleChat } = useEnterChat();
  const dispatch = useDispatch();
  const conversationList = useSelector(selectConversationList);
  const { run } = useRequest<any, any>(getConversationList, {
    onSuccess: (res) => {
      dispatch(
        setConversationList({
          conversationList: res.conversations,
          totalUnreadMessageCount: res.totalUnreadMessageCount,
        }),
      );
    },
  });

  useEffect(() => {
    run();
  }, []);

  return (
    <>
      {/* <SearchOrSendInput
        placeholder="请搜索昵称或邮箱"
        onSearch={(v) => {
          console.log(v);
        }}
      /> */}
      <List className={`${styles["conversation-list"]} mt-4`}>
        {conversationList?.map((conversation: any) => (
          <List.Item
            key={conversation.id}
            prefix={
              <Badge
                content={
                  conversation.unReadCount ? conversation.unReadCount : ""
                }
              >
                <Avatar src={conversation.user.avatar || ""} />
              </Badge>
            }
            description={
              conversation.lastMessage?.content || "系统：来找我聊天吧"
            }
            onClick={() => handleChat(conversation.user)}
          >
            <div className="flex justify-between">
              <span>{conversation.user.nickname}</span>
              <span className="text-xs text-gray-400">
                {formatChatDatetime(conversation.lastMessage?.createdAt)}
              </span>
            </div>
          </List.Item>
        ))}
      </List>
    </>
  );
};

export default MessageList;

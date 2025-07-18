import { useSelector } from "react-redux";
import { Avatar } from "antd-mobile";
import { formatChatDatetime } from "@/utils/utils";
import { forwardRef, use, useEffect, useImperativeHandle, useRef } from "react";

interface Message {
  id: string;
  content: string;
  conversationId: number;
  senderId: number;
  updatedAt: string;
  createdAt: string;
}

const ChatBubble = forwardRef(
  (
    {
      messages,
      loading,
      hasMore,
      onLoadMessage,
    }: {
      messages: Message[];
      loading: boolean;
      hasMore: boolean;
      onLoadMessage: () => void;
    },
    ref,
  ) => {
    const userId = useSelector((state: any) => state.auth.user.id);
    const messageEndRef = useRef<any>(null);
    const chatContainerRef = useRef<any>(null);
    const chatContainerScroll = useRef<any>({ scrollTop: 0, scrollHeight: 0 });
    const isSelfMessage = (message: Message) =>
      message.senderId === Number(userId);

    useEffect(() => {
      const chatContainer = chatContainerRef.current;
      if (!chatContainer) return;
      const handleScroll = () => {
        if (chatContainer.scrollTop === 0 && !loading && hasMore) {
          chatContainerScroll.current.scrollTop = chatContainer.scrollTop;
          chatContainerScroll.current.scrollHeight = chatContainer.scrollHeight;
          onLoadMessage();
        }
      };

      chatContainer.addEventListener("scroll", handleScroll);
      return () => chatContainer.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading, onLoadMessage]);

    useEffect(() => {
      const chatContainer = chatContainerRef.current;
      const { scrollTop, scrollHeight } = chatContainerScroll.current;
      chatContainer.scrollTop =
        chatContainer.scrollHeight - scrollHeight + scrollTop;
    }, [messages]);

    useImperativeHandle(ref, () => ({
      scrollToBottom: () => {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      },
    }));

    return (
      <div
        style={{ height: "calc(100vh - 150px)" }}
        className="flex flex-col overflow-y-scroll px-2"
        ref={chatContainerRef}
      >
        {loading && <div className="flex-center">加载中...</div>}
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${isSelfMessage(message) ? "justify-end" : "justify-start"} mb-4`}
          >
            {!isSelfMessage(message) && <Avatar src="" className="mr-2" />}
            {isSelfMessage(message) && (
              <div className="mr-2 flex items-end text-xs text-gray-400">
                {formatChatDatetime(message.createdAt)}
              </div>
            )}
            <div
              className={`max-w-xs whitespace-pre-line break-all rounded-lg px-4 py-2 lg:max-w-md ${
                isSelfMessage(message)
                  ? "rounded-tr-none bg-blue-500 text-white"
                  : "rounded-tl-none bg-gray-200 text-gray-800"
              }`}
            >
              <div className="text-sm">{message.content}</div>
            </div>
            {!isSelfMessage(message) && (
              <div className="ml-2 flex items-end text-xs text-gray-400">
                {formatChatDatetime(message.createdAt)}
              </div>
            )}
            {isSelfMessage(message) && <Avatar src="" className="ml-2" />}
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
    );
  },
);

export default ChatBubble;

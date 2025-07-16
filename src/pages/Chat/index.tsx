import {
  pushMessage,
  selectCurrentChatMessage,
  setCurrentChatUser,
} from "@/store/chatSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchOrSendInput from "@/components/SearchOrSendInput";
import ChatBubble from "@/components/ChatBubble";
import useRequest from "@/hooks/useRequest";
import { getMessage } from "@/services/chat";

const Chat = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const conversationId = queryParams.get("conversationId");
  const dispatch = useDispatch();
  const currentChatUser = useSelector(
    (state: any) => state.chat.currentChatUser,
  );
  const currentChatMessage = useSelector(selectCurrentChatMessage);
  const ws = useRef<WebSocket | null>(null);
  const inputRef = useRef<any>(null);
  const chatBubbleRef = useRef<any>(null);

  const { loading, run: runGetMessage } = useRequest<any, any>(getMessage, {
    onSuccess: (res: any) => {
      console.log("success", res);
      dispatch(
        pushMessage({
          message: [...res],
        }),
      );
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    ws.current = new WebSocket(
      `ws://localhost:3000?conversationId=${conversationId}&token=${token}`,
    );
    ws.current.onopen = () => {
      console.log("连接成功");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_message") {
        dispatch(
          pushMessage({
            message: [data.message],
          }),
        );
      } else if (data.type === "message_delivered") {
        dispatch(
          pushMessage({
            message: [data.message],
          }),
        );
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket连接错误:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket连接已关闭");
    };

    return () => {
      ws.current?.close();
      dispatch(setCurrentChatUser({ currentChatUser: {} }));
    };
  }, []);

  const handleLoadMessage = () => {
    runGetMessage({ conversationId, skip: currentChatMessage.length });
  };

  const handleSendMsg = (text: string) => {
    if (!text || !ws.current) return;
    try {
      ws.current.send(
        JSON.stringify({
          type: "private_message",
          content: text,
          conversationId,
          receiverId: currentChatUser.id,
        }),
      );
      chatBubbleRef.current.scrollToBottom();
      inputRef.current.clearText();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chatContainer">
      <ChatBubble
        messages={currentChatMessage}
        ref={chatBubbleRef}
        onLoadMessage={handleLoadMessage}
        loading={loading}
      />
      <div className="my-5">
        <SearchOrSendInput
          ref={inputRef}
          placeholder="请输入"
          btnText="发送"
          textLeft
          onSearch={handleSendMsg}
        />
      </div>
    </div>
  );
};
export default Chat;

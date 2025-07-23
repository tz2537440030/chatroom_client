import {
  pushMessage,
  selectCurrentChatMessage,
  setCurrentChatConversationId,
  setCurrentChatMessage,
  setCurrentChatUser,
} from "@/store/chatSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchOrSendInput from "@/components/SearchOrSendInput";
import ChatBubble from "@/components/ChatBubble";
import useRequest from "@/hooks/useRequest";
import { getMessage } from "@/services/chat";
import { store } from "@/store";
import config from "@/config";
import {
  onMessage,
  removeMessageListener,
  sendMessage,
} from "@/services/websocket";
import { MESSAGE_DELIVERED, NEW_MESSAGE } from "@/const";

const Chat = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const conversationId = queryParams.get("conversationId");
  const dispatch = useDispatch();
  const currentChatUser = useSelector(
    (state: any) => state.chat.currentChatUser,
  );
  const currentChatMessage = useSelector(selectCurrentChatMessage);
  const inputRef = useRef<any>(null);
  const chatBubbleRef = useRef<any>(null);

  const [hasMore, setHasMore] = useState(true);
  const [isInputInsert, setIsInputInsert] = useState(false);
  const isInitialMount = useRef(true);

  const { loading, run: runGetMessage } = useRequest<any, any>(getMessage, {
    onSuccess: (res: any) => {
      if (res.messages.length < config.chatPageSize) {
        setHasMore(false);
      }
      dispatch(
        pushMessage({
          message: res.messages,
        }),
      );
    },
  });

  useEffect(() => {
    dispatch(setCurrentChatConversationId({ conversationId }));
    const pushMessageToRedux = (data: any) => {
      setIsInputInsert(true);
      dispatch(
        pushMessage({
          message: [data.message],
          isInputInsert: true,
        }),
      );
    };

    onMessage(NEW_MESSAGE, (data: any) => {
      pushMessageToRedux(data);
    });

    onMessage(MESSAGE_DELIVERED, (data: any) => {
      pushMessageToRedux(data);
    });

    return () => {
      removeMessageListener(NEW_MESSAGE);
      dispatch(setCurrentChatMessage({ currentChatMessage: [] }));
      dispatch(setCurrentChatUser({ currentChatUser: {} }));
    };
  }, []);

  useEffect(() => {
    if (isInputInsert || isInitialMount.current) {
      chatBubbleRef.current.scrollToBottom();
      isInitialMount.current = false;
    }
  }, [currentChatMessage, isInputInsert]);

  const handleLoadMessage = () => {
    const latestState = store.getState();
    const currentLength = selectCurrentChatMessage(latestState).length;
    setIsInputInsert(false);
    runGetMessage({ conversationId, skip: currentLength });
  };

  const handleSendMsg = (text: string) => {
    if (!text) return;
    try {
      sendMessage({
        type: "private_message",
        content: text,
        conversationId,
        receiverId: currentChatUser.id,
      });
      inputRef.current.clearText();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chatContainer">
      <ChatBubble
        messages={currentChatMessage}
        hasMore={hasMore}
        ref={chatBubbleRef}
        onLoadMessage={handleLoadMessage}
        loading={loading}
      />
      <div className="py-5">
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

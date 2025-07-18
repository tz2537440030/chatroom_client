import { createConversation } from "@/services/chat";
import { setCurrentChatMessage, setCurrentChatUser } from "@/store/chatSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useEnterChat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChat = async (friend: any) => {
    dispatch(setCurrentChatUser({ currentChatUser: friend }));
    const res: any = await createConversation({ senderId: friend.id });
    if (!res) return;
    dispatch(setCurrentChatMessage({ currentChatMessage: res.messages }));
    navigate("/layout-blank/chat?conversationId=" + res.id);
  };

  return {
    handleChat,
  };
};

import request from "@/utils/request";

export const createConversation = ({ senderId }: { senderId: string }) => {
  return request.post("/chat/createConversation", {
    senderId,
  });
};

export const getMessage = ({
  conversationId,
  skip,
}: {
  conversationId: string;
  skip: number;
}) => {
  return request.post("/chat/getMessage", { conversationId, skip });
};

export const getConversationList = () => {
  return request.post("/chat/getConversationList");
};

export const changeMessageStatus = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  return request.post("/chat/changeMessageStatus", {
    conversationId,
  });
};

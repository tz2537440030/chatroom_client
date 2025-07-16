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
  conversationId: number;
  skip: number;
}) => {
  return request.post("/chat/getMessage", { conversationId, skip });
};

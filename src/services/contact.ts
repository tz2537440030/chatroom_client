import request from "@/utils/request";

export const getUserByUsernameOrNickname = ({ text }: { text: string }) => {
  return request.post("/contact/getUserListByText", {
    text,
  });
};

export const addNewFriend = ({
  senderId,
  receiverId,
}: {
  senderId: string;
  receiverId: string;
}) => {
  return request.post("/contact/createFriendRequest", {
    senderId,
    receiverId,
  });
};

export const getFriendRequestList = (
  {
    senderId,
  }: {
    senderId: string;
  },
  { isHideMessage }: { isHideMessage?: boolean },
) => {
  return request.post(
    "/contact/getFriendRequestList",
    {
      senderId,
    },
    {
      headers: {
        isHideMessage,
      },
    },
  );
};

export const changeFriendRequestStatus = ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  return request.post("/contact/changeRequestStatus", {
    id,
    status,
  });
};

export const getFriendList = () => {
  return request.post("/contact/getFriendList");
};

export const deleteFriend = ({ friendId }: { friendId: string }) => {
  return request.post("/contact/deleteFriend", {
    friendId,
  });
};

export const changeFriendRequestRead = ({
  id,
  isRead,
}: {
  id: number;
  isRead: boolean;
}) => {
  return request.post("/contact/changeFriendRequestRead", {
    id,
    isRead,
  });
};

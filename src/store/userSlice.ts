import { createSlice } from "@reduxjs/toolkit";

// 从localStorage初始化token
const getInitialUserState = () => {
  return {
    friendList: [],
    friendRequestList: [] as any,
  };
};

export const userSlice = createSlice({
  name: "user",
  initialState: getInitialUserState(),
  reducers: {
    setFriendList: (state, action) => {
      const { friendList } = action.payload;
      state.friendList = friendList;
    },
    deleteFriend: (state, action) => {
      const { id } = action.payload;
      state.friendList = state.friendList.filter(
        (friend: any) => friend.id !== id,
      );
    },
    setFriendRequestList: (state, action) => {
      const { friendRequestList } = action.payload;
      state.friendRequestList = friendRequestList;
    },
    setFriendRequestRead: (state, action) => {
      const { id } = action.payload;
      state.friendRequestList = state.friendRequestList.map((item: any) => {
        if (item.id === id) {
          return {
            ...item,
            isRead: true,
          };
        }
        return item;
      });
    },
  },
});

export const {
  setFriendList,
  deleteFriend,
  setFriendRequestList,
  setFriendRequestRead,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectFriendList = (state: { user: { friendList: any } }) =>
  state.user.friendList;

export const selectFriendRequestList = (state: {
  user: { friendRequestList: any };
}) => state.user.friendRequestList;

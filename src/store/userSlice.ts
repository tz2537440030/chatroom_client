import { createSlice } from "@reduxjs/toolkit";

// 从localStorage初始化token
const getInitialUserState = () => {
  return {
    friendList: [],
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
  },
});

export const { setFriendList } = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectFriendList = (state: { user: { friendList: any } }) =>
  state.user.friendList;

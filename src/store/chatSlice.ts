import { createSlice } from "@reduxjs/toolkit";

// 从localStorage初始化token
const getInitialChatState = () => {
  return {
    currentChatUser: {},
    currentChatMessage: [],
    chatList: [],
  };
};

export const chatSlice = createSlice({
  name: "chat",
  initialState: getInitialChatState(),
  reducers: {
    setCurrentChatUser: (state, action) => {
      const { currentChatUser } = action.payload;
      state.currentChatUser = currentChatUser;
    },
    setCurrentChatMessage: (state, action) => {
      const { currentChatMessage } = action.payload;
      state.currentChatMessage = currentChatMessage;
    },
    pushMessage: (state: any, action) => {
      const { message } = action.payload;
      console.log(state.currentChatMessage);
      state.currentChatMessage = [...state.currentChatMessage, ...message];
    },
  },
});

export const { setCurrentChatUser, setCurrentChatMessage, pushMessage } =
  chatSlice.actions;

export default chatSlice.reducer;

// Selectors
export const selectCurrentChatUser = (state: {
  chat: { currentChatUser: any };
}) => state.chat.currentChatUser;

export const selectCurrentChatMessage = (state: {
  chat: { currentChatMessage: any };
}) => state.chat.currentChatMessage;

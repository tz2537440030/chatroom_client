import { createSlice } from "@reduxjs/toolkit";

// 从localStorage初始化token
const getInitialChatState = () => {
  return {
    currentChatUser: {},
    currentChatMessage: [],
    conversationList: [],
    totalUnreadMessageCount: 0,
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
      const { message, isInputInsert } = action.payload;
      if (isInputInsert) {
        state.currentChatMessage = [...state.currentChatMessage, ...message];
      } else {
        state.currentChatMessage = [...message, ...state.currentChatMessage];
      }
    },
    setConversationList: (state, action) => {
      const { conversationList, totalUnreadMessageCount } = action.payload;
      state.totalUnreadMessageCount = totalUnreadMessageCount;
      state.conversationList = conversationList;
    },
    setConversation: (state: any, action) => {
      const { lastMessage } = action.payload;
      state.conversationList = state.conversationList.map(
        (conversation: any) => {
          if (conversation.conversationId === lastMessage.conversationId) {
            conversation.lastMessage = lastMessage;
            conversation.conversation.messages[0] = lastMessage;
            conversation.unReadCount = conversation.unReadCount + 1;
          }
          return conversation;
        },
      );
    },
  },
});

export const {
  setCurrentChatUser,
  setCurrentChatMessage,
  pushMessage,
  setConversationList,
  setConversation,
} = chatSlice.actions;

export default chatSlice.reducer;

// Selectors
export const selectCurrentChatUser = (state: {
  chat: { currentChatUser: any };
}) => state.chat.currentChatUser;

export const selectCurrentChatMessage = (state: {
  chat: { currentChatMessage: any };
}) => state.chat.currentChatMessage;

export const selectConversationList = (state: {
  chat: { conversationList: any };
}) => state.chat.conversationList;

export const selectTotalUnreadMessageCount = (state: {
  chat: { totalUnreadMessageCount: any };
}) => state.chat.totalUnreadMessageCount;

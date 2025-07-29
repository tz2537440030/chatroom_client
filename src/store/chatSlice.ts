import { createSlice } from "@reduxjs/toolkit";
import { set } from "lodash";

// 从localStorage初始化token
const getInitialChatState = () => {
  return {
    isShowEmoji: false,
    currentChatUser: {},
    currentChatMessage: [],
    conversationList: [],
    totalUnreadMessageCount: 0,
    conversationId: "",
  };
};

export const chatSlice = createSlice({
  name: "chat",
  initialState: getInitialChatState(),
  reducers: {
    setIsShowEmoji: (state, action) => {
      const { isShowEmoji } = action.payload;
      state.isShowEmoji = isShowEmoji;
    },
    setCurrentChatUser: (state, action) => {
      const { currentChatUser } = action.payload;
      state.currentChatUser = currentChatUser;
    },
    setCurrentChatConversationId: (state, action) => {
      const { conversationId } = action.payload;
      state.conversationId = conversationId;
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
            state.totalUnreadMessageCount = state.totalUnreadMessageCount + 1;
          }
          return conversation;
        },
      );
    },
    clearCurrentConversationUnreadCount: (state: any) => {
      const conversationId = state.conversationId;
      if (!conversationId) return;
      state.conversationList = state.conversationList.map(
        (conversation: any) => {
          if (conversation.conversationId == conversationId) {
            conversation.unReadCount = 0;
          }
          return conversation;
        },
      );
      state.totalUnreadMessageCount = state.conversationList.reduce(
        (total: number, conversation: any) => {
          return total + conversation.unReadCount;
        },
        0,
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
  setCurrentChatConversationId,
  clearCurrentConversationUnreadCount,
  setIsShowEmoji,
} = chatSlice.actions;

export default chatSlice.reducer;

// Selectors
export const selectIsShowEmoji = (state: { chat: { isShowEmoji: any } }) =>
  state.chat.isShowEmoji;

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

export const selectCurrentChatConversationId = (state: {
  chat: { conversationId: any };
}) => {
  return state.chat.conversationId;
};

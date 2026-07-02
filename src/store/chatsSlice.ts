import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { mockChats, type MockChat, type MockChatMessage } from "../mocks/chats";

export type ChatsState = {
  chats: MockChat[];
  currentChatId: string | null;
};

type AddChatPayload = MockChat;

type AddMessagePayload = {
  chatId: string;
  message: MockChatMessage;
};

const initialState: ChatsState = {
  chats: mockChats,
  currentChatId: null,
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    addChat: (state, action: PayloadAction<AddChatPayload>) => {
      state.chats.unshift(action.payload);
      state.currentChatId = action.payload.id;
    },
    addMessageToChat: (state, action: PayloadAction<AddMessagePayload>) => {
      const { chatId, message } = action.payload;
      const chat = state.chats.find((item) => item.id === chatId);

      if (!chat) {
        return;
      }

      chat.messages.push(message);
      chat.preview = message.content;
      chat.updatedAt = message.createdAt;
    },
    setCurrentChat: (state, action: PayloadAction<string | null>) => {
      state.currentChatId = action.payload;
    },
  },
});

export const { addChat, addMessageToChat, setCurrentChat } = chatsSlice.actions;

export const chatsReducer = chatsSlice.reducer;

export const selectChats = (state: { chats: ChatsState }) => state.chats.chats;

export const selectCurrentChatId = (state: { chats: ChatsState }) =>
  state.chats.currentChatId;

export const selectCurrentChat = (state: { chats: ChatsState }) =>
  state.chats.chats.find((chat) => chat.id === state.chats.currentChatId) ??
  null;

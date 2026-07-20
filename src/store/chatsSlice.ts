import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  getChatwootConversations,
  createChatwootConversation,
  createChatwootMessage,
  getChatwootMessages,
  type ChatwootConversation,
  type ChatwootMessage,
} from "../lib/chatwootClient";
import type { AuthSessionType, ChatwootSession } from "./authUserSlice";
import type { ChatAttachment, MockChat, MockChatMessage } from "../mocks/chats";

export type ChatsRequestStatus = "idle" | "loading" | "succeeded" | "failed";

export type ChatsState = {
  chats: MockChat[];
  currentChatId: string | null;
  loadedMessageChatIds: string[];
  loadedSessionType: AuthSessionType;
  status: ChatsRequestStatus;
  error: string | null;
  sendStatus: ChatsRequestStatus;
};

type AddChatPayload = MockChat;

type AddMessagePayload = {
  chatId: string;
  message: MockChatMessage;
};

const initialState: ChatsState = {
  chats: [],
  currentChatId: null,
  loadedMessageChatIds: [],
  loadedSessionType: null,
  status: "idle",
  error: null,
  sendStatus: "idle",
};

function mapAttachment(attachment: {
  id: number;
  data_url?: string;
  extension?: string;
  fallback_title?: string;
}): ChatAttachment {
  const name = attachment.fallback_title ?? attachment.extension ?? "Attachment";
  const extension = attachment.extension?.toLowerCase();
  const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp", "svg"];

  return {
    id: String(attachment.id),
    name,
    type: extension
      ? imageExtensions.includes(extension)
        ? `image/${extension === "jpg" ? "jpeg" : extension}`
        : `application/${extension}`
      : "application/octet-stream",
    previewUrl: attachment.data_url,
  };
}

function mapMessage(message: ChatwootMessage): MockChatMessage {
  const createdAt =
    typeof message.created_at === "number"
      ? new Date(message.created_at * 1000).toISOString()
      : message.created_at;

  return {
    id: String(message.id),
    role:
      message.message_type === 0 || message.message_type === "incoming"
        ? "user"
        : "assistant",
    content: message.content ?? "",
    createdAt,
    attachments: message.attachments?.map(mapAttachment),
  };
}

function mapConversation(
  conversation: ChatwootConversation,
  messages: ChatwootMessage[],
): MockChat {
  const mappedMessages = messages.map(mapMessage);
  const firstMessage = mappedMessages.find((message) => message.content.trim());
  const lastMessage = mappedMessages.at(-1);

  return {
    id: String(conversation.id),
    title: firstMessage?.content || `Conversation #${conversation.id}`,
    preview: lastMessage?.content || "",
    updatedAt: lastMessage?.createdAt ?? new Date(0).toISOString(),
    status: conversation.status,
    messages: mappedMessages,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

type SocketChatMessage = {
  chatId: string;
  title: string;
  status?: string;
  message: MockChatMessage;
};

function mapSocketMessage(payload: unknown): SocketChatMessage | null {
  let parsedPayload = payload;

  if (typeof parsedPayload === "string") {
    try {
      parsedPayload = JSON.parse(parsedPayload) as unknown;
    } catch {
      return null;
    }
  }

  if (!isRecord(parsedPayload)) {
    return null;
  }

  const candidates = [
    parsedPayload,
    parsedPayload.data,
    parsedPayload.message,
    isRecord(parsedPayload.data) ? parsedPayload.data.message : undefined,
  ];
  const message = candidates.find(
    (candidate): candidate is Record<string, unknown> =>
      isRecord(candidate) &&
      ("conversation_id" in candidate || "conversation" in candidate) &&
      "id" in candidate,
  );

  if (!message) {
    return null;
  }

  const conversation = isRecord(message.conversation)
    ? message.conversation
    : null;
  const conversationId = message.conversation_id ?? conversation?.id;
  const messageId = message.id;

  if (
    (typeof conversationId !== "number" && typeof conversationId !== "string") ||
    (typeof messageId !== "number" && typeof messageId !== "string")
  ) {
    return null;
  }

  const createdAt = message.created_at;
  const attachments = Array.isArray(message.attachments)
    ? message.attachments.filter(isRecord).map((attachment) =>
        mapAttachment({
          id: Number(attachment.id),
          data_url:
            typeof attachment.data_url === "string" ? attachment.data_url : undefined,
          extension:
            typeof attachment.extension === "string" ? attachment.extension : undefined,
          fallback_title:
            typeof attachment.fallback_title === "string"
              ? attachment.fallback_title
              : undefined,
        }),
      )
    : undefined;
  return {
    chatId: String(conversationId),
    title:
      (typeof message.content === "string" && message.content) ||
      `Conversation #${conversationId}`,
    status:
      conversation && typeof conversation.status === "string"
        ? conversation.status
        : undefined,
    message: {
      id: String(messageId),
      role:
        message.message_type === 0 || message.message_type === "incoming"
          ? "user"
          : "assistant",
      content: typeof message.content === "string" ? message.content : "",
      createdAt:
        typeof createdAt === "number"
          ? new Date(createdAt * 1000).toISOString()
          : typeof createdAt === "string"
            ? createdAt
            : new Date().toISOString(),
      attachments,
    },
  };
}

export const loadChatwootChats = createAsyncThunk<
  MockChat[],
  {
    session: ChatwootSession;
    sessionType: Exclude<AuthSessionType, null>;
  },
  { rejectValue: string }
>("chats/loadChatwootChats", async ({ session }, { rejectWithValue }) => {
  try {
    const conversations = await getChatwootConversations(session);
    const chats = conversations.map((conversation) =>
      mapConversation(conversation, conversation.messages ?? []),
    );

    return chats.sort(
      (first, second) =>
        new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime(),
    );
  } catch {
    return rejectWithValue("Unable to load conversations");
  }
});

export const loadChatwootMessages = createAsyncThunk<
  { chatId: string; messages: MockChatMessage[] },
  { session: ChatwootSession; conversationId: string },
  { rejectValue: string }
>("chats/loadChatwootMessages", async ({ session, conversationId }, { rejectWithValue }) => {
  try {
    const messages = await getChatwootMessages(session, Number(conversationId));

    return {
      chatId: conversationId,
      messages: messages.map(mapMessage),
    };
  } catch {
    return rejectWithValue("Unable to load messages");
  }
});

export const sendChatwootMessage = createAsyncThunk<
  MockChat | null,
  {
    session: ChatwootSession;
    conversationId: string | null;
    content: string;
    files: File[];
  },
  { rejectValue: string }
>(
  "chats/sendChatwootMessage",
  async ({ session, conversationId, content, files }, { rejectWithValue }) => {
    try {
      const conversation = conversationId
        ? null
        : await createChatwootConversation(session);
      await createChatwootMessage(
        session,
        conversationId ?? String(conversation?.id),
        content,
        files,
      );

      return conversation
        ? mapConversation(conversation, conversation.messages ?? [])
        : null;
    } catch {
      return rejectWithValue("Unable to send message");
    }
  },
);

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
    resetChats: () => initialState,
    applyChatwootSocketMessage: (state, action: PayloadAction<unknown>) => {
      const socketMessage = mapSocketMessage(action.payload);

      if (!socketMessage) {
        return;
      }

      const chatIndex = state.chats.findIndex(
        (chat) => chat.id === socketMessage.chatId,
      );

      if (chatIndex === -1) {
        state.chats.unshift({
          id: socketMessage.chatId,
          title: socketMessage.title,
          preview: socketMessage.message.content,
          updatedAt: socketMessage.message.createdAt,
          status: socketMessage.status,
          messages: [socketMessage.message],
        });
        return;
      }

      const chat = state.chats[chatIndex];

      if (chat.messages.some((message) => message.id === socketMessage.message.id)) {
        return;
      }

      chat.messages.push(socketMessage.message);
      if (chat.messages.length === 1 && socketMessage.message.content) {
        chat.title = socketMessage.message.content;
      }
      chat.preview = socketMessage.message.content;
      chat.updatedAt = socketMessage.message.createdAt;
      state.chats.splice(chatIndex, 1);
      state.chats.unshift(chat);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChatwootChats.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.chats = [];
        state.currentChatId = null;
        state.loadedMessageChatIds = [];
      })
      .addCase(loadChatwootChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.loadedMessageChatIds = [];
        state.loadedSessionType = action.meta.arg.sessionType;
        state.status = "succeeded";
      })
      .addCase(loadChatwootChats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? "Unable to load conversations";
      })
      .addCase(loadChatwootMessages.fulfilled, (state, action) => {
        const chat = state.chats.find((item) => item.id === action.payload.chatId);

        if (chat) {
          chat.messages = action.payload.messages;
          const firstMessage = action.payload.messages.find((message) =>
            message.content.trim(),
          );
          const lastMessage = action.payload.messages.at(-1);
          chat.title = firstMessage?.content ?? chat.title;
          chat.preview = lastMessage?.content ?? chat.preview;
          chat.updatedAt = lastMessage?.createdAt ?? chat.updatedAt;
        }

        if (!state.loadedMessageChatIds.includes(action.payload.chatId)) {
          state.loadedMessageChatIds.push(action.payload.chatId);
        }
      })
      .addCase(sendChatwootMessage.pending, (state) => {
        state.sendStatus = "loading";
      })
      .addCase(sendChatwootMessage.fulfilled, (state, action) => {
        state.sendStatus = "succeeded";
        const conversation = action.payload;

        if (conversation) {
          if (!state.chats.some((chat) => chat.id === conversation.id)) {
            state.chats.unshift(conversation);
          }

          state.currentChatId = conversation.id;
        }
      })
      .addCase(sendChatwootMessage.rejected, (state) => {
        state.sendStatus = "failed";
      });
  },
});

export const {
  addChat,
  addMessageToChat,
  applyChatwootSocketMessage,
  resetChats,
  setCurrentChat,
} = chatsSlice.actions;

export const chatsReducer = chatsSlice.reducer;

export const selectChats = (state: { chats: ChatsState }) => state.chats.chats;

export const selectCurrentChatId = (state: { chats: ChatsState }) =>
  state.chats.currentChatId;

export const selectCurrentChat = (state: { chats: ChatsState }) =>
  state.chats.chats.find((chat) => chat.id === state.chats.currentChatId) ??
  null;

export const selectLoadedMessageChatIds = (state: { chats: ChatsState }) =>
  state.chats.loadedMessageChatIds;

import { configureStore } from "@reduxjs/toolkit";

import { appReducer } from "./appSlice";
import { chatsReducer } from "./chatsSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    chats: chatsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { isAxiosError } from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import apiClient, { API_BASE_URL } from "../lib/apiClient";

export type ChatwootSession = {
  base_url: string;
  inbox: {
    identifier: string;
  };
  contact: {
    identifier: string;
    pubsub_token: string;
  };
  conversation: {
    id: number | null;
  };
  websocket: {
    url: string;
    channel: string;
  };
};

export type AnonymousSessionResponse = {
  chatwoot: ChatwootSession;
};

export type AuthSessionType = "anonymous" | "authenticated" | null;
export type AsyncRequestStatus = "idle" | "loading" | "succeeded" | "failed";

export type AuthUserState = {
  isCreateAccount: boolean;
  sessionType: AuthSessionType;
  anonymousSession: AnonymousSessionResponse | null;
  anonymousSessionStatus: AsyncRequestStatus;
  anonymousSessionError: string | null;
};

const initialState: AuthUserState = {
  isCreateAccount: false,
  sessionType: null,
  anonymousSession: null,
  anonymousSessionStatus: "idle",
  anonymousSessionError: null,
};

export const createAnonymousSession = createAsyncThunk<
  AnonymousSessionResponse,
  void,
  { rejectValue: string }
>("authUser/createAnonymousSession", async (_, { rejectWithValue }) => {
  if (!API_BASE_URL) {
    return rejectWithValue("VITE_BASENAME_API is not configured");
  }

  try {
    const { data } = await apiClient.post<AnonymousSessionResponse>(
      "/api/auth/anonymous-session",
    );

    return data;
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    return rejectWithValue(
      status
        ? `Unable to create anonymous session (${status})`
        : "Unable to create anonymous session",
    );
  }
});

const authUserSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAnonymousSession.pending, (state) => {
        state.anonymousSessionStatus = "loading";
        state.anonymousSessionError = null;
      })
      .addCase(createAnonymousSession.fulfilled, (state, action) => {
        state.anonymousSession = action.payload;
        state.anonymousSessionStatus = "succeeded";
        state.sessionType = "anonymous";
      })
      .addCase(createAnonymousSession.rejected, (state, action) => {
        state.anonymousSessionStatus = "failed";
        state.anonymousSessionError =
          action.payload ?? action.error.message ?? "Unable to create anonymous session";
      });
  },
});

export const authUserReducer = authUserSlice.reducer;

export const selectIsCreateAccount = (state: { authUser: AuthUserState }) =>
  state.authUser.isCreateAccount;

export const selectAuthSessionType = (state: { authUser: AuthUserState }) =>
  state.authUser.sessionType;

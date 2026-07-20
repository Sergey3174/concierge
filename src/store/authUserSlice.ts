import { isAxiosError } from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import apiClient, { API_BASE_URL } from "../lib/apiClient";
import { getItemFromStore, setItemInStore } from "../lib/utils";

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

export type CreateUserArgs = {
  login: string;
  password: string;
  hash: string;
};

export type LoginUserArgs = {
  login: string;
  password: string;
};

export type AuthSessionType = "anonymous" | "authenticated" | null;
export type AsyncRequestStatus = "idle" | "loading" | "succeeded" | "failed";

const AUTH_SESSION_TYPE_KEY = "auth_session_type";
const AUTH_CHATWOOT_SESSION_KEY = "auth_chatwoot_session";
const USER_INFO_STORAGE_KEY = "user_info";

function getStoredSessionType(): AuthSessionType {
  const sessionType = getItemFromStore(AUTH_SESSION_TYPE_KEY);

  return sessionType === "anonymous" || sessionType === "authenticated"
    ? sessionType
    : null;
}

function getStoredAuthenticatedSession(): AnonymousSessionResponse | null {
  const storedSession = getItemFromStore(AUTH_CHATWOOT_SESSION_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    const session = JSON.parse(storedSession) as unknown;

    return typeof session === "object" && session !== null && "chatwoot" in session
      ? (session as AnonymousSessionResponse)
      : null;
  } catch {
    return null;
  }
}

function saveAuthenticatedSession(session: AnonymousSessionResponse) {
  setItemInStore(AUTH_SESSION_TYPE_KEY, "authenticated");
  setItemInStore(AUTH_CHATWOOT_SESSION_KEY, JSON.stringify(session));
}

export type UserInfo = {
  email: string | null;
};

function getStoredUserInfo(): UserInfo {
  const storedUserInfo = getItemFromStore(USER_INFO_STORAGE_KEY);

  if (!storedUserInfo) {
    return { email: null };
  }

  try {
    const userInfo = JSON.parse(storedUserInfo) as unknown;

    return typeof userInfo === "object" &&
      userInfo !== null &&
      "email" in userInfo &&
      typeof userInfo.email === "string"
      ? { email: userInfo.email }
      : { email: null };
  } catch {
    return { email: null };
  }
}

function saveUserInfo(userInfo: UserInfo) {
  setItemInStore(USER_INFO_STORAGE_KEY, JSON.stringify(userInfo));
}

export type AuthUserState = {
  isCreateAccount: boolean;
  userInfo: UserInfo;
  sessionType: AuthSessionType;
  anonymousSession: AnonymousSessionResponse | null;
  anonymousSessionStatus: AsyncRequestStatus;
  anonymousSessionError: string | null;
};

const initialState: AuthUserState = {
  isCreateAccount: false,
  userInfo: getStoredUserInfo(),
  sessionType: getStoredSessionType(),
  anonymousSession:
    getStoredSessionType() === "authenticated"
      ? getStoredAuthenticatedSession()
      : null,
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

    if (!getStoredSessionType()) {
      setItemInStore(AUTH_SESSION_TYPE_KEY, "anonymous");
    }

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

export const fetchCreateUser = createAsyncThunk<
  AnonymousSessionResponse,
  CreateUserArgs,
  { rejectValue: string }
>(
  "authUser/fetchCreateUser",
  async ({ login, password, hash }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post<AnonymousSessionResponse>(
        "/api/auth/create_user",
        {
          login,
          password,
        },
        {
          params: {
            guard_hash: hash,
          },
        },
      );

      saveAuthenticatedSession(data);
      return data;
    } catch (error) {
      const message = isAxiosError(error)
        ? (typeof error.response?.data === "string"
            ? error.response.data
            : error.response?.data?.message) || error.message
        : error instanceof Error
          ? error.message
          : "Authentication request failed";

      return rejectWithValue(message);
    }
  },
);

export const loginUser = createAsyncThunk<
  AnonymousSessionResponse,
  LoginUserArgs,
  { rejectValue: string }
>("authUser/loginUser", async ({ login, password }, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post<AnonymousSessionResponse>(
      "/api/auth",
      { login, password },
    );

    saveAuthenticatedSession(data);
    return data;
  } catch (error) {
    const message = isAxiosError(error)
      ? (typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message) || error.message
      : error instanceof Error
        ? error.message
        : "Authentication request failed";

    return rejectWithValue(message);
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
        state.sessionType ??= "anonymous";
      })
      .addCase(createAnonymousSession.rejected, (state, action) => {
        state.anonymousSessionStatus = "failed";
        state.anonymousSessionError =
          action.payload ??
          action.error.message ??
          "Unable to create anonymous session";
      })
      .addCase(fetchCreateUser.pending, (state) => {
        state.anonymousSessionStatus = "loading";
        state.anonymousSessionError = null;
      })
      .addCase(fetchCreateUser.fulfilled, (state, action) => {
        state.anonymousSession = action.payload;
        state.anonymousSessionStatus = "succeeded";
        state.sessionType = "authenticated";
        state.userInfo.email = action.meta.arg.login;
        saveUserInfo(state.userInfo);
      })
      .addCase(fetchCreateUser.rejected, (state, action) => {
        state.anonymousSessionStatus = "failed";
        state.anonymousSessionError =
          action.payload ?? action.error.message ?? "Unable to create account";
      })
      .addCase(loginUser.pending, (state) => {
        state.anonymousSessionStatus = "loading";
        state.anonymousSessionError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.anonymousSession = action.payload;
        state.anonymousSessionStatus = "succeeded";
        state.sessionType = "authenticated";
        state.userInfo.email = action.meta.arg.login;
        saveUserInfo(state.userInfo);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.anonymousSessionStatus = "failed";
        state.anonymousSessionError =
          action.payload ?? action.error.message ?? "Unable to sign in";
      });
  },
});

export const authUserReducer = authUserSlice.reducer;

export const selectIsCreateAccount = (state: { authUser: AuthUserState }) =>
  state.authUser.isCreateAccount;

export const selectAuthSessionType = (state: { authUser: AuthUserState }) =>
  state.authUser.sessionType;

export const selectUserEmail = (state: { authUser: AuthUserState }) =>
  state.authUser.userInfo.email;

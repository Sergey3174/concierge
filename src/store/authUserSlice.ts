import { createSlice } from "@reduxjs/toolkit";

export type AuthUserState = {
  isCreateAccount: boolean;
};

const initialState: AuthUserState = {
  isCreateAccount: false,
};

const authUserSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {},
});

export const authUserReducer = authUserSlice.reducer;

export const selectIsCreateAccount = (state: { authUser: AuthUserState }) =>
  state.authUser.isCreateAccount;

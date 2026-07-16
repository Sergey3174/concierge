import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  changeAppLanguage,
  initialAppLanguage,
  type AppLanguage,
} from "../i18n";

type AppState = {
  language: AppLanguage;
};

const initialState: AppState = {
  language: initialAppLanguage,
};

export const changeLanguage = createAsyncThunk(
  "app/changeLanguage",
  async (language: AppLanguage) => {
    await changeAppLanguage(language);
    return language;
  },
);

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppLanguage(state, action: PayloadAction<AppLanguage>) {
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(changeLanguage.fulfilled, (state, action) => {
      state.language = action.payload;
    });
  },
});

export const { setAppLanguage } = appSlice.actions;
export const appReducer = appSlice.reducer;

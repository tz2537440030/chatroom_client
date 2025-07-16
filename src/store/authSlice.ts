import { createSlice } from "@reduxjs/toolkit";

// 从localStorage初始化token
const getInitialAuthState = () => {
  const token = localStorage.getItem("token"); // 或者直接从redux-persist获取
  return {
    user: null,
    token: token || null,
  };
};

export const authSlice = createSlice({
  name: "auth",
  initialState: getInitialAuthState(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: { user: any } }) =>
  state.auth.user;
export const selectAuthToken = (state: { auth: { token: any } }) =>
  state.auth.token;

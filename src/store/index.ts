import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import chatReducer from "./chatSlice";
import momentReducer from "./momentSlice";

// 组合reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  chat: chatReducer,
  moment: momentReducer,
});

// 持久化配置
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // 忽略redux-persist的action警告
      },
    }),
});

export const persistor = persistStore(store);

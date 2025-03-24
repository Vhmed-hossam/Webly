import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { postsReducer } from "./slices/slice";
import { authReducer } from "./slices/authslice";
import createCookieStorage from "redux-persist-cookie-storage";
import Cookies from "js-cookie";
const persistConfig = {
  key: "auth",
  storage: createCookieStorage({
    cookies: Cookies,
    expiration: {
      default: 30,
    },
  }),
  whitelist: ["user", "isLoggedIn"], 
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

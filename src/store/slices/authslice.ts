import { User } from "@/Interfaces/interfaces";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookie from "js-cookie";

export const getUserData = createAsyncThunk("auth/getUserData", async () => {
  const { data } = await axios.get(
    "https://linked-posts.routemisr.com/users/profile-data",
    {
      headers: {
        token: Cookie.get("token"),
      },
    }
  );
  return data.user;
});

const initialState: { user: User | null; isLoggedIn: boolean } = {
  user: null,
  isLoggedIn: typeof window !== "undefined" && !!Cookie.get("token"), // Only runs on the client
};

const authslice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      Cookie.remove("token");
    },
    login(state, action) {
      state.isLoggedIn = true;
      Cookie.set("token", action.payload , { expires: 30 });
    },
  },
  extraReducers(builder) {
    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(getUserData.rejected, (state) => {
      state.user = null;
      state.isLoggedIn = false;
    });
    builder.addCase(getUserData.pending, (state) => {
      state.user = null;
    });
  },
});

export const { logout, login } = authslice.actions;
export const authReducer = authslice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookie from "js-cookie";
import { AxiosErrorResponse, Post } from "../../Interfaces/interfaces";

export const GetPosts = createAsyncThunk(
  "posts/GetPosts",
  async (page: number, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `https://linked-posts.routemisr.com/posts?page=${page}`,
        {
          headers: {
            token: Cookie.get("token"),
          },
        }
      );
      return {
        posts: data.posts,
        totalPages: data.paginationInfo.numberOfPages,
      };
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        "data" in (error as any).response
      ) {
        const axiosError = error as AxiosErrorResponse;

        if (axiosError.response?.data?.error === "token not provided") {
          console.error(axiosError.message);
          return rejectWithValue("You need to create an account First.");
        }
      }

      return rejectWithValue(
        "An error occurred while retrieving data. Please reload the window and try again."
      );
    }
  }
);

export const GetSinglePost = createAsyncThunk(
  "posts/GetSinglePost",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `https://linked-posts.routemisr.com/posts/${id}`,
        {
          headers: {
            token: Cookie.get("token"),
          },
        }
      );
      return data.post;
    } catch {
      return rejectWithValue("Error fetching post data");
    }
  }
);

export const GetUserPosts = createAsyncThunk(
  "posts/GetUserPosts",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://linked-posts.routemisr.com/users/${id}/posts`,
        {
          headers: {
            token: Cookie.get("token"),
          },
        }
      );
      return res;
    } catch {
      return rejectWithValue("Error Getting User Posts");
    }
  }
);
const initialState: {
  posts: Post[];
  error: string | null;
  loading: boolean;
  post: Post | null;
  totalPages: number | undefined;
} = {
  posts: [],
  error: null,
  loading: false,
  post: null,
  totalPages: undefined,
};

const postsslice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(GetPosts.fulfilled, (state, action) => {
      state.posts = action.payload.posts;
      state.totalPages = action.payload.totalPages;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(GetSinglePost.fulfilled, (state, action) => {
      state.post = action.payload;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(GetUserPosts.fulfilled, (state, action) => {
      state.posts = action.payload.data.posts;
      state.totalPages = action.payload.data.paginationInfo.numberOfPages;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(GetPosts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetSinglePost.pending, (state, action) => {
      if (state.post?._id != action.meta.arg) {
        state.loading = true;
      }
    });
    builder.addCase(GetUserPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetPosts.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });

    builder.addCase(GetSinglePost.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });

    builder.addCase(GetUserPosts.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
  },
});

export const postsReducer = postsslice.reducer;

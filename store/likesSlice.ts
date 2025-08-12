import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LikesState {
  likedPosts: string[];
}

const initialState: LikesState = {
  likedPosts: [],
};

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    setLikedPosts(state, action: PayloadAction<string[]>) {
      state.likedPosts = action.payload;
    },
    likePost(state, action: PayloadAction<string>) {
      if (!state.likedPosts.includes(action.payload)) {
        state.likedPosts.push(action.payload);
      }
    },
    unlikePost(state, action: PayloadAction<string>) {
      state.likedPosts = state.likedPosts.filter(
        (postId) => postId !== action.payload
      );
    },
  },
});

export const { setLikedPosts, likePost, unlikePost } = likesSlice.actions;

export default likesSlice.reducer;

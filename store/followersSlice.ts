import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FollowersState {
  followedUsers: string[];
}

const initialState: FollowersState = {
  followedUsers: [],
};

const followersSlice = createSlice({
  name: "followers",
  initialState,
  reducers: {
    setFollowedUsers(state, action: PayloadAction<string[]>) {
      state.followedUsers = action.payload;
    },
    followUser(state, action: PayloadAction<string>) {
      if (!state.followedUsers.includes(action.payload)) {
        state.followedUsers.push(action.payload);
      }
    },
    unfollowUser(state, action: PayloadAction<string>) {
      state.followedUsers = state.followedUsers.filter(
        (email) => email !== action.payload
      );
    },
  },
});

export const { setFollowedUsers, followUser, unfollowUser } =
  followersSlice.actions;

export default followersSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/userSlice";
import likesReducer from "@/store/likesSlice";
import followersSlice from "@/store/followersSlice";

export const store = configureStore({
  reducer: {
    likes: likesReducer,
    followers: followersSlice,
    user: userReducer,
  },
});

// TypeScript types for store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../4features/auth/model/authSlice';
import userReducer from '../5entities/user/model/userSlice';
import photoReducer from '../5entities/photo/model/photoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    photo: photoReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

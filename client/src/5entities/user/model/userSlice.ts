import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserType } from './types';
import {
  getAllUsersThunk,
  fetchUsersThunk,
  getUserByIdThunk,
  editAccountValuesThunk,
  uploadPhotoThunk,
  getUserSubscriptionsThunk,
  getUserFollowersThunk,
  deleteUserThunk,
} from './userThunks';

type UserState = {
  users: UserType[];
  selectedUser: UserType | null;
  foundUsers: UserType[];
  userSubscriptions: UserType[];
  followers: UserType[];
  sortOption: string;
};

const initialState: UserState = {
  users: [],
  selectedUser: null,
  foundUsers: [],
  userSubscriptions: [],
  followers: [],
  sortOption: '0',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSortOption: (state, action: PayloadAction<string>) => {
      state.sortOption = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllUsersThunk.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(getUserByIdThunk.fulfilled, (state, action: PayloadAction<UserType>) => {
        state.selectedUser = action.payload;
      })
      .addCase(editAccountValuesThunk.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        if (state.selectedUser && state.selectedUser.id === updatedUser.id) {
          state.selectedUser = updatedUser;
        }
      })
      .addCase(uploadPhotoThunk.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        if (state.selectedUser && state.selectedUser.id === updatedUser.id) {
          state.selectedUser = updatedUser;
        }
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.foundUsers = action.payload;
      })

      .addCase(getUserSubscriptionsThunk.fulfilled, (state, action) => {
        state.userSubscriptions = action.payload;
      })
      .addCase(getUserFollowersThunk.fulfilled, (state, action) => {
        state.followers = action.payload;
      })
      .addCase(deleteUserThunk.fulfilled, (state) => {
        state.selectedUser = null;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setSortOption } = userSlice.actions;

export default userSlice.reducer;

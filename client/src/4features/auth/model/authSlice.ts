import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthSliceType } from './types';
import { AuthStatus } from './types';
import { loginThunk, logoutThunk, refreshThunk, signupThunk } from './authThunks';

const initialState: AuthSliceType = {
  data: { status: AuthStatus.fetching },
  accessToken: '',
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearAccessToken: (state) => {
      state.accessToken = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.data = {
          status: AuthStatus.authenticated,
          user: action.payload.user,
        };
        state.error = null;
      })
      .addCase(signupThunk.rejected, (state) => {
        state.accessToken = '';
        state.data = {
          status: AuthStatus.guest,
        };
        state.error = 'Ошибка регистрации';
      })
      .addCase(refreshThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.data = {
          status: AuthStatus.authenticated,
          user: action.payload.user,
        };
        state.error = null;
      })
      .addCase(refreshThunk.rejected, (state) => {
        state.accessToken = '';
        state.data = {
          status: AuthStatus.guest,
        };
        state.error = 'Ошибка обновления';
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.data = {
          status: AuthStatus.authenticated,
          user: action.payload.user,
        };
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.accessToken = '';
        state.data = {
          status: AuthStatus.guest,
        };
        
        if (typeof action.payload === 'string') {
          state.error = action.payload; 
        } else if (typeof action.payload === 'object' && action.payload !== null && 'error' in action.payload) {
          state.error = action.payload.error as string; 
        } else {
          state.error = 'Ошибка входа'; 
        }
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.accessToken = '';
        state.data = {
          status: AuthStatus.guest,
        };
        state.error = null;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setAccessToken, clearAccessToken } = authSlice.actions;

export default authSlice.reducer;
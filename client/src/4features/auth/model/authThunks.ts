import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../api/authService';
import { AxiosError } from 'axios';

export const signupThunk = createAsyncThunk('auth/signupThunk', (formData: FormData) =>
  authService.signup(formData),
);

export const refreshThunk = createAsyncThunk('auth/refreshThunk', () => authService.refresh());

// export const loginThunk = createAsyncThunk('auth/loginThunk', (formData: FormData) =>
//   authService.login(formData),
// );

export const loginThunk = createAsyncThunk(
  'auth/loginThunk',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await authService.login(formData);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || 'Ошибка при входе');
      }
      return rejectWithValue('Произошла неизвестная ошибка');
    }
  }
);



export const logoutThunk = createAsyncThunk('auth/logoutThunk', () => authService.logout());

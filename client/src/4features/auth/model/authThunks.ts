import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../api/authService';
import { AxiosError } from 'axios';
import type { UserSignupForm } from '../../../5entities/user/model/types';

export const signupThunk = createAsyncThunk('auth/signupThunk', (formData: UserSignupForm) =>
  authService.signup(formData),
);

export const refreshThunk = createAsyncThunk('auth/refreshThunk', () => authService.refresh());

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
  },
);

export const logoutThunk = createAsyncThunk('auth/logoutThunk', () => authService.logout());

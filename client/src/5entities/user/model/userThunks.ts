import { createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../api/userService';
import type { UserType } from './types';
import { z } from 'zod';
import { AxiosError } from 'axios';

export const getAllUsersThunk = createAsyncThunk('users/getAllUsersThunk', () =>
  userService.getUsers(),
);

export const fetchUsersThunk = createAsyncThunk('users/fetchUsersThunk', (filter: string) =>
  userService.searchUsers(filter),
);

export const getUserByIdThunk = createAsyncThunk('users/getUserByIdThunk', async (userId: number) =>
  userService.getUserById(userId),
);

export const editAccountValuesThunk = createAsyncThunk(
  'users/editAccountValuesThunk',
  async ({ id, formData }: { id: UserType['id']; formData: FormData }, { rejectWithValue }) => {
    try {
      z.object({
        name: z.string().min(1).max(100),
        nickname: z.string().nullable(),
        email: z.string().email(),
        city: z.string().nullable(),
      }).parse(Object.fromEntries(formData));
      const response = await userService.editAccountValues(id, formData);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || 'Ошибка при входе');
      }
      return rejectWithValue('Произошла неизвестная ошибка');
    }
  },
);

export const uploadPhotoThunk = createAsyncThunk(
  'users/uploadPhotoThunk',
  async ({ id, formData }: { id: UserType['id']; formData: FormData }) =>
    userService.uploadPhoto(id, formData),
);

export const deleteUserThunk = createAsyncThunk(
  'users/deleteUserThunk',
  async (id: UserType['id']) => {
    await userService.deleteUser(id);
    // return id;
  },
);

export const subscribeToUserThunk = createAsyncThunk(
  'users/subscribeToUserThunk',
  async (id: UserType['id']) => {
    await userService.subscribeToUser(id);
    return id;
  },
);

export const unsubscribeFromUserThunk = createAsyncThunk(
  'users/unsubscribeFromUserThunk',
  async (id: UserType['id']) => {
    await userService.unsubscribeFromUser(id);
    return id;
  },
);

export const getUserSubscriptionsThunk = createAsyncThunk('users/getUserSubscriptionsThunk', () =>
  userService.getUserSubscriptions(),
);

export const getUserFollowersThunk = createAsyncThunk('users/getUserFollowersThunk', () =>
  userService.getUserFollowers(),
);

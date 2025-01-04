import { createAsyncThunk } from '@reduxjs/toolkit';
import photoService from '../api/photoService';
import type { PhotoType } from '../model/types';
import { z, ZodError } from 'zod';
import { AxiosError } from 'axios';
import type { UserType } from '../../user/model/types';

// везде передаю ownerId, т.к. эндпоинты все через него идут -
// далее я смогу универсально использовать для просмотра фото других юзеров

export const getAllPhotosThunk = createAsyncThunk(
  '/photos/getAllPhotosThunk',
  (ownerId: UserType['id']) => photoService.getPhotos(ownerId),
);

export const getPhotoByIdThunk = createAsyncThunk(
  '/photos/getPhotoByIdThunk',
  ({ ownerId, photoId }: { ownerId: UserType['id']; photoId: number }) =>
    photoService.getPhotoById(ownerId, photoId),
);

export const createPhotoThunk = createAsyncThunk(
  '/photos/createPhotoThunk',
  async ({ ownerId, formData }: { ownerId: UserType['id']; formData: FormData }) => {
    try {
      const response = await photoService.createPhoto(ownerId, formData);
      return response;
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error:', error.issues);
      } else if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  },
);

export const editPhotoInfoThunk = createAsyncThunk(
  '/photos/editPhotoInfoThunk',
  async ({
    ownerId,
    photoId,
    formData,
  }: {
    ownerId: UserType['id'];
    photoId: PhotoType['id'];
    formData: FormData;
  }) => {
    try {
      const response = await photoService.editPhotoInfo(ownerId, photoId, formData);
      z.object({
        desc: z.string(),
      }).parse(Object.fromEntries(formData));
      return response;
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error:', error.issues);
      } else if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  },
);

export const deletePhotoThunk = createAsyncThunk(
  '/photos/deletePhotoThunk',
  async ({ ownerId, photoId }: { ownerId: UserType['id']; photoId: PhotoType['id'] }) => {
    await photoService.deletePhoto(ownerId, photoId);
    return photoId;
  },
);

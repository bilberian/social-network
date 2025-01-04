import { AxiosError, type AxiosInstance } from 'axios';
import { photoSchema } from '../model/schema';
import type { PhotoType } from '../model/types';
import { ZodError } from 'zod';
import axiosInstance from '../../../6shared/api/axiosInstance';
import type { UserType } from '../../user/model/types';

class PhotoService {
  constructor(private readonly client: AxiosInstance) {}

  async getPhotos(ownerId: UserType['id']): Promise<PhotoType[]> {
    try {
      const response = await this.client(`/photos/${String(ownerId)}`);
      return photoSchema.array().parse(response.data);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error:', error.issues);
      } else if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }

  async getPhotoById(ownerId: UserType['id'], photoId: number): Promise<PhotoType> {
    try {
      const response = await this.client(`/photos/${String(ownerId)}/${String(photoId)}`);
      return photoSchema.parse(response.data);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error:', error.issues);
      } else if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }

  async createPhoto(ownerId: UserType['id'], formData: FormData): Promise<PhotoType> {
    try {
      const response = await this.client.post(`/photos/${String(ownerId)}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return photoSchema.parse(response.data);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error:', error.issues);
      } else if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }

  async editPhotoInfo(
    ownerId: UserType['id'],
    photoId: PhotoType['id'],
    formData: FormData,
  ): Promise<PhotoType> {
    try {
      const response = await this.client.patch(
        `/photos/${String(ownerId)}/${String(photoId)}`,
        Object.fromEntries(formData),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return photoSchema.parse(response.data);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error:', error.issues);
      } else if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }

  async deletePhoto(ownerId: UserType['id'], photoId: PhotoType['id']): Promise<void> {
    try {
      await this.client.delete(`/photos/${String(ownerId)}/${String(photoId)}`);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error:', error.issues);
      } else if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }
}

const photoService = new PhotoService(axiosInstance);

export default photoService;

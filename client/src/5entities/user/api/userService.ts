import { AxiosError, type AxiosInstance } from 'axios';
import axiosInstance from '../../../6shared/api/axiosInstance';
import { userSchema } from '../model/schema';
import type { UserType } from '../model/types';
import { ZodError } from 'zod';

class UserService {
  constructor(private readonly client: AxiosInstance) {}

  async getUsers(): Promise<UserType[]> {
    try {
      const response = await this.client('/users');
      if (response.status !== 200) throw new Error('Неверный статус, ожидалось 200');
      const data = userSchema.array().parse(response.data);
      return data;
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error:', error.issues);
      } else if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }

  async getUserById(userId: number): Promise<UserType> {
    try {
      const response = await this.client(`/users/${String(userId)}`);
      return userSchema.parse(response.data);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error:', error.issues);
      } else if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }

  async editAccountValues(id: UserType['id'], formData: FormData): Promise<UserType> {
    try {
      const response = await this.client.patch(
        `/users/${String(id)}`,
        Object.fromEntries(formData),
      );
      if (response.status !== 200) throw new Error('Неверный статус, ожидалось 200');
      const data = userSchema.parse(response.data);
      return data;
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error:', error.issues);
      } else if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }

  async uploadPhoto(id: UserType['id'], formData: FormData): Promise<UserType> {
    try {
      const response = await this.client.patch(`/users/${String(id)}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status !== 200) throw new Error('Неверный статус, ожидалось 200');
      const data = userSchema.parse(response.data);
      return data;
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error:', error.issues);
      } else if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }

  async deleteUser(id: UserType['id']): Promise<void> {
    try {
      const response = await this.client.delete(`/users/${String(id)}`);
      if (response.status !== 204) throw new Error('Неверный статус, ожидалось 204');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }

  async searchUsers(filter: string): Promise<UserType[]> {
    try {
      const response = await this.client.get(`/search/?filter=${filter}`);
      if (response.status !== 200) throw new Error('Неверный статус, ожидалось 200');
      const data = userSchema.array().parse(response.data);
      return data;
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error:', error.issues);
      } else if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }

  async subscribeToUser(userId: number): Promise<void> {
    try {
      await this.client.post(`/users/${String(userId)}/subscribe`);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }

  async unsubscribeFromUser(userId: number): Promise<void> {
    try {
      await this.client.delete(`/users/${String(userId)}/unsubscribe`);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }
}

const userService = new UserService(axiosInstance);

export default userService;

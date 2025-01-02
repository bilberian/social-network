import type { AxiosInstance } from 'axios';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';
import type { BackendAuthType } from '../model/types';
import { backendAuthSchema } from '../model/schema';
import { userCreateSchema, userLoginSchema } from '../../../5entities/user/model/schema';
import axiosInstance from '../../../6shared/api/axiosInstance';

class AuthService {
  constructor(private readonly client: AxiosInstance) {}

  async signup(formData: FormData): Promise<BackendAuthType> {
    try {
      const data = userCreateSchema.parse(Object.fromEntries(formData));
      const response = await this.client.post('/auth/signup', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) throw new Error('Неверный статус реги (ожидалось 200)');
      const backendAuth = backendAuthSchema.parse(response.data);
      return backendAuth;
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error:', error.issues);
      } else if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }

  async login(formData: FormData): Promise<BackendAuthType> {
    try {
      const data = userLoginSchema.parse(Object.fromEntries(formData));
      const response = await this.client.post('/auth/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) throw new Error('Неверный статус логина (ожидалось 200)');
      const backendAuth = backendAuthSchema.parse(response.data);
      return backendAuth;
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error:', error.issues);
      } else if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }

  async refresh(): Promise<BackendAuthType> {
    try {
      const response = await this.client.get('/tokens/refresh');
      if (response.status !== 200) throw new Error('Неверный статус рефреша (ожидалось 200)');
      const backendAuth = backendAuthSchema.parse(response.data);
      return backendAuth;
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error:', error.issues);
      } else if (error instanceof AxiosError) {
        console.log('Axios error:', error.response?.data);
      }
      throw error;
    }
  }

  logout(): Promise<void> {
    return this.client('/auth/logout');
  }
}

const authService = new AuthService(axiosInstance);

export default authService;

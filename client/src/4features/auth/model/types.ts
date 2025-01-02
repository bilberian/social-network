import type { z } from 'zod';
import type { UserType } from '../../../5entities/user/model/types';
import type { backendAuthSchema } from './schema';

export enum AuthStatus {
  fetching = 'fetching',
  guest = 'guest',
  authenticated = 'authenticated',
}

export type BackendAuthType = z.infer<typeof backendAuthSchema>;

export type AuthType =
  | {
      status: AuthStatus.fetching;
    }
  | {
      status: AuthStatus.guest;
    }
  | {
      status: AuthStatus.authenticated;
      user: UserType;
    };

export type AuthSliceType = {
  accessToken: string;
  data: AuthType;
  error: string | null;
};

import type { z } from 'zod';
import type { userCreateSchema, userSchema } from './schema';

export type UserType = z.infer<typeof userSchema>;

export type UserSignupForm = z.infer<typeof userCreateSchema>;

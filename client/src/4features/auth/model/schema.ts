import { z } from 'zod';
import { userSchema } from '../../../5entities/user/model/schema';

export const backendAuthSchema = z.object({
  accessToken: z.string(),
  user: userSchema,
});
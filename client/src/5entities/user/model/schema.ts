import { z } from 'zod';

// для данных
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  nickname: z.string().nullable(),
  img: z.string(),
  city: z.string().nullable(),
});

// для форм
export const userCreateSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

// либо так
// export const userCreateSchema1 = userSchema
//   .omit({ id: true, nickname: true, img: true, city: true })
//   .extend({
//     password: z.string(),
//   });

export const userLoginSchema = userCreateSchema.omit({ name: true });

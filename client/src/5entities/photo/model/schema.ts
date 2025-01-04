import { z } from 'zod';

export const photoSchema = z.object({
  id: z.number(),
  pic: z.string(),
  desc: z.string().nullable(),
  ownerId: z.number(),
});

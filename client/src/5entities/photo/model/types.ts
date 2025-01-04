import type { z } from 'zod';
import type { photoSchema } from './schema';

export type PhotoType = z.infer<typeof photoSchema>;
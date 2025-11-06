import { z } from 'zod';
import { ResponseSchema } from './schemas';

export type ResponseData = z.infer<typeof ResponseSchema> & {
  source?: 'heuristic' | 'llm' | 'mixed';
};


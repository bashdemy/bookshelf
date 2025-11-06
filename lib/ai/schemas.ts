import { z } from 'zod';
import { BOOK_GENRES, ARTICLE_TAGS } from './constants';

export const WorkSchema = z.object({
  kind: z.enum(['book', 'article']),
  title: z.string(),
  authors: z.array(z.string()),
  year: z.number().optional(),
  genre: z.enum([...BOOK_GENRES, 'unknown']).optional(),
  tags: z.array(z.enum([...ARTICLE_TAGS])).optional(),
  url: z.string().optional(),
  source: z.enum(['heuristic', 'llm', 'mixed']),
});

export const ResponseSchema = z.object({
  kind: WorkSchema.shape.kind,
  title: z.string(),
  author: z.string(),
  publication: z.string(),
  year: z.number().optional(),
  genre: z.string().optional(),
  tags: z.array(z.string()).optional(),
  url: z.string().optional(),
});


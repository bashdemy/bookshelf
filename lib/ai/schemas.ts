import { z } from 'zod';
import { BOOK_GENRES, ARTICLE_TAGS } from './constants';

export const WorkSchema = z.object({
  kind: z.enum(['book', 'article']).default('article'),
  title: z.string().min(1),
  authors: z.array(z.string()).default([]),
  year: z.number().int().min(1900).max(2100).optional().nullable(),
  pages: z.number().int().min(1).max(10000).optional().nullable(),
  genre: z.enum([...BOOK_GENRES, 'unknown']).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  description: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  source: z.enum(['heuristic', 'llm', 'mixed']).default('llm'),
});

export const ResponseSchema = z.object({
  kind: WorkSchema.shape.kind,
  title: z.string(),
  author: z.string(),
  publication: z.string(),
  year: z.number().optional(),
  pages: z.number().optional(),
  genre: z.string().optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
  url: z.string().optional(),
});


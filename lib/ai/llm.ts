import { z } from 'zod';
import { getAIBinding } from './binding';
import { WorkSchema } from './schemas';
import { ResponseData } from './types';
import { MetaTags } from '@/utils/html';
import { BOOK_GENRES, ARTICLE_TAGS } from './constants';

export async function llmExtract(
  heuristicCandidate: Partial<ResponseData>,
  meta: MetaTags,
  contentPreview: string,
  url: string | null
): Promise<ResponseData> {
  const ai = await getAIBinding();

  if (!ai || typeof ai.run !== 'function') {
    throw new Error('AI service not available');
  }

  const systemPrompt = `You output ONLY JSON. Use this type:

type Work = {
  kind: "book" | "article";
  title: string;
  authors: string[];            // Use your knowledge to infer if not provided
  year?: number;                // Use your knowledge to infer if not provided
  pages?: number;               // For books, estimate page count if known
  genre?: "fantasy"|"sci-fi"|"romance"|"mystery"|"nonfiction"|"history"|"biography"|"self-help"|"business"|"technology"|"unknown";
  tags?: string[];              // from: ["ai","programming","webdev","security","cloud","databases","startups","product","research"]
  description?: string;         // Brief summary or description of the work
  url?: string;
  source: "heuristic"|"llm"|"mixed";
};

Rules:
- Use the provided text/meta as primary source, but you may use your knowledge to fill in missing information.
- For missing author/year/pages: Use your knowledge of the work to infer these values when possible.
- For pages: Estimate for books if you know the approximate length (e.g., 200-300 pages for typical novels).
- For description: Provide a brief 1-2 sentence summary of what the work is about.
- Keep authors as plain names (array of strings).
- No prose, no backticks—JSON only.
- For genre: use only the provided list. Infer from title/content if not specified.
- For tags: use only from the provided list. Infer from content if not specified.
- When you infer information, ensure it's accurate based on your knowledge of the work.`;

  const userPrompt = JSON.stringify({
    url: url || null,
    meta: {
      title: meta.title || null,
      description: meta.description || null,
      author: meta.author || null,
      published: meta.year || null,
    },
    contentPreview: contentPreview.substring(0, 2000),
    heuristicCandidate,
  });

  const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 200,
    temperature: 0.2,
  });

  console.log('Full AI response object:', JSON.stringify(response, null, 2));

  const content = response?.response || response?.text || response?.content || response?.description || '';

  if (!content) {
    console.error('Empty AI response. Full response object:', JSON.stringify(response, null, 2));
    throw new Error('No response from AI');
  }

  console.log('Raw AI response content (first 1000 chars):', content.substring(0, 1000));

  let parsed;
  try {
    const cleaned = content.trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else if (cleaned.startsWith('[')) {
      const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        const array = JSON.parse(arrayMatch[0]);
        parsed = Array.isArray(array) && array.length > 0 ? array[0] : array;
      }
    } else {
      parsed = JSON.parse(cleaned);
    }
  } catch (parseError) {
    console.error('Failed to parse AI response. Raw content:', content.substring(0, 1000));
    console.error('Parse error:', parseError);
    throw new Error('Failed to parse AI response');
  }

  console.log('Parsed AI response:', JSON.stringify(parsed, null, 2));

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('AI response is not a valid object');
  }

  const sanitized: any = {
    kind: parsed.kind || parsed.type || 'article',
    title: String(parsed.title || parsed.Title || '').trim(),
    authors: Array.isArray(parsed.authors) 
      ? parsed.authors.map((a: any) => String(a).trim()).filter((a: string) => a.length > 0)
      : (parsed.author ? [String(parsed.author).trim()] : []),
    year: typeof parsed.year === 'number' 
      ? (parsed.year >= 1900 && parsed.year <= 2100 ? parsed.year : undefined)
      : (parsed.year ? (() => {
          const year = parseInt(String(parsed.year), 10);
          return isNaN(year) || year < 1900 || year > 2100 ? undefined : year;
        })() : undefined),
    pages: typeof parsed.pages === 'number'
      ? (parsed.pages >= 1 && parsed.pages <= 10000 ? parsed.pages : undefined)
      : (parsed.pages ? (() => {
          const pages = parseInt(String(parsed.pages), 10);
          return isNaN(pages) || pages < 1 || pages > 10000 ? undefined : pages;
        })() : undefined),
    genre: parsed.genre && [...BOOK_GENRES, 'unknown'].includes(parsed.genre) ? parsed.genre : undefined,
    tags: Array.isArray(parsed.tags) 
      ? parsed.tags.map((tag: any) => String(tag).toLowerCase()).filter((tag: string) => ARTICLE_TAGS.includes(tag as any))
      : undefined,
    description: parsed.description ? String(parsed.description).trim() : undefined,
    url: parsed.url && typeof parsed.url === 'string' ? parsed.url : undefined,
    source: parsed.source || 'llm',
  };

  if (!sanitized.title || sanitized.title.length === 0) {
    throw new Error('AI response missing title');
  }

  if (!['book', 'article'].includes(sanitized.kind)) {
    sanitized.kind = 'article';
  }

  let validated;
  try {
    validated = WorkSchema.parse(sanitized);
  } catch (zodError) {
    console.error('Zod validation failed. Sanitized data:', JSON.stringify(sanitized, null, 2));
    if (zodError instanceof z.ZodError) {
      console.error('Validation errors:', zodError.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
        code: e.code,
        received: (e as any).received,
        expected: (e as any).expected,
      })));
    }
    
    const safeFallback = {
      kind: sanitized.kind === 'book' ? 'book' : 'article',
      title: sanitized.title,
      authors: Array.isArray(sanitized.authors) ? sanitized.authors : [],
      year: sanitized.year,
      genre: sanitized.genre,
      tags: sanitized.tags,
      url: sanitized.url,
      source: 'llm' as const,
    };
    
    console.warn('Using safe fallback instead of validated schema');
    validated = WorkSchema.parse(safeFallback);
  }

  const result: ResponseData = {
    kind: validated.kind,
    title: validated.title || heuristicCandidate.title || '',
    author:
      validated.authors && validated.authors.length > 0
        ? validated.authors[0]
        : heuristicCandidate.author || '',
    publication: '',
    year: validated.year ?? heuristicCandidate.year,
    pages: validated.pages ?? undefined,
    genre: validated.genre && validated.genre !== 'unknown' ? validated.genre : undefined,
    tags: validated.tags ?? undefined,
    description: validated.description ?? undefined,
    url: validated.url ?? url ?? undefined,
  };
  
  return result;
}


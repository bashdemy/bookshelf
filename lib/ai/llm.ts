import { z } from 'zod';
import { getAIBinding } from './binding';
import { WorkSchema } from './schemas';
import { ResponseData } from './types';
import { MetaTags } from '@/utils/html';
import { BOOK_GENRES, ARTICLE_TAGS } from './constants';
import { extractPublicationFromUrl } from './heuristics';

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

  const systemPrompt = `You output ONLY JSON. Use this structure:
{
  "kind": "book" | "article",
  "title": string,
  "authors": string[],
  "year": number,
  "pages": number,
  "genre": "fantasy"|"sci-fi"|"romance"|"mystery"|"nonfiction"|"history"|"biography"|"self-help"|"business"|"technology"|"unknown",
  "tags": string[],
  "description": string,
  "url": string
}

Rules:
- URLs are articles unless from book review/retail domains (amazon, goodreads).
- Publication name from domain (e.g. medium.com -> Medium).
- For genre/tags: pick strictly from standard literary genres and tech tags.
- Output pure JSON only.`;

  const userPrompt = JSON.stringify({
    url: url || null,
    meta: {
      title: meta.title || null,
      description: meta.description || null,
      author: meta.author || null,
      published: meta.year || null,
      publication: meta.publication || meta.siteName || null,
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

  const content = response?.response || response?.text || response?.content || response?.description || '';

  if (!content) {
    throw new Error('No response from AI');
  }

  let parsed: any;
  try {
    const cleaned = content.trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else if (cleaned.startsWith('[')) {
      const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
      parsed = arrayMatch ? JSON.parse(arrayMatch[0])[0] : null;
    } else {
      parsed = JSON.parse(cleaned);
    }
  } catch (parseError) {
    throw new Error('Failed to parse AI response');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('AI response is not a valid object');
  }

  const sanitized = {
    kind: (parsed.kind === 'book' || parsed.type === 'book') ? 'book' : 'article',
    title: String(parsed.title || parsed.Title || '').trim(),
    authors: Array.isArray(parsed.authors) 
      ? parsed.authors.map((a: unknown) => String(a).trim()).filter((a: string) => a.length > 0)
      : (parsed.author ? [String(parsed.author).trim()] : []),
    year: typeof parsed.year === 'number' && parsed.year >= 1900 && parsed.year <= 2100
      ? parsed.year
      : undefined,
    pages: typeof parsed.pages === 'number' && parsed.pages >= 1 && parsed.pages <= 10000
      ? parsed.pages
      : undefined,
    genre: parsed.genre && [...BOOK_GENRES, 'unknown'].includes(parsed.genre) ? parsed.genre : undefined,
    tags: Array.isArray(parsed.tags) 
      ? parsed.tags.map((tag: unknown) => String(tag).toLowerCase()).filter((tag: string) => (ARTICLE_TAGS as readonly string[]).includes(tag))
      : undefined,
    description: parsed.description ? String(parsed.description).trim() : undefined,
    url: parsed.url && typeof parsed.url === 'string' ? parsed.url : undefined,
    source: 'llm' as const,
  };

  if (!sanitized.title) {
    throw new Error('AI response missing title');
  }

  let validated;
  try {
    validated = WorkSchema.parse(sanitized);
  } catch {
    validated = WorkSchema.parse({
      kind: sanitized.kind,
      title: sanitized.title,
      authors: sanitized.authors,
      source: 'llm' as const,
    });
  }

  const publication = 
    (validated.kind === 'article' && url) 
      ? (heuristicCandidate.publication || extractPublicationFromUrl(url) || '')
      : '';

  return {
    kind: validated.kind,
    title: validated.title || heuristicCandidate.title || '',
    author: validated.authors?.[0] || heuristicCandidate.author || '',
    publication: publication || heuristicCandidate.publication || '',
    year: validated.year ?? heuristicCandidate.year,
    pages: validated.pages ?? undefined,
    genre: validated.genre && validated.genre !== 'unknown' ? validated.genre : undefined,
    tags: validated.tags ?? undefined,
    description: validated.description ?? undefined,
    url: validated.url ?? url ?? undefined,
  };
}

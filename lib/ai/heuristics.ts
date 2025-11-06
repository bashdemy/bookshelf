import { MetaTags } from '@/utils/html';
import { ResponseData } from './types';

export function inferKind(url: string | null, meta: MetaTags, content: string): 'book' | 'article' {
  if (url) {
    const urlLower = url.toLowerCase();
    if (
      urlLower.includes('amazon') ||
      urlLower.includes('goodreads') ||
      urlLower.includes('isbn') ||
      urlLower.includes('book')
    ) {
      return 'book';
    }
    return 'article';
  }

  const text = (meta.description || content || '').toLowerCase();
  if (text.includes('isbn') || text.includes('publisher') || text.includes('chapter')) {
    return 'book';
  }

  return 'article';
}

export function heuristicExtract(
  url: string,
  meta: MetaTags,
  contentPreview: string
): Partial<ResponseData> {
  const kind = inferKind(url, meta, contentPreview);

  const result: Partial<ResponseData> = {
    kind,
    title: meta.title || '',
    author: meta.author || '',
    publication: '',
    source: 'heuristic' as const,
    url,
  };

  if (meta.year) {
    const year = parseInt(meta.year, 10);
    if (!isNaN(year) && year > 1900 && year <= new Date().getFullYear() + 1) {
      result.year = year;
    }
  }

  return result;
}


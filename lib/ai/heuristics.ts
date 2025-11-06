import { MetaTags } from '@/utils/html';
import { ResponseData } from './types';

export function inferKind(url: string | null, meta: MetaTags, content: string): 'book' | 'article' {
  if (url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      if (
        hostname.includes('amazon') ||
        hostname.includes('goodreads') ||
        hostname.includes('barnesandnoble') ||
        hostname.includes('bookshop') ||
        url.toLowerCase().includes('isbn') ||
        url.toLowerCase().includes('/book/')
      ) {
        return 'book';
      }
      
      return 'article';
    } catch {
      return 'article';
    }
  }

  const text = (meta.description || content || '').toLowerCase();
  if (text.includes('isbn') || text.includes('chapter') || text.includes('published by') || text.includes('book by')) {
    return 'book';
  }

  return 'article';
}

export function extractPublicationFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    const domainParts = hostname.replace('www.', '').split('.');
    if (domainParts.length >= 2) {
      const siteName = domainParts[domainParts.length - 2];
      const knownPublications: Record<string, string> = {
        'medium': 'Medium',
        'substack': 'Substack',
        'dev': 'Dev.to',
        'github': 'GitHub',
        'arxiv': 'arXiv',
        'ieee': 'IEEE',
        'acm': 'ACM',
        'nature': 'Nature',
        'science': 'Science',
        'techcrunch': 'TechCrunch',
        'wired': 'Wired',
        'theverge': 'The Verge',
        'nytimes': 'The New York Times',
        'washingtonpost': 'The Washington Post',
        'theguardian': 'The Guardian',
      };
      
      if (knownPublications[siteName]) {
        return knownPublications[siteName];
      }
      
      return siteName.charAt(0).toUpperCase() + siteName.slice(1);
    }
  } catch {}
  
  return '';
}

function extractYearFromUrl(url: string): number | undefined {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    const yearMatch = pathname.match(/\/(20\d{2})\//);
    if (yearMatch) {
      const year = parseInt(yearMatch[1], 10);
      if (year >= 1900 && year <= new Date().getFullYear() + 1) {
        return year;
      }
    }
    
    const dateMatch = pathname.match(/\/(20\d{2})\/(\d{2})\/(\d{2})\//);
    if (dateMatch) {
      const year = parseInt(dateMatch[1], 10);
      if (year >= 1900 && year <= new Date().getFullYear() + 1) {
        return year;
      }
    }
  } catch {}
  
  return undefined;
}

export function heuristicExtract(
  url: string,
  meta: MetaTags,
  contentPreview: string
): Partial<ResponseData> {
  const kind = inferKind(url, meta, contentPreview);

  let publication = '';
  if (kind === 'article') {
    publication = meta.publication || meta.siteName || extractPublicationFromUrl(url) || '';
  }

  const result: Partial<ResponseData> = {
    kind,
    title: meta.title || '',
    author: meta.author || '',
    publication,
    source: 'heuristic' as const,
    url,
  };

  if (meta.year) {
    const year = parseInt(meta.year, 10);
    if (!isNaN(year) && year > 1900 && year <= new Date().getFullYear() + 1) {
      result.year = year;
    }
  } else if (kind === 'article') {
    const urlYear = extractYearFromUrl(url);
    if (urlYear) {
      result.year = urlYear;
    }
  }

  return result;
}


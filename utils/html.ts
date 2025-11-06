export interface MetaTags {
  title?: string;
  author?: string;
  year?: string;
  description?: string;
  publication?: string;
  siteName?: string;
}

export function extractMetaTags(html: string): MetaTags {
  const meta: MetaTags = {};

  const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  if (ogTitleMatch) meta.title = ogTitleMatch[1];

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && !meta.title) meta.title = titleMatch[1].trim();

  const ogAuthorMatch = html.match(
    /<meta\s+property=["']article:author["']\s+content=["']([^"']+)["']/i
  );
  if (ogAuthorMatch) meta.author = ogAuthorMatch[1];

  const authorMatch = html.match(/<meta\s+name=["']author["']\s+content=["']([^"']+)["']/i);
  if (authorMatch && !meta.author) meta.author = authorMatch[1];

  const publishedMatch = html.match(
    /<meta\s+property=["']article:published_time["']\s+content=["']([^"']+)["']/i
  );
  if (publishedMatch) {
    const date = new Date(publishedMatch[1]);
    if (!isNaN(date.getTime())) meta.year = date.getFullYear().toString();
  }

  const descriptionMatch = html.match(
    /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i
  );
  if (descriptionMatch) meta.description = descriptionMatch[1];

  const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (metaDescMatch && !meta.description) meta.description = metaDescMatch[1];

  const siteNameMatch = html.match(/<meta\s+property=["']og:site_name["']\s+content=["']([^"']+)["']/i);
  if (siteNameMatch) meta.siteName = siteNameMatch[1];

  const publicationMatch = html.match(/<meta\s+property=["']article:publisher["']\s+content=["']([^"']+)["']/i);
  if (publicationMatch) meta.publication = publicationMatch[1];

  return meta;
}

export function extractContentPreview(html: string, maxChars: number = 2000): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return '';

  const body = bodyMatch[1];

  const text = body
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const paragraphs = text.split(/\s+/).filter((w) => w.length > 0);
  const preview = paragraphs.slice(0, Math.min(paragraphs.length, maxChars / 10)).join(' ');

  return preview.substring(0, maxChars);
}

export async function findTLDRSourceLink(html: string): Promise<string | null> {
  const sourceLinkMatch = html.match(/<a[^>]*href=["']([^"']+)["'][^>]*>.*?source.*?<\/a>/i);
  if (sourceLinkMatch) return sourceLinkMatch[1];

  const linkMatch = html.match(/<a[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*class=["'][^"']*source[^"']*["']/i);
  if (linkMatch) return linkMatch[1];

  const externalLinkMatch = html.match(
    /<a[^>]*href=["'](https?:\/\/[^tldr][^"']+)["'][^>]*>.*?Read.*?more.*?<\/a>/i
  );
  if (externalLinkMatch) return externalLinkMatch[1];

  return null;
}


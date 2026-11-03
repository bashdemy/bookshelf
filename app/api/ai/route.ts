import { NextRequest, NextResponse } from 'next/server';
import { isURL, fetchPage } from '@/utils/url';
import { extractMetaTags, extractContentPreview, findTLDRSourceLink } from '@/utils/html';
import { heuristicExtract } from '@/lib/ai/heuristics';
import { llmExtract } from '@/lib/ai/llm';
import { getAIBinding } from '@/lib/ai/binding';

export const dynamic = 'force-dynamic';

function getAIBindingFromRequest(request: NextRequest) {
  const cfEnvHeader = request.headers.get('x-cloudflare-env');
  if (cfEnvHeader) {
    try {
      const env = JSON.parse(cfEnvHeader);
      if (env.AI) return env.AI;
    } catch {}
  }
  return null;
}

function formatSuggestion(result: {
  kind?: string;
  title?: string;
  author?: string;
  publication?: string;
  year?: number;
  pages?: number;
  genre?: string;
  tags?: string[];
  description?: string;
  url?: string;
}) {
  return {
    type: result.kind || 'article',
    title: result.title || '',
    author: result.author || '',
    publication: result.publication || '',
    year: result.year ? String(result.year) : '',
    pages: result.pages ? String(result.pages) : '',
    genre: result.genre || '',
    tags: result.tags && result.tags.length > 0 ? result.tags.join(', ') : '',
    description: result.description || '',
    url: result.url || '',
  };
}

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description || typeof description !== 'string') {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    let url: string | null = null;
    let meta = extractMetaTags('');
    let contentPreview = '';
    let heuristicCandidate: ReturnType<typeof heuristicExtract> | null = null;

    if (isURL(description.trim())) {
      url = description.trim();

      const isTLDR = url.toLowerCase().includes('tldr.news') || url.toLowerCase().includes('tldr');

      if (isTLDR) {
        const { html } = await fetchPage(url);
        const sourceLink = await findTLDRSourceLink(html);

        if (sourceLink) {
          url = sourceLink.startsWith('http') ? sourceLink : new URL(sourceLink, url).toString();
          const { html: sourceHtml } = await fetchPage(url);
          meta = extractMetaTags(sourceHtml);
          contentPreview = extractContentPreview(sourceHtml);
        } else {
          meta = extractMetaTags(html);
          contentPreview = extractContentPreview(html);
        }
      } else {
        const { html: fetchedHtml } = await fetchPage(url);
        meta = extractMetaTags(fetchedHtml);
        contentPreview = extractContentPreview(fetchedHtml);
      }

      heuristicCandidate = heuristicExtract(url, meta, contentPreview);

      if (heuristicCandidate.title && (heuristicCandidate.author || heuristicCandidate.year)) {
        return NextResponse.json({
          suggestions: [formatSuggestion(heuristicCandidate)],
        });
      }
    } else {
      contentPreview = description;
    }

    let ai = getAIBindingFromRequest(request) || (await getAIBinding());

    if (!ai || typeof ai.run !== 'function') {
      if (heuristicCandidate && heuristicCandidate.title) {
        return NextResponse.json({
          suggestions: [formatSuggestion(heuristicCandidate)],
        });
      }

      return NextResponse.json(
        {
          error:
            'AI service not available in local environment. Please use manual entry or provide a URL for automatic extraction.',
        },
        { status: 503 }
      );
    }

    try {
      const result = await llmExtract(heuristicCandidate || {}, meta, contentPreview, url);

      return NextResponse.json({
        suggestions: [formatSuggestion(result)],
      });
    } catch (llmError) {
      if (heuristicCandidate && heuristicCandidate.title) {
        return NextResponse.json({
          suggestions: [formatSuggestion(heuristicCandidate)],
        });
      }
      throw llmError;
    }
  } catch (error) {
    console.error('AI extraction error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

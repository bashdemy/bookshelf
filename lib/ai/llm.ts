import { z } from 'zod';
import { getAIBinding } from './binding';
import { WorkSchema } from './schemas';
import { ResponseData } from './types';
import { MetaTags } from '@/utils/html';

export async function llmExtract(
  heuristicCandidate: Partial<ResponseData>,
  meta: MetaTags,
  contentPreview: string,
  url: string | null
): Promise<ResponseData> {
  const ai = getAIBinding();

  if (!ai || typeof ai.run !== 'function') {
    throw new Error('AI service not available');
  }

  const systemPrompt = `You output ONLY JSON. Use this type:

type Work = {
  kind: "book" | "article";
  title: string;
  authors: string[];            // Use your knowledge to infer if not provided
  year?: number;                // Use your knowledge to infer if not provided
  genre?: "fantasy"|"sci-fi"|"romance"|"mystery"|"nonfiction"|"history"|"biography"|"self-help"|"business"|"technology"|"unknown";
  tags?: string[];              // from: ["ai","programming","webdev","security","cloud","databases","startups","product","research"]
  url?: string;
  source: "heuristic"|"llm"|"mixed";
};

Rules:
- Use the provided text/meta as primary source, but you may use your knowledge to fill in missing information.
- For missing author/year: Use your knowledge of the work to infer these values when possible.
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

  const content = response?.response || response?.text || '';

  if (!content) {
    throw new Error('No response from AI');
  }

  let parsed;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      parsed = JSON.parse(content);
    }
  } catch (parseError) {
    throw new Error('Failed to parse AI response');
  }

  const validated = WorkSchema.parse(parsed);

  return {
    kind: validated.kind,
    title: validated.title || heuristicCandidate.title || '',
    author:
      validated.authors && validated.authors.length > 0
        ? validated.authors[0]
        : heuristicCandidate.author || '',
    publication: '',
    year: validated.year || heuristicCandidate.year,
    genre: validated.genre !== 'unknown' ? validated.genre : undefined,
    tags: validated.tags || undefined,
    url: validated.url || url || undefined,
  };
}


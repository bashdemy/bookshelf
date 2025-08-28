import { NextRequest, NextResponse } from 'next/server';
import { addArticle, getArticles } from '@/lib/articles';
import type { NewArticle } from '@/types/article';

export async function GET() {
  try {
    const articles = await getArticles();
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as NewArticle;
    const { adminKey, ...articleData } = body;

    // Simple admin key validation
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 });
    }

    const result = await addArticle(articleData);
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to add article' }, { status: 500 });
  }
}

export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { drizzle } from 'drizzle-orm/d1';
import { articles } from '@/db/schema';
import { desc } from 'drizzle-orm';
import type { NewArticle } from '@/types/article';

function getDb() {
  const ctxEnv = ((): { bookself_db?: D1Database } | undefined => {
    try {
      return (getRequestContext()?.env ?? undefined) as {
        bookself_db?: D1Database;
      };
    } catch {
      return undefined;
    }
  })();

  const globalEnv = (globalThis as { env?: { bookself_db?: D1Database } }).env;

  const env = ctxEnv ?? globalEnv ?? {};
  const d1 =
    (env as { bookself_db?: D1Database; DB?: D1Database }).DB ??
    (env as { bookself_db?: D1Database; DB?: D1Database }).bookself_db;

  if (!d1) {
    console.error('D1 database not available - env keys:', Object.keys(env));
    throw new Error('D1 database not available');
  }
  return drizzle(d1);
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function GET() {
  try {
    const db = getDb();

    const result = await db
      .select()
      .from(articles)
      .orderBy(desc(articles.created_at));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as NewArticle;
    const { adminKey, ...articleData } = body ?? ({} as NewArticle);

    let envAdminKey: string | undefined;
    try {
      envAdminKey = (getRequestContext().env as { ADMIN_KEY?: string })
        ?.ADMIN_KEY;
    } catch {
      envAdminKey = ((globalThis as { env?: { ADMIN_KEY?: string } }).env ?? {})
        .ADMIN_KEY;
    }

    if (!envAdminKey) {
      console.error('Admin key not configured');
      return NextResponse.json(
        { error: 'Admin key not configured' },
        { status: 500 }
      );
    }

    if (!adminKey || typeof adminKey !== 'string' || adminKey.trim() === '') {
      return NextResponse.json(
        { error: 'Admin key is required' },
        { status: 400 }
      );
    }
    let decodedAdminKey = adminKey;
    try {
      decodedAdminKey = decodeURIComponent(adminKey);
    } catch {
      return NextResponse.json(
        { error: 'Invalid admin key format' },
        { status: 400 }
      );
    }

    if (decodedAdminKey !== envAdminKey) {
      console.error('Admin key mismatch');
      return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 });
    }

    if (!articleData.title || !articleData.url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      );
    }

    const db = getDb();

    const newArticle = {
      id: generateUUID(),
      title: articleData.title,
      url: articleData.url,
      author: articleData.author,
      publication: articleData.publication,
      summary: articleData.summary,
      notes: articleData.notes,
      status: articleData.status || 'to-read',
      word_count: articleData.word_count,
      reading_time_minutes: articleData.reading_time_minutes,
      source: articleData.source,
      category: articleData.category,
      importance_level: articleData.importance_level,
      is_bookmarked: articleData.is_bookmarked ? 1 : 0,
      is_shared: articleData.is_shared ? 1 : 0,
      share_date: articleData.share_date,
      start_date: articleData.start_date,
      finish_date: articleData.finish_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'system',
      updated_by: 'system',
    };
    await db.insert(articles).values(newArticle);

    return NextResponse.json(
      { message: 'Article added successfully', article: newArticle },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding article:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: 'Failed to add article',
        details: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}

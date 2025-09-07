// Edge Runtime configuration for Cloudflare Pages
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/d1';
import { articles } from '@/db/schema';
import { desc } from 'drizzle-orm';
import type { NewArticle } from '@/types/article';

// Helper function to get database instance from environment
function getDb() {
  // Access D1 database from Cloudflare environment
  const env = (
    globalThis as { env?: { bookself_db?: D1Database; ADMIN_KEY?: string } }
  ).env;

  const d1 = env?.bookself_db;
  if (!d1) {
    console.error('D1 database not available - env:', Object.keys(env || {}));
    throw new Error('D1 database not available');
  }
  return drizzle(d1);
}

// Helper function to generate UUID
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

    // Fetch all articles ordered by creation date (newest first)
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
    const { adminKey, ...articleData } = body;

    // Validate admin key from environment variable
    const env = (
      globalThis as { env?: { bookself_db?: D1Database; ADMIN_KEY?: string } }
    ).env;
    const envAdminKey = env?.ADMIN_KEY;

    if (!envAdminKey) {
      console.error('Admin key not configured');
      return NextResponse.json(
        { error: 'Admin key not configured' },
        { status: 500 }
      );
    }

    // Decode the admin key from the request (in case it was URL encoded)
    const decodedAdminKey = decodeURIComponent(adminKey);

    if (decodedAdminKey !== envAdminKey) {
      console.error('Admin key mismatch');
      return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 });
    }

    // Validate required fields
    if (!articleData.title || !articleData.url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Prepare article data with UUID and proper field mapping
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

    // Insert new article into database
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

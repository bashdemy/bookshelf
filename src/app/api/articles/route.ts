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
  const d1 = (globalThis as { env?: { DB?: D1Database } }).env?.DB;
  if (!d1) {
    throw new Error('D1 database not available');
  }
  return drizzle(d1);
}

export async function GET() {
  try {
    const db = getDb();

    // Fetch all articles ordered by creation date (newest first)
    const result = await db
      .select()
      .from(articles)
      .orderBy(desc(articles.createdAt));

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
    if (
      adminKey !==
      (globalThis as { env?: { ADMIN_KEY?: string } }).env?.ADMIN_KEY
    ) {
      return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 });
    }

    // Validate required fields
    if (!articleData.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const db = getDb();

    // Insert new article into database (timestamps handled by database)
    const result = await db.insert(articles).values(articleData);

    return NextResponse.json(
      { message: 'Article added successfully', article: result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding article:', error);
    return NextResponse.json(
      { error: 'Failed to add article' },
      { status: 500 }
    );
  }
}

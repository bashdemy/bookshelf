export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { drizzle } from 'drizzle-orm/d1';
import { books } from '@/db/schema';
import { desc } from 'drizzle-orm';
import type { NewBook } from '@/types/book';

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
      .from(books)
      .orderBy(desc(books.created_at));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as NewBook;
    const { adminKey, ...bookData } = body ?? ({} as NewBook);

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

    if (!bookData.title || !bookData.author) {
      return NextResponse.json(
        { error: 'Title and author are required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const newBook = {
      id: generateUUID(),
      title: bookData.title,
      author: bookData.author,
      status: bookData.status || 'to-read',
      notes: bookData.notes,
      rating: bookData.rating,
      pages: bookData.pages,
      genre: bookData.genre,
      isbn: bookData.isbn,
      publisher: bookData.publisher,
      publication_year: bookData.publication_year,
      language: bookData.language || 'en',
      format: bookData.format,
      source: bookData.source,
      purchase_price_cents: bookData.purchase_price_cents,
      purchase_date: bookData.purchase_date,
      start_date: bookData.start_date,
      finish_date: bookData.finish_date,
      reading_time_hours: bookData.reading_time_hours,
      re_read_count: bookData.re_read_count || 0,
      is_favorite: bookData.is_favorite ? 1 : 0,
      is_recommended: bookData.is_recommended ? 1 : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'system',
      updated_by: 'system',
    };

    await db.insert(books).values(newBook);

    return NextResponse.json(
      { message: 'Book added successfully', book: newBook },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding book:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: 'Failed to add book',
        details: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}

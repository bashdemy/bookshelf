// Edge Runtime configuration for Cloudflare Pages
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/d1';
import { books } from '@/db/schema';
import { desc } from 'drizzle-orm';
import type { NewBook } from '@/types/book';

// Helper function to get database instance from environment
function getDb() {
  // Access D1 database from Cloudflare environment
  const d1 = (globalThis as { env?: { DB?: D1Database } }).env?.DB;
  if (!d1) {
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

    // Fetch all books ordered by creation date (newest first)
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
    const { adminKey, ...bookData } = body;

    // Validate admin key from environment variable
    if (
      adminKey !==
      (globalThis as { env?: { ADMIN_KEY?: string } }).env?.ADMIN_KEY
    ) {
      return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 });
    }

    // Validate required fields
    if (!bookData.title || !bookData.author) {
      return NextResponse.json(
        { error: 'Title and author are required' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Prepare book data with UUID and proper field mapping
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

    // Insert new book into database
    await db.insert(books).values(newBook);

    return NextResponse.json(
      { message: 'Book added successfully', book: newBook },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 });
  }
}

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

export async function GET() {
  try {
    const db = getDb();

    // Fetch all books ordered by creation date (newest first)
    const result = await db.select().from(books).orderBy(desc(books.createdAt));

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

    // Insert new book into database (timestamps handled by database)
    const result = await db.insert(books).values(bookData);

    return NextResponse.json(
      { message: 'Book added successfully', book: result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 });
  }
}

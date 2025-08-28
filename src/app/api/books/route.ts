import { NextRequest, NextResponse } from 'next/server';
import { addBook, getBooks } from '@/lib/books';
import type { NewBook } from '@/types/book';

export async function GET() {
  try {
    const books = await getBooks();
    return NextResponse.json(books);
  } catch {
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

    // Validate admin key
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 });
    }

    // Validate required fields
    if (!bookData.title || !bookData.author) {
      return NextResponse.json(
        { error: 'Title and author are required' },
        { status: 400 }
      );
    }

    const result = await addBook(bookData);
    return NextResponse.json(
      { message: 'Book added successfully', book: result },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 });
  }
}

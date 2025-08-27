import { NextRequest, NextResponse } from 'next/server';
import type { NewBook } from '@/db/schema';

export async function GET() {
  try {
    // Return sample data for development
    const books = [
      {
        id: 1,
        title: "The Pragmatic Programmer",
        author: "David Thomas & Andrew Hunt",
        status: "completed",
        notes: "Essential reading for any developer",
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: 2,
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        status: "reading",
        notes: "Great insights into distributed systems",
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      },
    ];
    
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, status, notes, adminKey } = body;

    // Validate admin key
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Invalid admin key' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!title || !author) {
      return NextResponse.json(
        { error: 'Title and author are required' },
        { status: 400 }
      );
    }

    const bookData: NewBook = {
      title,
      author,
      status: status || 'to-read',
      notes: notes || null,
    };

    // In production, this would use the D1 binding from Cloudflare
    // For now, we'll return a success response
    return NextResponse.json(
      { message: 'Book added successfully', book: bookData },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add book' },
      { status: 500 }
    );
  }
}

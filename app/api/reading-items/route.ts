import { NextRequest, NextResponse } from 'next/server';
import { createReadingItem } from '@/lib/reading-items';
import { ReadingItem } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { item } = await request.json();

    if (!item || !item.title || !item.readDate) {
      return NextResponse.json(
        { error: 'Title and read date are required' },
        { status: 400 }
      );
    }

    const userId = 'bashdemy';
    const readingItem: Omit<ReadingItem, 'id'> = {
      type: item.type || 'book',
      title: item.title,
      author: item.author,
      publication: item.publication,
      year: item.year,
      pages: item.pages,
      readDate: item.readDate,
      rating: item.rating,
      genre: item.genre,
      tags: item.tags,
      description: item.description,
    };

    const created = await createReadingItem(userId, readingItem);

    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating reading item:', error);
    return NextResponse.json(
      { error: 'Failed to create reading item' },
      { status: 500 }
    );
  }
}


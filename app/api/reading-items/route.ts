import { NextRequest, NextResponse } from 'next/server';
import { createReadingItem } from '@/lib/reading-items';
import { ReadingItem } from '@/types';
import { auth } from '@/auth';
import { checkUserOnboarding } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isOnboarded = await checkUserOnboarding(session.user.id);
    if (!isOnboarded) {
      return NextResponse.json({ error: 'Please complete onboarding first' }, { status: 403 });
    }

    const { item } = await request.json();

    if (!item || !item.title || !item.readDate) {
      return NextResponse.json(
        { error: 'Title and read date are required' },
        { status: 400 }
      );
    }

    const userId = session.user.id;
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


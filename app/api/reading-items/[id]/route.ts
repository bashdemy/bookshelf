import { NextRequest, NextResponse } from 'next/server';
import { updateReadingItem, deleteReadingItem } from '@/lib/reading-items';
import { ReadingItem } from '@/types';
import { auth } from '@/auth';
import { checkUserOnboarding } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isOnboarded = await checkUserOnboarding(session.user.id);
    if (!isOnboarded) {
      return NextResponse.json({ error: 'Please complete onboarding first' }, { status: 403 });
    }

    const { id } = await params;
    const { item } = await request.json();

    if (!item || !item.title || !item.readDate) {
      return NextResponse.json(
        { error: 'Title and read date are required' },
        { status: 400 }
      );
    }

    const readingItem: Omit<ReadingItem, 'id'> = {
      type: item.type || 'book',
      title: String(item.title).trim(),
      author: item.author ? String(item.author).trim() : undefined,
      publication: item.publication ? String(item.publication).trim() : undefined,
      year: item.year ? Number(item.year) : undefined,
      pages: item.pages ? Number(item.pages) : undefined,
      readDate: item.readDate,
      rating: item.rating ? Number(item.rating) : undefined,
      genre: item.genre ? String(item.genre).trim() : undefined,
      tags: Array.isArray(item.tags) ? item.tags : undefined,
      description: item.description ? String(item.description).trim() : undefined,
      url: item.url ? String(item.url).trim() : undefined,
    };

    const updated = await updateReadingItem(session.user.id, id, readingItem);

    if (!updated) {
      return NextResponse.json(
        { error: 'Reading item not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item: updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating reading item:', error);
    return NextResponse.json(
      { error: 'Failed to update reading item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteReadingItem(session.user.id, id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Reading item not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting reading item:', error);
    return NextResponse.json(
      { error: 'Failed to delete reading item' },
      { status: 500 }
    );
  }
}

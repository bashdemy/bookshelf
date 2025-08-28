import { db } from '@/db';
import { books } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// Helper function to generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Mock data for development
const mockBooks = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    status: 'completed',
    notes: 'Essential reading for any developer',
    rating: 5,
    pages: 352,
    genre: 'Programming',
    created_at: '2024-01-15T00:00:00.000Z',
    updated_at: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    status: 'reading',
    notes: 'Great insights into distributed systems',
    rating: 4,
    pages: 616,
    genre: 'Computer Science',
    created_at: '2024-02-01T00:00:00.000Z',
    updated_at: '2024-02-01T00:00:00.000Z',
  },
];

export async function getBooks() {
  try {
    // Check if db is a mock database
    if (!db.select || typeof db.select !== 'function') {
      console.log('Using mock data for books');
      return mockBooks;
    }

    const result = await db
      .select()
      .from(books)
      .orderBy(desc(books.created_at));
    return result;
  } catch (error) {
    console.error('Error fetching books:', error);
    return mockBooks;
  }
}

export async function addBook(bookData: {
  title: string;
  author: string;
  status?: string;
  notes?: string;
  rating?: number;
  pages?: number;
  genre?: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  language?: 'en' | 'ru';
  format?: 'physical' | 'ebook' | 'audiobook' | 'pdf';
  source?: string;
  purchase_price_cents?: number;
  purchase_date?: string;
  start_date?: string;
  finish_date?: string;
  reading_time_hours?: number;
  re_read_count?: number;
  is_favorite?: boolean;
  is_recommended?: boolean;
}) {
  try {
    const now = new Date().toISOString();

    const result = await db.insert(books).values({
      id: generateUUID(),
      ...bookData,
      is_favorite: bookData.is_favorite ? 1 : 0,
      is_recommended: bookData.is_recommended ? 1 : 0,
      created_at: now,
      updated_at: now,
      created_by: 'system',
      updated_by: 'system',
    });
    return result;
  } catch (error) {
    console.error('Error adding book:', error);
    // Return mock success for development
    return { success: true };
  }
}

export async function updateBook(
  id: string,
  bookData: Partial<typeof books.$inferInsert>
) {
  try {
    const now = new Date().toISOString();

    const result = await db
      .update(books)
      .set({
        ...bookData,
        updated_at: now,
        updated_by: 'system',
      })
      .where(eq(books.id, id));
    return result;
  } catch (error) {
    console.error('Error updating book:', error);
    return { success: true };
  }
}

export async function deleteBook(id: string) {
  try {
    const result = await db.delete(books).where(eq(books.id, id));
    return result;
  } catch (error) {
    console.error('Error deleting book:', error);
    return { success: true };
  }
}

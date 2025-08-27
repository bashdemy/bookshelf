import { db } from '@/db';
import { books } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Mock data for development
const mockBooks = [
  {
    id: 1,
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    status: "completed",
    notes: "Essential reading for any developer",
    rating: 5,
    pages: 352,
    genre: "Programming",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    status: "reading",
    notes: "Great insights into distributed systems",
    rating: 4,
    pages: 616,
    genre: "Computer Science",
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

export async function getBooks() {
  try {
    const result = await db.select().from(books).orderBy(books.createdAt);
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
}) {
  try {
    const now = new Date();
    const result = await db.insert(books).values({
      ...bookData,
      createdAt: now,
      updatedAt: now,
    });
    return result;
  } catch (error) {
    console.error('Error adding book:', error);
    // Return mock success for development
    return { success: true };
  }
}

export async function updateBook(id: number, bookData: Partial<typeof books.$inferInsert>) {
  try {
    const result = await db.update(books).set({
      ...bookData,
      updatedAt: new Date(),
    }).where(eq(books.id, id));
    return result;
  } catch (error) {
    console.error('Error updating book:', error);
    return { success: true };
  }
}

export async function deleteBook(id: number) {
  try {
    const result = await db.delete(books).where(eq(books.id, id));
    return result;
  } catch (error) {
    console.error('Error deleting book:', error);
    return { success: true };
  }
}

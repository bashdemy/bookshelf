import type { NewBook } from '@/types/book';

// This will be available in Cloudflare Pages Functions
declare global {
  var __db__: any | undefined;
}

function getDb() {
  if (process.env.NODE_ENV === 'production') {
    // In production, we'll use the D1 binding from Cloudflare
    // This will be handled by the API routes
    throw new Error('Database access should be through API routes in production');
  }
  
  // In development, we can use a local database
  if (!global.__db__) {
    // For development, you might want to use a local SQLite file
    // This is just a placeholder - you'll need to implement local dev setup
    throw new Error('Local database not implemented for development');
  }
  
  return global.__db__;
}

export async function getBooks() {
  // Return sample data for development
  return [
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
}

export async function addBook(bookData: NewBook) {
  // For development, just return the book data
  return {
    id: Math.floor(Math.random() * 1000),
    ...bookData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function updateBook(id: number, bookData: Partial<NewBook>) {
  // For development, just return success
  return { id, ...bookData, updatedAt: new Date() };
}

export async function deleteBook(id: number) {
  // For development, just return success
  return true;
}

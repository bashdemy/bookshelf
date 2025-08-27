import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Create SQLite database instance
let db: any;

try {
  const sqlite = new Database('bookshelf.db');
  db = drizzle(sqlite, { schema });
} catch (error) {
  console.warn('Database not available, using mock data');
  // Mock database for development
  db = {
    select: () => ({
      from: () => Promise.resolve([]),
    }),
    insert: () => ({
      values: () => Promise.resolve({}),
    }),
    update: () => ({
      set: () => ({
        where: () => Promise.resolve({}),
      }),
    }),
    delete: () => ({
      where: () => Promise.resolve({}),
    }),
  };
}

export { db };

// Export types
export type { Book, NewBook, Article, NewArticle } from './schema';
export { books, articles } from './schema';

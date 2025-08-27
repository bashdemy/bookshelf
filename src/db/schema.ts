import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const books = sqliteTable('books', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  author: text('author').notNull(),
  status: text('status').default('reading').notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const books = sqliteTable('books', {
  id: text('id').primaryKey(), // UUID
  title: text('title').notNull(),
  author: text('author').notNull(),
  status: text('status').default('to-read').notNull(),
  notes: text('notes'),
  rating: integer('rating'),
  pages: integer('pages'),
  genre: text('genre'),
  isbn: text('isbn'),
  publisher: text('publisher'),
  publication_year: integer('publication_year'),
  language: text('language').default('en'),
  format: text('format'),
  source: text('source'),
  purchase_price_cents: integer('purchase_price_cents'),
  purchase_date: text('purchase_date'),
  start_date: text('start_date'),
  finish_date: text('finish_date'),
  reading_time_hours: integer('reading_time_hours'),
  re_read_count: integer('re_read_count').default(0),
  is_favorite: integer('is_favorite').default(0), // SQLite boolean as 0/1
  is_recommended: integer('is_recommended').default(0), // SQLite boolean as 0/1
  created_at: text('created_at').notNull().default('now'),
  updated_at: text('updated_at').notNull().default('now'),
  created_by: text('created_by').default('system'),
  updated_by: text('updated_by').default('system'),
});

export const articles = sqliteTable('articles', {
  id: text('id').primaryKey(), // UUID
  title: text('title').notNull(),
  url: text('url').notNull(), // URL is now required
  author: text('author'),
  publication: text('publication'),
  summary: text('summary'),
  notes: text('notes'),
  status: text('status').default('to-read').notNull(),
  word_count: integer('word_count'),
  reading_time_minutes: integer('reading_time_minutes'),
  source: text('source'),
  category: text('category'),
  importance_level: integer('importance_level'),
  is_bookmarked: integer('is_bookmarked').default(0), // SQLite boolean as 0/1
  is_shared: integer('is_shared').default(0), // SQLite boolean as 0/1
  share_date: text('share_date'),
  start_date: text('start_date'),
  finish_date: text('finish_date'),
  created_at: text('created_at').notNull().default('now'),
  updated_at: text('updated_at').notNull().default('now'),
  created_by: text('created_by').default('system'),
  updated_by: text('updated_by').default('system'),
});

export const personal_comments = sqliteTable('personal_comments', {
  id: text('id').primaryKey(), // UUID
  book_id: text('book_id'),
  article_id: text('article_id'),
  comment_type: text('comment_type').notNull(),
  content: text('content').notNull(),
  page_number: integer('page_number'),
  chapter: text('chapter'),
  is_public: integer('is_public').default(0), // SQLite boolean as 0/1
  mood: text('mood'),
  created_at: text('created_at').notNull().default('now'),
  updated_at: text('updated_at').notNull().default('now'),
});

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(), // UUID
  name: text('name').notNull().unique(),
  color: text('color').default('#3B82F6'),
  description: text('description'),
  created_at: text('created_at').notNull().default('now'),
});

export const book_tags = sqliteTable('book_tags', {
  book_id: text('book_id').notNull(),
  tag_id: text('tag_id').notNull(),
  created_at: text('created_at').notNull().default('now'),
});

export const article_tags = sqliteTable('article_tags', {
  article_id: text('article_id').notNull(),
  tag_id: text('tag_id').notNull(),
  created_at: text('created_at').notNull().default('now'),
});

export const reading_goals = sqliteTable('reading_goals', {
  id: text('id').primaryKey(), // UUID
  year: integer('year').notNull(),
  goal_type: text('goal_type').notNull(),
  target_value: integer('target_value').notNull(),
  current_value: integer('current_value').default(0),
  is_active: integer('is_active').default(1), // SQLite boolean as 0/1
  notes: text('notes'),
  created_at: text('created_at').notNull().default('now'),
  updated_at: text('updated_at').notNull().default('now'),
});

export const reading_streaks = sqliteTable('reading_streaks', {
  id: text('id').primaryKey(), // UUID
  streak_date: text('streak_date').notNull().unique(),
  books_read: integer('books_read').default(0),
  articles_read: integer('articles_read').default(0),
  total_pages: integer('total_pages').default(0),
  total_minutes: integer('total_minutes').default(0),
  mood_rating: integer('mood_rating'),
  notes: text('notes'),
  created_at: text('created_at').notNull().default('now'),
});

export const system_config = sqliteTable('system_config', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  description: text('description'),
  updated_at: text('updated_at').notNull().default('now'),
});

export const data_operations = sqliteTable('data_operations', {
  id: text('id').primaryKey(), // UUID
  operation_type: text('operation_type').notNull(),
  filename: text('filename'),
  records_processed: integer('records_processed'),
  status: text('status').notNull(),
  error_message: text('error_message'),
  created_at: text('created_at').notNull().default('now'),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type PersonalComment = typeof personal_comments.$inferSelect;
export type NewPersonalComment = typeof personal_comments.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type ReadingGoal = typeof reading_goals.$inferSelect;
export type NewReadingGoal = typeof reading_goals.$inferInsert;
export type ReadingStreak = typeof reading_streaks.$inferSelect;
export type NewReadingStreak = typeof reading_streaks.$inferInsert;
